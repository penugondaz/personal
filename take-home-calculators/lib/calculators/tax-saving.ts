// take-home-calculators/lib/calculators/tax-saving.ts

import { calculateIncomeTax } from "./income-tax";
import { calculateSalaryBreakup } from "./salary-breakup";

export interface TaxSavingOpportunity {
  section: string;
  name: string;
  maxAmount: number;
  description: string;
  taxSaved: number;
  category: "80C" | "NPS" | "Health" | "HRA" | "Home" | "Other";
}

export interface TaxSavingResult {
  annualCtc: number;
  grossSalary: number;
  currentTaxNew: number;
  currentTaxOld: number;
  betterRegime: "new" | "old";
  opportunities: TaxSavingOpportunity[];
  maxPossibleSavingOld: number;
  taxAfterAllDeductionsOld: number;
  effectiveTaxRateNew: number;
  effectiveTaxRateAfterSaving: number;
  totalMaxDeductions: number;
}

export function calculateTaxSaving(annualCtc: number): TaxSavingResult {
  const breakup = calculateSalaryBreakup({ annualCtc, regime: "new" });
  const grossSalary = breakup.grossSalaryAnnual;

  const taxNew = calculateIncomeTax(grossSalary, "new");
  const taxOldNoDeductions = calculateIncomeTax(grossSalary, "old");

  // Marginal rate for old regime (approximate, for computing tax savings)
  const marginalRate = grossSalary > 1_000_000 ? 0.3 : grossSalary > 500_000 ? 0.2 : 0.05;
  const cessMultiplier = 1.04;

  const opportunities: TaxSavingOpportunity[] = [
    {
      section: "80C",
      name: "80C Investments (ELSS, PPF, LIC, EPF top-up, NSC, etc.)",
      maxAmount: 150_000,
      description:
        "Section 80C covers ELSS mutual funds, PPF deposits, life insurance premiums, NSC, 5-year FD, home loan principal, tuition fees, and EPF voluntary contributions — up to ₹1.5 lakh combined.",
      taxSaved: Math.round(Math.min(150_000, grossSalary) * marginalRate * cessMultiplier),
      category: "80C",
    },
    {
      section: "80CCD(1B)",
      name: "NPS Additional Contribution",
      maxAmount: 50_000,
      description:
        "An extra ₹50,000 deduction for voluntary NPS (National Pension System) contributions — over and above the 80C limit. Only available under the old tax regime.",
      taxSaved: Math.round(50_000 * marginalRate * cessMultiplier),
      category: "NPS",
    },
    {
      section: "80D",
      name: "Health Insurance Premium",
      maxAmount: 75_000,
      description:
        "Up to ₹25,000 for self/family health insurance; up to ₹50,000 additional for parents (₹50,000 if senior citizens). Preventive health check-up of ₹5,000 also counts within the limit.",
      taxSaved: Math.round(Math.min(75_000, grossSalary) * marginalRate * cessMultiplier),
      category: "Health",
    },
    {
      section: "80E",
      name: "Education Loan Interest",
      maxAmount: 0, // No cap
      description:
        "The entire interest paid on an education loan is deductible — no upper limit — for 8 consecutive years starting from the year repayment begins. Only interest qualifies; the principal does not.",
      taxSaved: 0, // Variable
      category: "Other",
    },
    {
      section: "24(b)",
      name: "Home Loan Interest Deduction",
      maxAmount: 200_000,
      description:
        "Up to ₹2 lakh interest deduction per year on a self-occupied house. For rented-out property, the full interest is deductible with no cap (but overall loss from house property is capped at ₹2 lakh for set-off).",
      taxSaved: Math.round(200_000 * marginalRate * cessMultiplier),
      category: "Home",
    },
    {
      section: "80EEA",
      name: "First Home Buyer Additional Interest",
      maxAmount: 150_000,
      description:
        "An additional ₹1.5 lakh deduction on home loan interest for first-time buyers on affordable housing (stamp duty value ≤ ₹45 lakh). This is over and above the ₹2 lakh under Section 24(b).",
      taxSaved: Math.round(150_000 * marginalRate * cessMultiplier),
      category: "Home",
    },
    {
      section: "10(13A) HRA",
      name: "House Rent Allowance Exemption",
      maxAmount: 0, // Variable
      description:
        "Exempt the lower of: actual HRA received, 50% of basic (metro) or 40% (non-metro), or rent paid minus 10% of basic. Only available under the old regime. If your salary has no HRA, you can claim rent under Section 80GG instead.",
      taxSaved: 0, // Variable
      category: "HRA",
    },
    {
      section: "80G",
      name: "Charitable Donations",
      maxAmount: 0,
      description:
        "Donations to approved funds and charities qualify for 50% or 100% deduction (some with a 10% of income cap). PM CARES, National Defence Fund, and certain temples/trusts offer 100% deduction without cap.",
      taxSaved: 0,
      category: "Other",
    },
    {
      section: "80TTA / 80TTB",
      name: "Savings Account / Deposit Interest",
      maxAmount: 10_000,
      description:
        "Up to ₹10,000 deduction on interest from savings accounts (80TTA). Senior citizens get a higher ₹50,000 deduction (80TTB) covering savings, FD, and RD interest combined.",
      taxSaved: Math.round(10_000 * marginalRate * cessMultiplier),
      category: "Other",
    },
    {
      section: "80CCD(2)",
      name: "Employer NPS Contribution",
      maxAmount: Math.round(breakup.grossSalaryAnnual * 0.1),
      description:
        "If your employer contributes to your NPS account, up to 10% of salary (basic + DA) is deductible. This is available even under the new tax regime and doesn't eat into the ₹1.5L 80C limit.",
      taxSaved: Math.round(
        Math.min(Math.round(breakup.basicAnnual * 0.1), grossSalary) * marginalRate * cessMultiplier
      ),
      category: "NPS",
    },
  ];

  // Compute max possible saving under old regime
  const capped80C = 150_000;
  const nps80CCD = 50_000;
  const health = 25_000;
  const totalDeductions = capped80C + nps80CCD + health;

  const taxAfterAllDeductionsOld = calculateIncomeTax(
    Math.max(0, grossSalary - totalDeductions),
    "old"
  );

  const maxPossibleSavingOld = Math.max(
    0,
    taxOldNoDeductions.totalTaxPayable - taxAfterAllDeductionsOld.totalTaxPayable
  );

  const betterRegime: "new" | "old" =
    taxNew.totalTaxPayable <= taxOldNoDeductions.totalTaxPayable ? "new" : "old";

  return {
    annualCtc,
    grossSalary,
    currentTaxNew: taxNew.totalTaxPayable,
    currentTaxOld: taxOldNoDeductions.totalTaxPayable,
    betterRegime,
    opportunities,
    maxPossibleSavingOld,
    taxAfterAllDeductionsOld: taxAfterAllDeductionsOld.totalTaxPayable,
    effectiveTaxRateNew:
      grossSalary > 0
        ? Math.round((taxNew.totalTaxPayable / grossSalary) * 10000) / 100
        : 0,
    effectiveTaxRateAfterSaving:
      grossSalary > 0
        ? Math.round(
            (taxAfterAllDeductionsOld.totalTaxPayable / grossSalary) * 10000
          ) / 100
        : 0,
    totalMaxDeductions: totalDeductions,
  };
}
