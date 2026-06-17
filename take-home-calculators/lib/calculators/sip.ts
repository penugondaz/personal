export interface SipInput {
  monthlyInvestment: number;
  annualReturnRate: number; // percent, e.g. 12
  years: number;
  annualStepUpPercent?: number; // optional yearly increase in SIP amount
}

export interface SipResult {
  monthlyInvestment: number;
  annualReturnRate: number;
  years: number;
  totalInvestment: number;
  totalReturns: number;
  maturityAmount: number;
  yearlyBreakdown: { year: number; investedThisYear: number; cumulativeInvested: number; closingBalance: number }[];
}

/**
 * Standard SIP future-value calculation, simulated month by month rather
 * than using the closed-form annuity formula — this lets us support an
 * optional annual step-up (common request: "increase my SIP 10% every
 * year") without needing a separate formula branch.
 */
export function calculateSip(input: SipInput): SipResult {
  const { monthlyInvestment, annualReturnRate, years, annualStepUpPercent = 0 } = input;
  const monthlyRate = annualReturnRate / 12 / 100;
  const totalMonths = Math.round(years * 12);

  let balance = 0;
  let cumulativeInvested = 0;
  let currentMonthlyInvestment = monthlyInvestment;
  const yearlyBreakdown: SipResult["yearlyBreakdown"] = [];
  let investedThisYear = 0;

  for (let month = 1; month <= totalMonths; month++) {
    balance += currentMonthlyInvestment;
    balance *= 1 + monthlyRate;
    cumulativeInvested += currentMonthlyInvestment;
    investedThisYear += currentMonthlyInvestment;

    if (month % 12 === 0) {
      const year = month / 12;
      yearlyBreakdown.push({
        year,
        investedThisYear: Math.round(investedThisYear),
        cumulativeInvested: Math.round(cumulativeInvested),
        closingBalance: Math.round(balance),
      });
      investedThisYear = 0;
      if (annualStepUpPercent > 0) {
        currentMonthlyInvestment *= 1 + annualStepUpPercent / 100;
      }
    }
  }

  // Handle a non-whole final year (partial year tail)
  if (totalMonths % 12 !== 0) {
    yearlyBreakdown.push({
      year: Math.ceil(totalMonths / 12),
      investedThisYear: Math.round(investedThisYear),
      cumulativeInvested: Math.round(cumulativeInvested),
      closingBalance: Math.round(balance),
    });
  }

  const maturityAmount = Math.round(balance);
  const totalInvestment = Math.round(cumulativeInvested);

  return {
    monthlyInvestment,
    annualReturnRate,
    years,
    totalInvestment,
    totalReturns: maturityAmount - totalInvestment,
    maturityAmount,
    yearlyBreakdown,
  };
}

export interface LumpsumInput {
  principal: number;
  annualReturnRate: number;
  years: number;
}

export interface LumpsumResult {
  principal: number;
  maturityAmount: number;
  totalReturns: number;
}

export function calculateLumpsum(input: LumpsumInput): LumpsumResult {
  const { principal, annualReturnRate, years } = input;
  const maturityAmount = Math.round(principal * Math.pow(1 + annualReturnRate / 100, years));
  return {
    principal,
    maturityAmount,
    totalReturns: maturityAmount - principal,
  };
}
