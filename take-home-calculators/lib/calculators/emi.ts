export type LoanType = "home" | "personal" | "car" | "education" | "business";

export interface EmiInput {
  principal: number;
  annualInterestRate: number; // percent, e.g. 9.5
  tenureMonths: number;
}

export interface AmortizationRow {
  month: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface EmiResult {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: AmortizationRow[];
}

/**
 * Standard reducing-balance EMI formula:
 *   EMI = P × r × (1+r)^n / ((1+r)^n − 1)
 * where r is the monthly interest rate and n is tenure in months.
 */
export function calculateEmi(input: EmiInput): EmiResult {
  const { principal, annualInterestRate, tenureMonths } = input;
  const monthlyRate = annualInterestRate / 12 / 100;

  let monthlyEmi: number;
  if (monthlyRate === 0) {
    monthlyEmi = principal / tenureMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    monthlyEmi = (principal * monthlyRate * factor) / (factor - 1);
  }
  monthlyEmi = Math.round(monthlyEmi);

  const amortizationSchedule: AmortizationRow[] = [];
  let remainingBalance = principal;

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPaid = Math.round(remainingBalance * monthlyRate);
    let principalPaid = monthlyEmi - interestPaid;
    if (month === tenureMonths) {
      // Last installment absorbs any rounding drift so the balance hits exactly 0
      principalPaid = remainingBalance;
    }
    remainingBalance = Math.max(0, Math.round(remainingBalance - principalPaid));

    amortizationSchedule.push({
      month,
      emi: month === tenureMonths ? principalPaid + interestPaid : monthlyEmi,
      principalPaid,
      interestPaid,
      remainingBalance,
    });
  }

  const totalPayment = amortizationSchedule.reduce((sum, row) => sum + row.emi, 0);
  const totalInterest = totalPayment - principal;

  return {
    principal,
    annualInterestRate,
    tenureMonths,
    monthlyEmi,
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    amortizationSchedule,
  };
}

export function yearlyAmortizationSummary(
  schedule: AmortizationRow[]
): { year: number; principalPaid: number; interestPaid: number; closingBalance: number }[] {
  const yearly: Record<number, { principalPaid: number; interestPaid: number; closingBalance: number }> = {};

  schedule.forEach((row) => {
    const year = Math.ceil(row.month / 12);
    if (!yearly[year]) yearly[year] = { principalPaid: 0, interestPaid: 0, closingBalance: 0 };
    yearly[year].principalPaid += row.principalPaid;
    yearly[year].interestPaid += row.interestPaid;
    yearly[year].closingBalance = row.remainingBalance;
  });

  return Object.entries(yearly).map(([year, data]) => ({
    year: Number(year),
    principalPaid: Math.round(data.principalPaid),
    interestPaid: Math.round(data.interestPaid),
    closingBalance: data.closingBalance,
  }));
}

export const LOAN_TYPE_DEFAULTS: Record<LoanType, { label: string; defaultRate: number; defaultTenureMonths: number }> = {
  home: { label: "Home Loan", defaultRate: 8.5, defaultTenureMonths: 240 },
  personal: { label: "Personal Loan", defaultRate: 12, defaultTenureMonths: 36 },
  car: { label: "Car Loan", defaultRate: 9, defaultTenureMonths: 60 },
  education: { label: "Education Loan", defaultRate: 10, defaultTenureMonths: 84 },
  business: { label: "Business Loan", defaultRate: 13, defaultTenureMonths: 60 },
};
