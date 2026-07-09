"use client";
import { useState, useMemo } from "react";
import { formatINR } from "@/lib/format";

const ELSS_LOCK_IN_YEARS = 3;
const SECTION_80C_LIMIT = 150_000;

function calcElss(monthlyInvestment: number, annualReturnRate: number, years: number, slabRate: number) {
  const monthlyRate = annualReturnRate / 12 / 100;
  const totalMonths = Math.round(years * 12);
  let balance = 0;
  let cumulativeInvested = 0;
  const yearlyBreakdown: { year: number; cumulativeInvested: number; closingBalance: number }[] = [];

  for (let month = 1; month <= totalMonths; month++) {
    balance += monthlyInvestment;
    balance *= 1 + monthlyRate;
    cumulativeInvested += monthlyInvestment;
    if (month % 12 === 0) {
      yearlyBreakdown.push({
        year: month / 12,
        cumulativeInvested: Math.round(cumulativeInvested),
        closingBalance: Math.round(balance),
      });
    }
  }

  const annualInvestment = monthlyInvestment * 12;
  const eligibleFor80C = Math.min(annualInvestment, SECTION_80C_LIMIT);
  const annualTaxSaved = Math.round(eligibleFor80C * (slabRate / 100));

  return {
    maturityAmount: Math.round(balance),
    totalInvestment: Math.round(cumulativeInvested),
    totalReturns: Math.round(balance) - Math.round(cumulativeInvested),
    eligibleFor80C,
    annualTaxSaved,
    yearlyBreakdown,
  };
}

export default function ElssCalculator() {
  const [monthlyInput, setMonthlyInput] = useState("12500");
  const [rateInput, setRateInput] = useState("12");
  const [years, setYears] = useState(10);
  const [slabRate, setSlabRate] = useState(30);

  const monthlyInvestment = Math.max(0, Number(monthlyInput.replace(/[^0-9]/g, "")) || 0);
  const annualReturnRate = Math.max(0, Number(rateInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () => calcElss(monthlyInvestment, annualReturnRate, years, slabRate),
    [monthlyInvestment, annualReturnRate, years, slabRate]
  );

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Monthly SIP Amount (₹)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-ink-soft">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={monthlyInput}
                onChange={(e) => setMonthlyInput(e.target.value)}
                className="tabular w-full bg-transparent text-xl font-semibold text-ink outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Expected Annual Return (%)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <input
                type="text"
                inputMode="decimal"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                className="tabular w-full bg-transparent text-xl font-semibold text-ink outline-none"
              />
              <span className="text-ink-soft">%</span>
            </div>
          </label>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink">
              Investment period: <span className="tabular text-brand font-semibold">{years} years</span>
            </span>
            <span className="text-xs text-ink-soft">Min lock-in: {ELSS_LOCK_IN_YEARS} years</span>
          </div>
          <input
            type="range"
            min={ELSS_LOCK_IN_YEARS}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-2 w-full accent-brand"
          />
        </div>

        <div className="mt-4">
          <span className="mb-1.5 block text-xs text-ink-soft">Your income tax slab (for 80C savings estimate)</span>
          <div className="grid grid-cols-3 gap-2">
            {[5, 20, 30].map((s) => (
              <button
                key={s}
                onClick={() => setSlabRate(s)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  slabRate === s ? "border-brand bg-brand text-white" : "border-rule text-ink-soft hover:border-brand hover:text-brand"
                }`}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Maturity Value</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.maturityAmount)}
          </div>
          <p className="mt-1 text-sm text-white/70">after {years} years at {annualReturnRate}% expected return</p>
        </div>
        <div className="px-6 py-5 sm:px-8">
          {[
            { label: "Total invested", value: formatINR(result.totalInvestment) },
            { label: "Total returns (wealth gain)", value: formatINR(result.totalReturns) },
            { label: "80C eligible per year", value: formatINR(result.eligibleFor80C) },
            { label: "Tax saved per year (old regime)", value: formatINR(result.annualTaxSaved) },
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
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Invested</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Value</th>
            </tr>
          </thead>
          <tbody>
            {result.yearlyBreakdown.map((r) => (
              <tr key={r.year} className={`border-b border-rule last:border-0 ${r.year === years ? "bg-brand-soft font-semibold" : ""}`}>
                <td className="px-3 py-2 text-ink-soft">Year {r.year}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.cumulativeInvested)}</td>
                <td className="tabular px-3 py-2 text-right text-brand">{formatINR(r.closingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        ELSS is the only 80C option with just a {ELSS_LOCK_IN_YEARS}-year lock-in — shortest among tax-saving
        instruments. Returns are market-linked (equity), so unlike PPF/NSC they aren&apos;t guaranteed. Gains above
        ₹1.25L/year are taxed at 12.5% (LTCG) when withdrawn, only available under the old tax regime.
      </p>
    </>
  );
}
