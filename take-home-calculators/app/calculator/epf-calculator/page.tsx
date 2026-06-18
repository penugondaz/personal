import type { Metadata } from "next";
import Link from "next/link";
import EpfVpfCalculator from "@/components/EpfVpfCalculator";
import { EPF_INTEREST_RATE_FY2025_26, PF_RATE, EPS_RATE, EPF_EMPLOYER_SHARE_RATE, VPF_TAXABLE_INTEREST_THRESHOLD } from "@/lib/calculators/epf";
import { formatINR } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

const title = "EPF & VPF Calculator — Provident Fund Interest & Maturity Calculator";
const description =
  "Calculate your EPF (Employees' Provident Fund) and VPF (Voluntary Provident Fund) monthly contributions, employer share, and projected maturity value at the current 8.25% interest rate.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/epf-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/epf-calculator") },
};

const faqs = [
  {
    question: "What is the current EPF interest rate?",
    answer: `The EPF interest rate is ${(EPF_INTEREST_RATE_FY2025_26 * 100).toFixed(2)}% per annum for FY 2025-26, declared by EPFO. Interest is calculated monthly on your running balance but credited to your account annually.`,
  },
  {
    question: "How is the 12% EPF contribution split?",
    answer: `Both you and your employer contribute ${(PF_RATE * 100).toFixed(0)}% of your Basic + DA each month. Your full ${(PF_RATE * 100).toFixed(0)}% goes into your EPF account. Your employer's ${(PF_RATE * 100).toFixed(0)}% is split: ${(EPF_EMPLOYER_SHARE_RATE * 100).toFixed(2)}% goes into your EPF account, and ${(EPS_RATE * 100).toFixed(2)}% goes into the Employees' Pension Scheme (EPS), which is capped at a ₹15,000 monthly wage base regardless of your actual salary.`,
  },
  {
    question: "What is VPF and how is it different from EPF?",
    answer:
      "VPF (Voluntary Provident Fund) lets you contribute more than the mandatory 12% EPF rate — up to 100% of your Basic + DA — into the same EPF account, at the same interest rate. Unlike EPF, your employer doesn't match your VPF contribution, and VPF contributions are locked in for 5 years for tax-free withdrawal.",
  },
  {
    question: "Is EPF/VPF interest taxable?",
    answer: `EPF and VPF both have EEE (Exempt-Exempt-Exempt) tax treatment under normal circumstances. However, if your combined EPF + VPF employee contribution in a financial year exceeds ${formatINR(VPF_TAXABLE_INTEREST_THRESHOLD)}, the interest earned on the amount above that threshold becomes taxable.`,
  },
  {
    question: "Can I withdraw my EPF before retirement?",
    answer:
      "Yes, under specific circumstances — unemployment for over a month (partial withdrawal), or over two months (full withdrawal), as well as for home purchase, medical emergencies, marriage, or education, subject to EPFO's eligibility rules for each reason.",
  },
];

export default function EpfVpfCalculatorPage() {
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
        <span aria-current="page">EPF & VPF Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">EPF & VPF Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        See your monthly EPF contribution, your employer&apos;s matching share, and how much extra
        a Voluntary Provident Fund (VPF) top-up could add to your retirement corpus over time.
      </p>

      <div className="mt-10">
        <EpfVpfCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How EPF Contributions Work</h2>
        <p className="mt-3 text-ink-soft">
          Every month, {(PF_RATE * 100).toFixed(0)}% of your Basic salary + Dearness Allowance is
          deducted and matched by an equal {(PF_RATE * 100).toFixed(0)}% from your employer. Your
          entire share goes into your EPF account, but your employer&apos;s share splits two ways:{" "}
          {(EPF_EMPLOYER_SHARE_RATE * 100).toFixed(2)}% into your EPF account, and{" "}
          {(EPS_RATE * 100).toFixed(2)}% into the EPS (pension) account, which only accrues on a
          wage base capped at ₹15,000/month no matter how high your actual basic salary is.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Should You Add VPF Contributions?</h2>
        <p className="mt-3 text-ink-soft">
          VPF is one of the few investment options offering a government-backed,{" "}
          {(EPF_INTEREST_RATE_FY2025_26 * 100).toFixed(2)}% return with the same tax-free status
          as EPF — but it locks your money in, reduces your monthly take-home pay, and the
          interest on large combined contributions can become taxable. It tends to suit
          conservative, long-horizon savers more than those who need liquidity in the next few
          years.
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
            <Link
              href="/calculator/ppf-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              PPF Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/salary"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              In-Hand Salary Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
