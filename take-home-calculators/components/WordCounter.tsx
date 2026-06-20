"use client";
import { useState, useMemo } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const s = useMemo(() => {
    const words      = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const chars      = text.length;
    const noSpaces   = text.replace(/\s/g,"").length;
    const sentences  = text.trim() === "" ? 0 : (text.match(/[^.!?]*[.!?]+/g)||[]).length;
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter(p=>p.trim()).length;
    const readTime   = Math.ceil(words / 200);
    const speakTime  = Math.ceil(words / 130);
    const avgWordLen = words > 0 ? (noSpaces / words).toFixed(1) : "0";
    const freq: Record<string,number> = {};
    if (text.trim()) text.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/).filter(w=>w.length>3).forEach(w=>{freq[w]=(freq[w]||0)+1;});
    const topWords = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5);
    return { words, chars, noSpaces, sentences, paragraphs, readTime, speakTime, avgWordLen, topWords };
  }, [text]);

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <textarea value={text} onChange={e => setText(e.target.value)} rows={8}
          placeholder="Paste or type your content here…"
          className="w-full rounded-lg border border-rule bg-paper px-4 py-3 text-base text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 resize-none" autoFocus />
        <div className="mt-2 flex justify-end">
          <button onClick={() => setText("")} className="rounded-lg border border-rule px-3 py-1 text-xs text-ink-soft hover:border-deduction hover:text-deduction transition">Clear</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {label:"Words",        value:s.words.toLocaleString(),   highlight:true},
          {label:"Characters",   value:s.chars.toLocaleString()},
          {label:"No Spaces",    value:s.noSpaces.toLocaleString()},
          {label:"Sentences",    value:s.sentences.toLocaleString()},
          {label:"Paragraphs",   value:s.paragraphs.toLocaleString()},
          {label:"Reading Time", value:s.readTime < 1 ? "<1 min" : `${s.readTime} min`},
          {label:"Speaking Time",value:s.speakTime < 1 ? "<1 min" : `${s.speakTime} min`},
          {label:"Avg Word Len", value:s.avgWordLen},
        ].map(item => (
          <div key={item.label} className={`rounded-xl border p-4 ${item.highlight ? "border-brand bg-brand-soft" : "border-rule bg-surface"}`}>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{item.label}</p>
            <p className={`tabular mt-1 font-display text-2xl font-semibold ${item.highlight ? "text-brand" : "text-ink"}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {s.topWords.length > 0 && (
        <div className="mt-6 rounded-xl border border-rule bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-3">Top Words (4+ letters)</p>
          <div className="space-y-2">
            {s.topWords.map(([word, count]) => (
              <div key={word} className="flex items-center gap-3">
                <span className="w-28 text-sm font-medium text-ink truncate">{word}</span>
                <div className="flex-1 h-5 rounded-full overflow-hidden bg-rule">
                  <div className="h-full rounded-full transition-all" style={{width:`${(count/s.topWords[0][1])*100}%`,background:"var(--brand)"}} />
                </div>
                <span className="tabular w-8 text-right text-sm text-ink-soft">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
