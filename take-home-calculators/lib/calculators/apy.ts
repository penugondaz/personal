export type ApyPensionAmount = 1000 | 2000 | 3000 | 4000 | 5000;

export interface ApyInput {
  currentAge: number;
  desiredMonthlyPension: ApyPensionAmount;
}

export interface ApyResult {
  monthlyContribution: number;
  yearsOfContribution: number;
  totalMonthsOfContribution: number;
  totalContributionPaid: number;
  guaranteedMonthlyPensionAt60: number;
  annualPensionAt60: number;
  corpusReturnedToNominee: number;
  isEligible: boolean;
  ineligibilityReason: string | null;
}

/**
 * Official PFRDA Atal Pension Yojana monthly contribution chart, by entry
 * age (18-40) and desired monthly pension slab at age 60. Unlike NPS or
 * PPF, APY is NOT a "your money grows at X%" scheme — it's a defined
 * BENEFIT scheme where the government (via PFRDA) fixes your monthly
 * contribution based on your entry age and the pension you want, and
 * guarantees that exact pension for life from age 60 onward.
 *
 * On the subscriber's death after 60, the spouse receives the same
 * pension for life; on both deaths, the nominee receives the
 * accumulated corpus (a fixed amount per pension slab, shown below,
 * independent of entry age).
 */
export const APY_CONTRIBUTION_TABLE: Record<number, Record<ApyPensionAmount, number>> = {
  18: { 1000: 42, 2000: 84, 3000: 126, 4000: 168, 5000: 210 },
  19: { 1000: 46, 2000: 92, 3000: 138, 4000: 183, 5000: 228 },
  20: { 1000: 50, 2000: 100, 3000: 150, 4000: 198, 5000: 248 },
  21: { 1000: 54, 2000: 108, 3000: 162, 4000: 215, 5000: 269 },
  22: { 1000: 59, 2000: 117, 3000: 177, 4000: 234, 5000: 292 },
  23: { 1000: 64, 2000: 127, 3000: 192, 4000: 254, 5000: 318 },
  24: { 1000: 70, 2000: 139, 3000: 208, 4000: 277, 5000: 346 },
  25: { 1000: 76, 2000: 151, 3000: 226, 4000: 301, 5000: 376 },
  26: { 1000: 82, 2000: 164, 3000: 246, 4000: 327, 5000: 409 },
  27: { 1000: 90, 2000: 178, 3000: 268, 4000: 356, 5000: 446 },
  28: { 1000: 97, 2000: 194, 3000: 292, 4000: 388, 5000: 485 },
  29: { 1000: 106, 2000: 212, 3000: 318, 4000: 423, 5000: 529 },
  30: { 1000: 116, 2000: 231, 3000: 347, 4000: 462, 5000: 577 },
  31: { 1000: 126, 2000: 252, 3000: 379, 4000: 504, 5000: 630 },
  32: { 1000: 138, 2000: 276, 3000: 414, 4000: 551, 5000: 689 },
  33: { 1000: 151, 2000: 301, 3000: 452, 4000: 602, 5000: 752 },
  34: { 1000: 165, 2000: 330, 3000: 495, 4000: 660, 5000: 824 },
  35: { 1000: 181, 2000: 362, 3000: 543, 4000: 722, 5000: 902 },
  36: { 1000: 198, 2000: 396, 3000: 594, 4000: 792, 5000: 990 },
  37: { 1000: 218, 2000: 436, 3000: 654, 4000: 870, 5000: 1087 },
  38: { 1000: 240, 2000: 480, 3000: 720, 4000: 957, 5000: 1196 },
  39: { 1000: 264, 2000: 528, 3000: 792, 4000: 1054, 5000: 1318 },
  40: { 1000: 291, 2000: 582, 3000: 873, 4000: 1164, 5000: 1454 },
};

// Corpus returned to nominee is fixed per pension slab, regardless of entry age.
export const APY_RETURNABLE_CORPUS: Record<ApyPensionAmount, number> = {
  1000: 170_000,
  2000: 340_000,
  3000: 510_000,
  4000: 680_000,
  5000: 850_000,
};

export const APY_MIN_ENTRY_AGE = 18;
export const APY_MAX_ENTRY_AGE = 40;
export const APY_PENSION_AGE = 60;

export function calculateApy(input: ApyInput): ApyResult {
  const { currentAge, desiredMonthlyPension } = input;

  if (currentAge < APY_MIN_ENTRY_AGE || currentAge > APY_MAX_ENTRY_AGE) {
    return {
      monthlyContribution: 0,
      yearsOfContribution: 0,
      totalMonthsOfContribution: 0,
      totalContributionPaid: 0,
      guaranteedMonthlyPensionAt60: desiredMonthlyPension,
      annualPensionAt60: desiredMonthlyPension * 12,
      corpusReturnedToNominee: APY_RETURNABLE_CORPUS[desiredMonthlyPension],
      isEligible: false,
      ineligibilityReason: `APY is only open to Indians aged ${APY_MIN_ENTRY_AGE}-${APY_MAX_ENTRY_AGE}.`,
    };
  }

  const monthlyContribution = APY_CONTRIBUTION_TABLE[currentAge][desiredMonthlyPension];
  const yearsOfContribution = APY_PENSION_AGE - currentAge;
  const totalMonthsOfContribution = yearsOfContribution * 12;
  const totalContributionPaid = monthlyContribution * totalMonthsOfContribution;

  return {
    monthlyContribution,
    yearsOfContribution,
    totalMonthsOfContribution,
    totalContributionPaid,
    guaranteedMonthlyPensionAt60: desiredMonthlyPension,
    annualPensionAt60: desiredMonthlyPension * 12,
    corpusReturnedToNominee: APY_RETURNABLE_CORPUS[desiredMonthlyPension],
    isEligible: true,
    ineligibilityReason: null,
  };
}
