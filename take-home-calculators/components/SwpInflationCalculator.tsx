"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { formatINR, formatINRCompact } from "@/lib/format";

function calcSwpInflation(corpus: number, withdrawal: number, returnRate: number, inflation: number, years: number) {
  const monthlyReturn = returnRate / 12 / 100;
  const monthlyInflation = inflation / 12 / 100;
  let balance = corpus, totalWithdrawn = 0, currentWithdrawal = withdrawal;
  let exhaustedMonth: number | null = null;
  const breakdown: { year: number; withdrawal: number; balance: number; realValue: number }[] = [];

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      const month = (y - 1) * 12 + m + 1;
      if (balance <= 0) { if (!exhaustedMonth) exhaustedMonth = month; break; }
      balance = balance * (1 + monthlyReturn) - currentWithdrawal;
      totalWithdrawn += currentWithdrawal;
      currentWithdrawal *= (1 + monthlyInflation);
      if (balance < 0) { if (!exhaustedMonth) exhaustedMonth = month; balance = 0; }
    }
    breakdown.push({
      year: y,
      withdrawal: Math.round(currentWithdrawal),
      balance: Math.round(Math.max(0, balance)),
      realValue: Math.round(Math.max(0, balance) / Math.pow(1 + inflation / 100, y)),
    });
    if (balance <= 0) break;
  }
  return { finalBalance: Math.round(Math.max(0, balance)), totalWithdrawn: Math.round(totalWithdrawn), exhaustedMonth, breakdown, finalWithdrawal: Math.round(currentWithdrawal) };
}

