"use client";

import { useMemo, useState } from "react";
import { calculateGratuity, GRATUITY_STATUTORY_CAP, type GratuityCoverage } from "@/lib/calculators/gratuity";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function GratuityCalculator() {
  const [basicInput, setBasicInput] = useState("40000");
  const [daInput, setDaInput] = useState("0");
  const [yearsInput, setYearsInput] = useState("7");
  const [coverage, setCoverage] = useState<GratuityCoverage>("covered");

  const lastDrawnBasicMonthly = Math.max(0, Number(basicInput.replace(/[^0-9.]/g, "")) || 0);
  const lastDrawnDaMonthly = Math.max(0, Number(daInput.replace(/[^0-9.]/g, "")) || 0);
  const yearsOfService = Math.max(0, Number(yearsInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () => calculateGratuity({ lastDrawnBasicMonthly, lastDrawnDaMonthly, yearsOfService, coverage }),
    [lastDrawnBasicMonthly, lastDrawnDaMonthly, yearsOfService, coverage]
  );

  const shareText = result.eligible
    ? `My estimated gratuity after ${yearsOfService} years works out to ${formatINR(result.gratuityAmount)}. Check yours:`
    : "Check your gratuity eligibility and amount:";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid grid-cols-2 gap-3">
          <MoneyField label="Last drawn basic (monthly)" value={basicInput} onChange={setBasicInput} />
          <MoneyField label="Last drawn DA (monthly)" value={daInput} onChange={setDaInput} />
        </div>

        <label className="mt-3 block">
          <span className="mb-1 block text-xs text-ink-soft">Years of service</span>
          <input
            type="text"
            inputMode="decimal"
            value={yearsInput}
            onChange={(e) => setYearsInput(e.target.value)}
            className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </label>

        <fieldset className="mt-4">
          <legend className="mb-1.5 text-xs text-ink-soft">Employer coverage under the Payment of Gratuity Act</legend>
          <div className="flex flex-wrap gap-2">
            <RadioPill label="Covered (most companies)" active={coverage === "covered"} onClick={() => setCoverage("covered")} />
            <RadioPill label="Not covered" active={coverage === "not_covered"} onClick={() => setCoverage("not_covered")} />
          </div>
        </fieldset>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Estimated Gratuity</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {result.eligible ? formatINR(result.gratuityAmount) : "Not yet eligible"}
          </div>
          {result.statutoryCapApplied && (
            <p className="tabular mt-1 text-sm text-white/70">
              Capped at the statutory limit of {formatINR(GRATUITY_STATUTORY_CAP)}
            </p>
          )}
        </div>

        <div className="px-6 py-6 sm:px-8">
          {!result.eligible ? (
            <p className="text-sm text-deduction">{result.ineligibilityReason}</p>
          ) : (
            <>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">Calculation</h3>
              <LineRow label="Basic + DA (last drawn, monthly)" value={result.salaryComponentMonthly} />
              <div className="flex items-baseline justify-between border-b border-dashed border-rule py-1.5">
                <span className="text-sm text-ink-soft">Years counted</span>
                <span className="tabular text-sm text-ink">{result.effectiveYears}</span>
              </div>
              {result.statutoryCapApplied && (
                <LineRow label="Before statutory cap" value={result.gratuityBeforeCap} />
              )}
              <div className="mt-4 rounded-lg bg-brand-soft px-3 py-2.5 text-sm text-brand">
                Formula: {result.formulaLabel}
              </div>
            </>
          )}
        </div>
      </div>

      <CalculatorActions shareTitle="My gratuity estimate" shareText={shareText} />
    </div>
  );
}

function LineRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-rule py-1.5">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="tabular text-sm text-ink">{formatINR(value)}</span>
    </div>
  );
}

function MoneyField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-soft">{label}</span>
      <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <span className="text-sm text-ink-soft">₹</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none"
        />
      </div>
    </label>
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
