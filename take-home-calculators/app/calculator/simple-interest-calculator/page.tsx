import type { Metadata } from "next";
import Link from "next/link";
import SimpleInterestCalculator from "@/components/SimpleInterestCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Simple Interest Calculator — SI Calculator India";
const description = "Calculate simple interest on any principal amount, rate, and time period.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/simple-interest-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/simple-interest-calculator") },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Simple Interest Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Simple Interest Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">Calculate the interest earned using the simple interest formula — no compounding, just straightforward P × R × T.</p>

      <div className="mt-10">
        <SimpleInterestCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li><Link href="/calculator/compound-interest-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Compound Interest Calculator</Link></li>
          <li><Link href="/calculator/fd-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">FD Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
