import type { Metadata } from "next";
import Link from "next/link";
import { salarySlug } from "@/lib/salary-data";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { calculateIncomeTax, getCurrentFY } from "@/lib/calculators/income-tax";
import { getAllBlogPosts, formatBlogDate } from "@/lib/blog-loader";
import { incomeTaxSlug } from "@/lib/income-tax-data";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

export const metadata: Metadata = {
  title: "SalaryTools India — Free Salary, Tax & Investment Calculators",
  description:
    "Free calculators for India's salaried professionals. In-hand salary, income tax (new vs old regime), EPF, SIP, EMI, real estate, LIC XIRR and 30+ more. Updated for FY 2025-26.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "SalaryTools India — Free Salary, Tax & Investment Calculators",
    description: "Free salary, tax, EPF, SIP and investment calculators for India. Updated for FY 2025-26.",
    url: absoluteUrl("/"),
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const FY = getCurrentFY();

const SALARY_SNAPSHOTS = [5, 8, 10, 12, 15, 20, 25, 30].map(lpa => {
  const result = calculateSalaryBreakup({ annualCtc: lpa * 100_000, regime: "new" });
  return { lpa, inHand: result.inHandMonthly };
});

const TAX_SNAPSHOTS = [6, 8, 10, 12, 15, 20, 25, 30].map(lpa => {
  const gross = Math.round(lpa * 100_000 * 0.85);
  const tax = calculateIncomeTax(gross, "new");
  return { lpa, tax: tax.totalTaxPayable, effective: gross > 0 ? (tax.totalTaxPayable / gross) * 100 : 0, taxFree: tax.totalTaxPayable === 0 };
});

const TOOL_SECTIONS = [
  {
    id: "salary",
    heading: "Salary & CTC",
    emoji: "💰",
    href: "/salary",
    tools: [
      { href: "/salary",                              emoji: "💰", label: "In-Hand Salary Calculator",      desc: "CTC → take-home with full slab breakdown" },
      { href: "/salary/inhand-to-ctc-calculator",     emoji: "🔄", label: "In-Hand to CTC",                 desc: "Reverse: find CTC from desired take-home" },
      { href: "/salary/salary-structure-calculator",  emoji: "📋", label: "Salary Structure Calculator",    desc: "Custom basic/HRA/allowance percentages" },
      { href: "/calculator/salary-hike-calculator",   emoji: "📈", label: "Salary Hike Calculator",         desc: "Impact of % hike on monthly take-home" },
      { href: "/salary-growth",                       emoji: "🚀", label: "Salary Growth Projector",        desc: "Where will your salary be in 5 & 10 years?" },
    ],
  },
  {
    id: "tax",
    heading: "Income Tax",
    emoji: "🧾",
    href: "/tax-saving",
    tools: [
      { href: "/calculator/income-tax-calculator",    emoji: "🧾", label: "Income Tax Calculator",          desc: "New vs old regime · slab-wise breakdown" },
      { href: "/calculator/old-vs-new-tax-regime",    emoji: "⚖️", label: "Old vs New Regime",              desc: "Which regime saves you more money?" },
      { href: "/calculator/hra-calculator",           emoji: "🏡", label: "HRA Exemption Calculator",       desc: "How much of your HRA is tax-free" },
      { href: "/tax-saving",                          emoji: "📋", label: "Tax Saving Guide",               desc: "80C, NPS, home loan — all deductions" },
      { href: "/calculator/capital-gains-calculator", emoji: "📊", label: "Capital Gains Tax",              desc: "STCG & LTCG on equity, debt, property" },
    ],
  },
  {
    id: "retirement",
    heading: "Retirement & Savings",
    emoji: "🏦",
    href: "/retirement",
    tools: [
      { href: "/calculator/epf-calculator",           emoji: "🏦", label: "EPF & VPF Calculator",           desc: "Monthly PF contribution + long-term corpus" },
      { href: "/calculator/ppf-calculator",           emoji: "📗", label: "PPF Calculator",                 desc: "Year-by-year growth at 7.1%" },
      { href: "/calculator/nps-calculator",           emoji: "🏛️", label: "NPS Calculator",                 desc: "Retirement corpus + monthly pension" },
      { href: "/calculator/gratuity-calculator",      emoji: "🎁", label: "Gratuity Calculator",            desc: "Lump-sum after 5+ years of service" },
      { href: "/calculator/fire-calculator",          emoji: "🔥", label: "FIRE Calculator",                desc: "When can you retire early?" },
    ],
  },
  {
    id: "investments",
    heading: "Investments",
    emoji: "📈",
    href: "/investments",
    tools: [
      { href: "/calculator/sip-calculator",           emoji: "📊", label: "SIP Calculator",                 desc: "Project mutual fund SIP growth" },
      { href: "/calculator/step-up-sip-calculator",   emoji: "⬆️", label: "Step-Up SIP",                    desc: "SIP with annual increase — more realistic" },
      { href: "/calculator/lumpsum-calculator",       emoji: "💵", label: "Lumpsum Calculator",             desc: "One-time investment returns over time" },
      { href: "/calculator/goal-planning-calculator", emoji: "🎯", label: "Goal Planning",                  desc: "SIP needed to reach any financial goal" },
      { href: "/calculator/xirr-calculator",          emoji: "📐", label: "XIRR Calculator",                desc: "Annualised returns for irregular cashflows" },
    ],
  },
  {
    id: "realestate",
    heading: "Real Estate",
    emoji: "🏠",
    href: "/real-estate",
    tools: [
      { href: "/real-estate/home-affordability-calculator",   emoji: "🏠", label: "Home Affordability",     desc: "How much home can you afford on your salary?" },
      { href: "/real-estate/rent-vs-buy-calculator",          emoji: "⚖️", label: "Rent vs Buy",            desc: "20-year net worth comparison" },
      { href: "/real-estate/stamp-duty-calculator",           emoji: "📋", label: "Stamp Duty Calculator",  desc: "State-wise stamp duty + registration charges" },
      { href: "/real-estate/rental-yield-calculator",         emoji: "📊", label: "Rental Yield",           desc: "Is your property a good investment?" },
      { href: "/real-estate/property-appreciation-calculator",emoji: "📈", label: "Property Appreciation",  desc: "Future value with city-wise rates" },
    ],
  },
  {
    id: "loans",
    heading: "Loans & Deposits",
    emoji: "💳",
    href: "/loans-deposits",
    tools: [
      { href: "/calculator/emi-calculator",               emoji: "🏠", label: "EMI Calculator",             desc: "Home, car, personal & education loans" },
      { href: "/calculator/fd-calculator",                emoji: "🏧", label: "Fixed Deposit",              desc: "FD maturity at any compounding frequency" },
      { href: "/calculator/rd-calculator",                emoji: "📆", label: "Recurring Deposit",          desc: "RD maturity from monthly deposits" },
      { href: "/calculator/compound-interest-calculator", emoji: "♾️", label: "Compound Interest",          desc: "CI with flexible compounding periods" },
      { href: "/calculator/lic-xirr-calculator",          emoji: "🛡️", label: "LIC XIRR Calculator",        desc: "Real return on LIC + surrender value estimator" },
    ],
  },
];

const FAQS = [
  {
    q: "Is my data stored or sent anywhere?",
    a: "No. Every calculation runs entirely in your browser. Nothing you type is sent to a server, saved, or shared.",
  },
  {
    q: "Which tax regime does the calculator use by default?",
    a: "The new tax regime (default since FY 2023-24). Every calculator lets you switch to the old regime to compare your actual take-home and tax liability under both.",
  },
  {
    q: "How accurate is the in-hand salary calculator?",
    a: "It models the most common Indian private-sector salary structure — basic ~40% of CTC, HRA ~50% of basic, statutory PF, professional tax, and standard deduction. Use it as a close estimate; your actual figure depends on your specific offer letter and city.",
  },
  {
    q: "Why is my CTC different from my take-home salary?",
    a: "CTC (Cost to Company) includes employer PF contribution (~12% of basic) and gratuity provisioning — neither appears in your monthly bank credit. Your take-home is what remains after deducting employee PF, professional tax, income tax (TDS), and any other deductions.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const recentPosts = getAllBlogPosts().slice(0, 3);

  return (
    <main>

      {/* ════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-soft via-paper to-paper">
        <div className="mx-auto max-w-5xl px-6 pt-14 pb-12 sm:pt-20 sm:pb-16">

          {/* Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-surface px-3 py-1 text-xs font-medium text-brand">
              Updated for FY 2025-26 · New tax regime rules
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-5 text-center font-display text-4xl font-semibold text-ink sm:text-5xl">
            Know your salary.<br className="hidden sm:block" /> Pay less tax.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-center text-base text-ink-soft sm:text-lg">
            Free calculators for India&apos;s salaried professionals — in-hand salary, income tax, EPF, SIP, real estate and more.
          </p>

          {/* Primary CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/salary"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-card-lg transition hover:opacity-90">
              💰 Calculate In-Hand Salary <ArrowIcon />
            </Link>
            <Link href="/calculator/income-tax-calculator"
              className="inline-flex items-center gap-2 rounded-full border border-brand bg-surface px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white">
              🧾 Income Tax Calculator
            </Link>
          </div>

          {/* Trust bar */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-ink-soft">
            {["30+ free calculators", "No signup required", "No data stored", "Updated every budget"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-brand">✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TRENDING BANNER (time-bound — remove when 8th CPC is finalised)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 pt-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-brand/20 bg-surface px-6 py-4 shadow-card sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-1 items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-2xl">🏛️</span>
            <div>
              <p className="flex flex-wrap items-center gap-2 font-semibold text-ink text-sm">
                8th Pay Commission Salary Calculator
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">🔥 Trending</span>
              </p>
              <p className="text-xs text-ink-soft mt-0.5">Estimate your revised basic, HRA & gross pay with adjustable fitment factor.</p>
            </div>
          </div>
          <Link href="/calculator/8th-pay-commission-calculator"
            className="shrink-0 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
            Estimate My New Salary →
          </Link>
        </div>
      </section>
      {/* END TRENDING BANNER */}

      {/* ════════════════════════════════════════════════════════════════════
          SALARY SNAPSHOT — immediate value, above the fold
      ════════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 pt-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">In-Hand Salary by CTC</h2>
            <p className="text-xs text-ink-soft mt-0.5">New regime · FY 2025-26 · Monthly take-home</p>
          </div>
          <Link href="/salary" className="text-sm font-medium text-brand hover:underline underline-offset-2 shrink-0">
            All salaries →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
          {SALARY_SNAPSHOTS.map(({ lpa, inHand }) => (
            <Link key={lpa} href={`/salary/${salarySlug(lpa)}`}
              className="group block rounded-xl border border-rule bg-surface px-3 py-3 text-center shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg">
              <p className="font-display text-base font-semibold text-ink">{lpa} LPA</p>
              <p className="tabular mt-0.5 text-xs text-ink-soft">{formatINR(inHand)}<span className="text-[10px]">/mo</span></p>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          INCOME TAX SNAPSHOT
      ════════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 py-6">
        <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-soft to-paper shadow-card overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand/10">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">
                Income Tax Calculator
              </h2>
              <p className="text-xs text-ink-soft mt-0.5">New regime · ₹75,000 std deduction · Zero tax up to ₹12.75 LPA</p>
            </div>
            <Link href="/calculator/income-tax-calculator"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-brand px-4 py-1.5 text-sm font-medium text-brand hover:bg-brand hover:text-white transition">
              Full Calculator <ArrowIcon />
            </Link>
          </div>

          {/* Tax grid */}
          <div className="p-5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
              {TAX_SNAPSHOTS.map(({ lpa, tax, effective, taxFree }) => (
                <Link key={lpa} href={`/calculator/income-tax-calculator/${incomeTaxSlug(lpa)}`}
                  className="group rounded-xl border border-rule bg-surface px-3 py-3 text-center hover:border-brand hover:-translate-y-0.5 transition shadow-card">
                  <p className="font-display text-base font-semibold text-ink">{lpa} LPA</p>
                  <p className={`tabular text-xs font-semibold mt-0.5 ${taxFree ? "text-brand" : "text-deduction"}`}>
                    {taxFree ? "Zero tax ✓" : formatINRCompact(tax)}
                  </p>
                  <p className="text-[10px] text-ink-soft mt-0.5">
                    {taxFree ? "87A rebate" : `${effective.toFixed(1)}% eff.`}
                  </p>
                </Link>
              ))}
            </div>

            {/* Highlights + CTAs */}
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                { icon: "🎯", label: "Zero tax up to",       value: "₹12.75 LPA",  sub: "New regime + std deduction" },
                { icon: "📋", label: "Standard deduction",   value: "₹75,000",      sub: "New regime · ₹50,000 old" },
                { icon: "🎁", label: "Section 87A rebate",   value: "₹60,000",      sub: "Taxable income ≤ ₹12L" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-rule bg-paper px-3 py-2.5">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-[10px] text-ink-soft">{item.label}</p>
                    <p className="font-semibold text-ink text-sm">{item.value}</p>
                    <p className="text-[10px] text-ink-soft">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/calculator/income-tax-calculator"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
                Calculate My Tax <ArrowIcon />
              </Link>
              <Link href="/calculator/old-vs-new-tax-regime"
                className="inline-flex items-center gap-2 rounded-full border border-rule bg-surface px-5 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand transition">
                Old vs New Regime
              </Link>
              <Link href="/tax-saving"
                className="inline-flex items-center gap-2 rounded-full border border-rule bg-surface px-5 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand transition">
                Tax Saving Guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TOOL DIRECTORY — grouped, scannable
      ════════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-ink">All Calculators</h2>
          <p className="mt-1 text-sm text-ink-soft">30+ free tools — salary, tax, investments, real estate, loans and more</p>
        </div>

        <div className="space-y-10">
          {TOOL_SECTIONS.map(section => (
            <div key={section.id}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="flex items-center gap-2 font-semibold text-ink">
                  <span>{section.emoji}</span> {section.heading}
                </h3>
                <Link href={section.href} className="text-xs font-medium text-brand hover:underline underline-offset-2">
                  See all →
                </Link>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {section.tools.map(tool => (
                  <Link key={tool.href} href={tool.href}
                    className="group flex items-start gap-3 rounded-xl border border-rule bg-surface px-4 py-3 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper text-sm group-hover:bg-brand-soft transition-colors">
                      {tool.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink group-hover:text-brand transition leading-tight">{tool.label}</p>
                      <p className="mt-0.5 text-xs text-ink-soft leading-relaxed">{tool.desc}</p>
                    </div>
                    <ArrowIcon className="ml-auto mt-1 shrink-0 text-ink-soft opacity-0 group-hover:opacity-100 transition" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Other tools row */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-ink mb-3">
              <span>🛠️</span> Other Tools
            </h3>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { href: "/layoffs",                           emoji: "🔴", label: "Layoffs Tracker",          desc: "Live India tech layoffs" },
                { href: "/calculator/layoff-risk-calculator", emoji: "⚠️", label: "Layoff Risk Calculator",   desc: "Your personal risk score" },
                { href: "/tools/discount-calculator",         emoji: "🏷️", label: "Discount Calculator",      desc: "Sale price after any discount" },
                { href: "/tools/percentage-calculator",       emoji: "📊", label: "Percentage Calculator",    desc: "5 modes: of, change, increase" },
              ].map(tool => (
                <Link key={tool.href} href={tool.href}
                  className="group flex items-start gap-3 rounded-xl border border-rule bg-surface px-4 py-3 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper text-sm group-hover:bg-brand-soft transition-colors">
                    {tool.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink group-hover:text-brand transition leading-tight">{tool.label}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">{tool.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          WHY CTC ≠ IN-HAND — SEO content block
      ════════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 py-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: "💡",
              title: "CTC ≠ In-Hand Salary",
              body: "CTC includes employer PF contribution (~12% of basic) and gratuity reserves — neither appears in your bank account. Your take-home is CTC minus these employer costs, minus your own PF, professional tax and TDS.",
              link: { label: "Calculate your in-hand →", href: "/salary" },
            },
            {
              icon: "📉",
              title: "New Regime is Better for Most",
              body: "Under the new tax regime, income up to ₹12.75 LPA is effectively tax-free (₹12L rebate + ₹75K std deduction). Old regime is better only if your total 80C + HRA + home loan deductions exceed ₹3.5–4L.",
              link: { label: "Compare regimes →", href: "/calculator/old-vs-new-tax-regime" },
            },
            {
              icon: "🔒",
              title: "Your Data Stays Private",
              body: "Every calculation on SalaryTools runs entirely in your browser using JavaScript. Nothing you enter — salary, tax details, investments — is sent to any server or stored anywhere.",
              link: null,
            },
          ].map(card => (
            <div key={card.title} className="rounded-2xl border border-rule bg-surface px-5 py-5 shadow-card">
              <span className="text-2xl">{card.icon}</span>
              <h3 className="mt-3 font-semibold text-ink">{card.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{card.body}</p>
              {card.link && (
                <Link href={card.link.href}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline underline-offset-2">
                  {card.link.label} <ArrowIcon />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FROM THE BLOG
      ════════════════════════════════════════════════════════════════════ */}
      {recentPosts.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-ink">From the Blog</h2>
            <Link href="/blog" className="text-sm font-medium text-brand hover:underline underline-offset-2">
              All articles →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {recentPosts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-xl border border-rule bg-surface p-4 shadow-card hover:border-brand hover:-translate-y-0.5 transition">
                {post.frontmatter.ogImage && (
                  <img src={post.frontmatter.ogImage} alt={post.frontmatter.title}
                    className="w-full h-28 object-contain bg-paper rounded-lg mb-3 border border-rule" />
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  {post.frontmatter.category && (
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
                      {post.frontmatter.category}
                    </span>
                  )}
                  <span className="text-[10px] text-ink-soft">{formatBlogDate(post.frontmatter.date)}</span>
                </div>
                <p className="text-sm font-semibold text-ink group-hover:text-brand transition line-clamp-2 flex-1">
                  {post.frontmatter.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          FAQ
      ════════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <h2 className="font-display text-xl font-semibold text-ink mb-4">Frequently Asked Questions</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {FAQS.map(faq => (
            <div key={faq.q} className="rounded-xl border border-rule bg-surface px-5 py-4">
              <h3 className="font-medium text-ink text-sm">{faq.q}</h3>
              <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ArrowIcon({ className = "text-ink" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
