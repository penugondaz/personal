import type { Metadata } from "next";
import Link from "next/link";
import { salarySlug } from "@/lib/salary-data";
import { salaryGrowthSlug } from "@/lib/salary-growth-data";
import { taxSavingSlug } from "@/lib/tax-saving-data";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { calculateSalaryGrowth } from "@/lib/calculators/salary-growth";
import { calculateTaxSaving } from "@/lib/calculators/tax-saving";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";
import { getSiteSettings, getHomepageSections } from "@/sanity.client";

export const metadata: Metadata = {
  title: "Salary Tools India — In-Hand Salary, Tax, EPF & Investment Calculators",
  description:
    "Free salary, CTC, income tax, EPF, SIP, and investment calculators for India. See exactly what lands in your bank account. FY 2026-27 tax rules.",
  alternates: { canonical: absoluteUrl("/") },
};

const POPULAR_LPAS = [5, 6, 8, 10, 12, 15, 20, 25];

// Default FAQs — used if Sanity has none
const DEFAULT_FAQS = [
  {
    question: "How accurate is this calculator?",
    answer:
      "It models the most common salary structure used by Indian private-sector employers (basic ~40% of CTC, HRA ~50% of basic, statutory PF and tax rules for FY 2026-27). Use it as a close estimate, not an exact figure from your specific offer letter.",
  },
  {
    question: "Does this use the old or new tax regime?",
    answer:
      "Both — every calculator lets you switch between the new tax regime (default since FY 2023-24) and the old regime, so you can compare your actual take-home under each.",
  },
  {
    question: "Is my data stored or sent anywhere?",
    answer:
      "No. Every calculation runs entirely in your browser. Nothing you type is sent to a server or saved.",
  },
];

const CATEGORIES = [
  { id: "salary",      icon: "💰", label: "Salary & CTC",      description: "CTC to in-hand, salary structure, hike calculator", href: "/salary" },
  { id: "tax",         icon: "🧾", label: "Tax Saving",         description: "80C, NPS, HRA, old vs new regime",                  href: "/tax-saving" },
  { id: "retirement",  icon: "🏦", label: "Retirement",         description: "EPF, PPF, NPS, gratuity calculator",               href: "/calculator/epf-calculator" },
  { id: "investments", icon: "📈", label: "Investments",        description: "SIP, lumpsum, SWP, goal planning",                 href: "/calculator/sip-calculator" },
  { id: "loans",       icon: "🏠", label: "Loans & Deposits",   description: "EMI, FD, RD, compound interest",                  href: "/calculator/emi-calculator" },
  { id: "tools",       icon: "🛠️", label: "Free Tools",         description: "Discount, percentage, number converter & more",   href: "/tools" },
];

