import type { Metadata } from "next";
import Link from "next/link";
import FreelancerTaxCalculator from "@/components/FreelancerTaxCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "Freelancer Tax Calculator India 2025-26 — 44ADA Presumptive Tax + TDS";
const DESCRIPTION =
  "Calculate income tax for freelancers and consultants in India. Compare 44ADA presumptive taxation (50% profit) vs actual expenses method. TDS reconciliation, advance tax schedule, GST threshold check. Free, FY 2025-26.";
const URL = "/calculator/freelancer-tax-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: [
    "freelancer tax calculator india",
    "44ADA presumptive tax calculator",
    "consultant income tax india 2025",
    "freelancer income tax india",
    "section 44ADA calculator",
    "self employed tax calculator india",
    "TDS reconciliation freelancer",
    "advance tax freelancer india",
    "professional income tax calculator",
    "ITR-4 calculator india",
  ],
};

const faqs = [
  {
    question: "What is Section 44ADA presumptive taxation?",
    answer: "Section 44ADA is a simplified tax scheme for professionals (IT consultants, designers, doctors, lawyers, CAs, engineers, architects) with gross receipts up to ₹75 lakh. Under 44ADA, 50% of your gross receipts is treated as profit — you don't need to maintain books of accounts or prove actual expenses. If your actual expenses are less than 50% of billing, 44ADA is beneficial.",
  },
  {
    question: "Who is eligible for Section 44ADA?",
    answer: "Professionals specified under Section 44AA: doctors, lawyers, engineers, architects, accountants (CA/CMA/CS), interior designers, technical consultants, and now IT professionals and consultants (added via CBDT notification). Gross receipts must not exceed ₹75 lakh in the financial year. Not applicable to traders or manufacturers.",
  },
  {
    question: "Should I use 44ADA or actual expenses method?",
    answer: "Use 44ADA if your actual business expenses are less than 50% of your gross receipts — you'll pay less tax since you get to deduct 50% as deemed expenses regardless of actuals. Use actual expenses if your real expenses exceed 50% of receipts (high-cost setups, many tools, office rent, team members). This calculator shows you which method saves more.",
  },
  {
    question: "What business expenses can freelancers deduct?",
    answer: "Under the actual expenses method: internet and phone bills (business portion), laptop and equipment depreciation (~33%/year), coworking space, software subscriptions, business travel, professional fees (CA, legal), marketing and advertising, home office (proportionate), professional courses and books. Personal expenses are not deductible. Mixing personal and business is the most common CA audit trigger.",
  },
  {
    question: "How does TDS work for freelancers?",
    answer: "Clients must deduct TDS at 10% on professional fees if the annual payment exceeds ₹30,000 per vendor. This TDS is reflected in your Form 26AS and AIS. You can claim full credit of this TDS against your final tax liability. If TDS deducted > total tax payable, you get a refund when filing ITR. Always reconcile your billing with Form 26AS.",
  },
  {
    question: "When does a freelancer need to pay advance tax?",
    answer: "If your total tax liability (after TDS credit) exceeds ₹10,000, you must pay advance tax in 4 installments: 15% by 15 Jun, 45% by 15 Sep, 75% by 15 Dec, and 100% by 15 Mar. Missing these attracts interest under Section 234B (1%/month on unpaid tax) and 234C (1%/month per missed installment). This calculator shows your advance tax schedule automatically.",
  },
  {
    question: "Do freelancers need to register for GST?",
    answer: "Yes, if gross receipts exceed ₹20 lakh in a financial year (₹10 lakh in some special category states). If you provide services to clients outside India (export of services), you may be exempt from GST even above ₹20L. GST registration means charging 18% GST on invoices and filing monthly/quarterly returns, but you can claim input tax credit on business expenses.",
  },
  {
    question: "Which ITR form should freelancers file?",
    answer: "File ITR-4 (Sugam) if you opt for 44ADA presumptive taxation. File ITR-3 if you use the actual expenses method (books of accounts required). ITR-1 and ITR-2 are not applicable for business/professional income. The ITR filing deadline for non-audit cases is 31st July of the assessment year.",
  },
];

