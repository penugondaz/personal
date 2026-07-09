"use client";
import { useState, useMemo } from "react";
import { formatINR } from "@/lib/format";

function calcRealReturns(principal: number, nominalRate: number, inflationRate: number, years: number) {
  const nominalMaturity = principal * Math.pow(1 + nominalRate / 100, years);
  // Fisher equation: real rate = (1+nominal)/(1+inflation) - 1
  const realRate = (1 + nominalRate / 100) / (1 + inflationRate / 100) - 1;
  const realMaturityInTodaysRupees = principal * Math.pow(1 + realRate, years);
  const purchasingPowerLoss = nominalMaturity - realMaturityInTodaysRupees;

  const yearlyBreakdown: { year: number; nominalValue: number; realValue: number }[] = [];
  for (let y = 1; y <= years; y++) {
    yearlyBreakdown.push({
      year: y,
      nominalValue: Math.round(principal * Math.pow(1 + nominalRate / 100, y)),
      realValue: Math.round(principal * Math.pow(1 + realRate, y)),
    });
  }

  return {
    nominalMaturity: Math.round(nominalMaturity),
    realMaturityInTodaysRupees: Math.round(realMaturityInTodaysRupees),
    realRate: realRate * 100,
    purchasingPowerLoss: Math.round(purchasingPowerLoss),
    yearlyBreakdown,
  };
}

export default function RealReturnsCalculator() {
  const [principalInput, setPrincipalInput] = useState("1000000");
  const [nominalRateInput, setNominalRateInput] = useState("12");
  const [inflationInput, setInflationInput] = useState("6");
  const [years, setYears] = useState(15);

  const principal = Math.max(0, Number(principalInput.replace(/[^0-9]/g, "")) || 0);
  const nominalRate = Math.max(0, Number(nominalRateInput.replace(/[^0-9.]/g, "")) || 0);
  const inflationRate = Math.max(0, Number(inflationInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () => calcRealReturns(principal, nominalRate, inflationRate, years),
    [principal, nominalRate, inflationRate, years]
  );

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Investment Amount (₹)</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-ink-soft">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={principalInput}
              onChange={(e) => setPrincipalInput(e.target.value)}
              className="tabular w-full bg-transparent text-xl font-semibold text-ink outline-none"
            />
          </div>
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Expected Annual Return (%)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <input
                type="text"
                inputMode="decimal"
                value={nominalRateInput}
                onChange={(e) => setNominalRateInput(e.target.value)}
                className="tabular w-full bg-transparent text-lg font-semibold text-ink outline-none"
              />
              <span className="text-ink-soft">%</span>
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Expected Inflation (%)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <input
                type="text"
                inputMode="decimal"
                value={inflationInput}
                onChange={(e) => setInflationInput(e.target.value)}
                className="tabular w-full bg-transparent text-lg font-semibold text-ink outline-none"
              />
              <span className="text-ink-soft">%</span>
            </div>
          </label>
        </div>

        <div className="mt-4">
          <span className="text-sm font-medium text-ink">
            Time period: <span className="tabular text-brand font-semibold">{years} years</span>
          </span>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-2 w-full accent-brand"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            Value in Today&apos;s Purchasing Power
          </p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.realMaturityInTodaysRupees)}
          </div>
          <p className="mt-1 text-sm text-white/70">
            Your money grows to {formatINR(result.nominalMaturity)} nominally, but that&apos;s only worth this much
            in today&apos;s rupees after {years} years of {inflationRate}% inflation.
          </p>
        </div>
        <div className="px-6 py-5 sm:px-8">
          {[
            { label: "Nominal maturity value", value: formatINR(result.nominalMaturity) },
            { label: "Real (inflation-adjusted) value", value: formatINR(result.realMaturityInTodaysRupees) },
            { label: "Purchasing power \"lost\" to inflation", value: formatINR(result.purchasingPowerLoss) },
            { label: "Real rate of return", value: `${result.realRate.toFixed(2)}%` },
          ].map((item) => (
            <div key={item.label} className="flex justify-between border-b border-dashed border-rule py-1.5 text-sm">
              <span className="text-ink-soft">{item.label}</span>
              <span className="tabular font-medium text-ink">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-rule">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule bg-paper text-left">
              <th className="px-3 py-2 font-medium text-ink-soft">Year</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Nominal Value</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Real Value (Today&apos;s ₹)</th>
            </tr>
          </thead>
          <tbody>
            {result.yearlyBreakdown
              .filter((_, i) => (i + 1) % Math.max(1, Math.round(years / 10)) === 0 || i === result.yearlyBreakdown.length - 1)
              .map((r) => (
                <tr key={r.year} className={`border-b border-rule last:border-0 ${r.year === years ? "bg-brand-soft font-semibold" : ""}`}>
                  <td className="px-3 py-2 text-ink-soft">Year {r.year}</td>
                  <td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.nominalValue)}</td>
                  <td className="tabular px-3 py-2 text-right text-brand">{formatINR(r.realValue)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Uses the Fisher equation: real rate = (1 + nominal) ÷ (1 + inflation) − 1. This is why a "safe" 7% FD can
        actually lose you purchasing power if inflation runs at 6-7% — the real return is close to zero.
      </p>
    </>
  );
}
