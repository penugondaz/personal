export type RdCompoundingFrequency = "monthly" | "quarterly";

export interface RdInput {
  monthlyDeposit: number;
  annualInterestRate: number;
  tenureMonths: number;
  compounding?: RdCompoundingFrequency;
}

export interface RdResult {
  monthlyDeposit: number;
  annualInterestRate: number;
  tenureMonths: number;
  totalDeposit: number;
  maturityAmount: number;
  totalInterest: number;
}

/**
 * RD interest in India is conventionally compounded quarterly, applied
 * to each monthly installment for the time it remains in the account.
 * Banks vary slightly in exact day-count conventions; this uses the
 * widely-published approximation: each installment compounds quarterly
 * for the remaining whole quarters until maturity.
 */
export function calculateRd(input: RdInput): RdResult {
  const { monthlyDeposit, annualInterestRate, tenureMonths, compounding = "quarterly" } = input;
  const periodsPerYear = compounding === "monthly" ? 12 : 4;
  const ratePerPeriod = annualInterestRate / 100 / periodsPerYear;

  let maturityAmount = 0;
  for (let depositMonth = 1; depositMonth <= tenureMonths; depositMonth++) {
    const monthsRemaining = tenureMonths - depositMonth + 1;
    const periodsRemaining = monthsRemaining / (12 / periodsPerYear);
    maturityAmount += monthlyDeposit * Math.pow(1 + ratePerPeriod, periodsRemaining);
  }

  maturityAmount = Math.round(maturityAmount);
  const totalDeposit = monthlyDeposit * tenureMonths;

  return {
    monthlyDeposit,
    annualInterestRate,
    tenureMonths,
    totalDeposit,
    maturityAmount,
    totalInterest: maturityAmount - totalDeposit,
  };
}
