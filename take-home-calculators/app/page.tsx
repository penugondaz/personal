import type { Metadata } from "next";
import Link from "next/link";
import { salarySlug } from "@/lib/salary-data";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { formatINR } from "@/lib/format";
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

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-xl text-ink">Quick Pick — Common CTC Slabs</h2>
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

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-xl text-ink">Why Your In-Hand Pay Is Lower Than Your CTC</h2>
        <p className="mt-3 text-ink-soft">
          When a company quotes a salary in LPA, that figure is almost always your CTC (Cost to Company) — the total amount the company spends on you in a year, not what reaches your bank account every month. CTC bundles together your fixed pay, the employer&apos;s own PF contribution, and gratuity reserved for if you stay 5+ years — none of which you receive as monthly cash.
        </p>
        <p className="mt-3 text-ink-soft">
          From your actual cash salary, your own PF contribution, professional tax (in states that levy it), and income tax are deducted before the rest lands in your account. These calculators walk through that full chain — CTC → gross salary → deductions → in-hand pay — using the actual FY 2025-26 tax slabs and PF rules, so you can see where every rupee goes.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-display text-xl text-ink">All Calculators</h2>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">Salary</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <DirectoryCard href="/salary" title="In-Hand Salary" description="Full CTC → take-home breakdown for any salary." />
          <DirectoryCard href="/salary/inhand-to-ctc-calculator" title="In-Hand to CTC" description="Reverse: find CTC from your desired take-home." />
          <DirectoryCard href="/salary/salary-structure-calculator" title="Salary Structure" description="Custom basic/HRA percentages → breakup." />
          <DirectoryCard href="/calculator/salary-hike-calculator" title="Salary Hike" description="What a CTC hike means for your real take-home." />
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">Retirement & Savings</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <DirectoryCard href="/calculator/epf-calculator" title="EPF & VPF" description="Monthly PF contribution and long-term maturity." />
          <DirectoryCard href="/calculator/ppf-calculator" title="PPF" description="Year-by-year PPF growth at 7.1% interest." />
          <DirectoryCard href="/calculator/nps-calculator" title="NPS" description="Retirement corpus and estimated monthly pension." />
          <DirectoryCard href="/calculator/gratuity-calculator" title="Gratuity" description="Lump-sum payout after 5+ years of service." />
          <DirectoryCard href="/calculator/epf-vs-ppf" title="EPF vs PPF" description="Side-by-side comparison of both retirement options." />
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">Tax & Pay Components</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <DirectoryCard href="/calculator/hra-calculator" title="HRA Exemption" description="How much of your HRA is actually tax-free." />
          <DirectoryCard href="/calculator/advance-tax-calculator" title="Advance Tax" description="Quarterly installment schedule for advance tax." />
          <DirectoryCard href="/calculator/capital-gains-calculator" title="Capital Gains" description="STCG & LTCG tax on equity, debt, and other assets." />
          <DirectoryCard href="/calculator/old-vs-new-tax-regime" title="Old vs New Regime" description="Which tax regime saves you more." />
          <DirectoryCard href="/calculator/leave-encashment-calculator" title="Leave Encashment" description="Encashment amount and tax exemption." />
          <DirectoryCard href="/calculator/overtime-calculator" title="Overtime Pay" description="Overtime earnings at 1.5x, 2x, or custom rates." />
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-soft">Investments</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <DirectoryCard href="/calculator/sip-calculator" title="SIP Calculator" description="Project your mutual fund SIP + lumpsum growth." />
          <DirectoryCard href="/calculator/lumpsum-calculator" title="Lumpsum Calculator" description="One-time investment returns over time." />
          <DirectoryCard href="/calculator/mutual-fund-calculator" title="Mutual Fund" description="Combined SIP + lumpsum mutual fund returns." />
          <DirectoryCard href="/calculator/swp-calculator" title="SWP Calculator" description="Systematic withdrawal plan from your corpus." />
          <DirectoryCard href="/calculator/goal-planning-calculator" title="Goal Planning" description="SIP needed to reach your financial goal." />
          <DirectoryCard href="/calculator/stock-average-calculator" title="Stock Average" description="Weighted average share price across purchases." />
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
