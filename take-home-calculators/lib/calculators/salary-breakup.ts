/**
 * CTC → In-Hand Salary breakup orchestrator.
 *
 * This is the core calculation behind the site's highest-volume keyword
 * cluster ("X lpa in hand salary", "ctc to in hand calculator"). It
 * composes the EPF, income-tax, and professional-tax modules into one
 * monthly take-home figure.
 *
 * IMPORTANT — there is no single statutory formula for "salary breakup."
 * Every company structures CTC differently (basic %, HRA %, whether
 * gratuity/employer-PF/bonus are included in CTC, special allowance as a
 * balancing figure, etc.). This module encodes a REPRESENTATIVE, commonly
 * used structure for Indian private-sector salaries — useful for
 * estimation and the dominant search intent ("how much will I actually
 * get"), but it is explicitly NOT a guarantee of what any specific
 * employer will pay. Every page using this must disclose that assumption
 * (see `breakupAssumptions` returned below — surface it in the UI).
 */

import { calculatePfBreakup, type PfWageCeilingMode } from "./epf";
import { calculateIncomeTax, type TaxRegime, type IncomeTaxResult } from "./income-tax";
import { calculateProfessionalTax, type ProfessionalTaxState, type Gender } from "./professional-tax";

export interface SalaryBreakupInput {
  /** Annual CTC in rupees, e.g. 1_000_000 for ₹10 LPA. */
  annualCtc: number;
  regime?: TaxRegime;
  pfWageCeilingMode?: PfWageCeilingMode;
  professionalTaxState?: ProfessionalTaxState;
  gender?: Gender;
  /** Old-regime-only deductions (80C, 80D, HRA exemption, etc.), annual. */
  oldRegimeDeductions?: number;
  /**
   * Fraction of CTC treated as Basic salary. Common industry range is
   * 40-50%. Defaults to 40%, a widely used baseline for mid-size/large
   * private-sector employers.
   */
  basicPercentOfCtc?: number;
  /** Fraction of Basic treated as HRA. Common range 40-50% of basic
   *  (metro cities often use 50%). Used for context only — this module
   *  does not compute HRA tax exemption; see the dedicated HRA calculator
   *  for that. */
  hraPercentOfBasic?: number;
  /** Whether employer PF + gratuity are assumed already included within
   *  the stated CTC (almost always true in Indian "CTC" terminology) vs
   *  added on top. Defaults to true. */
  employerContributionsIncludedInCtc?: boolean;
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

// Gratuity is statutorily ~4.81% of basic (15 days' basic per year of
// service ÷ 26 working days × 12 months ≈ 4.81%), commonly reserved as a
// notional CTC component even though it's only paid out on exit after 5+
// years of service (Payment of Gratuity Act, 1972).
const GRATUITY_RATE_OF_BASIC = 0.0481;

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
  } = input;

  const basicAnnual = annualCtc * basicPercentOfCtc;
  const hraAnnual = basicAnnual * hraPercentOfBasic;
  const gratuityAnnual = basicAnnual * GRATUITY_RATE_OF_BASIC;

  const basicMonthly = basicAnnual / 12;
  const pfBreakup = calculatePfBreakup(basicMonthly, pfWageCeilingMode);
  const employerPfAnnual = pfBreakup.totalEmployerContribution * 12;
  const employeePfAnnual = pfBreakup.employeeContribution * 12;

  // Special allowance is the balancing figure: whatever's left of CTC
  // after basic, HRA, employer PF, and gratuity are accounted for. This
  // mirrors how most Indian payroll structures actually work — special
  // allowance absorbs the remainder rather than being independently fixed.
  const specialAllowanceAnnual = Math.max(
    0,
    annualCtc - basicAnnual - hraAnnual - employerPfAnnual - gratuityAnnual
  );

  // Gross salary = what shows as taxable salary income, i.e. CTC minus
  // the employer's own contributions (employer PF, gratuity) which the
  // employee never receives as cash and which aren't part of "Income from
  // Salary" for tax purposes.
  const grossSalaryAnnual = basicAnnual + hraAnnual + specialAllowanceAnnual;
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
    ],
  };
}
