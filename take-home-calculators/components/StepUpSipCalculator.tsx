"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { formatINR, formatINRCompact } from "@/lib/format";

function calculateStepUpSip(monthly: number, rate: number, years: number, stepUp: number) {
  const monthlyRate = rate / 12 / 100;
  let balance = 0, totalInvested = 0, currentSip = monthly;
  const breakdown: { year: number; sip: number; invested: number; balance: number }[] = [];
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      balance += currentSip;
      balance *= (1 + monthlyRate);
      totalInvested += currentSip;
    }
    breakdown.push({ year: y, sip: Math.round(currentSip), invested: Math.round(totalInvested), balance: Math.round(balance) });
    currentSip *= (1 + stepUp / 100);
  }
  return { maturity: Math.round(balance), totalInvested: Math.round(totalInvested), returns: Math.round(balance - totalInvested), breakdown };
}

function BarChart({ data }: { data: { year: number; invested: number; balance: number }[] }) {
  const max = Math.max(...data.map(d => d.balance));
  return (
    <div className="mt-4">
      <div className="flex items-end gap-1 h-40">
        {data.map(d => (
          <div key={d.year} className="flex-1 flex flex-col items-center group relative">
            <div className="w-full flex flex-col justify-end" style={{ height: "100%" }}>
              <div className="w-full rounded-t-sm" style={{ height: `${(d.invested / max) * 100}%`, background: "var(--brand-soft)" }} />
              <div className="w-full rounded-t-sm" style={{ height: `${((d.balance - d.invested) / max) * 100}%`, background: "var(--brand)" }} />
            </div>
            <span className="text-[9px] text-ink-soft mt-0.5">{d.year}y</span>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 bg-ink text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
              {formatINRCompact(d.balance)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm" style={{background:"var(--brand-soft)"}} />Invested</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm" style={{background:"var(--brand)"}} />Returns</span>
      </div>
    </div>
  );
}

export default function StepUpSipCalculator() {
  const [sip, setSip] = useState("10000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState(15);
  const [stepUp, setStepUp] = useState("10");

  const sipVal = Math.max(0, Number(sip.replace(/[^0-9]/g, "")) || 0);
  const rateVal = Math.max(0, Number(rate) || 0);
  const stepVal = Math.max(0, Number(stepUp) || 0);

  const result = useMemo(() => calculateStepUpSip(sipVal, rateVal, years, stepVal), [sipVal, rateVal, years, stepVal]);
  const flat   = useMemo(() => calculateStepUpSip(sipVal, rateVal, years, 0),       [sipVal, rateVal, years]);

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Monthly SIP (₹)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-ink-soft">₹</span>
              <input type="text" inputMode="numeric" value={sip} onChange={e => setSip(e.target.value)} className="tabular w-full bg-transparent text-base font-medium text-ink outline-none" />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Annual Step-Up (%)</span>
            <input type="text" inputMode="decimal" value={stepUp} onChange={e => setStepUp(e.target.value)} className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2.5 text-base font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Expected Return (% p.a.)</span>
            <input type="text" inputMode="decimal" value={rate} onChange={e => setRate(e.target.value)} className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2.5 text-base font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Period: {years} years</span>
            <input type="range" min={1} max={40} value={years} onChange={e => setYears(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          </label>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Maturity Value (Step-Up SIP)</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">{formatINR(result.maturity)}</div>
          <p className="mt-1 text-sm text-white/70">Total invested: {formatINR(result.totalInvested)} · Returns: {formatINR(result.returns)}</p>
        </div>
        <div className="px-6 py-5 sm:px-8">
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-brand-soft p-4 text-sm">
            <div>
              <p className="text-ink-soft">vs Flat SIP ({formatINR(sipVal)}/mo)</p>
              <p className="tabular mt-0.5 font-display text-lg font-semibold text-ink">{formatINR(flat.maturity)}</p>
            </div>
            <div>
              <p className="text-ink-soft">Extra corpus from step-up</p>
              <p className="tabular mt-0.5 font-display text-lg font-semibold text-brand">+{formatINR(result.maturity - flat.maturity)}</p>
            </div>
          </div>
          <BarChart data={result.breakdown} />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-rule">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-rule bg-paper text-left">
            <th className="px-3 py-2 font-medium text-ink-soft">Year</th>
            <th className="px-3 py-2 text-right font-medium text-ink-soft">Monthly SIP</th>
            <th className="px-3 py-2 text-right font-medium text-ink-soft">Total Invested</th>
            <th className="px-3 py-2 text-right font-medium text-ink-soft">Balance</th>
          </tr></thead>
          <tbody>
            {result.breakdown.map(r => (
              <tr key={r.year} className={`border-b border-rule last:border-0 ${r.year % 5 === 0 ? "bg-brand-soft" : ""}`}>
                <td className="px-3 py-2 text-ink-soft">Year {r.year}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.sip)}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINRCompact(r.invested)}</td>
                <td className="tabular px-3 py-2 text-right font-medium text-brand">{formatINRCompact(r.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-10 space-y-4">
        {[
          { q: "What is a step-up SIP?", a: "A step-up (or top-up) SIP automatically increases your monthly investment by a fixed percentage every year. Starting at ₹10,000/month with a 10% annual step-up means you invest ₹11,000 in year 2, ₹12,100 in year 3 — matching typical salary growth." },
          { q: "Why is step-up SIP better than flat SIP?", a: "Because inflation erodes purchasing power, a fixed SIP amount represents declining real investment over time. A step-up keeps your investment constant in real terms, and the compounding on incremental amounts significantly boosts the final corpus." },
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
          {[{href:"/calculator/sip-calculator",label:"SIP Calculator"},{href:"/calculator/swp-inflation-calculator",label:"SWP with Inflation"},{href:"/calculator/goal-planning-calculator",label:"Goal Planning"}].map(l=>(
            <li key={l.href}><Link href={l.href} className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">{l.label}</Link></li>
          ))}
        </ul>
      </section>
    </>
  );
}
