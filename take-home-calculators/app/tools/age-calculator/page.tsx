import type { Metadata } from "next";
import Link from "next/link";
import AgeCalculator from "@/components/AgeCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "Age Calculator — Calculate Exact Age in Years, Months & Days";
const DESCRIPTION = "Calculate your exact age in years, months, days, weeks, and hours. Find days until next birthday, zodiac sign, day of birth, and more. Free, instant, no signup.";
const URL = "/tools/age-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: [
    "age calculator",
    "how old am i",
    "age calculator in years months days",
    "date of birth age calculator",
    "exact age calculator india",
    "days until birthday calculator",
    "age calculator online free",
  ],
};

const faqs = [
  {
    question: "How do I calculate my exact age?",
    answer: "Enter your date of birth and the calculator will compute your exact age in years, months, and days. It also shows your total age in days, weeks, months, and hours, your zodiac sign, the day of the week you were born, and how many days until your next birthday.",
  },
  {
    question: "How is age calculated in years, months, and days?",
    answer: "Age is calculated by finding the difference between your date of birth and today (or any reference date). The years are counted first, then the remaining months, then the remaining days. For example, if you were born on 15 March 1990 and today is 1 July 2026, your age is 36 years, 3 months, and 16 days.",
  },
  {
    question: "Can I calculate age between two specific dates?",
    answer: "Yes. The 'Age As Of' field lets you calculate age relative to any date — not just today. This is useful for calculating age at a past event, or finding someone's age on a future date.",
  },
  {
    question: "How do I find what day of the week I was born?",
    answer: "Enter your date of birth in the calculator. The result panel shows the day of the week (e.g. Monday, Friday) that you were born on.",
  },
  {
    question: "How are zodiac signs determined?",
    answer: "Zodiac signs are based on your birth month and day: Aries (Mar 21–Apr 19), Taurus (Apr 20–May 20), Gemini (May 21–Jun 20), Cancer (Jun 21–Jul 22), Leo (Jul 23–Aug 22), Virgo (Aug 23–Sep 22), Libra (Sep 23–Oct 22), Scorpio (Oct 23–Nov 21), Sagittarius (Nov 22–Dec 21), Capricorn (Dec 22–Jan 19), Aquarius (Jan 20–Feb 18), Pisces (Feb 19–Mar 20).",
  },
];

export default function AgeCalculatorPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Tools", href: "/tools" },
      { name: "Age Calculator", href: URL },
    ]),
    calculatorSchema({
      name: "Age Calculator",
      description: DESCRIPTION,
      url: URL,
      category: "UtilityApplication",
    }),
    faqSchema(faqs),
  );

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/tools" className="hover:text-brand">Tools</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Age Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Age Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate your exact age in years, months, and days — plus total days lived,
        weeks, hours, zodiac sign, and days until your next birthday.
      </p>

      <div className="mt-10">
        <AgeCalculator />
      </div>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map(faq => (
            <div key={faq.question} className="border-b border-rule pb-4">
              <h3 className="font-medium text-ink">{faq.question}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Tools</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {[
            { href: "/tools/percentage-calculator", label: "Percentage Calculator" },
            { href: "/tools/discount-calculator", label: "Discount Calculator" },
            { href: "/calculator/fire-calculator", label: "FIRE / Retirement Calculator" },
            { href: "/calculator/epf-calculator", label: "EPF Maturity Calculator" },
          ].map(l => (
            <li key={l.href}>
              <Link href={l.href}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
