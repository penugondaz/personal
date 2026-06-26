// take-home-calculators/lib/salary-growth-data.ts

export const SALARY_GROWTH_LPA_VALUES = [5, 10, 15];

export function salaryGrowthSlug(lpa: number): string {
  return `${String(lpa).replace(".", "-")}-lpa`;
}

export function parseSalaryGrowthSlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa$/);
  if (!match) return null;
  const lpa = Number(match[1].replace("-", "."));
  return SALARY_GROWTH_LPA_VALUES.includes(lpa) ? lpa : null;
}
