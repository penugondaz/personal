import type { Metadata } from "next";
import Link from "next/link";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { calculateIncomeTax, getCurrentFY } from "@/lib/calculators/income-tax";
import { getAllBlogPosts, formatBlogDate } from "@/lib/blog-loader";
import { salarySlug } from "@/lib/salary-data";
import { formatINR } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

export const metadata: Metadata = {
  title: "SalaryTools India — Free Salary, Tax & Investment Calculators",
  description:
    "Free calculators for India's salaried professionals. In-hand salary, income tax, EPF, SIP, EMI, real estate and 30+ more. Updated for FY 2025-26.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "SalaryTools India — Free Salary, Tax & Investment Calculators",
    description: "Free salary, tax, EPF, SIP and investment calculators for India. Updated for FY 2025-26.",
    url: absoluteUrl("/"),
  },
};

const FY = getCurrentFY();

const SALARY_SAMPLES = [5, 8, 10, 12, 15, 20, 25, 30].map(lpa => {
  const r = calculateSalaryBreakup({ annualCtc: lpa * 100_000, regime: "new" });
  const tax = calculateIncomeTax(r.grossSalaryAnnual, "new");
  return {
    lpa,
    inHand: r.inHandMonthly,
    tds: Math.round(tax.totalTaxPayable / 12),
    taxFree: tax.totalTaxPayable === 0,
    slug: salarySlug(lpa),
  };
});

// ─── consistent inner width used on every section ────────────────────────────
const W = "mx-auto w-full max-w-5xl px-6";

