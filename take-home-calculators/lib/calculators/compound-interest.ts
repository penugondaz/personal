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
  const ratePerPeriod = r / n;
  const periodsPerMonth = n / 12;

  let balance = principal;
  let totalInterest = 0;
  let totalDeposits = principal;
  const yearlyBreakdown: CompoundInterestResult["yearlyBreakdown"] = [];
  let monthCounter = 0;

  for (let year = 1; year <= years; year++) {
    let yearInterest = 0;
    let yearDeposits = 0;
    for (let month = 1; month <= 12; month++) {
      monthCounter++;
      balance += monthlyAddition;
      yearDeposits += monthlyAddition;
      totalDeposits += monthlyAddition;
      for (let p = 0; p < periodsPerMonth; p++) {
        const interest = balance * ratePerPeriod;
        balance += interest;
        yearInterest += interest;
        totalInterest += interest;
      }
    }
    yearlyBreakdown.push({
      year,
      deposits: Math.round(yearDeposits),
      interest: Math.round(yearInterest),
      balance: Math.round(balance),
    });
  }

  return {
    principal,
    totalDeposits: Math.round(totalDeposits),
    totalInterest: Math.round(totalInterest),
    maturityAmount: Math.round(balance),
    yearlyBreakdown,
  };
}

export const COMPOUNDING_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "Annually" },
  { value: 2, label: "Semi-Annually" },
  { value: 4, label: "Quarterly" },
  { value: 12, label: "Monthly" },
  { value: 365, label: "Daily" },
];
