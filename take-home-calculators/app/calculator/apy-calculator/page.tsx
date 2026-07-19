import type { Metadata } from "next";
import Link from "next/link";
import ApyCalculator from "@/components/ApyCalculator";
import CalculatorSources from "@/components/CalculatorSources";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "Atal Pension Yojana (APY) Calculator — Monthly Contribution & Guaranteed Pension";
const DESCRIPTION =
  "Calculate your exact APY monthly contribution using PFRDA's official chart, based on your entry age and desired pension of ₹1,000 to ₹5,000/month from age 60.";
const URL = "/calculator/apy-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: [
    "atal pension yojana calculator",
    "apy calculator",
    "apy contribution chart",
    "atal pension yojana monthly contribution",
    "apy pension calculator by age",
  ],
};

const faqs = [
  {
    question: "How is the APY contribution amount decided?",
    answer:
      "PFRDA publishes a fixed contribution chart based on your entry age and your chosen pension amount (₹1,000 to ₹5,000/month). The younger you join, the lower your monthly contribution, since you'll be contributing for more years before turning 60. This is a lookup-table figure — it isn't calculated from an interest rate.",
  },
  {
    question: "Is APY a market-linked scheme like NPS?",
    answer:
      "No. Unlike NPS, which is market-linked and your final corpus depends on investment returns, APY is a government-guaranteed defined-benefit scheme. You're guaranteed the exact pension amount you signed up for, regardless of how markets perform — the government bears that risk, not you.",
  },
  {
    question: "What happens to my APY pension after I die?",
    answer:
      "If you die after 60, your spouse receives the same monthly pension for their lifetime. After both you and your spouse have passed, your nominee receives the accumulated pension corpus as a lumpsum — a fixed amount depending on your pension slab (for example, ₹1.7 lakh for a ₹1,000/month pension, scaling up to ₹8.5 lakh for a ₹5,000/month pension).",
  },
  {
    question: "Can I change my APY pension amount later?",
    answer:
      "Yes, APY allows you to increase or decrease your chosen pension slab once a year (typically in April), and your monthly contribution is recalculated based on your current age and the new slab. Frequent changes aren't allowed — only once per financial year.",
  },
  {
    question: "Who is eligible for Atal Pension Yojana?",
    answer:
      "Any Indian citizen aged 18-40 with a bank account can join APY. It was originally designed for workers in the unorganized sector without access to formal pension schemes, but anyone in the eligible age range can enroll through their bank or post office.",
  },
];

export default function ApyCalculatorPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "APY Calculator", href: URL },
    ]),
    calculatorSchema({ name: TITLE, description: DESCRIPTION, url: URL }),
    faqSchema(faqs)
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/retirement" className="hover:text-brand">Retirement</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">APY Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Atal Pension Yojana (APY) Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Find your exact monthly contribution for a guaranteed government pension of ₹1,000 to
        ₹5,000 a month from age 60 — using PFRDA&apos;s official contribution chart.
      </p>

      <div className="mt-10">
        <ApyCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How Atal Pension Yojana Works</h2>
        <p className="mt-3 text-ink-soft">
          Atal Pension Yojana is a government-backed pension scheme aimed primarily at
          unorganized-sector workers who don't have access to EPF or a formal employer pension.
          Unlike NPS, where your eventual pension depends on how your invested corpus performs
          in the market, APY works the other way around: you choose the pension you want
          (between ₹1,000 and ₹5,000 a month), and PFRDA tells you exactly how much you need to
          contribute every month until you turn 60, based purely on your entry age.
        </p>
        <p className="mt-3 text-ink-soft">
          This makes APY a defined-benefit scheme — the government guarantees your pension
          amount regardless of investment performance. The trade-off is that returns are
          effectively fixed and modest compared to what a well-performing NPS or mutual fund SIP
          might deliver over the same period; APY is designed for guaranteed minimum income
          security, not wealth maximization.
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

      <CalculatorSources
        sources={[
          { label: "PFRDA — official Atal Pension Yojana contribution chart", url: "https://npscra.nsdl.co.in" },
          { label: "Atal Pension Yojana Scheme Details, Pension Fund Regulatory and Development Authority", url: "https://www.pfrda.org.in" },
        ]}
      />

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li><Link href="/calculator/nps-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">NPS Calculator</Link></li>
          <li><Link href="/calculator/nps-tier2-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">NPS Tier 2 Calculator</Link></li>
          <li><Link href="/calculator/scss-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">SCSS Calculator</Link></li>
          <li><Link href="/calculator/ppf-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">PPF Calculator</Link></li>
          <li><Link href="/calculator/fire-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">FIRE Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
