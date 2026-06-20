import type { Metadata } from "next";
import Link from "next/link";
import LicXirrCalculator from "@/components/LicXirrCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "LIC XIRR Calculator — Calculate Actual Returns on LIC Policies";
const description =
  "Calculate the real annualized return (XIRR) on your LIC or insurance policy. Compare premiums paid vs maturity value, survival benefits, and determine your actual investment return. Free, instant, browser-only.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/lic-xirr-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/lic-xirr-calculator") },
  keywords: [
    "LIC XIRR calculator", "LIC return calculator", "LIC policy return calculator",
    "LIC maturity return calculator", "insurance policy XIRR calculator",
    "LIC policy ROI calculator", "calculate LIC returns", "LIC investment return calculator",
    "is LIC a good investment", "LIC vs mutual fund",
  ],
};

const faqs = [
  {
    question: "What is XIRR and why use it for LIC policies?",
    answer:
      "XIRR (Extended Internal Rate of Return) is the true annualized return when cashflows happen on specific dates — as they do with insurance premiums (paid annually on a fixed date) and maturity/survival benefits (received at different points). Unlike CAGR, which works only for a single lump sum invested and redeemed, XIRR handles irregular cashflows correctly. For LIC policies where you pay premiums for 20 years and receive money back at various points, XIRR is the only accurate return measure.",
  },
  {
    question: "How is XIRR different from CAGR?",
    answer:
      "CAGR (Compound Annual Growth Rate) assumes you invest once and withdraw once. It cannot handle multiple investments or receipts at different dates. XIRR solves for the single interest rate that makes the present value of all inflows equal the present value of all outflows — correctly accounting for the timing of each cashflow. A 20-year LIC policy has 20+ cashflows; CAGR would give a misleading number.",
  },
  {
    question: "Is LIC a good investment based on typical XIRR?",
    answer:
      "Most traditional LIC endowment and money-back plans deliver an XIRR of 4–6% — below PPF (7.1%), EPF (8.25%), and significantly below equity mutual funds (12%+ long term). However, LIC provides life cover alongside the return, so the comparison isn't entirely fair. If you already have adequate term insurance, the investment component of a traditional LIC plan is generally considered inefficient. ULIPs and LIC's market-linked plans can deliver higher returns but carry market risk.",
  },
  {
    question: "How do I calculate LIC policy returns accurately?",
    answer:
      "Use the Advanced Cashflow mode in this calculator. Enter every premium as a negative cashflow on the date it was paid. Enter every benefit — survival benefits, bonuses, money-back amounts, and the final maturity amount — as positive cashflows on the dates they are or will be received. The calculator uses the Newton-Raphson XIRR algorithm to compute your annualized return.",
  },
  {
    question: "What is a good XIRR for an insurance policy?",
    answer:
      "Below 4% is very poor (worse than a savings account in real terms). 4–6% is poor (below PPF). 6–8% is average (roughly in line with PPF/EPF). 8–10% is good for an insurance product. Above 10% is excellent and unusual for guaranteed insurance — double-check your inputs if you see this. Remember that pure term insurance + equity mutual funds typically outperforms a bundled endowment plan on both protection and returns.",
  },
  {
    question: "Can LIC returns beat inflation?",
    answer:
      "India's long-run CPI inflation averages 5–6% annually. Traditional LIC policies returning 4–6% XIRR barely keep pace with inflation or may lose real value. ULIPs invested in equity funds have a better chance of beating inflation over 15–20 years, but carry market risk. PPF at 7.1% (tax-free) consistently beats inflation in real terms.",
  },
  {
    question: "Should I surrender my LIC policy?",
    answer:
      "Use the 'Continue vs Surrender' mode in this calculator to compare scenarios. Key factors: how many years remain (surrendering early locks in the worst surrender penalty), whether you have adequate term insurance cover elsewhere, what return you can realistically earn from alternatives, and the tax implications of the surrender value. As a thumb rule, if more than 2/3 of the premium-paying term remains and your XIRR is below 5%, surrendering and reinvesting is often mathematically better — but get advice from a fee-only financial planner.",
  },
  {
    question: "Does this calculator work for all insurance companies?",
    answer:
      "Yes. The calculator is insurance-company agnostic. It works for LIC, HDFC Life, ICICI Prudential, SBI Life, Max Life, Bajaj Allianz, or any other insurer. Enter your actual premiums, dates, and benefits — the XIRR calculation is purely mathematical.",
  },
];

