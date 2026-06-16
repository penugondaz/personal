/**
 * Subpath helpers for GitHub Pages deployment.
 *
 * Why this exists: with `output: "export"` + a non-root `basePath`,
 * next/link and next/image already account for basePath automatically.
 * But anything outside those — manual <img> tags, fetch() calls to /public
 * files, canonical URLs in metadata, sitemap.xml, robots.txt, JSON-LD
 * `url` fields — does NOT get the prefix applied for you. Use these
 * helpers anywhere you build a path or absolute URL by hand.
 */

/** Subpath the app is served under, e.g. "/personal/take-home-calculators".
 *  Empty string once a custom domain is attached. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Canonical production origin (no path). Update when a custom domain is live. */
export const SITE_ORIGIN = "https://penugondaz.github.io";

/** Full canonical base URL of the deployed site, no trailing slash. */
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

/**
 * Prefix a root-relative path with the deployment's base path.
 * Use for hand-written <img src>, fetch() of /public assets, etc.
 *
 *   withBasePath("/logo.svg") -> "/personal/take-home-calculators/logo.svg"
 */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`withBasePath expects a root-relative path, got: ${path}`);
  }
  return `${BASE_PATH}${path}`;
}

/**
 * Build a fully-qualified canonical URL for a route. Use in generateMetadata
 * (canonical, openGraph.url), JSON-LD `url`/`@id` fields, and sitemap.xml.
 *
 *   absoluteUrl("/salary/5-lpa-in-hand") ->
 *     "https://penugondaz.github.io/personal/take-home-calculators/salary/5-lpa-in-hand"
 */
export function absoluteUrl(path: string = "/"): string {
  const normalized = path === "/" ? "" : path.replace(/\/+$/, "");
  return `${SITE_URL}${normalized}`;
}
