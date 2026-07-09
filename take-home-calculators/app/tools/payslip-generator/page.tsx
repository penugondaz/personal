import type { Metadata } from "next";
import Link from "next/link";
import PayslipGenerator from "@/components/PayslipGenerator";
import { absoluteUrl } from "@/lib/paths";

const title = "Payslip Generator — Free Salary Slip Maker 2026";
const description =
  "Generate a payslip in seconds. Enter your CTC to auto-fill Basic, HRA, PF, and tax using our salary calculator, then edit any line to match your actual payslip.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/tools/payslip-generator") },
  openGraph: { title, description, url: absoluteUrl("/tools/payslip-generator") },
};

const faqs = [
  {
    question: "How does the auto-fill from CTC work?",
    answer:
      "Enter your annual CTC and select a tax regime, and the tool runs it through the same salary breakup calculator used across this site — splitting it into Basic, HRA, and Special Allowance on the earnings side, and PF, professional tax, and income tax on the deductions side. You can then edit any individual line to match your real payslip exactly.",
  },
  {
    question: "Can I add or remove line items?",
    answer:
      "Yes. Use \"+ Add earning\" or \"+ Add deduction\" to add custom rows (like a bonus, LTA, or a loan deduction), and the ✕ button next to any row to remove it. Net pay recalculates automatically.",
  },
  {
    question: "Is this a legally valid payslip?",
    answer:
      "This produces a clean, standard-format payslip you can use for personal records, loan applications, or visa documentation where a slip showing your salary structure is needed. It's not a substitute for your employer's official payroll-system-issued payslip where that's specifically required.",
  },
  {
    question: "Is my salary data saved anywhere?",
    answer:
      "No. Every field and calculation stays in your browser — nothing is sent to a server or stored.",
  },
];

export default function PayslipGeneratorPage() {
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
        <Link href="/tools" className="hover:text-brand">Tools</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Payslip Generator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Payslip Generator</h1>
      <p className="no-print mt-4 text-lg text-ink-soft">
        Enter your CTC to auto-fill a full payslip using our salary breakup calculator, then edit any line to
        match your actual numbers. Nothing is saved or sent anywhere.
      </p>

      <PayslipGenerator />

      <section className="no-print mt-12">
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

      <section className="no-print mt-12">
        <h2 className="font-display text-2xl text-ink">Related Tools & Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: "/salary", label: "In-Hand Salary Calculator" },
            { href: "/tools/rent-receipt-generator", label: "Rent Receipt Generator" },
            { href: "/salary/salary-structure-calculator", label: "Salary Structure Calculator" },
            { href: "/calculator/income-tax-calculator", label: "Income Tax Calculator" },
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
