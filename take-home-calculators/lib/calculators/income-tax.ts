export const FISCAL_YEAR_LABEL = "FY 2025-26 (AY 2026-27)";

export type TaxRegime = "new" | "old";

export interface TaxSlab {
  from: number;
  to: number | null;
  rate: number;
}

export const NEW_REGIME_SLABS: TaxSlab[] = [
  { from: 0, to: 400_000, rate: 0 },
  { from: 400_000, to: 800_000, rate: 0.05 },
  { from: 800_000, to: 1_200_000, rate: 0.1 },
  { from: 1_200_000, to: 1_600_000, rate: 0.15 },
  { from: 1_600_000, to: 2_000_000, rate: 0.2 },
  { from: 2_000_000, to: 2_400_000, rate: 0.25 },
  { from: 2_400_000, to: null, rate: 0.3 },
];

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

export const SECTION_87A: Record<TaxRegime, { threshold: number; maxRebate: number }> = {
  new: { threshold: 1_200_000, maxRebate: 60_000 },
  old: { threshold: 500_000, maxRebate: 12_500 },
};

export const HEALTH_AND_EDUCATION_CESS_RATE = 0.04;

export const SURCHARGE_BANDS: { from: number; to: number | null; rate: number }[] = [
  { from: 0, to: 5_000_000, rate: 0 },
  { from: 5_000_000, to: 10_000_000, rate: 0.1 },
  { from: 10_000_000, to: 20_000_000, rate: 0.15 },
  { from: 20_000_000, to: null, rate: 0.25 },
];

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

export function applyRebate(taxBeforeRebate: number, taxableIncome: number, regime: TaxRegime): number {
  const { threshold, maxRebate } = SECTION_87A[regime];
  if (taxableIncome > threshold) return taxBeforeRebate;
  const rebate = Math.min(taxBeforeRebate, maxRebate);
  return Math.max(0, taxBeforeRebate - rebate);
}

function applyMarginalRelief(
  taxAfterRebateAttempt: number,
  taxBeforeRebate: number,
  taxableIncome: number,
  regime: TaxRegime
): number {
  const { threshold } = SECTION_87A[regime];
  if (taxableIncome <= threshold) return taxAfterRebateAttempt;

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
