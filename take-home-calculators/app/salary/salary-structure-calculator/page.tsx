import type { Metadata } from "next";
import Link from "next/link";
import SalaryStructureCalculator from "@/components/SalaryStructureCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Salary Structure Calculator — Custom CTC Breakup Calculator";
const description = "Build a custom salary structure by adjusting basic salary and HRA percentages, and see how it affects your take-home pay.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/salary/salary-structure-calculator") },
  openGraph: { title, description, url: absoluteUrl("/salary/salary-structure-calculator") },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Salary Structure Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Salary Structure Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">See how changing your basic salary and HRA percentages affects your CTC breakup, deductions, and final take-home pay.</p>

      <div className="mt-10">
        <SalaryStructureCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li><Link href="/salary" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">In-Hand Salary Calculator</Link></li>
          <li><Link href="/salary/inhand-to-ctc-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">In-Hand to CTC Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
