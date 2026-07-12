import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, buildJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Real Estate Calculators India — Property, Rent, Stamp Duty",
  description: "Free real estate calculators for India. Calculate home affordability from salary, stamp duty by state, rental yield, rent vs buy comparison, and property appreciation.",
  alternates: { canonical: absoluteUrl("/real-estate") },
  openGraph: { title: "Real Estate Calculators India", url: absoluteUrl("/real-estate") },
};

const CALCULATORS = [
  { href: "/real-estate/home-affordability-calculator", emoji: "🏠", title: "Home Affordability Calculator", desc: "How much home can you afford based on your salary? Find your max loan, down payment, and property budget." },
  { href: "/real-estate/rent-vs-buy-calculator", emoji: "⚖️", title: "Rent vs Buy Calculator", desc: "Compare 20-year net worth from buying vs renting. Accounts for EMI, appreciation, and investment returns." },
  { href: "/real-estate/rental-yield-calculator", emoji: "📊", title: "Rental Yield Calculator", desc: "Calculate gross and net rental yield on any property. Benchmark against Indian market averages." },
  { href: "/real-estate/stamp-duty-calculator", emoji: "📋", title: "Stamp Duty Calculator", desc: "State-wise stamp duty and registration charges for all 22 states. Includes female owner discounts." },
  { href: "/real-estate/registration-charges-calculator", emoji: "📝", title: "Registration Charges Calculator", desc: "Calculate property registration charges, legal fees, and total buying cost by state." },
  { href: "/real-estate/property-appreciation-calculator", emoji: "📈", title: "Property Appreciation Calculator", desc: "Project future property value with city-wise historical appreciation rates and year-by-year breakdown." },
];

const jsonLd = buildJsonLd(
  breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Real Estate Calculators", href: "/real-estate" },
  ]),
);

export default function RealEstateLandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Real Estate Calculators</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Real Estate Calculators</h1>
      <p className="mt-4 text-lg text-ink-soft max-w-2xl">
        Every calculator you need for India&apos;s property market — from figuring out how much home
        you can afford on your salary, to stamp duty by state, rental yield, and 20-year rent vs buy analysis.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CALCULATORS.map(calc => (
          <Link key={calc.href} href={calc.href}
            className="group flex flex-col rounded-2xl border border-rule bg-surface p-5 shadow-card hover:border-brand hover:-translate-y-0.5 transition">
            <span className="text-3xl mb-3">{calc.emoji}</span>
            <p className="font-semibold text-ink group-hover:text-brand transition">{calc.title}</p>
            <p className="mt-2 text-sm text-ink-soft flex-1">{calc.desc}</p>
            <span className="mt-4 text-sm font-medium text-brand">Calculate →</span>
          </Link>
        ))}
      </div>

      <section className="mt-14 rounded-xl border border-brand/20 bg-brand-soft p-6">
        <h2 className="font-display text-xl text-ink">Planning to buy a home?</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Start with the Home Affordability Calculator to know your budget, then use Stamp Duty to estimate
          registration costs, and run a Rent vs Buy comparison to make the final call.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/real-estate/home-affordability-calculator"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
            Check Affordability →
          </Link>
          <Link href="/calculator/emi-calculator"
            className="rounded-full border border-brand px-5 py-2 text-sm font-medium text-brand hover:bg-brand-soft transition">
            EMI Calculator
          </Link>
        </div>
      </section>
    </main>
  );
}