export default function HomePage() {
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <main>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">

        {/* ── Background ── */}
        <div className="absolute inset-0" aria-hidden="true">
          {/* Deep gradient base: rich forest green → near-black */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #0d2b1a 0%, #1a4230 40%, #0f1f14 100%)" }} />

          {/* Mesh highlight top-left */}
          <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #2f6f4f 0%, transparent 65%)" }} />

          {/* Subtle warm glow bottom-right */}
          <div className="absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #ff7a45 0%, transparent 65%)" }} />

          {/* Fine dot grid over gradient */}
          <div className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />

          {/* ₹ watermark */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 select-none
              font-bold leading-none text-white"
            style={{
              fontSize: "clamp(200px, 28vw, 380px)",
              opacity: 0.035,
              fontFamily: "Georgia, serif",
            }}
            aria-hidden="true"
          >₹</div>

          {/* Bottom fade to page background */}
          <div className="absolute bottom-0 inset-x-0 h-24"
            style={{ background: "linear-gradient(to bottom, transparent, #f7f8fa)" }} />
        </div>

        {/* ── Content ── */}
        <div className={`${W} relative pt-14 pb-20 sm:pt-20 sm:pb-28`}>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_380px]">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15
                bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7dd9a8] animate-pulse" />
                FY {FY.fy} · New tax regime · Updated
              </div>

              <h1 className="font-display font-semibold leading-[1.1] tracking-tight text-white"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}>
                How much of your salary
                <br />
                <span style={{ color: "#7dd9a8" }}>actually reaches you?</span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
                CTC on your offer letter is not what hits your bank account.
                Find out exactly what you keep — and what goes to tax and PF.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/salary"
                  className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5
                    text-sm font-semibold text-white shadow-lg transition
                    hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: "#2f6f4f", boxShadow: "0 0 0 1px rgba(255,255,255,0.1) inset, 0 4px 24px rgba(47,111,79,0.5)" }}>
                  Calculate in-hand salary
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href="/calculator/income-tax-calculator"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20
                    bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm
                    transition hover:bg-white/20">
                  Income Tax Calculator
                </Link>
              </div>

              <p className="mt-7 text-xs text-white/35">
                No signup · No data stored · Runs entirely in your browser · 30+ free calculators
              </p>
            </div>

            {/* Right: salary card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] backdrop-blur-md p-5
              shadow-2xl ring-1 ring-white/5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                    Example — 10 LPA CTC
                  </p>
                  <p className="mt-1 font-display text-3xl font-bold text-white">
                    {formatINR(SALARY_SAMPLES[2].inHand)}
                  </p>
                  <p className="text-xs text-[#7dd9a8] mt-0.5 font-medium">in-hand / month · new regime</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl
                  bg-white/10 text-2xl">
                  💰
                </div>
              </div>

              <div className="space-y-0 divide-y divide-white/10">
                {[
                  { label: "Monthly CTC",     value: formatINR(Math.round(10_00_000 / 12)), color: "text-white" },
                  { label: "TDS (income tax)", value: "Zero ✓",                             color: "text-[#7dd9a8]" },
                  { label: "Employee PF",      value: `− ${formatINR(SALARY_SAMPLES[2].tds > 0 ? 3200 : 3200)}`, color: "text-red-400" },
                  { label: "Professional tax", value: "− ₹200",                             color: "text-red-400" },
                ].map(row => (
                  <div key={row.label}
                    className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-white/50">{row.label}</span>
                    <span className={`tabular text-sm font-medium ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: "rgba(47,111,79,0.35)", border: "1px solid rgba(125,217,168,0.2)" }}>
                <span className="text-sm font-semibold text-white">In-hand salary</span>
                <span className="tabular text-base font-bold text-[#7dd9a8]">
                  {formatINR(SALARY_SAMPLES[2].inHand)}
                </span>
              </div>

              <Link href="/salary/10-lpa-in-hand"
                className="mt-3 flex items-center justify-center gap-1 py-2 text-xs
                  text-white/40 transition hover:text-white/70">
                Calculate for your CTC →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SALARY TABLE
      ══════════════════════════════════════════════════════════ */}
      <section className="border-b border-rule bg-surface">
        <div className={`${W} py-10`}>
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                In-hand salary for common CTCs
              </h2>
              <p className="mt-0.5 text-xs text-ink-soft">New regime · FY {FY.fy} · Monthly take-home</p>
            </div>
            <Link href="/salary"
              className="text-xs font-medium text-brand hover:underline underline-offset-2 shrink-0">
              All CTC values →
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-rule bg-paper">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-soft">CTC</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-soft">In-hand / month</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-soft hidden sm:table-cell">TDS / month</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-soft hidden sm:table-cell">Tax</th>
                    <th className="w-10 px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {SALARY_SAMPLES.map(({ lpa, inHand, tds, taxFree, slug }) => (
                    <tr key={lpa}
                      className="group border-b border-rule last:border-0 cursor-pointer
                        transition hover:bg-brand-soft/30">
                      <td className="px-5 py-3.5">
                        <Link href={`/salary/${slug}`} className="block">
                          <span className="font-semibold text-ink">{lpa} LPA</span>
                          <span className="ml-2 text-xs text-ink-soft">
                            ₹{(lpa * 100_000).toLocaleString("en-IN")}/yr
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={`/salary/${slug}`} className="block">
                          <span className="tabular text-base font-semibold text-brand">
                            {formatINR(inHand)}
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                        <Link href={`/salary/${slug}`} className="block">
                          <span className={`tabular text-sm font-medium
                            ${taxFree ? "text-brand" : "text-deduction"}`}>
                            {taxFree ? "Nil" : formatINR(tds)}
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                        <Link href={`/salary/${slug}`} className="block">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5
                            text-[11px] font-semibold ${taxFree
                              ? "bg-brand-soft text-brand"
                              : "bg-red-50 text-deduction"}`}>
                            {taxFree ? "Zero tax" : "Taxable"}
                          </span>
                        </Link>
                      </td>
                      <td className="px-3 py-3.5 text-right">
                        <Link href={`/salary/${slug}`}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg
                            text-ink-soft opacity-0 transition
                            group-hover:opacity-100 group-hover:bg-brand-soft group-hover:text-brand">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-rule bg-paper px-5 py-3 text-xs text-ink-soft">
              Standard private-sector structure · basic 40% · HRA 50% of basic · statutory PF · new regime
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURE SECTIONS — shared max-w-5xl, alternating
      ══════════════════════════════════════════════════════════ */}

      {/* Tax */}
      <section className="border-b border-rule bg-surface">
        <div className={`${W} py-12 sm:py-16 grid gap-10 lg:gap-14 lg:grid-cols-2 lg:items-center`}>
          <div className="rounded-2xl border border-rule bg-paper p-6 shadow-card order-2 lg:order-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-4">
              Income Tax · 15 LPA · New Regime
            </p>
            <TaxVisual />
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {[
                { label: "Zero tax up to",      value: "₹12.75 LPA", color: "text-brand" },
                { label: "Standard deduction",  value: "₹75,000",    color: "text-ink" },
                { label: "87A rebate",           value: "₹60,000",    color: "text-ink" },
                { label: "Effective rate @15L",  value: "~6.2%",      color: "text-deduction" },
              ].map(item => (
                <div key={item.label}
                  className="rounded-xl border border-rule bg-surface p-3">
                  <p className="text-[10px] text-ink-soft">{item.label}</p>
                  <p className={`tabular mt-0.5 text-sm font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Income Tax</p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl leading-snug">
              New regime is better for most people now
            </h2>
            <p className="mt-4 text-sm text-ink-soft leading-relaxed">
              Budget 2025 changed the game — zero tax up to ₹12.75 LPA under the new regime.
              Our calculator shows you exactly which regime saves more, with a slab-by-slab breakdown.
            </p>
            <div className="mt-6 space-y-2.5">
              {[
                { label: "Income Tax Calculator",      sub: "Slab-wise · new vs old regime",         href: "/calculator/income-tax-calculator" },
                { label: "Old vs New Regime",          sub: "See your break-even deduction amount",  href: "/calculator/old-vs-new-tax-regime" },
                { label: "Tax + Capital Gains",        sub: "For investors with equity / MF gains",  href: "/calculator/income-tax-with-capital-gains" },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-rule
                    bg-paper px-4 py-3 transition hover:border-brand hover:bg-brand-soft/30">
                  <div>
                    <p className="text-sm font-medium text-ink group-hover:text-brand transition">
                      {item.label}
                    </p>
                    <p className="text-xs text-ink-soft">{item.sub}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-ink-soft group-hover:text-brand transition">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Invest */}
      <section className="border-b border-rule bg-paper">
        <div className={`${W} py-12 sm:py-16 grid gap-10 lg:gap-14 lg:grid-cols-2 lg:items-center`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Invest & Grow</p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl leading-snug">
              ₹10,000/month SIP becomes ₹2.3 crore in 20 years
            </h2>
            <p className="mt-4 text-sm text-ink-soft leading-relaxed">
              At 12% annualised return. Compounding is the most powerful force in investing —
              most people underestimate it. Our calculators show the real numbers, year by year.
            </p>
            <div className="mt-6 space-y-2.5">
              {[
                { label: "SIP Calculator",     sub: "Monthly SIP → corpus at any rate",          href: "/calculator/sip-calculator" },
                { label: "EPF & VPF",          sub: "8.25% guaranteed · tax-free at maturity",   href: "/calculator/epf-calculator" },
                { label: "FIRE Calculator",    sub: "How much do you need to retire early?",      href: "/calculator/fire-calculator" },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-rule
                    bg-surface px-4 py-3 transition hover:border-brand hover:bg-brand-soft/30">
                  <div>
                    <p className="text-sm font-medium text-ink group-hover:text-brand transition">
                      {item.label}
                    </p>
                    <p className="text-xs text-ink-soft">{item.sub}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-ink-soft group-hover:text-brand transition">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-rule bg-surface p-6 shadow-card">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-5">
              SIP Growth · ₹10,000/month · 12% p.a.
            </p>
            <SipGrowthBars />
          </div>
        </div>
      </section>

      {/* Real Estate */}
      <section className="border-b border-rule bg-surface">
        <div className={`${W} py-12 sm:py-16 grid gap-10 lg:gap-14 lg:grid-cols-2 lg:items-center`}>
          <div className="rounded-2xl border border-rule bg-paper p-6 shadow-card order-2 lg:order-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-5">
              Home Affordability · 12 LPA Salary
            </p>
            <AffordabilityVisual />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Real Estate</p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl leading-snug">
              How much home can your salary afford?
            </h2>
            <p className="mt-4 text-sm text-ink-soft leading-relaxed">
              Banks approve loans on your in-hand salary, not CTC. Know your actual property budget,
              stamp duty costs, and whether renting makes more sense than buying.
            </p>
            <div className="mt-6 space-y-2.5">
              {[
                { label: "Home Affordability",    sub: "Salary → max property budget",          href: "/real-estate/home-affordability-calculator" },
                { label: "Stamp Duty Calculator", sub: "State-wise · all 22 states",            href: "/real-estate/stamp-duty-calculator" },
                { label: "Rent vs Buy",           sub: "20-year net worth comparison",          href: "/real-estate/rent-vs-buy-calculator" },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-rule
                    bg-paper px-4 py-3 transition hover:border-brand hover:bg-brand-soft/30">
                  <div>
                    <p className="text-sm font-medium text-ink group-hover:text-brand transition">
                      {item.label}
                    </p>
                    <p className="text-xs text-ink-soft">{item.sub}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-ink-soft group-hover:text-brand transition">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRENDING
      ══════════════════════════════════════════════════════════ */}
      <section className="border-b border-rule bg-amber-50/70">
        <div className={`${W} py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-bold
              text-white uppercase tracking-wide">
              Trending
            </span>
            <p className="text-sm font-medium text-ink">
              8th Pay Commission Salary Calculator — estimate your revised pay
            </p>
          </div>
          <Link href="/calculator/8th-pay-commission-calculator"
            className="shrink-0 rounded-full bg-ink px-5 py-2 text-xs font-semibold text-white
              transition hover:opacity-80">
            Calculate →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BLOG
      ══════════════════════════════════════════════════════════ */}
      {posts.length > 0 && (
        <section className="border-b border-rule bg-paper">
          <div className={`${W} py-12`}>
            <div className="flex items-baseline justify-between mb-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand">From the blog</p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">
                  Tax & salary insights
                </h2>
              </div>
              <Link href="/blog"
                className="text-xs font-medium text-brand hover:underline underline-offset-2">
                All articles →
              </Link>
            </div>
            <div className="grid gap-5 lg:grid-cols-5">
              <Link href={`/blog/${posts[0].slug}`}
                className="group lg:col-span-3 flex flex-col rounded-2xl border border-rule
                  bg-surface overflow-hidden shadow-card hover:shadow-card-lg hover:border-brand
                  transition hover:-translate-y-0.5">
                {posts[0].frontmatter.ogImage && (
                  <img src={posts[0].frontmatter.ogImage} alt={posts[0].frontmatter.title}
                    className="w-full h-40 object-contain bg-paper border-b border-rule" />
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    {posts[0].frontmatter.category && (
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px]
                        font-semibold text-brand">
                        {posts[0].frontmatter.category}
                      </span>
                    )}
                    <span className="text-[10px] text-ink-soft">
                      {formatBlogDate(posts[0].frontmatter.date)}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-ink
                    group-hover:text-brand transition flex-1 line-clamp-2">
                    {posts[0].frontmatter.title}
                  </h3>
                  {posts[0].frontmatter.description && (
                    <p className="mt-2 text-xs text-ink-soft line-clamp-2 leading-relaxed">
                      {posts[0].frontmatter.description}
                    </p>
                  )}
                </div>
              </Link>
              <div className="lg:col-span-2 flex flex-col gap-4">
                {posts.slice(1, 3).map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="group flex gap-3.5 rounded-2xl border border-rule bg-surface p-4
                      shadow-card hover:border-brand hover:-translate-y-0.5 transition flex-1">
                    {post.frontmatter.ogImage && (
                      <img src={post.frontmatter.ogImage} alt={post.frontmatter.title}
                        className="h-16 w-16 shrink-0 rounded-lg object-contain bg-paper
                          border border-rule" />
                    )}
                    <div className="min-w-0">
                      {post.frontmatter.category && (
                        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px]
                          font-semibold text-brand">
                          {post.frontmatter.category}
                        </span>
                      )}
                      <h3 className="mt-1 text-xs font-semibold text-ink
                        group-hover:text-brand transition line-clamp-2 leading-snug">
                        {post.frontmatter.title}
                      </h3>
                      <p className="text-[10px] text-ink-soft mt-1">
                        {formatBlogDate(post.frontmatter.date)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          TRUST + FAQ
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-surface">
        <div className={`${W} py-12 grid gap-10 lg:grid-cols-2`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-5">
              Why SalaryTools
            </p>
            <div className="space-y-5">
              {[
                { icon: "🔒", t: "Your data never leaves your browser",
                  b: "Every calculation runs in JavaScript on your device. Nothing is sent to our servers or stored anywhere." },
                { icon: "📅", t: "Updated within 24 hours of every budget",
                  b: "Tax slabs, EPF rates, standard deduction — refreshed immediately after the Union Budget." },
                { icon: "🇮🇳", t: "Built for Indian salaries from scratch",
                  b: "Not a US calculator adapted for India. Built around Indian salary structures — PT by state, HRA city tiers, statutory PF, professional tax, TDS." },
              ].map(i => (
                <div key={i.t} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center
                    rounded-xl border border-rule bg-paper text-base">
                    {i.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{i.t}</p>
                    <p className="mt-0.5 text-xs text-ink-soft leading-relaxed">{i.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-5">FAQ</p>
            <div className="space-y-5">
              {[
                { q: "Why is my CTC different from in-hand salary?",
                  a: "CTC includes employer PF (~12% of basic) and gratuity — neither reaches your bank. Take-home = CTC minus employer PF, employee PF, professional tax, and TDS." },
                { q: "New or old tax regime — which is better?",
                  a: "New regime for most people earning up to ₹15-20 LPA. Old regime beats new only when total deductions (80C + HRA + home loan interest) exceed ₹3.75-4L." },
                { q: "How accurate are these calculators?",
                  a: "Very accurate for standard private-sector structures. Your exact figure depends on your offer letter's components, city (PT varies by state), and employer-specific policies." },
              ].map(f => (
                <div key={f.q} className="border-b border-rule pb-5 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-ink">{f.q}</p>
                  <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

// ─── Static visuals ───────────────────────────────────────────────────────────

function TaxVisual() {
  return (
    <div className="space-y-3">
      {[
        { label: "₹0 – 4L",      rate: "No tax", pct: 100, taxed: false },
        { label: "₹4 – 8L",      rate: "5%",     pct: 80,  taxed: false },
        { label: "₹8 – 12L",     rate: "10%",    pct: 60,  taxed: false },
        { label: "₹12 – 13.35L", rate: "15%",    pct: 22,  taxed: true  },
      ].map(s => (
        <div key={s.label}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-ink-soft">{s.label}</span>
            <span className={`font-semibold ${s.taxed ? "text-deduction" : "text-brand"}`}>
              {s.rate} {s.taxed ? "→ ₹20,325" : "✓"}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-rule overflow-hidden">
            <div className={`h-full rounded-full ${s.taxed ? "bg-deduction/60" : "bg-brand"}`}
              style={{ width: `${s.pct}%` }} />
          </div>
        </div>
      ))}
      <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-soft px-4 py-2.5">
        <span className="text-sm font-semibold text-brand">Total tax (with cess)</span>
        <span className="tabular text-sm font-bold text-brand">₹21,138</span>
      </div>
    </div>
  );
}

function SipGrowthBars() {
  const rows = [
    { year: 5,  invested: 6,  value: 8.2  },
    { year: 10, invested: 12, value: 23.2 },
    { year: 15, invested: 18, value: 50.5 },
    { year: 20, invested: 24, value: 99.9 },
    { year: 25, invested: 30, value: 212  },
  ];
  const max = 212;
  return (
    <div className="space-y-4">
      {rows.map(d => (
        <div key={d.year}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-ink-soft">Year {d.year}</span>
            <div className="flex items-center gap-3">
              <span className="text-ink-soft tabular">Invested ₹{d.invested}L</span>
              <span className="tabular font-semibold text-brand">= ₹{d.value}L</span>
            </div>
          </div>
          <div className="relative h-3 rounded-full bg-rule overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded-full bg-rule"
              style={{ width: `${(d.invested / max) * 100}%` }} />
            <div className="absolute inset-y-0 left-0 rounded-full bg-brand/70"
              style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
      <p className="text-[10px] text-ink-soft">₹10,000/month · 12% p.a. annualised return</p>
    </div>
  );
}

function AffordabilityVisual() {
  return (
    <div className="space-y-4">
      {[
        { label: "In-hand salary",      value: "₹75,000/mo", w: 100, color: "bg-brand"       },
        { label: "Max EMI (40%)",        value: "₹30,000/mo", w: 40,  color: "bg-brand/50"    },
        { label: "Max loan eligible",    value: "₹30.5L",     w: 60,  color: "bg-blue-400/60" },
        { label: "Max property budget",  value: "₹38L",       w: 76,  color: "bg-amber-400/60"},
      ].map(item => (
        <div key={item.label}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-ink-soft">{item.label}</span>
            <span className="tabular font-semibold text-ink">{item.value}</span>
          </div>
          <div className="h-2.5 rounded-full bg-rule overflow-hidden">
            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.w}%` }} />
          </div>
        </div>
      ))}
      <p className="text-[10px] text-ink-soft mt-1">
        8.5% home loan rate · 20 year tenure · 20% down payment
      </p>
    </div>
  );
}
