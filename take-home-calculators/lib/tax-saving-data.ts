// take-home-calculators/lib/tax-saving-data.ts

export const TAX_SAVING_LPA_VALUES = [3, 4, 5, 6, 7, 7.5, 8, 9, 10, 11, 12, 12.5, 13, 14, 15, 15.5, 16, 17, 18, 20, 22.5, 25, 30, 40, 50];

export function taxSavingSlug(lpa: number): string {
  return `${String(lpa).replace(".", "-")}-lpa`;
}

export function parseTaxSavingSlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa$/);
  if (!match) return null;
  const lpa = Number(match[1].replace("-", "."));
  return TAX_SAVING_LPA_VALUES.includes(lpa) ? lpa : null;
}
