"use client";
import { useState, useMemo } from "react";
import { calculateCarLeaseVsBuy } from "@/lib/calculators/auto";
import { formatINR, formatINRCompact } from "@/lib/format";

function n(s: string) { return Number(s.replace(/[^0-9.]/g, "")) || 0; }

export default function CarLeaseVsBuyCalculator() {
  const [carPrice, setCarPrice]       = useState("1500000");
  const [monthlyLease, setLease]      = useState("18000");
  const [tenure, setTenure]           = useState("3");
  const [residual, setResidual]       = useState("15");
  const [taxBracket, setTaxBracket]   = useState("30");
  const [downPct, setDownPct]         = useState("20");
  const [loanRate, setLoanRate]       = useState("9");
  const [depreciation, setDepreciation] = useState("15");

  const result = useMemo(() => calculateCarLeaseVsBuy({
    carPrice: n(carPrice), monthlyLease: n(monthlyLease),
    leaseTenureYears: n(tenure), residualValuePct: n(residual),
    taxBracketPct: n(taxBracket), downPaymentPct: n(downPct),
    loanInterestRate: n(loanRate), annualDepreciation: n(depreciation),
  }), [carPrice, monthlyLease, tenure, residual, taxBracket, downPct, loanRate, depreciation]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-4">Car & Lease Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Car Price (on-road)", val: carPrice, set: setCarPrice },
            { label: "Monthly Lease Amount", val: monthlyLease, set: setLease },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-ink mb-1">{f.label}</label>
              <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2.5 focus-within:border-brand">
                <span className="text-ink-soft text-sm">₹</span>
                <input type="text" inputMode="numeric" value={f.val}
                  onChange={e => f.set(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-ink outline-none" />
              </div>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Lease tenure: {tenure} years</label>
            <input type="range" min={2} max={5} value={tenure}
              onChange={e => setTenure(e.target.value)} className="w-full accent-brand mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Residual value: {residual}% of car price</label>
            <input type="range" min={5} max={40} value={residual}
              onChange={e => setResidual(e.target.value)} className="w-full accent-brand mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Tax bracket</label>
            <div className="flex gap-2 mt-1">
              {["20", "30"].map(b => (
                <button key={b} onClick={() => setTaxBracket(b)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                    taxBracket === b ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand"
                  }`}>{b}%</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Down payment: {downPct}%</label>
            <input type="range" min={10} max={50} step={5} value={downPct}
              onChange={e => setDownPct(e.target.value)} className="w-full accent-brand mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Car loan rate: {loanRate}%</label>
            <input type="range" min={7} max={14} step={0.5} value={loanRate}
              onChange={e => setLoanRate(e.target.value)} className="w-full accent-brand mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Annual depreciation: {depreciation}%</label>
            <input type="range" min={10} max={25} value={depreciation}
              onChange={e => setDepreciation(e.target.value)} className="w-full accent-brand mt-2" />
          </div>
        </div>
      </div>

      {/* Winner */}
      <div className={`rounded-2xl border p-5 ${
        result.betterOption === "lease"
          ? "border-brand/20 bg-brand-soft"
          : "border-orange-200 bg-orange-50"
      }`}>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">Recommendation</p>
        <p className="font-display text-2xl font-bold text-ink mt-1">
          {result.betterOption === "lease" ? "🔑 Car Lease is better" : "🏠 Buying is better"}
        </p>
        <p className="text-sm text-ink-soft mt-1">
          Saves you <strong className="text-ink">{formatINRCompact(result.saving)}</strong> over {tenure} years.
          Monthly tax saving on lease: <strong className="text-brand">{formatINR(result.monthlyLeaseTaxSaving)}</strong>
        </p>
      </div>

      {/* Side by side */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`rounded-xl border p-5 ${result.betterOption === "lease" ? "border-brand/20 bg-brand-soft" : "border-rule bg-surface"}`}>
          <p className="font-semibold text-ink mb-3">🔑 Car Lease</p>
          {[
            { l: "Total lease paid",      v: formatINR(result.totalLeasePaid) },
            { l: "Tax saving (pre-tax)", v: `− ${formatINR(result.taxSavingOnLease)}` },
            { l: "Effective lease cost",  v: formatINR(result.effectiveLeaseCost) },
            { l: "Residual buyout",       v: `+ ${formatINR(result.residualValue)}` },
            { l: "Net cost to own",       v: formatINRCompact(result.netLeaseCost), bold: true },
          ].map(row => (
            <div key={row.l} className={`flex justify-between text-sm py-1.5 border-b border-rule last:border-0 ${row.bold ? "font-semibold" : ""}`}>
              <span className="text-ink-soft">{row.l}</span>
              <span className="tabular text-ink">{row.v}</span>
            </div>
          ))}
        </div>
        <div className={`rounded-xl border p-5 ${result.betterOption === "buy" ? "border-orange-200 bg-orange-50" : "border-rule bg-surface"}`}>
          <p className="font-semibold text-ink mb-3">🏠 Buy (Loan)</p>
          {[
            { l: "Down payment",          v: formatINR(result.downPayment) },
            { l: "Total EMI paid",        v: formatINR(result.totalEmiPaid) },
            { l: "Interest paid",         v: formatINR(result.totalInterestPaid) },
            { l: "Car value at end",      v: `− ${formatINR(result.carValueAtEnd)}` },
            { l: "Net cost to own",       v: formatINRCompact(result.netBuyCost), bold: true },
          ].map(row => (
            <div key={row.l} className={`flex justify-between text-sm py-1.5 border-b border-rule last:border-0 ${row.bold ? "font-semibold" : ""}`}>
              <span className="text-ink-soft">{row.l}</span>
              <span className="tabular text-ink">{row.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
