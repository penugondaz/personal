import type { Metadata } from "next";
import Link from "next/link";
import GratuityCalculator from "@/components/GratuityCalculator";
import { GRATUITY_STATUTORY_CAP } from "@/lib/calculators/gratuity";
import { formatINR } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

const title = "Gratuity Calculator — Payment of Gratuity Act, 1972";
const description =
  "Calculate your gratuity amount under the Payment of Gratuity Act, 1972, based on your last drawn basic salary, years of service, and employer coverage status.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/gratuity-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/gratuity-calculator") },
};

const faqs = [
  {
    question: "What is the gratuity formula?",
    answer:
      "For employers covered under the Payment of Gratuity Act, gratuity is (Basic + DA) × 15/26 × years of service, where years of service round up if the remainder is 6 months or more. For employers not covered under the Act, the formula uses a divisor of 30 instead of 26, and years aren't rounded up.",
  },
  {
    question: "How many years of service do I need to be eligible for gratuity?",
    answer:
      "You need at least 5 years of continuous service with the same employer to be eligible, except in cases of death or disability, where the 5-year requirement is waived.",
  },
  {
    question: "Is there a maximum limit on gratuity?",
    answer: `Yes. The statutory cap on tax-exempt gratuity is currently ${formatINR(GRATUITY_STATUTORY_CAP)}. Employers can pay more than this as an ex-gratia amount, but anything above the cap may be taxable.`,
  },
  {
    question: "Is gratuity taxable?",
    answer:
      "Gratuity received by government employees is fully tax-exempt. For private-sector employees covered under the Payment of Gratuity Act, gratuity is exempt up to the statutory limit, the actual gratuity formula amount, or your actual gratuity received — whichever is lowest.",
  },
  {
    question: "Does gratuity show up in my CTC?",
    answer:
      "Many employers include a notional gratuity provision in your CTC structure, even though it's only payable as a lump sum when you leave after 5+ years of service. It's not part of your monthly in-hand salary.",
  },
];

export default function GratuityCalculatorPage() {
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
        <span aria-current="page">Gratuity Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Gratuity Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Estimate the lump-sum gratuity payable to you under the Payment of Gratuity Act, 1972,
        based on your last drawn salary and years of service.
      </p>

      <div className="mt-10">
        <GratuityCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">How Gratuity Is Calculated</h2>
        <p className="mt-3 text-ink-soft">
          Gratuity is a statutory benefit paid as a lump sum when you leave a job after at least 5
          years of continuous service, intended to recognize long-term service. The amount is
          based on your last drawn Basic + DA, not your full CTC, and the calculation differs
          slightly depending on whether your employer is covered under the Payment of Gratuity
          Act — most organized-sector private employers are, which uses a 26-working-day-month
          assumption rather than the 30-day calendar month used for uncovered employers.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Why Gratuity Matters in Salary Negotiations</h2>
        <p className="mt-3 text-ink-soft">
          Employers often quote gratuity as part of your overall CTC package, which can make a job
          offer look larger than the cash compensation you&apos;ll actually receive month to
          month. Since gratuity is only realized if you stay 5+ years, it&apos;s worth treating it
          as a separate, conditional benefit rather than counting it toward your immediate
          take-home comparison between offers.
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
            <Link href="/calculator/epf-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              EPF & VPF Calculator
            </Link>
          </li>
          <li>
            <Link href="/salary" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              In-Hand Salary Calculator
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
