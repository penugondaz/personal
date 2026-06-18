import type { Metadata } from "next";
import Link from "next/link";
import InhandToCtcCalculator from "@/components/InhandToCtcCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "In-Hand to CTC Calculator — Reverse Salary Calculator India";
const description = "Find out what CTC you need to negotiate to get your desired in-hand (take-home) salary, accounting for PF and income tax.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/salary/inhand-to-ctc-calculator") },
  openGraph: { title, description, url: absoluteUrl("/salary/inhand-to-ctc-calculator") },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">In-Hand to CTC Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">In-Hand to CTC Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">Know your desired take-home? Find out what CTC you need to ask for — accounting for PF contributions and income tax.</p>

      <div className="mt-10">
        <InhandToCtcCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li><Link href="/salary" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">In-Hand Salary Calculator</Link></li>
          <li><Link href="/salary/salary-structure-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Salary Structure Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
