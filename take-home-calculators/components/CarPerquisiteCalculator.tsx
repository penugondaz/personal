"use client";
import { useState, useMemo } from "react";
import { calculateCarPerquisite } from "@/lib/calculators/auto";
import { formatINR } from "@/lib/format";

export default function CarPerquisiteCalculator() {
  const [engine, setEngine]       = useState<"below_1600" | "above_1600">("below_1600");
  const [driver, setDriver]       = useState(false);
  const [taxBracket, setTaxBracket] = useState("30");
  const [personalUsePct, setPersonalUsePct] = useState("50");

  const result = useMemo(() => calculateCarPerquisite({
    engineSize: engine, driverProvided: driver,
    monthsInYear: 12,
    taxBracketPct: Number(taxBracket),
    personalUsePct: Number(personalUsePct),
  }), [engine, driver, taxBracket, personalUsePct]);

  const perqRate = engine === "below_1600"
    ? (driver ? 2400 : 1800)
    : (driver ? 3300 : 2400);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-4">Company Car Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Engine size</label>
            <div className="flex gap-2">
              {(["below_1600", "above_1600"] as const).map(e => (
                <button key={e} onClick={() => setEngine(e)}
                  className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
                    engine === e ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand"
                  }`}>
                  {e === "below_1600" ? "≤ 1600cc" : "> 1600cc"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Driver provided by company?</label>
            <div className="flex gap-2">
              {([false, true] as const).map(d => (
                <button key={String(d)} onClick={() => setDriver(d)}
                  className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
                    driver === d ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand"
                  }`}>
                  {d ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Your tax bracket</label>
            <div className="flex gap-2 mt-1">
              {["5", "10", "15", "20", "30"].map(b => (
                <button key={b} onClick={() => setTaxBracket(b)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                    taxBracket === b ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand"
                  }`}>{b}%</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Personal use: {personalUsePct}%</label>
            <input type="range" min={0} max={100} step={10} value={personalUsePct}
              onChange={e => setPersonalUsePct(e.target.value)}
              className="w-full accent-brand mt-3" />
            <p className="text-xs text-ink-soft mt-1">Portion of car use that's personal (not official)</p>
          </div>
        </div>
      </div>

      {/* Perquisite rate card */}
      <div className="rounded-2xl border border-brand/20 bg-brand-soft p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">Perquisite Value (Rule 3)</p>
        <p className="font-display text-4xl font-bold text-brand mt-1">
          {formatINR(perqRate)}<span className="text-lg font-normal text-ink-soft">/month</span>
        </p>
        <p className="text-sm text-ink-soft mt-1">
          This is what gets added to your income — not the actual car value or EMI.
        </p>
      </div>

      {/* Breakdown */}
      <div className="rounded-xl border border-rule bg-surface overflow-hidden">
        <div className="border-b border-rule bg-paper px-5 py-3">
          <p className="text-sm font-semibold text-ink">Tax Impact</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {[
              { l: "Monthly perquisite value",  v: formatINR(result.monthlyPerquisiteValue) },
              { l: "Annual perquisite value",   v: formatINR(result.annualPerquisiteValue) },
              { l: "Annual tax on perquisite",  v: formatINR(result.annualTaxOnPerquisite) },
              { l: "Monthly tax on perquisite", v: formatINR(result.monthlyTaxOnPerquisite) },
            ].map(row => (
              <tr key={row.l} className="border-b border-rule last:border-0 hover:bg-paper">
                <td className="px-5 py-2.5 text-ink-soft">{row.l}</td>
                <td className="tabular px-5 py-2.5 text-right font-medium text-ink">{row.v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparison vs cash */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <p className="font-semibold text-ink mb-3">Company Car vs Cash Allowance</p>
        <p className="text-sm text-ink-soft mb-3">
          If your company gave you {formatINR(result.vsFullCarAllowance.allowanceAmount)} cash
          ({personalUsePct}% personal use portion) instead of the car:
        </p>
        {[
          { l: "Tax on cash allowance",   v: formatINR(result.vsFullCarAllowance.taxOnAllowance), color: "text-deduction" },
          { l: "Tax on company car",      v: formatINR(result.annualTaxOnPerquisite),             color: "text-brand" },
          { l: "Annual tax saving",       v: formatINR(result.vsFullCarAllowance.saving),         color: "text-brand", bold: true },
        ].map(row => (
          <div key={row.l} className={`flex justify-between py-2 border-b border-rule last:border-0 ${row.bold ? "font-semibold" : ""}`}>
            <span className="text-sm text-ink-soft">{row.l}</span>
            <span className={`tabular text-sm ${row.color}`}>{row.v}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-ink-soft">
        Perquisite values are fixed by Rule 3 of Income Tax Rules — ₹1,800/month for ≤1600cc (₹2,400 with driver),
        ₹2,400/month for {">"}1600cc (₹3,300 with driver). These are added to your gross salary for TDS computation.
        FY 2025-26 rates.
      </p>
    </div>
  );
}
