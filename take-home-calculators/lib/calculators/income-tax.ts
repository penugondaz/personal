/**
 * Income tax calculation — Financial Year 2025-26 (Assessment Year 2026-27).
 * Also valid for FY 2026-27, since Budget 2026 carried forward the same
 * slabs/rebate/surcharge structure unchanged.
 *
 * Sources (verified June 2026): Budget 2025 new-regime slab revision,
 * Section 87A rebate increase to ₹60,000/₹12 lakh (new regime) and
 * ₹12,500/₹5 lakh (old regime), standard deduction ₹75,000 (new regime)
 * / ₹50,000 (old regime).
 *
 * IMPORTANT — keep this file's constants in sync every Union Budget
 * (typically presented early February, effective from the following
 * April 1). Update FISCAL_YEAR_LABEL and the slab tables together so
 * stale numbers can't silently persist across years.
 */

export const FISCAL_YEAR_LABEL = "FY 2025-26 (AY 2026-27)";

export type TaxRegime = "new" | "old";

export interface TaxSlab {
  /** Inclusive lower bound of the slab, in rupees. */
  from: number;
  /** Exclusive upper bound; null = no upper bound (top slab). */
  to: number | null;
  /** Marginal rate applied to income within this slab, e.g. 0.05 for 5%. */
  rate: number;
}

// New tax regime (default regime since FY 2023-24). Same slabs apply
// regardless of age — no senior/super-senior citizen concession here,
// unlike the old regime.
export const NEW_REGIME_SLABS: TaxSlab[] = [
  { from: 0, to: 400_000, rate: 0 },
  { from: 400_000, to: 800_000, rate: 0.05 },
  { from: 800_000, to: 1_200_000, rate: 0.1 },
  { from: 1_200_000, to: 1_600_000, rate: 0.15 },
  { from: 1_600_000, to: 2_000_000, rate: 0.2 },
  { from: 2_000_000, to: 2_400_000, rate: 0.25 },
  { from: 2_400_000, to: null, rate: 0.3 },
];

// Old tax regime, for taxpayers below 60. (Senior/super-senior exemption
// limits of ₹3L/₹5L are out of scope for this calculator — most salaried
// "in-hand salary" search intent is for working-age employees.)
export const OLD_REGIME_SLABS: TaxSlab[] = [
  { from: 0, to: 250_000, rate: 0 },
  { from: 250_000, to: 500_000, rate: 0.05 },
  { from: 500_000, to: 1_000_000, rate: 0.2 },
  { from: 1_000_000, to: null, rate: 0.3 },
];

export const STANDARD_DEDUCTION: Record<TaxRegime, number> = {
  new: 75_000,
  old: 50_000,
};

/** Section 87A rebate: taxpayer pays zero tax if taxable income is at or
 *  below the threshold, AND the rebate is capped at this amount (rebate
 *  can never exceed the actual tax payable before cess). */
export const SECTION_87A: Record<TaxRegime, { threshold: number; maxRebate: number }> = {
  new: { threshold: 1_200_000, maxRebate: 60_000 },
  old: { threshold: 500_000, maxRebate: 12_500 },
};

export const HEALTH_AND_EDUCATION_CESS_RATE = 0.04;

/** Surcharge applies above ₹50L taxable income, same threshold in both
 *  regimes. This calculator only implements the first surcharge band
 *  (10% for ₹50L–₹1Cr) since "in-hand salary" search intent rarely
 *  extends past crorepati income — flagged here for future extension. */
export const SURCHARGE_BANDS: { from: number; to: number | null; rate: number }[] = [
  { from: 0, to: 5_000_000, rate: 0 },
  { from: 5_000_000, to: 10_000_000, rate: 0.1 },
  { from: 10_000_000, to: 20_000_000, rate: 0.15 },
  { from: 20_000_000, to: null, rate: 0.25 }, // simplified: treats 25%+ band as flat; old regime 37% top band on non-capital-gains income intentionally omitted pending dedicated high-income calculator
];

/**
 * Applies progressive slab rates to taxable income, returning total tax
 * before rebate/cess, plus a per-slab breakdown for UI display.
 */
export function calculateSlabTax(
  taxableIncome: number,
  slabs: TaxSlab[]
): { totalTax: number; breakdown: { from: number; to: number | null; rate: number; taxInSlab: number }[] } {
  let totalTax = 0;
  const breakdown: { from: number; to: number | null; rate: number; taxInSlab: number }[] = [];

  for (const slab of slabs) {
    if (taxableIncome <= slab.from) {
      breakdown.push({ ...slab, taxInSlab: 0 });
      continue;
    }
    const upper = slab.to === null ? taxableIncome : Math.min(taxableIncome, slab.to);
    const amountInSlab = Math.max(0, upper - slab.from);
    const taxInSlab = amountInSlab * slab.rate;
    totalTax += taxInSlab;
    breakdown.push({ ...slab, taxInSlab });
  }

  return { totalTax, breakdown };
}

