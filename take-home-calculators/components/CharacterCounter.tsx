"use client";
import { useState, useMemo } from "react";

const LIMITS = [140, 160, 280, 500, 1000, 2000];

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const [limit, setLimit] = useState<number|null>(null);

  const s = useMemo(() => ({
    chars:         text.length,
    charsNoSpaces: text.replace(/\s/g,"").length,
    spaces:        (text.match(/ /g)||[]).length,
    letters:       text.replace(/[^a-zA-Z]/g,"").length,
    digits:        text.replace(/[^0-9]/g,"").length,
    special:       text.replace(/[a-zA-Z0-9\s]/g,"").length,
    lines:         text === "" ? 0 : text.split("\n").length,
    sentences:     text === "" ? 0 : (text.match(/[.!?]+/g)||[]).length,
  }), [text]);

  const pct = limit ? Math.min(100, (s.chars / limit) * 100) : 0;

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <textarea value={text} onChange={e => setText(e.target.value)} rows={7}
          placeholder="Start typing or paste your text here…"
          className="w-full rounded-lg border border-rule bg-paper px-4 py-3 text-base text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 resize-none"
          autoFocus />
        {limit && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-ink-soft mb-1">
              <span>{s.chars} / {limit}</span>
              <span>{limit - s.chars >= 0 ? `${limit - s.chars} remaining` : `${s.chars - limit} over limit`}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-rule">
              <div className={`h-full rounded-full transition-all ${pct>=100?"bg-deduction":pct>=80?"bg-accent":"bg-brand"}`} style={{width:`${Math.min(pct,100)}%`}} />
            </div>
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-soft">Limit:</span>
          {LIMITS.map(l => (
            <button key={l} onClick={() => setLimit(limit===l ? null : l)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${limit===l?"bg-brand text-white":"border border-rule text-ink-soft hover:border-brand hover:text-brand"}`}>
              {l}
            </button>
          ))}
          <button onClick={() => setText("")} className="ml-auto rounded-lg border border-rule px-3 py-1 text-xs text-ink-soft hover:border-deduction hover:text-deduction transition">Clear</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {label:"Characters",  value:s.chars,          highlight:true},
          {label:"No Spaces",   value:s.charsNoSpaces},
          {label:"Letters",     value:s.letters},
          {label:"Digits",      value:s.digits},
          {label:"Spaces",      value:s.spaces},
          {label:"Special",     value:s.special},
          {label:"Lines",       value:s.lines},
          {label:"Sentences",   value:s.sentences},
        ].map(item => (
          <div key={item.label} className={`rounded-xl border p-4 ${item.highlight ? "border-brand bg-brand-soft" : "border-rule bg-surface"}`}>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{item.label}</p>
            <p className={`tabular mt-1 font-display text-3xl font-semibold ${item.highlight ? "text-brand" : "text-ink"}`}>{item.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </>
  );
}
