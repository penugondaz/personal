// app/tools/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, webPageSchema, faqSchema, buildJsonLd } from "@/lib/schema";
import LandingHubLinks from "@/components/LandingHubLinks";
import LandingFaq from "@/components/LandingFaq";

const URL = "/tools";
const TITLE = "Free Online Tools — Calculators, Converters & Text Tools";
const DESCRIPTION =
  "Free discount calculator, percentage calculator, age calculator, number converter, character counter, word counter, text case converter, payslip generator, and rent receipt generator.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
};

const QUICK_GLANCE = [
  { icon: "🎂", label: "Age Calculator", desc: "Exact age in years, months, days" },
  { icon: "🧾", label: "Rent Receipts", desc: "HRA receipts, all 12 months" },
  { icon: "📄", label: "Payslip Generator", desc: "Auto-filled from your CTC" },
  { icon: "📊", label: "Percentage", desc: "Increase, decrease, of number" },
  { icon: "🔢", label: "Number to Words", desc: "Digits → Crore/Lakh breakdown" },
  { icon: "🔤", label: "Text Tools", desc: "Case conversion, word/char count" },
];

const TOOLS = [
  { href: "/tools/age-calculator", icon: "🎂", title: "Age Calculator", desc: "Exact age in years, months, days, hours — plus zodiac & next birthday." },
  { href: "/tools/rent-receipt-generator", icon: "🧾", title: "Rent Receipt Generator", desc: "Generate HRA rent receipts — one, or all 12 months at once." },
  { href: "/tools/payslip-generator", icon: "📄", title: "Payslip Generator", desc: "Auto-fill a payslip from your CTC, then edit any line to match." },
  { href: "/tools/discount-calculator", icon: "🏷️", title: "Discount Calculator", desc: "Calculate sale price after % or flat discount." },
  { href: "/tools/percentage-calculator", icon: "📊", title: "Percentage Calculator", desc: "% increase, decrease, of number, difference." },
  { href: "/tools/average-calculator", icon: "➗", title: "Average Calculator", desc: "Mean, median, mode for any set of numbers." },
  { href: "/tools/number-converter", icon: "🔢", title: "Number to Words Converter", desc: "Convert 100000000 → 10 Crore, with full breakdown." },
  { href: "/tools/character-counter", icon: "🔡", title: "Character Counter", desc: "Count characters, spaces, letters, digits." },
  { href: "/tools/word-counter", icon: "📝", title: "Word Counter", desc: "Count words, sentences, paragraphs, reading time." },
  { href: "/tools/text-case-converter", icon: "🔤", title: "Text Case Converter", desc: "UPPER, lower, Title, Sentence, camelCase and more." },
];

const FAQS = [
  {
    question: "Are these tools really free, with no sign-up?",
    answer:
      "Yes — every tool on this page runs entirely in your browser, with no account, no email, and no usage limit. Nothing you type is sent to a server or stored anywhere.",
  },
  {
    question: "Can I use the rent receipt generator for HRA tax exemption?",
    answer:
      "Yes, the rent receipt generator produces properly formatted receipts you can submit to your employer for HRA exemption, including all 12 months at once. Keep in mind employers may also ask for your landlord's PAN if annual rent exceeds ₹1 lakh.",
  },
  {
    question: "Is the payslip generator suitable for official use?",
    answer:
      "The payslip generator is designed for personal reference and quick estimates — to visualize how your CTC breaks down into a payslip format. For an actual, legally valid payslip, always use your employer's official payroll system.",
  },
  {
    question: "How accurate is the age calculator?",
    answer:
      "It calculates your exact age down to the day (and optionally hours) using your date of birth, accounting for leap years correctly — the same method used for eligibility checks on age-restricted forms and applications.",
  },
];

export default function ToolsPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Tools", href: URL },
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
        <span aria-current="page">Tools</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Free Online Tools</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculators, converters, and text tools — fast, free, and private. Everything runs in
        your browser, so nothing you type is ever sent anywhere.
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

      {/* Tools grid */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">All Free Tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {TOOLS.map(t => (
            <Link key={t.href} href={t.href} className="flex items-start gap-4 rounded-xl border border-rule bg-surface px-5 py-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className="font-medium text-brand">{t.title}</p>
                <p className="mt-0.5 text-sm text-ink-soft">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Use-case callout */}
      <section className="mt-12 rounded-xl border border-brand/20 bg-brand-soft p-6">
        <h2 className="font-display text-xl text-ink">Filing HRA claims this year?</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Generate all 12 months of rent receipts in one go, then use the HRA Calculator to work
          out your exact tax-exempt amount before submitting proofs to your employer.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/tools/rent-receipt-generator"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
            Generate Rent Receipts →
          </Link>
          <Link href="/calculator/hra-calculator"
            className="rounded-full border border-brand px-5 py-2 text-sm font-medium text-brand hover:bg-brand-soft transition">
            HRA Calculator
          </Link>
        </div>
      </section>

      {/* Educational content */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Why Use Browser-Based Tools</h2>
        <p className="mt-3 text-ink-soft">
          Every tool on this page runs as client-side JavaScript — your inputs are processed
          directly in your browser and never transmitted to a server. That means no sign-up,
          no rate limits, and no privacy trade-off for quick everyday tasks like converting a
          number to words for a cheque, checking a discount before a purchase, or generating a
          rent receipt for HRA proof.
        </p>
        <p className="mt-3 text-ink-soft">
          These tools complement the salary and tax calculators elsewhere on the site — for
          instance, the Payslip Generator uses the same underlying salary-structure logic as the
          In-Hand Salary Calculator, and the Rent Receipt Generator is built specifically to pair
          with the HRA Calculator for tax-filing season.
        </p>
      </section>

      <LandingFaq faqs={FAQS} />
      <LandingHubLinks currentHref={URL} />
    </main>
  );
}
