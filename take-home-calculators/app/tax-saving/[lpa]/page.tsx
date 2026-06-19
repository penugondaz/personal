// take-home-calculators/app/tax-saving/[lpa]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TaxSavingCalculator from "@/components/TaxSavingCalculator";
import {
  TAX_SAVING_LPA_VALUES,
  taxSavingSlug,
  parseTaxSavingSlug,
  calculateTaxSaving,
} from "@/lib/calculators/tax-saving";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

export function generateStaticParams() {
  return TAX_SAVING_LPA_VALUES.map((lpa) => ({ lpa: taxSavingSlug(lpa) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lpa: string }>;
}): Promise<Metadata> {
  const { lpa: slug } = await params;
  const lpa = parseTaxSavingSlug(slug);
  if (lpa === null) return {};

  const annualCtc = lpa * 100_000;
  const result = calculateTaxSaving({ annualCtc });

  const title = `Tax Saving on ${lpa} LPA — How to Save Tax on ₹${lpa} Lakh Salary (FY 2025-26)`;
  const description = `On a ${lpa} LPA CTC, you currently pay ${formatINR(result.currentTaxNew)} in tax (new regime). See how to save up to ${formatINR(result.maxPossibleSaving)} through 80C, NPS, health insurance, HRA, and home loan deductions.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/tax-saving/${slug}`) },
    openGraph: { title, description, url: absoluteUrl(`/tax-saving/${slug}`) },
  };
}

