import type { Metadata } from "next";
import Link from "next/link";
import EpfVsPpfCalculator from "@/components/EpfVsPpfCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "EPF vs PPF Calculator — Compare Returns Side by Side";
const DESCRIPTION = "Compare EPF and PPF returns with a side-by-side calculator. See year-by-year corpus growth, total interest earned, and which builds more wealth. Includes feature comparison table.";
const URL = "/calculator/epf-vs-ppf";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
};

const faqs = [
  {
    question: "Which is better — EPF or PPF?",
    answer: "EPF typically wins on returns because it earns a higher interest rate (8.25% vs 7.1%) and includes an employer contribution of 3.67% which effectively boosts your return. However, PPF is available to everyone including the self-employed, has fully tax-free interest with no threshold, and offers a loan facility. Most salaried employees should maximise EPF/VPF first, then use PPF as an additional tax-free savings vehicle.",
  },
  {
    question: "Does EPF include employer contribution in this calculator?",
    answer: "Yes — the EPF corpus includes both your 12% employee contribution and the employer's 3.67% EPF contribution. The remaining 8.33% goes to EPS (Employee Pension Scheme), not your EPF account. This is why EPF typically builds a larger corpus.",
  },
  {
    question: "What is VPF and should I use it instead of PPF?",
    answer: "VPF (Voluntary Provident Fund) lets you contribute more than the mandatory 12% to your EPF account at the same 8.25% rate. Since VPF interest is tax-free up to ₹2.5 lakh annual contribution, VPF generally beats PPF on rate. However PPF has no threshold on tax-free interest, making it better for high contributors.",
  },
  {
    question: "Is PPF interest truly tax-free?",
    answer: "Yes — PPF has EEE (Exempt-Exempt-Exempt) status with no upper limit. Your deposits qualify for Section 80C, interest is fully tax-free, and the maturity amount is tax-free. Unlike EPF, PPF interest does not become taxable beyond any threshold.",
  },
  {
    question: "Can I have both EPF and PPF?",
    answer: "Absolutely. EPF is automatic for salaried employees. PPF can be opened separately at a post office or bank. Many financial planners recommend both — EPF/VPF for higher returns, PPF for fully tax-free interest and flexibility.",
  },
];

export default function EpfVsPpfPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Calculators", href: "/calculator" },
      { name: "EPF vs PPF Calculator", href: URL },
    ]),
    calculatorSchema({
      name: "EPF vs PPF Calculator India",
      description: DESCRIPTION,
      url: URL,
    }),
    faqSchema(faqs),
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/calculator" className="hover:text-brand">Calculators</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">EPF vs PPF</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">EPF vs PPF Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Compare EPF and PPF returns side by side. Enter your basic salary and PPF deposit amount
        to see which builds more wealth, with a full year-by-year breakdown.
      </p>

      <div className="mt-10">
        <EpfVsPpfCalculator />
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink">Which Should You Choose?</h2>
        <div className="mt-4 space-y-3 text-ink-soft">
          <p>
            If you are salaried, EPF is automatic — your 12% and your employer&apos;s 3.67% flow
            in every month. The EPF rate (8.25%) is also higher than PPF (7.1%), so for most
            salaried people, EPF already forms the core of retirement savings.
          </p>
          <p>
            The real decision is whether to supplement with <strong className="text-ink">VPF</strong>{" "}
            (more EPF at 8.25%, locked until resignation/retirement) or{" "}
            <strong className="text-ink">PPF</strong> (slightly lower rate but fully tax-free
            beyond any threshold, accessible after 15 years, and available as a loan in years
            3–6). PPF also works for the self-employed and as a savings vehicle for children.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map(faq => (
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
          {[
            { href: "/calculator/epf-calculator", label: "EPF & VPF Calculator" },
            { href: "/calculator/ppf-calculator", label: "PPF Calculator" },
            { href: "/calculator/nps-calculator", label: "NPS Calculator" },
            { href: "/calculator/fire-calculator", label: "FIRE Calculator" },
            { href: "/tax-saving", label: "Tax Saving Guide" },
            { href: "/calculator/old-vs-new-tax-regime", label: "Old vs New Regime" },
          ].map(l => (
            <li key={l.href}>
              <Link href={l.href}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
