import { calculateSalaryBreakup } from "./salary-breakup";
import type { TaxRegime } from "./income-tax";

export interface InhandToCtcInput {
  targetInHandMonthly: number;
  regime?: TaxRegime;
}

export interface InhandToCtcResult {
  targetInHandMonthly: number;
  estimatedAnnualCtc: number;
  estimatedMonthlyCtc: number;
  actualInHandMonthly: number;
  grossSalaryMonthly: number;
  totalDeductionsMonthly: number;
}

/**
 * Reverse-engineers CTC from a desired in-hand salary using binary search,
 * since the relationship is non-linear due to progressive tax slabs.
 */
export function calculateInhandToCtc(input: InhandToCtcInput): InhandToCtcResult {
  const { targetInHandMonthly, regime = "new" } = input;
  const targetAnnual = targetInHandMonthly * 12;

  let low = targetAnnual;
  let high = targetAnnual * 3;
  let bestCtc = targetAnnual;

  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const result = calculateSalaryBreakup({ annualCtc: mid, regime });
    if (result.inHandAnnual < targetAnnual) {
      low = mid;
    } else {
      high = mid;
      bestCtc = mid;
    }
  }

  const finalResult = calculateSalaryBreakup({ annualCtc: Math.round(bestCtc), regime });
  return {
    targetInHandMonthly,
    estimatedAnnualCtc: Math.round(bestCtc),
    estimatedMonthlyCtc: Math.round(bestCtc / 12),
    actualInHandMonthly: Math.round(finalResult.inHandMonthly),
    grossSalaryMonthly: Math.round(finalResult.grossSalaryMonthly),
    totalDeductionsMonthly: Math.round(finalResult.grossSalaryMonthly - finalResult.inHandMonthly),
  };
}
