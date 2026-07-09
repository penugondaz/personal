// app/tools/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Free Online Tools — Calculators, Converters & Text Tools",
  description: "Free discount calculator, percentage calculator, number converter, character counter, word counter, text case converter and more.",
  alternates: { canonical: absoluteUrl("/tools") },
};

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

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft"><Link href="/" className="hover:text-brand">Home</Link><span className="mx-1.5">/</span><span aria-current="page">Tools</span></nav>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Free Online Tools</h1>
      <p className="mt-4 text-lg text-ink-soft">Calculators, converters, and text tools — fast, free, and private. Everything runs in your browser.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TOOLS.map(t => (
          <Link key={t.href} href={t.href} className="flex items-start gap-4 rounded-xl border border-rule bg-surface px-5 py-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg">
            <span className="text-2xl">{t.icon}</span>
            <div><p className="font-medium text-brand">{t.title}</p><p className="mt-0.5 text-sm text-ink-soft">{t.desc}</p></div>
          </Link>
        ))}
      </div>
    </main>
  );
}
