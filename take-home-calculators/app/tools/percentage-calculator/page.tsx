"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function CharacterCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const spaces = text.split("").filter(c => c === " ").length;
    const letters = text.replace(/[^a-zA-Z]/g, "").length;
    const digits = text.replace(/[^0-9]/g, "").length;
    const special = text.replace(/[a-zA-Z0-9\s]/g, "").length;
    const lines = text === "" ? 0 : text.split("\n").length;
    const sentences = text === "" ? 0 : (text.match(/[.!?]+/g)||[]).length;
    return { chars, charsNoSpaces, spaces, letters, digits, special, lines, sentences };
  }, [text]);

  const LIMIT_OPTIONS = [140, 160, 280, 500, 1000, 2000];
  const [limit, setLimit] = useState<number|null>(null);
  const pct = limit ? Math.min(100, (stats.chars / limit) * 100) : 0;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">Home</Link><span className="mx-1.5">/</span>
        <Link href="/tools" className="hover:text-brand">Tools</Link><span className="mx-1.5">/</span>
        <span aria-current="page">Character Counter</span>
      </nav>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Character Counter</h1>
      <p className="mt-4 text-lg text-ink-soft">Count characters, letters, digits, spaces, and special characters in real time. Set a limit for tweets, SMS, bios, and more.</p>

      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={7}
          placeholder="Start typing or paste your text here…"
          className="w-full rounded-lg border border-rule bg-paper px-4 py-3 text-base text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 resize-none"
          autoFocus
        />
        {/* Limit bar */}
        {limit && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-ink-soft mb-1">
              <span>{stats.chars} / {limit}</span>
              <span>{limit - stats.chars >= 0 ? `${limit - stats.chars} remaining` : `${stats.chars - limit} over limit`}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-rule">
              <div className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-deduction" : pct >= 80 ? "bg-accent" : "bg-brand"}`} style={{width:`${Math.min(pct,100)}%`}} />
            </div>
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-soft">Character limit:</span>
          {LIMIT_OPTIONS.map(l => (
            <button key={l} onClick={() => setLimit(limit === l ? null : l)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${limit===l?"bg-brand text-white":"border border-rule text-ink-soft hover:border-brand hover:text-brand"}`}>
              {l}
            </button>
          ))}
          <button onClick={() => setText("")} className="ml-auto rounded-lg border border-rule px-3 py-1 text-xs text-ink-soft hover:border-deduction hover:text-deduction transition">
            Clear
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Characters", value: stats.chars, highlight: true },
          { label: "No Spaces", value: stats.charsNoSpaces },
          { label: "Letters", value: stats.letters },
          { label: "Digits", value: stats.digits },
          { label: "Spaces", value: stats.spaces },
          { label: "Special", value: stats.special },
          { label: "Lines", value: stats.lines },
          { label: "Sentences", value: stats.sentences },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.highlight ? "border-brand bg-brand-soft" : "border-rule bg-surface"}`}>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{s.label}</p>
            <p className={`tabular mt-1 font-display text-3xl font-semibold ${s.highlight ? "text-brand" : "text-ink"}`}>{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
