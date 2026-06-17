import type { Metadata } from "next";
import Link from "next/link";
import AdvanceTaxCalculator from "@/components/AdvanceTaxCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Advance Tax Calculator — Quarterly Installment Schedule";
const description =
  "Calculate your advance tax liability and the four quarterly installment due dates, based on your estimated annual income and TDS already deducted.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/advance-tax-calculator") },
  openGraph: { title, description, url: absoluteUrl("/advance-tax-calculator") },
};

const faqs = [
  {
    question: "Who needs to pay advance tax?",
    answer:
      "Anyone whose total tax liability for the year, after subtracting TDS already deducted, exceeds ₹10,000. This commonly applies to freelancers, consultants, and salaried individuals with significant additional income from sources like capital gains, rent, or interest that aren't fully covered by TDS.",
  },
  {
    question: "What are the advance tax due dates?",
    answer:
      "Four installments: 15% of the year's liability by 15 June, a cumulative 45% by 15 September, a cumulative 75% by 15 December, and the full 100% by 15 March.",
  },
  {
    question: "What happens if I miss an advance tax installment?",
    answer:
      "Interest under Sections 234B and 234C applies for shortfall or late payment — typically 1% per month on the unpaid amount. This calculator shows the required schedule but doesn't calculate penalty interest for missed payments.",
  },
  {
    question: "Do salaried employees need to worry about advance tax?",
    answer:
      "Usually not, since employer TDS typically covers most or all of a salaried employee's tax liability. It becomes relevant if you have meaningful additional income — like capital gains, freelance work, rental income, or interest — that isn't already covered by TDS deductions.",
  },
];

export default function AdvanceTaxCalculatorPage() {
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
        <span aria-current="page">Advance Tax Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Advance Tax Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Find out whether you owe advance tax this year, and exactly how much is due at each of
        the four quarterly deadlines.
      </p>

      <div className="mt-10">
        <AdvanceTaxCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Why Advance Tax Exists</h2>
        <p className="mt-3 text-ink-soft">
          India runs on a "pay as you earn" tax system rather than letting your full year's tax
          bill come due at filing time. For income not already covered by TDS — like capital
          gains, freelance income, or rental income — the government requires you to estimate
          your annual liability and pay it in four installments through the year, rather than as
          a single lump sum after the financial year ends.
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
            <Link href="/capital-gains-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              Capital Gains Calculator
            </Link>
          </li>
          <li>
            <Link href="/salary" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              In-Hand Salary Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
