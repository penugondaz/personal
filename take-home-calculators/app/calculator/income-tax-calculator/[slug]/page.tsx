import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import IncomeTaxCalculator from "@/components/IncomeTaxCalculator";
import { INCOME_TAX_LPA_VALUES, incomeTaxSlug, parseIncomeTaxSlug } from "@/lib/income-tax-data";
import { calculateIncomeTax, compareRegimes, getCurrentFY } from "@/lib/calculators/income-tax";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { formatINR } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const { fyLabel, fy } = getCurrentFY();

export function generateStaticParams() {
  return INCOME_TAX_LPA_VALUES.map(lpa => ({ slug: incomeTaxSlug(lpa) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lpa = parseIncomeTaxSlug(slug);
  if (lpa === null) return {};

  const breakup = calculateSalaryBreakup({ annualCtc: lpa * 100_000, regime: "new" });
  const taxNew = calculateIncomeTax(breakup.grossSalaryAnnual, "new");

  const title = `Income Tax on ${lpa} LPA — ${fy} New vs Old Regime`;
  const description = `Income tax on ${lpa} LPA salary for ${fyLabel}. Under new regime: ${formatINR(taxNew.totalTaxPayable)}/year (${formatINR(taxNew.totalTaxPayable / 12)}/month). Full slab breakdown, deductions, old vs new regime comparison.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/calculator/income-tax-calculator/${slug}`) },
    openGraph: { title, description, url: absoluteUrl(`/calculator/income-tax-calculator/${slug}`) },
  };
}

