import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/paths";
import { SALARY_LPA_VALUES, salarySlug } from "@/lib/salary-data";

// Required by Next.js when output: "export" is set — see robots.ts for
// the same note.
export const dynamic = "force-static";

/**
 * Generates /sitemap.xml at build time (static export compatible).
 *
 * Every URL here MUST be the full absolute URL including the GitHub Pages
 * subpath (https://penugondaz.github.io/personal/...). A sitemap with
 * root-relative or domain-root URLs will point Google at pages that
 * don't exist on this deployment.
 *
 * Programmatic salary pages are pulled from SALARY_LPA_VALUES in
 * lib/salary-data.ts — the same list generateStaticParams uses — so the
 * sitemap and the actually-built pages can never drift out of sync.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { route: string; priority: number }[] = [
    { route: "/", priority: 1 },
    { route: "/salary", priority: 0.9 },
    { route: "/guides", priority: 0.6 },
    { route: "/guides/lpa-full-form", priority: 0.8 },
    { route: "/epf-calculator", priority: 0.85 },
    { route: "/ppf-calculator", priority: 0.85 },
  ];

  const salaryRoutes = SALARY_LPA_VALUES.map((lpa) => ({
    route: `/salary/${salarySlug(lpa)}`,
    priority: 0.7,
  }));

  return [...staticRoutes, ...salaryRoutes].map(({ route, priority }) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));
}
