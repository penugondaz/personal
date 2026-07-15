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
    "Free calculators for India's salaried professionals. In-hand salary, income tax (new vs old regime), EPF, SIP, EMI, real estate and 30+ more. Updated for FY 2025-26.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "SalaryTools India — Free Salary, Tax & Investment Calculators",
    description: "Free salary, tax, EPF, SIP and investment calculators for India. Updated for FY 2025-26.",
    url: absoluteUrl("/"),
  },
};

// ─── Pre-compute data at build time ──────────────────────────────────────────

const FY = getCurrentFY();

// 8 LPA salary data for hero illustration
const HERO_EXAMPLE = (() => {
  const r = calculateSalaryBreakup({ annualCtc: 800_000, regime: "new" });
  const tax = calculateIncomeTax(r.grossSalaryAnnual, "new");
  return {
    ctc: 800_000,
    inHand: r.inHandMonthly,
    pf: r.employeePfMonthly,
    tds: Math.round(tax.totalTaxPayable / 12),
    pt: r.professionalTaxMonthly,
  };
})();

// Salary lookup table for the interactive strip
const SALARY_TABLE = [5, 7, 8, 10, 12, 15, 18, 20, 25, 30, 40, 50].map(lpa => {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <main className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════════
          1. HERO — answer the question before the user clicks anything
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-[#0f2016] via-[#1a3828] to-[#0f2016] text-white">

        {/* Subtle grid texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* Left: copy */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 mb-6">
                FY {FY.fyLabel} · Updated for new tax regime
              </span>
              <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
                What's your real<br />
                <span className="text-[#7dd9a8]">take-home salary?</span>
              </h1>
              <p className="mt-5 text-base text-white/70 leading-relaxed max-w-md">
                CTC on your offer letter is not what hits your bank account.
                Find out exactly how much you keep — and how much goes to tax and PF.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/salary"
                  className="inline-flex items-center gap-2 rounded-full bg-[#2F6F4F] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#3d8f65]">
                  Calculate My In-Hand <ArrowRight />
                </Link>
                <Link href="/calculator/income-tax-calculator"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20">
                  Income Tax Calculator
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50">
                {["30+ calculators", "No signup", "Browser-only", "Updated every budget"].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="text-[#7dd9a8]">✓</span> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: live salary card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-widest">Example — 8 LPA CTC</p>
                  <p className="font-display text-3xl font-bold text-white mt-1">
                    {formatINR(HERO_EXAMPLE.inHand)}
                    <span className="text-sm font-normal text-white/50">/month</span>
                  </p>
                  <p className="text-xs text-white/50 mt-0.5">in-hand salary · new regime</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2F6F4F]/60 text-2xl">
                  💰
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: "Monthly CTC", value: formatINR(HERO_EXAMPLE.ctc / 12), color: "text-white" },
                  { label: "TDS (income tax)", value: `− ${formatINR(HERO_EXAMPLE.tds)}`, color: "text-red-400" },
                  { label: "Employee PF", value: `− ${formatINR(HERO_EXAMPLE.pf)}`, color: "text-red-400" },
                  { label: "Professional tax", value: `− ${formatINR(HERO_EXAMPLE.pt)}`, color: "text-red-400" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                    <span className="text-xs text-white/60">{row.label}</span>
                    <span className={`tabular text-sm font-medium ${row.color}`}>{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-semibold text-white">In-hand salary</span>
                  <span className="tabular text-sm font-bold text-[#7dd9a8]">{formatINR(HERO_EXAMPLE.inHand)}</span>
                </div>
              </div>

              <Link href="/salary/8-lpa-in-hand"
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/10 py-2.5 text-xs font-medium text-white/70 transition hover:bg-white/20 hover:text-white">
                Calculate for your CTC <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. SALARY LOOKUP STRIP — instant reference table
      ══════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-rule bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-ink">In-hand salary · new tax regime · FY 2025-26</p>
            <Link href="/salary" className="text-xs font-medium text-brand hover:underline">All LPA values →</Link>
          </div>
          <div className="overflow-x-auto -mx-1">
            <div className="flex gap-2 pb-1 px-1" style={{ minWidth: "max-content" }}>
              {SALARY_TABLE.map(({ lpa, inHand, taxFree, slug }) => (
                <Link key={lpa} href={`/salary/${slug}`}
                  className="group flex-shrink-0 rounded-xl border border-rule bg-paper px-4 py-3 text-center transition hover:border-brand hover:-translate-y-0.5 hover:shadow-card-lg">
                  <p className="font-display text-sm font-semibold text-ink">{lpa} LPA</p>
                  <p className="tabular text-xs font-medium text-brand mt-0.5">{formatINR(inHand)}<span className="text-ink-soft">/mo</span></p>
                  <p className={`text-[10px] mt-0.5 ${taxFree ? "text-brand" : "text-ink-soft"}`}>
                    {taxFree ? "Zero tax" : "taxable"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. THREE PATHS — guide users, not overwhelm them
      ══════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            What do you want to figure out?
          </h2>
          <p className="mt-2 text-sm text-ink-soft">Pick a path — every calculator is free, no signup needed</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">

          {/* Path 1: Salary */}
          <Link href="/salary"
            className="group relative overflow-hidden rounded-2xl border border-rule bg-surface p-6 shadow-card transition hover:border-brand hover:shadow-card-lg hover:-translate-y-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              💰
            </div>
            <h3 className="font-display text-lg font-semibold text-ink group-hover:text-brand transition">Salary & CTC</h3>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              What's your real take-home? Break down CTC into basic, HRA, PF, tax and net salary.
            </p>
            <ul className="mt-4 space-y-1.5">
              {[
                ["In-Hand Salary Calculator", "/salary"],
                ["Salary Hike Calculator", "/calculator/salary-hike-calculator"],
                ["In-Hand to CTC (Reverse)", "/salary/inhand-to-ctc-calculator"],
              ].map(([label, href]) => (
                <li key={href}>
                  <span className="flex items-center gap-2 text-xs text-ink-soft group-hover:text-ink transition">
                    <span className="text-brand">→</span> {label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="absolute bottom-5 right-5 text-ink-soft opacity-0 group-hover:opacity-100 transition">
              <ArrowRight />
            </div>
          </Link>

          {/* Path 2: Tax */}
          <Link href="/calculator/income-tax-calculator"
            className="group relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-soft to-surface p-6 shadow-card transition hover:border-brand hover:shadow-card-lg hover:-translate-y-1">
            <div className="absolute top-4 right-4">
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">Most used</span>
            </div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-2xl">
              🧾
            </div>
            <h3 className="font-display text-lg font-semibold text-ink group-hover:text-brand transition">Income Tax</h3>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              New vs old regime. Zero tax up to ₹12.75 LPA. See your exact tax slab and TDS.
            </p>
            <ul className="mt-4 space-y-1.5">
              {[
                ["Income Tax Calculator", "/calculator/income-tax-calculator"],
                ["Old vs New Regime", "/calculator/old-vs-new-tax-regime"],
                ["Tax with Capital Gains", "/calculator/income-tax-with-capital-gains"],
              ].map(([label, href]) => (
                <li key={href}>
                  <span className="flex items-center gap-2 text-xs text-ink-soft group-hover:text-ink transition">
                    <span className="text-brand">→</span> {label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="absolute bottom-5 right-5 text-ink-soft opacity-0 group-hover:opacity-100 transition">
              <ArrowRight />
            </div>
          </Link>

          {/* Path 3: Invest */}
          <Link href="/investments"
            className="group relative overflow-hidden rounded-2xl border border-rule bg-surface p-6 shadow-card transition hover:border-brand hover:shadow-card-lg hover:-translate-y-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              📈
            </div>
            <h3 className="font-display text-lg font-semibold text-ink group-hover:text-brand transition">Invest & Retire</h3>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              SIP returns, EPF corpus, NPS pension, FIRE number — plan your money's future.
            </p>
            <ul className="mt-4 space-y-1.5">
              {[
                ["SIP Calculator", "/calculator/sip-calculator"],
                ["EPF & VPF Calculator", "/calculator/epf-calculator"],
                ["FIRE Calculator", "/calculator/fire-calculator"],
              ].map(([label, href]) => (
                <li key={href}>
                  <span className="flex items-center gap-2 text-xs text-ink-soft group-hover:text-ink transition">
                    <span className="text-brand">→</span> {label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="absolute bottom-5 right-5 text-ink-soft opacity-0 group-hover:opacity-100 transition">
              <ArrowRight />
            </div>
          </Link>
        </div>

        {/* Secondary categories */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { emoji: "🏠", label: "Real Estate", sub: "Home affordability, stamp duty, rent vs buy", href: "/real-estate" },
            { emoji: "💳", label: "Loans & FD", sub: "EMI, fixed deposits, recurring deposits", href: "/loans-deposits" },
            { emoji: "🛡️", label: "Retirement", sub: "PPF, NPS, gratuity, EPF pension", href: "/retirement" },
          ].map(c => (
            <Link key={c.href} href={c.href}
              className="group flex items-center gap-4 rounded-xl border border-rule bg-surface px-4 py-3.5 shadow-card transition hover:border-brand hover:-translate-y-0.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper text-lg group-hover:bg-brand-soft transition-colors">
                {c.emoji}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink group-hover:text-brand transition">{c.label}</p>
                <p className="text-xs text-ink-soft truncate">{c.sub}</p>
              </div>
              <ArrowRight className="ml-auto shrink-0 text-ink-soft opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. INSIGHT STRIP — one striking financial fact
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0f2016] text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            {[
              { stat: "₹12.75 LPA", label: "Zero income tax threshold", sub: "New regime · FY 2025-26", href: "/calculator/income-tax-calculator" },
              { stat: "8.25%", label: "EPF interest rate", sub: "FY 2025-26 · declared by EPFO", href: "/calculator/epf-calculator" },
              { stat: "50%", label: "Deemed profit under 44ADA", sub: "Section 44ADA for freelancers", href: "/calculator/freelancer-tax-calculator" },
            ].map(item => (
              <Link key={item.stat} href={item.href}
                className="group p-4 rounded-2xl border border-white/10 hover:border-white/30 transition">
                <p className="font-display text-3xl font-bold text-[#7dd9a8] sm:text-4xl">{item.stat}</p>
                <p className="mt-2 text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-white/50 mt-1">{item.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. TRENDING — one banner, not two
      ══════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-1 items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-2xl">🏛️</span>
            <div>
              <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                8th Pay Commission Salary Calculator
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Trending</span>
              </p>
              <p className="text-xs text-ink-soft mt-0.5">Estimate your revised basic pay, DA, HRA and gross salary with adjustable fitment factor.</p>
            </div>
          </div>
          <Link href="/calculator/8th-pay-commission-calculator"
            className="shrink-0 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
            Estimate My New Salary →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          6. EDITORIAL — blog as insights, not a widget
      ══════════════════════════════════════════════════════════════════ */}
      {posts.length > 0 && (
        <section className="border-t border-rule bg-surface">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand">From the blog</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-ink">Salary & tax insights</h2>
              </div>
              <Link href="/blog" className="text-sm font-medium text-brand hover:underline underline-offset-2 shrink-0">
                All articles →
              </Link>
            </div>

            {/* Featured + two smaller */}
            <div className="grid gap-5 lg:grid-cols-5">
              {/* Featured post */}
              <Link href={`/blog/${posts[0].slug}`}
                className="group lg:col-span-3 flex flex-col rounded-2xl border border-rule bg-paper overflow-hidden shadow-card hover:border-brand hover:-translate-y-0.5 transition">
                {posts[0].frontmatter.ogImage && (
                  <img src={posts[0].frontmatter.ogImage} alt={posts[0].frontmatter.title}
                    className="w-full h-44 object-contain bg-white border-b border-rule" />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {posts[0].frontmatter.category && (
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
                        {posts[0].frontmatter.category}
                      </span>
                    )}
                    <span className="text-[10px] text-ink-soft">{formatBlogDate(posts[0].frontmatter.date)}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink group-hover:text-brand transition leading-snug">
                    {posts[0].frontmatter.title}
                  </h3>
                  {posts[0].frontmatter.description && (
                    <p className="mt-2 text-sm text-ink-soft line-clamp-2 flex-1">
                      {posts[0].frontmatter.description}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand">
                    Read article <ArrowRight />
                  </span>
                </div>
              </Link>

              {/* Two smaller posts */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                {posts.slice(1, 3).map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="group flex gap-4 rounded-2xl border border-rule bg-paper p-4 shadow-card hover:border-brand hover:-translate-y-0.5 transition">
                    {post.frontmatter.ogImage && (
                      <img src={post.frontmatter.ogImage} alt={post.frontmatter.title}
                        className="h-20 w-24 shrink-0 rounded-lg object-contain bg-white border border-rule" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {post.frontmatter.category && (
                          <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
                            {post.frontmatter.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-ink group-hover:text-brand transition line-clamp-2 leading-snug">
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

      {/* ══════════════════════════════════════════════════════════════════
          7. TRUST + FAQ — compact, end of page
      ══════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-2">

          {/* Why SalaryTools */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">Why SalaryTools</p>
            <div className="space-y-4">
              {[
                { icon: "🔒", title: "Your data never leaves your device", body: "Every calculation runs in your browser. No server, no account, no data collection." },
                { icon: "📅", title: "Updated every budget", body: "Tax slabs, EPF rates, standard deduction — all updated within 24 hours of every budget." },
                { icon: "🎯", title: "Built for Indian salaries", body: "Not a US calculator ported to India. Built ground-up for Indian salary structures, PT, HRA city tiers, and EPF rules." },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-rule text-lg">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-ink text-sm">{item.title}</p>
                    <p className="text-xs text-ink-soft mt-0.5 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">Common questions</p>
            <div className="space-y-4">
              {[
                { q: "Why is my CTC different from in-hand salary?", a: "CTC includes employer PF (~12% of basic) and gratuity provisioning — neither appears in your bank account. Your take-home is CTC minus employer costs, employee PF, professional tax, and TDS." },
                { q: "New or old tax regime — which is better?", a: "New regime is better for most salaried employees. Old regime makes sense only if your combined deductions (80C + HRA + home loan interest) exceed ₹3.75–4L." },
                { q: "Are these calculators accurate?", a: "Yes for most private-sector employees. Results may vary based on your exact salary structure, city (professional tax differs), and employer-specific policies like NPS contribution or special allowances." },
              ].map(faq => (
                <div key={faq.q} className="border-b border-rule pb-4 last:border-0">
                  <p className="text-sm font-medium text-ink">{faq.q}</p>
                  <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
