import {
  calculateSlabTax,
  NEW_REGIME_SLABS,
  OLD_REGIME_SLABS,
  STANDARD_DEDUCTION,
  HEALTH_AND_EDUCATION_CESS_RATE,
  SURCHARGE_BANDS,
  type TaxRegime,
} from "@/lib/calculators/income-tax";

export interface NriIncomeInput {
  salaryIncome: number; // for services rendered in India
  rentalIncome: number; // from Indian property
  nroInterestIncome: number; // NRO account / FD interest (taxable)
  shortTermCapitalGains: number; // equity STCG, taxed flat 20%
  longTermCapitalGains: number; // equity LTCG, taxed 12.5% above 1.25L exemption
  otherIncome: number;
  oldRegimeDeductions: number; // 80C/80D etc, old regime only
}

export interface NriRegimeResult {
  regime: TaxRegime;
  grossIndiaIncome: number;
  standardDeduction: number;
  deductionsApplied: number;
  ordinaryTaxableIncome: number;
  slabTaxOnOrdinaryIncome: number;
  ltcgExemption: number;
  ltcgTaxable: number;
  ltcgTax: number;
  stcgTax: number;
  taxBeforeSurcharge: number;
  surcharge: number;
  cess: number;
  totalTaxPayable: number;
  effectiveTaxRate: number;
}

export interface NriTaxComparisonResult {
  new: NriRegimeResult;
  old: NriRegimeResult;
  betterRegime: TaxRegime;
  savings: number;
}

const LTCG_EXEMPTION = 125_000;
const LTCG_RATE = 0.125;
const STCG_RATE = 0.2;

/**
 * NRI income tax on India-sourced income only.
 *
 * Key differences from resident taxation, modeled here:
 *  - Only India-sourced income is taxed (salary for services in India,
 *    rent from Indian property, NRO interest, capital gains on Indian
 *    assets) — global income is NOT included, unlike for residents.
 *  - Section 87A rebate does NOT apply to NRIs, under either regime —
 *    even if taxable income is below the rebate threshold that would
 *    zero out a resident's tax.
 *  - Basic exemption slabs and surcharge/cess apply the same as for
 *    residents.
 *  - NRE and FCNR account interest are fully exempt and excluded from
 *    this calculator — only NRO interest is taxable.
 *  - Capital gains are taxed at the same rates as for residents.
 *
 * This is a simplified model — it doesn't account for DTAA relief,
 * which may reduce or eliminate Indian tax liability depending on the
 * NRI's country of residence and that country's tax treaty with India.
 */
function calculateSurchargeLocal(taxableIncome: number, taxBeforeSurcharge: number): number {
  let rate = 0;
  for (const band of SURCHARGE_BANDS) {
    if (taxableIncome > band.from && (band.to === null || taxableIncome <= band.to)) {
      rate = band.rate;
      break;
    }
  }
  return taxBeforeSurcharge * rate;
}

function calculateNriRegime(input: NriIncomeInput, regime: TaxRegime): NriRegimeResult {
  const {
    salaryIncome,
    rentalIncome,
    nroInterestIncome,
    shortTermCapitalGains,
    longTermCapitalGains,
    otherIncome,
    oldRegimeDeductions,
  } = input;

  const standardDeduction = salaryIncome > 0 ? STANDARD_DEDUCTION[regime] : 0;
  const deductionsApplied = regime === "old" ? Math.max(0, oldRegimeDeductions) : 0;

  const ordinaryGross = Math.max(0, salaryIncome) + Math.max(0, rentalIncome) + Math.max(0, nroInterestIncome) + Math.max(0, otherIncome);
  const ordinaryTaxableIncome = Math.max(0, ordinaryGross - standardDeduction - deductionsApplied);

  const slabs = regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
  const { totalTax: slabTaxOnOrdinaryIncome } = calculateSlabTax(ordinaryTaxableIncome, slabs);

  const ltcgExemption = Math.min(Math.max(0, longTermCapitalGains), LTCG_EXEMPTION);
  const ltcgTaxable = Math.max(0, longTermCapitalGains - ltcgExemption);
  const ltcgTax = ltcgTaxable * LTCG_RATE;
  const stcgTax = Math.max(0, shortTermCapitalGains) * STCG_RATE;

  // No Section 87A rebate for NRIs — tax proceeds straight from slabs to surcharge/cess.
  const totalTaxableIncomeForSurcharge = ordinaryTaxableIncome + ltcgTaxable + Math.max(0, shortTermCapitalGains);
  const taxBeforeSurcharge = slabTaxOnOrdinaryIncome + ltcgTax + stcgTax;
  const surcharge = calculateSurchargeLocal(totalTaxableIncomeForSurcharge, taxBeforeSurcharge);
  const cess = (taxBeforeSurcharge + surcharge) * HEALTH_AND_EDUCATION_CESS_RATE;
  const totalTaxPayable = Math.round(taxBeforeSurcharge + surcharge + cess);

  const grossIndiaIncome = ordinaryGross + Math.max(0, shortTermCapitalGains) + Math.max(0, longTermCapitalGains);
  const effectiveTaxRate = grossIndiaIncome > 0 ? (totalTaxPayable / grossIndiaIncome) * 100 : 0;

  return {
    regime,
    grossIndiaIncome,
    standardDeduction,
    deductionsApplied,
    ordinaryTaxableIncome,
    slabTaxOnOrdinaryIncome: Math.round(slabTaxOnOrdinaryIncome),
    ltcgExemption,
    ltcgTaxable,
    ltcgTax: Math.round(ltcgTax),
    stcgTax: Math.round(stcgTax),
    taxBeforeSurcharge: Math.round(taxBeforeSurcharge),
    surcharge: Math.round(surcharge),
    cess: Math.round(cess),
    totalTaxPayable,
    effectiveTaxRate,
  };
}

export function calculateNriIncomeTax(input: NriIncomeInput): NriTaxComparisonResult {
  const newResult = calculateNriRegime(input, "new");
  const oldResult = calculateNriRegime(input, "old");
  const betterRegime: TaxRegime = newResult.totalTaxPayable <= oldResult.totalTaxPayable ? "new" : "old";
  const savings = Math.abs(newResult.totalTaxPayable - oldResult.totalTaxPayable);
  return { new: newResult, old: oldResult, betterRegime, savings };
}

// Indicative TDS rates NRIs commonly encounter (informational only —
// actual TDS is deducted by the payer and can be reclaimed via ITR if
// higher than final liability).
export const NRI_TDS_RATES = {
  nroInterest: 30,
  rentPaidByTenant: 31.2,
  propertySaleLTCG: 12.5,
  propertySaleSTCG: 30,
} as const;
