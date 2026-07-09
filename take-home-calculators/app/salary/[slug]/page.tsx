import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SalaryInputCalculator from "@/components/SalaryInputCalculator";
import InhandToCtcCalculator from "@/components/InhandToCtcCalculator";
import SalarySummaryStats from "@/components/SalarySummaryStats";
import SalaryBreakupChart from "@/components/SalaryBreakupChart";
import { SALARY_LPA_VALUES, salarySlug, parseSalarySlug, lpaToAnnualCtc } from "@/lib/salary-data";
import { INHAND_MONTHLY_VALUES, inhandSlug, parseInhandSlug } from "@/lib/inhand-to-ctc-data";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { calculateInhandToCtc } from "@/lib/calculators/inhand-to-ctc";
import { compareRegimes } from "@/lib/calculators/income-tax";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, salaryPageSchema, buildJsonLd } from "@/lib/schema";
import { CITIES, NATIONAL_AVG_LPA_BY_EXPERIENCE } from "@/lib/city-cost-data";

export function generateStaticParams() {
  const lpaParams = SALARY_LPA_VALUES.map((lpa) => ({ slug: salarySlug(lpa) }));
  const inhandParams = INHAND_MONTHLY_VALUES.map((monthly) => ({ slug: inhandSlug(monthly) }));
  return [...lpaParams, ...inhandParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Check if this is an in-hand-to-CTC slug
  const monthly = parseInhandSlug(slug);
  if (monthly !== null) {
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

  // Otherwise treat as LPA salary slug
  const lpa = parseSalarySlug(slug);
  if (lpa === null) return {};

  const title = `${lpa} LPA In Hand Salary — Monthly Take-Home After Tax (${new Date().getFullYear()})`;
  const description = `${lpa} LPA CTC in-hand salary breakdown: basic, HRA, PF, professional tax, and income tax deductions, with your actual monthly take-home pay.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/salary/${slug}`) },
    openGraph: { title, description, url: absoluteUrl(`/salary/${slug}`) },
  };
}

export default async function SalarySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const monthly = parseInhandSlug(slug);
  if (monthly !== null) {
    return <InhandToCtcSlugContent monthly={monthly} slug={slug} />;
  }

  const lpa = parseSalarySlug(slug);
  if (lpa === null) notFound();

  return <SalaryLpaContent lpa={lpa} slug={slug} />;
}

// ── In-Hand to CTC content ────────────────────────────────────────────────────

