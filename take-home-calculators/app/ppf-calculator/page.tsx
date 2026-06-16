import type { Metadata } from "next";
import Link from "next/link";
import PpfCalculator from "@/components/PpfCalculator";
import { projectPpfMaturity, PPF_INTEREST_RATE, PPF_MAX_ANNUAL_DEPOSIT, PPF_LOCK_IN_YEARS } from "@/lib/calculators/ppf";
import { formatINR } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

const title = "PPF Calculator — Public Provident Fund Maturity & Interest Calculator";
const description =
  "Calculate your PPF maturity amount, total interest earned, and year-by-year balance growth at the current 7.1% interest rate, for any annual investment up to ₹1.5 lakh.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/ppf-calculator") },
  openGraph: { title, description, url: absoluteUrl("/ppf-calculator") },
};

const faqs = [
  {
    question: "What is the current PPF interest rate?",
    answer: `The PPF interest rate is ${(PPF_INTEREST_RATE * 100).toFixed(1)}% per annum, set by the government and reviewed quarterly. Unlike EPF, PPF interest compounds annually rather than monthly — it's calculated monthly on your lowest balance between the 5th and last day of each month, but only credited to your account once a year.`,
  },
  {
    question: "What is the maximum amount I can invest in PPF?",
    answer: `You can invest a minimum of ₹500 and a maximum of ${formatINR(PPF_MAX_ANNUAL_DEPOSIT)} per financial year. This limit applies across all your PPF accounts combined, including any minor accounts you manage. Deposits beyond this maximum don't earn interest and aren't eligible for Section 80C tax deduction.`,
  },
  {
    question: "What is the PPF lock-in period?",
    answer: `PPF has a ${PPF_LOCK_IN_YEARS}-year lock-in period. After maturity, you can withdraw the full amount, or extend the account in blocks of 5 years, with or without making further contributions. Partial withdrawals are permitted from the 7th financial year onward.`,
  },
  {
    question: "Is PPF interest taxable?",
    answer:
      "No. PPF has EEE (Exempt-Exempt-Exempt) tax status: your contributions qualify for Section 80C deduction (under the old tax regime), the interest earned every year is completely tax-free, and the maturity amount is also tax-free.",
  },
  {
    question: "Can I take a loan against my PPF account?",
    answer:
      "Yes, a loan against your PPF balance is available from the 3rd to the 6th year of account opening, without needing to pledge any other collateral.",
  },
];

export default function PpfCalculatorPage() {
  const exampleResult = projectPpfMaturity(150_000, 15);

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

      <nav className="mb-6 text-sm text-ink-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ledger">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">PPF Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">PPF Calculator</h1>
      <p className="mt-4 text-lg text-ink-muted">
        Calculate how much your Public Provident Fund investment will grow to at maturity. For
        example, investing {formatINR(150_000)} every year for 15 years at{" "}
        {(PPF_INTEREST_RATE * 100).toFixed(1)}% grows to{" "}
        <strong className="text-ledger">{formatINR(exampleResult.maturityAmount)}</strong>.
      </p>

      <div className="mt-10">
        <PpfCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How PPF Interest Is Calculated</h2>
        <p className="mt-3 text-ink-muted">
          PPF pays a government-declared interest rate, currently{" "}
          {(PPF_INTEREST_RATE * 100).toFixed(1)}% per annum. Unlike EPF, which compounds monthly,
          PPF interest is calculated on your account&apos;s lowest balance between the 5th and the
          last day of each month, but it&apos;s only credited to your account once a year, at the
          end of the financial year. This is why depositing your full annual amount before April
          5th — rather than spreading it across the year — maximizes the interest you earn.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">PPF vs. EPF</h2>
        <p className="mt-3 text-ink-muted">
          PPF and EPF are often confused, but they work differently. EPF is tied to your
          employment — both you and your employer contribute, at a statutory 12% of basic salary.
          PPF is an entirely self-funded account that any resident Indian can open, with no
          employer involvement at all, and a fixed annual contribution ceiling of{" "}
          {formatINR(PPF_MAX_ANNUAL_DEPOSIT)}. If you want to invest beyond your mandatory EPF
          contribution while staying within the EPF framework, look at a{" "}
          <Link href="/epf-calculator" className="text-ledger hover:underline">
            Voluntary Provident Fund (VPF)
          </Link>{" "}
          contribution instead.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-rule pb-4">
              <h3 className="font-medium text-ink">{faq.question}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li>
            <Link
              href="/epf-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-ledger hover:border-ledger"
            >
              EPF & VPF Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/salary"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-ledger hover:border-ledger"
            >
              In-Hand Salary Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
