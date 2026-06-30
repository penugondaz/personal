// Popular monthly in-hand salary amounts for programmatic pages
export const INHAND_MONTHLY_VALUES = [
  15_000, 20_000, 25_000, 30_000, 35_000, 40_000, 45_000, 50_000,
  60_000, 70_000, 75_000, 80_000, 90_000, 100_000,
  125_000, 150_000, 175_000, 200_000, 250_000, 300_000,
];

export function inhandSlug(monthly: number): string {
  return `inhand-${monthly}-per-month`;
}

export function parseInhandSlug(slug: string): number | null {
  const match = slug.match(/^inhand-(\d+)-per-month$/);
  if (!match) return null;
  const val = Number(match[1]);
  return INHAND_MONTHLY_VALUES.includes(val) ? val : null;
}
