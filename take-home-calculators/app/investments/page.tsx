import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, webPageSchema, faqSchema, buildJsonLd } from "@/lib/schema";
import LandingHubLinks from "@/components/LandingHubLinks";
import LandingFaq from "@/components/LandingFaq";

const URL = "/investments";
const TITLE = "Investment Calculators India — SIP, Lumpsum, SWP, Goal Planning";
const DESCRIPTION =
  "Free investment calculators for India — SIP, step-up SIP, lumpsum, SWP with inflation, ELSS, and goal planning. Project mutual fund returns and plan your investments accurately.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
};

const QUICK_GLANCE = [
  { icon: "📈", label: "SIP Growth", desc: "Monthly investment compounding" },
  { icon: "🪜", label: "Step-Up SIP", desc: "Increase contributions yearly" },
  { icon: "💵", label: "Lumpsum", desc: "One-time investment growth" },
  { icon: "📉", label: "SWP Payouts", desc: "Inflation-adjusted withdrawals" },
  { icon: "🎯", label: "Goal Planning", desc: "Invest backwards from a target" },
  { icon: "🧾", label: "ELSS Tax Saving", desc: "80C benefit, 3-year lock-in" },
];

const CALCULATORS = [
  {
    href: "/calculator/sip-calculator",
    icon: "📈",
    title: "SIP Calculator",
    desc: "Project mutual fund SIP returns with monthly contributions and expected growth rate.",
  },
  {
    href: "/calculator/step-up-sip-calculator",
    icon: "🪜",
    title: "Step-Up SIP Calculator",
    desc: "SIP returns when you increase your contribution every year, matching salary growth.",
  },
  {
    href: "/calculator/lumpsum-calculator",
    icon: "💵",
    title: "Lumpsum Calculator",
    desc: "One-time mutual fund investment growth over your chosen time horizon.",
  },
  {
    href: "/calculator/mutual-fund-calculator",
    icon: "🧮",
    title: "Mutual Fund Calculator",
    desc: "General-purpose mutual fund return calculator for SIP or lumpsum modes.",
  },
  {
    href: "/calculator/swp-calculator",
    icon: "🏧",
    title: "SWP Calculator",
    desc: "Systematic withdrawal plan payouts and how long a fixed corpus will last.",
  },
  {
    href: "/calculator/swp-inflation-calculator",
    icon: "📉",
    title: "SWP with Inflation",
    desc: "Withdrawal plan payouts adjusted for inflation, and how long your corpus lasts.",
  },
  {
    href: "/calculator/goal-planning-calculator",
    icon: "🎯",
    title: "Goal Planning Calculator",
    desc: "How much to invest monthly to hit a specific financial goal by a target date.",
  },
  {
    href: "/calculator/elss-calculator",
    icon: "🧾",
    title: "ELSS Calculator",
    desc: "Tax-saving mutual fund returns and 80C savings — just a 3-year lock-in.",
  },
  {
    href: "/calculator/xirr-calculator",
    icon: "🔀",
    title: "XIRR Calculator",
    desc: "Annualized return for investments with irregular cash flows and dates.",
  },
  {
    href: "/calculator/lic-xirr-calculator",
    icon: "📄",
    title: "LIC XIRR Calculator",
    desc: "True annualized return on LIC policies, including bonuses and maturity value.",
  },
  {
    href: "/calculator/cagr-xirr-calculator",
    icon: "📐",
    title: "CAGR & XIRR Calculator",
    desc: "Compare compound annual growth rate against annualized XIRR for the same investment.",
  },
  {
    href: "/calculator/real-returns-calculator",
    icon: "📉",
    title: "Inflation-Adjusted Returns",
    desc: "What your investment returns are really worth after inflation.",
  },
];

