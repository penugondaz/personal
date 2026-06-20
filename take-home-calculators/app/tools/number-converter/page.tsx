import type { Metadata } from "next";
import Link from "next/link";
import NumberConverter from "@/components/NumberConverter";
import { absoluteUrl } from "@/lib/paths";

const title = "Number to Words Converter — Lakh, Crore, Million, Billion";
const description =
  "Convert any number to Indian system (Lakh, Crore) and international units (Million, Billion) with a full word breakdown. Example: 12333232 = 1 Crore, 23 Lakh, 33 Thousand, 232.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/tools/number-converter") },
  openGraph: { title, description, url: absoluteUrl("/tools/number-converter") },
};

const faqs = [
  {
    question: "How many lakhs make a crore?",
    answer: "100 lakhs make 1 crore. 1 lakh = 1,00,000 and 1 crore = 1,00,00,000.",
  },
  {
    question: "How many crores make a billion?",
    answer:
      "100 crores make 1 billion. 1 crore = 10 million, so 1 billion = 100 crores = 1,000 lakhs.",
  },
  {
    question: "How do I read 12333232 in Indian system?",
    answer:
      "12333232 = 1 Crore, 23 Lakh, 33 Thousand, 2 Hundred and 32. In the Indian number system, you group from the right as: 32 (units), 2 (hundreds), 33 (thousands), 23 (lakhs), 1 (crore).",
  },
  {
    question: "What is 100000000 in Indian words?",
    answer:
      "100000000 = 10 Crore (Ten Crore). In international system this is 100 Million or 0.1 Billion.",
  },
];

export default function NumberConverterPage() {
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
        <span aria-current="page">Number Converter</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Number to Words Converter</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Convert any number to Indian system (Lakh, Crore) and international units (Million, Billion)
        with a full word breakdown. Try: 12333232 = 1 Crore, 23 Lakh, 33 Thousand, 232.
      </p>

      <div className="mt-10">
        <NumberConverter />
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
            { href: "/tools/percentage-calculator", label: "Percentage Calculator" },
            { href: "/tools/discount-calculator", label: "Discount Calculator" },
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
