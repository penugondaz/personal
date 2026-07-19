"use client";
import { useState, useMemo } from "react";
import { formatINR } from "@/lib/format";

const NSC_RATE = 7.7;
const NSC_TENURE = 5;

function calcNsc(principal: number) {
  const rate = NSC_RATE / 100;
  const breakdown: { year: number; interest: number; cumInterest: number; balance: number; eligible80C: boolean }[] = [];
  let balance = principal, cumInterest = 0;
  for (let y = 1; y <= NSC_TENURE; y++) {
    const interest = Math.round(balance * rate);
    balance = Math.round(balance + interest);
    cumInterest += interest;
    breakdown.push({ year: y, interest, cumInterest, balance, eligible80C: y < NSC_TENURE });
  }
  return { maturity: balance, totalInterest: balance - principal, breakdown };
}

export default function NscCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const p = Math.max(0, Number(principal.replace(/[^0-9]/g,""))||0);
  const result = useMemo(() => calcNsc(p), [p]);

  const r = 54, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  const pct = result.maturity ? p / result.maturity : 0;
  const dash = circ * pct;

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Investment Amount (₹)</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-ink-soft">₹</span>
            <input type="text" inputMode="numeric" value={principal} onChange={e => setPrincipal(e.target.value)} className="tabular w-full bg-transparent text-xl font-semibold text-ink outline-none" />
          </div>
        </label>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[50000, 100000, 150000].map(v => (
            <button key={v} onClick={() => setPrincipal(String(v))}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${p===v?"border-brand bg-brand text-white":"border-rule text-ink-soft hover:border-brand hover:text-brand"}`}>
              ₹{(v/1000).toFixed(0)}K
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Maturity Value (after 5 years)</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">{formatINR(result.maturity)}</div>
          <p className="mt-1 text-sm text-white/70">Interest earned: {formatINR(result.totalInterest)} at {NSC_RATE}% p.a.</p>
        </div>
        <div className="px-6 py-5 sm:px-8 flex flex-col sm:flex-row items-center gap-6">
          <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true" className="shrink-0">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--rule)" strokeWidth="16" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--brand-soft)" strokeWidth="16"
              strokeDasharray={`${circ - dash} ${dash}`} strokeDashoffset={circ / 4} strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--brand)" strokeWidth="16"
              strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4} strokeLinecap="round" />
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="var(--ink-soft)">Principal</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--ink)">{Math.round(pct * 100)}%</text>
          </svg>
          <div className="flex-1 space-y-2 w-full">
            {[
              { label: "Principal invested", value: formatINR(p), cls: "text-ink" },
              { label: "Total interest", value: formatINR(result.totalInterest), cls: "text-brand" },
              { label: "Effective yield", value: p > 0 ? `${((result.totalInterest / p) * 100).toFixed(2)}%` : "0%", cls: "text-ink" },
              { label: "80C eligible (principal)", value: formatINR(Math.min(p, 150000)), cls: "text-ink" },
            ].map(item => (
              <div key={item.label} className="flex justify-between border-b border-dashed border-rule py-1.5 text-sm">
                <span className="text-ink-soft">{item.label}</span>
                <span className={`tabular font-medium ${item.cls}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-rule">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-rule bg-paper text-left">
            <th className="px-3 py-2 font-medium text-ink-soft">Year</th>
            <th className="px-3 py-2 text-right font-medium text-ink-soft">Interest Earned</th>
            <th className="px-3 py-2 text-right font-medium text-ink-soft">Cumulative Interest</th>
            <th className="px-3 py-2 text-right font-medium text-ink-soft">Balance</th>
            <th className="px-3 py-2 text-center font-medium text-ink-soft">80C?</th>
          </tr></thead>
          <tbody>
            {result.breakdown.map(r => (
              <tr key={r.year} className={`border-b border-rule last:border-0 ${r.year === NSC_TENURE ? "bg-brand-soft font-semibold" : ""}`}>
                <td className="px-3 py-2 text-ink-soft">Year {r.year}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.interest)}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.cumInterest)}</td>
                <td className="tabular px-3 py-2 text-right text-brand">{formatINR(r.balance)}</td>
                <td className="px-3 py-2 text-center text-xs">{r.eligible80C ? <span className="text-brand">✓ Yes</span> : <span className="text-ink-soft">Taxable</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-soft">Interest from years 1–4 is deemed reinvested and qualifies for 80C deduction in the following year. Year 5 interest is taxable at your slab rate.</p>
    </>
  );
}
