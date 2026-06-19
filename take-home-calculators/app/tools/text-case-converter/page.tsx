"use client";
import { useState } from "react";
import Link from "next/link";

// ─── Case conversion functions ────────────────────────────────────────────────

function toSentenceCase(s: string) {
  return s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
}
function toTitleCase(s: string) {
  return s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}
// AP style: lowercase articles, conjunctions, prepositions <5 chars unless first/last
const AP_LOWER = new Set(["a","an","the","and","but","or","for","nor","on","at","to","by","in","of","up","as","is"]);
function toApCase(s: string) {
  const words = s.toLowerCase().split(/\b/);
  return words.map((w, i) => {
    if (i === 0 || !AP_LOWER.has(w)) return w.replace(/^\w/, c => c.toUpperCase());
    return w;
  }).join("");
}
// Headline: capitalize everything except short function words, unless first/last
const HEADLINE_LOWER = new Set(["a","an","the","and","but","or","for","nor","at","to","by","in","of"]);
function toHeadlineCase(s: string) {
  const words = s.split(/\s+/);
  return words.map((w, i) => {
    const clean = w.toLowerCase();
    if (i === 0 || i === words.length - 1 || !HEADLINE_LOWER.has(clean)) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }
    return clean;
  }).join(" ");
}
function toCamelCase(s: string) {
  return s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
}
function toPascalCase(s: string) {
  const camel = toCamelCase(s);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}
function toSnakeCase(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
function toKebabCase(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function toConstantCase(s: string) {
  return toSnakeCase(s).toUpperCase();
}
function toggleCase(s: string) {
  return s.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
}
function toAlternatingCase(s: string) {
  return s.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("");
}

// ─── Cases list ───────────────────────────────────────────────────────────────

const CASES = [
  { id: "sentence", label: "Sentence case", example: "This is sentence case.", fn: toSentenceCase },
  { id: "title", label: "Title Case", example: "This Is Title Case", fn: toTitleCase },
  { id: "ap", label: "AP Style", example: "AP Style Follows the Rules of AP", fn: toApCase },
  { id: "headline", label: "Headline Case", example: "Headline Case for News Articles", fn: toHeadlineCase },
  { id: "upper", label: "UPPER CASE", example: "UPPER CASE TEXT", fn: (s: string) => s.toUpperCase() },
  { id: "lower", label: "lower case", example: "lower case text", fn: (s: string) => s.toLowerCase() },
  { id: "camel", label: "camelCase", example: "camelCaseText", fn: toCamelCase },
  { id: "pascal", label: "PascalCase", example: "PascalCaseText", fn: toPascalCase },
  { id: "snake", label: "snake_case", example: "snake_case_text", fn: toSnakeCase },
  { id: "kebab", label: "kebab-case", example: "kebab-case-text", fn: toKebabCase },
  { id: "constant", label: "CONSTANT_CASE", example: "CONSTANT_CASE_TEXT", fn: toConstantCase },
  { id: "toggle", label: "tOGGLE cASE", example: "tOGGLE cASE", fn: toggleCase },
  { id: "alternating", label: "aLtErNaTiNg", example: "aLtErNaTiNg cAsE", fn: toAlternatingCase },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TextCaseConverterPage() {
  const [input, setInput] = useState("the quick brown fox jumps over the lazy dog");
  const [activeCase, setActiveCase] = useState("title");
  const [copied, setCopied] = useState(false);

  const current = CASES.find(c => c.id === activeCase)!;
  const output = current.fn(input);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">Home</Link><span className="mx-1.5">/</span>
        <Link href="/tools" className="hover:text-brand">Tools</Link><span className="mx-1.5">/</span>
        <span aria-current="page">Text Case Converter</span>
      </nav>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Text Case Converter</h1>
      <p className="mt-4 text-lg text-ink-soft">Convert text to Sentence case, Title Case, AP Style, camelCase, snake_case, UPPER CASE, and 8 more formats instantly.</p>

      {/* Input */}
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-soft">Input Text</span>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={4}
            placeholder="Type or paste your text here…"
            className="w-full rounded-lg border border-rule bg-paper px-4 py-3 text-base text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 resize-none"
          />
        </label>
        <button onClick={() => setInput("")} className="mt-2 text-xs text-ink-soft hover:text-deduction transition">Clear</button>
      </div>

      {/* Case selector buttons */}
      <div className="mt-5 flex flex-wrap gap-2">
        {CASES.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCase(c.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${activeCase === c.id ? "bg-brand text-white shadow-sm" : "border border-rule text-ink-soft hover:border-brand hover:text-brand"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Output */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="flex items-center justify-between border-b border-rule px-5 py-3">
          <span className="text-sm font-medium text-ink">{current.label}</span>
          <button onClick={copy} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${copied ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand hover:text-brand"}`}>
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <div className="px-5 py-5 min-h-[80px]">
          <p className="text-base text-ink leading-relaxed whitespace-pre-wrap break-words">{output}</p>
        </div>
      </div>

      {/* All previews */}
      <div className="mt-8">
        <h2 className="font-display text-xl text-ink mb-4">All Conversions</h2>
        <div className="space-y-1 rounded-xl border border-rule overflow-hidden">
          {CASES.map((c, i) => {
            const out = c.fn(input);
            const isActive = c.id === activeCase;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCase(c.id)}
                className={`w-full flex items-start gap-4 px-4 py-3 text-left transition ${isActive ? "bg-brand-soft border-l-2 border-l-brand" : "hover:bg-paper"} ${i > 0 ? "border-t border-rule" : ""}`}
              >
                <span className="shrink-0 w-28 text-xs font-medium text-ink-soft pt-0.5">{c.label}</span>
                <span className={`text-sm break-all ${isActive ? "text-brand font-medium" : "text-ink"}`}>{out}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="mt-10 space-y-4">
        {[
          { q: "What is the difference between Title Case and Headline Case?", a: "Title Case capitalizes every word. Headline Case (Chicago Manual of Style) keeps short prepositions, articles, and conjunctions lowercase unless they're the first or last word. AP Style also lowercases these but follows slightly different rules for prepositions." },
          { q: "When should I use camelCase vs snake_case?", a: "camelCase (myVariableName) is standard in JavaScript, Java, and Swift. snake_case (my_variable_name) is preferred in Python, Ruby, and database column names. PascalCase (MyClassName) is used for class names in most languages. CONSTANT_CASE (MAX_VALUE) is used for constants." },
        ].map(f => (
          <div key={f.q} className="border-b border-rule pb-4">
            <h3 className="font-medium text-ink">{f.q}</h3>
            <p className="mt-1.5 text-sm text-ink-soft">{f.a}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
