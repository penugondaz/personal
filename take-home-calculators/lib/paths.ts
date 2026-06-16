/**
 * Subpath helpers for GitHub Pages deployment.
 *
 * Why this exists: with `output: "export"`, next/link and next/image
 * already account for `basePath` automatically when one is set. But
 * anything outside those — manual <img> tags, fetch() calls to /public
 * files, canonical URLs in metadata, sitemap.xml, robots.txt, JSON-LD
 * `url` fields — does NOT get the prefix applied for you. Use these
 * helpers anywhere you build a path or absolute URL by hand.
 *
 * Current deployment target: the Pages ROOT of the `personal` repo
 * (https://penugondaz.github.io/personal/), so BASE_PATH is "" in
 * production. If this app is ever moved to a subpath instead (e.g. to
 * free up the repo root for other content), set NEXT_PUBLIC_BASE_PATH
 * in the GitHub Actions workflow and everything here adjusts automatically.
 */

/** Subpath the app is served under. Currently "" (deployed at the repo's
 *  Pages root) — set NEXT_PUBLIC_BASE_PATH in the workflow if that changes. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Canonical production origin (no path). Update when a custom domain is live. */
export const SITE_ORIGIN = "https://penugondaz.github.io";

/** Full canonical base URL of the deployed site, no trailing slash.
 *  Currently resolves to "https://penugondaz.github.io/personal" (BASE_PATH is ""). */
export const SITE_URL = `${SITE_ORIGIN}/personal${BASE_PATH}`;

/**
 * Prefix a root-relative path with the deployment's base path.
 * Use for hand-written <img src>, fetch() of /public assets, etc.
 *
 *   withBasePath("/logo.svg") -> "/logo.svg" (BASE_PATH is currently "")
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
 *     "https://penugondaz.github.io/personal/salary/5-lpa-in-hand"
 */
export function absoluteUrl(path: string = "/"): string {
  const normalized = path === "/" ? "" : path.replace(/\/+$/, "");
  return `${SITE_URL}${normalized}`;
}
