"use client";

import { useMemo, useState } from "react";
import { calculateSwp } from "@/lib/calculators/swp";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function SwpCalculator() {
  const [corpusInput, setCorpusInput] = useState("5000000");
  const [withdrawalInput, setWithdrawalInput] = useState("30000");
  const [rateInput, setRateInput] = useState("8");
  const [years, setYears] = useState(20);
  const [showTable, setShowTable] = useState(false);

  const initialCorpus = Math.max(0, Number(corpusInput.replace(/[^0-9.]/g, "")) || 0);
  const monthlyWithdrawal = Math.max(0, Number(withdrawalInput.replace(/[^0-9.]/g, "")) || 0);
  const expectedAnnualReturn = Math.max(0, Number(rateInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(() => calculateSwp({ initialCorpus, monthlyWithdrawal, expectedAnnualReturn, years }), [initialCorpus, monthlyWithdrawal, expectedAnnualReturn, years]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Total corpus</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input type="text" inputMode="numeric" value={corpusInput} onChange={(e) => setCorpusInput(e.target.value)} className="tabular w-full bg-transparent text-base font-medium text-ink outline-none" />
          </div>
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs text-ink-soft">Monthly withdrawal</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-sm text-ink-soft">₹</span>
            <input type="text" inputMode="numeric" value={withdrawalInput} onChange={(e) => setWithdrawalInput(e.target.value)} className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
          </div>
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Expected return (%)</span>
            <input type="text" inputMode="decimal" value={rateInput} onChange={(e) => setRateInput(e.target.value)} className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Period: {years} years</span>
            <input type="range" min={1} max={40} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-2 w-full accent-[var(--brand)]" />
          </label>
        </div>
      </div>
      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Remaining Corpus After {years} Years</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">{formatINR(result.remainingCorpus)}</div>
          {result.corpusExhaustedMonth && <p className="tabular mt-1 text-sm text-white/70">Corpus exhausted in month {result.corpusExhaustedMonth}</p>}
        </div>
        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Total withdrawn" value={result.totalWithdrawn} />
          <LineRow label="Returns earned during SWP" value={result.totalReturnsEarned} />
          <LineRow label="Remaining corpus" value={result.remainingCorpus} emphasis />
        </div>
      </div>
      <CalculatorActions shareTitle="My SWP plan" shareText={`With a ${formatINR(initialCorpus)} corpus and ${formatINR(monthlyWithdrawal)}/month withdrawal, I'll have ${formatINR(result.remainingCorpus)} left after ${years} years.`} />
      <div className="no-print mt-4">
        <button type="button" onClick={() => setShowTable((s) => !s)} className="text-sm font-medium text-brand underline-offset-2 hover:underline">{showTable ? "Hide" : "Show"} year-by-year breakdown</button>
        {showTable && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-rule">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-rule bg-paper text-left"><th className="px-3 py-2 font-medium text-ink-soft">Year</th><th className="px-3 py-2 text-right font-medium text-ink-soft">Withdrawn</th><th className="px-3 py-2 text-right font-medium text-ink-soft">Returns</th><th className="px-3 py-2 text-right font-medium text-ink-soft">Balance</th></tr></thead>
              <tbody>{result.yearlyBreakdown.map((r) => (<tr key={r.year} className="border-b border-rule last:border-0"><td className="px-3 py-2 text-ink-soft">{r.year}</td><td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.withdrawn)}</td><td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.returnsEarned)}</td><td className="tabular px-3 py-2 text-right font-medium text-ink">{formatINR(r.closingBalance)}</td></tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function LineRow({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (<div className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${emphasis ? "font-semibold" : ""}`}><span className={`text-sm ${emphasis ? "text-ink" : "text-ink-soft"}`}>{label}</span><span className="tabular text-sm text-ink">{formatINR(value)}</span></div>);
}
