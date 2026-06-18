"use client";

import { useMemo, useState } from "react";
import { calculateCompoundInterest, COMPOUNDING_OPTIONS } from "@/lib/calculators/compound-interest";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function CompoundInterestCalculator() {
  const [principalInput, setPrincipalInput] = useState("100000");
  const [rateInput, setRateInput] = useState("8");
  const [years, setYears] = useState(10);
  const [compounding, setCompounding] = useState(12);
  const [monthlyInput, setMonthlyInput] = useState("0");

  const principal = Math.max(0, Number(principalInput.replace(/[^0-9.]/g, "")) || 0);
  const annualRate = Math.max(0, Number(rateInput.replace(/[^0-9.]/g, "")) || 0);
  const monthlyAddition = Math.max(0, Number(monthlyInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () => calculateCompoundInterest({ principal, annualRate, years, compoundingPerYear: compounding, monthlyAddition }),
    [principal, annualRate, years, compounding, monthlyAddition]
  );

  const [showTable, setShowTable] = useState(false);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Principal amount</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input type="text" inputMode="numeric" value={principalInput} onChange={(e) => setPrincipalInput(e.target.value)} className="tabular w-full bg-transparent text-base font-medium text-ink outline-none" />
          </div>
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs text-ink-soft">Monthly addition (optional)</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-sm text-ink-soft">₹</span>
            <input type="text" inputMode="numeric" value={monthlyInput} onChange={(e) => setMonthlyInput(e.target.value)} placeholder="0" className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
          </div>
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Annual rate (%)</span>
            <input type="text" inputMode="decimal" value={rateInput} onChange={(e) => setRateInput(e.target.value)} className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Compounding</span>
            <select value={compounding} onChange={(e) => setCompounding(Number(e.target.value))} className="w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15">
              {COMPOUNDING_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
          </label>
        </div>
        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium text-ink">Period: {years} years</span>
          <input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </label>
      </div>
      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Maturity Amount</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">{formatINR(result.maturityAmount)}</div>
          <p className="tabular mt-1 text-sm text-white/70">after {years} years</p>
        </div>
        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Total deposits" value={result.totalDeposits} />
          <LineRow label="Interest earned" value={result.totalInterest} emphasis />
        </div>
      </div>
      <CalculatorActions shareTitle="Compound interest result" shareText={`${formatINR(principal)} grows to ${formatINR(result.maturityAmount)} in ${years} years at ${annualRate}%.`} />
      <div className="no-print mt-4">
        <button type="button" onClick={() => setShowTable((s) => !s)} className="text-sm font-medium text-brand underline-offset-2 hover:underline">
          {showTable ? "Hide" : "Show"} year-by-year breakdown
        </button>
        {showTable && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-rule">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-rule bg-paper text-left"><th className="px-3 py-2 font-medium text-ink-soft">Year</th><th className="px-3 py-2 text-right font-medium text-ink-soft">Deposits</th><th className="px-3 py-2 text-right font-medium text-ink-soft">Interest</th><th className="px-3 py-2 text-right font-medium text-ink-soft">Balance</th></tr></thead>
              <tbody>{result.yearlyBreakdown.map((r) => (<tr key={r.year} className="border-b border-rule last:border-0"><td className="px-3 py-2 text-ink-soft">{r.year}</td><td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.deposits)}</td><td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.interest)}</td><td className="tabular px-3 py-2 text-right font-medium text-ink">{formatINR(r.balance)}</td></tr>))}</tbody>
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
