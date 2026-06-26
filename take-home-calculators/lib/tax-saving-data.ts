// take-home-calculators/lib/tax-saving-data.ts

export const TAX_SAVING_LPA_VALUES = [5, 10, 15];

export function taxSavingSlug(lpa: number): string {
  return `${String(lpa).replace(".", "-")}-lpa`;
}

export function parseTaxSavingSlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa$/);
  if (!match) return null;
  const lpa = Number(match[1].replace("-", "."));
  return TAX_SAVING_LPA_VALUES.includes(lpa) ? lpa : null;
}
