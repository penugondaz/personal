import type { Metadata } from "next";
import Link from "next/link";
import { EPF_INTEREST_RATE_FY2025_26 } from "@/lib/calculators/epf";
import { PPF_INTEREST_RATE, PPF_MAX_ANNUAL_DEPOSIT } from "@/lib/calculators/ppf";
import { formatINR } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

const title = "EPF vs PPF — Which Is Better for Retirement Savings?";
const description =
  "Compare EPF and PPF on interest rate, contribution limits, lock-in period, tax treatment, and eligibility, to decide which suits your retirement savings strategy.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/epf-vs-ppf") },
  openGraph: { title, description, url: absoluteUrl("/epf-vs-ppf") },
};

const comparisonRows: { feature: string; epf: string; ppf: string }[] = [
  { feature: "Who can open one", epf: "Salaried employees, via employer", ppf: "Any resident Indian (and minors, via guardian)" },
  { feature: "Current interest rate", epf: `${(EPF_INTEREST_RATE_FY2025_26 * 100).toFixed(2)}% p.a.`, ppf: `${(PPF_INTEREST_RATE * 100).toFixed(1)}% p.a.` },
  { feature: "Contribution", epf: "12% of Basic+DA (mandatory, employer-matched)", ppf: `Voluntary, up to ${formatINR(PPF_MAX_ANNUAL_DEPOSIT)}/year` },
  { feature: "Employer matching", epf: "Yes — employer contributes an equal share", ppf: "No employer involvement at all" },
  { feature: "Lock-in period", epf: "Until retirement/resignation (partial withdrawal rules apply)", ppf: "15 years, extendable in 5-year blocks" },
  { feature: "Tax treatment", epf: "EEE, with a taxable-interest threshold on large contributions", ppf: "Fully EEE (Exempt-Exempt-Exempt), no threshold" },
  { feature: "Partial withdrawal", epf: "Allowed for specific reasons (medical, home, education, etc.)", ppf: "Allowed from the 7th financial year onward" },
  { feature: "Loan against balance", epf: "Not directly available", ppf: "Available from 3rd to 6th year" },
];

export default function EpfVsPpfPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">EPF vs PPF</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">EPF vs PPF</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Both are government-backed, tax-free retirement savings options — but they work very
        differently in who can use them, how much you can contribute, and how locked-in your
        money is.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Side-by-Side Comparison</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft">Feature</th>
                <th className="px-4 py-2.5 font-medium text-brand">EPF</th>
                <th className="px-4 py-2.5 font-medium text-brand">PPF</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-rule last:border-0">
                  <td className="px-4 py-2.5 font-medium text-ink">{row.feature}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{row.epf}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{row.ppf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Which Should You Prioritize?</h2>
        <p className="mt-3 text-ink-soft">
          If you're salaried, EPF isn't really optional — your 12% contribution and your
          employer's matching share happen automatically every month, and the current{" "}
          {(EPF_INTEREST_RATE_FY2025_26 * 100).toFixed(2)}% rate is higher than PPF's. The
          decision point is really whether to add PPF on top, or whether to use{" "}
          <Link href="/epf-calculator" className="text-brand hover:underline">
            VPF
          </Link>{" "}
          (Voluntary PF) instead, since VPF rides on your existing EPF account and currently
          earns a higher rate than PPF, while PPF offers something EPF doesn't: it's open to
          anyone, including self-employed people and even as a savings vehicle for your children,
          with no dependency on formal employment.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li>
            <Link href="/epf-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              EPF & VPF Calculator
            </Link>
          </li>
          <li>
            <Link href="/ppf-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              PPF Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
