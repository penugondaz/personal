export type CityType = "metro" | "non_metro";

export interface HraInput {
  basicMonthly: number;
  daMonthly?: number;
  hraReceivedMonthly: number;
  rentPaidMonthly: number;
  cityType: CityType;
}

export interface HraResult {
  basicPlusDaMonthly: number;
  hraReceivedMonthly: number;
  rentPaidMonthly: number;
  cityType: CityType;
  // The three competing limbs of Sec 10(13A) — exemption is the lowest of these
  actualHraReceived: number;
  cityLimitPercent: number;
  cityLimitAmount: number;
  rentMinusTenPercentBasic: number;
  hraExemptionMonthly: number;
  hraExemptionAnnual: number;
  taxableHraMonthly: number;
  taxableHraAnnual: number;
  bindingLimb: "actual_hra" | "city_limit" | "rent_minus_10pct";
}

const METRO_PERCENT = 0.5;
const NON_METRO_PERCENT = 0.4;

/**
 * HRA exemption under Section 10(13A) is the LEAST of:
 *  1. Actual HRA received
 *  2. 50% of (Basic + DA) for metro cities, 40% for non-metro
 *  3. Rent paid minus 10% of (Basic + DA)
 *
 * Only available under the OLD tax regime — the new regime has no HRA
 * exemption at all (it's folded into the higher standard deduction
 * instead), which is why this calculator doesn't take a regime input.
 */
export function calculateHraExemption(input: HraInput): HraResult {
  const { basicMonthly, daMonthly = 0, hraReceivedMonthly, rentPaidMonthly, cityType } = input;
  const basicPlusDaMonthly = basicMonthly + daMonthly;

  const cityLimitPercent = cityType === "metro" ? METRO_PERCENT : NON_METRO_PERCENT;
  const cityLimitAmount = basicPlusDaMonthly * cityLimitPercent;
  const rentMinusTenPercentBasic = Math.max(0, rentPaidMonthly - 0.1 * basicPlusDaMonthly);

  const candidates: { limb: HraResult["bindingLimb"]; value: number }[] = [
    { limb: "actual_hra", value: hraReceivedMonthly },
    { limb: "city_limit", value: cityLimitAmount },
    { limb: "rent_minus_10pct", value: rentMinusTenPercentBasic },
  ];

  const lowest = candidates.reduce((min, c) => (c.value < min.value ? c : min));

  const hraExemptionMonthly = Math.max(0, Math.round(lowest.value));
  const taxableHraMonthly = Math.max(0, Math.round(hraReceivedMonthly - hraExemptionMonthly));

  return {
    basicPlusDaMonthly,
    hraReceivedMonthly,
    rentPaidMonthly,
    cityType,
    actualHraReceived: hraReceivedMonthly,
    cityLimitPercent,
    cityLimitAmount: Math.round(cityLimitAmount),
    rentMinusTenPercentBasic: Math.round(rentMinusTenPercentBasic),
    hraExemptionMonthly,
    hraExemptionAnnual: hraExemptionMonthly * 12,
    taxableHraMonthly,
    taxableHraAnnual: taxableHraMonthly * 12,
    bindingLimb: lowest.limb,
  };
}
