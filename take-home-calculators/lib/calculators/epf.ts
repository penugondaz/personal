/**
 * EPF (Employees' Provident Fund) contribution logic — rules current as
 * of June 2026, FY 2025-26.
 *
 * Source-verified facts (update if EPFO revises these):
 *  - Statutory contribution rate: 12% of (Basic + DA) from both employee
 *    and employer, 10% for establishments with <20 employees or notified
 *    industries (beedi, jute, brick, coir, guar gum) — not modeled here.
 *  - Statutory wage ceiling: ₹15,000/month (unchanged since 2014; a hike
 *    to ₹21,000 was under government review as of mid-2026 but NOT yet
 *    in effect — do not assume it's live without re-checking).
 *  - Employer's 12% splits into 3.67% → employee's own EPF account,
 *    8.33% → EPS (pension), EPS portion capped at the ₹15,000 ceiling
 *    (so EPS contribution maxes out at ₹1,250/month) regardless of mode.
 *  - EPF interest rate FY 2025-26: 8.25% p.a., compounded monthly,
 *    credited annually.
 *
 * In practice many private employers either cap PF wages at ₹15,000
 * (statutory minimum compliance) or apply 12% on the FULL basic salary
 * uncapped (common at mid-size and large companies, often a policy
 * choice or contractual term). Both are legitimate and widespread, so
 * this calculator exposes `wageCeilingMode` rather than guessing.
 */

export type PfWageCeilingMode = "capped_15000" | "uncapped_actual_basic";

export const PF_RATE = 0.12;
export const EPS_RATE = 0.0833;
export const EPF_EMPLOYER_SHARE_RATE = 0.0367; // 12% - 8.33% = 3.67%
export const PF_WAGE_CEILING = 15_000;
export const EPF_INTEREST_RATE_FY2025_26 = 0.0825;

export interface PfBreakup {
  pfWageBase: number;
  employeeContribution: number;
  employerEpfContribution: number;
  employerEpsContribution: number;
  totalEmployerContribution: number;
  totalMonthlyPf: number;
}

/**
 * Computes monthly EPF contributions from a monthly Basic + DA figure.
 * @param basicPlusDA Monthly basic salary + dearness allowance (PF is
 *   calculated on this base only — HRA, special allowance, bonuses are
 *   excluded by law).
 */
export function calculatePfBreakup(
  basicPlusDA: number,
  mode: PfWageCeilingMode = "uncapped_actual_basic"
): PfBreakup {
  const pfWageBase = mode === "capped_15000" ? Math.min(basicPlusDA, PF_WAGE_CEILING) : basicPlusDA;

  const employeeContribution = Math.round(pfWageBase * PF_RATE);

  // EPS is ALWAYS capped at the ₹15,000 ceiling regardless of mode —
  // this is a separate statutory rule from the employee-side wage base.
  const epsWageBase = Math.min(basicPlusDA, PF_WAGE_CEILING);
  const employerEpsContribution = Math.round(epsWageBase * EPS_RATE);
  const employerEpfContribution = Math.round(pfWageBase * EPF_EMPLOYER_SHARE_RATE);

  return {
    pfWageBase,
    employeeContribution,
    employerEpfContribution,
    employerEpsContribution,
    totalEmployerContribution: employerEpfContribution + employerEpsContribution,
    totalMonthlyPf: employeeContribution + employerEpfContribution + employerEpsContribution,
  };
}

/**
 * Voluntary Provident Fund (VPF) — an employee-only top-up on the same
 * EPF account, same interest rate, no employer match. Rules verified
 * June 2026:
 *  - Up to 100% of (Basic + DA) can be voluntarily contributed, on top
 *    of the mandatory 12% EPF contribution.
 *  - Same interest rate as EPF (8.25% p.a. for FY 2025-26).
 *  - 5-year lock-in for tax-free withdrawal of VPF contributions.
 *  - Interest on the COMBINED employee EPF + VPF contributions exceeding
 *    ₹2.5 lakh in a financial year becomes taxable (only the interest on
 *    the excess, not the principal).
 */
export const VPF_MAX_PERCENT_OF_BASIC = 1.0; // 100%
export const VPF_TAXABLE_INTEREST_THRESHOLD = 250_000; // combined EPF+VPF employee contribution/year

export interface VpfContribution {
  monthlyVpfContribution: number;
  annualEmployeeContribution: number; // mandatory EPF (employee side) + VPF combined
  exceedsTaxableThreshold: boolean;
}

/**
 * Computes the monthly VPF contribution from a chosen percentage of
 * Basic + DA, and flags whether the combined annual employee EPF + VPF
 * contribution crosses the ₹2.5L threshold above which interest on the
 * excess becomes taxable.
 *
 * @param basicPlusDA Monthly basic salary + dearness allowance.
 * @param vpfPercent Voluntary contribution as a fraction of basicPlusDA
 *   (e.g. 0.2 for 20%), in ADDITION to the mandatory 12% EPF.
 * @param mandatoryEpfEmployeeContribution Monthly mandatory EPF employee
 *   contribution, typically from calculatePfBreakup().employeeContribution.
 */
export function calculateVpfContribution(
  basicPlusDA: number,
  vpfPercent: number,
  mandatoryEpfEmployeeContribution: number
): VpfContribution {
  const clampedPercent = Math.min(Math.max(0, vpfPercent), VPF_MAX_PERCENT_OF_BASIC);
  const monthlyVpfContribution = Math.round(basicPlusDA * clampedPercent);
  const annualEmployeeContribution = (mandatoryEpfEmployeeContribution + monthlyVpfContribution) * 12;

  return {
    monthlyVpfContribution,
    annualEmployeeContribution,
    exceedsTaxableThreshold: annualEmployeeContribution > VPF_TAXABLE_INTEREST_THRESHOLD,
  };
}

/**
 * Projects EPF maturity value via monthly compounding, used by the
 * standalone EPF calculator (distinct from the salary-breakup use above).
 * Interest compounds monthly using EPFO's actual annual-rate / 12 method
 * applied to the running monthly balance — a reasonable approximation of
 * EPFO's real (more complex) running-balance method.
 */
export function projectEpfMaturity(
  monthlyEmployeeContribution: number,
  monthlyEmployerContribution: number,
  years: number,
  annualInterestRate: number = EPF_INTEREST_RATE_FY2025_26
): { totalContribution: number; totalInterest: number; maturityAmount: number } {
  const monthlyRate = annualInterestRate / 12;
  const totalMonths = Math.round(years * 12);
  const monthlyContribution = monthlyEmployeeContribution + monthlyEmployerContribution;

  let balance = 0;
  let totalInterest = 0;
  for (let m = 0; m < totalMonths; m++) {
    balance += monthlyContribution;
    const interest = balance * monthlyRate;
    totalInterest += interest;
    balance += interest;
  }

  return {
    totalContribution: monthlyContribution * totalMonths,
    totalInterest: Math.round(totalInterest),
    maturityAmount: Math.round(balance),
  };
}
