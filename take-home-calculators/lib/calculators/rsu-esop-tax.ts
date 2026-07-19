import { calculateIncomeTax, type TaxRegime } from "@/lib/calculators/income-tax";
import { calculateCapitalGains, type AssetClass } from "@/lib/calculators/capital-gains";

export interface RsuEsopInput {
  grantType: "rsu" | "esop";
  numberOfShares: number;
  fmvAtVesting: number; // fair market value per share at vesting/exercise date
  exercisePrice: number; // 0 for RSU
  otherAnnualSalaryIncome: number; // rest of salary, excluding this perquisite
  regime: TaxRegime;
  salePricePerShare: number;
  holdingPeriodMonths: number; // since vesting/exercise date
  shareType: AssetClass; // reuses capital-gains.ts asset classes
}

export interface RsuEsopResult {
  perquisiteValuePerShare: number;
  totalPerquisiteValue: number;
  taxWithoutPerquisite: number;
  taxWithPerquisite: number;
  perquisiteTax: number;
  effectivePerquisiteTaxRate: number;
  totalExerciseCost: number;
  totalSaleProceeds: number;
  capitalGain: number;
  capitalGainsTax: ReturnType<typeof calculateCapitalGains>;
  totalTaxOverall: number;
  netProceedsAfterAllTax: number;
}

/**
 * RSU/ESOP taxation in India happens at two separate points:
 *
 *  1. At vesting (RSU) or exercise (ESOP): the "perquisite value" —
 *     FMV per share minus what you paid to acquire it (0 for RSU,
 *     the exercise price for ESOP) — is added to your salary income
 *     and taxed at your slab rate. Employers deduct TDS on this as
 *     part of payroll.
 *
 *  2. At sale: capital gains = sale price minus the FMV at vesting
 *     (which becomes your cost basis, since you already paid tax on
 *     that value once). Holding period from the vesting/exercise date
 *     determines short-term vs long-term treatment, reusing the same
 *     capital gains rules as any other equity investment.
 *
 * This is a simplified model for a single vesting event — it doesn't
 * account for multiple tranches vesting on different dates, or the
 * special valuation rules for shares of foreign employers not listed
 * on any recognized Indian stock exchange (FMV there generally follows
 * the last traded price on the relevant foreign exchange, converted to
 * INR at the exercise date).
 */
export function calculateRsuEsopTax(input: RsuEsopInput): RsuEsopResult {
  const {
    numberOfShares,
    fmvAtVesting,
    exercisePrice,
    otherAnnualSalaryIncome,
    regime,
    salePricePerShare,
    holdingPeriodMonths,
    shareType,
  } = input;

  const perquisiteValuePerShare = Math.max(0, fmvAtVesting - exercisePrice);
  const totalPerquisiteValue = Math.round(perquisiteValuePerShare * numberOfShares);
  const totalExerciseCost = Math.round(exercisePrice * numberOfShares);

  const taxWithoutPerquisite = calculateIncomeTax(Math.max(0, otherAnnualSalaryIncome), regime, 0).totalTaxPayable;
  const taxWithPerquisite = calculateIncomeTax(
    Math.max(0, otherAnnualSalaryIncome) + totalPerquisiteValue,
    regime,
    0
  ).totalTaxPayable;
  const perquisiteTax = Math.max(0, taxWithPerquisite - taxWithoutPerquisite);
  const effectivePerquisiteTaxRate = totalPerquisiteValue > 0 ? (perquisiteTax / totalPerquisiteValue) * 100 : 0;

  const totalSaleProceeds = Math.round(salePricePerShare * numberOfShares);
  const capitalGain = Math.round((salePricePerShare - fmvAtVesting) * numberOfShares);

  const capitalGainsTax = calculateCapitalGains({
    assetClass: shareType,
    purchasePrice: fmvAtVesting * numberOfShares,
    salePrice: salePricePerShare * numberOfShares,
    holdingPeriodMonths,
  });

  const totalTaxOverall = perquisiteTax + capitalGainsTax.taxPayable;
  const netProceedsAfterAllTax = totalSaleProceeds - totalExerciseCost - perquisiteTax - capitalGainsTax.taxPayable;

  return {
    perquisiteValuePerShare,
    totalPerquisiteValue,
    taxWithoutPerquisite,
    taxWithPerquisite,
    perquisiteTax: Math.round(perquisiteTax),
    effectivePerquisiteTaxRate,
    totalExerciseCost,
    totalSaleProceeds,
    capitalGain,
    capitalGainsTax,
    totalTaxOverall: Math.round(totalTaxOverall),
    netProceedsAfterAllTax: Math.round(netProceedsAfterAllTax),
  };
}
