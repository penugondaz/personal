import type { Metadata } from "next";
import Link from "next/link";
import RentReceiptGenerator from "@/components/RentReceiptGenerator";
import { absoluteUrl } from "@/lib/paths";

const title = "Rent Receipt Generator — Free HRA Rent Receipts 2026";
const description =
  "Generate rent receipts for HRA exemption in seconds. Create one receipt or all 12 months at once, with revenue stamp and PAN requirement checks built in.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/tools/rent-receipt-generator") },
  openGraph: { title, description, url: absoluteUrl("/tools/rent-receipt-generator") },
};

const faqs = [
  {
    question: "Do I need rent receipts to claim HRA exemption?",
    answer:
      "Yes. Your employer typically asks for rent receipts (often quarterly or annually) to allow HRA exemption in your salary TDS calculation. Keep the originals — some employers also want them at the time of income tax return filing verification.",
  },
  {
    question: "When is the landlord's PAN mandatory on a rent receipt?",
    answer:
      "If your total annual rent exceeds ₹1,00,000 (i.e., over ₹8,333/month), your employer will require the landlord's PAN. If the landlord doesn't have a PAN, they need to provide a signed Form 60 declaration instead.",
  },
  {
    question: "Do I need a revenue stamp on rent receipts?",
    answer:
      "A ₹1 revenue stamp is legally required on a rent receipt when the payment is made in cash and exceeds ₹5,000 for that receipt. It isn't required for bank transfer, UPI, or cheque payments.",
  },
  {
    question: "Is a rent receipt from this tool valid for tax filing?",
    answer:
      "This generates a standard-format rent receipt with all the fields tax authorities and employers typically expect. However, it works best alongside a real rental agreement — a rent receipt alone, especially for larger deductions, is stronger evidence when backed by an actual lease.",
  },
];

export default function RentReceiptGeneratorPage() {
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
        <span aria-current="page">Rent Receipt Generator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Rent Receipt Generator</h1>
      <p className="no-print mt-4 text-lg text-ink-soft">
        Generate rent receipts for HRA exemption — one at a time, or all 12 months of a financial year at once.
        Nothing is saved or sent anywhere; everything runs in your browser.
      </p>

      <RentReceiptGenerator />

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
            { href: "/calculator/hra-calculator", label: "HRA Calculator" },
            { href: "/tools/payslip-generator", label: "Payslip Generator" },
            { href: "/calculator/income-tax-calculator", label: "Income Tax Calculator" },
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