/** Applies Section 87A rebate. Rebate is capped so it never makes tax negative. */
export function applyRebate(taxBeforeRebate: number, taxableIncome: number, regime: TaxRegime): number {
  const { threshold, maxRebate } = SECTION_87A[regime];
  if (taxableIncome > threshold) return taxBeforeRebate;
  const rebate = Math.min(taxBeforeRebate, maxRebate);
  return Math.max(0, taxBeforeRebate - rebate);
}

/**
 * Marginal relief for the new regime: when taxable income just exceeds
 * ₹12L, ensures tax payable doesn't exceed (taxable income − ₹12L), so
 * crossing the rebate threshold by ₹1 doesn't trigger a full ₹60,000+ tax
 * jump. Old regime's ₹5L threshold has a much smaller cliff and the same
 * principle applies, included here for completeness.
 */
function applyMarginalRelief(
  taxAfterRebateAttempt: number,
  taxBeforeRebate: number,
  taxableIncome: number,
  regime: TaxRegime
): number {
  const { threshold } = SECTION_87A[regime];
  if (taxableIncome <= threshold) return taxAfterRebateAttempt;

  // Only relevant in a narrow band just above the threshold where
  // uncapped tax would otherwise exceed (income - threshold).
  const excessIncome = taxableIncome - threshold;
  if (taxBeforeRebate > excessIncome) {
    return Math.min(taxBeforeRebate, excessIncome > 0 ? excessIncome : taxBeforeRebate);
  }
  return taxAfterRebateAttempt;
}

function calculateSurcharge(taxableIncome: number, taxAfterRebate: number): number {
  let rate = 0;
  for (const band of SURCHARGE_BANDS) {
    if (taxableIncome > band.from && (band.to === null || taxableIncome <= band.to)) {
      rate = band.rate;
      break;
    }
    if (band.to !== null && taxableIncome > band.to) continue;
  }
  return taxAfterRebate * rate;
}

export interface IncomeTaxResult {
  regime: TaxRegime;
  grossIncome: number;
  standardDeduction: number;
  otherDeductions: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  taxAfterRebate: number;
  marginalReliefApplied: boolean;
  surcharge: number;
  cess: number;
  totalTaxPayable: number;
  slabBreakdown: { from: number; to: number | null; rate: number; taxInSlab: number }[];
}

/**
 * Full income tax computation for one regime.
 *
 * @param grossIncome Gross taxable salary income (after employer
 *   contributions excluded, i.e. what appears as gross salary on a
 *   payslip — basic + HRA + special allowance + other taxable
 *   components, BEFORE standard deduction).
 * @param otherDeductions Old-regime-only deductions (80C, 80D, HRA
 *   exemption, home loan interest, etc.), pre-summed by the caller.
 *   Ignored for the new regime (pass 0), since most such deductions
 *   aren't permitted there.
 */
export function calculateIncomeTax(
  grossIncome: number,
  regime: TaxRegime,
  otherDeductions: number = 0
): IncomeTaxResult {
  const standardDeduction = STANDARD_DEDUCTION[regime];
  const effectiveOtherDeductions = regime === "new" ? 0 : Math.max(0, otherDeductions);
  const taxableIncome = Math.max(0, grossIncome - standardDeduction - effectiveOtherDeductions);

  const slabs = regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
  const { totalTax: taxBeforeRebate, breakdown } = calculateSlabTax(taxableIncome, slabs);

  const taxAfterRebateRaw = applyRebate(taxBeforeRebate, taxableIncome, regime);
  const taxAfterMarginalRelief = applyMarginalRelief(taxAfterRebateRaw, taxBeforeRebate, taxableIncome, regime);
  const marginalReliefApplied = taxAfterMarginalRelief < taxAfterRebateRaw;

  const rebate = taxBeforeRebate - taxAfterMarginalRelief;
  const surcharge = calculateSurcharge(taxableIncome, taxAfterMarginalRelief);
  const cess = (taxAfterMarginalRelief + surcharge) * HEALTH_AND_EDUCATION_CESS_RATE;
  const totalTaxPayable = Math.round(taxAfterMarginalRelief + surcharge + cess);

  return {
    regime,
    grossIncome,
    standardDeduction,
    otherDeductions: effectiveOtherDeductions,
    taxableIncome,
    taxBeforeRebate: Math.round(taxBeforeRebate),
    rebate: Math.round(rebate),
    taxAfterRebate: Math.round(taxAfterMarginalRelief),
    marginalReliefApplied,
    surcharge: Math.round(surcharge),
    cess: Math.round(cess),
    totalTaxPayable,
    slabBreakdown: breakdown,
  };
}

/** Convenience: computes both regimes and indicates which is cheaper. */
export function compareRegimes(
  grossIncome: number,
  oldRegimeDeductions: number = 0
): { new: IncomeTaxResult; old: IncomeTaxResult; betterRegime: TaxRegime; savings: number } {
  const newResult = calculateIncomeTax(grossIncome, "new", 0);
  const oldResult = calculateIncomeTax(grossIncome, "old", oldRegimeDeductions);
  const betterRegime: TaxRegime = newResult.totalTaxPayable <= oldResult.totalTaxPayable ? "new" : "old";
  const savings = Math.abs(newResult.totalTaxPayable - oldResult.totalTaxPayable);
  return { new: newResult, old: oldResult, betterRegime, savings };
}
