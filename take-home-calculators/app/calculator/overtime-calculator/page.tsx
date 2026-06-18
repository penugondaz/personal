import type { Metadata } from "next";
import Link from "next/link";
import OvertimeCalculator from "@/components/OvertimeCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Overtime Calculator — Overtime Pay Calculator (1.5x / 2x Rate)";
const description =
  "Calculate your overtime pay based on your basic salary, standard working hours, and the applicable overtime rate multiplier (1.5x, 2x, or custom).";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/overtime-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/overtime-calculator") },
};

const faqs = [
  {
    question: "What is the standard overtime rate in India?",
    answer:
      "The Factories Act, 1948 mandates double the ordinary wage rate for overtime for workers it covers. Many private-sector salaried employees not covered by the Factories Act are instead paid 1.5x by company policy, which is why this calculator offers both options plus a custom rate.",
  },
  {
    question: "What counts as the base wage for overtime calculation?",
    answer:
      "Typically Basic salary + Dearness Allowance (DA), not your full CTC or gross salary. This calculator uses Basic + DA as the wage base, divided by your standard monthly working hours to get an hourly rate.",
  },
  {
    question: "Is overtime pay taxable?",
    answer:
      "Yes, overtime pay is treated as regular salary income and taxed at your applicable slab rate — there's no special tax exemption for overtime earnings.",
  },
  {
    question: "Are salaried (non-hourly) employees entitled to overtime?",
    answer:
      "This varies by company policy and by whether you're classified as a 'workman' under applicable labor laws. Many salaried managerial/supervisory roles aren't legally entitled to overtime pay, even if the company chooses to pay it as a goodwill gesture.",
  },
];

export default function OvertimeCalculatorPage() {
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
        <span aria-current="page">Overtime Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Overtime Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate your overtime pay from your basic salary and the hours you&apos;ve worked
        beyond your standard schedule.
      </p>

      <div className="mt-10">
        <OvertimeCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How Overtime Pay Is Calculated</h2>
        <p className="mt-3 text-ink-soft">
          Overtime pay starts with your effective hourly rate, derived from your Basic + DA
          divided by your standard monthly working hours (typically 26 days × 8 hours = 208
          hours). That hourly rate is then multiplied by your applicable overtime rate — usually
          1.5x or 2x depending on your employer's policy and whether you're covered under
          factory-specific labor laws — and finally by the number of overtime hours actually
          worked.
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
            <Link href="/calculator/salary-hike-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              Salary Hike Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
