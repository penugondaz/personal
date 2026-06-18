"use client";

import { useMemo, useState } from "react";
import { calculateSimpleInterest } from "@/lib/calculators/simple-interest";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function SimpleInterestCalculator() {
  const [principalInput, setPrincipalInput] = useState("100000");
  const [rateInput, setRateInput] = useState("8");
  const [years, setYears] = useState(5);

  const principal = Math.max(0, Number(principalInput.replace(/[^0-9.]/g, "")) || 0);
  const annualRate = Math.max(0, Number(rateInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(() => calculateSimpleInterest({ principal, annualRate, years }), [principal, annualRate, years]);

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
          <span className="mb-1 block text-xs text-ink-soft">Annual interest rate (%)</span>
          <input type="text" inputMode="decimal" value={rateInput} onChange={(e) => setRateInput(e.target.value)} className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
        </label>
        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium text-ink">Period: {years} years</span>
          <input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </label>
      </div>
      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Maturity Amount</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">{formatINR(result.maturityAmount)}</div>
          <p className="tabular mt-1 text-sm text-white/70">{formatINR(result.monthlyInterest)}/month interest income</p>
        </div>
        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Principal" value={result.principal} />
          <LineRow label="Total interest" value={result.totalInterest} emphasis />
          <div className="mt-4 rounded-lg bg-brand-soft px-3 py-2.5 text-sm text-brand">
            Formula: SI = P × R × T / 100 = {formatINR(principal)} × {annualRate}% × {years} = {formatINR(result.totalInterest)}
          </div>
        </div>
      </div>
      <CalculatorActions shareTitle="Simple interest result" shareText={`Simple interest on ${formatINR(principal)} at ${annualRate}% for ${years} years = ${formatINR(result.totalInterest)}.`} />
    </div>
  );
}

function LineRow({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (<div className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${emphasis ? "font-semibold" : ""}`}><span className={`text-sm ${emphasis ? "text-ink" : "text-ink-soft"}`}>{label}</span><span className="tabular text-sm text-ink">{formatINR(value)}</span></div>);
}
