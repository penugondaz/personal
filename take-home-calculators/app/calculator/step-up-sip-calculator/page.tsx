import type { Metadata } from "next";
import Link from "next/link";
import StepUpSipCalculator from "@/components/StepUpSipCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Step-Up SIP Calculator — Annual Top-Up SIP Returns India";
const description =
  "Calculate how your mutual fund SIP grows when you increase your monthly investment by a fixed % every year. Compare step-up vs flat SIP corpus over 1–40 years.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/step-up-sip-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/step-up-sip-calculator") },
};

const faqs = [
  {
    question: "What is a step-up SIP?",
    answer:
      "A step-up (or top-up) SIP automatically increases your monthly investment by a fixed percentage every year. Starting at ₹10,000/month with a 10% annual step-up means you invest ₹11,000 in year 2, ₹12,100 in year 3 — tracking salary growth.",
  },
  {
    question: "Why is step-up SIP better than flat SIP?",
    answer:
      "Because inflation erodes purchasing power, a fixed SIP amount represents declining real investment over time. A step-up keeps your investment constant in real terms, and the compounding on incremental amounts significantly boosts the final corpus.",
  },
  {
    question: "What step-up % should I use?",
    answer:
      "A 10% annual step-up is a conservative and realistic assumption — it roughly matches average salary hike rates in India's private sector. If you expect higher increments, you can model 15–20%.",
  },
];

export default function StepUpSipCalculatorPage() {
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
        <Link href="/calculator/sip-calculator" className="hover:text-brand">SIP Calculator</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Step-Up SIP</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Step-Up SIP Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate how your corpus grows when you increase your monthly SIP by a fixed % every year —
        matching salary hikes. Compare step-up vs flat SIP side by side.
      </p>

      <div className="mt-10">
        <StepUpSipCalculator />
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
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: "/calculator/sip-calculator", label: "SIP Calculator" },
            { href: "/calculator/swp-inflation-calculator", label: "SWP with Inflation" },
            { href: "/calculator/goal-planning-calculator", label: "Goal Planning" },
            { href: "/calculator/lumpsum-calculator", label: "Lumpsum Calculator" },
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
