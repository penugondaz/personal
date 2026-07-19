import type { Metadata } from "next";
import Link from "next/link";
import NpsTier2Calculator from "@/components/NpsTier2Calculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "NPS Tier 2 Calculator — Flexible NPS Investment, No Lock-In";
const DESCRIPTION =
  "Project your NPS Tier 2 corpus growth — a flexible, no-lock-in NPS investment account with slab-rate taxation on withdrawal, different from the retirement-locked Tier 1 account.";
const URL = "/calculator/nps-tier2-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
  keywords: [
    "nps tier 2 calculator",
    "nps tier 2 vs tier 1",
    "nps tier 2 returns calculator",
    "nps tier 2 tax",
    "nps tier 2 withdrawal",
  ],
};

const faqs = [
  {
    question: "What's the difference between NPS Tier 1 and Tier 2?",
    answer:
      "Tier 1 is the primary retirement account — contributions get tax deductions under 80CCD, but the money is locked in until retirement (with partial exceptions) and part of the corpus must go into an annuity. Tier 2 is a voluntary add-on account with no lock-in — you can withdraw any amount at any time — but it gets no tax deduction for most subscribers, and gains are taxed at your slab rate on withdrawal.",
  },
  {
    question: "Do I need a Tier 1 account to open Tier 2?",
    answer:
      "Yes. NPS Tier 2 can only be opened by someone who already has an active Tier 1 account, since it uses the same Permanent Retirement Account Number (PRAN). You can't open a standalone Tier 2 account.",
  },
  {
    question: "Is NPS Tier 2 better than a mutual fund SIP?",
    answer:
      "It depends on your tax bracket and goals. Tier 2 typically has lower fund management charges than most mutual funds, but gains are taxed at your full slab rate on withdrawal with no long-term capital gains concession — unlike equity mutual funds, which get a much lower 12.5% LTCG rate after a year. For most private-sector investors in higher tax brackets, an equity mutual fund SIP is usually more tax-efficient than Tier 2 for long-term goals.",
  },
  {
    question: "Do private-sector employees get any tax benefit on NPS Tier 2?",
    answer:
      "No. The Section 80C deduction on Tier 2 contributions is available only to Central Government employees, and only if they accept a mandatory 3-year lock-in on that specific contribution. Private-sector, state government, and other subscribers get no upfront tax deduction on Tier 2 at all.",
  },
];

export default function NpsTier2CalculatorPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "NPS Tier 2 Calculator", href: URL },
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
        <Link href="/retirement" className="hover:text-brand">Retirement</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">NPS Tier 2 Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">NPS Tier 2 Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Project how your NPS Tier 2 investment could grow — the flexible, no-lock-in companion
        account to your retirement-locked NPS Tier 1.
      </p>

      <div className="mt-10">
        <NpsTier2Calculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How NPS Tier 2 Works</h2>
        <p className="mt-3 text-ink-soft">
          NPS Tier 2 is best understood as a market-linked investment account riding on your
          existing NPS infrastructure, rather than a retirement product. You choose how your
          money is allocated across equity, corporate debt, and government bond schemes — the
          same fund managers and choices available in Tier 1 — but with none of Tier 1&apos;s
          restrictions. There's no lock-in, no minimum holding period, and no mandatory annuity
          purchase; you can withdraw any amount, any time, directly to your bank account.
        </p>
        <p className="mt-3 text-ink-soft">
          The trade-off is tax treatment. Tier 1 contributions get you a deduction going in, and
          Tier 2 mostly doesn't (except for Central Government employees under a specific
          lock-in option). On the way out, Tier 2 gains are added to your income and taxed at
          your slab rate — unlike equity mutual funds, which benefit from a lower long-term
          capital gains rate. This makes Tier 2 most useful as a low-cost, flexible parking
          option rather than a tax-efficient wealth-building vehicle for most private-sector
          investors.
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
          <li><Link href="/calculator/nps-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">NPS Calculator</Link></li>
          <li><Link href="/calculator/apy-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">APY Calculator</Link></li>
          <li><Link href="/calculator/sip-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">SIP Calculator</Link></li>
          <li><Link href="/calculator/ppf-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">PPF Calculator</Link></li>
          <li><Link href="/calculator/elss-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">ELSS Calculator</Link></li>
        </ul>
      </section>
    </main>
  );
}
