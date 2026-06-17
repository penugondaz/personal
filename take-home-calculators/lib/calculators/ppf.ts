export const PPF_INTEREST_RATE = 0.071;
export const PPF_MIN_ANNUAL_DEPOSIT = 500;
export const PPF_MAX_ANNUAL_DEPOSIT = 150_000;
export const PPF_LOCK_IN_YEARS = 15;

export interface PpfProjection {
  totalInvestment: number;
  totalInterest: number;
  maturityAmount: number;
  yearlyBreakdown: { year: number; openingBalance: number; deposit: number; interestEarned: number; closingBalance: number }[];
}

export function projectPpfMaturity(
  annualDeposit: number,
  years: number = PPF_LOCK_IN_YEARS,
  interestRate: number = PPF_INTEREST_RATE
): PpfProjection {
  const clampedDeposit = Math.min(Math.max(annualDeposit, 0), PPF_MAX_ANNUAL_DEPOSIT);

  let balance = 0;
  let totalInterest = 0;
  const yearlyBreakdown: PpfProjection["yearlyBreakdown"] = [];

  for (let year = 1; year <= Math.round(years); year++) {
    const openingBalance = balance;
    balance += clampedDeposit;
    const interestEarned = balance * interestRate;
    balance += interestEarned;
    totalInterest += interestEarned;

    yearlyBreakdown.push({
      year,
      openingBalance: Math.round(openingBalance),
      deposit: clampedDeposit,
      interestEarned: Math.round(interestEarned),
      closingBalance: Math.round(balance),
    });
  }

  return {
    totalInvestment: clampedDeposit * Math.round(years),
    totalInterest: Math.round(totalInterest),
    maturityAmount: Math.round(balance),
    yearlyBreakdown,
  };
}
