export type OvertimeMultiplier = "1.5x" | "2x" | "custom";

export interface OvertimeInput {
  basicMonthly: number;
  daMonthly?: number;
  standardWorkingDaysPerMonth?: number;
  standardHoursPerDay?: number;
  overtimeHours: number;
  multiplier: OvertimeMultiplier;
  customMultiplier?: number;
}

export interface OvertimeResult {
  hourlyRate: number;
  effectiveMultiplier: number;
  overtimeHours: number;
  overtimePay: number;
}

/**
 * Hourly rate is derived from monthly Basic + DA (the wage components
 * the Factories Act / Shops & Establishment Acts typically use as the
 * base for overtime calculation — not the full CTC or gross salary).
 * The Factories Act mandates at least 2x the ordinary rate for
 * overtime; many private employers use 1.5x for salaried staff not
 * covered by that Act, which is why both options plus a custom rate
 * are offered here.
 */
export function calculateOvertime(input: OvertimeInput): OvertimeResult {
  const {
    basicMonthly,
    daMonthly = 0,
    standardWorkingDaysPerMonth = 26,
    standardHoursPerDay = 8,
    overtimeHours,
    multiplier,
    customMultiplier = 1.5,
  } = input;

  const monthlyWage = basicMonthly + daMonthly;
  const totalStandardHours = standardWorkingDaysPerMonth * standardHoursPerDay;
  const hourlyRate = totalStandardHours > 0 ? monthlyWage / totalStandardHours : 0;

  const effectiveMultiplier = multiplier === "1.5x" ? 1.5 : multiplier === "2x" ? 2 : customMultiplier;

  const overtimePay = Math.round(hourlyRate * effectiveMultiplier * overtimeHours);

  return {
    hourlyRate: Math.round(hourlyRate * 100) / 100,
    effectiveMultiplier,
    overtimeHours,
    overtimePay,
  };
}
