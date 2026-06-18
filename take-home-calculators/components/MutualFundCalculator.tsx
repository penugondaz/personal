"use client";

import { useMemo, useState } from "react";
import { calculateSip, calculateLumpsum } from "@/lib/calculators/sip";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function MutualFundCalculator() {
  const [sipInput, setSipInput] = useState("10000");
  const [lumpsumInput, setLumpsumInput] = useState("100000");
  const [rateInput, setRateInput] = useState("12");
  const [years, setYears] = useState(10);

  const sip = Math.max(0, Number(sipInput.replace(/[^0-9.]/g, "")) || 0);
  const lumpsum = Math.max(0, Number(lumpsumInput.replace(/[^0-9.]/g, "")) || 0);
  const rate = Math.max(0, Number(rateInput.replace(/[^0-9.]/g, "")) || 0);

  const sipResult = useMemo(() => calculateSip({ monthlyInvestment: sip, annualReturnRate: rate, years, initialInvestment: lumpsum }), [sip, lumpsum, rate, years]);
  const pureLS = useMemo(() => calculateLumpsum({ principal: lumpsum, annualReturnRate: rate, years }), [lumpsum, rate, years]);

  const totalInvested = sipResult.totalInvestment;
  const totalValue = sipResult.maturityAmount;
  const totalReturns = totalValue - totalInvested;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Monthly SIP amount</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input type="text" inputMode="numeric" value={sipInput} onChange={(e) => setSipInput(e.target.value)} className="tabular w-full bg-transparent text-base font-medium text-ink outline-none" />
          </div>
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs text-ink-soft">One-time lumpsum investment</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-sm text-ink-soft">₹</span>
            <input type="text" inputMode="numeric" value={lumpsumInput} onChange={(e) => setLumpsumInput(e.target.value)} className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
          </div>
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Expected return (%)</span>
            <input type="text" inputMode="decimal" value={rateInput} onChange={(e) => setRateInput(e.target.value)} className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Period: {years} years</span>
            <input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-2 w-full accent-[var(--brand)]" />
          </label>
        </div>
      </div>
      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Total Portfolio Value</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">{formatINR(totalValue)}</div>
          <p className="tabular mt-1 text-sm text-white/70">after {years} years</p>
        </div>
        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Total invested" value={totalInvested} />
          <LineRow label="Total returns" value={totalReturns} emphasis />
          {lumpsum > 0 && <LineRow label="Lumpsum growth alone" value={pureLS.maturityAmount} />}
        </div>
      </div>
      <CalculatorActions shareTitle="My mutual fund projection" shareText={`My MF investment of ${formatINR(sip)}/month SIP + ${formatINR(lumpsum)} lumpsum grows to ${formatINR(totalValue)} in ${years} years.`} />
    </div>
  );
}

function LineRow({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (<div className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${emphasis ? "font-semibold" : ""}`}><span className={`text-sm ${emphasis ? "text-ink" : "text-ink-soft"}`}>{label}</span><span className="tabular text-sm text-ink">{formatINR(value)}</span></div>);
}