function LineChart({ data, maxY }: { data: { year: number; balance: number; realValue: number }[]; maxY: number }) {
  if (data.length < 2) return null;
  const w = 400, h = 160, pad = { l: 10, r: 10, t: 10, b: 20 };
  const plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;
  const xs = data.map((_, i) => pad.l + (i / (data.length - 1)) * plotW);
  const yp = (v: number) => pad.t + plotH - (v / (maxY || 1)) * plotH;
  const path = (vals: number[]) => vals.map((v, i) => `${i === 0 ? "M" : "L"}${xs[i].toFixed(1)},${yp(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" aria-hidden="true">
      <path d={path(data.map(d => d.balance))} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinejoin="round" />
      <path d={path(data.map(d => d.realValue))} fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 3" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.year}>
          <circle cx={xs[i]} cy={yp(d.balance)} r="3" fill="var(--brand)" />
          {d.year % 5 === 0 && <text x={xs[i]} y={h - 4} textAnchor="middle" fontSize="8" fill="var(--ink-soft)">{d.year}y</text>}
        </g>
      ))}
    </svg>
  );
}

export default function SwpInflationCalculator() {
  const [corpus, setCorpus] = useState("5000000");
  const [withdrawal, setWithdrawal] = useState("30000");
  const [returns, setReturns] = useState("8");
  const [inflation, setInflation] = useState("6");
  const [years, setYears] = useState(25);

  const c   = Math.max(0, Number(corpus.replace(/[^0-9]/g,""))||0);
  const w   = Math.max(0, Number(withdrawal.replace(/[^0-9]/g,""))||0);
  const r   = Math.max(0, Number(returns)||0);
  const inf = Math.max(0, Number(inflation)||0);

  const result = useMemo(() => calcSwpInflation(c, w, r, inf, years), [c, w, r, inf, years]);
  const maxY   = Math.max(...result.breakdown.map(d => d.balance), 1);

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            { label: "Total Corpus (₹)", val: corpus, set: setCorpus, prefix: true },
            { label: "Monthly Withdrawal (₹)", val: withdrawal, set: setWithdrawal, prefix: true },
            { label: "Expected Return (% p.a.)", val: returns, set: setReturns, prefix: false },
            { label: "Inflation Rate (% p.a.)", val: inflation, set: setInflation, prefix: false },
          ] as const).map(f => (
            <label key={f.label} className="block">
              <span className="mb-1 block text-xs text-ink-soft">{f.label}</span>
              <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
                {f.prefix && <span className="text-ink-soft">₹</span>}
                <input type="text" inputMode="decimal" value={f.val} onChange={e => f.set(e.target.value)} className="tabular w-full bg-transparent text-base font-medium text-ink outline-none" />
              </div>
            </label>
          ))}
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-ink">Withdrawal period: {years} years</span>
            <input type="range" min={5} max={40} value={years} onChange={e => setYears(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          </label>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className={`px-6 py-7 sm:px-8 ${result.exhaustedMonth ? "bg-deduction" : "brand-gradient"}`}>
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            {result.exhaustedMonth ? "⚠ Corpus Exhausted" : `Remaining Corpus After ${years} Years`}
          </p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {result.exhaustedMonth ? `Month ${result.exhaustedMonth}` : formatINR(result.finalBalance)}
          </div>
          <p className="mt-1 text-sm text-white/70">
            Final monthly withdrawal: {formatINR(result.finalWithdrawal)} · Total withdrawn: {formatINRCompact(result.totalWithdrawn)}
          </p>
        </div>
        <div className="px-6 py-5 sm:px-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">Corpus Over Time</p>
          <LineChart data={result.breakdown} maxY={maxY} />
          <div className="mt-2 flex gap-4 text-xs text-ink-soft">
            <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 rounded" style={{background:"var(--brand)"}} />Nominal balance</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 rounded" style={{background:"var(--accent)"}} />Real value (today's ₹)</span>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-rule">
        <table className="w-full text-sm" style={{minWidth:480}}>
          <thead><tr className="border-b border-rule bg-paper text-left">
            <th className="px-3 py-2 font-medium text-ink-soft">Year</th>
            <th className="px-3 py-2 text-right font-medium text-ink-soft">Monthly Withdrawal</th>
            <th className="px-3 py-2 text-right font-medium text-ink-soft">Balance</th>
            <th className="px-3 py-2 text-right font-medium text-ink-soft">Real Value</th>
          </tr></thead>
          <tbody>
            {result.breakdown.map(r => (
              <tr key={r.year} className={`border-b border-rule last:border-0 ${r.balance === 0 ? "bg-red-50" : r.year % 5 === 0 ? "bg-brand-soft" : ""}`}>
                <td className="px-3 py-2 text-ink-soft">Year {r.year}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.withdrawal)}</td>
                <td className="tabular px-3 py-2 text-right font-medium text-ink">{r.balance ? formatINRCompact(r.balance) : <span className="text-deduction">Exhausted</span>}</td>
                <td className="tabular px-3 py-2 text-right text-ink-soft">{r.realValue ? formatINRCompact(r.realValue) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-10 space-y-4">
        {[
          { q: "What is SWP with inflation adjustment?", a: "A standard SWP withdraws a fixed amount monthly. With inflation adjustment, the withdrawal amount increases every month to maintain purchasing power — so if you withdraw ₹30,000 today at 6% inflation, you withdraw a little more each month. This better models real retirement needs." },
          { q: "What return rate should I use for retirement planning?", a: "Conservative retirees use 7–8% (debt-heavy portfolio). A balanced 50/50 portfolio may target 9–10%. Equity-heavy portfolios may assume 11–12%, but with higher volatility risk. Always model conservatively." },
        ].map(f => (
          <div key={f.q} className="border-b border-rule pb-4">
            <h3 className="font-medium text-ink">{f.q}</h3>
            <p className="mt-1.5 text-sm text-ink-soft">{f.a}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl text-ink">Related</h2>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[{href:"/calculator/swp-calculator",label:"SWP Calculator"},{href:"/calculator/sip-calculator",label:"SIP Calculator"},{href:"/calculator/goal-planning-calculator",label:"Goal Planning"}].map(l=>(
            <li key={l.href}><Link href={l.href} className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">{l.label}</Link></li>
          ))}
        </ul>
      </section>
    </>
  );
}
