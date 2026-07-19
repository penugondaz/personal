import type { Metadata } from "next";
import Link from "next/link";
import NriIncomeTaxCalculator from "@/components/NriIncomeTaxCalculator";
import CalculatorSources from "@/components/CalculatorSources";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "NRI Income Tax Calculator India — Tax on India-Sourced Income (FY 2025-26)";
const DESCRIPTION =
  "Calculate income tax for NRIs on India-sourced income — salary, rental income, NRO interest, and capital gains. Compares old vs new regime, with no Section 87A rebate as applicable to NRIs.";
const URL = "/calculator/nri-income-tax-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: [
    "nri income tax calculator",
    "nri tax calculator india",
    "nri tax on rental income india",
    "nro interest tax calculator",
    "nri capital gains tax india",
    "nri income tax slab 2025-26",
  ],
};

const faqs = [
  {
    question: "Is an NRI's foreign income taxed in India?",
    answer:
      "No. NRIs are taxed in India only on income that is earned, received, or accrued in India — such as rent from Indian property, salary for services performed in India, NRO account interest, or capital gains on Indian assets. Income earned and received abroad is not taxable in India for an NRI.",
  },
  {
    question: "Do NRIs get the Section 87A tax rebate?",
    answer:
      "No. Section 87A rebate — which can zero out tax for residents with taxable income below ₹5 lakh (old regime) or ₹12 lakh (new regime) — is only available to resident individuals. NRIs pay full slab-rate tax on their India income regardless of how small it is.",
  },
  {
    question: "Is NRE or FCNR account interest taxable in India?",
    answer:
      "No, interest earned on NRE (Non-Resident External) and FCNR (Foreign Currency Non-Resident) accounts is fully exempt from Indian income tax, as long as you maintain NRI status. Only NRO (Non-Resident Ordinary) account interest is taxable.",
  },
  {
    question: "What TDS rate applies when an NRI sells property in India?",
    answer:
      "The buyer must deduct TDS under Section 195 — typically around 12.5% on long-term capital gains or up to 30% (plus surcharge and cess) on short-term gains, deducted on the full sale value in many cases rather than just the gain. If your actual tax liability works out lower, you can claim the difference back by filing an Indian income tax return.",
  },
  {
    question: "Can DTAA reduce an NRI's tax liability in India?",
    answer:
      "Yes, if India has a Double Taxation Avoidance Agreement (DTAA) with your country of residence, you may be able to claim a lower withholding rate or credit for tax paid in India against your home-country tax liability. DTAA benefits are country-specific and aren't modeled in this calculator — consult the relevant treaty or a tax advisor.",
  },
];

export default function NriIncomeTaxCalculatorPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "NRI Income Tax Calculator", href: URL },
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
        <span aria-current="page">NRI Income Tax Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">NRI Income Tax Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Work out your Indian income tax on India-sourced income — salary, rent, NRO interest,
        and capital gains — with an accurate old vs new regime comparison for NRIs.
      </p>

      <div className="mt-10">
        <NriIncomeTaxCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How NRI Taxation Works in India</h2>
        <p className="mt-3 text-ink-soft">
          Once you qualify as a Non-Resident Indian for a financial year (broadly, if you spend
          fewer than 182 days in India, with some additional conditions for high-income
          individuals), India taxes you only on income that arises within the country — not your
          global earnings. Common sources include rent from property you still own in India,
          interest on NRO savings or fixed deposits, capital gains from selling Indian shares,
          mutual funds, or property, and salary if you perform services physically in India.
        </p>
        <p className="mt-3 text-ink-soft">
          The tax slabs themselves are the same as for residents, but NRIs lose access to the
          Section 87A rebate — the mechanism that brings tax to zero for residents under a
          certain income threshold. This means even a small amount of India income can attract
          real tax for an NRI where a resident with the same income would pay nothing. TDS is
          also typically deducted at higher rates than for residents, since the payer usually
          can't verify your final tax slab — any excess can be reclaimed by filing an Indian
          income tax return.
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
          { label: "Income Tax Act, 1961 — Section 5, scope of total income for a non-resident", url: "https://incometaxindia.gov.in" },
          { label: "Income Tax Act, 1961 — Section 87A rebate, applicable to resident individuals only", url: "https://incometaxindia.gov.in" },
          { label: "Income Tax Act, 1961 — Section 195, TDS on payments to non-residents", url: "https://incometaxindia.gov.in" },
          { label: "RBI FEMA guidelines — NRE/FCNR/NRO account interest tax treatment", url: "https://www.rbi.org.in" },
        ]}
      />

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li><Link href="/calculator/income-tax-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Income Tax Calculator</Link></li>
          <li><Link href="/calculator/old-vs-new-tax-regime" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Old vs New Regime</Link></li>
          <li><Link href="/calculator/capital-gains-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Capital Gains Calculator</Link></li>
          <li><Link href="/real-estate/rental-yield-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Rental Yield Calculator</Link></li>
          <li><Link href="/calculator/fd-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">FD Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
