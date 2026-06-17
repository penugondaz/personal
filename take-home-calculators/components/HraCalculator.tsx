"use client";

import { useMemo, useState } from "react";
import { calculateHraExemption, type CityType } from "@/lib/calculators/hra";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function HraCalculator() {
  const [basicInput, setBasicInput] = useState("40000");
  const [daInput, setDaInput] = useState("0");
  const [hraInput, setHraInput] = useState("20000");
  const [rentInput, setRentInput] = useState("18000");
  const [cityType, setCityType] = useState<CityType>("metro");

  const basicMonthly = Math.max(0, Number(basicInput.replace(/[^0-9.]/g, "")) || 0);
  const daMonthly = Math.max(0, Number(daInput.replace(/[^0-9.]/g, "")) || 0);
  const hraReceivedMonthly = Math.max(0, Number(hraInput.replace(/[^0-9.]/g, "")) || 0);
  const rentPaidMonthly = Math.max(0, Number(rentInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () => calculateHraExemption({ basicMonthly, daMonthly, hraReceivedMonthly, rentPaidMonthly, cityType }),
    [basicMonthly, daMonthly, hraReceivedMonthly, rentPaidMonthly, cityType]
  );

  const shareText = `My HRA exemption works out to ${formatINR(result.hraExemptionAnnual)}/year. Check yours:`;

  const limbLabel: Record<typeof result.bindingLimb, string> = {
    actual_hra: "Actual HRA received",
    city_limit: `${Math.round(result.cityLimitPercent * 100)}% of Basic + DA (${cityType === "metro" ? "metro" : "non-metro"})`,
    rent_minus_10pct: "Rent paid − 10% of Basic + DA",
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid grid-cols-2 gap-3">
          <MoneyField label="Basic salary (monthly)" value={basicInput} onChange={setBasicInput} />
          <MoneyField label="DA (monthly, if any)" value={daInput} onChange={setDaInput} />
          <MoneyField label="HRA received (monthly)" value={hraInput} onChange={setHraInput} />
          <MoneyField label="Rent paid (monthly)" value={rentInput} onChange={setRentInput} />
        </div>

        <fieldset className="mt-4">
          <legend className="mb-1.5 text-xs text-ink-soft">City type</legend>
          <div className="flex gap-2">
            <RadioPill label="Metro (Delhi, Mumbai, Kolkata, Chennai)" active={cityType === "metro"} onClick={() => setCityType("metro")} />
            <RadioPill label="Non-metro" active={cityType === "non_metro"} onClick={() => setCityType("non_metro")} />
          </div>
        </fieldset>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">HRA Exemption</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="tabular font-display text-4xl font-semibold text-white sm:text-5xl">
              {formatINR(result.hraExemptionMonthly)}
            </span>
            <span className="text-base font-normal text-white/70">/month</span>
          </div>
          <p className="tabular mt-1 text-sm text-white/70">{formatINR(result.hraExemptionAnnual)}/year exempt from tax</p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">
            The Three Limbs of Section 10(13A) — Lowest Wins
          </h3>
          <LineRow label="Actual HRA received" value={result.actualHraReceived} winner={result.bindingLimb === "actual_hra"} />
          <LineRow
            label={`${Math.round(result.cityLimitPercent * 100)}% of Basic + DA`}
            value={result.cityLimitAmount}
            winner={result.bindingLimb === "city_limit"}
          />
          <LineRow
            label="Rent paid − 10% of Basic + DA"
            value={result.rentMinusTenPercentBasic}
            winner={result.bindingLimb === "rent_minus_10pct"}
          />

          <div className="mt-4 rounded-lg bg-brand-soft px-3 py-2.5 text-sm text-brand">
            Exemption is based on: <strong>{limbLabel[result.bindingLimb]}</strong> — the lowest of the three.
          </div>

          <h3 className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-deduction">
            Taxable Portion
          </h3>
          <LineRow label="HRA received − exemption" value={result.taxableHraMonthly} deduction />

          <p className="mt-4 text-xs text-ink-soft">
            HRA exemption is only available under the old tax regime. If you&apos;ve opted for the
            new regime, your full HRA is taxable regardless of rent paid.
          </p>
        </div>
      </div>

      <CalculatorActions shareTitle="My HRA exemption" shareText={shareText} />
    </div>
  );
}

function LineRow({
  label,
  value,
  winner = false,
  deduction = false,
}: {
  label: string;
  value: number;
  winner?: boolean;
  deduction?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-rule py-1.5">
      <span className={`text-sm ${winner ? "font-semibold text-brand" : "text-ink-soft"}`}>
        {label}
        {winner && " ✓"}
      </span>
      <span className={`tabular text-sm ${deduction ? "text-deduction" : winner ? "font-semibold text-brand" : "text-ink"}`}>
        {formatINR(value)}
      </span>
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
