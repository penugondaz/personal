import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/paths";

// Required by Next.js when output: "export" is set — see robots.ts for
// the same note.
export const dynamic = "force-static";

/**
 * Generates /sitemap.xml at build time (static export compatible).
 *
 * Every URL here MUST be the full absolute URL including the GitHub Pages
 * subpath (https://penugondaz.github.io/personal/take-home-calculators/...).
 * A sitemap with root-relative or domain-root URLs will point Google at
 * pages that don't exist on this deployment.
 *
 * As programmatic salary/CTC/calculator pages are added (e.g. driven by a
 * generateStaticParams list or a content DB), import that same list here
 * and map it into entries — this keeps the sitemap and the actually-built
 * pages from drifting out of sync.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/"];

  return staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