export default function Page() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Calculators", href: "/calculator" },
      { name: "Freelancer Tax Calculator", href: URL },
    ]),
    calculatorSchema({ name: TITLE, description: DESCRIPTION, url: URL }),
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
        <span aria-current="page">Freelancer Tax Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">{TITLE}</h1>
      <p className="mt-4 text-lg text-ink-soft max-w-2xl">{DESCRIPTION}</p>

      {/* Key facts */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: "⚡", label: "Section 44ADA",   value: "50% deemed profit", sub: "No books needed · up to ₹75L" },
          { icon: "📋", label: "Actual Expenses", value: "Real profit only",   sub: "Claim all business expenses" },
          { icon: "📅", label: "Advance Tax",     value: "4 installments",     sub: "Jun · Sep · Dec · Mar" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-rule bg-surface p-4 shadow-card">
            <span className="text-2xl shrink-0">{item.icon}</span>
            <div>
              <p className="text-xs text-ink-soft">{item.label}</p>
              <p className="font-semibold text-ink">{item.value}</p>
              <p className="text-[10px] text-ink-soft">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card-lg sm:p-7">
        <FreelancerTaxCalculator />
      </div>

      {/* 44ADA guide */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Section 44ADA — Complete Guide</h2>
        <p className="mt-3 text-ink-soft">
          Most Indian freelancers overpay tax because they don&apos;t know about Section 44ADA or
          deductible business expenses. Here&apos;s everything you need to know.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Who qualifies for 44ADA?",
              items: [
                "IT consultants and software professionals",
                "Doctors, lawyers, CAs, architects",
                "Designers (UI/UX, graphic, interior)",
                "Engineers and technical consultants",
                "Management consultants",
                "Gross receipts ≤ ₹75L in the year",
              ],
            },
            {
              title: "44ADA vs Actual: Quick rule",
              items: [
                "Actual expenses < 50% → Use 44ADA",
                "Actual expenses > 50% → Use actual method",
                "44ADA: No audit, no books, ITR-4",
                "Actual: Maintain books, ITR-3",
                "Cannot switch back to 44ADA for 5 years if opted out",
                "This calculator shows which saves you more",
              ],
            },
            {
              title: "Common deductible expenses",
              items: [
                "Internet, phone (business portion)",
                "Laptop depreciation (~33%/year)",
                "Coworking space / home office",
                "Software subscriptions (Figma, tools)",
                "CA/legal fees, professional courses",
                "Business travel and client meetings",
              ],
            },
            {
              title: "Compliance checklist",
              items: [
                "File ITR-4 (44ADA) or ITR-3 (actual) by 31 Jul",
                "Reconcile billing with Form 26AS / AIS",
                "Pay advance tax in 4 installments",
                "Register for GST if billing > ₹20L",
                "Maintain invoices even under 44ADA",
                "Open separate bank account for business",
              ],
            },
          ].map(box => (
            <div key={box.title} className="rounded-xl border border-rule bg-surface p-5">
              <p className="font-semibold text-ink mb-3">{box.title}</p>
              <ul className="space-y-1.5">
                {box.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                    <span className="mt-0.5 shrink-0 text-brand">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
            { href: "/calculator/income-tax-calculator",               label: "Income Tax Calculator" },
            { href: "/calculator/income-tax-with-capital-gains",       label: "Tax + Capital Gains" },
            { href: "/calculator/old-vs-new-tax-regime",               label: "Old vs New Regime" },
            { href: "/calculator/advance-tax-calculator",              label: "Advance Tax Calculator" },
            { href: "/calculator/hra-calculator",                      label: "HRA Calculator" },
            { href: "/calculator/xirr-calculator",                     label: "XIRR Calculator" },
          ].map(l => (
            <li key={l.href}>
              <Link href={l.href}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center
                  text-sm font-medium text-brand hover:border-brand transition">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
