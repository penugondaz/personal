"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.trim() === "" ? 0 : (text.match(/[^.!?]*[.!?]+/g)||[]).length;
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / 200); // avg 200 wpm
    const speakingTime = Math.ceil(words / 130); // avg 130 wpm
    // Top words
    const wordFreq: Record<string,number> = {};
    if (text.trim()) {
      text.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/).filter(w=>w.length>3).forEach(w=>{wordFreq[w]=(wordFreq[w]||0)+1;});
    }
    const topWords = Object.entries(wordFreq).sort((a,b)=>b[1]-a[1]).slice(0,5);
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime, topWords };
  }, [text]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">Home</Link><span className="mx-1.5">/</span>
        <Link href="/tools" className="hover:text-brand">Tools</Link><span className="mx-1.5">/</span>
        <span aria-current="page">Word Counter</span>
      </nav>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Word Counter</h1>
      <p className="mt-4 text-lg text-ink-soft">Count words, characters, sentences, and paragraphs — plus estimated reading and speaking time.</p>

      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={8}
          placeholder="Paste or type your content here…"
          className="w-full rounded-lg border border-rule bg-paper px-4 py-3 text-base text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 resize-none"
          autoFocus
        />
        <div className="mt-2 flex justify-end">
          <button onClick={() => setText("")} className="rounded-lg border border-rule px-3 py-1 text-xs text-ink-soft hover:border-deduction hover:text-deduction transition">Clear</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Words", value: stats.words.toLocaleString(), highlight: true },
          { label: "Characters", value: stats.chars.toLocaleString() },
          { label: "No Spaces", value: stats.charsNoSpaces.toLocaleString() },
          { label: "Sentences", value: stats.sentences.toLocaleString() },
          { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
          { label: "Reading Time", value: stats.readingTime < 1 ? "<1 min" : `${stats.readingTime} min` },
          { label: "Speaking Time", value: stats.speakingTime < 1 ? "<1 min" : `${stats.speakingTime} min` },
          { label: "Avg Word Len", value: stats.words > 0 ? (stats.charsNoSpaces / stats.words).toFixed(1) : "0" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.highlight ? "border-brand bg-brand-soft" : "border-rule bg-surface"}`}>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{s.label}</p>
            <p className={`tabular mt-1 font-display text-2xl font-semibold ${s.highlight ? "text-brand" : "text-ink"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {stats.topWords.length > 0 && (
        <div className="mt-6 rounded-xl border border-rule bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-3">Top Words (4+ letters)</p>
          <div className="space-y-2">
            {stats.topWords.map(([word, count]) => {
              const maxCount = stats.topWords[0][1];
              return (
                <div key={word} className="flex items-center gap-3">
                  <span className="w-28 text-sm font-medium text-ink truncate">{word}</span>
                  <div className="flex-1 h-5 bg-rule rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${(count / maxCount) * 100}%` }} />
                  </div>
                  <span className="tabular w-8 text-right text-sm text-ink-soft">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
