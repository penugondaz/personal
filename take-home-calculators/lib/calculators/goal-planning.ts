export interface GoalPlanningInput {
  targetAmount: number;
  years: number;
  expectedAnnualReturn: number;
  existingInvestment?: number;
}

export interface GoalPlanningResult {
  targetAmount: number;
  years: number;
  existingInvestment: number;
  existingInvestmentFutureValue: number;
  gapToFill: number;
  requiredMonthlySip: number;
  requiredLumpsum: number;
  totalSipInvestment: number;
}

export function calculateGoalPlanning(input: GoalPlanningInput): GoalPlanningResult {
  const { targetAmount, years, expectedAnnualReturn, existingInvestment = 0 } = input;
  const monthlyRate = expectedAnnualReturn / 12 / 100;
  const totalMonths = years * 12;

  const existingFV = existingInvestment * Math.pow(1 + expectedAnnualReturn / 100, years);
  const gapToFill = Math.max(0, targetAmount - existingFV);

  // Required lumpsum today to reach gap
  const requiredLumpsum = gapToFill / Math.pow(1 + expectedAnnualReturn / 100, years);

  // Required monthly SIP: FV of annuity formula solved for PMT
  // FV = PMT × [((1+r)^n - 1) / r] × (1+r)
  let requiredMonthlySip = 0;
  if (monthlyRate > 0 && totalMonths > 0) {
    const factor = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    requiredMonthlySip = gapToFill / (factor * (1 + monthlyRate));
  } else if (totalMonths > 0) {
    requiredMonthlySip = gapToFill / totalMonths;
  }

  return {
    targetAmount,
    years,
    existingInvestment,
    existingInvestmentFutureValue: Math.round(existingFV),
    gapToFill: Math.round(gapToFill),
    requiredMonthlySip: Math.round(requiredMonthlySip),
    requiredLumpsum: Math.round(requiredLumpsum),
    totalSipInvestment: Math.round(requiredMonthlySip * totalMonths),
  };
}
