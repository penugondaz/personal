import { calculateSalaryBreakup } from "./salary-breakup";
import type { TaxRegime } from "./income-tax";

export interface SalaryHikeInput {
  currentAnnualCtc: number;
  hikePercent: number;
  regime?: TaxRegime;
}

export interface SalaryHikeResult {
  currentAnnualCtc: number;
  hikePercent: number;
  newAnnualCtc: number;
  hikeAmountAnnual: number;
  currentInHandMonthly: number;
  newInHandMonthly: number;
  inHandIncreaseMonthly: number;
  inHandIncreasePercent: number;
}

/**
 * A flat hike-on-CTC doesn't translate to the same percentage increase
 * in-hand, because income tax is progressive — the increase pushes more
 * of your income into higher slabs. This calculator surfaces that gap
 * explicitly (it's the single most common confusion in salary
 * negotiations: "I got a 20% hike but my take-home only went up 15%").
 */
export function calculateSalaryHike(input: SalaryHikeInput): SalaryHikeResult {
  const { currentAnnualCtc, hikePercent, regime = "new" } = input;
  const newAnnualCtc = Math.round(currentAnnualCtc * (1 + hikePercent / 100));

  const currentBreakup = calculateSalaryBreakup({ annualCtc: currentAnnualCtc, regime });
  const newBreakup = calculateSalaryBreakup({ annualCtc: newAnnualCtc, regime });

  const inHandIncreaseMonthly = newBreakup.inHandMonthly - currentBreakup.inHandMonthly;
  const inHandIncreasePercent =
    currentBreakup.inHandMonthly > 0 ? (inHandIncreaseMonthly / currentBreakup.inHandMonthly) * 100 : 0;

  return {
    currentAnnualCtc,
    hikePercent,
    newAnnualCtc,
    hikeAmountAnnual: newAnnualCtc - currentAnnualCtc,
    currentInHandMonthly: currentBreakup.inHandMonthly,
    newInHandMonthly: newBreakup.inHandMonthly,
    inHandIncreaseMonthly,
    inHandIncreasePercent,
  };
}

export function requiredHikeForTargetInHand(
  currentAnnualCtc: number,
  targetInHandMonthly: number,
  regime: TaxRegime = "new"
): { hikePercent: number; newAnnualCtc: number } {
  // Binary search since in-hand isn't a simple linear function of CTC (tax slabs)
  let low = 0;
  let high = 500; // cap search at +500% hike
  let bestCtc = currentAnnualCtc;

  for (let i = 0; i < 40; i++) {
    const midPercent = (low + high) / 2;
    const candidateCtc = currentAnnualCtc * (1 + midPercent / 100);
    const candidateInHand = calculateSalaryBreakup({ annualCtc: candidateCtc, regime }).inHandMonthly;

    if (candidateInHand < targetInHandMonthly) {
      low = midPercent;
    } else {
      high = midPercent;
      bestCtc = candidateCtc;
    }
  }

  return {
    hikePercent: Math.round(high * 10) / 10,
    newAnnualCtc: Math.round(bestCtc),
  };
}
