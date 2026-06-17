export interface NpsInput {
  currentAge: number;
  retirementAge: number;
  monthlyContribution: number;
  expectedAnnualReturn: number;
  annuityPurchasePercent: number; // % of corpus used to buy annuity at retirement (min 40% mandated)
  annuityReturnRate: number; // assumed annual annuity payout rate
}

export interface NpsResult {
  yearsToRetirement: number;
  totalContribution: number;
  corpusAtRetirement: number;
  lumpsumWithdrawal: number;
  annuityCorpus: number;
  estimatedMonthlyPension: number;
}

export const NPS_MIN_ANNUITY_PERCENT = 40;

/**
 * NPS corpus accumulation is modeled like a SIP. At retirement, current
 * rules require at least 40% of the corpus to be used to purchase an
 * annuity (the source of your monthly pension); the rest can be
 * withdrawn as a tax-free lumpsum. Annuity payout rates are set by the
 * insurer at the time of purchase — this calculator uses a
 * user-supplied assumed rate since NPS itself doesn't fix this number.
 */
export function calculateNps(input: NpsInput): NpsResult {
  const {
    currentAge,
    retirementAge,
    monthlyContribution,
    expectedAnnualReturn,
    annuityPurchasePercent,
    annuityReturnRate,
  } = input;

  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const totalMonths = yearsToRetirement * 12;
  const monthlyRate = expectedAnnualReturn / 12 / 100;

  let corpus = 0;
  for (let month = 1; month <= totalMonths; month++) {
    corpus += monthlyContribution;
    corpus *= 1 + monthlyRate;
  }
  corpus = Math.round(corpus);

  const clampedAnnuityPercent = Math.max(NPS_MIN_ANNUITY_PERCENT, annuityPurchasePercent);
  const annuityCorpus = Math.round(corpus * (clampedAnnuityPercent / 100));
  const lumpsumWithdrawal = corpus - annuityCorpus;
  const estimatedMonthlyPension = Math.round((annuityCorpus * (annuityReturnRate / 100)) / 12);

  return {
    yearsToRetirement,
    totalContribution: monthlyContribution * totalMonths,
    corpusAtRetirement: corpus,
    lumpsumWithdrawal,
    annuityCorpus,
    estimatedMonthlyPension,
  };
}
