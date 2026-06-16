import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SalaryInputCalculator from "@/components/SalaryInputCalculator";
import { SALARY_LPA_VALUES, salarySlug, parseSalarySlug, lpaToAnnualCtc } from "@/lib/salary-data";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

/**
 * Programmatic SEO template: one statically-generated page per CTC slab
 * (e.g. /salary/5-lpa-in-hand, /salary/12-5-lpa-in-hand). The page count
 * scales by adding entries to SALARY_LPA_VALUES in lib/salary-data.ts —
 * no template changes needed to go from dozens to thousands of pages.
 *
 * Content sections follow the brief's required structure: hero,
 * calculator, formula explanation, FAQ, related pages — each populated
 * from the actual computed numbers for this specific LPA so pages don't
 * read as thin/duplicate content despite sharing one template.
 */

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

  const relatedLpas = SALARY_LPA_VALUES.filter((v) => Math.abs(v - lpa) > 0 && Math.abs(v - lpa) <= 3).slice(
    0,
    6
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ledger">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/salary" className="hover:text-ledger">
          Salary Calculators
        </Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{lpa} LPA</span>
      </nav>

      {/* Hero */}
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        {lpa} LPA In-Hand Salary — Monthly Take-Home Breakdown
      </h1>
      <p className="mt-4 text-lg text-ink-muted">
        On a CTC of <strong className="text-ink">{formatINRCompact(annualCtc)} per year</strong>,
        your estimated in-hand salary is{" "}
        <strong className="text-ledger">{formatINR(result.inHandMonthly)} per month</strong>{" "}
        ({formatINR(result.inHandAnnual)} per year) under the new tax regime, after PF and income
        tax deductions.
      </p>

      {/* Calculator */}
      <div className="mt-10">
        <SalaryInputCalculator initialAnnualCtc={annualCtc} />
      </div>

      {/* Formula / explanation */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">
          How {lpa} LPA Becomes {formatINR(result.inHandMonthly)} In-Hand
        </h2>
        <p className="mt-3 text-ink-muted">
          Your CTC (Cost to Company) of {formatINRCompact(annualCtc)} isn&apos;t the same as what
          lands in your bank account. Employers split CTC into fixed pay, employer contributions
          you never receive as cash, and one-time-on-exit benefits like gratuity. Here&apos;s the
          typical breakdown:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-muted">
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

      {/* Benefits / context */}
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

      {/* FAQ */}
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

      {/* Related salary pages */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Salary Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {relatedLpas.map((relatedLpa) => (
            <li key={relatedLpa}>
              <Link
                href={`/salary/${salarySlug(relatedLpa)}`}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-ledger hover:border-ledger"
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
      <td className="px-4 py-2.5 text-ink-muted">{label}</td>
      <td className="tabular px-4 py-2.5 text-right text-ink">{formatINR(value)}</td>
    </tr>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-rule pb-4">
      <h3 className="font-medium text-ink">{question}</h3>
      <p className="mt-1.5 text-sm text-ink-muted">{answer}</p>
    </div>
  );
}
