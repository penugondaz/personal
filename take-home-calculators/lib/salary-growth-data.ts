// take-home-calculators/lib/salary-growth-data.ts

const WHOLE_LPA = Array.from({ length: 60 }, (_, i) => i + 1);
const HALF_LPA = [3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 12.5, 15.5, 17.5, 22.5];

export const SALARY_GROWTH_LPA_VALUES = [...WHOLE_LPA, ...HALF_LPA].sort((a, b) => a - b);

export function salaryGrowthSlug(lpa: number): string {
  return `${String(lpa).replace(".", "-")}-lpa`;
}

export function parseSalaryGrowthSlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa$/);
  if (!match) return null;
  const lpa = Number(match[1].replace("-", "."));
  return SALARY_GROWTH_LPA_VALUES.includes(lpa) ? lpa : null;
}
