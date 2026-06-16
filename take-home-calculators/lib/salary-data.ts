/**
 * Single source of truth for which "X LPA in-hand salary" pages exist.
 *
 * Both app/salary/[slug]/page.tsx (generateStaticParams) and
 * app/sitemap.ts import from here, so the built pages and the sitemap
 * can never drift out of sync — add a value here once and it
 * automatically appears in both.
 */

// Whole-number LPA values, 1 through 60, plus the most commonly searched
// half-LPA and odd values seen in real keyword research (3.5, 4.5, 5.5,
// 7.5, 12.5, etc). Extend this list incrementally — each addition becomes
// a real statically-generated page at build time, so don't bulk-add
// without a corresponding content/SEO plan for each new page.
const WHOLE_LPA = Array.from({ length: 60 }, (_, i) => i + 1); // 1..60
const HALF_LPA = [3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 12.5, 15.5, 17.5, 22.5];

export const SALARY_LPA_VALUES = [...WHOLE_LPA, ...HALF_LPA].sort((a, b) => a - b);

/** Converts an LPA number to its URL slug, e.g. 5 -> "5-lpa-in-hand", 3.5 -> "3-5-lpa-in-hand". */
export function salarySlug(lpa: number): string {
  return `${String(lpa).replace(".", "-")}-lpa-in-hand`;
}

/** Parses a slug back to its LPA number, or null if it doesn't match a known page. */
export function parseSalarySlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa-in-hand$/);
  if (!match) return null;
  const lpa = Number(match[1].replace("-", "."));
  return SALARY_LPA_VALUES.includes(lpa) ? lpa : null;
}

export function lpaToAnnualCtc(lpa: number): number {
  return Math.round(lpa * 100_000);
}
