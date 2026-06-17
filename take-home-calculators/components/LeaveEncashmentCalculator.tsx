"use client";

import { useMemo, useState } from "react";
import { calculateLeaveEncashment, type LeaveEncashmentContext } from "@/lib/calculators/leave-encashment";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function LeaveEncashmentCalculator() {
  const [basicInput, setBasicInput] = useState("40000");
  const [daInput, setDaInput] = useState("0");
  const [leaveDaysInput, setLeaveDaysInput] = useState("30");
  const [context, setContext] = useState<LeaveEncashmentContext>("on_retirement_private");
  const [yearsInput, setYearsInput] = useState("10");

  const lastDrawnBasicMonthly = Math.max(0, Number(basicInput.replace(/[^0-9.]/g, "")) || 0);
  const lastDrawnDaMonthly = Math.max(0, Number(daInput.replace(/[^0-9.]/g, "")) || 0);
  const leaveDaysEncashed = Math.max(0, Number(leaveDaysInput.replace(/[^0-9.]/g, "")) || 0);
  const yearsOfService = Math.max(0, Number(yearsInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () =>
      calculateLeaveEncashment({
        lastDrawnBasicMonthly,
        lastDrawnDaMonthly,
        leaveDaysEncashed,
        context,
        yearsOfService,
      }),
    [lastDrawnBasicMonthly, lastDrawnDaMonthly, leaveDaysEncashed, context, yearsOfService]
  );

  const shareText = `My leave encashment works out to ${formatINR(result.grossEncashmentAmount)}, of which ${formatINR(result.taxableAmount)} is taxable. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid grid-cols-2 gap-3">
          <MoneyField label="Last drawn basic (monthly)" value={basicInput} onChange={setBasicInput} />
          <MoneyField label="Last drawn DA (monthly)" value={daInput} onChange={setDaInput} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Leave days encashed</span>
            <input
              type="text"
              inputMode="numeric"
              value={leaveDaysInput}
              onChange={(e) => setLeaveDaysInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Years of service</span>
            <input
              type="text"
              inputMode="numeric"
              value={yearsInput}
              onChange={(e) => setYearsInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
        </div>

        <fieldset className="mt-4">
          <legend className="mb-1.5 text-xs text-ink-soft">Context</legend>
          <div className="flex flex-wrap gap-2">
            <RadioPill
              label="On retirement (private sector)"
              active={context === "on_retirement_private"}
              onClick={() => setContext("on_retirement_private")}
            />
            <RadioPill
              label="On retirement (government)"
              active={context === "on_retirement_govt"}
              onClick={() => setContext("on_retirement_govt")}
            />
            <RadioPill
              label="During service (resignation/job change)"
              active={context === "during_service"}
              onClick={() => setContext("during_service")}
            />
          </div>
        </fieldset>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Leave Encashment</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.grossEncashmentAmount)}
          </div>
          <p className="tabular mt-1 text-sm text-white/70">
            {formatINR(result.taxableAmount)} taxable · {formatINR(result.exemptAmount)} exempt
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Per-day salary" value={result.perDaySalary} />
          <LineRow label="Gross encashment" value={result.grossEncashmentAmount} />
          <LineRow label="Exempt amount" value={result.exemptAmount} />
          <LineRow label="Taxable amount" value={result.taxableAmount} deduction emphasis />

          <div className="mt-4 rounded-lg bg-brand-soft px-3 py-2.5 text-sm text-brand">
            {result.exemptionNote}
          </div>
        </div>
      </div>

      <CalculatorActions shareTitle="My leave encashment" shareText={shareText} />
    </div>
  );
}

function LineRow({ label, value, emphasis = false, deduction = false }: { label: string; value: number; emphasis?: boolean; deduction?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${emphasis ? "font-semibold" : ""}`}>
      <span className={`text-sm ${emphasis ? "text-ink" : "text-ink-soft"}`}>{label}</span>
      <span className={`tabular text-sm ${deduction ? "text-deduction" : "text-ink"}`}>{formatINR(value)}</span>
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
