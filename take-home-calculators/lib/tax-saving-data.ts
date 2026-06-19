// take-home-calculators/lib/tax-saving-data.ts

const WHOLE_LPA = Array.from({ length: 60 }, (_, i) => i + 1);
const HALF_LPA = [3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 12.5, 15.5, 17.5, 22.5];

export const TAX_SAVING_LPA_VALUES = [...WHOLE_LPA, ...HALF_LPA].sort((a, b) => a - b);

export function taxSavingSlug(lpa: number): string {
  return `${String(lpa).replace(".", "-")}-lpa`;
}

export function parseTaxSavingSlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa$/);
  if (!match) return null;
  const lpa = Number(match[1].replace("-", "."));
  return TAX_SAVING_LPA_VALUES.includes(lpa) ? lpa : null;
}
