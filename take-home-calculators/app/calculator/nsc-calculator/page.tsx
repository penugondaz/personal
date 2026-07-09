import type { Metadata } from "next";
import Link from "next/link";
import NscCalculator from "@/components/NscCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "NSC Calculator 2025-26 — National Savings Certificate Returns";
const description =
  "Calculate NSC maturity value at 7.7% interest rate. See year-by-year interest, 80C tax eligibility, and total returns on your National Savings Certificate investment.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/nsc-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/nsc-calculator") },
};

const faqs = [
  {
    question: "What is the current NSC interest rate?",
    answer:
      "The NSC interest rate is 7.7% per annum for FY 2025-26, compounded annually. The government reviews this quarterly along with other small savings scheme rates.",
  },
  {
    question: "Is NSC interest taxable?",
    answer:
      "Yes. NSC interest is taxable at your income tax slab rate. However, since interest is deemed reinvested, it qualifies for 80C deduction for years 1–4. Only the final year's interest (year 5) is directly taxable without an offsetting 80C benefit.",
  },
  {
    question: "What is the NSC lock-in period?",
    answer:
      "NSC has a mandatory 5-year lock-in. Premature withdrawal is not allowed except in cases of investor death, court order, or forfeiture by a pledgee such as a bank.",
  },
  {
    question: "How does NSC compare to PPF and FD?",
    answer:
      "NSC offers 7.7% with a 5-year lock-in and 80C benefit. PPF offers 7.1% with a 15-year lock-in but fully tax-free returns. Bank FDs vary from 6.5–8% with flexible tenure, but interest is fully taxable. NSC is best for investors who want a guaranteed return with 80C benefit and a medium-term horizon.",
  },
];

export default function NscCalculatorPage() {
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
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/retirement" className="hover:text-brand">Retirement</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">NSC Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">NSC Calculator — National Savings Certificate</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate your NSC maturity value at the current 7.7% interest rate. NSC has a 5-year
        lock-in and qualifies for Section 80C deduction up to ₹1.5 lakh.
      </p>

      <div className="mt-10">
        <NscCalculator />
      </div>

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
          {[
            { href: "/calculator/ppf-calculator", label: "PPF Calculator" },
            { href: "/calculator/fd-calculator", label: "FD Calculator" },
            { href: "/calculator/epf-calculator", label: "EPF Calculator" },
            { href: "/tax-saving", label: "Tax Saving Guide" },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