function InhandToCtcSlugContent({ monthly, slug }: { monthly: number; slug: string }) {
  const result = calculateInhandToCtc({ targetInHandMonthly: monthly, regime: "new" });
  const resultOld = calculateInhandToCtc({ targetInHandMonthly: monthly, regime: "old" });

  const relatedAmounts = INHAND_MONTHLY_VALUES.filter((v) => v !== monthly)
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

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Required CTC (New)", value: formatINRCompact(result.estimatedAnnualCtc), icon: "💚" },
          { label: "Required CTC (Old)", value: formatINRCompact(resultOld.estimatedAnnualCtc), icon: "🟠" },
          { label: "Monthly CTC", value: formatINR(result.estimatedMonthlyCtc), icon: "📅" },
          { label: "Total Deductions", value: formatINR(result.totalDeductionsMonthly), icon: "📉" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-rule bg-surface p-3 text-center shadow-card">
            <p className="text-xl">{stat.icon}</p>
            <p className="tabular mt-1 font-display text-base font-bold text-ink">{stat.value}</p>
            <p className="text-[11px] text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <InhandToCtcCalculator defaultMonthly={monthly} />
      </div>

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
          ].map((faq) => (
            <div key={faq.q} className="border-b border-rule pb-4">
              <h3 className="font-medium text-ink">{faq.q}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Other In-Hand Amounts</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {relatedAmounts.map((amt) => (
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

// ── Salary LPA content (original page) ────────────────────────────────────────

function SalaryLpaContent({ lpa, slug }: { lpa: number; slug: string }) {
  const annualCtc = lpaToAnnualCtc(lpa);
  const result = calculateSalaryBreakup({ annualCtc, regime: "new" });
  const regimeComparison = compareRegimes(result.grossSalaryAnnual);

  const relatedLpas = SALARY_LPA_VALUES.filter((v) => Math.abs(v - lpa) > 0 && Math.abs(v - lpa) <= 3).slice(
    0,
    6
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": absoluteUrl("/") },
          { "@type": "ListItem", "position": 2, "name": "Salary Calculators", "item": absoluteUrl("/salary") },
          { "@type": "ListItem", "position": 3, "name": `${lpa} LPA In-Hand Salary`, "item": absoluteUrl(`/salary/${slug}`) },
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `What is the in-hand salary for ${lpa} LPA?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The in-hand salary for ${lpa} LPA CTC is approximately ${formatINR(result.inHandMonthly)} per month (${formatINR(result.inHandAnnual)} per year) under the new tax regime, after PF and income tax deductions. This assumes a standard salary structure with basic salary at 40% of CTC.`,
            },
          },
          {
            "@type": "Question",
            "name": `How much tax do I pay on ${lpa} LPA?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "On a " + lpa + " LPA CTC, the estimated income tax under the new regime is " + formatINR(regimeComparison.new.totalTaxPayable) + " per year. Under the old regime with standard deductions, it may be " + formatINR(regimeComparison.old.totalTaxPayable) + " per year.",
            },
          },
          {
            "@type": "Question",
            "name": `What is the PF deduction on ${lpa} LPA?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `On a ${lpa} LPA salary, the employee PF deduction is typically ${formatINR(result.employeePfMonthly)} per month (12% of basic salary). Your employer also contributes ${formatINR(result.employerPfMonthly)} per month to your EPF account.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/salary" className="hover:text-brand">
          Salary Calculators
        </Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{lpa} LPA</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        {lpa} LPA In-Hand Salary — Monthly Take-Home Breakdown
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        On a CTC of <strong className="text-ink">{formatINRCompact(annualCtc)} per year</strong>,
        your estimated in-hand salary is{" "}
        <strong className="text-brand">{formatINR(result.inHandMonthly)} per month</strong>{" "}
        ({formatINR(result.inHandAnnual)} per year) under the new tax regime, after PF and income
        tax deductions.
      </p>

      {/* National average context */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(NATIONAL_AVG_LPA_BY_EXPERIENCE).map(([exp, avgLpa]) => {
          const isAbove = lpa > avgLpa;
          const diffPercent = Math.round((Math.abs(lpa - avgLpa) / avgLpa) * 100);
          return (
            <span key={exp}
              className={`text-xs px-2.5 py-1 rounded-full border ${isAbove ? "border-brand/30 bg-brand-soft text-brand" : "border-rule bg-paper text-ink-soft"}`}>
              {isAbove ? "↑" : "↓"} {diffPercent}% vs {exp} avg ({avgLpa} LPA)
            </span>
          );
        })}
      </div>

      <SalarySummaryStats
        stats={[
          { label: "In-Hand / Month", value: formatINR(result.inHandMonthly), icon: "💰" },
          { label: "Annual CTC", value: formatINRCompact(annualCtc), icon: "📦" },
          { label: "Income Tax / Year", value: formatINR(result.incomeTax.totalTaxPayable), icon: "🧾" },
          { label: "PF / Month (Employee)", value: formatINR(result.employeePfMonthly), icon: "🏦" },
        ]}
      />

      <div className="mt-10">
        <SalaryInputCalculator initialAnnualCtc={annualCtc} />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">
          How {lpa} LPA Becomes {formatINR(result.inHandMonthly)} In-Hand
        </h2>
        <p className="mt-3 text-ink-soft">
          Your CTC (Cost to Company) of {formatINRCompact(annualCtc)} isn&apos;t the same as what
          lands in your bank account. Employers split CTC into fixed pay, employer contributions
          you never receive as cash, and one-time-on-exit benefits like gratuity. Here&apos;s the
          typical breakdown:
        </p>

        <div className="mt-6 rounded-xl border border-rule bg-surface p-5 sm:p-6">
          <SalaryBreakupChart
            centerLabel="In-Hand"
            centerValue={`${Math.round((result.inHandMonthly / result.monthlyCtc) * 100)}%`}
            segments={[
              { label: "In-hand pay", monthly: result.inHandMonthly, color: "var(--brand)" },
              { label: "Your PF (locked in)", monthly: result.employeePfMonthly, color: "#6b9c82" },
              {
                label: "Income tax & PT",
                monthly: result.incomeTaxMonthly + result.professionalTaxMonthly,
                color: "var(--deduction)",
              },
              {
                label: "Employer PF & gratuity",
                monthly: result.employerPfMonthly + result.gratuityMonthly,
                color: "var(--ink-soft)",
              },
            ]}
          />
        </div>

        <ol className="mt-6 list-decimal space-y-2 pl-5 text-ink-soft">
          <li>
            <strong className="text-ink">Basic salary</strong> is set at roughly 40% of CTC —{" "}
            {formatINR(result.basicAnnual)} per year, or {formatINR(result.basicMonthly)}/month.
          </li>
          <li>
            <strong className="text-ink">HRA</strong> (House Rent Allowance) is typically 50% of
            basic — {formatINR(result.hraMonthly)}/month, partly or fully tax-exempt under the old
            regime if you pay rent.
          </li>
          <li>
            <strong className="text-ink">Employer PF contribution</strong> (
            {formatINR(result.employerPfMonthly)}/month) and{" "}
            <strong className="text-ink">gratuity</strong> ({formatINR(result.gratuityMonthly)}
            /month) are part of CTC but aren&apos;t paid to you monthly — gratuity is only payable
            after 5+ years of service.
          </li>
          <li>
            From your gross salary of {formatINR(result.grossSalaryMonthly)}/month, your{" "}
            <strong className="text-ink">own PF contribution</strong> (
            {formatINR(result.employeePfMonthly)}) and{" "}
            <strong className="text-ink">income tax</strong> (
            {formatINR(result.incomeTaxMonthly)}) are deducted, leaving your net in-hand pay.
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Annual Summary</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-rule">
          <table className="w-full text-sm">
            <tbody>
              <SummaryRow label="Annual CTC" value={annualCtc} />
              <SummaryRow label="Gross salary (annual)" value={result.grossSalaryAnnual} />
              <SummaryRow label="Total PF (annual)" value={result.employeePfAnnual} />
              <SummaryRow label="Income tax (annual)" value={result.incomeTax.totalTaxPayable} />
              <SummaryRow label="Net in-hand (annual)" value={result.inHandAnnual} emphasis />
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Old Regime vs. New Regime</h2>
        <p className="mt-3 text-ink-soft">
          At this CTC, the{" "}
          <strong className="text-brand">
            {regimeComparison.betterRegime === "new" ? "new" : "old"} tax regime
          </strong>{" "}
          works out cheaper by {formatINR(regimeComparison.savings)} per year — though the old
          regime&apos;s actual benefit depends heavily on deductions like 80C, HRA exemption, and
          home loan interest, which aren&apos;t available under the new regime.
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft"></th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">New Regime</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">
                  Old Regime (no extra deductions)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-rule">
                <td className="px-4 py-2.5 text-ink-soft">Standard deduction</td>
                <td className="tabular px-4 py-2.5 text-right text-ink">
                  {formatINR(regimeComparison.new.standardDeduction)}
                </td>
                <td className="tabular px-4 py-2.5 text-right text-ink">
                  {formatINR(regimeComparison.old.standardDeduction)}
                </td>
              </tr>
              <tr className="border-b border-rule">
                <td className="px-4 py-2.5 text-ink-soft">Taxable income</td>
                <td className="tabular px-4 py-2.5 text-right text-ink">
                  {formatINR(regimeComparison.new.taxableIncome)}
                </td>
                <td className="tabular px-4 py-2.5 text-right text-ink">
                  {formatINR(regimeComparison.old.taxableIncome)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-semibold text-ink">Tax payable</td>
                <td className="tabular px-4 py-2.5 text-right font-semibold text-ink">
                  {formatINR(regimeComparison.new.totalTaxPayable)}
                </td>
                <td className="tabular px-4 py-2.5 text-right font-semibold text-ink">
                  {formatINR(regimeComparison.old.totalTaxPayable)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          The old-regime figure above assumes no additional deductions claimed. If you have
          significant 80C investments, HRA, or home loan interest, the old regime may work out
          better than shown here.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Go Deeper on {lpa} LPA</h2>
        <p className="mt-3 text-ink-soft">
          See how to reduce your tax, project your salary growth, and run your own calculation
          with custom inputs.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link href={`/tax-saving/${lpa}-lpa`}
            className="group rounded-xl border border-rule bg-surface p-4 hover:border-brand hover:-translate-y-0.5 transition shadow-card">
            <span className="text-xl">🧾</span>
            <p className="mt-2 font-semibold text-ink">Tax Saving Guide</p>
            <p className="mt-1 text-xs text-ink-soft">See how much tax you can save at {lpa} LPA with 80C, NPS, HRA</p>
          </Link>
          <Link href={`/salary-growth/${lpa}-lpa`}
            className="group rounded-xl border border-rule bg-surface p-4 hover:border-brand hover:-translate-y-0.5 transition shadow-card">
            <span className="text-xl">📈</span>
            <p className="mt-2 font-semibold text-ink">Salary Growth Projection</p>
            <p className="mt-1 text-xs text-ink-soft">See what {lpa} LPA grows to in 5 and 10 years</p>
          </Link>
          <Link href="/calculator/income-tax-calculator"
            className="group rounded-xl border border-rule bg-surface p-4 hover:border-brand hover:-translate-y-0.5 transition shadow-card">
            <span className="text-xl">🔢</span>
            <p className="mt-2 font-semibold text-ink">Custom Tax Calculator</p>
            <p className="mt-1 text-xs text-ink-soft">Add your own deductions and compare both regimes</p>
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">What {lpa} LPA Feels Like By City</h2>
        <p className="mt-3 text-ink-soft">
          The same {formatINR(result.inHandMonthly)}/month goes much further in some cities than
          others. Here&apos;s how typical rent and cost of living compare:
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft">City</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">Avg 1BHK Rent</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">Rent as % of In-Hand</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">Cost Index</th>
              </tr>
            </thead>
            <tbody>
              {CITIES.map((city) => {
                const rentPercent = Math.round((city.avgRent1BHK / result.inHandMonthly) * 100);
                return (
                  <tr key={city.name} className="border-b border-rule last:border-0 hover:bg-paper">
                    <td className="px-4 py-2.5 font-medium text-ink">
                      {city.name}
                      {city.isMetroForHRA && (
                        <span className="ml-1.5 text-[10px] text-brand bg-brand-soft px-1.5 py-0.5 rounded-full">50% HRA</span>
                      )}
                    </td>
                    <td className="tabular px-4 py-2.5 text-right text-ink-soft">{formatINR(city.avgRent1BHK)}</td>
                    <td className={`tabular px-4 py-2.5 text-right font-medium ${rentPercent > 40 ? "text-deduction" : rentPercent > 25 ? "text-orange-600" : "text-brand"}`}>
                      {rentPercent}%
                    </td>
                    <td className="tabular px-4 py-2.5 text-right text-ink-soft">{city.costIndex}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Cost index: 100 = national average. Cities with &quot;50% HRA&quot; (Mumbai, Delhi, Chennai,
          Kolkata) give you a higher HRA tax exemption limit than other cities (40%) — relevant if you
          choose the old tax regime.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          <FaqItem
            question={`What is the in-hand salary for ${lpa} LPA per month?`}
            answer={`For a CTC of ${formatINRCompact(annualCtc)} per year, the estimated in-hand salary is ${formatINR(result.inHandMonthly)} per month under the new tax regime, after PF and income tax deductions. Actual take-home may vary based on your employer's specific salary structure.`}
          />
          <FaqItem
            question={`How much tax will I pay on ${lpa} LPA?`}
            answer={`Under the new tax regime, the estimated annual income tax on a gross salary derived from ${lpa} LPA CTC is ${formatINR(result.incomeTax.totalTaxPayable)}. This includes the Section 87A rebate where applicable.`}
          />
          <FaqItem
            question={`Is ${lpa} LPA a good salary in India?`}
            answer={`This depends heavily on your city, experience level, and industry. ${lpa} LPA translates to roughly ${formatINR(result.inHandMonthly)} in-hand per month, which you can compare against typical living costs in your city.`}
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Salary Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {relatedLpas.map((relatedLpa) => (
            <li key={relatedLpa}>
              <Link
                href={`/salary/${salarySlug(relatedLpa)}`}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
              >
                {relatedLpa} LPA In Hand
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function SummaryRow({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (
    <tr className={`border-b border-rule last:border-0 ${emphasis ? "bg-paper font-semibold" : ""}`}>
      <td className="px-4 py-2.5 text-ink-soft">{label}</td>
      <td className="tabular px-4 py-2.5 text-right text-ink">{formatINR(value)}</td>
    </tr>
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
