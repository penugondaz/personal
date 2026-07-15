import type { Metadata } from "next";
import Link from "next/link";
import IncomeTaxWithCGCalculator from "@/components/IncomeTaxWithCGCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "Income Tax Calculator with Capital Gains 2025-26 — Salary + LTCG + STCG";
const DESCRIPTION =
  "Calculate your total income tax including capital gains — equity LTCG (12.5%), equity STCG (20%), debt LTCG, property gains, salary and other income. New vs old regime comparison. Free, instant, FY 2025-26.";
const URL = "/calculator/income-tax-with-capital-gains";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: [
    "income tax with capital gains calculator",
    "LTCG STCG tax calculator india 2025",
    "salary plus capital gains tax calculator",
    "equity LTCG tax calculator",
    "income tax calculator mutual fund gains",
    "capital gains tax india 2025-26",
    "12.5% LTCG calculator",
    "20% STCG calculator",
    "property capital gains tax calculator india",
    "total income tax calculator india",
  ],
};

const faqs = [
  {
    question: "How is LTCG on equity taxed in FY 2025-26?",
    answer: "LTCG (Long Term Capital Gains) on listed equity shares and equity mutual funds held for more than 12 months is taxed at 12.5% (without indexation) on gains exceeding ₹1.25 lakh per financial year. The first ₹1.25L of LTCG is fully exempt. This rate was revised from 10% in Budget 2024.",
  },
  {
    question: "What is the STCG tax rate on equity in 2025-26?",
    answer: "STCG (Short Term Capital Gains) on listed equity and equity mutual funds held for 12 months or less is taxed at a flat 20%. This was revised from 15% in Budget 2024. STCG is not added to your ordinary income — it's taxed separately at this flat rate.",
  },
  {
    question: "How is debt mutual fund capital gains taxed after Budget 2023?",
    answer: "After April 1, 2023, debt mutual fund gains (regardless of holding period) are taxed at your applicable income tax slab rate. However, Budget 2024 partially restored: debt MF held >24 months is now taxed at 12.5% LTCG without indexation. Debt MF held ≤24 months (STCG) is still taxed at slab rate.",
  },
  {
    question: "Is the ₹1.25 lakh LTCG exemption per transaction or per year?",
    answer: "Per financial year, not per transaction. All your equity LTCG across all shares and mutual funds in a year is aggregated, and the first ₹1.25L is exempt. If your total equity LTCG is ₹3L, you pay 12.5% on ₹1.75L (₹3L − ₹1.25L).",
  },
  {
    question: "Does capital gains affect my 87A rebate?",
    answer: "Yes, critically. The 87A rebate (which makes income tax zero up to ₹12L taxable income) is calculated on your total income including capital gains. If your salary income alone is ₹11L but you have ₹2L of STCG on equity, your total income is ₹13L — above the ₹12L threshold — and you lose the 87A rebate on ordinary income too. This calculator handles this correctly.",
  },
  {
    question: "How is property (real estate) capital gains taxed in 2025-26?",
    answer: "Property sold after July 23, 2024 and held >24 months: LTCG taxed at 12.5% without indexation. Property held ≤24 months: STCG taxed at your slab rate. Note: properties sold before July 23, 2024 had the option of 20% with indexation or 12.5% without — whichever was lower. This calculator uses the post-July 2024 rules.",
  },
  {
    question: "Can I use this calculator for both new and old regime?",
    answer: "Yes. Switch between regimes using the toggle at the top. In the old regime, enter your deductions (80C, 80D, HRA, home loan interest, NPS). Capital gains are taxed at the same special rates regardless of which regime you choose — only ordinary income treatment differs between regimes.",
  },
  {
    question: "What surcharge applies on capital gains?",
    answer: "Surcharge on capital gains (LTCG/STCG on equity and other special-rate income) is capped at 15%, even if your total income exceeds ₹5 crore. Surcharge on ordinary income follows normal bands: 10% above ₹50L, 15% above ₹1Cr, 25% above ₹2Cr. This calculator applies the correct surcharge rates to each income component.",
  },
];

