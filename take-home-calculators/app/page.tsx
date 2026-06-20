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

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

const POPULAR_LPAS = [5, 6, 8, 10, 12, 15, 20, 25];

const faqs = [
  {
    question: "How accurate is this calculator?",
    answer:
      "It models the most common salary structure used by Indian private-sector employers (basic ~40% of CTC, HRA ~50% of basic, statutory PF and tax rules for FY 2025-26), but every employer structures CTC slightly differently. Use it as a close estimate, not an exact figure from your specific offer letter.",
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

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft via-paper to-paper" />
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-surface px-3 py-1 text-xs font-medium text-brand">
            FY 2025-26 tax rules · Updated June 2026
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold text-ink sm:text-5xl">Salary Tools</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft sm:text-lg">
            Salary, CTC, income tax, EPF, and investment calculators for India. See exactly what lands in your bank account, not just what your offer letter says.
          </p>
          <Link href="/salary" className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-card-lg transition hover:opacity-90">
            Calculate your in-hand salary <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* Quick pick — in-hand salary */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-xl text-ink">Quick Pick — In-Hand Salary by CTC</h2>
        <p className="mt-2 text-sm text-ink-soft">Jump straight to a full breakdown for one of the most-searched CTC values.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {POPULAR_LPAS.map((lpa) => {
            const result = calculateSalaryBreakup({ annualCtc: lpa * 100_000, regime: "new" });
            return (
              <Link key={lpa} href={`/salary/${salarySlug(lpa)}`} className="block rounded-xl border border-rule bg-surface px-4 py-3.5 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg">
                <span className="font-display text-lg text-ink">{lpa} LPA</span>
                <p className="tabular mt-1 text-xs text-ink-soft">{formatINR(result.inHandMonthly)}/mo in-hand</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tax saving quick pick */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-xl text-ink">Tax Saving — How Much Can You Save?</h2>
        <p className="mt-2 text-sm text-ink-soft">See your current tax bill and how much you can legally reduce it with 80C, NPS, HRA, and more.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {POPULAR_LPAS.map((lpa) => {
            const data = calculateTaxSaving(lpa * 100_000);
            return (
              <Link key={lpa} href={`/tax-saving/${taxSavingSlug(lpa)}`} className="block rounded-xl border border-rule bg-surface px-4 py-3.5 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg">
                <span className="font-display text-lg text-ink">{lpa} LPA</span>
                <p className="tabular mt-1 text-xs text-deduction">Tax: {formatINR(data.currentTaxNew)}</p>
                <p className="tabular text-xs text-brand">Save: {formatINR(data.maxPossibleSavingOld)}</p>
              </Link>
            );
          })}
        </div>
        <p className="mt-3">
          <Link href="/tax-saving" className="text-sm font-medium text-brand hover:underline underline-offset-2">
            View all tax saving guides →
          </Link>
        </p>
      </section>

      {/* Salary growth quick pick */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-xl text-ink">Salary Growth — Where Will You Be in 10 Years?</h2>
        <p className="mt-2 text-sm text-ink-soft">Project your salary at 8%, 12%, 18%, and 25% annual hike rates.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {POPULAR_LPAS.map((lpa) => {
            const data = calculateSalaryGrowth(lpa * 100_000);
            const avg = data.scenarios[1]; // 12% scenario
            return (
              <Link key={lpa} href={`/salary-growth/${salaryGrowthSlug(lpa)}`} className="block rounded-xl border border-rule bg-surface px-4 py-3.5 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg">
                <span className="font-display text-lg text-ink">{lpa} LPA</span>
                <p className="tabular mt-1 text-xs text-ink-soft">5yr: {formatINRCompact(avg.ctcAt5Years)}</p>
                <p className="tabular text-xs text-brand">10yr: {formatINRCompact(avg.ctcAt10Years)}</p>
              </Link>
            );
          })}
        </div>
        <p className="mt-3">
          <Link href="/salary-growth" className="text-sm font-medium text-brand hover:underline underline-offset-2">
            View all salary growth projections →
          </Link>
        </p>
      </section>


      {/* Layoff Risk Calculator widget */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="overflow-hidden rounded-2xl border border-deduction/30 bg-surface shadow-card-lg">
          <div className="bg-deduction px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-display text-lg font-semibold text-white">Layoff Risk Calculator</p>
                <p className="text-sm text-white/80">Know your risk score before layoffs happen</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5 sm:px-8">
            <p className="text-sm text-ink-soft">
              Get a personalised Layoff Risk Score (0–100) based on your company health, department,
              performance, AI automation exposure, and industry outlook.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              {[
                { icon: "🏢", label: "Company health" },
                { icon: "👥", label: "Dept risk" },
                { icon: "🤖", label: "AI risk for your role" },
                { icon: "🎯", label: "Your profile" },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-1.5 rounded-lg bg-paper px-2.5 py-2">
                  <span>{f.icon}</span><span className="text-ink-soft">{f.label}</span>
                </div>
              ))}
            </div>
            <Link
              href="/calculator/layoff-risk-calculator"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-deduction px-5 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              Calculate My Layoff Risk →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-xl text-ink">Why Your In-Hand Pay Is Lower Than Your CTC</h2>
        <p className="mt-3 text-ink-soft">
          When a company quotes a salary in LPA, that figure is almost always your CTC (Cost to Company) — the total amount the company spends on you in a year, not what reaches your bank account every month. CTC bundles together your fixed pay, the employer&apos;s own PF contribution, and gratuity reserved for if you stay 5+ years — none of which you receive as monthly cash.
        </p>
        <p className="mt-3 text-ink-soft">
          From your actual cash salary, your own PF contribution, professional tax (in states that levy it), and income tax are deducted before the rest lands in your account. These calculators walk through that full chain — CTC → gross salary → deductions → in-hand pay — using the actual FY 2025-26 tax slabs and PF rules, so you can see where every rupee goes.
        </p>
      </section>


      {/* Tools quick pick */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-xl text-ink">Free Tools</h2>
        <p className="mt-2 text-sm text-ink-soft">Discount calculator, number converter, word counter, text case converter and more — all free, all in-browser.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: "/tools/discount-calculator", icon: "🏷️", label: "Discount" },
            { href: "/tools/number-converter", icon: "🔢", label: "Number Converter" },
            { href: "/tools/word-counter", icon: "📝", label: "Word Counter" },
            { href: "/tools/text-case-converter", icon: "🔤", label: "Case Converter" },
            { href: "/tools/percentage-calculator", icon: "📊", label: "Percentage" },
            { href: "/tools/average-calculator", icon: "➗", label: "Average" },
            { href: "/tools/character-counter", icon: "🔡", label: "Char Counter" },
            { href: "/tools", icon: "🛠️", label: "All Tools →" },
          ].map((t) => (
            <Link key={t.href} href={t.href} className="flex items-center gap-2 rounded-xl border border-rule bg-surface px-4 py-3.5 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg">
              <span className="text-xl">{t.icon}</span>
              <span className="text-sm font-medium text-ink">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-xl text-ink">All Calculators</h2>


        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">Tracker & Risk</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <DirectoryCard href="/layoffs" title="Layoffs Tracker 🔴" description="Real-time India tech layoffs — company, headcount, date, source." />
          <DirectoryCard href="/calculator/layoff-risk-calculator" title="Layoff Risk Calculator" description="Your personal layoff risk score (0–100) based on 13 signals." />
        </div>

                <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">Salary</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <DirectoryCard href="/salary" title="In-Hand Salary" description="Full CTC → take-home breakdown for any salary." />
          <DirectoryCard href="/salary/inhand-to-ctc-calculator" title="In-Hand to CTC" description="Reverse: find CTC from your desired take-home." />
          <DirectoryCard href="/salary/salary-structure-calculator" title="Salary Structure" description="Custom basic/HRA percentages → breakup." />
          <DirectoryCard href="/calculator/salary-hike-calculator" title="Salary Hike" description="What a CTC hike means for your real take-home." />
          <DirectoryCard href="/salary-growth" title="Salary Growth" description="Project your salary in 5 & 10 years at different hike rates." />
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">Tax Saving</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <DirectoryCard href="/tax-saving" title="Tax Saving Guide" description="80C, NPS, HRA, home loan — all deductions by salary." />
          <DirectoryCard href="/calculator/old-vs-new-tax-regime" title="Old vs New Regime" description="Which tax regime saves you more." />
          <DirectoryCard href="/calculator/hra-calculator" title="HRA Exemption" description="How much of your HRA is actually tax-free." />
          <DirectoryCard href="/calculator/advance-tax-calculator" title="Advance Tax" description="Quarterly installment schedule for advance tax." />
          <DirectoryCard href="/calculator/capital-gains-calculator" title="Capital Gains" description="STCG & LTCG tax on equity, debt, and other assets." />
          <DirectoryCard href="/calculator/leave-encashment-calculator" title="Leave Encashment" description="Encashment amount and tax exemption." />
          <DirectoryCard href="/calculator/overtime-calculator" title="Overtime Pay" description="Overtime earnings at 1.5x, 2x, or custom rates." />
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">Retirement & Savings</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <DirectoryCard href="/calculator/epf-calculator" title="EPF & VPF" description="Monthly PF contribution and long-term maturity." />
          <DirectoryCard href="/calculator/ppf-calculator" title="PPF" description="Year-by-year PPF growth at 7.1% interest." />
          <DirectoryCard href="/calculator/nps-calculator" title="NPS" description="Retirement corpus and estimated monthly pension." />
          <DirectoryCard href="/calculator/gratuity-calculator" title="Gratuity" description="Lump-sum payout after 5+ years of service." />
          <DirectoryCard href="/calculator/epf-vs-ppf" title="EPF vs PPF" description="Side-by-side comparison of both retirement options." />
          <DirectoryCard href="/calculator/nsc-calculator" title="NSC Calculator" description="National Savings Certificate maturity at 7.7%." />
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">Investments</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <DirectoryCard href="/calculator/sip-calculator" title="SIP Calculator" description="Project your mutual fund SIP + lumpsum growth." />
          <DirectoryCard href="/calculator/step-up-sip-calculator" title="Step-Up SIP" description="SIP with annual increase — more realistic returns." />
          <DirectoryCard href="/calculator/lumpsum-calculator" title="Lumpsum Calculator" description="One-time investment returns over time." />
          <DirectoryCard href="/calculator/mutual-fund-calculator" title="Mutual Fund" description="Combined SIP + lumpsum mutual fund returns." />
          <DirectoryCard href="/calculator/swp-calculator" title="SWP Calculator" description="Systematic withdrawal plan from your corpus." />
          <DirectoryCard href="/calculator/swp-inflation-calculator" title="SWP with Inflation" description="Withdrawal plan with inflation-adjusted payouts." />
          <DirectoryCard href="/calculator/goal-planning-calculator" title="Goal Planning" description="SIP needed to reach your financial goal." />
          <DirectoryCard href="/calculator/xirr-calculator" title="XIRR Calculator" description="Annualized returns for irregular cash flows." />
          <DirectoryCard href="/calculator/cagr-xirr-calculator" title="CAGR & XIRR" description="CAGR for lumpsum, XIRR for multiple flows." />
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">Loans & Deposits</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <DirectoryCard href="/calculator/emi-calculator" title="EMI Calculator" description="Home, personal, car & education loan EMIs." />
          <DirectoryCard href="/calculator/fd-calculator" title="Fixed Deposit" description="FD maturity value at any compounding frequency." />
          <DirectoryCard href="/calculator/rd-calculator" title="Recurring Deposit" description="RD maturity from monthly deposits." />
          <DirectoryCard href="/calculator/compound-interest-calculator" title="Compound Interest" description="CI with flexible compounding and additions." />
          <DirectoryCard href="/calculator/simple-interest-calculator" title="Simple Interest" description="Straightforward P × R × T calculation." />
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">Free Tools</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <DirectoryCard href="/tools/discount-calculator" title="Discount Calculator" description="Sale price after % or flat discount." />
          <DirectoryCard href="/tools/percentage-calculator" title="Percentage Calculator" description="% of, increase, decrease, change — 5 modes." />
          <DirectoryCard href="/tools/average-calculator" title="Average Calculator" description="Mean, median, mode, std dev for any numbers." />
          <DirectoryCard href="/tools/number-converter" title="Number Converter" description="12333232 → 1 Crore, 23 Lakh, 33 Thousand, 232." />
          <DirectoryCard href="/tools/character-counter" title="Character Counter" description="Count characters, letters, digits, spaces." />
          <DirectoryCard href="/tools/word-counter" title="Word Counter" description="Words, sentences, reading time & top words." />
          <DirectoryCard href="/tools/text-case-converter" title="Text Case Converter" description="Title, Sentence, camelCase, snake_case & more." />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-rule pb-4">
              <h3 className="font-medium text-ink">{faq.question}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function DirectoryCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-rule bg-surface px-5 py-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg">
      <span className="font-medium text-brand">{title}</span>
      <p className="mt-1 text-sm text-ink-soft">{description}</p>
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
