"use client";
import { useState, useMemo } from "react";
import { calculatePropertyAppreciation } from "@/lib/calculators/real-estate";
import { formatINR, formatINRCompact } from "@/lib/format";

const CITY_RATES = [
  { city: "Mumbai",    rate: 8 },
  { city: "Bengaluru", rate: 9 },
  { city: "Hyderabad", rate: 10 },
  { city: "Delhi NCR", rate: 7 },
  { city: "Pune",      rate: 8 },
  { city: "Chennai",   rate: 7 },
  { city: "Custom",    rate: 7 },
];

export default function PropertyAppreciationCalculator() {
  const [currentValue, setCurrentValue] = useState(5_000_000);
  const [years, setYears] = useState(10);
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [customRate, setCustomRate] = useState(7);

  const rate = selectedCity === "Custom"
    ? customRate
    : CITY_RATES.find(c => c.city === selectedCity)?.rate ?? 7;

  const result = useMemo(() => calculatePropertyAppreciation({
    currentValue, annualAppreciationRate: rate, years,
  }), [currentValue, rate, years]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Property Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Current Property Value</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-ink-soft text-sm">₹</span>
              <input type="number" value={currentValue} step={100000}
                onChange={e => setCurrentValue(Number(e.target.value))}
                className="w-full rounded-lg border border-rule bg-paper pl-7 pr-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">City / Appreciation Rate</label>
            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none">
              {CITY_RATES.map(c => (
                <option key={c.city} value={c.city}>{c.city}{c.city !== "Custom" ? ` (~${c.rate}% p.a.)` : ""}</option>
              ))}
            </select>
          </div>
          {selectedCity === "Custom" && (
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Custom Rate: {customRate}% p.a.</label>
              <input type="range" min={1} max={20} value={customRate}
                onChange={e => setCustomRate(Number(e.target.value))}
                className="w-full accent-brand mt-2" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Years: {years}</label>
            <input type="range" min={1} max={30} value={years}
              onChange={e => setYears(Number(e.target.value))}
              className="w-full accent-brand mt-2" />
            <div className="flex justify-between text-xs text-ink-soft mt-1"><span>1 yr</span><span>30 yrs</span></div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Future Value", value: formatINRCompact(result.futureValue), color: "text-brand" },
          { label: "Total Appreciation", value: formatINRCompact(result.totalAppreciation), color: "text-brand" },
          { label: "Appreciation %", value: `${result.appreciationPercent}%`, color: "text-ink" },
        ].map(card => (
          <div key={card.label} className="rounded-xl border border-rule bg-surface p-4 text-center shadow-card">
            <p className="text-xs text-ink-soft">{card.label}</p>
            <p className={`tabular mt-1 font-display text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-4">Year-wise Growth</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {result.yearlyBreakdown.filter((_, i) => i % Math.max(1, Math.floor(years / 10)) === 0 || i === years - 1).map(row => {
            const pct = Math.round((row.value / result.futureValue) * 100);
            return (
              <div key={row.year}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-soft">Year {row.year}</span>
                  <span className="tabular font-medium text-ink">{formatINRCompact(row.value)}</span>
                </div>
                <div className="h-3 w-full rounded-full bg-paper overflow-hidden border border-rule">
                  <div className="h-3 rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
