// take-home-calculators/app/salary-growth/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { SALARY_GROWTH_LPA_VALUES, salaryGrowthSlug } from "@/lib/salary-growth-data";
import { calculateSalaryGrowth } from "@/lib/calculators/salary-growth";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Salary Growth Calculator by CTC — Project Your Salary in 5 & 10 Years (India)",
  description:
    "See how your salary grows over 5 and 10 years at different annual hike rates — 8%, 12%, 18%, and 25%. Free salary growth projection for any CTC in India.",
  alternates: { canonical: absoluteUrl("/salary-growth") },
};

const FEATURED_LPAS = [5, 6, 7, 8, 10, 12, 15, 20, 25, 30, 40, 50];

export default function SalaryGrowthIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Salary Growth</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Salary Growth Calculator — India
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Pick your current CTC to see where your salary lands in 5 and 10 years — across
        conservative, average, good, and exceptional hike scenarios.
      </p>

      {/* What you get */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {[
          { icon: "📈", label: "5-Year Projection", desc: "CTC and in-hand at 4 hike rates" },
          { icon: "🔭", label: "10-Year Projection", desc: "Long-term salary trajectory" },
          { icon: "💸", label: "Real vs Nominal Growth", desc: "After adjusting for 6% inflation" },
          { icon: "🏦", label: "Total Lifetime Earnings", desc: "Cumulative in-hand over 10 years" },
          { icon: "📊", label: "Year-by-Year Table", desc: "Full breakup for every year" },
          { icon: "🎯", label: "All Hike Scenarios", desc: "8% · 12% · 18% · 25% hike rates" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-xl border border-rule bg-surface px-4 py-3 shadow-card"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-medium text-ink">{item.label}</p>
              <p className="text-xs text-ink-soft">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured CTCs */}
      <section className="mt-12">
        <h2 className="font-display text-xl text-ink">Popular Starting Salaries</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Jump to a full 10-year growth projection for your CTC.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {FEATURED_LPAS.map((lpa) => {
            const data = calculateSalaryGrowth(lpa * 100_000);
            const avg = data.scenarios[1]; // 12% scenario
            return (
              <Link
                key={lpa}
                href={`/salary-growth/${salaryGrowthSlug(lpa)}`}
                className="block rounded-xl border border-rule bg-surface px-4 py-3.5 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg"
              >
                <span className="font-display text-lg text-ink">{lpa} LPA</span>
                <p className="tabular mt-1 text-xs text-ink-soft">
                  Now: {formatINR(data.startingInHand)}/mo
                </p>
                <p className="tabular text-xs text-brand">
                  In 10yr @12%: {formatINRCompact(avg.ctcAt10Years)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All LPAs */}
      <section className="mt-12">
        <h2 className="font-display text-xl text-ink">All CTC Slabs</h2>
        <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {SALARY_GROWTH_LPA_VALUES.map((lpa) => (
            <li key={lpa}>
              <Link
                href={`/salary-growth/${salaryGrowthSlug(lpa)}`}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
              >
                {lpa} LPA
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Education */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How Salary Growth Works in India</h2>
        <p className="mt-3 text-ink-soft">
          Annual salary hikes in India's private sector typically range from 8% to 15% for solid
          performers, with top performers in high-growth sectors like tech, consulting, and
          fintech often seeing 20–30%+ through promotions and job switches.
        </p>
        <p className="mt-3 text-ink-soft">
          The compounding effect of consistent hikes is dramatic. A ₹10 LPA salary growing at
          12% annually becomes ₹{formatINRCompact(Math.round(1_000_000 * Math.pow(1.12, 10)))} in
          10 years — over 3× the starting CTC. But your actual take-home grows slower due to
          India's progressive tax slabs: as your CTC rises, a larger share gets taxed at higher
          rates, so the in-hand increase is always smaller than the CTC increase.
        </p>
      </section>

      {/* Related */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li>
            <Link href="/calculator/salary-hike-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              Salary Hike Calculator
            </Link>
          </li>
          <li>
            <Link href="/salary" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              In-Hand Salary Calculator
            </Link>
          </li>
          <li>
            <Link href="/tax-saving" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              Tax Saving Guide
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
