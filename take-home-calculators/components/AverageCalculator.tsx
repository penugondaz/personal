"use client";
import { useState, useMemo } from "react";

function computeStats(input: string) {
  const nums = input.split(/[\s,\n]+/).map(s => parseFloat(s)).filter(n => !isNaN(n));
  if (!nums.length) return null;
  const sorted = [...nums].sort((a,b) => a-b);
  const mean = nums.reduce((s,n) => s+n, 0) / nums.length;
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid-1]+sorted[mid])/2 : sorted[mid];
  const freq: Record<number,number> = {};
  nums.forEach(n => { freq[n] = (freq[n]||0)+1; });
  const maxF = Math.max(...Object.values(freq));
  const modes = Object.entries(freq).filter(([,f]) => f===maxF).map(([n]) => Number(n));
  const variance = nums.reduce((s,n) => s+(n-mean)**2, 0) / nums.length;
  return { mean, median, modes, min: sorted[0], max: sorted[sorted.length-1], sum: nums.reduce((s,n)=>s+n,0), count: nums.length, stddev: Math.sqrt(variance) };
}

export default function AverageCalculator() {
  const [input, setInput] = useState("10, 20, 30, 40, 50");
  const s = useMemo(() => computeStats(input), [input]);

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Enter numbers (comma or newline separated)</span>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={4}
            className="w-full rounded-lg border border-rule bg-paper px-3 py-3 text-sm font-mono text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 resize-none"
            placeholder="10, 20, 30, 40, 50" />
        </label>
        {s && <p className="mt-2 text-xs text-ink-soft">{s.count} numbers detected</p>}
      </div>

      {s && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            {label:"Mean (Average)", value:s.mean.toFixed(6).replace(/\.?0+$/,""), highlight:true},
            {label:"Median",         value:s.median.toFixed(6).replace(/\.?0+$/,"")},
            {label:"Mode",           value:s.modes.join(", ")},
            {label:"Sum",            value:s.sum.toLocaleString()},
            {label:"Count",          value:s.count.toString()},
            {label:"Min",            value:s.min.toString()},
            {label:"Max",            value:s.max.toString()},
            {label:"Std Deviation",  value:s.stddev.toFixed(4)},
          ].map(item => (
            <div key={item.label} className={`rounded-xl border p-4 ${item.highlight ? "border-brand bg-brand-soft" : "border-rule bg-surface"}`}>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{item.label}</p>
              <p className={`tabular mt-1 font-display text-2xl font-semibold ${item.highlight ? "text-brand" : "text-ink"}`}>{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
