import type { Metadata } from "next";
import Link from "next/link";
import ElssCalculator from "@/components/ElssCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "ELSS Calculator — Tax Saving Mutual Fund Returns 2026";
const description =
  "Calculate ELSS mutual fund SIP returns and the Section 80C tax you save. ELSS has just a 3-year lock-in — the shortest among all tax-saving instruments.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/elss-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/elss-calculator") },
};

const faqs = [
  {
    question: "What is ELSS and how is it different from other 80C options?",
    answer:
      "ELSS (Equity Linked Savings Scheme) is a mutual fund that invests in equities and qualifies for Section 80C deduction. Unlike PPF (15-year lock-in) or NSC (5-year lock-in), ELSS has just a 3-year lock-in — the shortest of any 80C instrument.",
  },
  {
    question: "Are ELSS returns guaranteed?",
    answer:
      "No. ELSS invests in the stock market, so returns are market-linked and not guaranteed, unlike PPF, NSC, or FDs. Historically, well-managed ELSS funds have delivered 12-15% annualized returns over long periods, but this isn't assured.",
  },
  {
    question: "How is ELSS taxed at withdrawal?",
    answer:
      "Gains are treated as Long-Term Capital Gains (LTCG) since the minimum holding period exceeds 1 year. LTCG above ₹1.25 lakh in a financial year is taxed at 12.5%, with no indexation benefit (per the current LTCG rules).",
  },
  {
    question: "Can I claim ELSS deduction under the new tax regime?",
    answer:
      "No. Section 80C deductions, including ELSS, are only available under the old tax regime. If you've opted for the new regime, ELSS still works as an investment, but you won't get the tax deduction.",
  },
];

export default function ElssCalculatorPage() {
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
        <span aria-current="page">ELSS Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">ELSS Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Project your ELSS mutual fund SIP returns and see how much tax you save under Section 80C — with just a
        3-year lock-in, the shortest among tax-saving instruments.
      </p>

      <div className="mt-10">
        <ElssCalculator />
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
            { href: "/calculator/lumpsum-calculator", label: "Lumpsum Calculator" },
            { href: "/tax-saving", label: "Tax Saving Guide" },
            { href: "/calculator/old-vs-new-tax-regime", label: "Old vs New Regime" },
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
