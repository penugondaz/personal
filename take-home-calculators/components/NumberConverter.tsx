"use client";
import { useState, useMemo } from "react";

function convertNumber(n: number) {
  if (!isFinite(n) || n < 0) return [];
  const abs = Math.abs(n);
  const crore   = Math.floor(abs / 1e7);
  const lakh    = Math.floor((abs % 1e7) / 1e5);
  const thousand= Math.floor((abs % 1e5) / 1e3);
  const hundred = Math.floor((abs % 1e3) / 100);
  const remainder = abs % 100;

  const parts: string[] = [];
  if (crore > 0)     parts.push(`${crore} Crore`);
  if (lakh > 0)      parts.push(`${lakh} Lakh`);
  if (thousand > 0)  parts.push(`${thousand} Thousand`);
  if (hundred > 0)   parts.push(`${hundred} Hundred`);
  if (remainder > 0) parts.push(`${remainder}`);

  const results: {label:string;value:string}[] = [
    { label: "Full Breakdown", value: parts.join(", ") || "0" },
  ];
  if (abs >= 1e7)  results.push({ label: "In Crore",    value: `${(abs/1e7).toFixed(4).replace(/\.?0+$/,"")} Crore` });
  if (abs >= 1e5)  results.push({ label: "In Lakh",     value: `${(abs/1e5).toFixed(4).replace(/\.?0+$/,"")} Lakh` });
  if (abs >= 1e3)  results.push({ label: "In Thousand", value: `${(abs/1e3).toFixed(4).replace(/\.?0+$/,"")} Thousand` });
  if (abs >= 1e6)  results.push({ label: "In Million",  value: `${(abs/1e6).toFixed(4).replace(/\.?0+$/,"")} Million` });
  if (abs >= 1e9)  results.push({ label: "In Billion",  value: `${(abs/1e9).toFixed(4).replace(/\.?0+$/,"")} Billion` });
  results.push({ label: "Indian format",  value: abs.toLocaleString("en-IN") });
  results.push({ label: "Global format",  value: abs.toLocaleString("en-US") });
  return results;
}

const EXAMPLES = [100000000, 12333232, 150000, 10000000, 1000000000, 50000];

export default function NumberConverter() {
  const [input, setInput] = useState("100000000");
  const num = useMemo(() => parseFloat(input.replace(/[^0-9.]/g,""))||0, [input]);
  const results = useMemo(() => convertNumber(num), [num]);

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Enter a number</span>
          <input type="text" inputMode="numeric" value={input} onChange={e => setInput(e.target.value)}
            className="tabular w-full rounded-lg border border-rule bg-paper px-4 py-4 text-2xl font-bold text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" placeholder="e.g. 100000000" />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map(e => (
            <button key={e} onClick={() => setInput(String(e))}
              className="rounded-full border border-rule px-3 py-1 text-xs text-ink-soft hover:border-brand hover:text-brand transition">
              {e.toLocaleString("en-IN")}
            </button>
          ))}
        </div>
      </div>

      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
            <div className="brand-gradient px-6 py-6 sm:px-8">
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">Full Breakdown</p>
              <p className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl leading-tight">{results[0].value}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {results.slice(1).map(r => (
              <div key={r.label} className="rounded-xl border border-rule bg-surface p-4 shadow-card">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{r.label}</p>
                <p className="tabular mt-1 font-display text-xl font-semibold text-ink">{r.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="mt-10">
        <h2 className="font-display text-xl text-ink">Quick Reference</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-rule">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-rule bg-paper text-left">
              <th className="px-4 py-2.5 font-medium text-ink-soft">Number</th>
              <th className="px-4 py-2.5 font-medium text-ink-soft">Indian System</th>
              <th className="px-4 py-2.5 font-medium text-ink-soft">International</th>
            </tr></thead>
            <tbody>
              {[
                [1000,        "One Thousand",         "Thousand"],
                [100000,      "One Lakh",             "Hundred Thousand"],
                [1000000,     "Ten Lakh",             "One Million"],
                [10000000,    "One Crore",            "Ten Million"],
                [100000000,   "Ten Crore",            "Hundred Million"],
                [1000000000,  "One Hundred Crore",    "One Billion"],
              ].map(([n, ind, intl]) => (
                <tr key={n} className="border-b border-rule last:border-0 hover:bg-paper">
                  <td className="tabular px-4 py-2.5 font-mono text-ink">{Number(n).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{ind}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{intl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
