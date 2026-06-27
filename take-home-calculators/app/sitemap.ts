import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/paths";
import { SALARY_LPA_VALUES, salarySlug } from "@/lib/salary-data";
import { TAX_SAVING_LPA_VALUES, taxSavingSlug } from "@/lib/tax-saving-data";
import { INCOME_TAX_LPA_VALUES, incomeTaxSlug } from "@/lib/income-tax-data";
import { SALARY_GROWTH_LPA_VALUES, salaryGrowthSlug } from "@/lib/salary-growth-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { route: string; priority: number }[] = [
    { route: "/", priority: 1 },
    { route: "/salary", priority: 0.9 },
    { route: "/guides", priority: 0.6 },
    { route: "/guides/lpa-full-form", priority: 0.8 },
    // Salary tools
    { route: "/salary/inhand-to-ctc-calculator", priority: 0.8 },
    { route: "/salary/salary-structure-calculator", priority: 0.8 },
    // Retirement & Savings
    { route: "/calculator/epf-calculator", priority: 0.85 },
    { route: "/calculator/epf-vs-ppf", priority: 0.75 },
    { route: "/calculator/ppf-calculator", priority: 0.85 },
    { route: "/calculator/nps-calculator", priority: 0.8 },
    { route: "/calculator/gratuity-calculator", priority: 0.8 },
    { route: "/calculator/nsc-calculator", priority: 0.8 },
    { route: "/calculator/fire-calculator", priority: 0.9 },
    { route: "/calculator/pm-surya-ghar-calculator", priority: 0.9 },
    { route: "/calculator/income-tax-calculator", priority: 0.95 },
    // Tax & Pay
    { route: "/calculator/hra-calculator", priority: 0.8 },
    { route: "/calculator/salary-hike-calculator", priority: 0.75 },
    { route: "/calculator/leave-encashment-calculator", priority: 0.75 },
    { route: "/calculator/overtime-calculator", priority: 0.7 },
    { route: "/calculator/advance-tax-calculator", priority: 0.8 },
    { route: "/calculator/capital-gains-calculator", priority: 0.8 },
    { route: "/calculator/old-vs-new-tax-regime", priority: 0.85 },
    // Investments
    { route: "/calculator/sip-calculator", priority: 0.8 },
    { route: "/calculator/step-up-sip-calculator", priority: 0.8 },
    { route: "/calculator/lumpsum-calculator", priority: 0.8 },
    { route: "/calculator/mutual-fund-calculator", priority: 0.8 },
    { route: "/calculator/swp-calculator", priority: 0.75 },
    { route: "/calculator/swp-inflation-calculator", priority: 0.75 },
    { route: "/calculator/goal-planning-calculator", priority: 0.8 },
    { route: "/calculator/stock-average-calculator", priority: 0.7 },
    { route: "/calculator/xirr-calculator", priority: 0.75 },
    { route: "/calculator/lic-xirr-calculator", priority: 0.85 },
    { route: "/calculator/cagr-xirr-calculator", priority: 0.8 },
    // Loans & Deposits
    { route: "/calculator/emi-calculator", priority: 0.8 },
    { route: "/calculator/fd-calculator", priority: 0.8 },
    { route: "/calculator/rd-calculator", priority: 0.8 },
    { route: "/calculator/compound-interest-calculator", priority: 0.8 },
    { route: "/calculator/simple-interest-calculator", priority: 0.75 },
    // Tax Saving
    { route: "/tax-saving", priority: 0.9 },
    // Salary Growth
    { route: "/salary-growth", priority: 0.9 },
    // Layoffs Tracker
    { route: "/layoffs", priority: 0.95 },
    { route: "/calculator/layoff-risk-calculator", priority: 0.95 },
    // Free Tools
    { route: "/tools", priority: 0.85 },
    { route: "/tools/discount-calculator", priority: 0.75 },
    { route: "/tools/percentage-calculator", priority: 0.75 },
    { route: "/tools/average-calculator", priority: 0.75 },
    { route: "/tools/number-converter", priority: 0.75 },
    { route: "/tools/character-counter", priority: 0.75 },
    { route: "/tools/word-counter", priority: 0.75 },
    { route: "/tools/text-case-converter", priority: 0.75 },
  ];

  const salaryRoutes = SALARY_LPA_VALUES.map((lpa) => ({
    route: `/salary/${salarySlug(lpa)}`,
    priority: 0.7,
  }));

  const taxSavingRoutes = TAX_SAVING_LPA_VALUES.map((lpa) => ({
    route: `/tax-saving/${taxSavingSlug(lpa)}`,
    priority: 0.75,
  }));

  const salaryGrowthRoutes = SALARY_GROWTH_LPA_VALUES.map((lpa) => ({
    route: `/salary-growth/${salaryGrowthSlug(lpa)}`,
    priority: 0.75,
  }));



  const incomeTaxRoutes = INCOME_TAX_LPA_VALUES.map(lpa => ({
    route: `/calculator/income-tax-calculator/${incomeTaxSlug(lpa)}`,
    priority: 0.75,
  }));

  return [...staticRoutes, ...incomeTaxRoutes, ...salaryRoutes, ...taxSavingRoutes, ...salaryGrowthRoutes].map(
    ({ route, priority }) => ({
      url: absoluteUrl(route),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority,
    })
  );
}
