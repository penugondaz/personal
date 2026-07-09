import type { Metadata } from "next";
import Link from "next/link";
import EighthPayCommissionCalculator from "@/components/EighthPayCommissionCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "8th Pay Commission Salary Calculator — Fitment Factor Estimate 2026";
const description =
  "Estimate your revised basic pay, HRA, and gross salary under the 8th Pay Commission. Adjust the fitment factor (1.83x-3.83x) as negotiations continue — not yet finalised by the government.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/8th-pay-commission-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/8th-pay-commission-calculator") },
};

const faqs = [
  {
    question: "Has the 8th Pay Commission fitment factor been decided?",
    answer:
      "No. As of mid-2026, the Commission has completed stakeholder consultations across several states but has not submitted its final recommendations. Employee unions have proposed fitment factors ranging from 1.82x to 3.83x, while the government is reportedly considering keeping it close to 2.57x, the same multiplier used in the 7th Pay Commission.",
  },
  {
    question: "How is the fitment factor applied to my salary?",
    answer:
      "The standard formula is: Revised Basic Pay = Current Basic Pay × Fitment Factor. For example, at a 2.57x fitment factor, a current basic pay of ₹44,900 would become approximately ₹1,15,393.",
  },
  {
    question: "What happens to my Dearness Allowance (DA) when a new pay commission is implemented?",
    answer:
      "DA resets to 0% on the day the new pay commission's revised basic pay takes effect, since the DA accumulated under the old system is effectively absorbed into the fitment factor. DA then starts accumulating again from the next revision cycle (typically January and July).",
  },
  {
    question: "When will the 8th Pay Commission be implemented?",
    answer:
      "Based on past pay commission timelines (the 7th CPC took about 21 months from constitution to Cabinet approval), the 8th CPC's report is expected around mid-2027, with implementation and arrears likely retroactive to January 1, 2026 — though this hasn't been officially notified.",
  },
];

export default function EighthPayCommissionCalculatorPage() {
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
        <span aria-current="page">8th Pay Commission Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">8th Pay Commission Salary Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Estimate your revised basic pay, HRA, and gross salary under the 8th Pay Commission — adjust the
        fitment factor as negotiations between employee unions and the government continue.
      </p>

      <div className="mt-10">
        <EighthPayCommissionCalculator />
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
            { href: "/calculator/hra-calculator", label: "HRA Calculator" },
            { href: "/calculator/gratuity-calculator", label: "Gratuity Calculator" },
            { href: "/calculator/nps-calculator", label: "NPS Calculator" },
            { href: "/salary", label: "In-Hand Salary Calculator" },
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
