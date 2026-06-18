import type { Metadata } from "next";
import Link from "next/link";
import SwpCalculator from "@/components/SwpCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "SWP Calculator — Systematic Withdrawal Plan Calculator";
const description = "Calculate how long your investment corpus will last with regular monthly withdrawals under a Systematic Withdrawal Plan.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/swp-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/swp-calculator") },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">SWP Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">SWP Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">Plan your systematic withdrawals — see how long your corpus lasts and what remains after regular monthly payouts.</p>

      <div className="mt-10">
        <SwpCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li><Link href="/calculator/sip-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">SIP Calculator</Link></li>
          <li><Link href="/calculator/goal-planning-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Goal Planning Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
