import type { Metadata } from "next";
import Link from "next/link";
import SalaryInputCalculator from "@/components/SalaryInputCalculator";
import { SALARY_LPA_VALUES, salarySlug } from "@/lib/salary-data";
import { absoluteUrl } from "@/lib/paths";

export const metadata: Metadata = {
  title: "In-Hand Salary Calculator — All CTC Slabs (India)",
  description:
    "Calculate your in-hand salary from any CTC, or browse pre-built breakdowns for every common CTC slab in India, from 1 LPA to 60 LPA.",
  alternates: { canonical: absoluteUrl("/salary") },
};

export default function SalaryIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">In-Hand Salary Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Enter any CTC below to see your full monthly breakup — basic, HRA, PF, professional tax,
        income tax, and your actual take-home pay.
      </p>

      <div className="mt-10">
        <SalaryInputCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Browse by CTC Slab</h2>
        <p className="mt-3 text-ink-soft">
          Or jump straight to a detailed breakdown — including the old vs. new regime comparison
          and a year-by-year FAQ — for one of these common CTC values.
        </p>
        <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {SALARY_LPA_VALUES.map((lpa) => (
            <li key={lpa}>
              <Link
                href={`/salary/${salarySlug(lpa)}`}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
              >
                {lpa} LPA
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
