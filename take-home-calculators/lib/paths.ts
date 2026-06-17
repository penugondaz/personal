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
