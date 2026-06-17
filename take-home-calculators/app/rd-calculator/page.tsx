import type { Metadata } from "next";
import Link from "next/link";
import RdCalculator from "@/components/RdCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "RD Calculator — Recurring Deposit Maturity Calculator";
const description =
  "Calculate your Recurring Deposit maturity amount and interest earned for any monthly deposit, interest rate, and tenure, with monthly or quarterly compounding.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/rd-calculator") },
  openGraph: { title, description, url: absoluteUrl("/rd-calculator") },
};

const faqs = [
  {
    question: "How is RD interest calculated?",
    answer:
      "Each monthly installment in a Recurring Deposit earns interest only for the time it remains in the account, compounded quarterly (the convention most Indian banks use). Earlier installments earn interest for longer than later ones.",
  },
  {
    question: "What's the difference between RD and FD?",
    answer:
      "An FD requires a single lumpsum deposit upfront, while an RD lets you build up savings with fixed monthly contributions. RD suits people without a large lumpsum on hand but who can commit to a regular monthly amount; FD suits those with savings already accumulated.",
  },
  {
    question: "Is RD interest taxable?",
    answer:
      "Yes, RD interest is fully taxable at your income tax slab rate, just like FD interest. Banks deduct TDS if total interest across your deposits exceeds ₹40,000 in a year (₹50,000 for senior citizens).",
  },
  {
    question: "Can I withdraw an RD before maturity?",
    answer:
      "Most banks allow premature withdrawal of an RD, but typically at a reduced interest rate and sometimes a penalty, similar to premature FD withdrawal rules.",
  },
];

export default function RdCalculatorPage() {
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
        <span aria-current="page">RD Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">RD Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate how much your monthly Recurring Deposit contributions will grow to at maturity.
      </p>

      <div className="mt-10">
        <RdCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How RD Interest Compounds</h2>
        <p className="mt-3 text-ink-soft">
          Unlike an FD where your entire deposit earns interest from day one, an RD&apos;s
          interest builds up gradually since each monthly installment starts earning only from
          the date it&apos;s deposited. Banks typically compound RD interest quarterly, applying
          the rate to each installment for however many full quarters remain until maturity —
          which is why the effective return on an RD is slightly lower than the same nominal rate
          on an equivalent FD.
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
            <Link href="/fd-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              FD Calculator
            </Link>
          </li>
          <li>
            <Link href="/sip-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              SIP Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
