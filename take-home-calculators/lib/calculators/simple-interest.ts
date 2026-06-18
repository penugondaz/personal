export interface SimpleInterestInput {
  principal: number;
  annualRate: number;
  years: number;
}

export interface SimpleInterestResult {
  principal: number;
  annualRate: number;
  years: number;
  totalInterest: number;
  maturityAmount: number;
  monthlyInterest: number;
}

export function calculateSimpleInterest(input: SimpleInterestInput): SimpleInterestResult {
  const { principal, annualRate, years } = input;
  const totalInterest = Math.round(principal * (annualRate / 100) * years);
  return {
    principal,
    annualRate,
    years,
    totalInterest,
    maturityAmount: principal + totalInterest,
    monthlyInterest: Math.round(totalInterest / (years * 12)),
  };
}
