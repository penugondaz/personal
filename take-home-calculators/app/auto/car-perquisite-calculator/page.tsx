import type { Metadata } from "next";
import Link from "next/link";
import CarPerquisiteCalculator from "@/components/CarPerquisiteCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "Company Car Perquisite Tax Calculator India 2025-26";
const DESCRIPTION = "Calculate income tax on your company-provided car. Perquisite value under Rule 3 for engine ≤1600cc and >1600cc, with and without driver.";
const URL = "/auto/car-perquisite-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
};

const jsonLd = buildJsonLd(
  breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Auto", href: "/auto" },
    { name: TITLE, href: URL },
  ]),
  calculatorSchema({ name: TITLE, description: DESCRIPTION, url: URL }),
);

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/auto" className="hover:text-brand">Auto</Link>
        <span className="mx-1.5">/</span>
        <span>{TITLE}</span>
      </nav>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">{TITLE}</h1>
      <p className="mt-4 text-lg text-ink-soft">{DESCRIPTION}</p>
      <div className="mt-10 rounded-2xl border border-rule bg-surface p-5 shadow-card-lg sm:p-7">
        <CarPerquisiteCalculator />
      </div>
      <section className="mt-10">
        <h2 className="font-display text-xl text-ink mb-4">More Auto Calculators</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          {[
            { href: "/auto", label: "All Auto Calculators" },
            { href: "/auto/ctc-car-benefit-calculator", label: "CTC Car Benefit" },
            { href: "/auto/car-lease-vs-buy-calculator", label: "Lease vs Buy" },
            { href: "/auto/car-perquisite-calculator", label: "Perquisite Tax" },
            { href: "/auto/fuel-reimbursement-calculator", label: "Fuel Reimbursement" },
            { href: "/calculator/income-tax-calculator", label: "Income Tax Calculator" },
          ].map(l => (
            <li key={l.href}>
              <Link href={l.href} className="block rounded-md border border-rule bg-surface px-4 py-3
                text-center text-sm font-medium text-brand hover:border-brand transition">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
