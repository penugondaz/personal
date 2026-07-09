import type { Metadata } from "next";
import Link from "next/link";
import EpfVpfCalculator from "@/components/EpfVpfCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE       = "EPF & VPF Calculator — Provident Fund Interest & Maturity Calculator";
const DESCRIPTION = "Calculate your EPF and VPF monthly contributions, employer share, and projected maturity value at the current 8.25% interest rate.";
const URL         = "/calculator/epf-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
};

const faqs = [
  { question: "What is the current EPF interest rate?", answer: "The EPF interest rate for FY 2024-25 is 8.25% per annum, credited annually to member accounts. The rate is declared by the EPFO trustees each year after the government's approval." },
  { question: "Can I withdraw my EPF before retirement?", answer: "Partial withdrawals are allowed for specific purposes like medical emergencies, home purchase, education, or marriage after a minimum service period. Full withdrawal is allowed on retirement (age 58) or after 2 months of unemployment." },
  { question: "What is VPF and is it worth it?", answer: "VPF (Voluntary Provident Fund) lets you contribute more than the mandatory 12% of basic salary to your PF account, earning the same 8.25% interest rate. Since the interest is tax-free up to ₹2.5 lakh annual contribution, VPF is one of the best fixed-income options available." },
];

const relatedLinks = [
  { label: "PPF Calculator",      href: "/calculator/ppf-calculator" },
  { label: "NPS Calculator",      href: "/calculator/nps-calculator" },
  { label: "Gratuity Calculator", href: "/calculator/gratuity-calculator" },
  { label: "Tax Saving Guide",    href: "/tax-saving" },
];

export default function Page() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Retirement", href: "/retirement" },
      { name: "EPF & VPF Calculator", href: URL },
    ]),
    calculatorSchema({ name: "EPF & VPF Calculator India", description: DESCRIPTION, url: URL }),
    faqSchema(faqs),
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/retirement" className="hover:text-brand">Retirement</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">EPF & VPF Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">EPF & VPF Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate your monthly EPF contributions, employer&apos;s share, and projected maturity value.
        Includes VPF and the impact of salary increments over time.
      </p>

      <div className="mt-10">
        <EpfVpfCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-rule pb-4">
              <h3 className="font-medium text-ink">{faq.question}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {relatedLinks.map((l) => (
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
