import type { Metadata } from "next";
import Link from "next/link";
import NpsCalculator from "@/components/NpsCalculator";
import { NPS_MIN_ANNUITY_PERCENT } from "@/lib/calculators/nps";
import { absoluteUrl } from "@/lib/paths";

const title = "NPS Calculator — National Pension System Corpus & Pension Calculator";
const description =
  "Project your NPS (National Pension System) corpus at retirement and estimate your monthly pension, based on your contribution, expected returns, and annuity choice.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/nps-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/nps-calculator") },
};

const faqs = [
  {
    question: "How much of my NPS corpus can I withdraw as a lumpsum?",
    answer: `Up to 60% of your corpus can be withdrawn as a tax-free lumpsum at retirement. The remaining ${NPS_MIN_ANNUITY_PERCENT}% (minimum, mandated by regulation) must be used to purchase an annuity, which generates your monthly pension.`,
  },
  {
    question: "What return rate should I assume for NPS?",
    answer:
      "NPS lets you choose between equity, corporate bond, and government bond allocations (within regulatory limits based on your age). Historical NPS equity-heavy scheme returns have generally ranged 9-12% annually over the long term, though this isn't guaranteed and varies by the fund manager and asset allocation you choose.",
  },
  {
    question: "How is the monthly pension from NPS determined?",
    answer:
      "Your annuity corpus (the portion of NPS used to buy an annuity) is handed over to an insurance company, which pays you a monthly pension based on the prevailing annuity rate at the time of purchase — this rate isn't fixed by NPS itself and varies by insurer and annuity plan type.",
  },
  {
    question: "Is NPS withdrawal taxable?",
    answer:
      "The lumpsum withdrawal (up to 60% of corpus) is tax-free. The annuity portion isn't taxed at purchase, but the monthly pension you receive from the annuity is taxed as regular income in the year you receive it.",
  },
];

export default function NpsCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">NPS Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">NPS Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Project your retirement corpus under the National Pension System, and estimate the
        monthly pension your annuity could generate.
      </p>

      <div className="mt-10">
        <NpsCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How NPS Works at Retirement</h2>
        <p className="mt-3 text-ink-soft">
          NPS accumulates like a long-term retirement SIP throughout your working years, but
          unlike PPF or EPF, you can&apos;t withdraw the full corpus as cash at maturity. At least
          {" "}{NPS_MIN_ANNUITY_PERCENT}% must go toward purchasing an annuity from an insurance
          company, which is what funds your pension for the rest of your life. This mandatory
          annuity structure is what makes NPS distinct — and is also its biggest trade-off, since
          annuity payout rates have historically been relatively modest compared to other
          long-term investment returns.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Disclaimer</h2>
        <p className="mt-3 text-ink-soft">
          This calculator uses assumed rates for both corpus growth and annuity payout — actual
          NPS returns depend on your chosen fund manager and asset allocation, and actual annuity
          rates are set by insurers at the time of purchase. Treat this as a rough planning tool,
          not a guarantee.
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
          <li>
            <Link href="/calculator/ppf-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              PPF Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/epf-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              EPF & VPF Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
