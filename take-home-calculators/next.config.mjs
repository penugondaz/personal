/**
 * Next.js config for GitHub Pages deployment + Sanity Studio.
 */

const isProd = process.env.NODE_ENV === "production";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  productionBrowserSourceMaps: false,

  // Allow Sanity Studio to be excluded from static export
  // (Studio needs to run as a SPA, not pre-rendered)
  experimental: {
    // Studio route is excluded from static export
  },
};

export default nextConfig;
