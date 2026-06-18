"use client";

import { useMemo, useState } from "react";
import { calculateGoalPlanning } from "@/lib/calculators/goal-planning";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function GoalPlanningCalculator() {
  const [targetInput, setTargetInput] = useState("5000000");
  const [yearsInput, setYearsInput] = useState(10);
  const [rateInput, setRateInput] = useState("12");
  const [existingInput, setExistingInput] = useState("0");

  const targetAmount = Math.max(0, Number(targetInput.replace(/[^0-9.]/g, "")) || 0);
  const expectedAnnualReturn = Math.max(0, Number(rateInput.replace(/[^0-9.]/g, "")) || 0);
  const existingInvestment = Math.max(0, Number(existingInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(() => calculateGoalPlanning({ targetAmount, years: yearsInput, expectedAnnualReturn, existingInvestment }), [targetAmount, yearsInput, expectedAnnualReturn, existingInvestment]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Target amount you need</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input type="text" inputMode="numeric" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="tabular w-full bg-transparent text-base font-medium text-ink outline-none" />
          </div>
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs text-ink-soft">Existing investments toward this goal (optional)</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-sm text-ink-soft">₹</span>
            <input type="text" inputMode="numeric" value={existingInput} onChange={(e) => setExistingInput(e.target.value)} className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
          </div>
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Expected return (%)</span>
            <input type="text" inputMode="decimal" value={rateInput} onChange={(e) => setRateInput(e.target.value)} className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Time to goal: {yearsInput} years</span>
            <input type="range" min={1} max={30} step={1} value={yearsInput} onChange={(e) => setYearsInput(Number(e.target.value))} className="mt-2 w-full accent-[var(--brand)]" />
          </label>
        </div>
      </div>
      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Required Monthly SIP</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">{formatINR(result.requiredMonthlySip)}</div>
          <p className="tabular mt-1 text-sm text-white/70">to reach {formatINR(targetAmount)} in {yearsInput} years</p>
        </div>
        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Target amount" value={result.targetAmount} />
          {existingInvestment > 0 && <LineRow label="Existing investment (future value)" value={result.existingInvestmentFutureValue} />}
          <LineRow label="Gap to fill" value={result.gapToFill} />
          <LineRow label="Required monthly SIP" value={result.requiredMonthlySip} emphasis />
          <LineRow label="Or required lumpsum today" value={result.requiredLumpsum} />
          <LineRow label="Total SIP investment over {yearsInput}y" value={result.totalSipInvestment} />
        </div>
      </div>
      <CalculatorActions shareTitle="My financial goal plan" shareText={`I need ${formatINR(result.requiredMonthlySip)}/month SIP to reach ${formatINR(targetAmount)} in ${yearsInput} years.`} />
    </div>
  );
}

function LineRow({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (<div className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${emphasis ? "font-semibold" : ""}`}><span className={`text-sm ${emphasis ? "text-ink" : "text-ink-soft"}`}>{label}</span><span className="tabular text-sm text-ink">{formatINR(value)}</span></div>);
}
