import type { Metadata } from "next";
import Link from "next/link";
import XirrCalculator from "@/components/XirrCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "XIRR Calculator — Calculate Annualized Returns on Irregular Cash Flows";
const description = "Calculate XIRR (Extended Internal Rate of Return) for investments with irregular cash flows at different dates.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/xirr-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/xirr-calculator") },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">XIRR Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">XIRR Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">Calculate the annualized return (XIRR) on investments with multiple cash flows at irregular dates — the standard metric for real-world portfolio returns.</p>

      <div className="mt-10">
        <XirrCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li><Link href="/calculator/cagr-xirr-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">CAGR &amp; XIRR Calculator</Link></li>
          <li><Link href="/calculator/mutual-fund-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Mutual Fund Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
