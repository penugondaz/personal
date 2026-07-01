import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, buildJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Us — SalaryTools India",
  description: "SalaryTools India is a free financial calculator suite built for Indian salaried professionals. Learn about our mission, team, and commitment to accurate, unbiased tools.",
  alternates: { canonical: absoluteUrl("/about") },
};

const jsonLd = buildJsonLd(
  breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About SalaryTools India",
    "url": absoluteUrl("/about"),
    "publisher": {
      "@type": "Organization",
      "name": "SalaryTools India",
      "url": "https://salarytools.in",
      "foundingDate": "2026",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Nizampet",
        "addressLocality": "Hyderabad",
        "postalCode": "500090",
        "addressCountry": "IN",
      },
      "founders": [
        { "@type": "Person", "name": "Praveen Penugonda" },
        { "@type": "Person", "name": "Venkatesh Babu Gorantla" },
      ],
    },
  }
);

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">About Us</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">About SalaryTools India</h1>

      <section className="mt-8 space-y-4 text-ink-soft leading-relaxed">
        <p>
          <strong className="text-ink">SalaryTools India</strong> is a free, privacy-first financial
          calculator suite built specifically for Indian salaried professionals. We launched in 2026
          with a simple goal: give every working Indian clear, accurate answers to the questions that
          matter most — how much do I actually take home, how much tax do I really pay, and how can I
          make my money work harder.
        </p>
        <p>
          India&apos;s tax and salary landscape is genuinely complex — CTC vs in-hand, old vs new tax
          regime, PF wage ceilings, gratuity eligibility, HRA exemptions, Code on Wages restructuring —
          and most people have no easy way to understand how these rules affect their specific
          situation. We built SalaryTools to change that.
        </p>
        <p>
          Every calculator on this site runs entirely in your browser. We don&apos;t store your
          salary, tax, or personal financial data anywhere. There are no accounts to create, no
          emails to verify, and no personal data collected to use our tools.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">What We've Built</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { label: "Salary & CTC Calculators", desc: "In-hand salary, CTC to in-hand, salary structure, inhand-to-CTC reverse calculator", href: "/salary" },
            { label: "Income Tax Calculator", desc: "New vs old regime comparison, slab breakdown, deductions (80C, VPF, NPS, HRA)", href: "/calculator/income-tax-calculator" },
            { label: "Tax Saving Guides", desc: "Personalised tax-saving analysis for 47 salary levels from 1 LPA to 60 LPA", href: "/tax-saving" },
            { label: "Salary Growth Projections", desc: "5 and 10-year salary trajectories across hike scenarios, with job-switch comparison", href: "/salary-growth" },
            { label: "Retirement Calculators", desc: "EPF, PPF, NPS, FIRE, EPF vs PPF comparison", href: "/calculator/epf-calculator" },
            { label: "Investment Calculators", desc: "SIP, lump sum, FD, RD, SWP, compound interest, XIRR, CAGR", href: "/calculator/sip-calculator" },
            { label: "Loan Calculators", desc: "EMI for home, car and personal loans with full amortization schedule", href: "/calculator/emi-calculator" },
            { label: "Government Scheme Calculators", desc: "PM Surya Ghar solar subsidy calculator, NSC, SCSS", href: "/calculator/pm-surya-ghar-calculator" },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="rounded-xl border border-rule bg-surface p-4 hover:border-brand hover:-translate-y-0.5 transition shadow-card">
              <p className="font-semibold text-ink">{item.label}</p>
              <p className="mt-1 text-xs text-ink-soft">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Our Principles</h2>
        <div className="mt-4 space-y-4">
          {[
            { title: "Accuracy first", body: "Every calculator is built against official government rules — Income Tax Act, EPF Act, Payment of Gratuity Act, and updated for each financial year. We update our calculators when rules change." },
            { title: "No login, no data collection", body: "All calculations happen in your browser. We do not collect, store, or sell your financial data. You can use every tool on this site completely anonymously." },
            { title: "Free, always", body: "SalaryTools is free to use for everyone. We may show non-intrusive ads in future to sustain the site, but our calculators will always remain free with no paywalls." },
            { title: "India-specific", body: "We are built for India — Indian tax slabs, Indian PF rules, Indian salary structures, and Indian salary benchmarks. Not adapted from global tools." },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-rule bg-surface p-4 shadow-card">
              <p className="font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">The Team</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { name: "Praveen Penugonda", role: "Co-founder" },
            { name: "Venkatesh Babu Gorantla", role: "Co-founder" },
          ].map(person => (
            <div key={person.name} className="rounded-xl border border-rule bg-surface p-5 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand font-display text-xl font-bold">
                {person.name.charAt(0)}
              </div>
              <p className="mt-3 font-semibold text-ink">{person.name}</p>
              <p className="text-sm text-ink-soft">{person.role}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          We are based in Hyderabad, India. Have a question or suggestion?{" "}
          <Link href="/contact" className="text-brand hover:underline">Get in touch with us.</Link>
        </p>
      </section>
    </main>
  );
}
