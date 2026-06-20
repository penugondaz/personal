import type { Metadata } from "next";
import Link from "next/link";
import DiscountCalculator from "@/components/DiscountCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Discount Calculator — Calculate Sale Price After % or Flat Discount";
const description =
  "Instantly calculate the final price after applying a percentage or flat discount. See how much you save and exactly what you pay.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/tools/discount-calculator") },
  openGraph: { title, description, url: absoluteUrl("/tools/discount-calculator") },
};

const faqs = [
  {
    question: "How do I calculate a percentage discount?",
    answer:
      "Multiply the original price by the discount percentage and divide by 100 to get the discount amount. Subtract that from the original price. For example, 20% off ₹1,000 = ₹200 discount, so you pay ₹800.",
  },
  {
    question: "What is the difference between % discount and flat discount?",
    answer:
      "A percentage discount scales with the price — 20% off a ₹500 item is ₹100, but 20% off a ₹5,000 item is ₹1,000. A flat discount is a fixed amount deducted regardless of price — ₹200 off means ₹200 off whether the item costs ₹500 or ₹5,000.",
  },
];

export default function DiscountCalculatorPage() {
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
        <span aria-current="page">Discount Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Discount Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate the final price after a percentage or flat discount. Instantly see your savings,
        the amount deducted, and what you actually pay.
      </p>

      <div className="mt-10">
        <DiscountCalculator />
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
