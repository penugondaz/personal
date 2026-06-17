export type CompoundingFrequency = "monthly" | "quarterly" | "half_yearly" | "annually";

export interface FdInput {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  compounding: CompoundingFrequency;
}

export interface FdResult {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  compounding: CompoundingFrequency;
  maturityAmount: number;
  totalInterest: number;
}

const COMPOUNDING_PERIODS_PER_YEAR: Record<CompoundingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  half_yearly: 2,
  annually: 1,
};

/**
 * Standard compound interest: A = P × (1 + r/n)^(n×t)
 * Indian bank FDs most commonly compound quarterly.
 */
export function calculateFd(input: FdInput): FdResult {
  const { principal, annualInterestRate, tenureMonths, compounding } = input;
  const n = COMPOUNDING_PERIODS_PER_YEAR[compounding];
  const years = tenureMonths / 12;
  const r = annualInterestRate / 100;

  const maturityAmount = Math.round(principal * Math.pow(1 + r / n, n * years));

  return {
    principal,
    annualInterestRate,
    tenureMonths,
    compounding,
    maturityAmount,
    totalInterest: maturityAmount - principal,
  };
}

export const COMPOUNDING_LABELS: Record<CompoundingFrequency, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  half_yearly: "Half-Yearly",
  annually: "Annually",
};
