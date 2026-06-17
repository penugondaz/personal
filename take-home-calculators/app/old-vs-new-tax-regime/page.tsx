import type { Metadata } from "next";
import Link from "next/link";
import OldVsNewRegimeCalculator from "@/components/OldVsNewRegimeCalculator";
import { STANDARD_DEDUCTION, SECTION_87A, NEW_REGIME_SLABS, OLD_REGIME_SLABS } from "@/lib/calculators/income-tax";
import { formatINR } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

const title = "Old vs New Tax Regime — Which Should You Choose? (FY 2025-26)";
const description =
  "Compare the old and new income tax regimes side by side for FY 2025-26 — slab rates, standard deduction, rebate thresholds, and which one results in lower tax for your income.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/old-vs-new-tax-regime") },
  openGraph: { title, description, url: absoluteUrl("/old-vs-new-tax-regime") },
};

export default function OldVsNewRegimePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Old vs New Tax Regime</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Old vs New Tax Regime</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Since FY 2023-24, the new tax regime is the default. Here&apos;s exactly how the two
        compare, and a calculator to check which works out cheaper for your income.
      </p>

      <div className="mt-10">
        <OldVsNewRegimeCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Slab Rates Side by Side</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-medium text-brand">New Regime</h3>
            <ul className="mt-2 space-y-1 text-sm text-ink-soft">
              {NEW_REGIME_SLABS.map((slab) => (
                <li key={slab.from}>
                  {formatINR(slab.from)} – {slab.to ? formatINR(slab.to) : "above"}: {(slab.rate * 100).toFixed(0)}%
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-ink-soft">
              Standard deduction: {formatINR(STANDARD_DEDUCTION.new)} · Rebate up to{" "}
              {formatINR(SECTION_87A.new.threshold)} taxable income
            </p>
          </div>
          <div>
            <h3 className="font-medium text-brand">Old Regime</h3>
            <ul className="mt-2 space-y-1 text-sm text-ink-soft">
              {OLD_REGIME_SLABS.map((slab) => (
                <li key={slab.from}>
                  {formatINR(slab.from)} – {slab.to ? formatINR(slab.to) : "above"}: {(slab.rate * 100).toFixed(0)}%
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-ink-soft">
              Standard deduction: {formatINR(STANDARD_DEDUCTION.old)} · Rebate up to{" "}
              {formatINR(SECTION_87A.old.threshold)} taxable income
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">What the New Regime Gives Up</h2>
        <p className="mt-3 text-ink-soft">
          The new regime offers lower slab rates and a higher standard deduction, but in exchange
          you lose almost every deduction and exemption available under the old regime — HRA
          exemption, Section 80C investments (PPF, ELSS, life insurance premiums), home loan
          interest deduction, and most others. If your old-regime deductions are large enough,
          the old regime can still work out cheaper despite its higher slab rates, which is why
          this isn't a one-size-fits-all decision.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Who Tends to Benefit From Each</h2>
        <p className="mt-3 text-ink-soft">
          The new regime tends to suit people with few deductions to claim — for example, those
          without a home loan, who don't pay significant rent, or who haven't invested heavily in
          80C instruments. The old regime tends to suit people who can stack multiple deductions:
          HRA exemption plus 80C investments plus home loan interest can add up to a large enough
          reduction in taxable income to outweigh the new regime's lower slab rates.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li>
            <Link href="/salary" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              In-Hand Salary Calculator
            </Link>
          </li>
          <li>
            <Link href="/hra-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              HRA Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
