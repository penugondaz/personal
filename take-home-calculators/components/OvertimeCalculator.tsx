"use client";

import { useMemo, useState } from "react";
import { calculateOvertime, type OvertimeMultiplier } from "@/lib/calculators/overtime";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function OvertimeCalculator() {
  const [basicInput, setBasicInput] = useState("30000");
  const [daInput, setDaInput] = useState("0");
  const [workingDaysInput, setWorkingDaysInput] = useState("26");
  const [hoursPerDayInput, setHoursPerDayInput] = useState("8");
  const [overtimeHoursInput, setOvertimeHoursInput] = useState("10");
  const [multiplier, setMultiplier] = useState<OvertimeMultiplier>("2x");
  const [customMultiplierInput, setCustomMultiplierInput] = useState("1.5");

  const basicMonthly = Math.max(0, Number(basicInput.replace(/[^0-9.]/g, "")) || 0);
  const daMonthly = Math.max(0, Number(daInput.replace(/[^0-9.]/g, "")) || 0);
  const standardWorkingDaysPerMonth = Math.max(1, Number(workingDaysInput.replace(/[^0-9.]/g, "")) || 26);
  const standardHoursPerDay = Math.max(1, Number(hoursPerDayInput.replace(/[^0-9.]/g, "")) || 8);
  const overtimeHours = Math.max(0, Number(overtimeHoursInput.replace(/[^0-9.]/g, "")) || 0);
  const customMultiplier = Math.max(1, Number(customMultiplierInput.replace(/[^0-9.]/g, "")) || 1.5);

  const result = useMemo(
    () =>
      calculateOvertime({
        basicMonthly,
        daMonthly,
        standardWorkingDaysPerMonth,
        standardHoursPerDay,
        overtimeHours,
        multiplier,
        customMultiplier,
      }),
    [basicMonthly, daMonthly, standardWorkingDaysPerMonth, standardHoursPerDay, overtimeHours, multiplier, customMultiplier]
  );

  const shareText = `My overtime pay for ${overtimeHours} hours works out to ${formatINR(result.overtimePay)}. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid grid-cols-2 gap-3">
          <MoneyField label="Basic salary (monthly)" value={basicInput} onChange={setBasicInput} />
          <MoneyField label="DA (monthly)" value={daInput} onChange={setDaInput} />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Working days/month</span>
            <input
              type="text"
              inputMode="numeric"
              value={workingDaysInput}
              onChange={(e) => setWorkingDaysInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Hours/day</span>
            <input
              type="text"
              inputMode="numeric"
              value={hoursPerDayInput}
              onChange={(e) => setHoursPerDayInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Overtime hours</span>
            <input
              type="text"
              inputMode="numeric"
              value={overtimeHoursInput}
              onChange={(e) => setOvertimeHoursInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
        </div>

        <fieldset className="mt-4">
          <legend className="mb-1.5 text-xs text-ink-soft">Overtime rate multiplier</legend>
          <div className="flex flex-wrap items-center gap-2">
            <RadioPill label="1.5x" active={multiplier === "1.5x"} onClick={() => setMultiplier("1.5x")} />
            <RadioPill label="2x (Factories Act)" active={multiplier === "2x"} onClick={() => setMultiplier("2x")} />
            <RadioPill label="Custom" active={multiplier === "custom"} onClick={() => setMultiplier("custom")} />
            {multiplier === "custom" && (
              <input
                type="text"
                inputMode="decimal"
                value={customMultiplierInput}
                onChange={(e) => setCustomMultiplierInput(e.target.value)}
                className="tabular w-16 rounded-lg border border-rule bg-paper px-2 py-1 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
            )}
          </div>
        </fieldset>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Overtime Pay</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.overtimePay)}
          </div>
          <p className="tabular mt-1 text-sm text-white/70">
            for {overtimeHours} hours at {result.effectiveMultiplier}× rate
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Hourly rate (Basic + DA basis)" value={result.hourlyRate} />
          <LineRow label={`Overtime rate (${result.effectiveMultiplier}×)`} value={Math.round(result.hourlyRate * result.effectiveMultiplier)} />
          <LineRow label="Total overtime pay" value={result.overtimePay} emphasis />
        </div>
      </div>

      <CalculatorActions shareTitle="My overtime pay" shareText={shareText} />
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
