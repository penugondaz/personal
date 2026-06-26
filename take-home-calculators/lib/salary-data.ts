export const SALARY_LPA_VALUES = [5, 10, 15];

export function salarySlug(lpa: number): string {
  return `${String(lpa).replace(".", "-")}-lpa-in-hand`;
}

export function parseSalarySlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa-in-hand$/);
  if (!match) return null;
  const lpa = Number(match[1].replace("-", "."));
  return SALARY_LPA_VALUES.includes(lpa) ? lpa : null;
}

export function lpaToAnnualCtc(lpa: number): number {
  return Math.round(lpa * 100_000);
}
