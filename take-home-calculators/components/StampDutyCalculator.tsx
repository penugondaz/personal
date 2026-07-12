"use client";
import { useState, useMemo } from "react";
import { calculateStampDuty, STAMP_DUTY_STATES } from "@/lib/calculators/real-estate";
import { formatINR, formatINRCompact } from "@/lib/format";

export default function StampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState(5_000_000);
  const [state, setState] = useState("MH");
  const [ownerType, setOwnerType] = useState<"male" | "female" | "joint">("male");

  const result = useMemo(() => calculateStampDuty({
    propertyValue, state, ownerType,
  }), [propertyValue, state, ownerType]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Property Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Property Value</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-ink-soft text-sm">₹</span>
              <input type="number" value={propertyValue} step={100000}
                onChange={e => setPropertyValue(Number(e.target.value))}
                className="w-full rounded-lg border border-rule bg-paper pl-7 pr-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">State</label>
            <select value={state} onChange={e => setState(e.target.value)}
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none">
              {STAMP_DUTY_STATES.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Owner Type</label>
            <div className="flex gap-2">
              {(["male", "female", "joint"] as const).map(type => (
                <button key={type} onClick={() => setOwnerType(type)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                    ownerType === type ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand hover:text-brand"
                  }`}>
                  {type}
                </button>
              ))}
            </div>
            {ownerType === "female" && (
              <p className="text-xs text-brand mt-1">✓ Female owner discount applied</p>
            )}
          </div>
        </div>
      </div>

      {/* Stamp duty rate badge */}
      <div className="rounded-xl border border-brand/20 bg-brand-soft p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand mb-1">
          Stamp Duty Rate in {result.stateName}
        </p>
        <p className="font-display text-4xl font-bold text-brand">{result.stampDutyPercent}%</p>
        <p className="text-sm text-ink-soft mt-1">of property value for {ownerType} owner</p>
      </div>

      {/* Cost breakdown */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-3">Total Registration Cost</h3>
        <div className="space-y-2">
          {[
            { label: "Property value", value: formatINR(propertyValue) },
            { label: `Stamp duty (${result.stampDutyPercent}%)`, value: formatINR(result.stampDutyAmount), highlight: true },
            { label: "Registration charges", value: formatINR(result.registrationCharges), highlight: true },
            { label: "Misc charges (legal, franking)", value: formatINR(result.otherCharges), highlight: true },
          ].map(row => (
            <div key={row.label} className={`flex justify-between text-sm border-b border-rule last:border-0 pb-2 ${row.highlight ? "text-deduction" : ""}`}>
              <span className={row.highlight ? "text-deduction" : "text-ink-soft"}>{row.label}</span>
              <span className="tabular font-medium">{row.value}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 font-semibold">
            <span className="text-ink">Total additional charges</span>
            <span className="tabular text-deduction">{formatINR(result.totalCharges)}</span>
          </div>
          <div className="flex justify-between pt-1 font-bold text-lg">
            <span className="text-ink">All-in cost</span>
            <span className="tabular text-brand">{formatINRCompact(result.totalCost)}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-ink-soft">
        Rates as of FY 2025-26. Stamp duty rates change post-budget — verify with your state&apos;s
        registration department before finalising. Some states offer additional concessions for
        first-time buyers, affordable housing, or women co-owners.
      </p>
    </div>
  );
}
