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

export default function HomePage() {
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <main className="min-h-screen bg-paper">

      {/* ─────────────────────────────────────────────────────────
          HERO — full-width, answer-first design
      ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-rule bg-surface">

        {/* Background layers */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">

          {/* Base: very light green-tinted white */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f0f7f3] via-white to-[#fafbff]" />

          {/* Dot grid — brand green dots, crisp */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(47,111,79,0.12) 1.5px, transparent 1.5px)",
              backgroundSize: "32px 32px",
            }} />

          {/* Top-left glow */}
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(47,111,79,0.08) 0%, transparent 65%)" }} />

          {/* Bottom-right glow */}
          <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(232,245,238,0.8) 0%, transparent 65%)" }} />

          {/* Large ₹ — right side, decorative */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 select-none sm:right-10"
            style={{
              fontSize: "clamp(180px, 22vw, 300px)",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              color: "rgba(47,111,79,0.055)",
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}>
            ₹
          </div>

          {/* Bottom fade to white so table section below blends in */}
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 pt-12 pb-12 sm:pt-20 sm:pb-18 text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-rule bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs text-ink-soft mb-8 shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
            Updated for FY {FY.fy} · New tax regime
          </div>

          {/* Headline */}
          <h1 className="font-display font-semibold text-ink leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}>
            How much of your salary
            <br />
            <span className="text-brand">actually reaches you?</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base text-ink-soft leading-relaxed">
            CTC is what your company pays. Your bank account sees something very different.
            Find out why — instantly, free, no account needed.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/salary"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-brand px-8 py-4 text-sm font-semibold text-white shadow-card-lg transition hover:bg-brand-dark sm:w-auto">
              Calculate my in-hand salary
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/calculator/income-tax-calculator"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rule bg-white/80 backdrop-blur-sm px-8 py-4 text-sm font-medium text-ink transition hover:border-brand hover:text-brand sm:w-auto">
              Calculate income tax
            </Link>
          </div>

          {/* Trust */}
          <p className="mt-8 text-xs text-ink-soft">
            No signup · No data stored · Runs in your browser · 30+ free calculators
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          LIVE SALARY TABLE — the "answer" delivered immediately
      ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-10">

        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">
              In-hand salary for common CTCs
            </h2>
            <p className="mt-0.5 text-xs text-ink-soft">New regime · FY {FY.fy} · Monthly take-home</p>
          </div>
          <Link href="/salary" className="text-xs font-medium text-brand hover:underline underline-offset-2 shrink-0">
            See all →
          </Link>
        </div>

        {/* Table — feels like a financial statement, not cards */}
        <div className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-soft">CTC</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-soft">In-hand / month</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-soft hidden sm:table-cell">TDS / month</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-soft hidden sm:table-cell">Tax status</th>
                  <th className="px-3 py-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {SALARY_SAMPLES.map(({ lpa, inHand, tds, taxFree, slug }) => (
                  <tr key={lpa}
                    className="border-b border-rule last:border-0 transition hover:bg-brand-soft/30 cursor-pointer group">
                    <td className="px-5 py-3.5">
                      <Link href={`/salary/${slug}`} className="block">
                        <span className="font-semibold text-ink">{lpa} LPA</span>
                        <span className="ml-1.5 text-xs text-ink-soft">₹{(lpa * 100_000).toLocaleString("en-IN")}/yr</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/salary/${slug}`} className="block">
                        <span className="tabular font-semibold text-brand text-base">{formatINR(inHand)}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                      <Link href={`/salary/${slug}`} className="block">
                        <span className={`tabular text-sm font-medium ${taxFree ? "text-brand" : "text-deduction"}`}>
                          {taxFree ? "Nil" : `${formatINR(tds)}`}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                      <Link href={`/salary/${slug}`} className="block">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          taxFree
                            ? "bg-brand-soft text-brand"
                            : "bg-red-50 text-deduction"
                        }`}>
                          {taxFree ? "Zero tax" : "Taxable"}
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <Link href={`/salary/${slug}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-ink-soft opacity-0 group-hover:opacity-100 group-hover:bg-brand-soft group-hover:text-brand transition">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            Assumes standard private-sector structure · basic 40% · HRA 50% of basic · statutory PF · new tax regime
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FEATURE SECTIONS — story-driven, alternating layout
      ───────────────────────────────────────────────────────── */}

      {/* Section 1: Tax */}
      <section className="border-t border-rule bg-surface">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14 grid gap-8 lg:gap-10 lg:grid-cols-2 lg:items-center">

          {/* Visual: tax breakdown */}
          <div className="rounded-2xl border border-rule bg-paper p-6 shadow-card order-2 lg:order-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Income Tax · 15 LPA · New Regime</p>
            </div>
            <TaxVisual />
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Zero tax up to", value: "₹12.75 LPA", color: "text-brand" },
                { label: "Standard deduction", value: "₹75,000", color: "text-ink" },
                { label: "87A rebate limit", value: "₹12L income", color: "text-ink" },
                { label: "Effective rate at 15L", value: "~6.2%", color: "text-deduction" },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-rule bg-surface p-3">
                  <p className="text-[10px] text-ink-soft">{item.label}</p>
                  <p className={`tabular mt-0.5 text-sm font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand">Income tax</span>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink leading-snug sm:text-2xl lg:text-3xl">
              New regime is better for most people now
            </h2>
            <p className="mt-4 text-sm text-ink-soft leading-relaxed">
              Budget 2025 changed the game — zero tax up to ₹12.75 LPA under the new regime.
              Our calculator shows you exactly which regime saves more money, with a slab-by-slab breakdown.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { label: "Income Tax Calculator", sub: "Slab-wise · new vs old regime", href: "/calculator/income-tax-calculator" },
                { label: "Old vs New Regime Comparison", sub: "See your break-even deduction amount", href: "/calculator/old-vs-new-tax-regime" },
                { label: "Tax + Capital Gains", sub: "For investors with equity/MF gains", href: "/calculator/income-tax-with-capital-gains" },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-rule bg-paper px-4 py-3 transition hover:border-brand hover:bg-brand-soft/30">
                  <div>
                    <p className="text-sm font-medium text-ink group-hover:text-brand transition">{item.label}</p>
                    <p className="text-xs text-ink-soft">{item.sub}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink-soft group-hover:text-brand transition">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Invest */}
      <section className="border-t border-rule bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14 grid gap-8 lg:gap-10 lg:grid-cols-2 lg:items-center">

          {/* Copy */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand">Invest & grow</span>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink leading-snug sm:text-2xl lg:text-3xl">
              ₹10,000/month SIP<br />becomes ₹2.3 crore in 20 years
            </h2>
            <p className="mt-4 text-sm text-ink-soft leading-relaxed">
              At 12% annualised return. Compounding is the most powerful force in investing —
              and most people underestimate it. Our calculators show you the real numbers, year by year.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { label: "SIP Calculator", sub: "Monthly SIP → corpus at any rate", href: "/calculator/sip-calculator" },
                { label: "EPF & VPF Calculator", sub: "8.25% guaranteed · tax-free at maturity", href: "/calculator/epf-calculator" },
                { label: "FIRE Calculator", sub: "How much do you need to retire early?", href: "/calculator/fire-calculator" },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-rule bg-surface px-4 py-3 transition hover:border-brand hover:bg-brand-soft/30">
                  <div>
                    <p className="text-sm font-medium text-ink group-hover:text-brand transition">{item.label}</p>
                    <p className="text-xs text-ink-soft">{item.sub}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink-soft group-hover:text-brand transition">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Visual: SIP growth */}
          <div className="rounded-2xl border border-rule bg-surface p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft mb-5">SIP Growth · ₹10,000/month · 12% p.a.</p>
            <SipGrowthBars />
          </div>
        </div>
      </section>

      {/* Section 3: Real Estate */}
      <section className="border-t border-rule bg-surface">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14 grid gap-8 lg:gap-10 lg:grid-cols-2 lg:items-center">

          {/* Visual: affordability */}
          <div className="rounded-2xl border border-rule bg-paper p-6 shadow-card order-2 lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft mb-5">Home Affordability · 12 LPA Salary</p>
            <AffordabilityVisual />
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand">Real estate</span>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink leading-snug sm:text-2xl lg:text-3xl">
              How much home can your salary afford?
            </h2>
            <p className="mt-4 text-sm text-ink-soft leading-relaxed">
              Banks approve home loans based on your in-hand salary, not CTC. Know your actual
              property budget, stamp duty costs, and whether renting makes more financial sense.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { label: "Home Affordability Calculator", sub: "Salary → max property budget", href: "/real-estate/home-affordability-calculator" },
                { label: "Stamp Duty Calculator", sub: "State-wise · all 22 states", href: "/real-estate/stamp-duty-calculator" },
                { label: "Rent vs Buy Calculator", sub: "20-year net worth comparison", href: "/real-estate/rent-vs-buy-calculator" },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-rule bg-paper px-4 py-3 transition hover:border-brand hover:bg-brand-soft/30">
                  <div>
                    <p className="text-sm font-medium text-ink group-hover:text-brand transition">{item.label}</p>
                    <p className="text-xs text-ink-soft">{item.sub}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink-soft group-hover:text-brand transition">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          TRENDING — inline, not a banner
      ───────────────────────────────────────────────────────── */}
      <section className="border-t border-b border-rule bg-amber-50/60">
        <div className="mx-auto max-w-4xl px-6 py-4 sm:py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-orange-600 uppercase tracking-wide">Trending</span>
            <p className="text-sm font-medium text-ink">8th Pay Commission Salary Calculator — estimate your revised pay</p>
          </div>
          <Link href="/calculator/8th-pay-commission-calculator"
            className="shrink-0 rounded-full border border-ink/20 bg-ink px-5 py-2 text-xs font-semibold text-white hover:opacity-80 transition">
            Calculate →
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          BLOG
      ───────────────────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="bg-paper">
          <div className="mx-auto max-w-4xl px-6 py-10 sm:py-12">
            <div className="flex items-baseline justify-between mb-7">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-brand">From the blog</span>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">Tax & salary insights</h2>
              </div>
              <Link href="/blog" className="text-xs font-medium text-brand hover:underline underline-offset-2">
                All articles →
              </Link>
            </div>
            <div className="grid gap-5 lg:grid-cols-5">
              <Link href={`/blog/${posts[0].slug}`}
                className="group lg:col-span-3 flex flex-col rounded-2xl border border-rule bg-surface overflow-hidden shadow-card hover:shadow-card-lg hover:border-brand transition hover:-translate-y-0.5">
                {posts[0].frontmatter.ogImage && (
                  <img src={posts[0].frontmatter.ogImage} alt={posts[0].frontmatter.title}
                    className="w-full h-40 object-contain bg-paper border-b border-rule" />
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    {posts[0].frontmatter.category && (
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">{posts[0].frontmatter.category}</span>
                    )}
                    <span className="text-[10px] text-ink-soft">{formatBlogDate(posts[0].frontmatter.date)}</span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-ink group-hover:text-brand transition flex-1 line-clamp-2">
                    {posts[0].frontmatter.title}
                  </h3>
                  {posts[0].frontmatter.description && (
                    <p className="mt-2 text-xs text-ink-soft line-clamp-2 leading-relaxed">{posts[0].frontmatter.description}</p>
                  )}
                </div>
              </Link>
              <div className="lg:col-span-2 flex flex-col gap-4">
                {posts.slice(1, 3).map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="group flex gap-3.5 rounded-2xl border border-rule bg-surface p-4 shadow-card hover:border-brand hover:-translate-y-0.5 transition flex-1">
                    {post.frontmatter.ogImage && (
                      <img src={post.frontmatter.ogImage} alt={post.frontmatter.title}
                        className="h-16 w-16 shrink-0 rounded-lg object-contain bg-paper border border-rule" />
                    )}
                    <div className="min-w-0">
                      {post.frontmatter.category && (
                        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">{post.frontmatter.category}</span>
                      )}
                      <h3 className="mt-1 text-xs font-semibold text-ink group-hover:text-brand transition line-clamp-2 leading-snug">
                        {post.frontmatter.title}
                      </h3>
                      <p className="text-[10px] text-ink-soft mt-1">{formatBlogDate(post.frontmatter.date)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────
          TRUST + FAQ
      ───────────────────────────────────────────────────────── */}
      <section className="border-t border-rule bg-surface">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:py-12 grid gap-8 sm:gap-10 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand">Why SalaryTools</span>
            <div className="mt-5 space-y-5">
              {[
                { icon: "🔒", t: "Your data never leaves your browser", b: "Every calculation runs in JavaScript on your device. Nothing is sent to our servers or stored anywhere." },
                { icon: "📅", t: "Updated within 24 hours of every budget", b: "Tax slabs, EPF rates, standard deduction — refreshed immediately after the Union Budget." },
                { icon: "🇮🇳", t: "Built for Indian salaries from scratch", b: "Not a US calculator adapted for India. Built around Indian salary structures — PT, HRA city tiers, statutory PF, professional tax, TDS." },
              ].map(i => (
                <div key={i.t} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rule bg-paper text-base">{i.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{i.t}</p>
                    <p className="mt-0.5 text-xs text-ink-soft leading-relaxed">{i.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand">FAQ</span>
            <div className="mt-5 space-y-5">
              {[
                { q: "Why is my CTC different from in-hand salary?", a: "CTC includes employer PF (~12% of basic) and gratuity — neither reaches your bank. Take-home = CTC minus employer PF, employee PF, professional tax, and TDS." },
                { q: "New or old tax regime — which is better?", a: "New regime for most people earning up to ₹15-20 LPA. Old regime beats new only when total deductions (80C + HRA + home loan interest) exceed ₹3.75-4L." },
                { q: "How accurate are these calculators?", a: "Very accurate for standard private-sector structures. Your exact figure depends on your offer letter's actual components, city (PT varies by state), and employer-specific policies." },
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

// ─── Inline SVG Visuals ───────────────────────────────────────────────────────

function TaxVisual() {
  // 15 LPA tax breakdown visual — slab bars
  const slabs = [
    { label: "0 – 4L", amount: "₹0", pct: 100, taxed: 0, w: 100 },
    { label: "4 – 8L", amount: "₹0", pct: 100, taxed: 5, w: 80 },
    { label: "8 – 12L", amount: "₹0", pct: 100, taxed: 10, w: 60 },
    { label: "12 – 13.35L", amount: "₹20,325", pct: 15, taxed: 15, w: 25 },
  ];
  return (
    <div className="space-y-3">
      {slabs.map((s, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-ink-soft">{s.label}</span>
            <span className={`font-medium tabular ${s.taxed > 0 ? "text-deduction" : "text-brand"}`}>
              {s.taxed === 0 ? "No tax" : `${s.taxed}% → ${s.amount}`}
            </span>
          </div>
          <div className="h-3 rounded-full bg-rule overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${s.taxed === 0 ? "bg-brand" : "bg-deduction/70"}`}
              style={{ width: `${s.w}%` }}
            />
          </div>
        </div>
      ))}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-brand-soft px-4 py-3">
        <span className="text-sm font-semibold text-brand">Total tax (with cess)</span>
        <span className="tabular text-sm font-bold text-brand">₹21,138</span>
      </div>
    </div>
  );
}

function SipGrowthBars() {
  const data = [
    { year: 5,  invested: 6,   value: 8.2,  hide: false },
    { year: 10, invested: 12,  value: 23.2, hide: false },
    { year: 15, invested: 18,  value: 50.5, hide: false },
    { year: 20, invested: 24,  value: 99.9, hide: false },
    { year: 25, invested: 30,  value: 212,  hide: false },
  ];
  const max = 212;
  return (
    <div className="space-y-4">
      {data.map(d => (
        <div key={d.year}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-ink-soft">Year {d.year}</span>
            <div className="flex items-center gap-3">
              <span className="text-ink-soft tabular">Invested: ₹{d.invested}L</span>
              <span className="tabular font-semibold text-brand">Value: ₹{d.value}L</span>
            </div>
          </div>
          <div className="relative h-4 rounded-full bg-rule overflow-hidden">
            {/* Invested */}
            <div className="absolute inset-y-0 left-0 rounded-full bg-rule"
              style={{ width: `${(d.invested / max) * 100}%` }} />
            {/* Growth */}
            <div className="absolute inset-y-0 left-0 rounded-full bg-brand/70"
              style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
      <p className="text-[10px] text-ink-soft mt-2">₹10,000/month SIP · 12% p.a. annualised</p>
    </div>
  );
}

function AffordabilityVisual() {
  // 12 LPA → home affordability breakdown
  const items = [
    { label: "In-hand salary",     value: "₹75,000/mo",  color: "bg-brand",       w: 100 },
    { label: "Max EMI (40%)",       value: "₹30,000/mo",  color: "bg-brand/60",    w: 40  },
    { label: "Max loan eligible",   value: "₹30.5L",      color: "bg-blue-400/60", w: 65  },
    { label: "Max property budget", value: "₹38L",        color: "bg-brand-soft border border-brand/30", w: 80, text: "text-brand" },
  ];
  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.label}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-ink-soft">{item.label}</span>
            <span className={`tabular font-semibold ${item.text ?? "text-ink"}`}>{item.value}</span>
          </div>
          <div className="h-3 rounded-full bg-rule overflow-hidden">
            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.w}%` }} />
          </div>
        </div>
      ))}
      <p className="text-[10px] text-ink-soft mt-1">Based on 8.5% home loan rate · 20 year tenure · 20% down payment</p>
    </div>
  );
}
