import { calculateEmi, yearlyAmortizationSummary } from "@/lib/calculators/emi";
import { calculateIncomeTax } from "@/lib/calculators/income-tax";

export type PropertyUsage = "self_occupied" | "let_out";

export interface HomeLoanTaxInput {
  loanAmount: number;
  annualInterestRate: number;
  tenureYears: number;
  usage: PropertyUsage;
  annualRentalIncome: number; // only relevant when usage === "let_out"
  isFirstTimeBuyer: boolean;
  stampDutyValue: number; // property value for 80EEA eligibility check
  sanctionedInEligibleWindow: boolean; // loan sanctioned Apr 2019 - Mar 2022, for 80EEA
  annualTaxableIncomeExcludingHomeLoan: number; // used to find marginal slab
}

export interface HomeLoanYearRow {
  year: number;
  interestPaid: number;
  principalPaid: number;
  closingBalance: number;
  section24bDeduction: number;
  section80EEADeduction: number;
  section80CDeduction: number;
  lossSetOffOldRegime: number; // let-out loss set against other income (old regime, capped 2L)
  totalDeductionOldRegime: number;
  totalDeductionNewRegime: number;
  taxSavedOldRegime: number;
  taxSavedNewRegime: number;
}

export interface HomeLoanTaxResult {
  monthlyEmi: number;
  totalInterestOverTenure: number;
  totalPaymentOverTenure: number;
  is80EEAEligible: boolean;
  eightyEEAIneligibilityReason: string | null;
  yearlyBreakdown: HomeLoanYearRow[];
  year1: HomeLoanYearRow;
  totalTaxSavedOldRegimeOverTenure: number;
  totalTaxSavedNewRegimeOverTenure: number;
}

export const SECTION_24B_SELF_OCCUPIED_CAP = 200_000;
export const SECTION_24B_LOSS_SETOFF_CAP = 200_000; // against other income heads, old regime
export const SECTION_80EEA_CAP = 150_000;
export const SECTION_80EEA_STAMP_VALUE_LIMIT = 4_500_000;
export const SECTION_80C_OVERALL_CAP = 150_000;

/**
 * Section 24(b) + 80EEA + 80C home loan tax benefit, modeled year-by-year
 * against the actual EMI amortization schedule.
 *
 * Key rules modeled (FY 2025-26):
 *  - Self-occupied: Section 24(b) interest deduction capped at ₹2,00,000/year,
 *    available ONLY under the old regime (disallowed entirely under the new
 *    regime per Section 115BAC).
 *  - Let-out: full interest is deductible against rental income (no cap),
 *    but if it creates a loss, set-off against other income (salary etc.)
 *    is capped at ₹2,00,000/year under the OLD regime, with the excess
 *    carried forward. Under the NEW regime, the loss can only be set off
 *    against rental income itself (not other heads) — no cross-head set-off.
 *  - Section 80EEA: an additional ₹1,50,000 interest deduction for
 *    first-time buyers of affordable housing (stamp value ≤ ₹45 lakh),
 *    only for loans sanctioned between 1 Apr 2019 and 31 Mar 2022, and
 *    only under the old regime.
 *  - Section 80C: principal repayment up to ₹1,50,000/year, shared with
 *    all other 80C investments, old regime only.
 *
 * This is a simplified model for salaried individuals with one home loan —
 * it doesn't cover co-borrower splits, pre-EMI/under-construction interest,
 * or multiple self-occupied properties (only one is allowed tax-free; a
 * second is deemed let-out).
 */
