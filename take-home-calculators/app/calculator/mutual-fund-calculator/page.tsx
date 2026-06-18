import type { Metadata } from "next";
import Link from "next/link";
import MutualFundCalculator from "@/components/MutualFundCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Mutual Fund Calculator — SIP + Lumpsum Returns Calculator";
const description = "Calculate your mutual fund returns combining both SIP and lumpsum investments over time.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/mutual-fund-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/mutual-fund-calculator") },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Mutual Fund Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Mutual Fund Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">Project your mutual fund portfolio value combining a monthly SIP with a one-time lumpsum investment.</p>

      <div className="mt-10">
        <MutualFundCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li><Link href="/calculator/sip-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">SIP Calculator</Link></li>
          <li><Link href="/calculator/xirr-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">XIRR Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
