import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, webPageSchema, faqSchema, buildJsonLd } from "@/lib/schema";
import LandingHubLinks from "@/components/LandingHubLinks";
import LandingFaq from "@/components/LandingFaq";

const URL = "/retirement";
const TITLE = "Retirement & Savings Calculators India — EPF, PPF, NPS, Gratuity, NSC";
const DESCRIPTION =
  "Free retirement and savings calculators for India — EPF & VPF, PPF, NPS, gratuity, NSC, SSY, and SCSS. Project your retirement corpus and statutory savings accurately, updated for FY 2025-26.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
};

const QUICK_GLANCE = [
  { icon: "🏦", label: "EPF Corpus", desc: "Employer + employee contribution growth" },
  { icon: "📗", label: "PPF Maturity", desc: "15-year lock-in, tax-free returns" },
  { icon: "📈", label: "NPS Pension", desc: "Market-linked retirement corpus" },
  { icon: "🎁", label: "Gratuity", desc: "Payout after 5+ years of service" },
  { icon: "👧", label: "SSY", desc: "Girl child savings, fully tax-free" },
  { icon: "🧓", label: "SCSS", desc: "Senior citizen quarterly payouts" },
];

const CALCULATORS = [
  {
    href: "/calculator/epf-calculator",
    icon: "🏦",
    title: "EPF & VPF Calculator",
    desc: "Project your Employee Provident Fund corpus with employer contribution and interest.",
  },
  {
    href: "/calculator/epf-vs-ppf",
    icon: "⚖️",
    title: "EPF vs PPF",
    desc: "Side-by-side comparison of returns, lock-in, and liquidity between EPF and PPF.",
  },
  {
    href: "/calculator/ppf-calculator",
    icon: "📗",
    title: "PPF Calculator",
    desc: "15-year Public Provident Fund maturity value with current interest rates.",
  },
  {
    href: "/calculator/nps-calculator",
    icon: "📈",
    title: "NPS Calculator",
    desc: "National Pension System corpus and expected pension at retirement.",
  },
  {
    href: "/calculator/gratuity-calculator",
    icon: "🎁",
    title: "Gratuity Calculator",
    desc: "Gratuity payable after 5+ years of service, per the Payment of Gratuity Act.",
  },
  {
    href: "/calculator/nsc-calculator",
    icon: "📜",
    title: "NSC Calculator",
    desc: "National Savings Certificate maturity value and interest earned.",
  },
  {
    href: "/calculator/ssy-calculator",
    icon: "👧",
    title: "Sukanya Samriddhi Yojana",
    desc: "SSY maturity value for your girl child's savings, fully tax-free under 80C.",
  },
  {
    href: "/calculator/scss-calculator",
    icon: "🧓",
    title: "SCSS Calculator",
    desc: "Senior Citizen Savings Scheme quarterly interest payout and total returns.",
  },
  {
    href: "/calculator/fire-calculator",
    icon: "🔥",
    title: "FIRE Calculator",
    desc: "How much corpus you need to retire early, and how many years away you are.",
  },
];

const FAQS = [
  {
    question: "How much should I save for retirement in India?",
    answer:
      "A common rule of thumb is 25× your expected annual expenses at retirement (the '4% rule'). For someone spending ₹6 lakh/year today, that's roughly ₹1.5 crore in today's money — more once you adjust for inflation over your working years. Use the FIRE Calculator to model this against your actual savings rate.",
  },
  {
    question: "Should I choose EPF, PPF, or NPS?",
    answer:
      "EPF is mandatory for most salaried employees and gives employer matching — always maximize it first. PPF is a good additional 80C option with sovereign-backed safety and tax-free returns, but has a 15-year lock-in. NPS adds market-linked growth and an extra ₹50,000 deduction under 80CCD(1B), but part of the corpus is mandatorily annuitized. Most people benefit from a mix of all three.",
  },
  {
    question: "Is EPF interest taxable?",
    answer:
      "EPF interest is tax-free as long as your own contribution stays within ₹2.5 lakh per financial year (₹5 lakh if there's no employer contribution). Interest on contributions above that threshold is taxable at your slab rate.",
  },
  {
    question: "What happens to my EPF if I switch jobs?",
    answer:
      "Your EPF account should be transferred to your new employer via the UAN (Universal Account Number) — it doesn't need to be withdrawn. Withdrawing before 5 years of continuous service (across employers, if transferred) can trigger tax on the employer contribution and interest portions.",
  },
];

export default function RetirementLandingPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Retirement", href: URL },
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
        <span aria-current="page">Retirement</span>
      </nav>

      <div className="flex items-center gap-4 mb-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-3xl">🏦</span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Retirement & Savings Calculators</h1>
          <p className="text-sm text-ink-soft mt-0.5">EPF, PPF, NPS, gratuity, NSC, SSY, SCSS</p>
        </div>
      </div>

      <p className="text-lg text-ink-soft leading-relaxed max-w-2xl">
        Whether you&apos;re tracking your mandatory EPF, deciding between PPF and NPS for extra
        80C savings, or figuring out how much your gratuity will be worth after a decade at the
        same company — these calculators use India&apos;s actual statutory rates so you can plan
        with real numbers, not rough guesses.
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
        <h2 className="font-display text-2xl text-ink">All Retirement Calculators</h2>
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
        <h2 className="font-display text-xl text-ink">Just started your first job?</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Your EPF contribution starts automatically from your first salary. Start with the EPF
          Calculator to see how your corpus grows, then add a PPF or NPS account for extra
          tax-advantaged savings beyond what your employer offers.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/calculator/epf-calculator"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
            Check EPF Corpus →
          </Link>
          <Link href="/calculator/epf-vs-ppf"
            className="rounded-full border border-brand px-5 py-2 text-sm font-medium text-brand hover:bg-brand-soft transition">
            EPF vs PPF
          </Link>
        </div>
      </section>

      {/* Educational content */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How Retirement Savings Work in India</h2>
        <p className="mt-3 text-ink-soft">
          Most salaried Indians build retirement savings through a mix of mandatory and voluntary
          schemes. The Employees&apos; Provident Fund (EPF) is mandatory for employees earning
          up to ₹15,000 basic pay in eligible organizations, with both employer and employee
          contributing 12% of basic salary monthly. Beyond EPF, the Public Provident Fund (PPF)
          and National Pension System (NPS) are the two most popular voluntary options — PPF for
          its sovereign guarantee and tax-free maturity, NPS for market-linked growth and an
          additional ₹50,000 deduction under Section 80CCD(1B).
        </p>
        <p className="mt-3 text-ink-soft">
          Gratuity is a separate statutory benefit paid by employers to employees who complete
          5 or more years of continuous service, calculated as 15 days&apos; wages for every
          completed year. For long-term, goal-linked savings — like a child&apos;s education —
          schemes like Sukanya Samriddhi Yojana (SSY) and NSC offer fixed, government-backed
          returns. Together, these schemes form the backbone of retirement planning for most
          Indian households.
        </p>
      </section>

      <LandingFaq faqs={FAQS} />
      <LandingHubLinks currentHref={URL} />
    </main>
  );
}