export function calculateHomeLoanTaxBenefit(input: HomeLoanTaxInput): HomeLoanTaxResult {
  const {
    loanAmount,
    annualInterestRate,
    tenureYears,
    usage,
    annualRentalIncome,
    isFirstTimeBuyer,
    stampDutyValue,
    sanctionedInEligibleWindow,
    annualTaxableIncomeExcludingHomeLoan,
  } = input;

  const emi = calculateEmi({
    principal: loanAmount,
    annualInterestRate,
    tenureMonths: tenureYears * 12,
  });
  const yearly = yearlyAmortizationSummary(emi.amortizationSchedule);

  let is80EEAEligible = true;
  let eightyEEAIneligibilityReason: string | null = null;
  if (!isFirstTimeBuyer) {
    is80EEAEligible = false;
    eightyEEAIneligibilityReason = "Only first-time home buyers qualify for Section 80EEA.";
  } else if (stampDutyValue > SECTION_80EEA_STAMP_VALUE_LIMIT) {
    is80EEAEligible = false;
    eightyEEAIneligibilityReason = "Property stamp duty value exceeds the ₹45 lakh limit for 80EEA.";
  } else if (!sanctionedInEligibleWindow) {
    is80EEAEligible = false;
    eightyEEAIneligibilityReason = "80EEA only applies to loans sanctioned between 1 Apr 2019 and 31 Mar 2022.";
  }

  const yearlyBreakdown: HomeLoanYearRow[] = yearly.map((row) => {
    const { interestPaid, principalPaid, closingBalance, year } = row;

    let section24bDeduction = 0;
    let lossSetOffOldRegime = 0;
    let section80EEADeduction = 0;
    let totalDeductionNewRegime = 0;

    if (usage === "self_occupied") {
      section24bDeduction = Math.min(interestPaid, SECTION_24B_SELF_OCCUPIED_CAP);
      const remainingInterest = Math.max(0, interestPaid - SECTION_24B_SELF_OCCUPIED_CAP);
      section80EEADeduction = is80EEAEligible ? Math.min(remainingInterest, SECTION_80EEA_CAP) : 0;
      totalDeductionNewRegime = 0; // self-occupied interest not deductible under new regime at all
    } else {
      // Let-out: full interest deductible against rental income first.
      const netBeforeSetOff = annualRentalIncome - interestPaid; // can be negative (a loss)
      section24bDeduction = interestPaid; // full interest recognized against house-property income
      if (netBeforeSetOff < 0) {
        lossSetOffOldRegime = Math.min(Math.abs(netBeforeSetOff), SECTION_24B_LOSS_SETOFF_CAP);
      }
      // 80EEA doesn't apply to let-out interest already fully claimed under 24(b)
      section80EEADeduction = 0;
      // New regime: interest deductible only up to rental income — no cross-head loss set-off
      totalDeductionNewRegime = Math.min(interestPaid, Math.max(0, annualRentalIncome));
    }

    const section80CDeduction = Math.min(principalPaid, SECTION_80C_OVERALL_CAP);

    const totalDeductionOldRegime =
      usage === "self_occupied"
        ? section24bDeduction + section80EEADeduction + section80CDeduction
        : lossSetOffOldRegime + section80CDeduction;

    // Tax saved = tax without this deduction − tax with this deduction, at the
    // taxpayer's actual marginal slab (more accurate than a flat rate multiply).
    const baseIncome = annualTaxableIncomeExcludingHomeLoan;
    const oldTaxWithout = calculateIncomeTax(baseIncome, "old", 0).totalTaxPayable;
    const oldTaxWith = calculateIncomeTax(baseIncome, "old", totalDeductionOldRegime).totalTaxPayable;
    const taxSavedOldRegime = Math.max(0, oldTaxWithout - oldTaxWith);

    // New regime doesn't accept "otherDeductions" at all in the underlying
    // engine (by design — new regime disallows Chapter VI-A deductions), so
    // any new-regime benefit here only comes from reducing rental income
    // directly, which we approximate as tax saved at the marginal slab on
    // the deductible interest amount.
    const newTaxWithout = calculateIncomeTax(baseIncome + annualRentalIncome, "new", 0).totalTaxPayable;
    const newTaxWith = calculateIncomeTax(
      baseIncome + Math.max(0, annualRentalIncome - totalDeductionNewRegime),
      "new",
      0
    ).totalTaxPayable;
    const taxSavedNewRegime = usage === "let_out" ? Math.max(0, newTaxWithout - newTaxWith) : 0;

    return {
      year,
      interestPaid,
      principalPaid,
      closingBalance,
      section24bDeduction: usage === "self_occupied" ? section24bDeduction : Math.min(interestPaid, interestPaid),
      section80EEADeduction,
      section80CDeduction,
      lossSetOffOldRegime,
      totalDeductionOldRegime,
      totalDeductionNewRegime,
      taxSavedOldRegime: Math.round(taxSavedOldRegime),
      taxSavedNewRegime: Math.round(taxSavedNewRegime),
    };
  });

  const totalTaxSavedOldRegimeOverTenure = yearlyBreakdown.reduce((s, r) => s + r.taxSavedOldRegime, 0);
  const totalTaxSavedNewRegimeOverTenure = yearlyBreakdown.reduce((s, r) => s + r.taxSavedNewRegime, 0);

  return {
    monthlyEmi: emi.monthlyEmi,
    totalInterestOverTenure: emi.totalInterest,
    totalPaymentOverTenure: emi.totalPayment,
    is80EEAEligible,
    eightyEEAIneligibilityReason,
    yearlyBreakdown,
    year1: yearlyBreakdown[0],
    totalTaxSavedOldRegimeOverTenure,
    totalTaxSavedNewRegimeOverTenure,
  };
}
