import type { Metadata } from "next";
import Link from "next/link";
import InhandToCtcCalculator from "@/components/InhandToCtcCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";
import { calculateInhandToCtc } from "@/lib/calculators/inhand-to-ctc";
import { formatINR } from "@/lib/format";

const TITLE = "In-Hand to CTC Calculator — Reverse Salary Calculator India";
const DESCRIPTION = "Find out what CTC you need to negotiate to get your desired in-hand (take-home) salary. Reverse-calculates CTC accounting for PF, professional tax, and income tax under both regimes.";
const URL = "/salary/inhand-to-ctc-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: [
    "in hand to ctc calculator",
    "reverse salary calculator india",
    "ctc calculator from in hand salary",
    "50000 in hand ctc",
    "what ctc for desired take home salary",
    "salary negotiation calculator india",
  ],
};

const faqs = [
  {
    question: "How do I calculate CTC from in-hand salary?",
    answer: "There's no simple formula because income tax is progressive — it changes based on the income level. We use a reverse calculation: starting with your desired in-hand salary, we iteratively test different CTC values, run them through PF and tax calculations, and find the exact CTC that produces your target take-home amount.",
  },
  {
    question: "Why is the CTC much higher than my in-hand salary?",
    answer: "CTC includes several components that don't reach your bank account every month: employer's PF contribution (usually 12% of basic), gratuity (paid only after 5 years of service), and sometimes employer's NPS contribution or insurance premiums. On top of that, your gross salary itself has employee PF and income tax deducted before you get your in-hand amount. Typically, in-hand salary is 70-80% of CTC.",
  },
  {
    question: "Should I use new or old tax regime for this calculation?",
    answer: "If you don't claim significant deductions (80C, HRA, home loan interest), the new regime usually requires a lower CTC to achieve the same in-hand salary, since tax is generally lower. If you plan to claim deductions, switch to old regime in the calculator to see the CTC required after accounting for those benefits.",
  },
  {
    question: "Is this CTC estimate accurate for salary negotiation?",
    answer: "This is a close estimate based on standard salary structures (Basic = 40% of CTC, standard PF rules). Actual CTC requirements vary by employer based on how they structure Basic, HRA, special allowances, and benefits. Use this as a strong starting point in negotiations, but confirm the exact breakup with HR once you receive an offer.",
  },
  {
    question: "Does this account for the new Code on Wages 2026 changes?",
    answer: "The calculation uses Basic = 40% of CTC by default, which is a common industry average. Under the new Code on Wages being rolled out by employers in 2025-2026, the exact wage component structure may differ slightly by company, but the overall CTC-to-in-hand relationship remains broadly similar since total compensation isn't reduced — only reallocated between components.",
  },
];

export default function InhandToCtcPage() {
  // Sample table for illustration
  const sampleAmounts = [25000, 50000, 75000, 100000, 150000];
  const sampleResults = sampleAmounts.map(amt => ({
    monthly: amt,
    ...calculateInhandToCtc({ targetInHandMonthly: amt, regime: "new" }),
  }));

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Salary Calculators", href: "/salary" },
      { name: "In-Hand to CTC Calculator", href: URL },
    ]),
    calculatorSchema({
      name: "In-Hand to CTC Calculator India",
      description: DESCRIPTION,
      url: URL,
    }),
    faqSchema(faqs),
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/salary" className="hover:text-brand">Salary</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">In-Hand to CTC Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">In-Hand to CTC Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Know your desired take-home salary? Find out exactly what{" "}
        <strong className="text-ink">CTC you need to negotiate</strong> — accounting for PF
        contributions, professional tax, and income tax under both regimes.
      </p>

      <div className="mt-10">
        <InhandToCtcCalculator />
      </div>

      {/* How it works */}
      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink">How This Calculator Works</h2>
        <div className="mt-4 space-y-3 text-ink-soft text-sm leading-relaxed">
          <p>
            Going from in-hand salary to CTC isn&apos;t a simple multiplication because income tax
            is progressive — the rate changes as income rises. So we use a{" "}
            <strong className="text-ink">reverse calculation (binary search)</strong>: we test
            different CTC values, run each through the full salary breakup (Basic, HRA, PF,
            gratuity, tax), and find the exact CTC where your monthly in-hand matches your target.
          </p>
          <p>
            This means the calculation is just as accurate as our forward salary calculator —
            it&apos;s simply solving the same equation in reverse.
          </p>
        </div>
      </section>

      {/* Sample table */}
      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Common In-Hand to CTC Conversions</h2>
        <p className="mt-2 text-sm text-ink-soft">Based on new tax regime, standard salary structure</p>
        <div className="mt-4 overflow-hidden rounded-lg border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft">Desired In-Hand (Monthly)</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">Required CTC (Annual)</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">Required CTC (Monthly)</th>
              </tr>
            </thead>
            <tbody>
              {sampleResults.map(row => (
                <tr key={row.monthly} className="border-b border-rule last:border-0 hover:bg-paper">
                  <td className="px-4 py-2.5 font-medium text-ink">{formatINR(row.monthly)}</td>
                  <td className="tabular px-4 py-2.5 text-right text-brand font-medium">{formatINR(row.estimatedAnnualCtc)}</td>
                  <td className="tabular px-4 py-2.5 text-right text-ink-soft">{formatINR(row.estimatedMonthlyCtc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
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

      {/* Related */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: "/salary", label: "In-Hand Salary Calculator" },
            { href: "/salary/salary-structure-calculator", label: "Salary Structure Calculator" },
            { href: "/calculator/income-tax-calculator", label: "Income Tax Calculator" },
            { href: "/calculator/old-vs-new-tax-regime", label: "Old vs New Tax Regime" },
            { href: "/calculator/hra-calculator", label: "HRA Calculator" },
            { href: "/tax-saving", label: "Tax Saving Guide" },
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
