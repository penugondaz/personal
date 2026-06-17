"use client";

import { useMemo, useState } from "react";
import { calculateFd, COMPOUNDING_LABELS, type CompoundingFrequency } from "@/lib/calculators/fd";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function FdCalculator() {
  const [principalInput, setPrincipalInput] = useState("100000");
  const [rateInput, setRateInput] = useState("7");
  const [tenureYears, setTenureYears] = useState(5);
  const [compounding, setCompounding] = useState<CompoundingFrequency>("quarterly");

  const principal = Math.max(0, Number(principalInput.replace(/[^0-9.]/g, "")) || 0);
  const annualInterestRate = Math.max(0, Number(rateInput.replace(/[^0-9.]/g, "")) || 0);
  const tenureMonths = Math.round(tenureYears * 12);

  const result = useMemo(
    () => calculateFd({ principal, annualInterestRate, tenureMonths, compounding }),
    [principal, annualInterestRate, tenureMonths, compounding]
  );

  const shareText = `My FD of ${formatINR(principal)} grows to ${formatINR(result.maturityAmount)} in ${tenureYears} years. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Deposit amount</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={principalInput}
              onChange={(e) => setPrincipalInput(e.target.value)}
              className="tabular w-full bg-transparent text-base font-medium text-ink outline-none"
            />
          </div>
        </label>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Interest rate (% p.a.)</span>
            <input
              type="text"
              inputMode="decimal"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Compounding</span>
            <select
              value={compounding}
              onChange={(e) => setCompounding(e.target.value as CompoundingFrequency)}
              className="w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
            >
              {(Object.keys(COMPOUNDING_LABELS) as CompoundingFrequency[]).map((freq) => (
                <option key={freq} value={freq}>
                  {COMPOUNDING_LABELS[freq]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium text-ink">Tenure: {tenureYears} years</span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full accent-[var(--brand)]"
          />
        </label>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Maturity Amount</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.maturityAmount)}
          </div>
          <p className="tabular mt-1 text-sm text-white/70">after {tenureYears} years, {COMPOUNDING_LABELS[compounding].toLowerCase()} compounding</p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Principal" value={result.principal} />
          <LineRow label="Interest earned" value={result.totalInterest} emphasis />
        </div>
      </div>

      <CalculatorActions shareTitle="My FD projection" shareText={shareText} />
    </div>
  );
}

function LineRow({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${emphasis ? "font-semibold" : ""}`}>
      <span className={`text-sm ${emphasis ? "text-ink" : "text-ink-soft"}`}>{label}</span>
      <span className="tabular text-sm text-ink">{formatINR(value)}</span>
    </div>
  );
}
