/**
 * PPF (Public Provident Fund) calculation logic — rules verified June
 * 2026, FY 2025-26 / FY 2026-27 (Q1 rate unchanged into the new fiscal
 * year as of the most recent government notification).
 *
 * Source-verified facts (update each quarter — PPF rate is reviewed
 * quarterly by the government, unlike EPF's annual review):
 *  - Interest rate: 7.1% p.a., compounded ANNUALLY (not monthly, unlike
 *    EPF). Interest is computed monthly on the lowest balance between
 *    the 5th and last day of each month, but only credited to the
 *    account once a year, at year-end.
 *  - Minimum annual deposit: ₹500. Maximum: ₹1,50,000 per financial year
 *    (across self + any minor accounts combined). Deposits beyond this
 *    don't earn interest and aren't eligible for Section 80C benefit.
 *  - Lock-in: 15 years, extendable thereafter in blocks of 5 years.
 *  - Tax status: EEE (Exempt-Exempt-Exempt) — contributions deductible
 *    under Section 80C (old regime only), interest tax-free, maturity
 *    tax-free.
 *  - No employer contribution exists for PPF; it's a self-funded
 *    individual scheme, unlike EPF.
 */

export const PPF_INTEREST_RATE = 0.071;
export const PPF_MIN_ANNUAL_DEPOSIT = 500;
export const PPF_MAX_ANNUAL_DEPOSIT = 150_000;
export const PPF_LOCK_IN_YEARS = 15;

export interface PpfProjection {
  totalInvestment: number;
  totalInterest: number;
  maturityAmount: number;
  /** Year-by-year running balance, useful for a chart or year-by-year table. */
  yearlyBreakdown: { year: number; openingBalance: number; deposit: number; interestEarned: number; closingBalance: number }[];
}

/**
 * Projects PPF maturity value with annual compounding — simpler than
 * EPF's monthly compounding since PPF interest is credited once a year.
 *
 * @param annualDeposit Annual contribution in rupees. Values outside
 *   ₹500–₹1,50,000 are clamped, since deposits outside that range either
 *   aren't accepted (below min) or don't earn interest/80C benefit on
 *   the excess (above max).
 * @param years Investment horizon. Defaults to the standard 15-year
 *   lock-in; pass a larger value to model extension blocks.
 */
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
