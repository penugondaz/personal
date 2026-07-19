"use client";
import { useState } from "react";

const AP_LOWER = new Set(["a","an","the","and","but","or","for","nor","on","at","to","by","in","of","up","as","is"]);
const HEADLINE_LOWER = new Set(["a","an","the","and","but","or","for","nor","at","to","by","in","of"]);

const CASES = [
  { id:"sentence",   label:"Sentence case",  fn:(s:string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g,c=>c.toUpperCase()) },
  { id:"title",      label:"Title Case",     fn:(s:string) => s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()) },
  { id:"ap",         label:"AP Style",       fn:(s:string) => s.toLowerCase().split(/\b/).map((w,i) => (!AP_LOWER.has(w)||i===0) ? w.replace(/^\w/,c=>c.toUpperCase()) : w).join("") },
  { id:"headline",   label:"Headline Case",  fn:(s:string) => { const ws=s.split(/\s+/); return ws.map((w,i)=>{ const c=w.toLowerCase(); return (i===0||i===ws.length-1||!HEADLINE_LOWER.has(c)) ? w.charAt(0).toUpperCase()+w.slice(1).toLowerCase() : c; }).join(" "); } },
  { id:"upper",      label:"UPPER CASE",     fn:(s:string) => s.toUpperCase() },
  { id:"lower",      label:"lower case",     fn:(s:string) => s.toLowerCase() },
  { id:"camel",      label:"camelCase",      fn:(s:string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,(_,c)=>c.toUpperCase()) },
  { id:"pascal",     label:"PascalCase",     fn:(s:string) => { const c=s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,(_,c)=>c.toUpperCase()); return c.charAt(0).toUpperCase()+c.slice(1); } },
  { id:"snake",      label:"snake_case",     fn:(s:string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"") },
  { id:"kebab",      label:"kebab-case",     fn:(s:string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") },
  { id:"constant",   label:"CONSTANT_CASE",  fn:(s:string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"").toUpperCase() },
  { id:"toggle",     label:"tOGGLE cASE",    fn:(s:string) => s.split("").map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join("") },
  { id:"alternating",label:"aLtErNaTiNg",    fn:(s:string) => s.split("").map((c,i)=>i%2===0?c.toLowerCase():c.toUpperCase()).join("") },
];

export default function TextCaseConverter() {
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
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={4}
          placeholder="Type or paste your text here…"
          className="w-full rounded-lg border border-rule bg-paper px-4 py-3 text-base text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 resize-none" />
        <button onClick={() => setInput("")} className="mt-2 text-xs text-ink-soft hover:text-deduction transition">Clear</button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {CASES.map(c => (
          <button key={c.id} onClick={() => setActiveCase(c.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${activeCase===c.id?"bg-brand text-white shadow-sm":"border border-rule text-ink-soft hover:border-brand hover:text-brand"}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="flex items-center justify-between border-b border-rule px-5 py-3">
          <span className="text-sm font-medium text-ink">{current.label}</span>
          <button onClick={copy} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${copied?"bg-brand text-white":"border border-rule text-ink-soft hover:border-brand hover:text-brand"}`}>
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <div className="px-5 py-5 min-h-[80px]">
          <p className="text-base text-ink leading-relaxed whitespace-pre-wrap break-words">{output}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl text-ink mb-4">All Conversions</h2>
        <div className="space-y-px rounded-xl border border-rule overflow-hidden">
          {CASES.map((c, i) => (
            <button key={c.id} onClick={() => setActiveCase(c.id)}
              className={`w-full flex items-start gap-4 px-4 py-3 text-left transition ${activeCase===c.id?"bg-brand-soft border-l-2 border-l-brand":"hover:bg-paper"} ${i>0?"border-t border-rule":""}`}>
              <span className="shrink-0 w-28 text-xs font-medium text-ink-soft pt-0.5">{c.label}</span>
              <span className={`text-sm break-all ${activeCase===c.id?"text-brand font-medium":"text-ink"}`}>{c.fn(input)}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
