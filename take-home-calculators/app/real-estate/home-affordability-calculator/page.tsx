import type { Metadata } from "next";
import Link from "next/link";
import HomeAffordabilityCalculator from "@/components/HomeAffordabilityCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "Home Affordability Calculator — How Much Home Can You Afford?";
const DESCRIPTION = "Calculate your maximum property budget, home loan eligibility, and down payment based on your salary. Know exactly how much home you can afford in India.";
const URL = "/real-estate/home-affordability-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: ['home affordability calculator india', 'home loan eligibility from salary', 'how much home loan on salary'],
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
        <HomeAffordabilityCalculator />
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
