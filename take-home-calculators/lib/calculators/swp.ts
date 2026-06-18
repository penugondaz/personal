export interface SwpInput {
  initialCorpus: number;
  monthlyWithdrawal: number;
  expectedAnnualReturn: number;
  years: number;
}

export interface SwpResult {
  initialCorpus: number;
  totalWithdrawn: number;
  remainingCorpus: number;
  totalReturnsEarned: number;
  corpusExhaustedMonth: number | null;
  yearlyBreakdown: { year: number; withdrawn: number; returnsEarned: number; closingBalance: number }[];
}

export function calculateSwp(input: SwpInput): SwpResult {
  const { initialCorpus, monthlyWithdrawal, expectedAnnualReturn, years } = input;
  const monthlyRate = expectedAnnualReturn / 12 / 100;
  const totalMonths = years * 12;

  let balance = initialCorpus;
  let totalWithdrawn = 0;
  let totalReturns = 0;
  let corpusExhaustedMonth: number | null = null;
  const yearlyBreakdown: SwpResult["yearlyBreakdown"] = [];
  let yearWithdrawn = 0;
  let yearReturns = 0;

  for (let month = 1; month <= totalMonths; month++) {
    const returns = balance * monthlyRate;
    balance += returns;
    totalReturns += returns;
    yearReturns += returns;

    const withdrawal = Math.min(monthlyWithdrawal, Math.max(0, balance));
    balance -= withdrawal;
    totalWithdrawn += withdrawal;
    yearWithdrawn += withdrawal;

    if (balance <= 0 && corpusExhaustedMonth === null) {
      corpusExhaustedMonth = month;
      balance = 0;
    }

    if (month % 12 === 0) {
      yearlyBreakdown.push({
        year: month / 12,
        withdrawn: Math.round(yearWithdrawn),
        returnsEarned: Math.round(yearReturns),
        closingBalance: Math.round(Math.max(0, balance)),
      });
      yearWithdrawn = 0;
      yearReturns = 0;
    }
  }

  if (totalMonths % 12 !== 0) {
    yearlyBreakdown.push({
      year: Math.ceil(totalMonths / 12),
      withdrawn: Math.round(yearWithdrawn),
      returnsEarned: Math.round(yearReturns),
      closingBalance: Math.round(Math.max(0, balance)),
    });
  }

  return {
    initialCorpus,
    totalWithdrawn: Math.round(totalWithdrawn),
    remainingCorpus: Math.round(Math.max(0, balance)),
    totalReturnsEarned: Math.round(totalReturns),
    corpusExhaustedMonth,
    yearlyBreakdown,
  };
}
