import type { Metadata } from "next";
import Link from "next/link";
import EmiCalculator from "@/components/EmiCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Car Loan EMI Calculator — Monthly Installment & Interest 2026";
const description =
  "Calculate your car loan EMI, total interest, and full amortization schedule. Compare tenures and interest rates before you finance your vehicle.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/car-loan-emi-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/car-loan-emi-calculator") },
};

const faqs = [
  {
    question: "What's a typical car loan interest rate in India?",
    answer:
      "Car loan interest rates typically range from 8.5% to 12% per annum depending on the lender, your credit score, whether it's a new or used car, and the loan tenure. New cars generally get better rates than used cars.",
  },
  {
    question: "What's the usual car loan tenure?",
    answer:
      "Most car loans run 3-7 years (36-84 months). Shorter tenures mean higher EMIs but much less total interest paid; longer tenures lower the EMI but increase the total interest cost significantly.",
  },
  {
    question: "Should I make a larger down payment on a car loan?",
    answer:
      "Generally yes, if you can afford it. A larger down payment reduces the principal you're borrowing, which lowers both your EMI and total interest paid — and cars depreciate quickly, so financing less of the purchase price reduces the risk of owing more than the car is worth.",
  },
];

export default function CarLoanEmiCalculatorPage() {
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
        <span aria-current="page">Car Loan EMI Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Car Loan EMI Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate your monthly car loan installment, total interest, and full repayment schedule. Adjust the
        loan amount, rate, and tenure to compare options.
      </p>

      <div className="mt-10">
        <EmiCalculator initialLoanType="car" />
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
            { href: "/calculator/emi-calculator", label: "EMI Calculator (All Loan Types)" },
            { href: "/calculator/home-loan-eligibility-calculator", label: "Home Loan Eligibility" },
            { href: "/calculator/fd-calculator", label: "FD Calculator" },
            { href: "/calculator/compound-interest-calculator", label: "Compound Interest" },
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
