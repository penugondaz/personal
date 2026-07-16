"use client";
import { useState, useMemo } from "react";
import { calculateFuelReimbursement } from "@/lib/calculators/auto";
import { formatINR } from "@/lib/format";

function n(s: string) { return Number(s.replace(/[^0-9.]/g, "")) || 0; }

export default function FuelReimbursementCalculator() {
  const [fuel, setFuel]           = useState("5000");
  const [maintenance, setMaint]   = useState("2000");
  const [taxBracket, setTaxBracket] = useState("30");

  const result = useMemo(() => calculateFuelReimbursement({
    monthlyFuelAmount:        n(fuel),
    monthlyMaintenanceAmount: n(maintenance),
    regime: "new",
    taxBracketPct: n(taxBracket),
    isReimbursementWithBills: true,
  }), [fuel, maintenance, taxBracket]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-4">Monthly Reimbursement Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Monthly fuel reimbursement</label>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2.5 focus-within:border-brand">
              <span className="text-ink-soft text-sm">₹</span>
              <input type="text" inputMode="numeric" value={fuel}
                onChange={e => setFuel(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-ink outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Monthly maintenance reimbursement</label>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2.5 focus-within:border-brand">
              <span className="text-ink-soft text-sm">₹</span>
              <input type="text" inputMode="numeric" value={maintenance}
                onChange={e => setMaint(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-ink outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Tax bracket</label>
            <div className="flex gap-2 mt-1">
              {["5", "10", "15", "20", "30"].map(b => (
                <button key={b} onClick={() => setTaxBracket(b)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                    taxBracket === b ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand"
                  }`}>{b}%</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
        <p className="font-semibold text-orange-800 text-sm">⚠️ Fully Taxable Under New Regime</p>
        <p className="text-xs text-orange-700 mt-1">
          Under the new tax regime (default since FY 2023-24), fuel and maintenance reimbursements
          are fully taxable as salary income — even with bills submitted.
          The tax-free status only applied under the old regime (pre-2023).
        </p>
      </div>

      {/* Result */}
      <div className="rounded-2xl border border-rule bg-surface overflow-hidden">
        <div className="border-b border-rule bg-paper px-5 py-3">
          <p className="text-sm font-semibold text-ink">Annual Tax Impact</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {[
              { l: "Monthly reimbursement",   v: formatINR(result.grossMonthlyAmount) },
              { l: "Annual reimbursement",    v: formatINR(result.grossMonthlyAmount * 12) },
              { l: "Taxable amount",          v: formatINR(result.taxableAmount) },
              { l: "Tax paid (with cess)",    v: formatINR(result.taxPaid), red: true },
              { l: "Net annual benefit",      v: formatINR(result.inHandBenefit), bold: true },
            ].map(row => (
              <tr key={row.l} className="border-b border-rule last:border-0 hover:bg-paper">
                <td className="px-5 py-2.5 text-ink-soft">{row.l}</td>
                <td className={`tabular px-5 py-2.5 text-right font-medium ${
                  row.red ? "text-deduction" : row.bold ? "text-brand" : "text-ink"
                }`}>{row.v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Old vs new */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <p className="font-semibold text-ink mb-3">New Regime vs Old Regime</p>
        {[
          { l: "Tax under new regime",  v: formatINR(result.taxPaid),       color: "text-deduction" },
          { l: "Tax under old regime",  v: "₹0 (tax-free with bills)",      color: "text-brand" },
          { l: "Extra tax you pay",     v: formatINR(result.oldRegimeSaving), color: "text-deduction", bold: true },
        ].map(row => (
          <div key={row.l} className={`flex justify-between py-2 border-b border-rule last:border-0 ${row.bold ? "font-semibold" : ""}`}>
            <span className="text-sm text-ink-soft">{row.l}</span>
            <span className={`tabular text-sm ${row.color}`}>{row.v}</span>
          </div>
        ))}
        <p className="text-xs text-ink-soft mt-3">
          If fuel/maintenance reimbursement makes the old regime worth it for you depends on your total
          deductions. Use the Old vs New Regime calculator to compare.
        </p>
      </div>
    </div>
  );
}
