import type { Metadata } from "next";
import Link from "next/link";
import RealReturnsCalculator from "@/components/RealReturnsCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Inflation-Adjusted Returns Calculator — Real Rate of Return 2026";
const description =
  "Calculate the real, inflation-adjusted value of your investment returns. See what your nominal returns are actually worth in today's purchasing power.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/real-returns-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/real-returns-calculator") },
};

const faqs = [
  {
    question: "What is the difference between nominal and real returns?",
    answer:
      "Nominal return is the percentage growth your investment shows on paper. Real return adjusts that for inflation, showing what your money is actually worth in today's purchasing power. A 7% FD with 6% inflation has a real return of roughly just 1%.",
  },
  {
    question: "How is the real rate of return calculated?",
    answer:
      "Using the Fisher equation: real rate = (1 + nominal rate) ÷ (1 + inflation rate) − 1. This is more accurate than simply subtracting inflation from the nominal rate, especially at higher rates.",
  },
  {
    question: "Why does this matter for retirement planning?",
    answer:
      "If your investments only match inflation, your purchasing power stays flat despite the account balance growing. Beating inflation by a meaningful margin (i.e., a positive real return) is what actually builds wealth over time — this is a key reason equity is often favored over fixed deposits for long-term goals.",
  },
];

export default function RealReturnsCalculatorPage() {
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
        <Link href="/investments" className="hover:text-brand">Investments</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Inflation-Adjusted Returns</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Inflation-Adjusted Returns Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        See what your investment is really worth after inflation — the difference between what your account
        balance shows and what it can actually buy.
      </p>

      <div className="mt-10">
        <RealReturnsCalculator />
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
            { href: "/calculator/sip-calculator", label: "SIP Calculator" },
            { href: "/calculator/swp-inflation-calculator", label: "SWP with Inflation" },
            { href: "/calculator/fd-calculator", label: "FD Calculator" },
            { href: "/calculator/goal-planning-calculator", label: "Goal Planning Calculator" },
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
