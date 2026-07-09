import type { Metadata } from "next";
import Link from "next/link";
import HomeLoanEligibilityCalculator from "@/components/HomeLoanEligibilityCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Home Loan Eligibility Calculator — How Much Can You Borrow? 2026";
const description =
  "Calculate how much home loan you're eligible for based on your income, existing EMIs, interest rate, and tenure — using the FOIR method banks actually use.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/home-loan-eligibility-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/home-loan-eligibility-calculator") },
};

const faqs = [
  {
    question: "How do banks decide home loan eligibility?",
    answer:
      "Most lenders use FOIR (Fixed Obligation to Income Ratio) — they allow your total EMIs (including the new home loan) to be roughly 40-60% of your net monthly income, depending on your income level, credit score, and the lender's policy.",
  },
  {
    question: "Why is my eligible loan amount lower than expected?",
    answer:
      "Existing EMIs (car loans, personal loans, credit card debt) directly reduce how much new EMI — and therefore new loan — you qualify for. Paying off existing debt before applying can meaningfully increase your eligibility.",
  },
  {
    question: "Does a longer tenure increase eligibility?",
    answer:
      "Yes. A longer tenure lowers your monthly EMI for the same loan amount, which increases how much principal you can borrow within your affordable EMI. But it also means paying significantly more total interest over the loan's life.",
  },
  {
    question: "Is this the exact amount a bank will approve?",
    answer:
      "No — this is an estimate using the FOIR method. Actual approval also depends on your credit score (CIBIL), employment stability, age, co-applicant income, property valuation, and the specific bank's internal policy. Use this to plan, then confirm with lenders directly.",
  },
];

export default function HomeLoanEligibilityCalculatorPage() {
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
        <Link href="/loans-deposits" className="hover:text-brand">Loans & Deposits</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Home Loan Eligibility</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Home Loan Eligibility Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        See how much home loan you can likely qualify for, based on your income, existing debt, and the loan
        terms — using the same FOIR method banks use to assess eligibility.
      </p>

      <div className="mt-10">
        <HomeLoanEligibilityCalculator />
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
            { href: "/calculator/emi-calculator", label: "EMI Calculator" },
            { href: "/salary", label: "In-Hand Salary Calculator" },
            { href: "/calculator/hra-calculator", label: "HRA Calculator" },
            { href: "/calculator/fd-calculator", label: "FD Calculator" },
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
