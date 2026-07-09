import type { Metadata } from "next";
import Link from "next/link";
import EmiCalculator from "@/components/EmiCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "EMI Calculator — Home, Personal, Car & Education Loan EMI Calculator";
const description =
  "Calculate your monthly EMI for home, personal, car, education, or business loans, with a full year-by-year amortization schedule showing principal and interest breakdown.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/emi-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/emi-calculator") },
};

const faqs = [
  {
    question: "What is the EMI formula?",
    answer:
      "EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the loan principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the loan tenure in months. This is the standard reducing-balance formula used by virtually all Indian lenders.",
  },
  {
    question: "Why does my EMI stay the same but the interest portion decrease over time?",
    answer:
      "Because interest is calculated on your outstanding loan balance, which shrinks every month as you pay down principal. Early in the loan, most of your EMI goes toward interest; by the final years, most of it goes toward principal — even though the total EMI amount itself doesn't change.",
  },
  {
    question: "Does prepaying my loan reduce the EMI or the tenure?",
    answer:
      "Most Indian lenders let you choose: keep the EMI the same and shorten the tenure (which saves more on total interest), or reduce the EMI and keep the original tenure. This calculator doesn't model prepayment directly, but reducing the tenure slider shows you the EMI difference for a shorter loan.",
  },
  {
    question: "What's a typical interest rate for each loan type?",
    answer:
      "Rates vary by lender and your credit profile, but as rough starting points: home loans often run 8-9.5%, car loans 8.5-11%, personal loans 11-16%, and education loans 9-12%. Always check current rates with your specific lender — these are not guaranteed rates.",
  },
];

export default function EmiCalculatorPage() {
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
        <span aria-current="page">EMI Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">EMI Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate your monthly loan installment for home, personal, car, education, or business
        loans, and see exactly how much goes to interest over the life of the loan.
      </p>

      <div className="mt-10">
        <EmiCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How EMI Is Calculated</h2>
        <p className="mt-3 text-ink-soft">
          Every EMI (Equated Monthly Installment) is calculated using the reducing-balance
          method: interest is charged only on what you still owe, not on the original loan
          amount. Because of this, your EMI amount stays fixed for the entire tenure, but the mix
          shifts — early payments are interest-heavy, while later payments are principal-heavy,
          even though the total monthly figure never changes.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Choosing the Right Tenure</h2>
        <p className="mt-3 text-ink-soft">
          A longer tenure lowers your monthly EMI but increases the total interest you pay over
          the life of the loan, sometimes substantially. A shorter tenure raises your monthly
          outflow but reduces total interest paid. Use the amortization schedule above to see
          exactly how much of your money goes to the bank versus toward your actual asset at
          different tenure lengths.
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
            <Link href="/calculator/fd-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              FD Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
