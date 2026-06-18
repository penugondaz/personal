"use client";

import { useMemo, useState } from "react";
import { calculateXirr, type XirrCashFlow } from "@/lib/calculators/returns";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

interface Row { id: string; date: string; amount: string; }

export default function XirrCalculator() {
  const [rows, setRows] = useState<Row[]>([
    { id: "1", date: "2022-01-15", amount: "-50000" },
    { id: "2", date: "2023-06-10", amount: "-30000" },
    { id: "3", date: "2026-06-17", amount: "120000" },
  ]);

  const result = useMemo(() => {
    const cashFlows: XirrCashFlow[] = rows.filter((r) => r.date && r.amount).map((r) => ({ date: new Date(r.date), amount: Number(r.amount) || 0 }));
    return calculateXirr(cashFlows);
  }, [rows]);

  const totalInvested = rows.reduce((s, r) => { const a = Number(r.amount) || 0; return a < 0 ? s + Math.abs(a) : s; }, 0);
  const totalReturned = rows.reduce((s, r) => { const a = Number(r.amount) || 0; return a > 0 ? s + a : s; }, 0);

  function updateRow(id: string, field: "date" | "amount", value: string) { setRows((p) => p.map((r) => (r.id === id ? { ...r, [field]: value } : r))); }
  function addRow() { setRows((p) => [...p, { id: String(Date.now()), date: "", amount: "" }]); }
  function removeRow(id: string) { setRows((p) => (p.length > 2 ? p.filter((r) => r.id !== id) : p)); }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <p className="mb-3 text-xs text-ink-soft">Enter each investment (negative amount) and withdrawal or current value (positive amount) with its date.</p>
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="flex gap-2">
              <input type="date" value={row.date} onChange={(e) => updateRow(row.id, "date", e.target.value)} className="w-36 rounded-lg border border-rule bg-paper px-2 py-1.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
              <input type="text" inputMode="numeric" placeholder="-50000 or 120000" value={row.amount} onChange={(e) => updateRow(row.id, "amount", e.target.value)} className="tabular flex-1 rounded-lg border border-rule bg-paper px-2.5 py-1.5 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
              <button type="button" onClick={() => removeRow(row.id)} className="rounded-lg border border-rule px-2.5 text-sm text-ink-soft hover:border-deduction hover:text-deduction" aria-label="Remove">×</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addRow} className="mt-3 text-sm font-medium text-brand underline-offset-2 hover:underline">+ Add cash flow</button>
      </div>
      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">XIRR (Annualized Return)</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {result.xirrPercent !== null ? `${result.xirrPercent}%` : "Could not solve"}
          </div>
        </div>
        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Total invested" value={totalInvested} />
          <LineRow label="Total returned" value={totalReturned} />
          <LineRow label="Net gain" value={totalReturned - totalInvested} emphasis />
          {result.xirrPercent === null && <p className="mt-3 text-sm text-deduction">Ensure at least one negative (investment) and one positive (return) with valid dates.</p>}
        </div>
      </div>
      <CalculatorActions shareTitle="My XIRR result" shareText={`My XIRR works out to ${result.xirrPercent ?? "—"}%.`} />
    </div>
  );
}

function LineRow({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (<div className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${emphasis ? "font-semibold" : ""}`}><span className={`text-sm ${emphasis ? "text-ink" : "text-ink-soft"}`}>{label}</span><span className="tabular text-sm text-ink">{formatINR(value)}</span></div>);
}
