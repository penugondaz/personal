import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, webPageSchema, faqSchema, buildJsonLd } from "@/lib/schema";
import LandingHubLinks from "@/components/LandingHubLinks";
import LandingFaq from "@/components/LandingFaq";

const URL = "/loans-deposits";
const TITLE = "Loan & Deposit Calculators India — EMI, FD, RD, Compound Interest";
const DESCRIPTION =
  "Free loan and deposit calculators for India — EMI, fixed deposit, recurring deposit, compound interest, and simple interest. Plan loan repayments and fixed-income savings accurately.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
};

const QUICK_GLANCE = [
  { icon: "🏠", label: "EMI Schedule", desc: "Monthly installment + amortization" },
  { icon: "🏦", label: "FD Maturity", desc: "Quarterly compounding value" },
  { icon: "🔁", label: "RD Maturity", desc: "Monthly deposit growth" },
  { icon: "📊", label: "Compound Interest", desc: "Any compounding frequency" },
  { icon: "🏡", label: "Loan Eligibility", desc: "Max loan by income" },
  { icon: "🚗", label: "Car Loan EMI", desc: "Vehicle financing installment" },
];

const CALCULATORS = [
  {
    href: "/calculator/emi-calculator",
    icon: "🏠",
    title: "EMI Calculator",
    desc: "Monthly EMI, total interest, and amortization schedule for any loan.",
  },
  {
    href: "/calculator/home-loan-eligibility-calculator",
    icon: "🏡",
    title: "Home Loan Eligibility",
    desc: "How much home loan you can qualify for, based on income and existing EMIs.",
  },
  {
    href: "/calculator/car-loan-emi-calculator",
    icon: "🚗",
    title: "Car Loan EMI Calculator",
    desc: "Monthly installment and interest for financing a car.",
  },
  {
    href: "/calculator/fd-calculator",
    icon: "🏦",
    title: "Fixed Deposit Calculator",
    desc: "FD maturity value with simple or compound interest, quarterly compounding.",
  },
  {
    href: "/calculator/rd-calculator",
    icon: "🔁",
    title: "Recurring Deposit Calculator",
    desc: "RD maturity value from monthly deposits and interest rate.",
  },
  {
    href: "/calculator/compound-interest-calculator",
    icon: "📊",
    title: "Compound Interest Calculator",
    desc: "Compound interest on a principal with any compounding frequency.",
  },
  {
    href: "/calculator/simple-interest-calculator",
    icon: "➗",
    title: "Simple Interest Calculator",
    desc: "Simple interest on principal, rate, and time period.",
  },
];

const FAQS = [
  {
    question: "How is EMI calculated?",
    answer:
      "EMI is calculated using the reducing-balance formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the loan principal, r is the monthly interest rate, and n is the number of monthly installments. Each EMI includes a shifting mix of interest and principal — interest is front-loaded, so early EMIs pay down mostly interest.",
  },
  {
    question: "FD or RD — which is better for me?",
    answer:
      "Choose an FD if you have a lumpsum to deposit today and want it locked in at a fixed rate. Choose an RD if you want to build savings gradually with a fixed amount every month — it works like a forced savings habit. Both are taxed identically: interest is added to your income and taxed at your slab rate.",
  },
  {
    question: "Is FD interest taxable in India?",
    answer:
      "Yes. FD interest is fully taxable at your income tax slab rate, and banks deduct TDS at 10% if your interest income from that bank exceeds ₹40,000/year (₹50,000 for senior citizens) in a financial year. You can claim a refund at tax filing time if your total tax liability is lower.",
  },
  {
    question: "What's a good EMI-to-income ratio?",
    answer:
      "Most lenders and financial planners recommend keeping your total EMI obligations (all loans combined) under 40-50% of your monthly take-home income. Going beyond that leaves little room for savings, emergencies, or a rate hike on floating-rate loans.",
  },
];

export default function LoansDepositsLandingPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Loans & Deposits", href: URL },
    ]),
    webPageSchema({ name: TITLE, description: DESCRIPTION, url: URL }),
    faqSchema(FAQS)
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Loans & Deposits</span>
      </nav>

      <div className="flex items-center gap-4 mb-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-3xl">💳</span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Loan & Deposit Calculators</h1>
          <p className="text-sm text-ink-soft mt-0.5">EMI, FD, RD, compound & simple interest</p>
        </div>
      </div>

      <p className="text-lg text-ink-soft leading-relaxed max-w-2xl">
        Taking a loan for a car or home, checking how much you can afford to borrow, or parking
        savings in a fixed or recurring deposit — these calculators use the exact amortization
        and compounding math Indian banks use, so the numbers you see here match your loan
        statement or FD receipt.
      </p>

      {/* Quick glance */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_GLANCE.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-rule bg-surface px-4 py-3 shadow-card">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-medium text-ink">{item.label}</p>
              <p className="text-xs text-ink-soft">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Calculator grid */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">All Loan & Deposit Calculators</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {CALCULATORS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex items-start gap-4 rounded-xl border border-rule bg-surface px-5 py-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg"
            >
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="font-medium text-brand">{c.title}</p>
                <p className="mt-0.5 text-sm text-ink-soft">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Use-case callout */}
      <section className="mt-12 rounded-xl border border-brand/20 bg-brand-soft p-6">
        <h2 className="font-display text-xl text-ink">Planning to take a loan?</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Start with Home Loan Eligibility or the EMI Calculator to know your monthly outgo
          before you commit. If you&apos;re buying property specifically, the Real Estate section
          has a dedicated Home Affordability calculator that factors in your full salary picture.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/calculator/emi-calculator"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
            Calculate EMI →
          </Link>
          <Link href="/real-estate/home-affordability-calculator"
            className="rounded-full border border-brand px-5 py-2 text-sm font-medium text-brand hover:bg-brand-soft transition">
            Home Affordability
          </Link>
        </div>
      </section>

      {/* Educational content */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How Loan EMIs and Deposits Work</h2>
        <p className="mt-3 text-ink-soft">
          An EMI (Equated Monthly Installment) is a fixed monthly payment that covers both
          principal and interest on a loan, calculated so the loan is fully repaid over its
          tenure. Because interest is charged on the reducing balance, a larger share of your
          early EMIs goes toward interest — which is why prepaying a loan early saves
          disproportionately more interest than paying the same extra amount later in the tenure.
        </p>
        <p className="mt-3 text-ink-soft">
          On the savings side, Fixed Deposits (FDs) lock in a lumpsum at a guaranteed interest
          rate for a chosen tenure, with most Indian banks compounding quarterly. Recurring
          Deposits (RDs) work the same way but let you build the deposit gradually with equal
          monthly contributions — useful for goal-based saving without needing a lumpsum upfront.
          Both are considered low-risk, capital-guaranteed instruments, in contrast to
          market-linked options like mutual funds.
        </p>
      </section>

      <LandingFaq faqs={FAQS} />
      <LandingHubLinks currentHref={URL} />
    </main>
  );
}
