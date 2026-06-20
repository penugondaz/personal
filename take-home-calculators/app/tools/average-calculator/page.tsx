import type { Metadata } from "next";
import Link from "next/link";
import AverageCalculator from "@/components/AverageCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Average Calculator — Mean, Median, Mode, Standard Deviation Online";
const description =
  "Calculate mean, median, mode, min, max, sum, and standard deviation for any set of numbers. Enter values separated by commas or new lines — instant results.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/tools/average-calculator") },
  openGraph: { title, description, url: absoluteUrl("/tools/average-calculator") },
};

const faqs = [
  {
    question: "What is the difference between mean and median?",
    answer:
      "The mean is the sum of all values divided by the count — it can be skewed by outliers. The median is the middle value when sorted, making it more representative for skewed data like incomes or house prices.",
  },
  {
    question: "What is standard deviation?",
    answer:
      "Standard deviation measures how spread out the numbers are from the mean. A low standard deviation means values are clustered near the mean; a high one means they are spread out widely.",
  },
  {
    question: "What is mode?",
    answer:
      "Mode is the value that appears most frequently in a dataset. A dataset can have multiple modes if several values tie for the highest frequency.",
  },
];

export default function AverageCalculatorPage() {
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
        <span aria-current="page">Average Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Average Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Enter any set of numbers to calculate mean, median, mode, min, max, sum, and standard
        deviation instantly. Comma or newline separated.
      </p>

      <div className="mt-10">
        <AverageCalculator />
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
