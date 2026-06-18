import type { Metadata } from "next";
import Link from "next/link";
import CompoundInterestCalculator from "@/components/CompoundInterestCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Compound Interest Calculator — CI Calculator with Monthly Additions";
const description = "Calculate compound interest with flexible compounding frequency and optional monthly additions.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/compound-interest-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/compound-interest-calculator") },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Compound Interest Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Compound Interest Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">Calculate how your money grows with compound interest, with support for different compounding frequencies and optional regular additions.</p>

      <div className="mt-10">
        <CompoundInterestCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li><Link href="/calculator/simple-interest-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Simple Interest Calculator</Link></li>
          <li><Link href="/calculator/fd-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">FD Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
