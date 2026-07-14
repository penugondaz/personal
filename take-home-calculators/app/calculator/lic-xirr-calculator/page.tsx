import type { Metadata } from "next";
import Link from "next/link";
import LicXirrCalculator from "@/components/LicXirrCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "LIC XIRR Calculator — Real Return on LIC Policy + Surrender Value Estimator";
const DESCRIPTION =
  "Calculate the true annualized return (XIRR) on any LIC or insurance policy. Compare premiums vs maturity, run continue vs surrender analysis, and estimate surrender value with 2025 LIC bonus rates. Free, instant, browser-only.";
const URL = "/calculator/lic-xirr-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: [
    "LIC XIRR calculator",
    "LIC return calculator",
    "LIC policy return calculator",
    "LIC surrender value calculator",
    "LIC bonus calculator 2025",
    "LIC continue or surrender",
    "is LIC a good investment",
    "LIC vs mutual fund comparison",
    "LIC maturity return calculator",
    "insurance policy XIRR India",
    "LIC policy actual returns",
    "LIC endowment plan returns",
  ],
};

const MODES = [
  {
    icon: "⚡",
    title: "Quick Calculator",
    desc: "Know your annual premium and expected maturity amount? Get your XIRR in 30 seconds.",
    who: "Best for: most people with a standard LIC policy",
  },
  {
    icon: "📋",
    title: "Advanced Cashflows",
    desc: "Enter every premium and benefit with exact dates — survival benefits, bonuses, money-back payouts.",
    who: "Best for: money-back plans, policies with irregular cashflows",
  },
  {
    icon: "⚖️",
    title: "Continue vs Surrender",
    desc: "Should you keep paying premiums or surrender today and invest the proceeds elsewhere?",
    who: "Best for: anyone considering surrendering an existing policy",
  },
  {
    icon: "🔍",
    title: "Estimate Surrender Value",
    desc: "Don't know your surrender value? Estimate it using 2025 LIC bonus rates and GSV formula.",
    who: "Best for: finding approximate surrender value without calling your LIC agent",
  },
];

const XIRR_BENCHMARKS = [
  { band: "Below 4%",   rating: "Very Poor",  color: "text-red-600",    bg: "bg-red-50",    note: "Worse than a savings account. Policy is actively destroying real wealth." },
  { band: "4% – 6%",   rating: "Poor",       color: "text-orange-600", bg: "bg-orange-50", note: "Below PPF (7.1%) and EPF (8.25%). Losing real purchasing power after inflation." },
  { band: "6% – 8%",   rating: "Average",    color: "text-yellow-700", bg: "bg-yellow-50", note: "Roughly in line with PPF/EPF. Barely beats long-run Indian inflation of 5–6%." },
  { band: "8% – 10%",  rating: "Good",       color: "text-brand",      bg: "bg-brand-soft", note: "Competitive for a guaranteed, non-market-linked insurance product." },
  { band: "10% – 12%", rating: "Very Good",  color: "text-brand",      bg: "bg-brand-soft", note: "Excellent result. Verify your inputs — survival benefits and bonus included?" },
  { band: "Above 12%", rating: "Exceptional", color: "text-brand",     bg: "bg-brand-soft", note: "Rare for traditional insurance. Double-check all cashflow dates and amounts." },
];

