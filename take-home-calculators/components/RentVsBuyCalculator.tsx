"use client";
import { useState, useMemo } from "react";
import { calculateRentVsBuy } from "@/lib/calculators/real-estate";
import { formatINR, formatINRCompact } from "@/lib/format";

export default function RentVsBuyCalculator() {
  const [propertyValue, setPropertyValue] = useState(8_000_000);
  const [monthlyRent, setMonthlyRent] = useState(25_000);
  const [homeLoanRate, setHomeLoanRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [appreciationRate, setAppreciationRate] = useState(7);
  const [investmentRate, setInvestmentRate] = useState(12);

  const result = useMemo(() => calculateRentVsBuy({
    propertyValue, monthlyRent, homeLoanRate, years,
    downPaymentPercent: downPaymentPct,
    propertyAppreciationRate: appreciationRate,
    investmentReturnRate: investmentRate,
  }), [propertyValue, monthlyRent, homeLoanRate, years, downPaymentPct, appreciationRate, investmentRate]);

  const winner = result.recommendation;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Your Scenario</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Property Value</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-ink-soft text-sm">₹</span>
              <input type="number" value={propertyValue} step={500000}
                onChange={e => setPropertyValue(Number(e.target.value))}
                className="w-full rounded-lg border border-rule bg-paper pl-7 pr-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Equivalent Monthly Rent</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-ink-soft text-sm">₹</span>
              <input type="number" value={monthlyRent} step={1000}
                onChange={e => setMonthlyRent(Number(e.target.value))}
                className="w-full rounded-lg border border-rule bg-paper pl-7 pr-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Home Loan Rate: {homeLoanRate}%</label>
            <input type="range" min={6} max={12} step={0.1} value={homeLoanRate}
              onChange={e => setHomeLoanRate(Number(e.target.value))}
              className="w-full accent-brand mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Down Payment: {downPaymentPct}%</label>
            <input type="range" min={10} max={50} step={5} value={downPaymentPct}
              onChange={e => setDownPaymentPct(Number(e.target.value))}
              className="w-full accent-brand mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Property appreciation: {appreciationRate}% p.a.</label>
            <input type="range" min={3} max={15} step={0.5} value={appreciationRate}
              onChange={e => setAppreciationRate(Number(e.target.value))}
              className="w-full accent-brand mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Investment return (if renting): {investmentRate}% p.a.</label>
            <input type="range" min={6} max={18} step={0.5} value={investmentRate}
              onChange={e => setInvestmentRate(Number(e.target.value))}
              className="w-full accent-brand mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Comparison period: {years} years</label>
            <input type="range" min={5} max={30} step={1} value={years}
              onChange={e => setYears(Number(e.target.value))}
              className="w-full accent-brand mt-2" />
          </div>
        </div>
      </div>

      {/* Winner banner */}
      <div className={`rounded-xl border p-5 ${winner === "buy" ? "border-brand/20 bg-brand-soft" : "border-orange-200 bg-orange-50"}`}>
        <p className={`font-semibold text-lg ${winner === "buy" ? "text-brand" : "text-orange-700"}`}>
          {winner === "buy" ? "🏠 Buying is better" : "🏡 Renting is better"} over {years} years
        </p>
        <p className="text-sm text-ink-soft mt-1">
          Net worth difference: <strong className="text-ink">{formatINR(result.netWorthDifference)}</strong> in favour of {winner === "buy" ? "buying" : "renting"}.
          {result.breakEvenYear && ` Property becomes better than renting after year ${result.breakEvenYear}.`}
        </p>
      </div>

      {/* Side by side */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`rounded-xl border p-5 space-y-2 ${winner === "buy" ? "border-brand/20 bg-brand-soft" : "border-rule bg-surface"}`}>
          <p className="font-semibold text-ink">🏠 If You Buy</p>
          {[
            { label: "Down payment", value: formatINR(result.buyingCost.downPayment) },
            { label: "Total EMI paid", value: formatINR(result.buyingCost.totalEmiPaid) },
            { label: "Maintenance + tax", value: formatINR(result.buyingCost.totalMaintenance + result.buyingCost.totalPropertyTax) },
            { label: "Property value at end", value: formatINRCompact(result.buyingCost.propertyValueAtEnd) },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm border-b border-rule last:border-0 pb-1">
              <span className="text-ink-soft">{row.label}</span>
              <span className="tabular font-medium text-ink">{row.value}</span>
            </div>
          ))}
        </div>

        <div className={`rounded-xl border p-5 space-y-2 ${winner === "rent" ? "border-orange-200 bg-orange-50" : "border-rule bg-surface"}`}>
          <p className="font-semibold text-ink">🏡 If You Rent</p>
          {[
            { label: "Total rent paid", value: formatINR(result.rentingCost.totalRentPaid) },
            { label: "Investment corpus", value: formatINRCompact(result.rentingCost.investmentCorpus) },
            { label: "Net worth at end", value: formatINRCompact(result.rentingCost.investmentCorpus - result.rentingCost.totalRentPaid) },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm border-b border-rule last:border-0 pb-1">
              <span className="text-ink-soft">{row.label}</span>
              <span className="tabular font-medium text-ink">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-soft">
        This is a simplified model. Actual outcomes depend on property location, market conditions,
        tax benefits (Section 24 home loan interest deduction under old regime), and personal circumstances.
      </p>
    </div>
  );
}
