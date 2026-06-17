"use client";

import { useMemo, useState } from "react";
import { calculateRd, type RdCompoundingFrequency } from "@/lib/calculators/rd";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function RdCalculator() {
  const [monthlyInput, setMonthlyInput] = useState("5000");
  const [rateInput, setRateInput] = useState("6.5");
  const [tenureMonths, setTenureMonths] = useState(12);
  const [compounding, setCompounding] = useState<RdCompoundingFrequency>("quarterly");

  const monthlyDeposit = Math.max(0, Number(monthlyInput.replace(/[^0-9.]/g, "")) || 0);
  const annualInterestRate = Math.max(0, Number(rateInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () => calculateRd({ monthlyDeposit, annualInterestRate, tenureMonths, compounding }),
    [monthlyDeposit, annualInterestRate, tenureMonths, compounding]
  );

  const shareText = `My RD of ${formatINR(monthlyDeposit)}/month matures to ${formatINR(result.maturityAmount)}. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Monthly deposit</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={monthlyInput}
              onChange={(e) => setMonthlyInput(e.target.value)}
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
              onChange={(e) => setCompounding(e.target.value as RdCompoundingFrequency)}
              className="w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
            >
              <option value="quarterly">Quarterly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium text-ink">Tenure: {tenureMonths} months</span>
          <input
            type="range"
            min={6}
            max={120}
            step={1}
            value={tenureMonths}
            onChange={(e) => setTenureMonths(Number(e.target.value))}
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
          <p className="tabular mt-1 text-sm text-white/70">after {tenureMonths} months</p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Total deposited" value={result.totalDeposit} />
          <LineRow label="Interest earned" value={result.totalInterest} emphasis />
        </div>
      </div>

      <CalculatorActions shareTitle="My RD projection" shareText={shareText} />
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
