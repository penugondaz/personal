import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InhandToCtcCalculator from "@/components/InhandToCtcCalculator";
import { INHAND_MONTHLY_VALUES, inhandSlug, parseInhandSlug } from "@/lib/inhand-to-ctc-data";
import { calculateInhandToCtc } from "@/lib/calculators/inhand-to-ctc";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return INHAND_MONTHLY_VALUES.map(monthly => ({ inhandSlug: inhandSlug(monthly) }));
}

export async function generateMetadata({ params }: { params: Promise<{ inhandSlug: string }> }): Promise<Metadata> {
  const { inhandSlug: slug } = await params;
  const monthly = parseInhandSlug(slug);
  if (monthly === null) return {};

  const result = calculateInhandToCtc({ targetInHandMonthly: monthly, regime: "new" });
  const title = `${formatINR(monthly)} In-Hand Salary — What CTC Do You Need?`;
  const description = `To get ${formatINR(monthly)}/month in-hand, you need a CTC of approximately ${formatINR(result.estimatedAnnualCtc)}/year (${formatINR(result.estimatedMonthlyCtc)}/month). Full breakdown with PF and tax.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/salary/${slug}`) },
    openGraph: { title, description, url: absoluteUrl(`/salary/${slug}`) },
  };
}

export default async function InhandSlugPage({ params }: { params: Promise<{ inhandSlug: string }> }) {
  const { inhandSlug: slug } = await params;
  const monthly = parseInhandSlug(slug);
  if (monthly === null) notFound();

  const result = calculateInhandToCtc({ targetInHandMonthly: monthly, regime: "new" });
  const resultOld = calculateInhandToCtc({ targetInHandMonthly: monthly, regime: "old" });

  const relatedAmounts = INHAND_MONTHLY_VALUES.filter(v => v !== monthly)
    .sort((a, b) => Math.abs(a - monthly) - Math.abs(b - monthly))
    .slice(0, 6);

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Salary Calculators", href: "/salary" },
      { name: "In-Hand to CTC", href: "/salary/inhand-to-ctc-calculator" },
      { name: `${formatINR(monthly)} In-Hand`, href: `/salary/${slug}` },
    ]),
    calculatorSchema({
      name: `${formatINR(monthly)} In-Hand to CTC Calculator`,
      description: `Calculate CTC required for ${formatINR(monthly)} monthly in-hand salary`,
      url: `/salary/${slug}`,
    }),
    faqSchema([
      {
        question: `What CTC do I need for ${formatINR(monthly)} in-hand salary?`,
        answer: `To get ${formatINR(monthly)} in-hand per month, you need a CTC of approximately ${formatINR(result.estimatedAnnualCtc)} per year (${formatINR(result.estimatedMonthlyCtc)}/month) under the new tax regime. This accounts for PF deduction and income tax.`,
      },
      {
        question: `How much CTC for ${formatINR(monthly)}/month take home under old regime?`,
        answer: `Under the old tax regime (with no additional deductions claimed), you'd need a CTC of approximately ${formatINR(resultOld.estimatedAnnualCtc)} per year to get ${formatINR(monthly)} in-hand per month.`,
      },
      {
        question: `What is the annual CTC for ${formatINR(monthly)} monthly salary?`,
        answer: `For ${formatINR(monthly)} in-hand monthly, the required annual CTC is ${formatINR(result.estimatedAnnualCtc)}. This is higher than ${formatINR(monthly * 12)} (monthly × 12) because CTC includes PF, gratuity, and tax that don't reach your bank account.`,
      },
    ]),
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/salary/inhand-to-ctc-calculator" className="hover:text-brand">In-Hand to CTC</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{formatINR(monthly)}</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        {formatINR(monthly)} In-Hand Salary — Required CTC
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        To take home <strong className="text-ink">{formatINR(monthly)} per month</strong>, you need
        a CTC of approximately{" "}
        <strong className="text-brand">{formatINRCompact(result.estimatedAnnualCtc)} per year</strong>{" "}
        ({formatINR(result.estimatedMonthlyCtc)}/month) under the new tax regime.
      </p>

      {/* Quick comparison cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Required CTC (New)", value: formatINRCompact(result.estimatedAnnualCtc), icon: "💚" },
          { label: "Required CTC (Old)", value: formatINRCompact(resultOld.estimatedAnnualCtc), icon: "🟠" },
          { label: "Monthly CTC", value: formatINR(result.estimatedMonthlyCtc), icon: "📅" },
          { label: "Total Deductions", value: formatINR(result.totalDeductionsMonthly), icon: "📉" },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-rule bg-surface p-3 text-center shadow-card">
            <p className="text-xl">{stat.icon}</p>
            <p className="tabular mt-1 font-display text-base font-bold text-ink">{stat.value}</p>
            <p className="text-[11px] text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Calculator */}
      <div className="mt-10">
        <InhandToCtcCalculator defaultMonthly={monthly} />
      </div>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          {[
            {
              q: `What CTC do I need for ${formatINR(monthly)} in-hand?`,
              a: `You need a CTC of ${formatINR(result.estimatedAnnualCtc)}/year (new regime) or ${formatINR(resultOld.estimatedAnnualCtc)}/year (old regime, no extra deductions) to take home ${formatINR(monthly)} every month.`,
            },
            {
              q: "Why is the required CTC higher than 12× my monthly target?",
              a: `${formatINR(monthly)} × 12 = ${formatINR(monthly * 12)}, but the required CTC is ${formatINR(result.estimatedAnnualCtc)} — higher because PF contributions, gratuity, and income tax reduce your gross salary before it reaches your bank account.`,
            },
            {
              q: "Can I negotiate exactly this CTC with an employer?",
              a: "This is a close estimate based on standard salary structuring (40% Basic). Different companies structure CTC differently, so use this as a strong reference point during salary negotiation, and confirm the exact in-hand amount once you see the actual offer letter breakup.",
            },
          ].map(faq => (
            <div key={faq.q} className="border-b border-rule pb-4">
              <h3 className="font-medium text-ink">{faq.q}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Other In-Hand Amounts</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {relatedAmounts.map(amt => (
            <li key={amt}>
              <Link href={`/salary/${inhandSlug(amt)}`}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
                {formatINR(amt)}/month
              </Link>
            </li>
          ))}
          <li>
            <Link href="/salary/inhand-to-ctc-calculator"
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-ink-soft hover:border-brand hover:text-brand">
              Custom amount →
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
