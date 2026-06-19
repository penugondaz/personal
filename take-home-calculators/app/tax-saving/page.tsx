// take-home-calculators/app/tax-saving/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import {
  TAX_SAVING_LPA_VALUES,
  taxSavingSlug,
  calculateTaxSaving,
} from "@/lib/calculators/tax-saving";
import { formatINR } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Tax Saving Guide — How to Save Income Tax in India (FY 2025-26)",
  description:
    "Complete guide to saving income tax in India — Section 80C, NPS, health insurance, HRA, and home loan deductions. Find out exactly how much you can save based on your salary.",
  alternates: { canonical: absoluteUrl("/tax-saving") },
};

const DEDUCTIONS = [
  {
    section: "80C",
    title: "Section 80C",
    limit: "₹1,50,000",
    instruments: "ELSS, PPF, EPF, NSC, life insurance, tax-saving FDs",
    color: "brand",
  },
  {
    section: "80CCD(1B)",
    title: "NPS — Additional",
    limit: "₹50,000",
    instruments: "Over and above 80C limit; National Pension System contributions",
    color: "accent",
  },
  {
    section: "80D",
    title: "Health Insurance",
    limit: "₹75,000",
    instruments: "Self/spouse/children (₹25K) + senior citizen parents (₹50K)",
    color: "brand",
  },
  {
    section: "HRA",
    title: "House Rent Allowance",
    limit: "Varies",
    instruments: "Exemption if you pay rent — lowest of three limits applies",
    color: "accent",
  },
  {
    section: "24(b)",
    title: "Home Loan Interest",
    limit: "₹2,00,000",
    instruments: "Interest on loan for self-occupied property",
    color: "brand",
  },
  {
    section: "80EEA",
    title: "Affordable Housing",
    limit: "₹1,50,000",
    instruments: "Extra deduction for first-time buyers of affordable homes",
    color: "accent",
  },
];

export default function TaxSavingIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Tax Saving</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Tax Saving Guide — FY 2025-26
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Find out exactly how much income tax you pay on your salary — and the deductions
        that can legally reduce it. Select your CTC below for a personalised breakdown.
      </p>

      {/* Salary selector grid */}
      <section className="mt-10">
        <h2 className="font-display text-xl text-ink">Tax Saving by Salary Slab</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Click any CTC to see your current tax, marginal rate, and all available
          deductions with exact savings amounts.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TAX_SAVING_LPA_VALUES.map((lpa) => {
            const annualCtc = lpa * 100_000;
            const r = calculateTaxSaving({ annualCtc });
            return (
              <Link
                key={lpa}
                href={`/tax-saving/${taxSavingSlug(lpa)}`}
                className="block rounded-xl border border-rule bg-surface px-4 py-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg"
              >
                <span className="font-display text-lg text-ink">{lpa} LPA</span>
                <p className="tabular mt-1 text-xs text-ink-soft">
                  Tax: {formatINR(r.currentTaxNew)} (new)
                </p>
                {r.maxPossibleSaving > 0 && (
                  <p className="tabular text-xs font-medium text-brand">
                    Save up to {formatINR(r.maxPossibleSaving)}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Key Deductions Overview */}
      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink">Key Tax Saving Sections</h2>
        <p className="mt-3 text-ink-soft">
          All deductions below are available under the <strong className="text-ink">old tax
          regime</strong> only. The new regime (default since FY 2023-24) trades these
          deductions for lower slab rates and a higher standard deduction of ₹75,000.
        </p>
        <div className="mt-5 space-y-3">
          {DEDUCTIONS.map((d) => (
            <div
              key={d.section}
              className="flex items-start gap-4 rounded-xl border border-rule bg-surface px-4 py-4 shadow-card"
            >
              <div
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-semibold ${
                  d.color === "brand"
                    ? "bg-brand-soft text-brand"
                    : "bg-accent-soft text-accent"
                }`}
              >
                {d.section}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium text-ink">{d.title}</span>
                  <span className="tabular text-sm font-semibold text-brand">
                    up to {d.limit}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-ink-soft">{d.instruments}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New vs Old explanation */}
      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink">New vs Old Regime — Which to Choose?</h2>
        <p className="mt-3 text-ink-soft">
          Since FY 2023-24, the new tax regime is the default. It offers lower slab
          rates and a ₹75,000 standard deduction — but you give up almost every other
          deduction. The old regime's higher rates are offset by deductions that can
          reduce your taxable income substantially.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-rule bg-surface p-4">
            <h3 className="font-medium text-brand">Choose New Regime if…</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
              <li>You have no 80C investments or minimal ones</li>
              <li>You don't pay rent or live in your own home</li>
              <li>You don't have a home loan</li>
              <li>You prefer simplicity and fewer documents</li>
              <li>Your total deductions are less than the break-even point</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rule bg-surface p-4">
            <h3 className="font-medium text-brand">Choose Old Regime if…</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
              <li>You max out 80C (₹1.5L) + NPS (₹50K)</li>
              <li>You pay significant rent in a metro</li>
              <li>You have a home loan with large interest payments</li>
              <li>You pay health insurance for parents (80D ₹50K)</li>
              <li>Total deductions exceed your break-even amount</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li>
            <Link
              href="/calculator/old-vs-new-tax-regime"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              Old vs New Regime
            </Link>
          </li>
          <li>
            <Link
              href="/calculator/ppf-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              PPF Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/calculator/nps-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              NPS Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/calculator/hra-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              HRA Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/salary"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              In-Hand Salary Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/calculator/epf-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              EPF & VPF Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
