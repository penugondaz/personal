import type { Metadata } from "next";
import Link from "next/link";
import SsyCalculator from "@/components/SsyCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Sukanya Samriddhi Yojana (SSY) Calculator — Maturity Value 2026";
const description =
  "Calculate your Sukanya Samriddhi Yojana maturity value at 8.2% interest. See year-by-year growth for your girl child's savings, fully tax-free under 80C.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/ssy-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/ssy-calculator") },
};

const faqs = [
  {
    question: "What is the current SSY interest rate?",
    answer:
      "The Sukanya Samriddhi Yojana interest rate is 8.2% per annum, compounded annually, for FY 2025-26. The government revises small savings scheme rates every quarter.",
  },
  {
    question: "Who can open an SSY account?",
    answer:
      "A parent or legal guardian can open an SSY account for a girl child below 10 years of age. Only one account per girl child is allowed, and a family can open accounts for up to two girl children (three in case of twins on the second birth).",
  },
  {
    question: "When does the SSY account mature?",
    answer:
      "The account matures 21 years from the date of opening, or when the girl marries after age 18, whichever is earlier. Deposits are only required for the first 15 years — after that, the balance continues to earn interest until maturity.",
  },
  {
    question: "Is SSY interest and maturity amount taxable?",
    answer:
      "No. SSY has EEE (Exempt-Exempt-Exempt) tax status — your contribution is deductible under Section 80C (up to ₹1.5 lakh/year), the interest earned is tax-free, and the maturity amount is also fully tax-free.",
  },
];

export default function SsyCalculatorPage() {
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
        <span aria-current="page">SSY Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Sukanya Samriddhi Yojana (SSY) Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate the maturity value of your girl child&apos;s SSY account at the current 8.2% interest rate —
        fully tax-free under Section 80C.
      </p>

      <div className="mt-10">
        <SsyCalculator />
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
            { href: "/calculator/ppf-calculator", label: "PPF Calculator" },
            { href: "/calculator/scss-calculator", label: "SCSS Calculator" },
            { href: "/calculator/nsc-calculator", label: "NSC Calculator" },
            { href: "/tax-saving", label: "Tax Saving Guide" },
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
