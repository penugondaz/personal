import type { Metadata } from "next";
import Link from "next/link";
import RsuEsopTaxCalculator from "@/components/RsuEsopTaxCalculator";
import CalculatorSources from "@/components/CalculatorSources";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "RSU/ESOP Tax Calculator India — Perquisite Tax + Capital Gains (FY 2025-26)";
const DESCRIPTION =
  "Calculate the full tax on your RSUs or ESOPs — perquisite tax at vesting/exercise plus capital gains tax at sale — with old vs new regime support. Built for tech employees with equity compensation.";
const URL = "/calculator/rsu-esop-tax-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: [
    "rsu tax calculator india",
    "esop tax calculator india",
    "rsu perquisite tax calculator",
    "esop exercise tax india",
    "stock options tax india",
    "rsu capital gains tax calculator",
  ],
};

const faqs = [
  {
    question: "When are RSUs taxed in India — at vesting or at sale?",
    answer:
      "Both. At vesting, the fair market value of the shares is treated as a perquisite and added to your salary income, taxed at your slab rate — this is the first tax event. At sale, any gain or loss compared to that vesting-date value is taxed separately as a capital gain, based on how long you held the shares after vesting.",
  },
  {
    question: "How is ESOP tax different from RSU tax?",
    answer:
      "The mechanics are the same, but ESOPs (stock options) require you to pay an exercise price to convert the option into an actual share, while RSUs vest directly as shares at no cost. The perquisite value for ESOPs is FMV minus the exercise price you paid; for RSUs, since there's no exercise price, the perquisite is simply the full FMV at vesting.",
  },
  {
    question: "What if my RSUs are from a US company listed only on Nasdaq or NYSE?",
    answer:
      "Since the shares aren't listed on any recognized Indian stock exchange, they're treated as unlisted shares for Indian capital gains purposes — long-term status requires a 24-month holding period (not 12), and the tax treatment differs slightly from Indian-listed equity. Select \"Foreign / unlisted company\" in the calculator to model this correctly.",
  },
  {
    question: "Does my employer deduct tax on RSU vesting automatically?",
    answer:
      "Yes — Indian employers are required to deduct TDS on the perquisite value at the time of vesting, treating it as part of your salary for that month. This can create a large one-time TDS deduction in the month RSUs vest, even though you may not have sold any shares yet to generate cash.",
  },
  {
    question: "Can I avoid double taxation if I already paid tax on RSUs abroad?",
    answer:
      "If you were taxed on the same RSU income by a foreign country (common for expats or those who relocated during the vesting period), a DTAA (Double Taxation Avoidance Agreement) between India and that country may let you claim foreign tax credit against your Indian liability. This isn't modeled in the calculator — it depends on your specific residency history and the treaty terms.",
  },
];

export default function RsuEsopTaxCalculatorPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "RSU/ESOP Tax Calculator", href: URL },
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
        <Link href="/tax-saving" className="hover:text-brand">Tax Saving</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">RSU/ESOP Tax Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">RSU/ESOP Tax Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        See the full tax picture on your equity compensation — perquisite tax when shares vest
        or options are exercised, plus capital gains tax when you eventually sell.
      </p>

      <div className="mt-10">
        <RsuEsopTaxCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How RSU and ESOP Taxation Works in India</h2>
        <p className="mt-3 text-ink-soft">
          Equity compensation is taxed at two distinct points, and it's easy to underestimate the
          first one. When RSUs vest or ESOPs are exercised, the fair market value of the shares
          on that date (minus anything you paid to acquire them) is treated exactly like a cash
          bonus — added to your salary and taxed at your slab rate, with your employer deducting
          TDS immediately. This happens whether or not you sell the shares, which can create a
          real cash-flow problem if a large tranche vests and you haven't set aside money for the
          tax.
        </p>
        <p className="mt-3 text-ink-soft">
          The second tax event happens only when you actually sell. At that point, the vesting-date
          FMV becomes your cost basis, and the difference between your sale price and that basis is
          a capital gain — short-term or long-term depending on how long you've held the shares
          since vesting. For Indian-listed shares, the long-term threshold is 12 months; for
          foreign or unlisted company shares (common with US tech RSUs), it's 24 months, and the
          tax treatment differs slightly.
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
          { label: "Income Tax Act, 1961 — Section 17(2)(vi), perquisite value of ESOP/RSU shares", url: "https://incometaxindia.gov.in" },
          { label: "Income Tax Act, 1961 — Section 111A/112A, short-term and long-term capital gains on equity", url: "https://incometaxindia.gov.in" },
          { label: "Finance Act 2024 — removal of indexation and revised LTCG/STCG rates on equity" },
        ]}
      />

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li><Link href="/calculator/capital-gains-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Capital Gains Calculator</Link></li>
          <li><Link href="/calculator/old-vs-new-tax-regime" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Old vs New Regime</Link></li>
          <li><Link href="/calculator/income-tax-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Income Tax Calculator</Link></li>
          <li><Link href="/calculator/xirr-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">XIRR Calculator</Link></li>
          <li><Link href="/calculator/advance-tax-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Advance Tax Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
