import { calculatePfBreakup, type PfWageCeilingMode } from "./epf";
import { calculateIncomeTax, type TaxRegime, type IncomeTaxResult } from "./income-tax";
import { calculateProfessionalTax, type ProfessionalTaxState, type Gender } from "./professional-tax";

export interface SalaryBreakupInput {
  annualCtc: number;
  regime?: TaxRegime;
  pfWageCeilingMode?: PfWageCeilingMode;
  professionalTaxState?: ProfessionalTaxState;
  gender?: Gender;
  oldRegimeDeductions?: number;
  basicPercentOfCtc?: number;
  hraPercentOfBasic?: number;
  employerContributionsIncludedInCtc?: boolean;
  /**
   * Employer NPS contribution as a % of basic salary. 0 (default) means the
   * employer doesn't offer this — most CTC structures don't. When set, it's
   * carved out of CTC the same way employer PF is (not paid to you monthly).
   * Under Section 80CCD(2), contributions up to 10% of basic are excluded
   * from taxable salary in BOTH tax regimes; only the amount above that
   * 10% cap (if the employer contributes more) is added back as taxable.
   */
  employerNpsPercentOfBasic?: number;
}

export interface SalaryBreakupResult {
  annualCtc: number;
  monthlyCtc: number;
  basicAnnual: number;
  basicMonthly: number;
  hraAnnual: number;
  hraMonthly: number;
  employerPfAnnual: number;
  employerPfMonthly: number;
  gratuityAnnual: number;
  gratuityMonthly: number;
  employerNpsAnnual: number;
  employerNpsMonthly: number;
  employerNpsTaxableExcessAnnual: number;
  specialAllowanceAnnual: number;
  specialAllowanceMonthly: number;
  grossSalaryAnnual: number;
  grossSalaryMonthly: number;
  employeePfAnnual: number;
  employeePfMonthly: number;
  professionalTaxAnnual: number;
  professionalTaxMonthly: number;
  incomeTax: IncomeTaxResult;
  incomeTaxMonthly: number;
  inHandAnnual: number;
  inHandMonthly: number;
  breakupAssumptions: string[];
}

const DEFAULT_BASIC_PERCENT = 0.4;
const DEFAULT_HRA_PERCENT_OF_BASIC = 0.5;
const GRATUITY_RATE_OF_BASIC = 0.0481;
// Section 80CCD(2): employer NPS contribution is deductible up to this % of
// basic salary for private-sector employees (both tax regimes).
const SECTION_80CCD2_CAP_PERCENT_OF_BASIC = 0.1;

export function calculateSalaryBreakup(input: SalaryBreakupInput): SalaryBreakupResult {
  const {
    annualCtc,
    regime = "new",
    pfWageCeilingMode = "uncapped_actual_basic",
    professionalTaxState = "none",
    gender = "male",
    oldRegimeDeductions = 0,
    basicPercentOfCtc = DEFAULT_BASIC_PERCENT,
    hraPercentOfBasic = DEFAULT_HRA_PERCENT_OF_BASIC,
    employerNpsPercentOfBasic = 0,
  } = input;

  const basicAnnual = annualCtc * basicPercentOfCtc;
  const hraAnnual = basicAnnual * hraPercentOfBasic;
  const gratuityAnnual = basicAnnual * GRATUITY_RATE_OF_BASIC;
  const employerNpsAnnual = basicAnnual * Math.max(0, employerNpsPercentOfBasic);
  const employerNpsDeductibleCap = basicAnnual * SECTION_80CCD2_CAP_PERCENT_OF_BASIC;
  const employerNpsTaxableExcessAnnual = Math.max(0, employerNpsAnnual - employerNpsDeductibleCap);

  const basicMonthly = basicAnnual / 12;
  const pfBreakup = calculatePfBreakup(basicMonthly, pfWageCeilingMode);
  const employerPfAnnual = pfBreakup.totalEmployerContribution * 12;
  const employeePfAnnual = pfBreakup.employeeContribution * 12;

  const specialAllowanceAnnual = Math.max(
    0,
    annualCtc - basicAnnual - hraAnnual - employerPfAnnual - gratuityAnnual - employerNpsAnnual
  );

  // Only the portion of employer NPS above the 80CCD(2) cap counts as
  // taxable salary — the rest is excluded, same tax treatment as employer PF.
  const grossSalaryAnnual = basicAnnual + hraAnnual + specialAllowanceAnnual + employerNpsTaxableExcessAnnual;
  const grossSalaryMonthly = grossSalaryAnnual / 12;

  const incomeTax = calculateIncomeTax(grossSalaryAnnual, regime, oldRegimeDeductions);
  const incomeTaxMonthly = incomeTax.totalTaxPayable / 12;

  const pt = calculateProfessionalTax(grossSalaryMonthly, professionalTaxState, gender);

  const inHandMonthly =
    grossSalaryMonthly - pfBreakup.employeeContribution - pt.monthlyAmount - incomeTaxMonthly;
  const inHandAnnual = inHandMonthly * 12;

  return {
    annualCtc,
    monthlyCtc: annualCtc / 12,
    basicAnnual,
    basicMonthly,
    hraAnnual,
    hraMonthly: hraAnnual / 12,
    employerPfAnnual,
    employerPfMonthly: employerPfAnnual / 12,
    gratuityAnnual,
    gratuityMonthly: gratuityAnnual / 12,
    employerNpsAnnual,
    employerNpsMonthly: employerNpsAnnual / 12,
    employerNpsTaxableExcessAnnual,
    specialAllowanceAnnual,
    specialAllowanceMonthly: specialAllowanceAnnual / 12,
    grossSalaryAnnual,
    grossSalaryMonthly,
    employeePfAnnual,
    employeePfMonthly: pfBreakup.employeeContribution,
    professionalTaxAnnual: pt.annualAmount,
    professionalTaxMonthly: pt.monthlyAmount,
    incomeTax,
    incomeTaxMonthly,
    inHandAnnual,
    inHandMonthly,
    breakupAssumptions: [
      `Basic salary assumed at ${Math.round(basicPercentOfCtc * 100)}% of CTC (varies by employer, typically 35-50%).`,
      `HRA assumed at ${Math.round(hraPercentOfBasic * 100)}% of basic (varies by city and employer policy).`,
      "Gratuity reserved at ~4.81% of basic, payable only after 5+ years of continuous service.",
      pfWageCeilingMode === "capped_15000"
        ? "Employee PF capped at the ₹15,000/month statutory wage ceiling."
        : "Employee PF calculated on full actual basic salary (uncapped) — the common practice at most private employers.",
      "Special allowance is treated as a balancing figure absorbing the remainder of CTC.",
      "Actual in-hand salary will vary by employer's specific CTC structure, bonus/variable pay components, and any additional benefits not modeled here.",
      ...(employerNpsAnnual > 0
        ? [
            `Employer NPS contribution of ${Math.round(
              employerNpsPercentOfBasic * 100
            )}% of basic is included. Up to 10% of basic is tax-free under Section 80CCD(2) in both regimes; any amount above that is added back as taxable salary.`,
          ]
        : []),
    ],
  };
}
