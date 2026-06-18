import type { Metadata } from "next";
import Link from "next/link";
import StockAverageCalculator from "@/components/StockAverageCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Stock Average Calculator — Share Average Price Calculator";
const description = "Calculate the weighted average price per share across multiple purchases to track your true cost basis.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/stock-average-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/stock-average-calculator") },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Stock Average Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Stock Average Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">Find your weighted average cost per share across multiple buy transactions — essential for tracking your real cost basis.</p>

      <div className="mt-10">
        <StockAverageCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li><Link href="/calculator/xirr-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">XIRR Calculator</Link></li>
          <li><Link href="/calculator/capital-gains-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Capital Gains Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
