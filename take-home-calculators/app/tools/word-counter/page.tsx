import type { Metadata } from "next";
import Link from "next/link";
import WordCounter from "@/components/WordCounter";
import { absoluteUrl } from "@/lib/paths";

const title = "Word Counter — Count Words, Characters, Sentences, Reading Time";
const description =
  "Count words, characters, sentences, and paragraphs instantly. Get estimated reading and speaking time, plus top word frequency analysis.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/tools/word-counter") },
  openGraph: { title, description, url: absoluteUrl("/tools/word-counter") },
};

const faqs = [
  {
    question: "How is reading time calculated?",
    answer:
      "Reading time is estimated at 200 words per minute — the average silent reading speed for adults. A 1,000-word article takes approximately 5 minutes to read.",
  },
  {
    question: "How is speaking time calculated?",
    answer:
      "Speaking time is estimated at 130 words per minute — close to the average conversational pace. For presentations, 120–150 wpm is a comfortable rate for the audience.",
  },
  {
    question: "What counts as a paragraph?",
    answer:
      "This tool counts paragraphs as blocks of text separated by a blank line (double newline). Single line breaks within a paragraph are not counted as paragraph separators.",
  },
];

export default function WordCounterPage() {
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
        <span aria-current="page">Word Counter</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Word Counter</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Count words, characters, sentences, and paragraphs instantly. See estimated reading and
        speaking time, plus which words appear most often.
      </p>

      <div className="mt-10">
        <WordCounter />
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
            { href: "/tools/character-counter", label: "Character Counter" },
            { href: "/tools/text-case-converter", label: "Text Case Converter" },
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
