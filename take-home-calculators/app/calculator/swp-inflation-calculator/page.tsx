import type { Metadata } from "next";
import Link from "next/link";
import SwpInflationCalculator from "@/components/SwpInflationCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "SWP Calculator with Inflation — Systematic Withdrawal Plan India";
const description =
  "Plan retirement withdrawals with inflation-adjusted monthly payouts. See how long your corpus lasts when withdrawal amounts increase every month to beat inflation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/swp-inflation-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/swp-inflation-calculator") },
};

const faqs = [
  {
    question: "What is SWP with inflation adjustment?",
    answer:
      "A standard SWP withdraws a fixed amount monthly. With inflation adjustment, the withdrawal amount increases every month to maintain purchasing power — so if you withdraw ₹30,000 today at 6% inflation, you withdraw a little more each month. This better models real retirement needs.",
  },
  {
    question: "What return rate should I use for retirement planning?",
    answer:
      "Conservative retirees use 7–8% (debt-heavy portfolio). A balanced 50/50 portfolio may target 9–10%. Equity-heavy portfolios may assume 11–12%, but with higher volatility risk. Always model conservatively.",
  },
  {
    question: "How do I know if my corpus is enough?",
    answer:
      "If the calculator shows your corpus is exhausted before your target period, you either need a larger starting corpus, a lower monthly withdrawal, a higher return rate, or a combination. A common thumb rule is that a corpus of 25× your annual expenses is a safe retirement target (the '4% rule').",
  },
];

export default function SwpInflationCalculatorPage() {
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
        <Link href="/calculator/swp-calculator" className="hover:text-brand">SWP Calculator</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">With Inflation</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">SWP Calculator with Inflation</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Plan your retirement withdrawals with inflation-adjusted monthly payouts. See how long your
        corpus lasts when withdrawals increase every month to maintain purchasing power.
      </p>

      <div className="mt-10">
        <SwpInflationCalculator />
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
            { href: "/calculator/swp-calculator", label: "SWP Calculator" },
            { href: "/calculator/sip-calculator", label: "SIP Calculator" },
            { href: "/calculator/goal-planning-calculator", label: "Goal Planning" },
            { href: "/calculator/epf-calculator", label: "EPF Calculator" },
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
