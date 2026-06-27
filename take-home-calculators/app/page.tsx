import type { Metadata } from "next";
import Link from "next/link";
import { salarySlug } from "@/lib/salary-data";
import { salaryGrowthSlug } from "@/lib/salary-growth-data";
import { taxSavingSlug } from "@/lib/tax-saving-data";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { calculateSalaryGrowth } from "@/lib/calculators/salary-growth";
import { calculateTaxSaving } from "@/lib/calculators/tax-saving";
import { calculateIncomeTax, getCurrentFY } from "@/lib/calculators/income-tax";
import { INCOME_TAX_LPA_VALUES, incomeTaxSlug } from "@/lib/income-tax-data";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Salary Tools India | Free Salary, Tax, EPF, LIC, SIP & Retirement Calculators",
  description:
    "Free salary, tax, EPF, LIC, SIP, retirement and investment calculators for India. Calculate in-hand salary, income tax, gratuity, PF returns, LIC XIRR, retirement corpus and more.",
  alternates: { canonical: absoluteUrl("/") },
};

const POPULAR_LPAS = [5, 6, 8, 10, 12, 15, 20, 25];

const faqs = [
  {
    question: "How accurate is this calculator?",
    answer:
      "It models the most common salary structure used by Indian private-sector employers (basic ~40% of CTC, HRA ~50% of basic, statutory PF and tax rules for FY 2025-26). Use it as a close estimate, not an exact figure from your specific offer letter.",
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

// ─── Category definitions ─────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "salary",
    icon: "💰",
    label: "Salary & CTC",
    color: "brand",
    description: "CTC to in-hand, salary structure, hike calculator",
    href: "/salary",
    tools: [
      { href: "/salary", label: "In-Hand Salary" },
      { href: "/salary/inhand-to-ctc-calculator", label: "In-Hand → CTC" },
      { href: "/salary/salary-structure-calculator", label: "Salary Structure" },
      { href: "/calculator/salary-hike-calculator", label: "Salary Hike" },
      { href: "/salary-growth", label: "Salary Growth" },
    ],
  },
  {
    id: "tax",
    icon: "🧾",
    label: "Tax Saving",
    color: "brand",
    description: "80C, NPS, HRA, old vs new regime",
    href: "/tax-saving",
    tools: [
      { href: "/tax-saving", label: "Tax Saving Guide" },
      { href: "/calculator/old-vs-new-tax-regime", label: "Old vs New Regime" },
      { href: "/calculator/hra-calculator", label: "HRA Exemption" },
      { href: "/calculator/capital-gains-calculator", label: "Capital Gains" },
      { href: "/calculator/advance-tax-calculator", label: "Advance Tax" },
    ],
  },
  {
    id: "retirement",
    icon: "🏦",
    label: "Retirement",
    color: "brand",
    description: "EPF, PPF, NPS, gratuity calculator",
    href: "/calculator/epf-calculator",
    tools: [
      { href: "/calculator/epf-calculator", label: "EPF & VPF" },
      { href: "/calculator/ppf-calculator", label: "PPF" },
      { href: "/calculator/nps-calculator", label: "NPS" },
      { href: "/calculator/gratuity-calculator", label: "Gratuity" },
      { href: "/calculator/nsc-calculator", label: "NSC" },
    ],
  },
  {
    id: "investments",
    icon: "📈",
    label: "Investments",
    color: "brand",
    description: "SIP, lumpsum, SWP, goal planning",
    href: "/calculator/sip-calculator",
    tools: [
      { href: "/calculator/sip-calculator", label: "SIP Calculator" },
      { href: "/calculator/step-up-sip-calculator", label: "Step-Up SIP" },
      { href: "/calculator/lumpsum-calculator", label: "Lumpsum" },
      { href: "/calculator/swp-inflation-calculator", label: "SWP + Inflation" },
      { href: "/calculator/goal-planning-calculator", label: "Goal Planning" },
    ],
  },
  {
    id: "loans",
    icon: "🏠",
    label: "Loans & Deposits",
    color: "brand",
    description: "EMI, FD, RD, compound interest",
    href: "/calculator/emi-calculator",
    tools: [
      { href: "/calculator/emi-calculator", label: "EMI Calculator" },
      { href: "/calculator/fd-calculator", label: "Fixed Deposit" },
      { href: "/calculator/rd-calculator", label: "Recurring Deposit" },
      { href: "/calculator/compound-interest-calculator", label: "Compound Interest" },
      { href: "/calculator/simple-interest-calculator", label: "Simple Interest" },
    ],
  },
  {
    id: "tools",
    icon: "🛠️",
    label: "Free Tools",
    color: "brand",
    description: "Discount, percentage, number converter & more",
    href: "/tools",
    tools: [
      { href: "/tools/discount-calculator", label: "Discount" },
      { href: "/tools/percentage-calculator", label: "Percentage" },
      { href: "/tools/number-converter", label: "Number Converter" },
      { href: "/tools/word-counter", label: "Word Counter" },
      { href: "/tools/text-case-converter", label: "Case Converter" },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft via-paper to-paper" />
        <div className="mx-auto max-w-5xl px-6 pb-10 pt-14 sm:pt-20">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-surface px-3 py-1 text-xs font-medium text-brand">
              {(() => {
                const now = new Date();
                const yr = now.getFullYear();
                const mo = now.getMonth() + 1; // 1-based
                const fyStart = mo >= 4 ? yr : yr - 1;
                const fyEnd = String(fyStart + 1).slice(-2);
                const month = now.toLocaleString("en-IN", { month: "long" });
                return `FY ${fyStart}-${fyEnd} tax rules · Updated ${month} ${yr}`;
              })()}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold text-ink sm:text-5xl">
              Know Your Salary,<br className="hidden sm:block" /> Save More Tax
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft sm:text-lg">
              India&apos;s most detailed salary, income tax, EPF and investment calculators — new vs old regime, slab breakdown, deductions. Free, private, no signup.
            </p>
          </div>

          {/* ── Category grid — above the fold ── */}
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

          {/* ── Primary CTA strip ── */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/calculator/income-tax-calculator" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-card-lg transition hover:opacity-90">
              🧾 Income Tax Calculator <ArrowIcon />
            </Link>
            <Link href="/salary" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-card-lg transition hover:opacity-90">
              💰 In-Hand Salary <ArrowIcon />
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

      {/* ── Layoff Risk Banner ────────────────────────────────────────────── */}
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
              <Link href="/calculator/layoff-risk-calculator"
                className="inline-flex items-center gap-1.5 rounded-xl bg-deduction px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
                Calculate My Risk →
              </Link>
              <Link href="/layoffs"
                className="inline-flex items-center gap-1.5 rounded-xl border border-rule px-4 py-2.5 text-sm font-medium text-ink hover:border-deduction hover:text-deduction transition">
                Layoffs Tracker
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Salary quick-pick ─────────────────────────────────────────────── */}
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

      {/* ── Income Tax Quick-Pick Widget ────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-6">
        <div className="overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-soft to-paper shadow-card">
          <div className="px-6 py-5 border-b border-brand/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧾</span>
                  <h2 className="font-display text-xl font-semibold text-ink">Income Tax Calculator {(() => { const now = new Date(); const yr = now.getFullYear(); const fyStart = now.getMonth() + 1 >= 4 ? yr : yr - 1; return `FY ${fyStart}-${String(fyStart+1).slice(-2)}`; })()}</h2>
                </div>
                <p className="mt-1 text-sm text-ink-soft">New vs Old Regime · Slab breakdown · Add deductions · Auto-updated every FY</p>
              </div>
              <Link href="/calculator/income-tax-calculator" className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand hover:text-white transition">
                Full Calculator <ArrowIcon />
              </Link>
            </div>
          </div>

          {/* Popular salary tax grid */}
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-3">Income Tax by Salary — {(() => { const now = new Date(); const yr = now.getFullYear(); const fyStart = now.getMonth() + 1 >= 4 ? yr : yr - 1; return `FY ${fyStart}-${String(fyStart+1).slice(-2)}`; })()}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {[6, 8, 10, 12, 15, 20, 25, 30].map(lpa => {
                const gross = Math.round(lpa * 100_000 * 0.85); // approx gross
                const tax = calculateIncomeTax(gross, "new");
                const taxFree = tax.totalTaxPayable === 0;
                return (
                  <Link key={lpa} href={`/calculator/income-tax-calculator/${incomeTaxSlug(lpa)}`}
                    className="group rounded-xl border border-rule bg-surface px-4 py-3 hover:border-brand hover:-translate-y-0.5 transition shadow-card">
                    <p className="font-display text-base font-semibold text-ink">{lpa} LPA</p>
                    <p className={`tabular text-sm font-semibold mt-0.5 ${taxFree ? "text-brand" : "text-deduction"}`}>
                      {taxFree ? "Zero Tax ✓" : formatINR(tax.totalTaxPayable)}
                    </p>
                    <p className="text-[10px] text-ink-soft mt-0.5">
                      {taxFree ? "u/s 87A rebate" : `${((tax.totalTaxPayable / gross) * 100).toFixed(1)}% effective`}
                    </p>
                  </Link>
                );
              })}
            </div>

            {/* Key highlights */}
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                { icon: "🎯", label: "Zero tax up to", value: "₹12.75 LPA", sub: "New regime + std deduction" },
                { icon: "📋", label: "Standard deduction", value: "₹75,000", sub: "New regime · ₹50,000 old" },
                { icon: "🎁", label: "87A rebate", value: "₹60,000", sub: "Taxable income ≤ ₹12L" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-rule bg-paper px-3 py-2.5">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs text-ink-soft">{item.label}</p>
                    <p className="font-semibold text-ink text-sm">{item.value}</p>
                    <p className="text-[10px] text-ink-soft">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/calculator/income-tax-calculator"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
                Calculate My Tax <ArrowIcon />
              </Link>
              <Link href="/calculator/old-vs-new-tax-regime"
                className="inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm font-medium text-ink hover:border-brand hover:text-brand transition">
                Old vs New Regime
              </Link>
              <Link href="/tax-saving"
                className="inline-flex items-center gap-2 rounded-full border border-rule px-5 py-2.5 text-sm font-medium text-ink hover:border-brand hover:text-brand transition">
                Tax Saving Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three column feature sections ────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Tax Saving */}
          <div className="rounded-2xl border border-rule bg-surface shadow-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-rule px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-base">🧾</span>
              <div>
                <p className="font-semibold text-ink">Tax Saving</p>
                <p className="text-xs text-ink-soft">How much can you save?</p>
              </div>
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
              <div>
                <p className="font-semibold text-ink">Salary Growth</p>
                <p className="text-xs text-ink-soft">Where will you be in 10 years?</p>
              </div>
              <Link href="/salary-growth" className="ml-auto text-xs font-medium text-brand hover:underline">All →</Link>
            </div>
            <div className="divide-y divide-rule">
              {POPULAR_LPAS.slice(0, 5).map((lpa) => {
                const data = calculateSalaryGrowth(lpa * 100_000);
                const avg = data.scenarios[1]; // 12%
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

          {/* Popular calculators */}
          <div className="rounded-2xl border border-rule bg-surface shadow-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-rule px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-base">⭐</span>
              <div>
                <p className="font-semibold text-ink">Popular</p>
                <p className="text-xs text-ink-soft">Most used calculators</p>
              </div>
            </div>
            <div className="divide-y divide-rule">
              {[
                { href: "/calculator/sip-calculator",          icon: "📊", label: "SIP Calculator" },
                { href: "/calculator/epf-calculator",          icon: "🏦", label: "EPF & VPF Calculator" },
                { href: "/calculator/emi-calculator",          icon: "🏠", label: "EMI Calculator" },
                { href: "/calculator/old-vs-new-tax-regime",   icon: "⚖️", label: "Old vs New Tax Regime" },
                { href: "/calculator/hra-calculator",          icon: "🏡", label: "HRA Exemption" },
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

      {/* ── All Calculators directory ─────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <h2 className="font-display text-2xl font-semibold text-ink">All Calculators</h2>
        <p className="mt-1 text-sm text-ink-soft">Everything in one place — click any category to explore</p>

        <div className="mt-6 space-y-8">
          {/* Tracker & Risk — special treatment */}
          <div>
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-soft mb-3">
              <span className="h-px flex-1 bg-rule" /> Tracker & Risk <span className="h-px flex-1 bg-rule" />
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/layoffs" emoji="🔴" title="Layoffs Tracker" description="Real-time India tech layoffs — company, headcount, date, source." featured />
              <DirectoryCard href="/calculator/layoff-risk-calculator" emoji="⚠️" title="Layoff Risk Calculator" description="Your personal layoff risk score (0–100) based on 13 signals." featured />
            </div>
          </div>

          {/* Salary */}
          <div>
            <SectionHeader label="💰 Salary & CTC" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/salary" emoji="💰" title="In-Hand Salary" description="Full CTC → take-home breakdown for any salary." />
              <DirectoryCard href="/salary/inhand-to-ctc-calculator" emoji="🔄" title="In-Hand to CTC" description="Reverse: find CTC from your desired take-home." />
              <DirectoryCard href="/salary/salary-structure-calculator" emoji="📋" title="Salary Structure" description="Custom basic/HRA percentages → breakup." />
              <DirectoryCard href="/calculator/salary-hike-calculator" emoji="📈" title="Salary Hike" description="What a CTC hike means for your real take-home." />
              <DirectoryCard href="/salary-growth" emoji="🚀" title="Salary Growth" description="Project your salary in 5 & 10 years." />
            </div>
          </div>

          {/* Tax */}
          <div>
            <SectionHeader label="🧾 Tax Saving" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/tax-saving" emoji="🧾" title="Tax Saving Guide" description="80C, NPS, HRA, home loan — all deductions by salary." />
              <DirectoryCard href="/calculator/income-tax-calculator" emoji="🧾" title="Income Tax Calculator" description="New vs old regime, slab breakdown, deductions." />
              <DirectoryCard href="/calculator/old-vs-new-tax-regime" emoji="⚖️" title="Old vs New Regime" description="Which tax regime saves you more." />
              <DirectoryCard href="/calculator/hra-calculator" emoji="🏡" title="HRA Exemption" description="How much of your HRA is actually tax-free." />
              <DirectoryCard href="/calculator/advance-tax-calculator" emoji="📅" title="Advance Tax" description="Quarterly installment schedule." />
              <DirectoryCard href="/calculator/capital-gains-calculator" emoji="📊" title="Capital Gains" description="STCG & LTCG tax on equity, debt, and other assets." />
              <DirectoryCard href="/calculator/leave-encashment-calculator" emoji="🏖️" title="Leave Encashment" description="Encashment amount and tax exemption." />
              <DirectoryCard href="/calculator/overtime-calculator" emoji="⏰" title="Overtime Pay" description="Overtime earnings at 1.5x, 2x, or custom rates." />
            </div>
          </div>

          {/* Retirement */}
          <div>
            <SectionHeader label="🏦 Retirement & Savings" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/calculator/epf-vs-ppf" emoji="⚖️" title="EPF vs PPF" description="Side-by-side comparison calculator." />
              <DirectoryCard href="/calculator/epf-calculator" emoji="🏦" title="EPF & VPF" description="Monthly PF contribution and long-term maturity." />
              <DirectoryCard href="/calculator/ppf-calculator" emoji="📗" title="PPF" description="Year-by-year PPF growth at 7.1% interest." />
              <DirectoryCard href="/calculator/nps-calculator" emoji="🏛️" title="NPS" description="Retirement corpus and estimated monthly pension." />
              <DirectoryCard href="/calculator/gratuity-calculator" emoji="🎁" title="Gratuity" description="Lump-sum payout after 5+ years of service." />
              <DirectoryCard href="/calculator/nsc-calculator" emoji="📜" title="NSC Calculator" description="National Savings Certificate at 7.7%." />
              <DirectoryCard href="/calculator/pm-surya-ghar-calculator" emoji="🌞" title="PM Surya Ghar" description="Solar subsidy & savings calculator." />
              <DirectoryCard href="/calculator/fire-calculator" emoji="🔥" title="FIRE Calculator" description="When can you retire early? Calculate your FIRE number." />
            </div>
          </div>

          {/* Investments */}
          <div>
            <SectionHeader label="📈 Investments" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/calculator/sip-calculator" emoji="📊" title="SIP Calculator" description="Project your mutual fund SIP + lumpsum growth." />
              <DirectoryCard href="/calculator/step-up-sip-calculator" emoji="⬆️" title="Step-Up SIP" description="SIP with annual increase — more realistic." />
              <DirectoryCard href="/calculator/lumpsum-calculator" emoji="💵" title="Lumpsum Calculator" description="One-time investment returns over time." />
              <DirectoryCard href="/calculator/mutual-fund-calculator" emoji="📂" title="Mutual Fund" description="Combined SIP + lumpsum returns." />
              <DirectoryCard href="/calculator/swp-calculator" emoji="🔄" title="SWP Calculator" description="Systematic withdrawal plan." />
              <DirectoryCard href="/calculator/swp-inflation-calculator" emoji="📉" title="SWP + Inflation" description="Withdrawal plan with inflation-adjusted payouts." />
              <DirectoryCard href="/calculator/goal-planning-calculator" emoji="🎯" title="Goal Planning" description="SIP needed to reach your financial goal." />
              <DirectoryCard href="/calculator/xirr-calculator" emoji="📐" title="XIRR Calculator" description="Annualized returns for irregular cash flows." />
              <DirectoryCard href="/calculator/cagr-xirr-calculator" emoji="📏" title="CAGR & XIRR" description="CAGR for lumpsum, XIRR for multiple flows." />
            </div>
          </div>

          {/* Loans */}
          <div>
            <SectionHeader label="🏠 Loans & Deposits" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/calculator/emi-calculator" emoji="🏠" title="EMI Calculator" description="Home, personal, car & education loan EMIs." />
              <DirectoryCard href="/calculator/fd-calculator" emoji="🏧" title="Fixed Deposit" description="FD maturity at any compounding frequency." />
              <DirectoryCard href="/calculator/rd-calculator" emoji="📆" title="Recurring Deposit" description="RD maturity from monthly deposits." />
              <DirectoryCard href="/calculator/compound-interest-calculator" emoji="♾️" title="Compound Interest" description="CI with flexible compounding." />
              <DirectoryCard href="/calculator/simple-interest-calculator" emoji="➗" title="Simple Interest" description="Straightforward P × R × T calculation." />
            </div>
          </div>

          {/* Tools */}
          <div>
            <SectionHeader label="🛠️ Free Tools" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DirectoryCard href="/tools/discount-calculator" emoji="🏷️" title="Discount Calculator" description="Sale price after % or flat discount." />
              <DirectoryCard href="/tools/percentage-calculator" emoji="📊" title="Percentage Calculator" description="% of, increase, decrease, change — 5 modes." />
              <DirectoryCard href="/tools/average-calculator" emoji="➗" title="Average Calculator" description="Mean, median, mode, std dev." />
              <DirectoryCard href="/tools/number-converter" emoji="🔢" title="Number Converter" description="12333232 → 1 Crore, 23 Lakh, 33 Thousand, 232." />
              <DirectoryCard href="/tools/character-counter" emoji="🔡" title="Character Counter" description="Count characters, letters, digits, spaces." />
              <DirectoryCard href="/tools/word-counter" emoji="📝" title="Word Counter" description="Words, sentences, reading time & top words." />
              <DirectoryCard href="/tools/text-case-converter" emoji="🔤" title="Text Case Converter" description="Title, Sentence, camelCase, snake_case & more." />
            </div>
          </div>
        </div>
      </section>

      {/* ── Why CTC ≠ In-Hand ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-2xl border border-rule bg-surface px-6 py-7 sm:px-8">
          <h2 className="font-display text-xl font-semibold text-ink">Why Your CTC Is Not Your Take-Home Pay</h2>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            When a company quotes a salary in LPA, that figure is your CTC (Cost to Company) — the total the company spends on you in a year, not what reaches your bank account. CTC bundles fixed pay, the employer&apos;s PF contribution, and gratuity reserves — none of which you receive as monthly cash. From your actual gross, your own PF, professional tax, and income tax are deducted before the rest lands in your account.
          </p>
          <Link href="/salary" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline underline-offset-2">
            See the full breakdown for your salary <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <h2 className="font-display text-xl font-semibold text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-4">
          {faqs.map((faq) => (
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <h3 className="flex items-center gap-3 text-sm font-bold text-ink mb-3">
      {label}
      <span className="h-px flex-1 bg-rule" />
    </h3>
  );
}

function DirectoryCard({ href, emoji, title, description, featured }: {
  href: string; emoji: string; title: string; description: string; featured?: boolean;
}) {
  return (
    <Link href={href}
      className={`group flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg
        ${featured
          ? "border-deduction/25 bg-deduction/5 hover:border-deduction/50"
          : "border-rule bg-surface hover:border-brand"
        }`}>
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
