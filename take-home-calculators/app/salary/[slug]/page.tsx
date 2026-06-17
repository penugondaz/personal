import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SalaryInputCalculator from "@/components/SalaryInputCalculator";
import { SALARY_LPA_VALUES, salarySlug, parseSalarySlug, lpaToAnnualCtc } from "@/lib/salary-data";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { compareRegimes } from "@/lib/calculators/income-tax";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

export function generateStaticParams() {
  return SALARY_LPA_VALUES.map((lpa) => ({ slug: salarySlug(lpa) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
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

export default async function SalaryLpaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lpa = parseSalarySlug(slug);
  if (lpa === null) notFound();

  const annualCtc = lpaToAnnualCtc(lpa);
  const result = calculateSalaryBreakup({ annualCtc, regime: "new" });
  const regimeComparison = compareRegimes(result.grossSalaryAnnual);

  const relatedLpas = SALARY_LPA_VALUES.filter((v) => Math.abs(v - lpa) > 0 && Math.abs(v - lpa) <= 3).slice(
    0,
    6
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
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
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-soft">
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
