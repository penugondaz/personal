export type GratuityCoverage = "covered" | "not_covered";

export interface GratuityInput {
  lastDrawnBasicMonthly: number;
  lastDrawnDaMonthly?: number;
  yearsOfService: number;
  coverage: GratuityCoverage;
}

export interface GratuityResult {
  salaryComponentMonthly: number;
  effectiveYears: number;
  divisor: number;
  formulaLabel: string;
  gratuityAmount: number;
  statutoryCapApplied: boolean;
  gratuityBeforeCap: number;
  eligible: boolean;
  ineligibilityReason: string | null;
}

export const GRATUITY_STATUTORY_CAP = 2_000_000; // ₹20 lakh, current limit under the Act
const MIN_QUALIFYING_YEARS = 5;

/**
 * Two formulas depending on whether the employer is "covered" under the
 * Payment of Gratuity Act, 1972:
 *
 *  Covered:     (Basic + DA) × 15/26 × years of service
 *               (26 = working days/month assumption; partial years ≥ 6
 *               months round UP to the next full year)
 *
 *  Not covered: (Basic + DA) × 15/30 × years of service
 *               (30 = calendar days/month; partial years are NOT
 *               rounded up — used as-is)
 *
 * Either way, the payout is capped at the statutory limit, and the
 * employee must have completed 5+ years of continuous service (waived
 * only for death/disability, which this calculator doesn't model).
 */
export function calculateGratuity(input: GratuityInput): GratuityResult {
  const { lastDrawnBasicMonthly, lastDrawnDaMonthly = 0, yearsOfService, coverage } = input;
  const salaryComponentMonthly = lastDrawnBasicMonthly + lastDrawnDaMonthly;

  const eligible = yearsOfService >= MIN_QUALIFYING_YEARS;
  const ineligibilityReason = eligible
    ? null
    : `Gratuity is payable only after ${MIN_QUALIFYING_YEARS}+ years of continuous service (death or disability exits are an exception, not covered by this calculator).`;

  const divisor = coverage === "covered" ? 26 : 30;
  const formulaLabel =
    coverage === "covered"
      ? "(Basic + DA) × 15 / 26 × years of service"
      : "(Basic + DA) × 15 / 30 × years of service";

  const effectiveYears =
    coverage === "covered" ? roundServiceYearsForCoveredEmployer(yearsOfService) : yearsOfService;

  const gratuityBeforeCap = eligible
    ? Math.round(salaryComponentMonthly * (15 / divisor) * effectiveYears)
    : 0;

  const statutoryCapApplied = gratuityBeforeCap > GRATUITY_STATUTORY_CAP;
  const gratuityAmount = statutoryCapApplied ? GRATUITY_STATUTORY_CAP : gratuityBeforeCap;

  return {
    salaryComponentMonthly,
    effectiveYears,
    divisor,
    formulaLabel,
    gratuityAmount,
    statutoryCapApplied,
    gratuityBeforeCap,
    eligible,
    ineligibilityReason,
  };
}

function roundServiceYearsForCoveredEmployer(years: number): number {
  const wholeYears = Math.floor(years);
  const remainder = years - wholeYears;
  return remainder >= 0.5 ? wholeYears + 1 : wholeYears;
}
