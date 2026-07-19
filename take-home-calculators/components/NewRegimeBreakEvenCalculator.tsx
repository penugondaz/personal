"use client";

import { useMemo, useState } from "react";
import { calculateNewRegimeBreakEven } from "@/lib/calculators/new-regime-breakeven";
import { formatINR, formatINRCompact } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function NewRegimeBreakEvenCalculator() {
  const [grossIncome, setGrossIncome] = useState("1500000");
  const [actualDeductions, setActualDeductions] = useState("225000");

  const parsed = {
    grossIncome: Math.max(0, Number(grossIncome.replace(/[^0-9]/g, "")) || 0),
    actualDeductions: Math.max(0, Number(actualDeductions.replace(/[^0-9]/g, "")) || 0),
  };

  const result = useMemo(
    () => calculateNewRegimeBreakEven({ grossIncome: parsed.grossIncome, actualOldRegimeDeductions: parsed.actualDeductions }),
    [parsed.grossIncome, parsed.actualDeductions]
  );

  const shareText =
    result.breakEvenDeduction !== null
      ? `At my income, old regime wins once deductions cross ${formatINR(result.breakEvenDeduction)}. Check yours:`
      : `At my income, new regime wins no matter how much I claim. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2">
          <MoneyField label="Gross annual income (before any deductions)" value={grossIncome} onChange={setGrossIncome} />
          <MoneyField label="Your actual/expected deductions (80C, HRA, home loan etc.)" value={actualDeductions} onChange={setActualDeductions} />
        </div>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Break-Even Deduction Amount</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="tabular font-display text-4xl font-semibold text-white sm:text-5xl">
              {result.breakEvenDeduction !== null ? formatINR(result.breakEvenDeduction) : "Never"}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/70">
            {result.breakEvenDeduction !== null
              ? "Old regime starts winning once your total deductions cross this amount."
              : "At this income, the new regime wins even with very high deductions."}
          </p>
        </div>

        <div className="px-6 py-5 sm:px-8">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">Based on Your Actual Deductions</h3>
          <LineRow label="New Regime tax (no deductions needed)" value={result.newRegimeTax} />
          <LineRow label={`Old Regime tax (at ${formatINR(parsed.actualDeductions)} deductions)`} value={result.oldRegimeTaxAtActualDeductions} />

          <div className="mt-4 rounded-lg bg-brand-soft px-3 py-2.5 text-sm text-brand">
            {result.actualBetterRegime === "old" ? "Old" : "New"} Regime wins for you — saves{" "}
            <strong>{formatINR(result.actualSavings)}</strong>
          </div>
        </div>
      </div>

      <CalculatorActions shareTitle="New regime break-even point" shareText={shareText} />

      {/* Chart */}
      <div className="mt-6 rounded-xl border border-rule bg-surface p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Old Regime Tax vs New Regime Tax, by Deduction Amount
        </p>
        <BreakEvenChart chart={result.chart} breakEven={result.breakEvenDeduction} />
        <div className="mt-2 flex gap-4 text-xs text-ink-soft">
          <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 rounded" style={{ background: "var(--accent)" }} />New Regime (flat)</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 rounded" style={{ background: "var(--brand)" }} />Old Regime (falls as deductions rise)</span>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-rule">
        <table className="w-full text-sm" style={{ minWidth: 480 }}>
          <thead>
            <tr className="border-b border-rule bg-paper text-left">
              <th className="px-3 py-2 font-medium text-ink-soft">Deductions Claimed</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Old Regime Tax</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">New Regime Tax</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Better Regime</th>
            </tr>
          </thead>
          <tbody>
            {result.chart.map((row) => (
              <tr key={row.deductions} className="border-b border-rule last:border-0">
                <td className="px-3 py-2 text-ink-soft">{formatINRCompact(row.deductions)}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINRCompact(row.oldRegimeTax)}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINRCompact(row.newRegimeTax)}</td>
                <td className={`px-3 py-2 text-right font-medium ${row.oldRegimeTax <= row.newRegimeTax ? "text-brand" : "text-ink-soft"}`}>
                  {row.oldRegimeTax <= row.newRegimeTax ? "Old" : "New"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BreakEvenChart({
  chart,
  breakEven,
}: {
  chart: { deductions: number; oldRegimeTax: number; newRegimeTax: number }[];
  breakEven: number | null;
}) {
  if (chart.length < 2) return null;
  const w = 640, h = 200, pad = { l: 10, r: 10, t: 10, b: 20 };
  const plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;
  const maxY = Math.max(...chart.map((d) => Math.max(d.oldRegimeTax, d.newRegimeTax)), 1);
  const xs = chart.map((_, i) => pad.l + (i / (chart.length - 1)) * plotW);
  const yp = (v: number) => pad.t + plotH - (v / maxY) * plotH;
  const path = (vals: number[]) => vals.map((v, i) => `${i === 0 ? "M" : "L"}${xs[i].toFixed(1)},${yp(v).toFixed(1)}`).join(" ");

  const breakEvenIndex =
    breakEven !== null ? chart.findIndex((d) => d.deductions >= breakEven) : -1;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" aria-hidden="true">
      <path d={path(chart.map((d) => d.newRegimeTax))} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
      <path d={path(chart.map((d) => d.oldRegimeTax))} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinejoin="round" />
      {breakEvenIndex >= 0 && (
        <>
          <line x1={xs[breakEvenIndex]} y1={pad.t} x2={xs[breakEvenIndex]} y2={h - pad.b} stroke="var(--ink-soft)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={xs[breakEvenIndex]} cy={yp(chart[breakEvenIndex].oldRegimeTax)} r="4" fill="var(--brand)" />
        </>
      )}
    </svg>
  );
}

function MoneyField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-soft">{label}</span>
      <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <span className="text-sm text-ink-soft">₹</span>
        <input type="text" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
      </div>
    </label>
  );
}

function LineRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-rule py-1.5">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="tabular shrink-0 text-sm text-ink">{formatINR(value)}</span>
    </div>
  );
}
