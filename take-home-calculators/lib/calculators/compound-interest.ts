export interface CompoundInterestInput {
  principal: number;
  annualRate: number;
  years: number;
  compoundingPerYear: number; // 1=annually, 2=semi, 4=quarterly, 12=monthly, 365=daily
  monthlyAddition?: number;
}

export interface CompoundInterestResult {
  principal: number;
  totalDeposits: number;
  totalInterest: number;
  maturityAmount: number;
  yearlyBreakdown: { year: number; deposits: number; interest: number; balance: number }[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { principal, annualRate, years, compoundingPerYear, monthlyAddition = 0 } = input;
  const r = annualRate / 100;
  const n = compoundingPerYear;

  let balance = principal;
  let totalDeposits = principal;
  let totalInterest = 0;
  const yearlyBreakdown: CompoundInterestResult["yearlyBreakdown"] = [];

  // Strategy: simulate period by period within each year
  // For each compounding period, add any monthly additions that fall within it,
  // then apply compounding interest.
  // We work at the compounding-period level to avoid the fraction-periods-per-month bug.

  const totalPeriods = years * n;
  const periodsPerMonth = n / 12; // may be fractional (e.g. 1/12 for annual)

  // Accumulate monthly additions into periods correctly
  // Instead of simulating at month level, simulate at period level:
  // monthly addition is spread over n/12 periods per month → per period addition = monthlyAddition * 12 / n
  const additionPerPeriod = monthlyAddition * 12 / n;
  const ratePerPeriod = r / n;

  let yearDeposits = 0;
  let yearOpeningBalance = balance;

  for (let period = 1; period <= totalPeriods; period++) {
    // Add the pro-rated monthly addition for this period
    balance += additionPerPeriod;
    totalDeposits += additionPerPeriod;
    yearDeposits += additionPerPeriod;

    // Apply compound interest for this period
    const interest = balance * ratePerPeriod;
    balance += interest;
    totalInterest += interest;

    // At end of each year, record breakdown
    if (period % n === 0) {
      const year = period / n;
      yearlyBreakdown.push({
        year,
        deposits: Math.round(yearDeposits),
        interest: Math.round(balance - yearOpeningBalance - yearDeposits),
        balance: Math.round(balance),
      });
      yearDeposits = 0;
      yearOpeningBalance = balance;
    }
  }

  return {
    principal,
    totalDeposits: Math.round(totalDeposits),
    totalInterest: Math.round(balance - principal - (totalDeposits - principal)),
    maturityAmount: Math.round(balance),
    yearlyBreakdown,
  };
}

export const COMPOUNDING_OPTIONS: { value: number; label: string }[] = [
  { value: 1,   label: "Annually" },
  { value: 2,   label: "Semi-Annually" },
  { value: 4,   label: "Quarterly" },
  { value: 12,  label: "Monthly" },
  { value: 365, label: "Daily" },
];
