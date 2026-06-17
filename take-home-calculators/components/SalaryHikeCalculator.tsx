"use client";

import { useMemo, useState } from "react";
import { calculateSalaryHike } from "@/lib/calculators/salary-hike";
import type { TaxRegime } from "@/lib/calculators/income-tax";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function SalaryHikeCalculator() {
  const [ctcInput, setCtcInput] = useState("1000000");
  const [hikeInput, setHikeInput] = useState("15");
  const [regime, setRegime] = useState<TaxRegime>("new");

  const currentAnnualCtc = Math.max(0, Number(ctcInput.replace(/[^0-9.]/g, "")) || 0);
  const hikePercent = Math.max(0, Number(hikeInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () => calculateSalaryHike({ currentAnnualCtc, hikePercent, regime }),
    [currentAnnualCtc, hikePercent, regime]
  );

  const shareText = `A ${hikePercent}% hike on my CTC only increases my in-hand pay by ${result.inHandIncreasePercent.toFixed(1)}%. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Current annual CTC</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={ctcInput}
              onChange={(e) => setCtcInput(e.target.value)}
              className="tabular w-full bg-transparent text-base font-medium text-ink outline-none"
            />
          </div>
        </label>

        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium text-ink">Hike percentage: {hikePercent}%</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={hikePercent}
            onChange={(e) => setHikeInput(e.target.value)}
            className="w-full accent-[var(--brand)]"
          />
        </label>

        <fieldset className="mt-4">
          <legend className="mb-1.5 text-xs text-ink-soft">Tax regime</legend>
          <div className="flex gap-2">
            <RadioPill label="New regime" active={regime === "new"} onClick={() => setRegime("new")} />
            <RadioPill label="Old regime" active={regime === "old"} onClick={() => setRegime("old")} />
          </div>
        </fieldset>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            Your In-Hand Pay Increases By
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="tabular font-display text-4xl font-semibold text-white sm:text-5xl">
              {result.inHandIncreasePercent.toFixed(1)}%
            </span>
            <span className="text-base font-normal text-white/70">
              (CTC hike: {hikePercent}%)
            </span>
          </div>
          <p className="tabular mt-1 text-sm text-white/70">
            +{formatINR(result.inHandIncreaseMonthly)}/month in-hand
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">Before</h3>
          <LineRow label="Current CTC" value={result.currentAnnualCtc} />
          <LineRow label="Current in-hand (monthly)" value={result.currentInHandMonthly} />

          <h3 className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-brand">After</h3>
          <LineRow label="New CTC" value={result.newAnnualCtc} />
          <LineRow label="New in-hand (monthly)" value={result.newInHandMonthly} emphasis />
          <LineRow label="Hike amount (annual CTC)" value={result.hikeAmountAnnual} />

          <p className="mt-4 text-xs text-ink-soft">
            Your in-hand pay grows slower than your CTC because income tax is progressive — a
            higher CTC pushes more of your income into higher tax slabs, eating into part of the
            raise.
          </p>
        </div>
      </div>

      <CalculatorActions shareTitle="My salary hike, in real terms" shareText={shareText} />
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

function RadioPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand hover:text-brand"
      }`}
    >
      {label}
    </button>
  );
}
