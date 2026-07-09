import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, webPageSchema, buildJsonLd } from "@/lib/schema";

const URL = "/loans-deposits";
const TITLE = "Loans & Deposits Calculators — EMI, FD, RD, Compound Interest";
const DESCRIPTION =
  "Free loan and deposit calculators for India — EMI, fixed deposit, recurring deposit, compound interest, and simple interest. Plan loans and fixed-income savings.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
};

const CALCULATORS = [
  {
    href: "/calculator/emi-calculator",
    icon: "🏠",
    title: "EMI Calculator",
    desc: "Monthly EMI, total interest, and amortization schedule for any loan.",
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

export default function LoansDepositsLandingPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Loans & Deposits", href: URL },
    ]),
    webPageSchema({ name: TITLE, description: DESCRIPTION, url: URL })
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Loans & Deposits</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Loans & Deposits Calculators</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Plan loan repayments and fixed-income savings — EMI, fixed and recurring deposits,
        and interest calculations.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
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
    </main>
  );
}
