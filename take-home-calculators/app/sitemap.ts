import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/paths";
import { SALARY_LPA_VALUES, salarySlug } from "@/lib/salary-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { route: string; priority: number }[] = [
    { route: "/", priority: 1 },
    { route: "/salary", priority: 0.9 },
    { route: "/guides", priority: 0.6 },
    { route: "/guides/lpa-full-form", priority: 0.8 },
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
