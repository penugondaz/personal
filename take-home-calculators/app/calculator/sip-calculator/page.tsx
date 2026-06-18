import type { Metadata } from "next";
import Link from "next/link";
import SipCalculator from "@/components/SipCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "SIP Calculator — Systematic Investment Plan Returns Calculator";
const description =
  "Calculate the future value of your monthly SIP investments in mutual funds, including optional annual step-up, with a year-by-year growth breakdown.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/sip-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/sip-calculator") },
};

const faqs = [
  {
    question: "How is SIP return calculated?",
    answer:
      "Each monthly investment compounds at your expected rate of return for the remaining time until maturity. Because every installment is invested at a different point in time, the overall calculation is done month by month rather than with a single lump-sum formula.",
  },
  {
    question: "What return rate should I assume for equity mutual funds?",
    answer:
      "Long-term equity mutual fund returns in India have historically averaged roughly 10-14% annually over multi-year periods, though this varies significantly by fund, market cycle, and time horizon. Returns are never guaranteed — use a conservative estimate and treat any projection as indicative, not assured.",
  },
  {
    question: "What is SIP step-up and should I use it?",
    answer:
      "A step-up SIP increases your monthly investment by a fixed percentage every year, typically matching salary growth. It meaningfully increases your final corpus compared to a flat SIP of the same starting amount, since later (larger) installments still get years to compound.",
  },
  {
    question: "Is SIP better than a lumpsum investment?",
    answer:
      "SIP spreads your investment over time, which reduces the risk of investing a large amount right before a market downturn (rupee-cost averaging). A lumpsum invested early can outperform SIP in a rising market, but carries more timing risk. Most retail investors without a large lumpsum available default to SIP for this reason.",
  },
];

export default function SipCalculatorPage() {
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
        <span aria-current="page">SIP Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">SIP Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        See how your monthly mutual fund SIP investments could grow over time, with an optional
        annual step-up to match rising income.
      </p>

      <div className="mt-10">
        <SipCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How SIP Compounding Works</h2>
        <p className="mt-3 text-ink-soft">
          A Systematic Investment Plan invests a fixed amount every month into a mutual fund.
          Each installment starts compounding from the day it's invested, which means your
          earliest contributions have the most time to grow, while your most recent contributions
          have had the least. This is why starting early matters more than investing a larger
          amount later — time in the market does much of the work.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Disclaimer</h2>
        <p className="mt-3 text-ink-soft">
          This calculator is for illustration only and assumes a constant rate of return, which
          real mutual fund investments never actually deliver — returns fluctuate year to year.
          This is not investment advice; consult a registered financial advisor before making
          investment decisions.
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
            <Link href="/calculator/fd-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              FD Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/ppf-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              PPF Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