const FAQS = [
  {
    question: "SIP or lumpsum — which is better?",
    answer:
      "SIP works well when you're investing from regular income and want to average out market volatility (rupee cost averaging). Lumpsum makes sense when you have a windfall — like a bonus — and markets aren't at a clear high. Most salaried investors are better off with SIPs simply because that's how their income arrives.",
  },
  {
    question: "What return rate should I assume for equity mutual funds?",
    answer:
      "Indian equity mutual funds have historically returned 10-14% annualized over long periods (10+ years), though any single year can vary widely. For planning purposes, 10-12% is a reasonably conservative assumption; anything above 14% risks overestimating your future corpus.",
  },
  {
    question: "Is SIP investment tax-free?",
    answer:
      "No — SIP returns are taxed as capital gains when you redeem, based on how long each installment was held. Only ELSS funds offer an 80C deduction on the amount invested (up to ₹1.5 lakh/year), with a mandatory 3-year lock-in per installment.",
  },
  {
    question: "How is XIRR different from CAGR?",
    answer:
      "CAGR assumes a single lumpsum investment held for a fixed period. XIRR handles irregular, multiple cash flows on different dates — exactly what a SIP or an LIC policy with variable premiums looks like — making it the more accurate measure for real-world investing.",
  },
];

export default function InvestmentsLandingPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Investments", href: URL },
    ]),
    webPageSchema({ name: TITLE, description: DESCRIPTION, url: URL }),
    faqSchema(FAQS)
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Investments</span>
      </nav>

      <div className="flex items-center gap-4 mb-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-3xl">📈</span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Investment Calculators</h1>
          <p className="text-sm text-ink-soft mt-0.5">SIP, lumpsum, SWP, goal planning, ELSS</p>
        </div>
      </div>

      <p className="text-lg text-ink-soft leading-relaxed max-w-2xl">
        Starting a SIP, planning a lumpsum bonus investment, working out how long your
        retirement corpus will last, or figuring out exactly how much to invest monthly to hit
        a ₹1 crore goal — these calculators model mutual fund and market-linked investments the
        way Indian investors actually use them.
      </p>

      {/* Quick glance */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_GLANCE.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-rule bg-surface px-4 py-3 shadow-card">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-medium text-ink">{item.label}</p>
              <p className="text-xs text-ink-soft">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Calculator grid */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">All Investment Calculators</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {CALCULATORS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex items-start gap-4 rounded-xl border border-rule bg-surface px-5 py-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg"
            >
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="font-medium text-brand">{c.title}</p>
                <p className="mt-0.5 text-sm text-ink-soft">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Use-case callout */}
      <section className="mt-12 rounded-xl border border-brand/20 bg-brand-soft p-6">
        <h2 className="font-display text-xl text-ink">Just got a bonus or raise?</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Decide between a one-time lumpsum investment or starting a fresh SIP with the extra
          amount. If you already have a SIP running, model a step-up instead — increasing your
          monthly investment each year in line with your salary growth compounds significantly
          faster than staying flat.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/calculator/lumpsum-calculator"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
            Try Lumpsum Calculator →
          </Link>
          <Link href="/calculator/step-up-sip-calculator"
            className="rounded-full border border-brand px-5 py-2 text-sm font-medium text-brand hover:bg-brand-soft transition">
            Step-Up SIP Calculator
          </Link>
        </div>
      </section>

      {/* Educational content */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How Mutual Fund Investing Works in India</h2>
        <p className="mt-3 text-ink-soft">
          Mutual funds pool money from many investors to buy a diversified basket of stocks,
          bonds, or both, managed by a professional fund manager. A Systematic Investment Plan
          (SIP) lets you invest a fixed amount every month, automatically buying more units when
          prices are low and fewer when prices are high — a disciplined approach known as rupee
          cost averaging. A lumpsum investment, by contrast, deploys the full amount at once and
          is more sensitive to market timing.
        </p>
        <p className="mt-3 text-ink-soft">
          Once you&apos;re closer to a goal — retirement, a child&apos;s education, or a large
          purchase — a Systematic Withdrawal Plan (SWP) lets you draw a fixed or inflation-linked
          amount from your corpus each month while the rest stays invested. Capital gains on
          equity mutual funds held over a year are taxed at 12.5% (above a ₹1.25 lakh annual
          exemption); funds held under a year are taxed at 20%. ELSS is the only mutual fund
          category that also qualifies for an 80C deduction, in exchange for a mandatory 3-year
          lock-in.
        </p>
      </section>

      <LandingFaq faqs={FAQS} />
      <LandingHubLinks currentHref={URL} />
    </main>
  );
}
