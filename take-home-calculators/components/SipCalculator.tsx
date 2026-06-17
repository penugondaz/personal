"use client";

import { useMemo, useState } from "react";
import { calculateSip } from "@/lib/calculators/sip";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function SipCalculator() {
  const [monthlyInput, setMonthlyInput] = useState("10000");
  const [rateInput, setRateInput] = useState("12");
  const [years, setYears] = useState(15);
  const [stepUpInput, setStepUpInput] = useState("0");
  const [showTable, setShowTable] = useState(false);

  const monthlyInvestment = Math.max(0, Number(monthlyInput.replace(/[^0-9.]/g, "")) || 0);
  const annualReturnRate = Math.max(0, Number(rateInput.replace(/[^0-9.]/g, "")) || 0);
  const annualStepUpPercent = Math.max(0, Number(stepUpInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () => calculateSip({ monthlyInvestment, annualReturnRate, years, annualStepUpPercent }),
    [monthlyInvestment, annualReturnRate, years, annualStepUpPercent]
  );

  const shareText = `My SIP of ${formatINR(monthlyInvestment)}/month is projected to grow to ${formatINR(result.maturityAmount)} in ${years} years. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Monthly SIP amount</span>
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
            <span className="mb-1 block text-xs text-ink-soft">Expected annual return (%)</span>
            <input
              type="text"
              inputMode="decimal"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Annual step-up (%, optional)</span>
            <input
              type="text"
              inputMode="decimal"
              value={stepUpInput}
              onChange={(e) => setStepUpInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium text-ink">Investment period: {years} years</span>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
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
          <p className="tabular mt-1 text-sm text-white/70">after {years} years</p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Total invested" value={result.totalInvestment} />
          <LineRow label="Total returns (wealth gained)" value={result.totalReturns} emphasis />
        </div>
      </div>

      <CalculatorActions shareTitle="My SIP projection" shareText={shareText} />

      <div className="no-print mt-4">
        <button
          type="button"
          onClick={() => setShowTable((s) => !s)}
          className="text-sm font-medium text-brand underline-offset-2 hover:underline"
        >
          {showTable ? "Hide" : "Show"} year-by-year growth
        </button>
        {showTable && (
          <div className="mt-3 overflow-hidden rounded-xl border border-rule">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper text-left">
                  <th className="px-3 py-2 font-medium text-ink-soft">Year</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-soft">Invested (Cumulative)</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-soft">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyBreakdown.map((row) => (
                  <tr key={row.year} className="border-b border-rule last:border-0">
                    <td className="px-3 py-2 text-ink-soft">{row.year}</td>
                    <td className="tabular px-3 py-2 text-right text-ink">{formatINR(row.cumulativeInvested)}</td>
                    <td className="tabular px-3 py-2 text-right font-medium text-ink">{formatINR(row.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
