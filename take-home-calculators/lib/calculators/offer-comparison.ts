import { calculateSalaryBreakup, type SalaryBreakupResult } from "./salary-breakup";
import type { TaxRegime } from "./income-tax";
import type { ProfessionalTaxState, Gender } from "./professional-tax";
import { CITIES, type CityData, getEquivalentLpaInCity } from "../city-cost-data";

export interface OfferInput {
  label: string;
  annualCtc: number;
  cityName: string; // matches a CityData.name, or "" for unknown/other
  professionalTaxState: ProfessionalTaxState;
  gender: Gender;
  regimeChoice: "auto" | TaxRegime;
  oldRegimeDeductions: number;
  employerOffersNps: boolean;
  expectedAnnualHikePercent: number;
}

export interface OfferComputed {
  input: OfferInput;
  city: CityData | null;
  regimeUsed: TaxRegime;
  breakup: SalaryBreakupResult;
  takeHomePercentOfCtc: number;
  disposableAfterRentMonthly: number | null;
  rentToIncomePercent: number | null;
  annualRetirementContribution: number; // employer PF + gratuity + employer NPS, annualized
}

export function findCity(name: string): CityData | null {
  return CITIES.find((c) => c.name === name) ?? null;
}

export function computeOffer(input: OfferInput): OfferComputed {
  const employerNpsPercentOfBasic = input.employerOffersNps ? 0.1 : 0;

  const buildFor = (regime: TaxRegime) =>
    calculateSalaryBreakup({
      annualCtc: input.annualCtc,
      regime,
      professionalTaxState: input.professionalTaxState,
      gender: input.gender,
      oldRegimeDeductions: input.oldRegimeDeductions,
      employerNpsPercentOfBasic,
    });

  let regimeUsed: TaxRegime;
  let breakup: SalaryBreakupResult;

  if (input.regimeChoice === "auto") {
    const newRegime = buildFor("new");
    const oldRegime = buildFor("old");
    if (oldRegime.inHandMonthly > newRegime.inHandMonthly) {
      regimeUsed = "old";
      breakup = oldRegime;
    } else {
      regimeUsed = "new";
      breakup = newRegime;
    }
  } else {
    regimeUsed = input.regimeChoice;
    breakup = buildFor(regimeUsed);
  }

  const city = findCity(input.cityName);
  const takeHomePercentOfCtc = input.annualCtc > 0 ? (breakup.inHandMonthly * 12 * 100) / input.annualCtc : 0;

  const disposableAfterRentMonthly = city ? breakup.inHandMonthly - city.avgRent1BHK : null;
  const rentToIncomePercent = city && breakup.inHandMonthly > 0 ? (city.avgRent1BHK * 100) / breakup.inHandMonthly : null;

  const annualRetirementContribution = breakup.employerPfAnnual + breakup.gratuityAnnual + breakup.employerNpsAnnual;

  return {
    input,
    city,
    regimeUsed,
    breakup,
    takeHomePercentOfCtc,
    disposableAfterRentMonthly,
    rentToIncomePercent,
    annualRetirementContribution,
  };
}

export interface YearProjectionRow {
  year: number;
  inHandAnnual: number[]; // one per offer
  cumulativeInHand: number[]; // one per offer
}

/**
 * Projects annual in-hand pay forward using each offer's own expected hike
 * rate, compounding on the PREVIOUS in-hand figure. This is a simplification
 * (a real hike changes CTC composition too, not just a flat in-hand bump),
 * but it's the right level of precision for a "which grows faster" view —
 * more granularity would imply false confidence about future pay structures.
 */
export function projectOverYears(offers: OfferComputed[], years: number): YearProjectionRow[] {
  const rows: YearProjectionRow[] = [];
  const runningInHand = offers.map((o) => o.breakup.inHandMonthly * 12);
  const cumulative = offers.map(() => 0);

  for (let year = 1; year <= years; year++) {
    for (let i = 0; i < offers.length; i++) {
      if (year > 1) {
        runningInHand[i] = runningInHand[i] * (1 + offers[i].input.expectedAnnualHikePercent / 100);
      }
      cumulative[i] += runningInHand[i];
    }
    rows.push({ year, inHandAnnual: [...runningInHand], cumulativeInHand: [...cumulative] });
  }
  return rows;
}

export { getEquivalentLpaInCity, CITIES };
