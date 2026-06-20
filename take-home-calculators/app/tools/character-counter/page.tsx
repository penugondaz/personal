import type { Metadata } from "next";
import Link from "next/link";
import CharacterCounter from "@/components/CharacterCounter";
import { absoluteUrl } from "@/lib/paths";

const title = "Character Counter — Count Characters, Letters, Digits Online Free";
const description =
  "Count characters, letters, digits, spaces, and special characters in real time. Set a character limit for tweets (280), SMS (160), Instagram bios, and more.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/tools/character-counter") },
  openGraph: { title, description, url: absoluteUrl("/tools/character-counter") },
};

const faqs = [
  {
    question: "How many characters does Twitter / X allow?",
    answer:
      "Twitter (now X) allows 280 characters per tweet for standard accounts. Verified accounts with X Premium can post longer content. Use the 280 limit preset in this tool to track your tweet length.",
  },
  {
    question: "How many characters does an SMS allow?",
    answer:
      "A standard SMS supports 160 characters using GSM-7 encoding (basic Latin characters). If you use special characters, emoji, or non-Latin scripts, it switches to UCS-2 encoding and the limit drops to 70 characters per segment.",
  },
  {
    question: "Does this counter count spaces as characters?",
    answer:
      "Yes — the main character count includes spaces. The tool also shows a separate 'No Spaces' count so you can see both.",
  },
];

export default function CharacterCounterPage() {
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
        <span aria-current="page">Character Counter</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Character Counter</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Count characters, letters, digits, spaces, and special characters in real time. Set a limit
        to track tweets (280), SMS (160), bios, and any character-limited content.
      </p>

      <div className="mt-10">
        <CharacterCounter />
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
