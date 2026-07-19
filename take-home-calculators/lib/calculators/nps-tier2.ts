export interface NpsTier2Input {
  investmentMode: "sip" | "lumpsum";
  monthlyContribution: number; // used when mode === "sip"
  lumpsumAmount: number; // used when mode === "lumpsum"
  expectedAnnualReturn: number;
  investmentHorizonYears: number;
  isCentralGovtEmployee: boolean; // only central govt employees get an 80C benefit on Tier 2
  marginalTaxRatePercent: number; // for estimating tax on withdrawal gains
}

export interface NpsTier2YearRow {
  year: number;
  invested: number;
  corpus: number;
}

export interface NpsTier2Result {
  totalInvested: number;
  corpusAtEnd: number;
  totalGains: number;
  estimatedTaxOnGainsAtWithdrawal: number;
  netCorpusAfterTax: number;
  eightyCBenefitAvailable: boolean;
  yearlyBreakdown: NpsTier2YearRow[];
}

/**
 * NPS Tier 2 is a voluntary, non-retirement investment account attached
 * to your NPS Tier 1 account. Unlike Tier 1, it has:
 *  - No lock-in — withdraw anytime, any amount.
 *  - No mandatory annuity purchase at any age.
 *  - No Section 80CCD(1B) deduction for private-sector employees.
 *    Only CENTRAL GOVERNMENT employees get an 80C deduction (within the
 *    overall ₹1.5 lakh cap) on Tier 2 contributions, and only if they
 *    accept a mandatory 3-year lock-in on that specific contribution.
 *  - Gains are taxed at your income tax slab rate on withdrawal (no LTCG/
 *    STCG concessional rate, unlike equity mutual funds), since Tier 2
 *    doesn't get the same tax treatment as Tier 1 or equity funds.
 *
 * Growth here is modeled the same way as a SIP/lumpsum mutual fund
 * investment — this is an approximation, since actual Tier 2 returns
 * depend on which underlying scheme (equity/corporate debt/govt bonds)
 * you allocate to.
 */
export function calculateNpsTier2(input: NpsTier2Input): NpsTier2Result {
  const {
    investmentMode,
    monthlyContribution,
    lumpsumAmount,
    expectedAnnualReturn,
    investmentHorizonYears,
    isCentralGovtEmployee,
    marginalTaxRatePercent,
  } = input;

  const monthlyRate = expectedAnnualReturn / 12 / 100;
  const totalMonths = investmentHorizonYears * 12;

  const yearlyBreakdown: NpsTier2YearRow[] = [];
  let corpus = investmentMode === "lumpsum" ? lumpsumAmount : 0;
  let invested = investmentMode === "lumpsum" ? lumpsumAmount : 0;

  for (let month = 1; month <= totalMonths; month++) {
    if (investmentMode === "sip") {
      corpus += monthlyContribution;
      invested += monthlyContribution;
    }
    corpus *= 1 + monthlyRate;

    if (month % 12 === 0) {
      yearlyBreakdown.push({
        year: month / 12,
        invested: Math.round(invested),
        corpus: Math.round(corpus),
      });
    }
  }

  corpus = Math.round(corpus);
  invested = Math.round(invested);
  const totalGains = Math.max(0, corpus - invested);
  const estimatedTaxOnGainsAtWithdrawal = Math.round(totalGains * (Math.max(0, marginalTaxRatePercent) / 100));
  const netCorpusAfterTax = corpus - estimatedTaxOnGainsAtWithdrawal;

  return {
    totalInvested: invested,
    corpusAtEnd: corpus,
    totalGains,
    estimatedTaxOnGainsAtWithdrawal,
    netCorpusAfterTax,
    eightyCBenefitAvailable: isCentralGovtEmployee,
    yearlyBreakdown,
  };
}
