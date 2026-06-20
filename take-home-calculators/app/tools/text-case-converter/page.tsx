import type { Metadata } from "next";
import Link from "next/link";
import TextCaseConverter from "@/components/TextCaseConverter";
import { absoluteUrl } from "@/lib/paths";

const title = "Text Case Converter — Title Case, camelCase, snake_case & 10 More";
const description =
  "Convert text to Sentence case, Title Case, AP Style, Headline Case, UPPER CASE, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE and more — instantly free.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/tools/text-case-converter") },
  openGraph: { title, description, url: absoluteUrl("/tools/text-case-converter") },
};

const faqs = [
  {
    question: "What is the difference between Title Case and Headline Case?",
    answer:
      "Title Case capitalizes every word. Headline Case (Chicago style) keeps short prepositions, articles, and conjunctions lowercase unless they're the first or last word. AP Style has similar rules but follows the Associated Press Stylebook conventions.",
  },
  {
    question: "When should I use camelCase vs snake_case?",
    answer:
      "camelCase (myVariableName) is standard in JavaScript, Java, and Swift. snake_case (my_variable_name) is preferred in Python, Ruby, and database column names. PascalCase (MyClassName) is used for class names in most languages. CONSTANT_CASE (MAX_VALUE) is used for constants and environment variables.",
  },
  {
    question: "What is kebab-case used for?",
    answer:
      "kebab-case (my-variable-name) is commonly used in URLs, CSS class names, and HTML attributes. It is the standard for URL slugs and is also used in some configuration file keys.",
  },
];

export default function TextCaseConverterPage() {
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
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/tools" className="hover:text-brand">Tools</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Text Case Converter</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Text Case Converter</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Convert text to 13 formats instantly — Sentence case, Title Case, AP Style, Headline Case,
        UPPER, lower, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, toggle, and alternating.
      </p>

      <div className="mt-10">
        <TextCaseConverter />
      </div>

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
        <h2 className="font-display text-2xl text-ink">Related Tools</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: "/tools/word-counter", label: "Word Counter" },
            { href: "/tools/character-counter", label: "Character Counter" },
            { href: "/tools", label: "All Tools" },
          ].map((l) => (
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
