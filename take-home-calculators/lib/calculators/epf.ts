export type PfWageCeilingMode = "capped_15000" | "uncapped_actual_basic";

export const PF_RATE = 0.12;
export const EPS_RATE = 0.0833;
export const EPF_EMPLOYER_SHARE_RATE = 0.0367;
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

export function calculatePfBreakup(
  basicPlusDA: number,
  mode: PfWageCeilingMode = "uncapped_actual_basic"
): PfBreakup {
  const pfWageBase = mode === "capped_15000" ? Math.min(basicPlusDA, PF_WAGE_CEILING) : basicPlusDA;

  const employeeContribution = Math.round(pfWageBase * PF_RATE);

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

export const VPF_MAX_PERCENT_OF_BASIC = 1.0;
export const VPF_TAXABLE_INTEREST_THRESHOLD = 250_000;

export interface VpfContribution {
  monthlyVpfContribution: number;
  annualEmployeeContribution: number;
  exceedsTaxableThreshold: boolean;
}

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
