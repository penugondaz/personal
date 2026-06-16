import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/paths";

// Required by Next.js when output: "export" is set — metadata route
// handlers (robots.ts, sitemap.ts) must explicitly opt into static
// generation since they're technically route handlers under the hood.
export const dynamic = "force-static";

/**
 * Generates /robots.txt at build time (static export compatible).
 * Points crawlers at the sitemap using the full subpath-aware URL —
 * critical because the site is NOT served at the domain root.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
