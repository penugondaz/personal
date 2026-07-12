"use client";
import { useState, useMemo } from "react";
import { calculateRentalYield } from "@/lib/calculators/real-estate";
import { formatINR } from "@/lib/format";

const VERDICT_CONFIG = {
  excellent: { label: "Excellent Yield", color: "text-brand", bg: "bg-brand-soft border-brand/20" },
  good:      { label: "Good Yield",      color: "text-green-700", bg: "bg-green-50 border-green-200" },
  average:   { label: "Average Yield",   color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  poor:      { label: "Poor Yield",      color: "text-deduction", bg: "bg-red-50 border-red-200" },
};

export default function RentalYieldCalculator() {
  const [propertyValue, setPropertyValue] = useState(5_000_000);
  const [monthlyRent, setMonthlyRent] = useState(15_000);
  const [maintenance, setMaintenance] = useState(12_000);
  const [propertyTax, setPropertyTax] = useState(5_000);
  const [vacancyMonths, setVacancyMonths] = useState(1);

  const result = useMemo(() => calculateRentalYield({
    propertyValue, monthlyRent, annualMaintenance: maintenance,
    annualPropertyTax: propertyTax, vacancyMonths,
  }), [propertyValue, monthlyRent, maintenance, propertyTax, vacancyMonths]);

  const verdict = VERDICT_CONFIG[result.verdict];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Property Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Property Value", value: propertyValue, set: setPropertyValue },
            { label: "Monthly Rent", value: monthlyRent, set: setMonthlyRent },
            { label: "Annual Maintenance (₹)", value: maintenance, set: setMaintenance },
            { label: "Annual Property Tax (₹)", value: propertyTax, set: setPropertyTax },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-sm font-medium text-ink mb-1">{field.label}</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-ink-soft text-sm">₹</span>
                <input type="number" value={field.value}
                  onChange={e => field.set(Number(e.target.value))}
                  className="w-full rounded-lg border border-rule bg-paper pl-7 pr-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
              </div>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Vacancy: {vacancyMonths} month(s)/year</label>
            <input type="range" min={0} max={6} value={vacancyMonths}
              onChange={e => setVacancyMonths(Number(e.target.value))}
              className="w-full accent-brand mt-2" />
          </div>
        </div>
      </div>

      <div className={`rounded-xl border p-5 ${verdict.bg}`}>
        <p className={`text-xs font-semibold uppercase tracking-wide ${verdict.color}`}>{verdict.label}</p>
        <div className="mt-2 flex items-baseline gap-4">
          <div>
            <p className={`tabular font-display text-4xl font-bold ${verdict.color}`}>{result.netYieldPercent}%</p>
            <p className="text-xs text-ink-soft mt-1">Net annual yield</p>
          </div>
          <div>
            <p className="tabular font-display text-2xl font-semibold text-ink">{result.grossYieldPercent}%</p>
            <p className="text-xs text-ink-soft mt-1">Gross yield</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-3">Annual Breakdown</h3>
        <div className="space-y-2">
          {[
            { label: "Annual gross rent", value: formatINR(result.annualGrossRent) },
            { label: "Less: maintenance", value: `− ${formatINR(maintenance)}` },
            { label: "Less: property tax", value: `− ${formatINR(propertyTax)}` },
            { label: "Net annual rental income", value: formatINR(result.annualNetRent), bold: true },
            { label: "Break-even period", value: `${Math.round(result.monthsToBreakEven / 12)} years ${result.monthsToBreakEven % 12} months` },
          ].map(row => (
            <div key={row.label} className={`flex justify-between text-sm border-b border-rule last:border-0 pb-2 ${row.bold ? "font-semibold" : ""}`}>
              <span className="text-ink-soft">{row.label}</span>
              <span className="tabular text-ink">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-rule bg-paper p-4 text-xs text-ink-soft">
        <strong className="text-ink">Benchmark:</strong> Residential properties in India typically yield 2-4% net.
        Anything above 4% is excellent. Commercial properties yield higher (5-9%) but carry more risk.
      </div>
    </div>
  );
}