export default async function HomePage() {
  // Fetch from Sanity — null if not set, falls back to defaults below
  const [cms, sections] = await Promise.all([
    getSiteSettings(),
    getHomepageSections(),
  ]);

  // Use Sanity content if available, otherwise use hardcoded defaults
  const heroHeadline = cms?.heroHeadline  ?? "India's Salary & Finance Calculator Suite";
  const heroSubtext  = cms?.heroSubtext   ?? "Salary, tax, EPF, investments, and layoff risk — everything you need to understand your money. Free, private, no signup.";
  const badgeText    = cms?.badgeText     ?? (() => {
    const now = new Date();
    const yr = now.getFullYear();
    const mo = now.getMonth() + 1;
    const fyStart = mo >= 4 ? yr : yr - 1;
    const fyEnd = String(fyStart + 1).slice(-2);
    const month = now.toLocaleString("en-IN", { month: "long" });
    return `FY ${fyStart}-${fyEnd} tax rules · Updated ${month} ${yr}`;
  })();
  const whyCTCNote   = cms?.whyCTCNote   ?? "When a company quotes a salary in LPA, that figure is your CTC (Cost to Company) — the total the company spends on you in a year, not what reaches your bank account. CTC bundles fixed pay, the employer's PF contribution, and gratuity reserves — none of which you receive as monthly cash. From your actual gross, your own PF, professional tax, and income tax are deducted before the rest lands in your account.";

  // Use Sanity FAQs if any exist, otherwise use defaults
  const faqs = (sections?.faqs?.length > 0) ? sections.faqs : DEFAULT_FAQS;

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft via-paper to-paper" />
        <div className="mx-auto max-w-5xl px-6 pb-10 pt-6 sm:pt-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-surface px-3 py-1 text-xs font-medium text-brand">
              {badgeText}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold text-ink sm:text-5xl">
              {heroHeadline}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft sm:text-lg">
              {heroSubtext}
            </p>
          </div>

          {/* Category grid */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={cat.href}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-rule bg-surface px-3 py-4 text-center shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-xl group-hover:bg-brand group-hover:text-white transition-colors">
                  {cat.icon}
                </span>
                <span className="text-xs font-semibold text-ink">{cat.label}</span>
                <span className="hidden text-[10px] leading-tight text-ink-soft sm:block">{cat.description}</span>
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/salary" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-card-lg transition hover:opacity-90">
              Calculate In-Hand Salary <ArrowIcon />
            </Link>
            <Link href="/calculator/layoff-risk-calculator" className="inline-flex items-center gap-2 rounded-full border border-deduction/40 bg-deduction/8 px-6 py-3 text-sm font-semibold text-deduction transition hover:bg-deduction hover:text-white">
              ⚠ Check Layoff Risk
            </Link>
            <Link href="/layoffs" className="inline-flex items-center gap-2 rounded-full border border-rule bg-surface px-6 py-3 text-sm font-medium text-ink transition hover:border-brand hover:text-brand">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-deduction opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-deduction" />
              </span>
              Live Layoffs Tracker
            </Link>
          </div>
        </div>
      </section>

      {/* ── Layoff Risk Banner ── */}
      <section className="mx-auto max-w-5xl px-6 py-6">
        <div className="overflow-hidden rounded-2xl border border-deduction/25 bg-surface shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 px-6 py-5">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-deduction/10 text-2xl">⚠️</div>
              <div>
                <p className="font-semibold text-ink">Layoff Risk Calculator</p>
                <p className="text-sm text-ink-soft">Get a personal risk score (0–100) based on company health, your role, dept, AI exposure & more.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:shrink-0">
              <Link href="/calculator/layoff-risk-calculator" className="inline-flex items-center gap-1.5 rounded-xl bg-deduction px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">Calculate My Risk →</Link>
              <Link href="/layoffs" className="inline-flex items-center gap-1.5 rounded-xl border border-rule px-4 py-2.5 text-sm font-medium text-ink hover:border-deduction hover:text-deduction transition">Layoffs Tracker</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Salary quick-pick ── */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">In-Hand Salary by CTC</h2>
            <p className="mt-0.5 text-sm text-ink-soft">Jump to a full breakdown for the most-searched salaries</p>
          </div>
          <Link href="/salary" className="text-sm font-medium text-brand hover:underline underline-offset-2 shrink-0">All salaries →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {POPULAR_LPAS.map((lpa) => {
            const result = calculateSalaryBreakup({ annualCtc: lpa * 100_000, regime: "new" });
            return (
              <Link key={lpa} href={`/salary/${salarySlug(lpa)}`}
                className="block rounded-xl border border-rule bg-surface px-3 py-3 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg text-center">
                <span className="font-display text-lg font-semibold text-ink">{lpa} LPA</span>
                <p className="tabular mt-1 text-[11px] text-ink-soft">{formatINR(result.inHandMonthly)}<span className="text-[10px]">/mo</span></p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Three column feature sections ── */}
      <section className="mx-auto max-w-5xl px-6 py-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Tax Saving */}
          <div className="rounded-2xl border border-rule bg-surface shadow-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-rule px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-base">🧾</span>
              <div><p className="font-semibold text-ink">Tax Saving</p><p className="text-xs text-ink-soft">How much can you save?</p></div>
              <Link href="/tax-saving" className="ml-auto text-xs font-medium text-brand hover:underline">All →</Link>
            </div>
            <div className="divide-y divide-rule">
              {POPULAR_LPAS.slice(0, 5).map((lpa) => {
                const data = calculateTaxSaving(lpa * 100_000);
                return (
                  <Link key={lpa} href={`/tax-saving/${taxSavingSlug(lpa)}`}
                    className="flex items-center justify-between px-5 py-2.5 hover:bg-paper transition group">
                    <span className="text-sm font-medium text-ink group-hover:text-brand">{lpa} LPA</span>
                    <div className="text-right">
                      <span className="tabular text-xs text-deduction block">Tax: {formatINR(data.currentTaxNew)}</span>
                      <span className="tabular text-xs text-brand block">Save: {formatINR(data.maxPossibleSavingOld)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Salary Growth */}
          <div className="rounded-2xl border border-rule bg-surface shadow-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-rule px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-base">📈</span>
              <div><p className="font-semibold text-ink">Salary Growth</p><p className="text-xs text-ink-soft">Where will you be in 10 years?</p></div>
              <Link href="/salary-growth" className="ml-auto text-xs font-medium text-brand hover:underline">All →</Link>
            </div>
            <div className="divide-y divide-rule">
              {POPULAR_LPAS.slice(0, 5).map((lpa) => {
                const data = calculateSalaryGrowth(lpa * 100_000);
                const avg = data.scenarios[1];
                return (
                  <Link key={lpa} href={`/salary-growth/${salaryGrowthSlug(lpa)}`}
                    className="flex items-center justify-between px-5 py-2.5 hover:bg-paper transition group">
                    <span className="text-sm font-medium text-ink group-hover:text-brand">{lpa} LPA</span>
                    <div className="text-right">
                      <span className="tabular text-xs text-ink-soft block">5yr: {formatINRCompact(avg.ctcAt5Years)}</span>
                      <span className="tabular text-xs text-brand block">10yr: {formatINRCompact(avg.ctcAt10Years)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Popular */}
          <div className="rounded-2xl border border-rule bg-surface shadow-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-rule px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-base">⭐</span>
              <div><p className="font-semibold text-ink">Popular</p><p className="text-xs text-ink-soft">Most used calculators</p></div>
            </div>
            <div className="divide-y divide-rule">
              {[
                { href: "/calculator/sip-calculator",        icon: "📊", label: "SIP Calculator" },
                { href: "/calculator/epf-calculator",        icon: "🏦", label: "EPF & VPF Calculator" },
                { href: "/calculator/emi-calculator",        icon: "🏠", label: "EMI Calculator" },
                { href: "/calculator/old-vs-new-tax-regime", icon: "⚖️", label: "Old vs New Tax Regime" },
                { href: "/calculator/hra-calculator",        icon: "🏡", label: "HRA Exemption" },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 px-5 py-2.5 hover:bg-paper transition group">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm font-medium text-ink group-hover:text-brand">{item.label}</span>
                  <ArrowIcon className="ml-auto opacity-0 group-hover:opacity-100 transition text-brand" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── All Calculators ── */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <h2 className="font-display text-2xl font-semibold text-ink">All Calculators</h2>
        <p className="mt-1 text-sm text-ink-soft">Everything in one place</p>
        <div className="mt-6 space-y-8">

          <div>
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-soft mb-3">
              <span className="h-px flex-1 bg-rule" /> Tracker & Risk <span className="h-px flex-1 bg-rule" />
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/layoffs" emoji="🔴" title="Layoffs Tracker" description="Real-time India tech layoffs — company, headcount, date, source." featured />
              <DirectoryCard href="/calculator/layoff-risk-calculator" emoji="⚠️" title="Layoff Risk Calculator" description="Your personal layoff risk score (0–100) based on 13 signals." featured />
            </div>
          </div>

          <div><SectionHeader label="💰 Salary & CTC" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/salary" emoji="💰" title="In-Hand Salary" description="Full CTC → take-home breakdown for any salary." />
              <DirectoryCard href="/salary/inhand-to-ctc-calculator" emoji="🔄" title="In-Hand to CTC" description="Reverse: find CTC from your desired take-home." />
              <DirectoryCard href="/salary/salary-structure-calculator" emoji="📋" title="Salary Structure" description="Custom basic/HRA percentages → breakup." />
              <DirectoryCard href="/calculator/salary-hike-calculator" emoji="📈" title="Salary Hike" description="What a CTC hike means for your real take-home." />
              <DirectoryCard href="/salary-growth" emoji="🚀" title="Salary Growth" description="Project your salary in 5 & 10 years." />
            </div>
          </div>

          <div><SectionHeader label="🧾 Tax Saving" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/tax-saving" emoji="🧾" title="Tax Saving Guide" description="80C, NPS, HRA, home loan — all deductions by salary." />
              <DirectoryCard href="/calculator/old-vs-new-tax-regime" emoji="⚖️" title="Old vs New Regime" description="Which tax regime saves you more." />
              <DirectoryCard href="/calculator/hra-calculator" emoji="🏡" title="HRA Exemption" description="How much of your HRA is actually tax-free." />
              <DirectoryCard href="/calculator/advance-tax-calculator" emoji="📅" title="Advance Tax" description="Quarterly installment schedule." />
              <DirectoryCard href="/calculator/capital-gains-calculator" emoji="📊" title="Capital Gains" description="STCG & LTCG tax on equity, debt, and other assets." />
              <DirectoryCard href="/calculator/leave-encashment-calculator" emoji="🏖️" title="Leave Encashment" description="Encashment amount and tax exemption." />
            </div>
          </div>

          <div><SectionHeader label="🏦 Retirement & Savings" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/calculator/epf-calculator" emoji="🏦" title="EPF & VPF" description="Monthly PF contribution and long-term maturity." />
              <DirectoryCard href="/calculator/ppf-calculator" emoji="📗" title="PPF" description="Year-by-year PPF growth at 7.1% interest." />
              <DirectoryCard href="/calculator/nps-calculator" emoji="🏛️" title="NPS" description="Retirement corpus and estimated monthly pension." />
              <DirectoryCard href="/calculator/gratuity-calculator" emoji="🎁" title="Gratuity" description="Lump-sum payout after 5+ years of service." />
              <DirectoryCard href="/calculator/nsc-calculator" emoji="📜" title="NSC Calculator" description="National Savings Certificate at 7.7%." />
            </div>
          </div>

          <div><SectionHeader label="📈 Investments" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/calculator/sip-calculator" emoji="📊" title="SIP Calculator" description="Project your mutual fund SIP + lumpsum growth." />
              <DirectoryCard href="/calculator/step-up-sip-calculator" emoji="⬆️" title="Step-Up SIP" description="SIP with annual increase — more realistic." />
              <DirectoryCard href="/calculator/lumpsum-calculator" emoji="💵" title="Lumpsum Calculator" description="One-time investment returns over time." />
              <DirectoryCard href="/calculator/swp-inflation-calculator" emoji="📉" title="SWP + Inflation" description="Withdrawal plan with inflation-adjusted payouts." />
              <DirectoryCard href="/calculator/goal-planning-calculator" emoji="🎯" title="Goal Planning" description="SIP needed to reach your financial goal." />
              <DirectoryCard href="/calculator/lic-xirr-calculator" emoji="📋" title="LIC XIRR Calculator" description="Find your actual LIC policy returns." />
            </div>
          </div>

          <div><SectionHeader label="🏠 Loans & Deposits" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/calculator/emi-calculator" emoji="🏠" title="EMI Calculator" description="Home, personal, car & education loan EMIs." />
              <DirectoryCard href="/calculator/fd-calculator" emoji="🏧" title="Fixed Deposit" description="FD maturity at any compounding frequency." />
              <DirectoryCard href="/calculator/rd-calculator" emoji="📆" title="Recurring Deposit" description="RD maturity from monthly deposits." />
              <DirectoryCard href="/calculator/compound-interest-calculator" emoji="♾️" title="Compound Interest" description="CI with flexible compounding." />
            </div>
          </div>

          <div><SectionHeader label="🛠️ Free Tools" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/tools/discount-calculator" emoji="🏷️" title="Discount Calculator" description="Sale price after % or flat discount." />
              <DirectoryCard href="/tools/percentage-calculator" emoji="📊" title="Percentage Calculator" description="% of, increase, decrease, change — 5 modes." />
              <DirectoryCard href="/tools/number-converter" emoji="🔢" title="Number Converter" description="12333232 → 1 Crore, 23 Lakh, 33 Thousand, 232." />
              <DirectoryCard href="/tools/character-counter" emoji="🔡" title="Character Counter" description="Count characters, letters, digits, spaces." />
              <DirectoryCard href="/tools/word-counter" emoji="📝" title="Word Counter" description="Words, sentences, reading time & top words." />
              <DirectoryCard href="/tools/text-case-converter" emoji="🔤" title="Text Case Converter" description="Title, Sentence, camelCase, snake_case & more." />
            </div>
          </div>

        </div>
      </section>

      {/* ── Why CTC ≠ In-Hand ── */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-2xl border border-rule bg-surface px-6 py-7 sm:px-8">
          <h2 className="font-display text-xl font-semibold text-ink">Why Your CTC Is Not Your Take-Home Pay</h2>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">{whyCTCNote}</p>
          <Link href="/salary" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline underline-offset-2">
            See the full breakdown for your salary <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <h2 className="font-display text-xl font-semibold text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-4">
          {faqs.map((faq: { question: string; answer: string }) => (
            <div key={faq.question} className="rounded-xl border border-rule bg-surface px-5 py-4">
              <h3 className="font-medium text-ink">{faq.question}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h3 className="flex items-center gap-3 text-sm font-bold text-ink mb-3">
      {label}<span className="h-px flex-1 bg-rule" />
    </h3>
  );
}

function DirectoryCard({ href, emoji, title, description, featured }: {
  href: string; emoji: string; title: string; description: string; featured?: boolean;
}) {
  return (
    <Link href={href}
      className={`group flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg
        ${featured ? "border-deduction/25 bg-deduction/5 hover:border-deduction/50" : "border-rule bg-surface hover:border-brand"}`}>
      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm transition-colors
        ${featured ? "bg-deduction/10 group-hover:bg-deduction/20" : "bg-paper group-hover:bg-brand-soft"}`}>
        {emoji}
      </span>
      <div>
        <p className={`text-sm font-semibold ${featured ? "text-deduction" : "text-brand"}`}>{title}</p>
        <p className="mt-0.5 text-xs text-ink-soft leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

function ArrowIcon({ className = "text-ink" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
