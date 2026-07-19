import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, webPageSchema, faqSchema, buildJsonLd } from "@/lib/schema";
import LandingHubLinks from "@/components/LandingHubLinks";
import LandingFaq from "@/components/LandingFaq";

const URL = "/auto";
const TITLE = "Auto & Car Benefit Calculators India — Car Lease, Perquisite, CTC Car";
const DESCRIPTION =
  "Free calculators for car benefits in your CTC — car lease vs buy, perquisite tax, CTC car benefit comparison (cash vs lease vs company car), fuel reimbursement tax. Updated for FY 2025-26.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
};

const QUICK_GLANCE = [
  { icon: "🚗", label: "CTC Car Benefit", desc: "Cash vs lease vs company car" },
  { icon: "🔑", label: "Lease vs Buy", desc: "Total cost comparison" },
  { icon: "🧾", label: "Perquisite Tax", desc: "Rule 3 taxable value" },
  { icon: "⛽", label: "Fuel Reimbursement", desc: "Taxable or exempt?" },
];

const CALCS = [
  { href: "/auto/ctc-car-benefit-calculator",    emoji: "🚗", title: "CTC Car Benefit Calculator",    desc: "Cash allowance vs car lease vs company car — which puts more money in your pocket?" },
  { href: "/auto/car-lease-vs-buy-calculator",   emoji: "🔑", title: "Car Lease vs Buy Calculator",   desc: "Compare total cost of company car lease vs taking a loan and buying outright." },
  { href: "/auto/car-perquisite-calculator",     emoji: "🧾", title: "Car Perquisite Tax Calculator", desc: "How much extra tax do you pay on a company-provided car? Rule 3 perquisite values." },
  { href: "/auto/fuel-reimbursement-calculator", emoji: "⛽", title: "Fuel Reimbursement Tax",        desc: "Is your fuel reimbursement taxable? New vs old regime impact on take-home." },
];

const FAQS = [
  {
    question: "Is a company car lease better than a cash allowance?",
    answer:
      "Usually yes, if you were going to buy or lease a car anyway. A car lease structured into your CTC is deducted from gross salary before tax, effectively giving you the car at a discount equal to your tax rate. A cash car allowance, by contrast, is fully taxable like regular salary. The CTC Car Benefit Calculator compares both against buying with a personal loan.",
  },
  {
    question: "How is car perquisite tax calculated?",
    answer:
      "Under Income Tax Rule 3, if the company car is used for both official and personal purposes, a fixed perquisite value is added to your taxable income — typically ₹1,800/month for cars up to 1.6L engine capacity, or ₹2,400/month for larger engines (plus ₹900/month if a driver is provided). This flat amount is taxed at your slab rate, regardless of the car's actual value.",
  },
  {
    question: "Is fuel reimbursement taxable?",
    answer:
      "If fuel is reimbursed against actual bills for official use of a company-owned car, it's generally exempt up to the documented business use, with only the personal-use portion (via the perquisite value) being taxable. Under the new tax regime, some of these exemptions may not apply the same way, so it's worth checking both regimes.",
  },
  {
    question: "Does a car lease affect my take-home salary?",
    answer:
      "Yes — since the lease amount is deducted from gross salary before computing tax, your in-hand salary reduces by the lease EMI amount, but your tax outgo also drops. Net-net, most people in the 20-30% tax bracket come out ahead compared to paying the same EMI from post-tax cash.",
  },
];

export default function AutoLandingPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Auto", href: URL },
    ]),
    webPageSchema({ name: TITLE, description: DESCRIPTION, url: URL }),
    faqSchema(FAQS)
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Auto</span>
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

      {/* Quick glance */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {QUICK_GLANCE.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-rule bg-surface px-4 py-3 shadow-card">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-medium text-ink text-sm">{item.label}</p>
              <p className="text-xs text-ink-soft">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

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

      {/* Educational content */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How Car Benefits Work in Indian CTC Structures</h2>
        <p className="mt-3 text-ink-soft">
          Many Indian companies, especially in tech and consulting, let employees structure a
          car — either leased by the company or bought personally with a reimbursed EMI — as
          part of their CTC. This is attractive because the lease or EMI amount is deducted from
          gross salary before tax is computed, unlike a cash allowance which is taxed just like
          regular salary. The trade-off is a fixed monthly perquisite tax under Rule 3, which is
          usually far smaller than the tax saved.
        </p>
        <p className="mt-3 text-ink-soft">
          At the end of the lease period (typically 3-4 years), most companies let you buy the
          car at its depreciated book value, which is often well below market price. Whether this
          beats simply taking a car loan and buying outright depends on your tax bracket, the
          lease markup your employer charges, and how long you plan to keep the car — exactly
          what the Car Lease vs Buy Calculator compares.
        </p>
      </section>

      <LandingFaq faqs={FAQS} />
      <LandingHubLinks currentHref={URL} />
    </main>
  );
}
