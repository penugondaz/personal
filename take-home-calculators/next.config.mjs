/**
 * Next.js config for GitHub Pages deployment.
 *
 * Repo: github.com/penugondaz/personal
 * Live URL: https://penugondaz.github.io/personal/take-home-calculators/
 *
 * GitHub Pages serves project sites from a subpath (the repo name), so every
 * internal link, asset, image, and route needs that prefix baked in at build
 * time. We do this via NEXT_PUBLIC_BASE_PATH so local dev (`npm run dev`)
 * stays at "/" while the GitHub Actions build sets the real subpath.
 *
 * If you later move to a custom domain, just stop setting BASE_PATH (or set
 * it to ""), and everything resolves back to root automatically.
 */

const isProd = process.env.NODE_ENV === "production";

// Subpath under which the site is served. Empty string = served at domain root
// (use this once you attach a custom domain). Must start with "/" and have no
// trailing slash, e.g. "/personal/take-home-calculators".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — required for GitHub Pages (no Node server available).
  output: "export",

  // Adds a trailing slash to all routes (e.g. /salary/5-lpa-in-hand/),
  // which produces /salary/5-lpa-in-hand/index.html. GitHub Pages resolves
  // directory requests to index.html automatically, so this avoids 404s
  // that plain `/salary/5-lpa-in-hand.html` files can run into with some
  // static hosts and keeps URLs clean for SEO.
  trailingSlash: true,

  // Served path prefix for all pages/routes.
  basePath,

  // Prefix used for JS/CSS/image assets pulled from /_next/*.
  assetPrefix: basePath,

  // Exposes basePath to client components so links/images can be built
  // consistently with next/link and next/image without hardcoding it.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  images: {
    // next/image's default loader needs a Node server for on-the-fly
    // optimization, which static export doesn't have. Unoptimized mode
    // serves the original files as-is — still fine for SEO/perf as long as
    // source images are pre-sized/compressed.
    unoptimized: true,
  },

  // Keep production builds strict; don't silently ship type errors
  // into thousands of programmatic pages. (Lint is run separately via
  // `npm run lint` / the eslint.config.mjs — Next 16 no longer accepts
  // an `eslint` key here.)
  typescript: {
    ignoreBuildErrors: false,
  },

  productionBrowserSourceMaps: false,

  ...(isProd
    ? {}
    : {
        // no-op placeholder for future dev-only overrides
      }),
};

export default nextConfig;