export default function Page() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Calculators", href: "/calculator" },
      { name: "Income Tax with Capital Gains", href: URL },
    ]),
    calculatorSchema({ name: TITLE, description: DESCRIPTION, url: URL }),
    faqSchema(faqs),
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/calculator" className="hover:text-brand">Calculators</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Income Tax with Capital Gains</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">{TITLE}</h1>
      <p className="mt-4 text-lg text-ink-soft max-w-2xl">{DESCRIPTION}</p>

      {/* Key rule callouts */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: "📈", label: "Equity LTCG",    value: "12.5%",      sub: "above ₹1.25L/yr · >12 months" },
          { icon: "⚡", label: "Equity STCG",    value: "20%",         sub: "flat · ≤12 months" },
          { icon: "🏠", label: "Property LTCG",  value: "12.5%",      sub: "no indexation · post Jul 2024" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-rule bg-surface p-4 shadow-card">
            <span className="text-2xl shrink-0">{item.icon}</span>
            <div>
              <p className="text-xs text-ink-soft">{item.label}</p>
              <p className="font-display text-xl font-bold text-brand">{item.value}</p>
              <p className="text-[10px] text-ink-soft">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card-lg sm:p-7">
        <IncomeTaxWithCGCalculator />
      </div>

      {/* CG rates reference table */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Capital Gains Tax Rates — FY 2025-26</h2>
        <p className="mt-2 text-ink-soft">Post Budget 2024. All rates include 4% cess. Surcharge extra if applicable.</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft">Asset Type</th>
                <th className="px-4 py-2.5 font-medium text-ink-soft">Holding Period</th>
                <th className="px-4 py-2.5 font-medium text-ink-soft">Type</th>
                <th className="px-4 py-2.5 font-medium text-ink-soft">Tax Rate</th>
                <th className="px-4 py-2.5 font-medium text-ink-soft">Exemption</th>
              </tr>
            </thead>
            <tbody>
              {[
                { asset: "Listed Equity / Equity MF",     holding: "> 12 months", type: "LTCG", rate: "12.5%",     exempt: "₹1.25L/yr" },
                { asset: "Listed Equity / Equity MF",     holding: "≤ 12 months", type: "STCG", rate: "20%",       exempt: "Nil" },
                { asset: "Debt MF / Bonds",               holding: "> 24 months", type: "LTCG", rate: "12.5%",     exempt: "Nil" },
                { asset: "Debt MF / Bonds",               holding: "≤ 24 months", type: "STCG", rate: "Slab rate", exempt: "—" },
                { asset: "Property / Land (post Jul '24)",holding: "> 24 months", type: "LTCG", rate: "12.5%",     exempt: "Section 54*" },
                { asset: "Property / Land",               holding: "≤ 24 months", type: "STCG", rate: "Slab rate", exempt: "—" },
                { asset: "Gold / Other assets",           holding: "> 24 months", type: "LTCG", rate: "12.5%",     exempt: "Nil" },
                { asset: "Gold / Other assets",           holding: "≤ 24 months", type: "STCG", rate: "Slab rate", exempt: "—" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-rule last:border-0 hover:bg-paper">
                  <td className="px-4 py-2.5 font-medium text-ink">{row.asset}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{row.holding}</td>
                  <td className={`px-4 py-2.5 font-semibold ${row.type === "LTCG" ? "text-brand" : "text-orange-600"}`}>{row.type}</td>
                  <td className="tabular px-4 py-2.5 font-semibold text-ink">{row.rate}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{row.exempt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          *Section 54/54F exemptions on property LTCG (reinvestment in another property) not modelled.
          Consult a CA for complex scenarios.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-12">
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
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: "/calculator/income-tax-calculator",      label: "Income Tax Calculator" },
            { href: "/calculator/old-vs-new-tax-regime",      label: "Old vs New Regime" },
            { href: "/calculator/capital-gains-calculator",   label: "Capital Gains Calculator" },
            { href: "/calculator/xirr-calculator",            label: "XIRR Calculator" },
            { href: "/calculator/sip-calculator",             label: "SIP Calculator" },
            { href: "/real-estate/property-appreciation-calculator", label: "Property Appreciation" },
          ].map(l => (
            <li key={l.href}>
              <Link href={l.href}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center
                  text-sm font-medium text-brand hover:border-brand transition">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
