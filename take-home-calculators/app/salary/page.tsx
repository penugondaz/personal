import type { Metadata } from "next";
import Link from "next/link";
import { SALARY_LPA_VALUES, salarySlug } from "@/lib/salary-data";
import { absoluteUrl } from "@/lib/paths";

export const metadata: Metadata = {
  title: "In-Hand Salary Calculator — All CTC Slabs (India)",
  description:
    "Browse in-hand salary calculators for every common CTC slab in India, from 3 LPA to 50 LPA. See your monthly take-home pay after tax, PF, and professional tax.",
  alternates: { canonical: absoluteUrl("/salary") },
};

export default function SalaryIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink">In-Hand Salary Calculators</h1>
      <p className="mt-3 text-ink-muted">
        Select your CTC to see a full monthly breakup — basic, HRA, PF, professional tax, income
        tax, and your actual take-home pay.
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SALARY_LPA_VALUES.map((lpa) => (
          <li key={lpa}>
            <Link
              href={`/salary/${salarySlug(lpa)}`}
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-ledger hover:border-ledger"
            >
              {lpa} LPA
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
