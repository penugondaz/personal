import { calculateIncomeTax } from "@/lib/calculators/income-tax";

export interface BreakEvenInput {
  grossIncome: number;
  actualOldRegimeDeductions: number; // what the user actually expects to claim
}

export interface BreakEvenChartPoint {
  deductions: number;
  oldRegimeTax: number;
  newRegimeTax: number;
}

export interface BreakEvenResult {
  newRegimeTax: number;
  breakEvenDeduction: number | null; // null if old regime never wins (rare, very low income)
  oldRegimeTaxAtActualDeductions: number;
  actualBetterRegime: "old" | "new";
  actualSavings: number;
  chart: BreakEvenChartPoint[];
}

const MAX_DEDUCTION_SEARCHED = 800_000;
const CHART_STEP = 50_000;

/**
 * Old-regime tax is monotonically non-increasing as deductions rise (more
 * deductions never increases tax), while new-regime tax is fixed for a
 * given gross income. So there's at most one break-even deduction amount
 * where the two curves cross — found here via binary search over the
 * deduction amount.
 */
export function calculateNewRegimeBreakEven(input: BreakEvenInput): BreakEvenResult {
  const { grossIncome, actualOldRegimeDeductions } = input;

  const newRegimeTax = calculateIncomeTax(grossIncome, "new", 0).totalTaxPayable;

  const oldTaxAt = (deductions: number) => calculateIncomeTax(grossIncome, "old", deductions).totalTaxPayable;

  let breakEvenDeduction: number | null = null;
  const taxAtZeroDeductions = oldTaxAt(0);
  const taxAtMaxDeductions = oldTaxAt(MAX_DEDUCTION_SEARCHED);

  if (taxAtZeroDeductions <= newRegimeTax) {
    // Old regime already wins with zero deductions (can happen at very low incomes)
    breakEvenDeduction = 0;
  } else if (taxAtMaxDeductions > newRegimeTax) {
    // Old regime never catches up even at the search ceiling
    breakEvenDeduction = null;
  } else {
    let lo = 0;
    let hi = MAX_DEDUCTION_SEARCHED;
    // Binary search to the nearest ₹1,000
    while (hi - lo > 1_000) {
      const mid = Math.round((lo + hi) / 2 / 1000) * 1000;
      if (oldTaxAt(mid) <= newRegimeTax) {
        hi = mid;
      } else {
        lo = mid;
      }
    }
    breakEvenDeduction = hi;
  }

  const oldRegimeTaxAtActualDeductions = oldTaxAt(Math.max(0, actualOldRegimeDeductions));
  const actualBetterRegime: "old" | "new" = oldRegimeTaxAtActualDeductions <= newRegimeTax ? "old" : "new";
  const actualSavings = Math.abs(oldRegimeTaxAtActualDeductions - newRegimeTax);

  const chart: BreakEvenChartPoint[] = [];
  for (let d = 0; d <= MAX_DEDUCTION_SEARCHED; d += CHART_STEP) {
    chart.push({ deductions: d, oldRegimeTax: oldTaxAt(d), newRegimeTax });
  }

  return {
    newRegimeTax,
    breakEvenDeduction,
    oldRegimeTaxAtActualDeductions,
    actualBetterRegime,
    actualSavings,
    chart,
  };
}
