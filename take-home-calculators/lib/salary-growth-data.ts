// take-home-calculators/lib/salary-growth-data.ts

export const SALARY_GROWTH_LPA_VALUES = [1, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 17, 18, 19, 20, 21, 22, 22.5, 23, 24, 25, 26, 27, 28, 29, 30, 32, 35, 40, 42, 45, 50, 55, 60];

export function salaryGrowthSlug(lpa: number): string {
  return `${String(lpa).replace(".", "-")}-lpa`;
}

export function parseSalaryGrowthSlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa$/);
  if (!match) return null;
  const lpa = Number(match[1].replace("-", "."));
  return SALARY_GROWTH_LPA_VALUES.includes(lpa) ? lpa : null;
}
