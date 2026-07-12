import type { Metadata } from "next";
import Link from "next/link";
import RentalYieldCalculator from "@/components/RentalYieldCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "Rental Yield Calculator India — Is Your Property a Good Investment?";
const DESCRIPTION = "Calculate gross and net rental yield on any property. Compare against Indian residential market benchmarks of 2-4% and find your break-even period.";
const URL = "/real-estate/rental-yield-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: ['rental yield calculator india', 'property rental return calculator', 'rental income yield india'],
};

const jsonLd = buildJsonLd(
  breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Real Estate", href: "/real-estate" },
    { name: TITLE, href: URL },
  ]),
  calculatorSchema({ name: TITLE, description: DESCRIPTION, url: URL }),
);

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/real-estate" className="hover:text-brand">Real Estate</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{TITLE}</span>
      </nav>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">{TITLE}</h1>
      <p className="mt-4 text-lg text-ink-soft">{DESCRIPTION}</p>
      <div className="mt-10">
        <RentalYieldCalculator />
      </div>
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: "/real-estate", label: "All Real Estate" },
            { href: "/real-estate/home-affordability-calculator", label: "Home Affordability" },
            { href: "/real-estate/rent-vs-buy-calculator", label: "Rent vs Buy" },
            { href: "/real-estate/rental-yield-calculator", label: "Rental Yield" },
            { href: "/real-estate/stamp-duty-calculator", label: "Stamp Duty" },
            { href: "/calculator/emi-calculator", label: "EMI Calculator" },
          ].map(l => (
            <li key={l.href}>
              <Link href={l.href} className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
