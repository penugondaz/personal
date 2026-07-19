// take-home-calculators/app/tax-saving/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { TAX_SAVING_LPA_VALUES, taxSavingSlug } from "@/lib/tax-saving-data";
import { calculateTaxSaving } from "@/lib/calculators/tax-saving";
import { formatINR } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, webPageSchema, faqSchema, buildJsonLd } from "@/lib/schema";
import LandingHubLinks from "@/components/LandingHubLinks";
import LandingFaq from "@/components/LandingFaq";

const URL = "/tax-saving";
const TITLE = "Tax Saving Guide by Salary — How to Reduce Income Tax in India (FY 2025-26)";
const DESCRIPTION =
  "Find your CTC and see exactly how much tax you pay and how much you can legally save using 80C, NPS, HRA, health insurance, and home loan deductions in FY 2025-26.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
};

const FEATURED_LPAS = [5, 6, 7, 8, 10, 12, 15, 20, 25, 30, 40, 50];

const FAQS = [
  {
    question: "Old regime or new regime — which saves more tax?",
    answer:
      "The new regime has lower slab rates but no deductions. The old regime has higher rates but allows 80C, HRA, home loan interest, and more. As a rough guide, if your total deductions exceed roughly ₹3.5-4 lakh/year (varies by income level), the old regime usually wins. Below that, the new regime is typically better. Use the Old vs New Tax Regime calculator with your exact numbers to be sure.",
  },
  {
    question: "What is the maximum I can save under Section 80C?",
    answer:
      "Section 80C caps total deductions at ₹1.5 lakh per financial year, covering PPF, ELSS, EPF, life insurance premiums, NSC, SSY, and home loan principal repayment combined — not ₹1.5 lakh per instrument. Beyond 80C, NPS offers an additional ₹50,000 deduction under Section 80CCD(1B), independent of the 80C limit.",
  },
  {
    question: "Is the new tax regime compulsory now?",
    answer:
      "The new regime is the default since FY 2023-24, meaning it applies automatically unless you specifically opt for the old regime while filing your return (or inform your employer at the start of the year for TDS purposes). Salaried employees can switch between regimes every year when filing their ITR.",
  },
  {
    question: "Does HRA exemption work under the new tax regime?",
    answer:
      "No. HRA exemption, along with most other deductions like 80C and home loan interest, is not available under the new tax regime. If you pay significant rent and claim HRA, the old regime is often more beneficial — the Income Tax Calculator lets you compare both directly.",
  },
];

export default function TaxSavingIndexPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Tax Saving", href: URL },
    ]),
    webPageSchema({ name: TITLE, description: DESCRIPTION, url: URL }),
    faqSchema(FAQS)
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Tax Saving</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Tax Saving by Salary — FY 2025-26
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Pick your CTC to see your current tax bill, all deduction options under 80C, NPS,
        health insurance, HRA, and home loans — and exactly how much you can save.
      </p>

      {/* What you'll find section */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {[
          { icon: "📊", label: "Current Tax", desc: "Exact tax under new and old regime" },
          { icon: "💰", label: "80C Benefits", desc: "ELSS, PPF, NSC, LIC and more" },
          { icon: "🏛️", label: "NPS Savings", desc: "Extra ₹50,000 under 80CCD(1B)" },
          { icon: "🏥", label: "Health Insurance", desc: "80D for self and parents" },
          { icon: "🏠", label: "HRA Exemption", desc: "Rent-based exemption calculation" },
          { icon: "🔑", label: "Home Loan", desc: "Sec. 24(b) interest deduction" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-rule bg-surface px-4 py-3 shadow-card">
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
        <h2 className="font-display text-xl text-ink">Popular CTC Slabs</h2>
        <p className="mt-2 text-sm text-ink-soft">Jump straight to a tax-saving guide for your salary.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {FEATURED_LPAS.map((lpa) => {
            const data = calculateTaxSaving(lpa * 100_000);
            return (
              <Link
                key={lpa}
                href={`/tax-saving/${taxSavingSlug(lpa)}`}
                className="block rounded-xl border border-rule bg-surface px-4 py-3.5 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg"
              >
                <span className="font-display text-lg text-ink">{lpa} LPA</span>
                <p className="tabular mt-1 text-xs text-deduction">
                  Tax: {formatINR(data.currentTaxNew)}
                </p>
                <p className="tabular text-xs text-brand">
                  Save up to: {formatINR(data.maxPossibleSavingOld)}
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
          {TAX_SAVING_LPA_VALUES.map((lpa) => (
            <li key={lpa}>
              <Link
                href={`/tax-saving/${taxSavingSlug(lpa)}`}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
              >
                {lpa} LPA
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Use-case callout */}
      <section className="mt-12 rounded-xl border border-brand/20 bg-brand-soft p-6">
        <h2 className="font-display text-xl text-ink">Not sure which regime to pick?</h2>
        <p className="mt-2 text-sm text-ink-soft">
          If you have significant 80C investments, pay rent, or have a home loan, the old regime
          often wins. If you claim few deductions, the new regime's lower rates usually come out
          ahead. Compare both directly with your exact numbers.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/calculator/old-vs-new-tax-regime"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
            Compare Regimes →
          </Link>
          <Link href="/calculator/income-tax-calculator"
            className="rounded-full border border-brand px-5 py-2 text-sm font-medium text-brand hover:bg-brand-soft transition">
            Income Tax Calculator
          </Link>
        </div>
      </section>

      {/* Educational content */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How Tax Saving Works in India</h2>
        <p className="mt-3 text-ink-soft">
          India's income tax system lets salaried individuals reduce their taxable income through
          specific government-approved investments and expenses. The key deductions fall under
          Chapter VI-A of the Income Tax Act — most notably Section 80C, which gives a flat
          ₹1.5 lakh deduction for approved investments like PPF, ELSS, life insurance premiums,
          and the principal repayment of home loans.
        </p>
        <p className="mt-3 text-ink-soft">
          Since FY 2023-24, the new tax regime is the default. It offers lower slab rates but
          removes most deductions. The old regime allows deductions but has higher rates —
          making it worth it only if your total deductions are large enough to offset the slab
          difference. This guide shows you both, for every salary level.
        </p>
      </section>

      {/* Related */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li>
            <Link href="/salary" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              In-Hand Salary Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/old-vs-new-tax-regime" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              Old vs New Regime
            </Link>
          </li>
          <li>
            <Link href="/calculator/hra-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              HRA Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/ppf-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              PPF Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/elss-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              ELSS Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/freelancer-tax-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              Freelancer Tax (44ADA)
            </Link>
          </li>
          <li>
            <Link href="/calculator/new-regime-break-even-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              New Regime Break-Even
            </Link>
          </li>
          <li>
            <Link href="/calculator/home-loan-tax-benefit-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              Home Loan Tax Benefit
            </Link>
          </li>
          <li>
            <Link href="/calculator/rsu-esop-tax-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              RSU/ESOP Tax Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/nri-income-tax-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              NRI Income Tax Calculator
            </Link>
          </li>
        </ul>
      </section>

      <LandingFaq faqs={FAQS} />
      <LandingHubLinks currentHref={URL} />
    </main>
  );
}