export default function LicXirrCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Calculators", item: absoluteUrl("/calculator") },
          { "@type": "ListItem", position: 3, name: "LIC XIRR Calculator", item: absoluteUrl("/calculator/lic-xirr-calculator") },
        ],
      },
      {
        "@type": "WebPage",
        name: title,
        description,
        url: absoluteUrl("/calculator/lic-xirr-calculator"),
        mainEntity: {
          "@type": "SoftwareApplication",
          name: "LIC XIRR Calculator",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web Browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        },
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/calculator/xirr-calculator" className="hover:text-brand">XIRR Calculator</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">LIC XIRR Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">LIC XIRR Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Find out the real annualized return (XIRR) on your LIC or insurance policy. Enter your premiums
        and maturity value — or use advanced mode for survival benefits and money-back plans.
      </p>

      {/* Three modes explained */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
        {[
          { icon: "⚡", title: "Quick",    desc: "Annual premium + maturity amount" },
          { icon: "📋", title: "Advanced", desc: "Full cashflow table with dates" },
          { icon: "⚖️", title: "Surrender", desc: "Continue vs surrender analysis" },
        ].map(m => (
          <div key={m.title} className="rounded-xl border border-rule bg-surface px-4 py-3 shadow-card">
            <p className="font-semibold text-ink">{m.icon} {m.title}</p>
            <p className="mt-0.5 text-xs text-ink-soft">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card-lg sm:p-7">
        <LicXirrCalculator />
      </div>

      <p className="mt-3 text-xs text-ink-soft text-center">
        All calculations happen in your browser. No data is sent to any server.
      </p>

      {/* How XIRR works */}
      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink">How XIRR Is Calculated</h2>
        <p className="mt-3 text-ink-soft">
          XIRR solves for the single annual rate <em>r</em> that satisfies:
        </p>
        <div className="mt-4 rounded-xl border border-rule bg-paper px-5 py-4 font-mono text-sm text-ink">
          Σ ( Cashflow<sub>i</sub> / (1 + r)^(days<sub>i</sub> / 365) ) = 0
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          This calculator uses the Newton-Raphson iterative method with up to 1,000 iterations and
          convergence to 8 decimal places. Premiums are negative cashflows (money leaving your pocket);
          maturity amounts, survival benefits, and bonuses are positive cashflows.
        </p>

        <div className="mt-5 overflow-hidden rounded-xl border border-rule">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-rule bg-paper text-left">
              <th className="px-4 py-2.5 font-medium text-ink-soft">XIRR Band</th>
              <th className="px-4 py-2.5 font-medium text-ink-soft">Rating</th>
              <th className="px-4 py-2.5 font-medium text-ink-soft">Interpretation</th>
            </tr></thead>
            <tbody>
              {[
                { band: "Below 4%",   rating: "Very Poor", note: "Worse than a savings account in real terms" },
                { band: "4% – 6%",   rating: "Poor",      note: "Below PPF and EPF; losing real purchasing power" },
                { band: "6% – 8%",   rating: "Average",   note: "Roughly in line with PPF; barely beats inflation" },
                { band: "8% – 10%",  rating: "Good",      note: "Competitive for a guaranteed insurance product" },
                { band: "10% – 12%", rating: "Very Good", note: "Excellent for an insurance plan; verify inputs" },
                { band: "Above 12%", rating: "Excellent", note: "Exceptional — double-check all cashflow entries" },
              ].map(r => (
                <tr key={r.band} className="border-b border-rule last:border-0 hover:bg-paper">
                  <td className="tabular px-4 py-2.5 font-mono font-medium text-ink">{r.band}</td>
                  <td className="px-4 py-2.5 font-medium text-brand">{r.rating}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
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

      {/* Related */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: "/calculator/xirr-calculator",           label: "XIRR Calculator" },
            { href: "/calculator/ppf-calculator",             label: "PPF Calculator" },
            { href: "/calculator/epf-calculator",             label: "EPF Calculator" },
            { href: "/calculator/nps-calculator",             label: "NPS Calculator" },
            { href: "/calculator/fd-calculator",              label: "FD Calculator" },
            { href: "/calculator/sip-calculator",             label: "SIP Calculator" },
            { href: "/calculator/old-vs-new-tax-regime",      label: "Tax Regime Calculator" },
            { href: "/calculator/goal-planning-calculator",   label: "Retirement Planner" },
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
