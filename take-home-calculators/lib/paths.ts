/**
 * Subpath helpers for GitHub Pages deployment.
 *
 * Why this exists: with `output: "export"` + a non-root `basePath`,
 * next/link and next/image already account for basePath automatically.
 * But anything outside those — manual <img> tags, fetch() calls to /public
 * files, canonical URLs in metadata, sitemap.xml, robots.txt, JSON-LD
 * `url` fields — does NOT get the prefix applied for you. Use these
 * helpers anywhere you build a path or absolute URL by hand.
 *
 * Current deployment target: https://penugondaz.github.io/personal/ — a
 * GitHub Pages "project site" (any repo other than <user>.github.io
 * itself), which GitHub always serves at username.github.io/<repo-name>/.
 * That /personal segment is therefore set via NEXT_PUBLIC_BASE_PATH in
 * the GitHub Actions workflow, NOT hardcoded here.
 */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const SITE_ORIGIN = "https://penugondaz.github.io";

export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`withBasePath expects a root-relative path, got: ${path}`);
  }
  return `${BASE_PATH}${path}`;
}

export function absoluteUrl(path: string = "/"): string {
  const normalized = path === "/" ? "" : path.replace(/\/+$/, "");
  return `${SITE_URL}${normalized}`;
}
