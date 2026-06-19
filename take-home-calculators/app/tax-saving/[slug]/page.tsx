// take-home-calculators/app/tax-saving/[slug]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TAX_SAVING_LPA_VALUES, taxSavingSlug, parseTaxSavingSlug } from "@/lib/tax-saving-data";
import { calculateTaxSaving } from "@/lib/calculators/tax-saving";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

export function generateStaticParams() {
  return TAX_SAVING_LPA_VALUES.map((lpa) => ({ slug: taxSavingSlug(lpa) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lpa = parseTaxSavingSlug(slug);
  if (lpa === null) return {};

  const title = `Tax Saving for ${lpa} LPA — How to Pay Zero or Less Tax (FY 2025-26)`;
  const description = `Complete tax-saving guide for ${lpa} LPA salary in India. See your current tax, all deductions under 80C, NPS, health insurance, HRA, and how much you can legally save in FY 2025-26.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/tax-saving/${taxSavingSlug(lpa)}`) },
    openGraph: { title, description, url: absoluteUrl(`/tax-saving/${taxSavingSlug(lpa)}`) },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "80C": "bg-brand-soft text-brand",
  NPS: "bg-accent-soft text-accent",
  Health: "bg-green-50 text-green-700",
  HRA: "bg-blue-50 text-blue-700",
  Home: "bg-purple-50 text-purple-700",
  Other: "bg-paper text-ink-soft",
};

const CATEGORY_ICONS: Record<string, string> = {
  "80C": "📊",
  NPS: "🏛️",
  Health: "🏥",
  HRA: "🏠",
  Home: "🔑",
  Other: "📋",
};

export default async function TaxSavingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lpa = parseTaxSavingSlug(slug);
  if (lpa === null) notFound();

  const annualCtc = Math.round(lpa * 100_000);
  const data = calculateTaxSaving(annualCtc);

  const nearbyLpas = TAX_SAVING_LPA_VALUES.filter(
    (v) => Math.abs(v - lpa) > 0 && Math.abs(v - lpa) <= 3
  ).slice(0, 6);

  const actionableOpportunities = data.opportunities.filter(
    (o) => o.maxAmount > 0 && o.taxSaved > 0
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much tax do I pay on ${lpa} LPA salary?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `On a ${lpa} LPA CTC, your gross salary is approximately ${formatINR(data.grossSalary)}/year. Under the new tax regime, the income tax payable is ${formatINR(data.currentTaxNew)} (effective rate ${data.effectiveTaxRateNew}%). Under the old tax regime without deductions, it is ${formatINR(data.currentTaxOld)}.`,
        },
      },
      {
        "@type": "Question",
        name: `How much tax can I save on ${lpa} LPA?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `By claiming 80C investments (₹1.5L), NPS (₹50,000), and health insurance (₹25,000) under the old regime, you can save up to ${formatINR(data.maxPossibleSavingOld)} in taxes on a ${lpa} LPA salary, bringing your tax down to ${formatINR(data.taxAfterAllDeductionsOld)}.`,
        },
      },
      {
        "@type": "Question",
        name: `Which tax regime is better for ${lpa} LPA?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `For ${lpa} LPA, the ${data.betterRegime} tax regime is better when no deductions are considered. However, if you have significant 80C investments, HRA, or home loan interest, the old regime may work out cheaper — always compare both.`,
        },
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/tax-saving" className="hover:text-brand">Tax Saving</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{lpa} LPA</span>
      </nav>

      {/* Hero */}
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Tax Saving on {lpa} LPA Salary
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Your gross salary is <strong className="text-ink">{formatINRCompact(data.grossSalary)}/year</strong>.
        You currently pay <strong className="text-deduction">{formatINR(data.currentTaxNew)}</strong> in
        income tax under the new regime. Here's how to legally reduce that.
      </p>

      {/* Tax snapshot */}
      <section className="mt-8">
        <div className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
          <div className="brand-gradient px-6 py-7 sm:px-8">
            <p className="text-xs font-medium uppercase tracking-wide text-white/70">
              Maximum Tax You Can Save (Old Regime)
            </p>
            <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
              {formatINR(data.maxPossibleSavingOld)}
            </div>
            <p className="mt-1 text-sm text-white/70">
              Tax drops from {formatINR(data.currentTaxOld)} → {formatINR(data.taxAfterAllDeductionsOld)} with full deductions
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-rule px-6 py-5 sm:px-8">
            <div className="pr-4">
              <p className="text-xs text-ink-soft">New Regime Tax</p>
              <p className="tabular mt-1 font-display text-lg font-semibold text-ink">
                {formatINR(data.currentTaxNew)}
              </p>
              <p className="mt-0.5 text-xs text-ink-soft">{data.effectiveTaxRateNew}% effective</p>
            </div>
            <div className="px-4">
              <p className="text-xs text-ink-soft">Old Regime (no deductions)</p>
              <p className="tabular mt-1 font-display text-lg font-semibold text-ink">
                {formatINR(data.currentTaxOld)}
              </p>
              <p className="mt-0.5 text-xs text-ink-soft">Before any deductions</p>
            </div>
            <div className="pl-4">
              <p className="text-xs text-ink-soft">Old Regime (max deductions)</p>
              <p className="tabular mt-1 font-display text-lg font-semibold text-brand">
                {formatINR(data.taxAfterAllDeductionsOld)}
              </p>
              <p className="mt-0.5 text-xs text-ink-soft">{data.effectiveTaxRateAfterSaving}% effective</p>
            </div>
          </div>
        </div>

        {data.betterRegime === "new" && data.maxPossibleSavingOld < 1000 && (
          <p className="mt-3 rounded-lg bg-brand-soft px-4 py-3 text-sm text-brand">
            💡 At {lpa} LPA, the new regime already gives you a lower tax with no paperwork needed.
            The old regime makes sense only if you have large deductions like HRA + 80C + home loan.
          </p>
        )}
      </section>

      {/* Tax saving opportunities */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Tax-Saving Opportunities</h2>
        <p className="mt-3 text-ink-soft">
          The following deductions and exemptions are available under the{" "}
          <strong className="text-ink">old tax regime</strong>. The new regime does not allow most of these,
          but offers lower slab rates in return.
        </p>

        <div className="mt-6 space-y-4">
          {data.opportunities.map((opp) => (
            <div
              key={opp.section}
              className="rounded-xl border border-rule bg-surface p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base">{CATEGORY_ICONS[opp.category]}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[opp.category]}`}
                    >
                      Sec. {opp.section}
                    </span>
                    <h3 className="font-medium text-ink">{opp.name}</h3>
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">{opp.description}</p>
                </div>
                {opp.maxAmount > 0 && (
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-ink-soft">Max deduction</p>
                    <p className="tabular mt-0.5 font-display text-base font-semibold text-ink">
                      {formatINR(opp.maxAmount)}
                    </p>
                    {opp.taxSaved > 0 && (
                      <p className="tabular mt-0.5 text-xs font-medium text-brand">
                        Saves ~{formatINR(opp.taxSaved)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary deduction table */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Combined Deduction Summary</h2>
        <p className="mt-3 text-ink-soft">
          Stacking the most common deductions reduces your taxable income significantly.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft">Deduction</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">Max Amount</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">Tax Saved ~</th>
              </tr>
            </thead>
            <tbody>
              {actionableOpportunities.map((opp) => (
                <tr key={opp.section} className="border-b border-rule last:border-0">
                  <td className="px-4 py-2.5">
                    <span className="font-medium text-ink">Sec. {opp.section}</span>
                    <span className="ml-2 text-ink-soft">{opp.name.split("(")[0].trim()}</span>
                  </td>
                  <td className="tabular px-4 py-2.5 text-right text-ink">
                    {formatINR(opp.maxAmount)}
                  </td>
                  <td className="tabular px-4 py-2.5 text-right font-medium text-brand">
                    ~{formatINR(opp.taxSaved)}
                  </td>
                </tr>
              ))}
              <tr className="bg-brand-soft">
                <td className="px-4 py-2.5 font-semibold text-brand">
                  Total (top 3 deductions)
                </td>
                <td className="tabular px-4 py-2.5 text-right font-semibold text-brand">
                  {formatINR(data.totalMaxDeductions)}
                </td>
                <td className="tabular px-4 py-2.5 text-right font-semibold text-brand">
                  ~{formatINR(data.maxPossibleSavingOld)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Tax saved is approximate, based on your marginal slab rate including 4% health &amp; education cess.
          Actual savings depend on your total income and applicable slabs.
        </p>
      </section>

      {/* Regime comparison */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Should You Switch to the Old Regime?</h2>
        <p className="mt-3 text-ink-soft">
          For {lpa} LPA, the decision depends on how many deductions you can actually claim.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-rule bg-surface p-5">
            <p className="font-semibold text-brand">✅ Choose Old Regime if you have…</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>• Full ₹1.5L invested under 80C (ELSS, PPF, etc.)</li>
              <li>• ₹50,000 NPS contribution (80CCD-1B)</li>
              <li>• Significant HRA exemption (paying high rent)</li>
              <li>• Home loan interest ≥ ₹1.5–2 lakh/year</li>
              <li>• Health insurance for self and parents</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rule bg-surface p-5">
            <p className="font-semibold text-brand">✅ Choose New Regime if you…</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>• Have few or no 80C investments</li>
              <li>• Don't pay rent (live in own home or with parents)</li>
              <li>• Have no home loan</li>
              <li>• Prefer simplicity — no documents needed</li>
              <li>• Your employer's NPS contribution covers 80CCD(2)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          <FaqItem
            question={`How much tax do I pay on ${lpa} LPA?`}
            answer={`Under the new tax regime, you pay approximately ${formatINR(data.currentTaxNew)}/year (${data.effectiveTaxRateNew}% effective rate) on a gross salary of ${formatINRCompact(data.grossSalary)}. Under the old regime without deductions, it's ${formatINR(data.currentTaxOld)}.`}
          />
          <FaqItem
            question={`Can I bring my tax to zero on ${lpa} LPA?`}
            answer={
              lpa <= 7
                ? `Yes — under the new regime, incomes up to a taxable income of ₹12 lakh get a full rebate under Section 87A (FY 2025-26), meaning zero tax. Your effective tax under the new regime is already ${formatINR(data.currentTaxNew)}.`
                : `At ${lpa} LPA, you cannot legally bring your tax to zero, but you can significantly reduce it. By claiming all eligible deductions under the old regime, your tax can come down to approximately ${formatINR(data.taxAfterAllDeductionsOld)}.`
            }
          />
          <FaqItem
            question="Is 80C investment compulsory to save tax?"
            answer="No, but it's the easiest and most popular route. You can also save tax through NPS (80CCD-1B), health insurance (80D), HRA exemption, home loan interest (Section 24b), and education loan interest (80E) — without any 80C investments at all."
          />
          <FaqItem
            question="Does employer NPS contribution save tax under new regime?"
            answer="Yes — Section 80CCD(2) deduction for employer NPS contribution (up to 10% of basic salary) is available under the new regime too. This is one of the few tax-saving options that works under both regimes."
          />
        </div>
      </section>

      {/* Related tools */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li>
            <Link
              href={`/salary/${lpa}-lpa-in-hand`}
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              {lpa} LPA In-Hand Salary
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
              href="/calculator/hra-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
            >
              HRA Calculator
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
        </ul>
      </section>

      {/* Nearby LPAs */}
      {nearbyLpas.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink">Other LPA Tax Saving Guides</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {nearbyLpas.map((nearLpa) => (
              <li key={nearLpa}>
                <Link
                  href={`/tax-saving/${taxSavingSlug(nearLpa)}`}
                  className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
                >
                  {nearLpa} LPA Tax Saving
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
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
