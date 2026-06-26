// take-home-calculators/lib/salary-growth-data.ts

export const SALARY_GROWTH_LPA_VALUES = [3, 4, 5, 6, 7, 7.5, 8, 9, 10, 11, 12, 12.5, 13, 14, 15, 15.5, 16, 17, 18, 20, 22.5, 25, 30, 40, 50];

export function salaryGrowthSlug(lpa: number): string {
  return `${String(lpa).replace(".", "-")}-lpa`;
}

export function parseSalaryGrowthSlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa$/);
  if (!match) return null;
  const lpa = Number(match[1].replace("-", "."));
  return SALARY_GROWTH_LPA_VALUES.includes(lpa) ? lpa : null;
}
