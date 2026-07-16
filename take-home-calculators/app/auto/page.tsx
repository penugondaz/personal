import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, buildJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Auto & Car Benefit Calculators India — Car Lease, Perquisite, CTC Car",
  description: "Free calculators for car benefits in your CTC — car lease vs buy, perquisite tax, CTC car benefit comparison (cash vs lease vs company car), fuel reimbursement tax. Updated for FY 2025-26.",
  alternates: { canonical: absoluteUrl("/auto") },
};

const CALCS = [
  { href: "/auto/ctc-car-benefit-calculator",    emoji: "🚗", title: "CTC Car Benefit Calculator",    desc: "Cash allowance vs car lease vs company car — which puts more money in your pocket?" },
  { href: "/auto/car-lease-vs-buy-calculator",   emoji: "🔑", title: "Car Lease vs Buy Calculator",   desc: "Compare total cost of company car lease vs taking a loan and buying outright." },
  { href: "/auto/car-perquisite-calculator",     emoji: "🧾", title: "Car Perquisite Tax Calculator", desc: "How much extra tax do you pay on a company-provided car? Rule 3 perquisite values." },
  { href: "/auto/fuel-reimbursement-calculator", emoji: "⛽", title: "Fuel Reimbursement Tax",        desc: "Is your fuel reimbursement taxable? New vs old regime impact on take-home." },
];

export default function AutoLandingPage() {
  const jsonLd = buildJsonLd(breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Auto", href: "/auto" },
  ]));

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span>Auto</span>
      </nav>

      <div className="flex items-center gap-4 mb-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-3xl">🚗</span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Auto Calculators</h1>
          <p className="text-sm text-ink-soft mt-0.5">Car benefits, lease vs buy, perquisite tax</p>
        </div>
      </div>

      <p className="text-base text-ink-soft leading-relaxed max-w-2xl mb-10">
        If you have a car benefit in your CTC — lease, car allowance, fuel reimbursement, or a
        company-provided car — these calculators show you the exact tax impact and which option
        puts the most money in your pocket.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {CALCS.map(c => (
          <Link key={c.href} href={c.href}
            className="group flex flex-col rounded-2xl border border-rule bg-surface p-5 shadow-card
              hover:border-brand hover:-translate-y-0.5 transition">
            <span className="text-3xl mb-3">{c.emoji}</span>
            <p className="font-semibold text-ink group-hover:text-brand transition">{c.title}</p>
            <p className="mt-2 text-sm text-ink-soft flex-1 leading-relaxed">{c.desc}</p>
            <span className="mt-4 text-sm font-medium text-brand">Calculate →</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-brand/20 bg-brand-soft p-5">
        <h2 className="font-semibold text-ink mb-2">💡 Key rule: Car lease is pre-tax</h2>
        <p className="text-sm text-ink-soft leading-relaxed">
          When your employer structures a car lease in your CTC, the lease amount is deducted from
          your gross salary BEFORE TDS is calculated. At a 30% tax bracket, a ₹15,000/month lease
          saves you approximately ₹5,600/month in tax — making it significantly better than taking
          the same amount as cash.
        </p>
      </div>
    </main>
  );
}
