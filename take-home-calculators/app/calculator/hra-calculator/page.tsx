import type { Metadata } from "next";
import Link from "next/link";
import HraCalculator from "@/components/HraCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "HRA Calculator — House Rent Allowance Exemption Calculator (Section 10(13A))";
const description =
  "Calculate your HRA exemption under Section 10(13A) — the lowest of actual HRA received, 50%/40% of basic salary, or rent paid minus 10% of basic, for metro and non-metro cities.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/hra-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/hra-calculator") },
};

const faqs = [
  {
    question: "How is HRA exemption calculated?",
    answer:
      "HRA exemption under Section 10(13A) is the lowest of three figures: the actual HRA you receive, 50% of Basic + DA for metro cities (40% for non-metro), or your rent paid minus 10% of Basic + DA. Whichever of these three is smallest becomes your tax-exempt HRA.",
  },
  {
    question: "Which cities count as 'metro' for HRA purposes?",
    answer:
      "Delhi, Mumbai, Kolkata, and Chennai are classified as metro cities for HRA exemption, qualifying for the higher 50% limit. All other cities, including Bangalore, Hyderabad, and Pune, use the 40% non-metro limit.",
  },
  {
    question: "Can I claim HRA exemption under the new tax regime?",
    answer:
      "No. HRA exemption under Section 10(13A) is only available if you opt for the old tax regime. The new regime offers a higher standard deduction instead, but doesn't allow HRA, 80C, or most other exemptions.",
  },
  {
    question: "What if I don't pay rent or live in my own house?",
    answer:
      "If you don't pay rent, your entire HRA received becomes taxable — there's no exemption without rent payments. If you live in a house you own, you also can't claim HRA exemption for that property.",
  },
  {
    question: "Do I need rent receipts to claim HRA exemption?",
    answer:
      "Yes. Your employer will typically require rent receipts (and your landlord's PAN if annual rent exceeds ₹1,00,000) to process the exemption through payroll. Keep these documents for your own records even after submission.",
  },
];

export default function HraCalculatorPage() {
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
        <span aria-current="page">HRA Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">HRA Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Find out how much of your House Rent Allowance is tax-exempt under Section 10(13A), and
        how much remains taxable.
      </p>

      <div className="mt-10">
        <HraCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How HRA Exemption Works</h2>
        <p className="mt-3 text-ink-soft">
          Most Indian salary structures include House Rent Allowance as a separate component, but
          not all of it is automatically tax-free. The exemption is governed by Section 10(13A)
          of the Income Tax Act, and is capped at the lowest of three competing limits: what you
          actually received as HRA, a percentage of your basic salary tied to your city, and your
          actual rent expense above a 10%-of-basic threshold. This three-way comparison means
          someone with a high HRA component but low rent might only get a small exemption, while
          someone paying high rent in a smaller city might be capped by the city-percentage limb
          instead.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Metro vs. Non-Metro Limits</h2>
        <p className="mt-3 text-ink-soft">
          The government recognizes only four cities — Delhi, Mumbai, Kolkata, and Chennai — as
          metros for HRA purposes, qualifying for the 50% of Basic + DA limit. Every other city in
          India, including major tech hubs like Bangalore, Hyderabad, and Pune, falls under the
          40% non-metro limit, regardless of how expensive rent actually is there.
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
            <Link href="/salary" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              In-Hand Salary Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/gratuity-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              Gratuity Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
