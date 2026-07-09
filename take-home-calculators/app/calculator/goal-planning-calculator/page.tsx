import type { Metadata } from "next";
import Link from "next/link";
import GoalPlanningCalculator from "@/components/GoalPlanningCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Goal Planning Calculator — How Much SIP Do You Need?";
const description = "Calculate the monthly SIP or lumpsum needed to reach your financial goal — retirement, house, education, or any target amount.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/goal-planning-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/goal-planning-calculator") },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/investments" className="hover:text-brand">Investments</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Goal Planning Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Goal Planning Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">Work backward from a target amount to find the monthly SIP or lumpsum investment needed to get there.</p>

      <div className="mt-10">
        <GoalPlanningCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li><Link href="/calculator/sip-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">SIP Calculator</Link></li>
          <li><Link href="/calculator/swp-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">SWP Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
