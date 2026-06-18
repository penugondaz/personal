"use client";

import { useMemo, useState } from "react";
import { calculateStockAverage, type StockPurchase } from "@/lib/calculators/stock-average";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function StockAverageCalculator() {
  const [rows, setRows] = useState<StockPurchase[]>([
    { id: "1", quantity: 10, pricePerShare: 500 },
    { id: "2", quantity: 15, pricePerShare: 420 },
    { id: "3", quantity: 0, pricePerShare: 0 },
  ]);

  const result = useMemo(() => calculateStockAverage(rows), [rows]);

  function updateRow(id: string, field: "quantity" | "pricePerShare", value: number) {
    setRows((p) => p.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }
  function addRow() { setRows((p) => [...p, { id: String(Date.now()), quantity: 0, pricePerShare: 0 }]); }
  function removeRow(id: string) { setRows((p) => (p.length > 2 ? p.filter((r) => r.id !== id) : p)); }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <p className="mb-3 text-xs text-ink-soft">Enter each purchase — the calculator finds your weighted average cost per share.</p>
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={row.id} className="flex items-center gap-2">
              <span className="w-6 text-xs text-ink-soft">{i + 1}.</span>
              <input type="number" inputMode="numeric" placeholder="Qty" value={row.quantity || ""} onChange={(e) => updateRow(row.id, "quantity", Number(e.target.value))} className="tabular w-20 rounded-lg border border-rule bg-paper px-2 py-1.5 text-sm text-ink outline-none focus:border-brand" />
              <span className="text-xs text-ink-soft">×</span>
              <div className="flex flex-1 items-center gap-1 rounded-lg border border-rule bg-paper px-2 py-1.5 focus-within:border-brand">
                <span className="text-sm text-ink-soft">₹</span>
                <input type="number" inputMode="decimal" placeholder="Price" value={row.pricePerShare || ""} onChange={(e) => updateRow(row.id, "pricePerShare", Number(e.target.value))} className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
              </div>
              <button type="button" onClick={() => removeRow(row.id)} className="rounded-lg border border-rule px-2 text-sm text-ink-soft hover:text-deduction" aria-label="Remove">×</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addRow} className="mt-3 text-sm font-medium text-brand underline-offset-2 hover:underline">+ Add purchase</button>
      </div>
      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Average Price Per Share</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">₹{result.averagePrice.toFixed(2)}</div>
        </div>
        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Total shares" value={result.totalShares} />
          <LineRow label="Total invested" value={result.totalInvested} emphasis />
        </div>
      </div>
      <CalculatorActions shareTitle="My stock average price" shareText={`My average cost is ₹${result.averagePrice.toFixed(2)}/share across ${result.totalShares} shares.`} />
    </div>
  );
}

function LineRow({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (<div className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${emphasis ? "font-semibold" : ""}`}><span className={`text-sm ${emphasis ? "text-ink" : "text-ink-soft"}`}>{label}</span><span className="tabular text-sm text-ink">{typeof value === "number" && value > 999 ? formatINR(value) : value}</span></div>);
}
