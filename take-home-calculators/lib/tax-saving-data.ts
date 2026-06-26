// take-home-calculators/lib/tax-saving-data.ts

export const TAX_SAVING_LPA_VALUES = [1, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 12, 12.5, 13, 14, 15, 15.5, 16, 17, 18, 19, 20, 21, 22, 22.5, 23, 24, 25, 26, 27, 28, 29, 30, 32, 35, 40, 45, 50, 55, 60];

export function taxSavingSlug(lpa: number): string {
  return `${String(lpa).replace(".", "-")}-lpa`;
}

export function parseTaxSavingSlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa$/);
  if (!match) return null;
  const lpa = Number(match[1].replace("-", "."));
  return TAX_SAVING_LPA_VALUES.includes(lpa) ? lpa : null;
}