const faqs = [
  {
    question: "What is XIRR and why use it for LIC policies?",
    answer:
      "XIRR (Extended Internal Rate of Return) is the true annualized return when cashflows happen on specific dates — as they do with insurance premiums (paid annually) and maturity/survival benefits (received at different times). Unlike simple ROI or CAGR, XIRR accounts for the exact timing of each cashflow. For a 20-year LIC policy with multiple money-back payouts, XIRR is the only accurate return measure.",
  },
  {
    question: "What XIRR do most LIC endowment plans give?",
    answer:
      "Most traditional LIC endowment plans (Jeevan Anand, New Endowment, Jeevan Labh) deliver an XIRR of 4.5–6% — below PPF (7.1%), below EPF (8.25%), and well below long-term equity mutual fund returns (10–12%). The life cover component justifies some of this gap, but if you have adequate term insurance separately, the investment return is generally considered poor.",
  },
  {
    question: "How do I calculate the actual return on my LIC policy?",
    answer:
      "Use the Quick Calculator for a fast estimate — enter your annual premium, number of years, and maturity amount. For a more accurate result, use Advanced Cashflows mode: enter every premium paid as a negative cashflow with its exact date, and every benefit received (survival, money-back, bonus) as a positive cashflow with its date. The XIRR result is your true annualized return.",
  },
  {
    question: "Should I surrender my LIC policy or continue?",
    answer:
      "Use the 'Continue vs Surrender' tab. It compares: (1) staying invested until maturity vs (2) surrendering today, taking the surrender value, and investing the proceeds + future premiums at an alternative rate. Key factors: years remaining in the policy, your surrender value today, future premium amount, expected maturity, and what return you'd expect from alternatives (PPF, mutual funds, FD).",
  },
  {
    question: "How is surrender value calculated for LIC policies?",
    answer:
      "LIC pays whichever is higher — Guaranteed Surrender Value (GSV) or Special Surrender Value (SSV). GSV = (Total premiums paid × GSV%) minus survival benefits already paid. The GSV% depends on policy year: 30% in year 3, 50% from year 4–7, rising to 80–90% in the final years. SSV is based on the paid-up value plus accrued bonus × a surrender factor. Use the 'Estimate Surrender Value' tab to calculate both.",
  },
  {
    question: "What is the LIC bonus rate for 2025?",
    answer:
      "LIC declared bonus rates based on its valuation as of 31 March 2025. Key rates: New Endowment (Plan 714) — ₹45/1000 SA for >20 year term; New Jeevan Anand (715) — ₹46/1000 SA for >20 year term; Jeevan Labh (736) — ₹47/1000 SA for 25-year term. New in 2025: SA ≥ ₹5 lakh gets +₹1/1000 SA extra per year, and Jeevan Labh (736) SA ≥ ₹10 lakh gets +₹2/1000 SA. Use our 'Estimate Surrender Value' calculator which uses these updated 2025 rates.",
  },
  {
    question: "Is this calculator accurate for money-back plans?",
    answer:
      "Yes — use Advanced Cashflows mode. For a money-back plan, enter the survival benefit payouts (typically 20% of SA every 5 years) as positive cashflows on their actual dates, along with the final maturity amount. Quick mode assumes a single premium-paying period and single maturity — it's less accurate for money-back plans with intermediate payouts.",
  },
  {
    question: "Does this work for HDFC Life, SBI Life, ICICI Pru, Max Life?",
    answer:
      "Yes. The XIRR calculation is purely mathematical — it doesn't depend on the insurance company. Enter your premiums and benefits from any insurer. The 'Estimate Surrender Value' tab currently uses LIC-specific bonus rates and GSV factors, as other insurers have different structures.",
  },
];

