// Popular salary values for income tax programmatic pages
export const INCOME_TAX_LPA_VALUES = [
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 20, 22, 25, 30, 35, 40, 50
];

export function incomeTaxSlug(lpa: number): string {
  return `${String(lpa).replace(".", "-")}-lpa`;
}

export function parseIncomeTaxSlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa$/);
  if (!match) return null;
  const val = parseFloat(match[1].replace("-", "."));
  return INCOME_TAX_LPA_VALUES.includes(val) ? val : null;
}
