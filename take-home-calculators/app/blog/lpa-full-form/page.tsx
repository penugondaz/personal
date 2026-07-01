import type { Metadata } from "next";
import Link from "next/link";
import { salarySlug } from "@/lib/salary-data";
import { formatINR } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "LPA Full Form — What Does LPA Mean in Salary? (Lakh Per Annum)";
const DESCRIPTION =
  "LPA full form is Lakh Per Annum — salary expressed in lakhs (₹1,00,000) per year. Learn what LPA means, how it differs from in-hand salary, and see LPA to monthly salary conversions.";
const URL = "/blog/lpa-full-form";
const PUBLISHED = "2026-07-01";
const MODIFIED = "2026-07-01";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(URL),
    type: "article",
    publishedTime: PUBLISHED,
    authors: ["Praveen Penugonda"],
  },
};

const EXAMPLE_LPAS = [3, 4, 5, 6, 7, 8, 10, 12, 15, 20];

const faqs = [
  {
    question: "What is the full form of LPA?",
    answer:
      "LPA stands for Lakh Per Annum (also written as Lakhs Per Annum). A lakh is 1,00,000 (one hundred thousand) in the Indian numbering system, and per annum means per year. So a salary quoted as 8 LPA means ₹8,00,000 per year.",
  },
  {
    question: "Is LPA the same as in-hand salary?",
    answer:
      "No. LPA almost always refers to your CTC (Cost to Company) — the total annual package an employer spends on you, including basic pay, allowances, employer PF contributions, and gratuity. Your actual in-hand salary is lower, after PF, professional tax, and income tax deductions are subtracted from the cash component of that package.",
  },
  {
    question: "How do I convert LPA to monthly salary?",
    answer:
      "Divide the LPA figure by 12 to get a rough gross monthly figure — for example, 12 LPA works out to ₹1,00,000 per month before deductions. This is your gross monthly pay, not your take-home pay; for an accurate in-hand figure after tax and PF, use a salary calculator.",
  },
  {
    question: "Is LPA used outside India?",
    answer:
      "LPA is primarily used in India, and to a lesser extent in Pakistan and Bangladesh. Most other countries quote annual salary directly in their local currency (e.g. \"$80,000 per year\") rather than using a lakh-based shorthand.",
  },
  {
    question: "Does LPA include bonus and variable pay?",
    answer:
      "Often yes. Many employers fold joining bonuses, variable/performance pay, and other incentives into the LPA figure quoted in an offer letter, even though that money isn't guaranteed every year. It's worth asking your employer to clarify which parts of a quoted LPA are fixed versus variable.",
  },
];

export default function LpaFullFormPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Blog", href: "/blog" },
      { name: "LPA Full Form", href: URL },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": TITLE,
      "description": DESCRIPTION,
      "url": absoluteUrl(URL),
      "datePublished": PUBLISHED,
      "dateModified": MODIFIED,
      "author": {
        "@type": "Person",
        "name": "Praveen Penugonda",
      },
      "publisher": {
        "@type": "Organization",
        "name": "SalaryTools India",
        "url": "https://salarytools.in",
        "logo": {
          "@type": "ImageObject",
          "url": absoluteUrl("/icon-192x192.png"),
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": absoluteUrl(URL),
      },
    },
    faqSchema(faqs),
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/blog" className="hover:text-brand">Blog</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">LPA Full Form</span>
      </nav>

      {/* Article meta */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
        <span className="rounded-full bg-brand-soft px-3 py-0.5 font-semibold text-brand">Guide</span>
        <span>1 July 2026</span>
        <span>·</span>
        <span>4 min read</span>
        <span>·</span>
        <span>By Praveen Penugonda</span>
      </div>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        LPA Full Form — What Does LPA Mean in Salary?
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        <strong className="text-ink">LPA stands for Lakh Per Annum.</strong> It&apos;s how Indian
        job offers, payslips, and salary discussions express annual pay — for example,{" "}
        <strong className="text-ink">10 LPA means ₹10,00,000 per year</strong>, not per month.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">What LPA Actually Means</h2>
        <p className="mt-3 text-ink-soft">
          A lakh is 1,00,000 in the Indian numbering system, and per annum simply means
          &quot;per year.&quot; Employers in India use LPA as shorthand so they don&apos;t have to
          write out long figures like ₹8,00,000 — they just say 8 LPA. You&apos;ll see this on job
          portals, campus placement offers, appraisal letters, and HR conversations.
        </p>
        <p className="mt-3 text-ink-soft">
          The important part most people miss: LPA almost always refers to your{" "}
          <strong className="text-ink">CTC (Cost to Company)</strong>, not your take-home pay.
          CTC includes your basic salary, allowances, the employer&apos;s own PF contribution,
          gratuity, and sometimes insurance premiums or other benefits — money the company spends
          on you in total, not all of which lands in your bank account every month.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">LPA vs. In-Hand Salary</h2>
        <p className="mt-3 text-ink-soft">
          Your actual in-hand (take-home) salary is what&apos;s left after deductions are
          subtracted from the cash portion of your CTC:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-soft">
          <li>Your own EPF (Provident Fund) contribution, typically 12% of basic pay</li>
          <li>Professional tax, in states that levy it (varies by state and salary level)</li>
          <li>Income tax (TDS), deducted monthly based on your annual tax liability</li>
        </ul>
        <p className="mt-3 text-ink-soft">
          That&apos;s why a 10 LPA offer doesn&apos;t mean ₹83,333 lands in your account every
          month — the real figure is usually lower, and depends on how your employer structures
          basic pay, HRA, and other components.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">LPA to Monthly Salary — Quick Reference</h2>
        <p className="mt-3 text-ink-soft">
          These are gross monthly figures (LPA ÷ 12), before any deductions. Click a row to see the
          full in-hand breakdown for that CTC.
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft">LPA (Annual CTC)</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">
                  Gross Monthly (before deductions)
                </th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLE_LPAS.map((lpa) => (
                <tr key={lpa} className="border-b border-rule last:border-0 hover:bg-paper">
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/salary/${salarySlug(lpa)}`}
                      className="font-medium text-brand hover:underline"
                    >
                      {lpa} LPA
                    </Link>
                  </td>
                  <td className="tabular px-4 py-2.5 text-right text-ink">
                    {formatINR((lpa * 100_000) / 12)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

      <section className="mt-12 rounded-xl border border-brand/20 bg-brand-soft px-6 py-6 text-center">
        <p className="font-medium text-ink">Want your exact in-hand salary from any CTC?</p>
        <p className="mt-1 text-sm text-ink-soft">Our calculator accounts for PF, professional tax, and income tax.</p>
        <Link
          href="/salary"
          className="mt-4 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
        >
          Calculate your in-hand salary →
        </Link>
      </section>

      {/* Back to blog */}
      <div className="mt-10 pt-6 border-t border-rule">
        <Link href="/blog" className="text-sm font-medium text-brand hover:underline">
          ← Back to Blog
        </Link>
      </div>
    </main>
  );
}