export default async function IncomeTaxLpaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lpa = parseIncomeTaxSlug(slug);
  if (lpa === null) notFound();

  const annualCtc = lpa * 100_000;
  const breakup = calculateSalaryBreakup({ annualCtc, regime: "new" });
  const grossIncome = breakup.grossSalaryAnnual;
  const comparison = compareRegimes(grossIncome);

  const taxNew = comparison.new;
  const taxOld = comparison.old;
  const winner = comparison.betterRegime;

  const effectiveRateNew = ((taxNew.totalTaxPayable / grossIncome) * 100).toFixed(1);
  const relatedLpas = INCOME_TAX_LPA_VALUES.filter(v => Math.abs(v - lpa) > 0 && Math.abs(v - lpa) <= 5).slice(0, 5);

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Calculators", href: "/calculator" },
      { name: "Income Tax Calculator", href: "/calculator/income-tax-calculator" },
      { name: `${lpa} LPA Tax`, href: `/calculator/income-tax-calculator/${slug}` },
    ]),
    calculatorSchema({
      name: `Income Tax Calculator for ${lpa} LPA`,
      description: `Income tax on ${lpa} LPA salary for ${fyLabel}`,
      url: `/calculator/income-tax-calculator/${slug}`,
    }),
    faqSchema([
      {
        question: `How much income tax do I pay on ${lpa} LPA?`,
        answer: `On a ${lpa} LPA salary (gross income ~${formatINR(grossIncome)}), you pay ${formatINR(taxNew.totalTaxPayable)} income tax per year under the new regime for ${fyLabel}. That's ${formatINR(taxNew.totalTaxPayable / 12)} per month deducted as TDS.`,
      },
      {
        question: `Which tax regime is better for ${lpa} LPA?`,
        answer: `For ${lpa} LPA with no deductions, the ${winner === "new" ? "new" : "old"} tax regime saves you ${formatINR(comparison.savings)} per year. However if you claim 80C, HRA, and NPS deductions under the old regime, it may be better — add your deductions in the calculator above.`,
      },
      {
        question: `Is ${lpa} LPA taxable?`,
        answer: lpa <= 12.75
          ? `At ${lpa} LPA, your gross salary after the ₹75,000 standard deduction is within the ₹12 lakh 87A rebate limit under the new regime for ${fyLabel}. You pay zero income tax.`
          : `Yes, ${lpa} LPA is taxable. After the ₹75,000 standard deduction, your taxable income is ${formatINR(taxNew.taxableIncome)}. Tax payable is ${formatINR(taxNew.totalTaxPayable)} under the new regime.`,
      },
      {
        question: `What is the TDS deducted per month on ${lpa} LPA?`,
        answer: `Monthly TDS (Tax Deducted at Source) on ${lpa} LPA is ${formatINR(taxNew.totalTaxPayable / 12)} under the new regime. Your employer deducts this from your monthly salary and deposits it with the government on your behalf.`,
      },
    ]),
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/calculator/income-tax-calculator" className="hover:text-brand">Income Tax Calculator</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{lpa} LPA</span>
      </nav>

      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-surface px-3 py-1 text-xs font-medium text-brand">
        📅 {fyLabel}
      </div>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Income Tax on {lpa} LPA — {fy}
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        On a <strong className="text-ink">{lpa} LPA salary</strong> (gross ~{formatINR(grossIncome)}),
        you pay <strong className="text-brand">{formatINR(taxNew.totalTaxPayable)}/year</strong>{" "}
        ({formatINR(taxNew.totalTaxPayable / 12)}/month) income tax under the new regime for {fyLabel}.
        Effective tax rate: <strong className="text-ink">{effectiveRateNew}%</strong>.
      </p>

      {/* Quick summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "New Regime Tax", value: formatINR(taxNew.totalTaxPayable), icon: "💚", sub: `${effectiveRateNew}% effective` },
          { label: "Old Regime Tax", value: formatINR(taxOld.totalTaxPayable), icon: "🟠", sub: `${((taxOld.totalTaxPayable / grossIncome) * 100).toFixed(1)}% effective` },
          { label: "Monthly TDS", value: formatINR(taxNew.totalTaxPayable / 12), icon: "📅", sub: "new regime" },
          { label: "Better Regime", value: winner === "new" ? "New ✓" : "Old ✓", icon: "🏆", sub: `saves ${formatINR(comparison.savings)}/yr` },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-rule bg-surface p-3 text-center shadow-card">
            <p className="text-xl">{stat.icon}</p>
            <p className="tabular mt-1 font-display text-lg font-bold text-ink">{stat.value}</p>
            <p className="text-xs text-ink-soft">{stat.label}</p>
            <p className="text-[10px] text-ink-soft">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Calculator */}
      <div className="mt-10">
        <IncomeTaxCalculator defaultAnnualIncome={grossIncome} />
      </div>

      {/* Tax saving CTA */}
      <div className="mt-10 rounded-xl border border-brand/20 bg-brand-soft p-5">
        <p className="font-semibold text-ink">Reduce your tax on {lpa} LPA</p>
        <p className="text-sm text-ink-soft mt-1">
          See exactly which deductions will save you the most tax at this salary level.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href={`/tax-saving/${incomeTaxSlug(Math.round(lpa))}-lpa`.replace(/^\//,'/tax-saving/')}
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Tax Saving Guide for {lpa} LPA →
          </Link>
          <Link href="/calculator/old-vs-new-tax-regime"
            className="rounded-full border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand-soft">
            Detailed Regime Comparison
          </Link>
        </div>
      </div>

      {/* Related salary taxes */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Income Tax for Similar Salaries</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {relatedLpas.map(relLpa => {
            const relBreakup = calculateSalaryBreakup({ annualCtc: relLpa * 100_000, regime: "new" });
            const relTax = calculateIncomeTax(relBreakup.grossSalaryAnnual, "new");
            return (
              <li key={relLpa}>
                <Link href={`/calculator/income-tax-calculator/${incomeTaxSlug(relLpa)}`}
                  className="block rounded-md border border-rule bg-surface px-4 py-3 hover:border-brand">
                  <p className="font-medium text-ink">{relLpa} LPA</p>
                  <p className="tabular text-xs text-brand mt-0.5">{formatINR(relTax.totalTaxPayable)}/yr tax</p>
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/calculator/income-tax-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-ink-soft hover:border-brand hover:text-brand">
              All incomes →
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