export default async function TaxSavingLpaPage({
  params,
}: {
  params: Promise<{ lpa: string }>;
}) {
  const { lpa: slug } = await params;
  const lpa = parseTaxSavingSlug(slug);
  if (lpa === null) notFound();

  const annualCtc = lpa * 100_000;
  const result = calculateTaxSaving({ annualCtc });
  const salaryBreakup = calculateSalaryBreakup({ annualCtc, regime: "new" });

  const nearbyLpas = TAX_SAVING_LPA_VALUES.filter(
    (v) => Math.abs(v - lpa) > 0 && Math.abs(v - lpa) <= 10
  ).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much tax do I pay on ${lpa} LPA?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `On a ${lpa} LPA CTC, your gross salary is approximately ${formatINR(result.grossSalaryAnnual)} per year. Under the new tax regime, the income tax payable is ${formatINR(result.currentTaxNew)} (effective rate ${result.effectiveTaxRateNew.toFixed(1)}%). Under the old regime without any deductions, tax is ${formatINR(result.currentTaxOld)}.`,
        },
      },
      {
        "@type": "Question",
        name: `How can I save tax on ${lpa} LPA salary?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `By switching to the old tax regime and claiming deductions — Section 80C investments up to ₹1.5 lakh, additional NPS contribution of ₹50,000 under 80CCD(1B), health insurance premiums under 80D, and HRA exemption if you pay rent — you can potentially save up to ${formatINR(result.maxPossibleSaving)} in taxes.`,
        },
      },
      {
        "@type": "Question",
        name: `Is old or new tax regime better for ${lpa} LPA?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `For ${lpa} LPA with no deductions, the ${result.currentTaxNew < result.currentTaxOld ? "new regime" : "old regime"} is better. However, if you can claim deductions exceeding ${formatINR(result.breakEvenDeductions)}, the old regime becomes advantageous. The break-even point depends on your actual investments and expenses.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the marginal tax rate on ${lpa} LPA?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `On ${lpa} LPA, the marginal (highest) tax slab rate under the new regime is ${result.marginalSlabNew}% and under the old regime is ${result.marginalSlabOld}%. This means every additional rupee earned in these slabs is taxed at these rates.`,
        },
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/tax-saving" className="hover:text-brand">Tax Saving</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{lpa} LPA</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Tax Saving on {lpa} LPA — FY 2025-26
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        On a CTC of{" "}
        <strong className="text-ink">{formatINRCompact(annualCtc)}</strong>, you
        currently pay{" "}
        <strong className="text-ink">{formatINR(result.currentTaxNew)}</strong> in
        income tax under the new regime. With the right deductions, you could save up
        to{" "}
        <strong className="text-brand">{formatINR(result.maxPossibleSaving)}</strong>.
      </p>

      <div className="mt-10">
        <TaxSavingCalculator initialAnnualCtc={annualCtc} />
      </div>

      {/* Quick Tax Snapshot */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">
          Your Tax Picture at {lpa} LPA
        </h2>
        <p className="mt-3 text-ink-soft">
          At a CTC of {formatINRCompact(annualCtc)}, your employer pays roughly{" "}
          {formatINR(result.grossSalaryAnnual)} as your gross salary (after
          subtracting employer PF and gratuity, which are part of CTC but not paid to
          you monthly). The new tax regime's ₹75,000 standard deduction applies
          automatically — no investment receipts needed.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Gross Salary"
            value={formatINR(result.grossSalaryAnnual)}
            sub="annual (excl. employer PF & gratuity)"
          />
          <StatCard
            label="Tax (New Regime)"
            value={formatINR(result.currentTaxNew)}
            sub={`${result.effectiveTaxRateNew.toFixed(1)}% effective rate`}
          />
          <StatCard
            label="Monthly In-Hand"
            value={formatINR(salaryBreakup.inHandMonthly)}
            sub="after PF + tax deductions"
          />
        </div>
      </section>

      {/* 80C Deep Dive */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Start With Section 80C — ₹1.5 Lakh Limit</h2>
        <p className="mt-3 text-ink-soft">
          Section 80C is the most widely used tax-saving provision, offering a
          deduction of up to ₹1,50,000 per year. At your income level, this alone can
          save you{" "}
          <strong className="text-ink">
            {formatINR(
              Math.round(
                150_000 *
                  (result.marginalSlabOld / 100) *
                  1.04
              )
            )}
          </strong>{" "}
          in taxes. The key instruments:
        </p>
        <ul className="mt-3 space-y-2 text-ink-soft">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-brand">✓</span>
            <span>
              <strong className="text-ink">ELSS Mutual Funds</strong> — Shortest
              3-year lock-in among 80C options, with market-linked returns. Historically
              the highest-returning 80C instrument over long periods.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-brand">✓</span>
            <span>
              <strong className="text-ink">PPF (Public Provident Fund)</strong> — 15-year
              lock-in, 7.1% tax-free returns, EEE treatment (tax-free at all three
              stages). Best for risk-averse, long-term savers.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-brand">✓</span>
            <span>
              <strong className="text-ink">EPF Employee Contribution</strong> — Already
              deducted from your salary every month, this counts toward 80C automatically.
              At {lpa} LPA with ~{formatINR(result.basicAnnual / 12)}/month basic, your
              annual EPF contribution is approximately{" "}
              {formatINR(Math.round(result.basicAnnual * 0.12))}.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-brand">✓</span>
            <span>
              <strong className="text-ink">Life Insurance Premium</strong> — Premiums
              paid for yourself, spouse, or children qualify. The policy sum assured
              should be at least 10× the annual premium for the tax benefit to apply
              without restrictions.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-brand">✓</span>
            <span>
              <strong className="text-ink">NSC, Tax-Saving FDs, Sukanya Samriddhi</strong> — Fixed-income
              options with guaranteed returns, useful for the portion of 80C not covered
              by EPF and insurance.
            </span>
          </li>
        </ul>
      </section>

      {/* NPS Section */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">
          NPS: Extra ₹50,000 Beyond 80C
        </h2>
        <p className="mt-3 text-ink-soft">
          Section 80CCD(1B) gives you a deduction of ₹50,000 specifically for NPS
          (National Pension System) contributions — and this is{" "}
          <strong className="text-ink">over and above</strong> the ₹1.5 lakh 80C
          limit. At your marginal rate of {result.marginalSlabOld}%, this saves you{" "}
          <strong className="text-ink">
            {formatINR(Math.round(50_000 * (result.marginalSlabOld / 100) * 1.04))}
          </strong>{" "}
          in additional tax. NPS funds are allocated across equity, corporate bonds,
          and government securities — historically earning 9-12% annually in
          equity-heavy schemes over the long term.
        </p>
      </section>

      {/* Health Insurance */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Health Insurance — Section 80D</h2>
        <p className="mt-3 text-ink-soft">
          Premiums paid for health insurance are deductible under Section 80D. You can
          claim up to ₹25,000 for yourself, spouse, and dependent children. If your
          parents are senior citizens (60+), you can claim an additional ₹50,000 for
          their health insurance — a total potential deduction of ₹75,000. Even
          without parents' insurance, the ₹25,000 for your own policy saves{" "}
          <strong className="text-ink">
            {formatINR(Math.round(25_000 * (result.marginalSlabOld / 100) * 1.04))}
          </strong>{" "}
          in tax at your income level.
        </p>
      </section>

      {/* HRA Section */}
      {result.hraAnnual > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink">
            HRA Exemption — If You Pay Rent
          </h2>
          <p className="mt-3 text-ink-soft">
            Your salary structure at {lpa} LPA likely includes an HRA component of
            approximately{" "}
            <strong className="text-ink">{formatINR(result.hraAnnual)}</strong> per
            year. If you pay rent, a portion of this is tax-exempt under Section
            10(13A) — the exemption is the lowest of: actual HRA received, 50% of
            basic (metro cities) or 40% (other cities), or rent paid minus 10% of
            basic. This can result in significant tax savings, especially in high-rent
            cities. The HRA exemption is only available under the old tax regime.
          </p>
        </section>
      )}

      {/* Home Loan */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Home Loan Deductions</h2>
        <p className="mt-3 text-ink-soft">
          If you have a home loan, you can claim deductions on both the principal
          repayment (under Section 80C, within the ₹1.5 lakh limit) and the interest
          paid (under Section 24(b), up to ₹2 lakh for a self-occupied property).
          First-time buyers of affordable housing (stamp duty value ≤ ₹45 lakh) can
          additionally claim ₹1.5 lakh under Section 80EEA. Combined, a home loan can
          contribute significantly to your old-regime deductions and potentially make
          the old regime the better choice.
        </p>
      </section>

      {/* Old vs New Decision */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">
          Which Regime Should You Choose at {lpa} LPA?
        </h2>
        <p className="mt-3 text-ink-soft">
          The new tax regime{" "}
          {result.currentTaxNew < result.currentTaxOld
            ? `saves you ${formatINR(result.currentTaxOld - result.currentTaxNew)} per year`
            : `costs you ${formatINR(result.currentTaxNew - result.currentTaxOld)} more`}{" "}
          compared to the old regime without any deductions. The break-even point —
          where the old regime becomes better — is when your deductions exceed{" "}
          <strong className="text-ink">
            {result.breakEvenDeductions > 0
              ? formatINR(result.breakEvenDeductions)
              : "₹0 (old regime already better)"}
          </strong>
          . If your 80C + NPS + health insurance + HRA + home loan deductions add up
          to more than this, you should opt for the old regime.
        </p>
        <div className="mt-4 rounded-lg border border-rule bg-surface p-4">
          <p className="text-sm font-medium text-ink">Quick decision rule for {lpa} LPA:</p>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
            <li>
              If you have no significant deductions →{" "}
              <strong className="text-brand">New regime</strong> (simpler and{" "}
              {result.currentTaxNew <= result.currentTaxOld ? "cheaper" : "comparable"})
            </li>
            <li>
              If you pay ₹80C + NPS + health insurance ={" "}
              {formatINR(150_000 + 50_000 + 25_000)} →{" "}
              <strong className="text-ink">
                {150_000 + 50_000 + 25_000 >= result.breakEvenDeductions && result.breakEvenDeductions > 0
                  ? "Old regime might be better"
                  : "Still likely new regime"}
              </strong>
            </li>
            <li>
              If you also pay rent or have a home loan →{" "}
              <strong className="text-brand">Old regime likely better</strong>
            </li>
          </ul>
        </div>
      </section>

      {/* FAQs */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          <FaqItem
            question={`How much tax will I pay on ${lpa} LPA in FY 2025-26?`}
            answer={`On ${lpa} LPA CTC, your gross salary is approximately ${formatINR(result.grossSalaryAnnual)} per year. Under the new tax regime (default), you pay ${formatINR(result.currentTaxNew)} in income tax — an effective rate of ${result.effectiveTaxRateNew.toFixed(1)}%. Under the old regime with only the standard deduction, the tax is ${formatINR(result.currentTaxOld)}.`}
          />
          <FaqItem
            question={`What is the maximum tax I can save on ${lpa} LPA?`}
            answer={`By switching to the old regime and claiming all available deductions — ₹1.5 lakh under 80C, ₹50,000 under 80CCD(1B) for NPS, ₹25,000–75,000 for health insurance, HRA exemption if you pay rent, and ₹2 lakh home loan interest if applicable — you can potentially pay as low as ${formatINR(result.taxAfterAllDeductions)} in tax, saving up to ${formatINR(result.maxPossibleSaving)} compared to the new regime.`}
          />
          <FaqItem
            question={`Is the new or old tax regime better for ${lpa} LPA?`}
            answer={`For ${lpa} LPA without any deductions, the ${result.currentTaxNew <= result.currentTaxOld ? "new regime" : "old regime"} is cheaper by ${formatINR(Math.abs(result.currentTaxNew - result.currentTaxOld))}. The old regime becomes better once your total deductions exceed ${formatINR(result.breakEvenDeductions)}. The key deductions that can tip the balance are 80C investments, NPS, HRA, and home loan interest.`}
          />
          <FaqItem
            question={`What is my marginal tax rate at ${lpa} LPA?`}
            answer={`At ${lpa} LPA, your marginal tax rate is ${result.marginalSlabNew}% under the new regime and ${result.marginalSlabOld}% under the old regime (before cess). This is the rate at which any additional income will be taxed. With 4% cess, the effective marginal rates are ${(result.marginalSlabNew * 1.04).toFixed(1)}% and ${(result.marginalSlabOld * 1.04).toFixed(1)}% respectively.`}
          />
        </div>
      </section>

      {/* Related pages */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li>
            <Link
              href="/salary"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              In-Hand Salary Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/calculator/old-vs-new-tax-regime"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              Old vs New Regime
            </Link>
          </li>
          <li>
            <Link
              href="/calculator/ppf-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              PPF Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/calculator/nps-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              NPS Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/calculator/epf-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              EPF & VPF Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/calculator/hra-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              HRA Calculator
            </Link>
          </li>
        </ul>
      </section>

      {/* Nearby LPAs */}
      {nearbyLpas.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink">Other Income Levels</h2>
          <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {nearbyLpas.map((nearLpa) => (
              <li key={nearLpa}>
                <Link
                  href={`/tax-saving/${taxSavingSlug(nearLpa)}`}
                  className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
                >
                  {nearLpa} LPA
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-rule bg-surface px-4 py-4 shadow-card">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="tabular mt-1 font-display text-xl font-semibold text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-ink-soft">{sub}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-rule pb-4">
      <h3 className="font-medium text-ink">{question}</h3>
      <p className="mt-1.5 text-sm text-ink-soft">{answer}</p>
    </div>
  );
}
