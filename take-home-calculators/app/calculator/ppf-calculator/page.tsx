import type { Metadata } from "next";
import Link from "next/link";
import PpfCalculator from "@/components/PpfCalculator";
import { absoluteUrl } from "@/lib/paths";
import { getCmsPage } from "@/lib/cms";

const SLUG = "calculator/ppf-calculator";

const DEFAULTS = {
  pageTitle:       "PPF Calculator",
  metaTitle:       "PPF Calculator — Public Provident Fund Maturity & Interest Calculator",
  metaDescription: "Calculate your PPF maturity value, year-by-year interest, and total corpus at the current 7.1% interest rate. Plan your 15-year PPF investment.",
  introText:       "Calculate your PPF maturity value and year-by-year growth at the current 7.1% interest rate. PPF is a 15-year government-backed savings scheme with tax-free returns.",
  faqs: [
    { question: "What is the current PPF interest rate?", answer: "The PPF interest rate is 7.1% per annum, compounded annually, for FY 2025-26. The rate is reviewed quarterly by the government." },
    { question: "Is PPF interest tax-free?", answer: "Yes — PPF enjoys EEE (Exempt-Exempt-Exempt) tax status. Your contributions qualify for 80C deduction, interest earned is tax-free, and the maturity amount is fully tax-free." },
    { question: "Can I extend PPF after 15 years?", answer: "Yes, PPF can be extended in blocks of 5 years with or without further contributions. Extending with contributions lets you keep earning interest while continuing to invest." },
  ],
  relatedLinks: [
    { label: "EPF Calculator", href: "/calculator/epf-calculator" },
    { label: "NPS Calculator", href: "/calculator/nps-calculator" },
    { label: "NSC Calculator", href: "/calculator/nsc-calculator" },
    { label: "Tax Saving Guide", href: "/tax-saving" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsPage(SLUG, DEFAULTS);
  const title = cms.metaTitle || DEFAULTS.metaTitle;
  const description = cms.metaDescription || DEFAULTS.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/${SLUG}`) },
    openGraph: { title, description, url: absoluteUrl(`/${SLUG}`) },
  };
}

export default async function Page() {
  const cms = await getCmsPage(SLUG, DEFAULTS);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (cms.faqs.length > 0 ? cms.faqs : DEFAULTS.faqs).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{cms.pageTitle}</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">{cms.pageTitle}</h1>
      <p className="mt-4 text-lg text-ink-soft">{cms.introText}</p>

      <div className="mt-10">
        <PpfCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          {cms.faqs.map((faq) => (
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
          {cms.relatedLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
