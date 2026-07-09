import type { Metadata } from "next";
import Link from "next/link";
import ScssCalculator from "@/components/ScssCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Senior Citizen Savings Scheme (SCSS) Calculator — Quarterly Interest 2026";
const description =
  "Calculate your SCSS quarterly interest payout at 8.2% p.a. See total interest over the 5-year tenure for your Senior Citizen Savings Scheme deposit.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/scss-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/scss-calculator") },
};

const faqs = [
  {
    question: "What is the current SCSS interest rate?",
    answer:
      "The Senior Citizen Savings Scheme interest rate is 8.2% per annum for FY 2025-26, among the highest of government-backed small savings schemes. It's paid out quarterly, not compounded.",
  },
  {
    question: "Who is eligible for SCSS?",
    answer:
      "Individuals aged 60 and above, or 55+ for those who've retired under VRS or superannuation (with restrictions on when they can invest). A joint account can only be opened with a spouse.",
  },
  {
    question: "What is the SCSS deposit limit and tenure?",
    answer:
      "The minimum deposit is ₹1,000 and the maximum is ₹30 lakh (revised limit). The tenure is 5 years, extendable once by 3 more years after maturity.",
  },
  {
    question: "Is SCSS interest taxable?",
    answer:
      "Yes, SCSS interest is fully taxable at your income tax slab rate. TDS is deducted if total interest exceeds ₹50,000 in a financial year (₹1 lakh limit doesn't apply here — check current TDS thresholds with your bank).",
  },
];

export default function ScssCalculatorPage() {
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
        <Link href="/retirement" className="hover:text-brand">Retirement</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">SCSS Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Senior Citizen Savings Scheme (SCSS) Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate your quarterly interest payout and total returns on an SCSS deposit at the current 8.2% p.a.
        rate over the 5-year tenure.
      </p>

      <div className="mt-10">
        <ScssCalculator />
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
            { href: "/calculator/fd-calculator", label: "FD Calculator" },
            { href: "/calculator/ppf-calculator", label: "PPF Calculator" },
            { href: "/calculator/nsc-calculator", label: "NSC Calculator" },
            { href: "/calculator/gratuity-calculator", label: "Gratuity Calculator" },
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
