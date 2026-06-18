import type { Metadata } from "next";
import Link from "next/link";
import CapitalGainsCalculator from "@/components/CapitalGainsCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Capital Gains Calculator — STCG & LTCG Tax Calculator (Equity & Debt)";
const description =
  "Calculate short-term and long-term capital gains tax on equity shares, equity mutual funds, debt mutual funds, and other assets, based on current FY 2025-26 rules.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/capital-gains-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/capital-gains-calculator") },
};

const faqs = [
  {
    question: "What's the difference between short-term and long-term capital gains?",
    answer:
      "It depends on the asset and how long you held it. For listed equity and equity mutual funds, holding more than 12 months makes it long-term; 12 months or less is short-term. For debt mutual funds and most other assets, the threshold is 24 months.",
  },
  {
    question: "What are the current capital gains tax rates?",
    answer:
      "Following the Budget 2024 changes: long-term equity gains are taxed at 12.5% above a ₹1.25 lakh/year exemption; short-term equity gains are taxed flat at 20%; long-term gains on debt funds and other assets are taxed at 12.5% without indexation benefit; short-term gains on debt funds and other assets are taxed at your income slab rate.",
  },
  {
    question: "What happened to indexation benefit?",
    answer:
      "The Budget 2024 removed the indexation benefit (which previously let you adjust your purchase price for inflation) for most asset classes, replacing it with a flat 12.5% long-term rate instead of the earlier 20%-with-indexation rate. Certain real estate transactions retained an option to choose the old regime in specific transitional cases — consult a tax professional for property sales.",
  },
  {
    question: "Do I need to pay advance tax on capital gains?",
    answer:
      "Yes, capital gains are included in your estimated annual income for advance tax purposes if your overall tax liability after TDS exceeds ₹10,000. Since capital gains often arise unpredictably, the advance tax rules allow you to pay tax on gains in the installment immediately following when they occurred, without penalty for the earlier installments.",
  },
];

export default function CapitalGainsCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Capital Gains Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Capital Gains Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Estimate the tax due on your gains from equity, mutual funds, or other capital assets,
        based on how long you held them.
      </p>

      <div className="mt-10">
        <CapitalGainsCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">A Simplified Model</h2>
        <p className="mt-3 text-ink-soft">
          Real capital gains computation can involve cost inflation indexation history for assets
          purchased before specific cutoff dates, grandfathering provisions for equity held
          before January 31, 2018, and asset-specific carve-outs for property, gold, and other
          special cases. This calculator applies the current simplified post-Budget-2024 rules
          for the most common scenarios — equity shares, equity mutual funds, debt mutual funds —
          and isn&apos;t a substitute for professional tax advice on complex transactions.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-rule pb-4">
              <h3 className="font-medium text-ink">{faq.question}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li>
            <Link href="/calculator/advance-tax-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              Advance Tax Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/sip-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              SIP Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
