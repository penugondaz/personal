import type { Metadata } from "next";
import Link from "next/link";
import EpfVsPpfCalculator from "@/components/EpfVsPpfCalculator";
import { EPF_INTEREST_RATE_FY2025_26 } from "@/lib/calculators/epf";
import { PPF_INTEREST_RATE, PPF_MAX_ANNUAL_DEPOSIT } from "@/lib/calculators/ppf";
import { formatINR } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

const title = "EPF vs PPF Calculator — Compare Returns Side by Side";
const description =
  "Compare EPF and PPF returns with a detailed calculator. See year-by-year corpus growth, total interest earned, and which option builds more wealth over your investment horizon.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/epf-vs-ppf") },
  openGraph: { title, description, url: absoluteUrl("/calculator/epf-vs-ppf") },
};

const comparisonRows: { feature: string; epf: string; ppf: string }[] = [
  { feature: "Who can open one",   epf: "Salaried employees only",                        ppf: "Any resident Indian (including self-employed)" },
  { feature: "Interest rate",      epf: `${(EPF_INTEREST_RATE_FY2025_26*100).toFixed(2)}% p.a.`, ppf: `${(PPF_INTEREST_RATE*100).toFixed(1)}% p.a.` },
  { feature: "Contribution",       epf: "12% of Basic+DA (mandatory, employer-matched)",  ppf: `Voluntary, up to ${formatINR(PPF_MAX_ANNUAL_DEPOSIT)}/year` },
  { feature: "Employer match",     epf: "Yes — employer adds 3.67% EPF + 8.33% EPS",     ppf: "No" },
  { feature: "Lock-in",            epf: "Until retirement / resignation",                  ppf: "15 years minimum" },
  { feature: "Tax treatment",      epf: "EEE (taxable if contribution > ₹2.5L/yr)",       ppf: "Fully EEE — no threshold" },
  { feature: "Partial withdrawal", epf: "Allowed for specific reasons (medical, home…)",  ppf: "From 7th year onward" },
  { feature: "Loan facility",      epf: "Not available",                                   ppf: "Available years 3–6" },
];

const faqs = [
  { question: "Which is better — EPF or PPF?", answer: "EPF typically wins on returns because it earns a higher interest rate (8.25% vs 7.1%) and includes an employer contribution of 3.67% which effectively boosts your effective return. However, PPF is available to everyone including the self-employed, has fully tax-free interest with no threshold, and offers a loan facility. Most salaried employees should maximise EPF/VPF first, then use PPF if they want an additional tax-free savings vehicle." },
  { question: "Does EPF include employer contribution in this calculator?", answer: "Yes — the EPF corpus in this calculator includes both your 12% employee contribution and the employer's 3.67% EPF contribution (the remaining 8.33% goes to EPS, not your EPF account). This is why EPF typically builds a larger corpus than PPF for the same basic salary." },
  { question: "What is VPF and should I use it?", answer: "VPF (Voluntary Provident Fund) lets you contribute more than the mandatory 12% to your EPF account, earning the same 8.25% rate. Since the interest is tax-free up to ₹2.5 lakh annual contribution, VPF is one of the best fixed-income options available and generally beats PPF on rate alone." },
  { question: "Is PPF interest truly tax-free?", answer: "Yes — PPF has EEE (Exempt-Exempt-Exempt) status. Your deposits qualify for Section 80C deduction, interest earned is fully tax-free with no upper limit, and the maturity amount is tax-free. Unlike EPF, there is no threshold beyond which PPF interest becomes taxable." },
  { question: "Can I have both EPF and PPF?", answer: "Absolutely — and many financial planners recommend it. EPF is compulsory for salaried employees, so you have it automatically. PPF can be opened separately at a post office or bank and used as an additional tax-free savings vehicle, particularly useful for goals beyond EPF (which is locked until retirement/resignation)." },
];

export default function EpfVsPpfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">EPF vs PPF</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">EPF vs PPF Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Compare EPF and PPF returns side by side — see year-by-year corpus growth, total interest
        earned, and which builds more wealth over your investment horizon.
      </p>

      <div className="mt-8">
        <EpfVsPpfCalculator />
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink">Feature Comparison</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-rule">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-rule bg-paper text-left">
              <th className="px-4 py-2.5 font-medium text-ink-soft">Feature</th>
              <th className="px-4 py-2.5 font-medium text-brand">EPF</th>
              <th className="px-4 py-2.5 font-medium text-orange-600">PPF</th>
            </tr></thead>
            <tbody>
              {comparisonRows.map(row => (
                <tr key={row.feature} className="border-b border-rule last:border-0 hover:bg-paper">
                  <td className="px-4 py-2.5 font-medium text-ink">{row.feature}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{row.epf}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{row.ppf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Which Should You Prioritise?</h2>
        <p className="mt-3 text-ink-soft">
          If you are salaried, EPF is automatic — your 12% and your employer&apos;s 3.67% flow in
          every month. The EPF rate ({(EPF_INTEREST_RATE_FY2025_26*100).toFixed(2)}%) is also higher
          than PPF ({(PPF_INTEREST_RATE*100).toFixed(1)}%), so EPF already forms the core of
          retirement savings for most salaried people.
        </p>
        <p className="mt-3 text-ink-soft">
          The real decision is whether to supplement with <strong>VPF</strong> (more EPF at the same
          8.25% rate) or <strong>PPF</strong> (slightly lower rate but fully tax-free beyond any
          threshold, accessible after 15 years, and available as a loan in years 3–6).
        </p>
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
            { href: "/calculator/epf-calculator",        label: "EPF & VPF Calculator" },
            { href: "/calculator/ppf-calculator",        label: "PPF Calculator" },
            { href: "/calculator/nps-calculator",        label: "NPS Calculator" },
            { href: "/calculator/fire-calculator",       label: "FIRE Calculator" },
            { href: "/tax-saving",                       label: "Tax Saving Guide" },
            { href: "/calculator/old-vs-new-tax-regime", label: "Old vs New Regime" },
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
