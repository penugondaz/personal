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

// ─── Build-time data ──────────────────────────────────────────────────────────

const FY = getCurrentFY();

const HERO_LPA = 10;
const HERO = (() => {
  const r = calculateSalaryBreakup({ annualCtc: HERO_LPA * 100_000, regime: "new" });
  const tax = calculateIncomeTax(r.grossSalaryAnnual, "new");
  return {
    ctcMonthly: Math.round((HERO_LPA * 100_000) / 12),
    inHand: r.inHandMonthly,
    tds: Math.round(tax.totalTaxPayable / 12),
    pf: r.employeePfMonthly,
    pt: r.professionalTaxMonthly,
  };
})();

const SALARY_TABLE = [5, 7, 8, 10, 12, 15, 18, 20, 25, 30, 40, 50].map(lpa => {
  const r = calculateSalaryBreakup({ annualCtc: lpa * 100_000, regime: "new" });
  const tax = calculateIncomeTax(r.grossSalaryAnnual, "new");
  return { lpa, inHand: r.inHandMonthly, taxFree: tax.totalTaxPayable === 0, slug: salarySlug(lpa) };
});

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <main>

      {/* ══════════════════════════════════════════════════════════
          HERO — light, spacious, salary card on right
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-rule bg-surface">

        {/* Decorative blob — very subtle */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-brand-soft opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-accent-soft opacity-20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_400px]">

            {/* Left: headline + CTAs */}
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                FY {FY.fy} · New tax regime · Updated
              </span>

              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.15] text-ink sm:text-5xl">
                Your CTC is not<br />
                your{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-brand">take-home salary</span>
                  <span className="absolute inset-x-0 bottom-1 h-2 bg-brand-soft -z-0 rounded" />
                </span>
              </h1>

              <p className="mt-5 text-base text-ink-soft leading-relaxed">
                Find out exactly how much lands in your bank — and how much goes to tax, PF and professional tax. Free, instant, no signup.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/salary"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark">
                  Calculate In-Hand Salary <ChevronRight />
                </Link>
                <Link href="/calculator/income-tax-calculator"
                  className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:border-brand hover:text-brand">
                  Income Tax Calculator
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-soft">
                {["30+ calculators", "No signup", "Browser-only", "Updated every budget"].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckIcon /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: salary breakdown card */}
            <div className="rounded-2xl border border-rule bg-paper shadow-card-lg">
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-rule px-5 py-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">
                    Example — {HERO_LPA} LPA CTC
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-ink">
                    {formatINR(HERO.inHand)}
                    <span className="ml-1 text-sm font-normal text-ink-soft">/month</span>
                  </p>
                  <p className="text-xs text-brand font-medium mt-0.5">in-hand salary · new regime</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6 text-brand" strokeWidth={1.8}>
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Breakdown rows */}
              <div className="px-5 py-4 space-y-0">
                {[
                  { label: "Monthly CTC",      value: formatINR(HERO.ctcMonthly), type: "base" },
                  { label: "TDS (income tax)",  value: HERO.tds > 0 ? `− ${formatINR(HERO.tds)}` : "Zero tax ✓", type: "deduct", green: HERO.tds === 0 },
                  { label: "Employee PF",       value: `− ${formatINR(HERO.pf)}`, type: "deduct" },
                  { label: "Professional tax",  value: HERO.pt > 0 ? `− ${formatINR(HERO.pt)}` : "Nil", type: HERO.pt > 0 ? "deduct" : "neutral" },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between border-b border-rule py-2.5 last:border-0">
                    <span className="text-xs text-ink-soft">{row.label}</span>
                    <span className={`tabular text-sm font-medium ${
                      row.green ? "text-brand" :
                      row.type === "deduct" ? "text-deduction" : "text-ink"
                    }`}>{row.value}</span>
                  </div>
                ))}

                {/* Result row */}
                <div className="mt-1 flex items-center justify-between rounded-xl bg-brand-soft px-4 py-3">
                  <span className="text-sm font-semibold text-brand">In-hand salary</span>
                  <span className="tabular text-lg font-bold text-brand">{formatINR(HERO.inHand)}</span>
                </div>
              </div>

              <div className="border-t border-rule px-5 py-3">
                <Link href="/salary"
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-ink-soft transition hover:text-brand">
                  Calculate for your CTC <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SALARY STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <div className="flex items-center justify-between mb-3.5">
            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide">
              In-hand salary · new regime · {FY.fy}
            </p>
            <Link href="/salary" className="text-xs font-medium text-brand hover:underline underline-offset-2">
              All LPA values →
            </Link>
          </div>
          <div className="overflow-x-auto -mx-1 pb-1">
            <div className="flex gap-2 px-1" style={{ minWidth: "max-content" }}>
              {SALARY_TABLE.map(({ lpa, inHand, taxFree, slug }) => (
                <Link key={lpa} href={`/salary/${slug}`}
                  className="group flex-shrink-0 rounded-xl border border-rule bg-surface px-4 py-3 text-center shadow-card transition hover:border-brand hover:-translate-y-0.5">
                  <p className="text-sm font-semibold text-ink">{lpa} LPA</p>
                  <p className="tabular text-xs font-medium text-brand mt-0.5">
                    {formatINR(inHand)}<span className="text-[10px] text-ink-soft">/mo</span>
                  </p>
                  {taxFree && <p className="text-[9px] text-brand mt-0.5 font-semibold">Zero tax</p>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3 PATHS — compact, scannable
      ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 py-12">

        <div className="mb-2">
          <h2 className="font-display text-2xl font-semibold text-ink">What do you want to figure out?</h2>
          <p className="mt-1.5 text-sm text-ink-soft">Every calculator is free. No account needed.</p>
        </div>

        {/* Primary 3 */}
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6 text-brand" strokeWidth={1.8}>
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              bg: "bg-brand-soft",
              badge: null,
              title: "Salary & CTC",
              desc: "Break CTC into take-home. Understand every deduction.",
              links: [
                { label: "In-Hand Salary Calculator", href: "/salary" },
                { label: "Salary Hike Impact", href: "/calculator/salary-hike-calculator" },
                { label: "Reverse: In-Hand → CTC", href: "/salary/inhand-to-ctc-calculator" },
              ],
              cta: { label: "Calculate salary", href: "/salary" },
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6 text-brand" strokeWidth={1.8}>
                  <path d="M9 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" />
                  <path d="M8 2v4M16 2v4M3 10h18" strokeLinecap="round" />
                </svg>
              ),
              bg: "bg-brand-soft",
              badge: "Most used",
              title: "Income Tax",
              desc: "New vs old regime. Zero tax up to ₹12.75 LPA. Slab-wise breakdown.",
              links: [
                { label: "Income Tax Calculator", href: "/calculator/income-tax-calculator" },
                { label: "Old vs New Regime", href: "/calculator/old-vs-new-tax-regime" },
                { label: "Tax + Capital Gains", href: "/calculator/income-tax-with-capital-gains" },
              ],
              cta: { label: "Calculate tax", href: "/calculator/income-tax-calculator" },
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6 text-brand" strokeWidth={1.8}>
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="16 7 22 7 22 13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              bg: "bg-blue-50",
              badge: null,
              title: "Invest & Retire",
              desc: "SIP returns, EPF corpus, NPS pension, FIRE number — grow your money.",
              links: [
                { label: "SIP Calculator", href: "/calculator/sip-calculator" },
                { label: "EPF & VPF Calculator", href: "/calculator/epf-calculator" },
                { label: "FIRE Calculator", href: "/calculator/fire-calculator" },
              ],
              cta: { label: "Plan investments", href: "/investments" },
            },
          ].map(card => (
            <div key={card.title}
              className="flex flex-col rounded-2xl border border-rule bg-surface p-5 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg}`}>
                  {card.icon}
                </div>
                {card.badge && (
                  <span className="rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {card.badge}
                  </span>
                )}
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">{card.title}</h3>
              <p className="mt-1.5 text-xs text-ink-soft leading-relaxed flex-1">{card.desc}</p>

              <div className="mt-4 space-y-2">
                {card.links.map(l => (
                  <Link key={l.href} href={l.href}
                    className="flex items-center gap-2 text-xs text-ink-soft hover:text-brand transition">
                    <span className="text-brand opacity-60">→</span> {l.label}
                  </Link>
                ))}
              </div>

              <Link href={card.cta.href}
                className="mt-5 flex items-center justify-center gap-1.5 rounded-lg border border-brand/30 bg-brand-soft py-2.5 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white">
                {card.cta.label} <ChevronRight size={12} />
              </Link>
            </div>
          ))}
        </div>

        {/* Secondary row */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { emoji: "🏠", label: "Real Estate", sub: "Home loan, stamp duty, rent vs buy", href: "/real-estate" },
            { emoji: "💳", label: "Loans & Deposits", sub: "EMI, FD, RD, compound interest", href: "/loans-deposits" },
            { emoji: "🛡️", label: "Retirement", sub: "PPF, NPS, gratuity, EPF pension", href: "/retirement" },
          ].map(c => (
            <Link key={c.href} href={c.href}
              className="group flex items-center gap-3.5 rounded-xl border border-rule bg-paper px-4 py-3.5 shadow-card transition hover:border-brand hover:-translate-y-0.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-rule text-xl group-hover:bg-brand-soft group-hover:border-brand/20 transition">
                {c.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink group-hover:text-brand transition">{c.label}</p>
                <p className="text-xs text-ink-soft truncate">{c.sub}</p>
              </div>
              <ChevronRight size={14} className="shrink-0 text-ink-soft opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          KEY NUMBERS — brand green, tasteful
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-rule bg-brand-soft">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            {[
              { stat: "₹12.75 LPA", label: "Zero income tax threshold", sub: "New regime · Section 87A rebate", href: "/calculator/income-tax-calculator" },
              { stat: "8.25%", label: "EPF interest rate", sub: "FY 2025-26 · declared by EPFO", href: "/calculator/epf-calculator" },
              { stat: "₹75,000", label: "Standard deduction", sub: "New regime · salaried employees", href: "/calculator/income-tax-calculator" },
            ].map(item => (
              <Link key={item.stat} href={item.href}
                className="group rounded-2xl border border-brand/10 bg-surface px-5 py-6 shadow-card transition hover:border-brand hover:-translate-y-0.5 hover:shadow-card-lg">
                <p className="font-display text-3xl font-bold text-brand">{item.stat}</p>
                <p className="mt-2 text-sm font-semibold text-ink">{item.label}</p>
                <p className="text-xs text-ink-soft mt-1">{item.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRENDING BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-amber-200/80 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-1 items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-2xl">🏛️</span>
            <div>
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                8th Pay Commission Salary Calculator
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">Trending</span>
              </p>
              <p className="text-xs text-ink-soft mt-0.5">Estimate your revised basic pay, DA, HRA with adjustable fitment factor.</p>
            </div>
          </div>
          <Link href="/calculator/8th-pay-commission-calculator"
            className="shrink-0 rounded-xl bg-ink px-5 py-2.5 text-xs font-semibold text-white hover:opacity-80 transition">
            Estimate My Salary →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BLOG — editorial layout
      ══════════════════════════════════════════════════════════ */}
      {posts.length > 0 && (
        <section className="border-t border-rule">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="flex items-end justify-between mb-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand">From the blog</p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">Salary & tax insights</h2>
              </div>
              <Link href="/blog" className="text-xs font-medium text-brand hover:underline underline-offset-2">
                All articles →
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-5">
              {/* Featured */}
              <Link href={`/blog/${posts[0].slug}`}
                className="group lg:col-span-3 flex flex-col rounded-2xl border border-rule bg-surface overflow-hidden shadow-card hover:border-brand hover:-translate-y-0.5 transition">
                {posts[0].frontmatter.ogImage && (
                  <img src={posts[0].frontmatter.ogImage} alt={posts[0].frontmatter.title}
                    className="w-full h-44 object-contain bg-paper border-b border-rule" />
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
                  <h3 className="font-display text-base font-semibold text-ink group-hover:text-brand transition line-clamp-2 flex-1">
                    {posts[0].frontmatter.title}
                  </h3>
                  {posts[0].frontmatter.description && (
                    <p className="mt-2 text-xs text-ink-soft line-clamp-2 leading-relaxed">
                      {posts[0].frontmatter.description}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand">
                    Read article <ChevronRight size={11} />
                  </span>
                </div>
              </Link>

              {/* Two side cards */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {posts.slice(1, 3).map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="group flex gap-3.5 rounded-2xl border border-rule bg-surface p-4 shadow-card hover:border-brand hover:-translate-y-0.5 transition flex-1">
                    {post.frontmatter.ogImage && (
                      <img src={post.frontmatter.ogImage} alt={post.frontmatter.title}
                        className="h-16 w-20 shrink-0 rounded-lg object-contain bg-paper border border-rule" />
                    )}
                    <div className="min-w-0">
                      {post.frontmatter.category && (
                        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
                          {post.frontmatter.category}
                        </span>
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

      {/* ══════════════════════════════════════════════════════════
          TRUST + FAQ
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-rule bg-paper">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid gap-10 lg:grid-cols-2">

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-5">Why SalaryTools</p>
              <div className="space-y-5">
                {[
                  { icon: "🔒", title: "Your data never leaves your device", body: "Every calculation runs entirely in your browser. No server, no account, no data collection — ever." },
                  { icon: "📅", title: "Updated every budget", body: "Tax slabs, EPF rates, standard deduction — all updated within 24 hours of the union budget." },
                  { icon: "🇮🇳", title: "Built for Indian salaries", body: "Not a US calculator ported to India. Built from scratch for Indian salary structures, PT, HRA city tiers, and EPF rules." },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-rule text-lg">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.title}</p>
                      <p className="text-xs text-ink-soft mt-0.5 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-5">Common questions</p>
              <div className="space-y-5">
                {[
                  { q: "Why is my CTC different from in-hand salary?", a: "CTC includes employer PF (~12% of basic) and gratuity provisioning — neither appears in your bank account. Your take-home is CTC minus employer costs, employee PF, professional tax, and TDS." },
                  { q: "New or old tax regime — which is better?", a: "New regime is better for most salaried employees earning up to ₹15-20 LPA. Old regime makes sense only if combined deductions (80C + HRA + home loan interest) exceed ₹3.75–4L." },
                  { q: "Are these calculators accurate?", a: "Yes for most private-sector employees. Results vary based on your exact salary structure, city (PT differs by state), and employer-specific policies like NPS or special allowances." },
                ].map(faq => (
                  <div key={faq.q} className="border-b border-rule pb-5 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-ink">{faq.q}</p>
                    <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronRight({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
