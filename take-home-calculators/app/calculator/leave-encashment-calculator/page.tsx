import type { Metadata } from "next";
import Link from "next/link";
import LeaveEncashmentCalculator from "@/components/LeaveEncashmentCalculator";
import { LEAVE_ENCASHMENT_EXEMPTION_CAP } from "@/lib/calculators/leave-encashment";
import { formatINR } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

const title = "Leave Encashment Calculator — Tax Exemption on Encashed Leave";
const description =
  "Calculate your leave encashment amount and how much is tax-exempt, for government employees, private-sector retirees, and encashment during active service.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/leave-encashment-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/leave-encashment-calculator") },
};

const faqs = [
  {
    question: "Is leave encashment taxable?",
    answer:
      "It depends on context. Government employees get full tax exemption on retirement. Private-sector employees get exemption on retirement up to certain limits — the lowest of a lifetime cap, actual amount received, 10 months' average salary, or cash value of accumulated leave. Leave encashed while still employed (not at retirement) is fully taxable for everyone.",
  },
  {
    question: "What is the lifetime exemption limit for leave encashment?",
    answer: `The current statutory cap is ${formatINR(LEAVE_ENCASHMENT_EXEMPTION_CAP)}, applied across your entire career — not per employer or per year. If you've already claimed exemption on a previous leave encashment, that amount counts against this lifetime limit.`,
  },
  {
    question: "How many leave days can I encash?",
    answer:
      "This depends entirely on your employer's leave policy — some cap accumulation at a certain number of days, others allow carrying forward more. The tax exemption calculation separately caps the leave balance counted at 30 days per year of actual service completed.",
  },
  {
    question: "Does leave encashment appear in Form 16?",
    answer:
      "Yes, taxable leave encashment is included as part of your salary income in Form 16. The exempt portion (if any) should be reflected separately and won't be added to your taxable salary figure.",
  },
];

export default function LeaveEncashmentCalculatorPage() {
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
        <span aria-current="page">Leave Encashment Calculator</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Leave Encashment Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Find out how much of your encashed leave is tax-exempt, based on your employment context
        and accumulated leave balance.
      </p>

      <div className="mt-10">
        <LeaveEncashmentCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Why Context Matters So Much</h2>
        <p className="mt-3 text-ink-soft">
          Leave encashment is one of the few salary components where tax treatment depends almost
          entirely on circumstances rather than a flat rule. The exact same amount of money can
          be fully tax-free for a retiring government employee, partially taxable for a retiring
          private-sector employee, and fully taxable for someone encashing leave simply because
          they&apos;re switching jobs. It&apos;s worth checking which bucket applies to you before
          assuming any particular tax treatment.
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
            <Link href="/calculator/gratuity-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              Gratuity Calculator
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
