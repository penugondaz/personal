import type { Metadata } from "next";
import Link from "next/link";
import IncomeTaxCalculator from "@/components/IncomeTaxCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";
import { getCurrentFY } from "@/lib/calculators/income-tax";

const { fyLabel, fy, ay } = getCurrentFY();

const TITLE = `Income Tax Calculator ${fy} — New vs Old Regime Tax Calculator India`;
const DESCRIPTION = `Calculate income tax for ${fyLabel}. Compare new tax regime vs old regime, see slab-wise breakup, add deductions (80C, VPF, NPS, HRA), and find which regime saves more tax.`;
const URL = "/calculator/income-tax-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: [
    `income tax calculator ${fy}`,
    `income tax calculator india ${fy}`,
    "new tax regime calculator",
    "old vs new tax regime calculator",
    "income tax slab calculator india",
    `tax calculator ${fy}`,
    "how much income tax to pay india",
    "income tax calculator with deductions",
    "80C deduction tax calculator",
  ],
};

const faqs = [
  {
    question: `What are the income tax slabs for ${fyLabel}?`,
    answer: `Under the new tax regime for ${fyLabel}: ₹0–4L: 0%, ₹4–8L: 5%, ₹8–12L: 10%, ₹12–16L: 15%, ₹16–20L: 20%, ₹20–24L: 25%, above ₹24L: 30%. Standard deduction of ₹75,000 applies. Income up to ₹12.75L is effectively tax-free due to Section 87A rebate plus standard deduction. Under the old regime: ₹0–2.5L: 0%, ₹2.5–5L: 5%, ₹5–10L: 20%, above ₹10L: 30%.`,
  },
  {
    question: "Is income up to ₹12 lakh tax free in the new regime?",
    answer: `Yes. In ${fyLabel}, the Section 87A rebate under the new regime is ₹60,000 for taxable income up to ₹12 lakh. After the ₹75,000 standard deduction, anyone earning up to ₹12.75 lakh gross salary pays zero income tax under the new regime.`,
  },
  {
    question: "Which is better — new tax regime or old tax regime?",
    answer: "For most salaried people with few deductions, the new regime is better. The old regime becomes beneficial when you have significant deductions — typically when 80C (₹1.5L) + NPS (₹50K) + HRA + home loan interest together exceed ₹4–5 lakh. Use our calculator above to find the exact answer for your income.",
  },
  {
    question: "What is VPF and does it reduce tax?",
    answer: "VPF (Voluntary Provident Fund) is additional contribution to your EPF account beyond the mandatory 12%. Under the old tax regime, VPF contributions count towards Section 80C deduction (₹1.5L limit). VPF interest is tax-free up to ₹2.5L annual contribution. VPF doesn't help in the new regime since deductions are not allowed.",
  },
  {
    question: "What is Section 87A rebate?",
    answer: `Section 87A provides a tax rebate to individuals with lower incomes. Under the new regime for ${fyLabel}, if your taxable income is ₹12 lakh or below, you get a full rebate of up to ₹60,000 — effectively making tax zero. Under the old regime, the rebate is ₹12,500 for taxable income up to ₹5 lakh.`,
  },
  {
    question: "How is health and education cess calculated?",
    answer: "Health and Education Cess is charged at 4% on the income tax amount (after rebate and surcharge). It applies to all taxpayers. For example, if your tax liability is ₹1,00,000, the cess would be ₹4,000, making total tax ₹1,04,000.",
  },
  {
    question: "When is surcharge applicable?",
    answer: "Surcharge applies on high incomes: 10% surcharge for income between ₹50L–₹1Cr, 15% for ₹1Cr–₹2Cr, and 25% for above ₹2Cr. Surcharge is calculated on the income tax amount, not on income. Most salaried employees do not pay surcharge.",
  },
];

export default function IncomeTaxCalculatorPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Calculators", href: "/calculator" },
      { name: `Income Tax Calculator ${fy}`, href: URL },
    ]),
    calculatorSchema({
      name: `Income Tax Calculator India ${fy}`,
      description: DESCRIPTION,
      url: URL,
    }),
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
        <span aria-current="page">Income Tax Calculator</span>
      </nav>

      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-surface px-3 py-1 text-xs font-medium text-brand">
        📅 {fyLabel} · AY {ay}
      </div>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Income Tax Calculator {fy}
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate your exact income tax for {fyLabel}. Compare{" "}
        <strong className="text-ink">new vs old tax regime</strong>, see slab-wise breakdown,
        add deductions (80C, VPF, NPS, HRA, home loan), and get monthly TDS amount.
      </p>

      {/* Key highlights */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Tax-free limit (New)", value: "₹12.75L", icon: "🎯" },
          { label: "Standard deduction", value: "₹75,000", icon: "📋" },
          { label: "87A rebate (New)", value: "₹60,000", icon: "🎁" },
          { label: "Cess rate", value: "4%", icon: "📊" },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-rule bg-surface p-3 text-center shadow-card">
            <p className="text-xl">{stat.icon}</p>
            <p className="tabular mt-1 font-display text-lg font-bold text-ink">{stat.value}</p>
            <p className="text-xs text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <IncomeTaxCalculator />
      </div>

      {/* Tax saving link */}
      <div className="mt-10 rounded-xl border border-brand/20 bg-brand-soft p-5">
        <p className="font-semibold text-ink">Want to reduce your tax further?</p>
        <p className="text-sm text-ink-soft mt-1">
          See our detailed tax saving guide with all deductions you can claim under the old regime.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/tax-saving/10-lpa" className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Tax Saving Guide →
          </Link>
          <Link href="/calculator/old-vs-new-tax-regime" className="rounded-full border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand-soft">
            Old vs New Regime Details
          </Link>
        </div>
      </div>

      {/* Slab rate table */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Income Tax Slabs {fyLabel}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold text-brand mb-2">New Tax Regime</h3>
            <div className="overflow-hidden rounded-lg border border-rule">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-rule bg-paper text-left">
                    <th className="px-3 py-2 text-ink-soft">Income Range</th>
                    <th className="px-3 py-2 text-right text-ink-soft">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["₹0 – ₹4,00,000", "0%"],
                    ["₹4L – ₹8,00,000", "5%"],
                    ["₹8L – ₹12,00,000", "10%"],
                    ["₹12L – ₹16,00,000", "15%"],
                    ["₹16L – ₹20,00,000", "20%"],
                    ["₹20L – ₹24,00,000", "25%"],
                    ["Above ₹24,00,000", "30%"],
                  ].map(([range, rate]) => (
                    <tr key={range} className="border-b border-rule last:border-0">
                      <td className="px-3 py-2 text-ink-soft">{range}</td>
                      <td className="px-3 py-2 text-right font-semibold text-brand">{rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink-soft mt-2">Standard deduction: ₹75,000 · 87A rebate up to ₹12L taxable income</p>
          </div>
          <div>
            <h3 className="font-semibold text-orange-700 mb-2">Old Tax Regime</h3>
            <div className="overflow-hidden rounded-lg border border-rule">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-rule bg-paper text-left">
                    <th className="px-3 py-2 text-ink-soft">Income Range</th>
                    <th className="px-3 py-2 text-right text-ink-soft">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["₹0 – ₹2,50,000", "0%"],
                    ["₹2.5L – ₹5,00,000", "5%"],
                    ["₹5L – ₹10,00,000", "20%"],
                    ["Above ₹10,00,000", "30%"],
                  ].map(([range, rate]) => (
                    <tr key={range} className="border-b border-rule last:border-0">
                      <td className="px-3 py-2 text-ink-soft">{range}</td>
                      <td className="px-3 py-2 text-right font-semibold text-orange-700">{rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink-soft mt-2">Standard deduction: ₹50,000 · Deductions under 80C, 80D, HRA etc. allowed</p>
          </div>
        </div>
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
            { href: "/calculator/old-vs-new-tax-regime", label: "Old vs New Tax Regime" },
            { href: "/calculator/hra-calculator", label: "HRA Exemption Calculator" },
            { href: "/calculator/epf-calculator", label: "EPF & VPF Calculator" },
            { href: "/calculator/nps-calculator", label: "NPS Calculator" },
            { href: "/tax-saving", label: "Tax Saving Guide" },
            { href: "/salary", label: "Salary Calculator" },
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
