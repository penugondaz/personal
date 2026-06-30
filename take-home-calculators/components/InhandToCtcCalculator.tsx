"use client";

import { useMemo, useState } from "react";
import { calculateInhandToCtc } from "@/lib/calculators/inhand-to-ctc";
import type { TaxRegime } from "@/lib/calculators/income-tax";
import { formatINR, formatINRCompact } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function InhandToCtcCalculator({ defaultMonthly = 50000 }: { defaultMonthly?: number }) {
  const [inhandInput, setInhandInput] = useState(String(defaultMonthly));
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [showDetails, setShowDetails] = useState(false);

  const targetInHandMonthly = Math.max(0, Number(inhandInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(() => calculateInhandToCtc({ targetInHandMonthly, regime }), [targetInHandMonthly, regime]);

  const annualGap = result.grossSalaryMonthly * 12 - result.estimatedAnnualCtc * 0; // placeholder safe
  const deductionPercent = result.grossSalaryMonthly > 0
    ? ((result.totalDeductionsMonthly / result.grossSalaryMonthly) * 100).toFixed(1)
    : "0";

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Input */}
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Desired in-hand salary (per month)</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input type="text" inputMode="numeric" value={inhandInput}
              onChange={(e) => setInhandInput(e.target.value)}
              className="tabular w-full bg-transparent text-base font-medium text-ink outline-none"
              placeholder="50,000" />
          </div>
        </label>
        <fieldset className="mt-4">
          <legend className="mb-1.5 text-xs text-ink-soft">Tax regime</legend>
          <div className="flex gap-2">
            <button type="button" onClick={() => setRegime("new")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${regime === "new" ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand hover:text-brand"}`}>
              New regime
            </button>
            <button type="button" onClick={() => setRegime("old")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${regime === "old" ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand hover:text-brand"}`}>
              Old regime
            </button>
          </div>
        </fieldset>
      </div>

      {/* Result card */}
      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">You Need a CTC Of</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINRCompact(result.estimatedAnnualCtc)}
          </div>
          <p className="tabular mt-1 text-sm text-white/70">
            {formatINR(result.estimatedAnnualCtc)} per year ({formatINR(result.estimatedMonthlyCtc)}/month)
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Target in-hand" value={result.targetInHandMonthly} />
          <LineRow label="Actual in-hand at this CTC" value={result.actualInHandMonthly} emphasis />
          <LineRow label="Gross salary (monthly)" value={result.grossSalaryMonthly} />
          <LineRow label="Total deductions (monthly)" value={result.totalDeductionsMonthly} deduction />

          <button onClick={() => setShowDetails(!showDetails)}
            className="no-print mt-4 text-sm font-medium text-brand hover:underline">
            {showDetails ? "Hide" : "Show"} more details
          </button>

          {showDetails && (
            <div className="mt-3 space-y-2 border-t border-rule pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">Deductions as % of gross</span>
                <span className="tabular text-ink">{deductionPercent}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">Annual gross salary</span>
                <span className="tabular text-ink">{formatINR(result.grossSalaryMonthly * 12)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">Annual in-hand (actual)</span>
                <span className="tabular text-ink">{formatINR(result.actualInHandMonthly * 12)}</span>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs text-ink-soft">
            This is an estimate assuming Basic salary is 40% of CTC (a common industry average — your
            employer&apos;s actual structure may differ, especially after the new Code on Wages rollout
            in 2025–2026). Use this as a starting point when negotiating your offer.
          </p>
        </div>
      </div>

      <CalculatorActions
        shareTitle="In-hand to CTC"
        shareText={`To take home ${formatINR(targetInHandMonthly)}/month, I need a CTC of approximately ${formatINR(result.estimatedAnnualCtc)}/year.`}
      />
    </div>
  );
}

function LineRow({ label, value, emphasis = false, deduction = false }: { label: string; value: number; emphasis?: boolean; deduction?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${emphasis ? "font-semibold" : ""}`}>
      <span className={`text-sm ${emphasis ? "text-ink" : "text-ink-soft"}`}>{label}</span>
      <span className={`tabular text-sm ${deduction ? "text-deduction" : emphasis ? "text-brand" : "text-ink"}`}>{formatINR(value)}</span>
    </div>
  );
}
