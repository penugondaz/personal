import type { Metadata } from "next";
import Link from "next/link";
import ReturnsCalculator from "@/components/ReturnsCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "CAGR & XIRR Calculator — Investment Returns Calculator";
const description =
  "Calculate CAGR for a single investment over time, or XIRR for multiple irregular cash flows (lumpsum top-ups, SIPs, withdrawals) — the two standard ways to measure investment returns.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/cagr-xirr-calculator") },
  openGraph: { title, description, url: absoluteUrl("/cagr-xirr-calculator") },
};

const faqs = [
  {
    question: "What's the difference between CAGR and XIRR?",
    answer:
      "CAGR works for a single investment made once and held for a known period — it smooths the growth into one annual rate. XIRR is for investments with multiple cash flows at different dates (e.g. several lumpsum top-ups, or a SIP with an early withdrawal) — it accounts for the exact timing of each flow rather than just the start and end points.",
  },
  {
    question: "Why does my mutual fund app show XIRR instead of CAGR?",
    answer:
      "Because most real investments aren't a single lumpsum — SIPs, additional purchases, and partial withdrawals all create multiple cash flows at different dates. XIRR is built to handle exactly that, which is why platforms use it as the standard returns metric instead of CAGR.",
  },
  {
    question: "Can XIRR be negative?",
    answer:
      "Yes — a negative XIRR means your investment lost value annualized over the period, which can happen with significant market downturns relative to your investment timing.",
  },
  {
    question: "Why might the XIRR calculation fail to converge?",
    answer:
      "XIRR is solved numerically, and certain unusual cash-flow patterns (e.g. all flows on the same day, or alternating signs in an extreme pattern) can fail to converge to a single rate. Double-check your dates and amounts if you see this.",
  },
];

export default function ReturnsCalculatorPage() {
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
        <span aria-current="page">CAGR & XIRR Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">CAGR & XIRR Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Measure your investment&apos;s actual annualized return — use CAGR for a single lumpsum,
        or XIRR when you&apos;ve invested at multiple points in time.
      </p>

      <div className="mt-10">
        <ReturnsCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Choosing Between CAGR and XIRR</h2>
        <p className="mt-3 text-ink-soft">
          If you invested a single amount once and want to know its annualized growth rate, CAGR
          is the right tool — simple, fast, and easy to compare across different investments. But
          most real portfolios involve multiple transactions at different times: a SIP, an extra
          lumpsum during a market dip, maybe a partial withdrawal. In those cases, CAGR can&apos;t
          properly account for when each rupee was actually invested, which is exactly the gap
          XIRR fills by weighting each cash flow by its specific date.
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
            <Link href="/sip-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              SIP Calculator
            </Link>
          </li>
          <li>
            <Link href="/fd-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              FD Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