export default function LicXirrCalculatorPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Calculators", href: "/calculator" },
      { name: "LIC XIRR Calculator", href: URL },
    ]),
    calculatorSchema({ name: "LIC XIRR Calculator", description: DESCRIPTION, url: URL }),
    faqSchema(faqs),
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/calculator" className="hover:text-brand">Calculators</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">LIC XIRR Calculator</span>
      </nav>

      {/* Hero */}
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        LIC XIRR Calculator — Find Your Policy&apos;s Real Return
      </h1>
      <p className="mt-4 text-lg text-ink-soft max-w-2xl">
        What is your LIC policy actually earning? Calculate the true annualized return (XIRR),
        run a continue vs surrender analysis, and estimate your surrender value using{" "}
        <strong className="text-ink">2025 LIC bonus rates</strong> — all in one place.
      </p>

      {/* Mode cards */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MODES.map((m) => (
          <div key={m.title} className="rounded-xl border border-rule bg-surface p-4 shadow-card">
            <p className="text-2xl mb-2">{m.icon}</p>
            <p className="font-semibold text-ink text-sm">{m.title}</p>
            <p className="mt-1 text-xs text-ink-soft leading-relaxed">{m.desc}</p>
            <p className="mt-2 text-[10px] text-brand font-medium">{m.who}</p>
          </div>
        ))}
      </div>

      {/* Calculator */}
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card-lg sm:p-7">
        <LicXirrCalculator />
      </div>
      <p className="mt-2 text-xs text-ink-soft text-center">
        All calculations run in your browser. No data is sent to any server.
      </p>

      {/* XIRR benchmark table */}
      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink">What Is a Good XIRR for an Insurance Policy?</h2>
        <p className="mt-3 text-ink-soft">
          Once you know your XIRR, compare it against these benchmarks. Remember: LIC policies
          include life cover, so a 1–2% discount vs pure investments is often reasonable — but
          anything below 5% is difficult to justify if you have separate term insurance.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft">XIRR</th>
                <th className="px-4 py-2.5 font-medium text-ink-soft">Rating</th>
                <th className="px-4 py-2.5 font-medium text-ink-soft">What it means</th>
              </tr>
            </thead>
            <tbody>
              {XIRR_BENCHMARKS.map((r) => (
                <tr key={r.band} className={`border-b border-rule last:border-0 ${r.bg}`}>
                  <td className="tabular px-4 py-2.5 font-mono font-medium text-ink">{r.band}</td>
                  <td className={`px-4 py-2.5 font-semibold ${r.color}`}>{r.rating}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* LIC vs alternatives */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">LIC Returns vs Alternative Investments</h2>
        <p className="mt-3 text-ink-soft">
          Most traditional LIC plans deliver 4.5–6% XIRR. Here&apos;s how that compares to other
          options available to Indian investors:
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft">Investment</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">Typical Return</th>
                <th className="px-4 py-2.5 font-medium text-ink-soft">Risk</th>
                <th className="px-4 py-2.5 font-medium text-ink-soft">Life Cover?</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Traditional LIC (endowment)",  ret: "4.5–6%",  risk: "None",   cover: "Yes (bundled)" },
                { name: "Term Insurance + PPF",          ret: "7.1%",    risk: "None",   cover: "Separate" },
                { name: "Term Insurance + EPF",          ret: "8.25%",   risk: "None",   cover: "Separate" },
                { name: "Term Insurance + NPS",          ret: "8–10%",   risk: "Low",    cover: "Separate" },
                { name: "Term Insurance + Mutual Funds", ret: "10–12%+", risk: "Medium", cover: "Separate" },
                { name: "ULIP (LIC market-linked)",      ret: "7–11%",   risk: "Medium", cover: "Yes (bundled)" },
              ].map((row) => (
                <tr key={row.name} className="border-b border-rule last:border-0 hover:bg-paper">
                  <td className="px-4 py-2.5 font-medium text-ink">{row.name}</td>
                  <td className="tabular px-4 py-2.5 text-right font-semibold text-brand">{row.ret}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{row.risk}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{row.cover}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Equity returns are historical long-run averages and not guaranteed. Past returns ≠ future returns.
          This is not financial advice — consult a SEBI-registered fee-only financial planner.
        </p>
      </section>

      {/* How surrender value works */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How LIC Surrender Value is Calculated</h2>
        <p className="mt-3 text-ink-soft">
          LIC pays whichever is higher of two values — Guaranteed Surrender Value (GSV) or Special
          Surrender Value (SSV). Here&apos;s how each is calculated:
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-rule bg-surface p-5">
            <p className="font-semibold text-ink">Guaranteed Surrender Value (GSV)</p>
            <div className="mt-3 rounded-lg bg-paper border border-rule px-4 py-3 font-mono text-xs text-ink">
              GSV = (Total Premiums Paid × GSV%) − Survival Benefits Already Paid
            </div>
            <p className="mt-3 text-sm text-ink-soft">GSV% by policy year:</p>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              {[
                ["Year 1–2", "0% (nil)"],
                ["Year 3", "30%"],
                ["Year 4–7", "50%"],
                ["Year 8–10", "55%"],
                ["Year 11–13", "60%"],
                ["Year 14–16", "65%"],
                ["Year 17–20", "70%"],
                ["Year 21–24", "75%"],
                ["Year 25+", "80%"],
              ].map(([yr, pct]) => (
                <div key={yr} className="flex justify-between rounded bg-paper px-2 py-1">
                  <span className="text-ink-soft">{yr}</span>
                  <span className="font-medium text-ink">{pct}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-rule bg-surface p-5">
            <p className="font-semibold text-ink">Special Surrender Value (SSV)</p>
            <div className="mt-3 rounded-lg bg-paper border border-rule px-4 py-3 font-mono text-xs text-ink">
              Paid-up Value = (Premiums Paid / Total Premiums) × Sum Assured
              <br /><br />
              SSV = Paid-up Value + (Accrued Bonus × ~30%)
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              Accrued Bonus = SRB Rate × (Sum Assured ÷ 1000) × Years Paid
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              <strong className="text-ink">2025 LIC SRB Rates (sample):</strong>
            </p>
            <div className="mt-2 space-y-1 text-xs">
              {[
                ["New Endowment (714) >20yr", "₹45/1000 SA"],
                ["Jeevan Anand (715) >20yr",  "₹46/1000 SA"],
                ["Jeevan Labh (736) 25yr",    "₹47/1000 SA"],
                ["Money Back 20yr (720)",      "₹36/1000 SA"],
                ["SA ≥ ₹5L bonus",            "+₹1/1000 extra"],
              ].map(([plan, rate]) => (
                <div key={plan} className="flex justify-between rounded bg-paper px-2 py-1">
                  <span className="text-ink-soft">{plan}</span>
                  <span className="font-medium text-brand">{rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-brand/20 bg-brand-soft p-4 text-sm text-ink-soft">
          <strong className="text-ink">💡 Use the &quot;Estimate Surrender Value&quot; tab</strong> in the
          calculator above to compute both GSV and SSV for your policy using 2025 LIC bonus rates —
          no need to call your LIC agent.
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
            { href: "/calculator/xirr-calculator",         label: "XIRR Calculator" },
            { href: "/calculator/cagr-xirr-calculator",    label: "CAGR / XIRR" },
            { href: "/calculator/ppf-calculator",           label: "PPF Calculator" },
            { href: "/calculator/epf-calculator",           label: "EPF & VPF Calculator" },
            { href: "/calculator/nps-calculator",           label: "NPS Calculator" },
            { href: "/calculator/sip-calculator",           label: "SIP vs Lumpsum" },
            { href: "/calculator/fd-calculator",            label: "FD Calculator" },
            { href: "/calculator/goal-planning-calculator", label: "Retirement Planner" },
          ].map((l) => (
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
