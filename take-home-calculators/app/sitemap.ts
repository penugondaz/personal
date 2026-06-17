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
    { route: "/epf-calculator", priority: 0.85 },
    { route: "/ppf-calculator", priority: 0.85 },
    { route: "/hra-calculator", priority: 0.8 },
    { route: "/gratuity-calculator", priority: 0.8 },
    { route: "/emi-calculator", priority: 0.8 },
    { route: "/sip-calculator", priority: 0.8 },
    { route: "/fd-calculator", priority: 0.8 },
    { route: "/salary-hike-calculator", priority: 0.75 },
    { route: "/rd-calculator", priority: 0.8 },
    { route: "/nps-calculator", priority: 0.8 },
    { route: "/cagr-xirr-calculator", priority: 0.8 },
    { route: "/leave-encashment-calculator", priority: 0.75 },
    { route: "/overtime-calculator", priority: 0.7 },
    { route: "/advance-tax-calculator", priority: 0.8 },
    { route: "/capital-gains-calculator", priority: 0.8 },
    { route: "/epf-vs-ppf", priority: 0.75 },
    { route: "/old-vs-new-tax-regime", priority: 0.85 },
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
