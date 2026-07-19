import type { Metadata } from "next";
import Link from "next/link";
import HomeLoanTaxBenefitCalculator from "@/components/HomeLoanTaxBenefitCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "Home Loan Tax Benefit Calculator — Section 24(b), 80EEA & 80C (FY 2025-26)";
const DESCRIPTION =
  "Calculate your exact home loan tax benefit under Section 24(b) interest deduction, Section 80EEA additional deduction, and Section 80C principal repayment — with a year-by-year breakdown and old vs new regime comparison.";
const URL = "/calculator/home-loan-tax-benefit-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: [
    "home loan tax benefit calculator",
    "section 24b calculator",
    "80EEA calculator",
    "home loan interest deduction calculator",
    "home loan tax saving calculator india",
    "section 24 home loan interest",
  ],
};

const faqs = [
  {
    question: "How much home loan interest can I deduct under Section 24(b)?",
    answer:
      "For a self-occupied property, interest deduction is capped at ₹2,00,000 per year, and is only available under the old tax regime. For a let-out (rented) property, there's no cap on the interest deduction itself, but if it creates a loss, only ₹2,00,000 of that loss can be set off against your other income (like salary) each year — the rest carries forward.",
  },
  {
    question: "Can I claim home loan interest deduction under the new tax regime?",
    answer:
      "For a self-occupied property, no — Section 115BAC of the new regime disallows this deduction entirely. For a let-out property, you can still deduct interest against the rental income itself, but you cannot create a loss to set off against your salary or other income under the new regime.",
  },
  {
    question: "What is Section 80EEA and am I eligible?",
    answer:
      "Section 80EEA gives first-time home buyers an additional ₹1,50,000 interest deduction, over and above the ₹2,00,000 under Section 24(b) — but only if the property's stamp duty value is ₹45 lakh or less, and the loan was sanctioned between 1 April 2019 and 31 March 2022. If your loan was sanctioned outside that window, you won't qualify regardless of the other conditions.",
  },
  {
    question: "Can I claim both 80C principal repayment and 24(b) interest deduction?",
    answer:
      "Yes — they're separate sections. Section 80C covers principal repayment (up to ₹1,50,000/year, shared with your other 80C investments like PPF and ELSS), while Section 24(b) covers interest (up to ₹2,00,000/year for self-occupied). Both require the old tax regime.",
  },
  {
    question: "Does prepaying my home loan reduce my tax benefit?",
    answer:
      "It can. Since Section 24(b)'s ₹2,00,000 cap is usually already binding in the early years of a large loan (when interest is highest), prepaying principal mainly reduces future interest — which matters most once your annual interest naturally drops below the ₹2,00,000 cap later in the loan tenure. Prepaying early typically doesn't cost you any deduction, since you were already capped.",
  },
];

export default function HomeLoanTaxBenefitCalculatorPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Home Loan Tax Benefit Calculator", href: URL },
    ]),
    calculatorSchema({ name: TITLE, description: DESCRIPTION, url: URL }),
    faqSchema(faqs)
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/real-estate" className="hover:text-brand">Real Estate</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Home Loan Tax Benefit</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Home Loan Tax Benefit Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        See exactly how much tax your home loan saves you — Section 24(b) interest deduction,
        Section 80EEA extra deduction for first-time buyers, and Section 80C principal
        repayment — broken down year by year against your actual EMI schedule.
      </p>

      <div className="mt-10">
        <HomeLoanTaxBenefitCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How Home Loan Tax Benefits Work</h2>
        <p className="mt-3 text-ink-soft">
          A home loan offers tax relief in two separate places. Section 24(b) lets you deduct
          the interest portion of your EMI — up to ₹2,00,000 a year if you live in the property
          yourself, or without a fixed cap if it's rented out (though the loss you can offset
          against your salary is capped at ₹2,00,000). Section 80C separately covers the
          principal portion of your EMI, up to ₹1,50,000 a year — but this limit is shared with
          every other 80C investment you make, like PPF, ELSS, or life insurance premiums.
        </p>
        <p className="mt-3 text-ink-soft">
          First-time buyers of affordable housing get one more layer: Section 80EEA adds a
          further ₹1,50,000 interest deduction on top of the 24(b) cap, provided the property's
          stamp duty value doesn't exceed ₹45 lakh and the loan was sanctioned in the eligible
          window. All three of these — 24(b), 80EEA, and 80C — are available only if you stick
          with the old tax regime; the new regime removes them entirely for a self-occupied home.
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
          <li><Link href="/calculator/emi-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">EMI Calculator</Link></li>
          <li><Link href="/real-estate/home-affordability-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Home Affordability</Link></li>
          <li><Link href="/calculator/home-loan-eligibility-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Home Loan Eligibility</Link></li>
          <li><Link href="/calculator/old-vs-new-tax-regime" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Old vs New Regime</Link></li>
          <li><Link href="/calculator/income-tax-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Income Tax Calculator</Link></li>
          <li><Link href="/real-estate/stamp-duty-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Stamp Duty Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
