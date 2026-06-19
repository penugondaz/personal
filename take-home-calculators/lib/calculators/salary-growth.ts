// take-home-calculators/lib/calculators/salary-growth.ts

import { calculateSalaryBreakup } from "./salary-breakup";

export const HIKE_SCENARIOS = [
  { label: "Conservative", percent: 8, color: "text-ink-soft", bg: "bg-paper" },
  { label: "Average", percent: 12, color: "text-brand", bg: "bg-brand-soft" },
  { label: "Good", percent: 18, color: "text-accent", bg: "bg-accent-soft" },
  { label: "Exceptional", percent: 25, color: "text-purple-700", bg: "bg-purple-50" },
] as const;

export type HikeScenario = (typeof HIKE_SCENARIOS)[number];

export interface YearProjection {
  year: number;
  ctc: number;
  inHandMonthly: number;
  inHandAnnual: number;
  cumulativeGrowthPercent: number;
}

export interface ScenarioProjection {
  hikePercent: number;
  label: string;
  color: string;
  bg: string;
  years: YearProjection[];
  ctcAt5Years: number;
  ctcAt10Years: number;
  inHandAt5Years: number;
  inHandAt10Years: number;
  totalEarnedOver10Years: number;
}

export interface SalaryGrowthResult {
  startingCtc: number;
  startingInHand: number;
  scenarios: ScenarioProjection[];
  // Industry context benchmarks
  industryAvgHike: number;
  inflationRate: number;
  realGrowthAt12Pct: number; // real growth after inflation at 12% hike
}

function projectScenario(
  startingCtc: number,
  hikePercent: number,
  label: string,
  color: string,
  bg: string
): ScenarioProjection {
  const years: YearProjection[] = [];
  let currentCtc = startingCtc;

  for (let year = 1; year <= 10; year++) {
    currentCtc = Math.round(currentCtc * (1 + hikePercent / 100));
    const breakup = calculateSalaryBreakup({ annualCtc: currentCtc, regime: "new" });
    years.push({
      year,
      ctc: currentCtc,
      inHandMonthly: Math.round(breakup.inHandMonthly),
      inHandAnnual: Math.round(breakup.inHandAnnual),
      cumulativeGrowthPercent:
        Math.round(((currentCtc - startingCtc) / startingCtc) * 10000) / 100,
    });
  }

  const at5 = years[4];
  const at10 = years[9];

  // Rough total earned over 10 years (sum of annual in-hand)
  const totalEarned = years.reduce((sum, y) => sum + y.inHandAnnual, 0);

  return {
    hikePercent,
    label,
    color,
    bg,
    years,
    ctcAt5Years: at5.ctc,
    ctcAt10Years: at10.ctc,
    inHandAt5Years: at5.inHandMonthly,
    inHandAt10Years: at10.inHandMonthly,
    totalEarnedOver10Years: totalEarned,
  };
}

export function calculateSalaryGrowth(annualCtc: number): SalaryGrowthResult {
  const startBreakup = calculateSalaryBreakup({ annualCtc, regime: "new" });

  const scenarios = HIKE_SCENARIOS.map((s) =>
    projectScenario(annualCtc, s.percent, s.label, s.color, s.bg)
  );

  // Real growth = ((1 + nominal) / (1 + inflation)) - 1
  const inflation = 0.06;
  const nominal = 0.12;
  const realGrowthAt12Pct = Math.round(((1 + nominal) / (1 + inflation) - 1) * 10000) / 100;

  return {
    startingCtc: annualCtc,
    startingInHand: Math.round(startBreakup.inHandMonthly),
    scenarios,
    industryAvgHike: 12,
    inflationRate: 6,
    realGrowthAt12Pct,
  };
}
