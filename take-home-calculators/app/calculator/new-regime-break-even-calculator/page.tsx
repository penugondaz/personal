import type { Metadata } from "next";
import Link from "next/link";
import NewRegimeBreakEvenCalculator from "@/components/NewRegimeBreakEvenCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "New Regime Break-Even Calculator — At What Deduction Amount Does Old Regime Win?";
const DESCRIPTION =
  "Find the exact deduction amount at which the old tax regime starts beating the new regime for your income — with a full chart and year-by-year comparison. FY 2025-26 slabs.";
const URL = "/calculator/new-regime-break-even-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: [
    "new regime break even calculator",
    "old vs new tax regime break even point",
    "at what deduction old regime is better",
    "new tax regime vs old regime calculator 2025-26",
    "tax regime break even amount",
  ],
};

const faqs = [
  {
    question: "What is the break-even deduction amount?",
    answer:
      "It's the exact total deduction amount at which the old regime's tax bill drops to match the new regime's tax bill. Below that amount, the new regime wins (lower base rates make up for the missing deductions); above it, the old regime wins because your deductions outweigh the rate difference.",
  },
  {
    question: "Why does the break-even point change with income?",
    answer:
      "Because the new and old regime slabs have different rates at different income levels. At lower incomes, the gap between the two regimes' tax is small, so even modest deductions can tip the balance to the old regime. At higher incomes, the new regime's lower rates create a bigger head start, so you need much larger deductions to catch up.",
  },
  {
    question: "What counts toward my total deductions for this comparison?",
    answer:
      "Everything you'd claim under the old regime: Section 80C investments (PPF, ELSS, EPF, life insurance, up to ₹1.5 lakh), HRA exemption, Section 80D health insurance premiums, home loan interest under Section 24(b), NPS under 80CCD(1B), and any other Chapter VI-A deductions. Add them all up and compare to the break-even figure.",
  },
  {
    question: "Can I switch tax regimes every year?",
    answer:
      "Salaried employees without business income can choose their regime freely every year when filing their ITR, regardless of what they declared to their employer for TDS purposes. If you have business or professional income, switching back to the old regime after opting for the new one has restrictions — you can generally do it only once.",
  },
];

export default function NewRegimeBreakEvenCalculatorPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "New Regime Break-Even Calculator", href: URL },
    ]),
    calculatorSchema({ name: TITLE, description: DESCRIPTION, url: URL }),
    faqSchema(faqs)
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/tax-saving" className="hover:text-brand">Tax Saving</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">New Regime Break-Even Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">New Regime Break-Even Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Instead of comparing two numbers, find the exact deduction threshold where the old
        regime starts winning for your income — then check it against what you actually claim.
      </p>

      <div className="mt-10">
        <NewRegimeBreakEvenCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How the Break-Even Point Works</h2>
        <p className="mt-3 text-ink-soft">
          Most people compare old vs new regime by plugging in their actual deductions once and
          seeing which wins. That works, but it doesn't tell you how close the decision was — or
          what would change it. This calculator instead holds your income fixed and asks: as
          deductions rise from zero, at what point does the old regime's higher rates get
          outweighed by those deductions?
        </p>
        <p className="mt-3 text-ink-soft">
          Because the new regime has no deductions to plug in, its tax is a single fixed number
          for your income. The old regime's tax falls steadily as you add more deductions — so
          the two lines cross exactly once. That crossing point is your break-even: claim less
          than that in deductions, and the new regime wins; claim more, and the old regime wins.
          For most middle-income salaried employees in FY 2025-26, this break-even typically
          falls somewhere between ₹3.5 lakh and ₹5 lakh of total deductions, though it shifts
          meaningfully with income level.
        </p>
      </section>

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
          <li><Link href="/calculator/old-vs-new-tax-regime" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Old vs New Regime</Link></li>
          <li><Link href="/calculator/income-tax-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Income Tax Calculator</Link></li>
          <li><Link href="/calculator/hra-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">HRA Calculator</Link></li>
          <li><Link href="/calculator/home-loan-tax-benefit-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Home Loan Tax Benefit</Link></li>
          <li><Link href="/tax-saving" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">Tax Saving Guide</Link></li>
        </ul>
      </section>
    </main>
  );
}
