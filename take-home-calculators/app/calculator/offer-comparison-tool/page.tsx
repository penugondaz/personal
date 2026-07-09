import type { Metadata } from "next";
import Link from "next/link";
import OfferComparisonTool from "@/components/OfferComparisonTool";
import { absoluteUrl } from "@/lib/paths";

const title = "Offer Comparison Tool — Compare Two Job Offers Side by Side 2026";
const description =
  "Compare two job offers in detail: in-hand salary, tax, PF, cost of living, disposable income after rent, and a multi-year projection. Free, private, no signup.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/offer-comparison-tool") },
  openGraph: { title, description, url: absoluteUrl("/calculator/offer-comparison-tool") },
};

const faqs = [
  {
    question: "How does this compare two offers fairly if they're in different cities?",
    answer:
      "Beyond just comparing in-hand pay, the tool adjusts for each city's cost-of-living index and shows disposable income after typical 1BHK rent — so a higher number in an expensive city can be fairly weighed against a lower number somewhere cheaper.",
  },
  {
    question: "Why does the tax regime matter in this comparison?",
    answer:
      "The same CTC can produce meaningfully different in-hand pay depending on whether the old or new tax regime is better for your deduction profile. By default this tool auto-picks whichever regime gives you more in-hand for each offer — you can override this manually if you already know which regime you'll use.",
  },
  {
    question: "Why include a multi-year projection instead of just comparing today's numbers?",
    answer:
      "A lower offer with a stronger annual hike culture can overtake a higher offer with slower raises within a few years. The projection applies each offer's own expected hike rate to show how the gap changes over time — useful when one company is known for aggressive appraisals and another isn't.",
  },
  {
    question: "What doesn't this tool account for?",
    answer:
      "Role scope, career growth, company stability, work culture, ESOPs/stock, and other non-cash perks aren't part of this comparison — it's deliberately scoped to pay, tax, and cost-of-living factors, which are the parts that are actually calculable. Weigh the rest separately.",
  },
];

export default function OfferComparisonToolPage() {
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
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/salary" className="hover:text-brand">Salary</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Offer Comparison Tool</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Offer Comparison Tool</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Compare two job offers on the numbers that actually matter — in-hand pay, tax, PF, cost of living in each
        city, and how the gap changes over a multi-year projection.
      </p>

      <OfferComparisonTool />

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
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: "/salary", label: "In-Hand Salary Calculator" },
            { href: "/calculator/old-vs-new-tax-regime", label: "Old vs New Regime" },
            { href: "/salary-growth", label: "Salary Growth Projection" },
            { href: "/calculator/hra-calculator", label: "HRA Calculator" },
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
