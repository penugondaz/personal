import type { Metadata } from "next";
import Link from "next/link";
import FdCalculator from "@/components/FdCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "FD Calculator — Fixed Deposit Maturity & Interest Calculator";
const description =
  "Calculate your Fixed Deposit maturity amount and interest earned, with support for monthly, quarterly, half-yearly, and annual compounding frequencies.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/fd-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/fd-calculator") },
};

const faqs = [
  {
    question: "How is FD interest calculated?",
    answer:
      "Most Indian bank FDs use compound interest with quarterly compounding by default: A = P × (1 + r/n)^(n×t), where P is your deposit, r is the annual rate, n is the number of compounding periods per year, and t is tenure in years.",
  },
  {
    question: "Why does compounding frequency matter?",
    answer:
      "More frequent compounding (e.g. monthly vs. annually) means interest gets added to your principal sooner, so it starts earning its own interest earlier. For the same nominal rate, monthly compounding yields a slightly higher maturity amount than annual compounding.",
  },
  {
    question: "Is FD interest taxable?",
    answer:
      "Yes. FD interest is added to your total income and taxed at your applicable slab rate. Banks deduct TDS if your interest income exceeds ₹40,000 in a year (₹50,000 for senior citizens), but you're still liable to pay any additional tax due based on your full income.",
  },
  {
    question: "What's the difference between cumulative and non-cumulative FDs?",
    answer:
      "A cumulative FD reinvests interest back into the deposit, paying out the full amount (principal + compounded interest) only at maturity — this calculator models a cumulative FD. A non-cumulative FD pays out interest periodically (monthly/quarterly) as income instead of compounding it.",
  },
];

export default function FdCalculatorPage() {
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
        <Link href="/loans-deposits" className="hover:text-brand">
          Loans & Deposits
        </Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">FD Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">FD Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate how much your Fixed Deposit will be worth at maturity, accounting for your
        bank&apos;s compounding frequency.
      </p>

      <div className="mt-10">
        <FdCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">FD vs. Other Fixed-Income Options</h2>
        <p className="mt-3 text-ink-soft">
          Fixed Deposits remain one of the most predictable investment options in India — your
          return is locked in at the time of deposit, regardless of how interest rates move
          afterward. This predictability comes at the cost of lower long-term returns compared to
          market-linked options like mutual funds, and FD interest is fully taxable at your slab
          rate, unlike instruments such as PPF, which offer tax-free interest.
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
            <Link href="/calculator/sip-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              SIP Calculator
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
