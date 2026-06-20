import type { Metadata } from "next";
import Link from "next/link";
import PercentageCalculator from "@/components/PercentageCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Percentage Calculator — % of Number, Increase, Decrease, Change";
const description =
  "Free percentage calculator with 5 modes: find % of a number, calculate % increase or decrease, find % change between two values, and find what % one number is of another.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/tools/percentage-calculator") },
  openGraph: { title, description, url: absoluteUrl("/tools/percentage-calculator") },
};

const faqs = [
  {
    question: "How do I calculate what percentage one number is of another?",
    answer:
      "Divide the first number by the second and multiply by 100. For example, 25 is what % of 200? → (25 ÷ 200) × 100 = 12.5%.",
  },
  {
    question: "How do I calculate percentage increase?",
    answer:
      "Subtract the original value from the new value, divide by the original value, and multiply by 100. For example, from ₹800 to ₹1,000 → (200 ÷ 800) × 100 = 25% increase.",
  },
  {
    question: "How do I calculate percentage decrease?",
    answer:
      "Subtract the new value from the original, divide by the original, and multiply by 100. For example, from ₹1,000 to ₹750 → (250 ÷ 1,000) × 100 = 25% decrease.",
  },
];

export default function PercentageCalculatorPage() {
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
        <span aria-current="page">Percentage Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Percentage Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Five percentage calculators in one — find % of a number, calculate increases, decreases,
        % change between two values, and more.
      </p>

      <div className="mt-10">
        <PercentageCalculator />
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
        <h2 className="font-display text-2xl text-ink">Related Tools</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: "/tools/discount-calculator", label: "Discount Calculator" },
            { href: "/tools/average-calculator", label: "Average Calculator" },
            { href: "/tools", label: "All Tools" },
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
