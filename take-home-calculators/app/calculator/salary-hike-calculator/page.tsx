import type { Metadata } from "next";
import Link from "next/link";
import SalaryHikeCalculator from "@/components/SalaryHikeCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Salary Hike Calculator — Real In-Hand Increase After Tax";
const description =
  "Calculate how much your in-hand salary actually increases after a CTC hike — your take-home raise is usually smaller than your CTC raise because of progressive income tax.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/salary-hike-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/salary-hike-calculator") },
};

const faqs = [
  {
    question: "Why does a 20% hike not mean 20% more in-hand salary?",
    answer:
      "Because income tax is progressive — as your taxable income rises, a larger portion of the increase falls into higher tax slabs. A CTC hike also doesn't all flow through to your gross salary, since components like employer PF and gratuity often scale up too, without reaching your monthly cash pay at all.",
  },
  {
    question: "Does the hike percentage apply to CTC or basic salary?",
    answer:
      "Almost always to CTC. When an employer says \"you're getting a 15% hike,\" they mean your total CTC increases by 15% — not your basic salary, and definitely not your in-hand pay, which typically increases by a smaller percentage.",
  },
  {
    question: "How can I estimate the hike I need to reach a target take-home?",
    answer:
      "Because tax slabs are non-linear, there's no simple percentage you can back-calculate by hand — you generally need to try different CTC values (or use a calculator that solves for this) until the resulting in-hand figure matches your target.",
  },
];

export default function SalaryHikeCalculatorPage() {
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
        <span aria-current="page">Salary Hike Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Salary Hike Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        See what a CTC hike actually means for your monthly take-home pay — the two numbers
        almost never match.
      </p>

      <div className="mt-10">
        <SalaryHikeCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Why CTC Hikes and In-Hand Hikes Diverge</h2>
        <p className="mt-3 text-ink-soft">
          When a hike is announced as a percentage, it's calculated on your CTC — the full cost
          to the company, including components like employer PF contribution and gratuity that
          you never see as monthly cash. As your gross salary rises with the hike, a larger share
          of it gets taxed at higher slab rates, since India's income tax slabs are progressive.
          The combination of these two effects — CTC inflation from non-cash components, and
          rising marginal tax rates — means the percentage increase in your bank balance is
          almost always smaller than the percentage increase quoted in your appraisal letter.
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
            <Link href="/salary" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              In-Hand Salary Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/epf-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              EPF & VPF Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
