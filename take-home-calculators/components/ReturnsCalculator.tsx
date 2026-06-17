"use client";

import { useMemo, useState } from "react";
import { calculateCagr, calculateXirr, type XirrCashFlow } from "@/lib/calculators/returns";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

type Mode = "cagr" | "xirr";

interface CashFlowRow {
  id: string;
  date: string;
  amount: string;
}

export default function ReturnsCalculator() {
  const [mode, setMode] = useState<Mode>("cagr");

  // CAGR state
  const [initialInput, setInitialInput] = useState("100000");
  const [finalInput, setFinalInput] = useState("250000");
  const [years, setYears] = useState(5);

  // XIRR state
  const [rows, setRows] = useState<CashFlowRow[]>([
    { id: "1", date: "2022-01-15", amount: "-50000" },
    { id: "2", date: "2023-06-10", amount: "-30000" },
    { id: "3", date: "2026-06-17", amount: "120000" },
  ]);

  const initialValue = Math.max(0, Number(initialInput.replace(/[^0-9.]/g, "")) || 0);
  const finalValue = Math.max(0, Number(finalInput.replace(/[^0-9.]/g, "")) || 0);

  const cagrResult = useMemo(() => calculateCagr({ initialValue, finalValue, years }), [initialValue, finalValue, years]);

  const xirrResult = useMemo(() => {
    const cashFlows: XirrCashFlow[] = rows
      .filter((r) => r.date && r.amount)
      .map((r) => ({ date: new Date(r.date), amount: Number(r.amount) || 0 }));
    return calculateXirr(cashFlows);
  }, [rows]);

  function updateRow(id: string, field: "date" | "amount", value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { id: String(Date.now()), date: "", amount: "" }]);
  }

  function removeRow(id: string) {
    setRows((prev) => (prev.length > 2 ? prev.filter((r) => r.id !== id) : prev));
  }

  const shareText =
    mode === "cagr"
      ? `My investment grew at a CAGR of ${cagrResult.cagrPercent}% over ${years} years. Check yours:`
      : `My investment's XIRR works out to ${xirrResult.xirrPercent ?? "—"}%. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="no-print mb-4 flex gap-1.5 rounded-full bg-brand-soft p-1.5">
        <TabButton active={mode === "cagr"} onClick={() => setMode("cagr")}>
          CAGR (single in/out)
        </TabButton>
        <TabButton active={mode === "xirr"} onClick={() => setMode("xirr")}>
          XIRR (multiple cash flows)
        </TabButton>
      </div>

      {mode === "cagr" ? (
        <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs text-ink-soft">Initial investment</span>
              <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
                <span className="text-sm text-ink-soft">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={initialInput}
                  onChange={(e) => setInitialInput(e.target.value)}
                  className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-ink-soft">Final value</span>
              <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
                <span className="text-sm text-ink-soft">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={finalInput}
                  onChange={(e) => setFinalInput(e.target.value)}
                  className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none"
                />
              </div>
            </label>
          </div>
          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-medium text-ink">Holding period: {years} years</span>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-[var(--brand)]"
            />
          </label>
        </div>
      ) : (
        <div className="no-print mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
          <p className="mb-3 text-xs text-ink-soft">
            Add each investment (negative amount) and withdrawal/current value (positive amount)
            with its date.
          </p>
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.id} className="flex gap-2">
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => updateRow(row.id, "date", e.target.value)}
                  className="w-36 rounded-lg border border-rule bg-paper px-2 py-1.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="-50000 or 120000"
                  value={row.amount}
                  onChange={(e) => updateRow(row.id, "amount", e.target.value)}
                  className="tabular flex-1 rounded-lg border border-rule bg-paper px-2.5 py-1.5 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
                />
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  className="rounded-lg border border-rule px-2.5 text-sm text-ink-soft hover:border-deduction hover:text-deduction"
                  aria-label="Remove row"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addRow}
            className="mt-3 text-sm font-medium text-brand underline-offset-2 hover:underline"
          >
            + Add cash flow
          </button>
        </div>
      )}

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            {mode === "cagr" ? "CAGR" : "XIRR"}
          </p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {mode === "cagr"
              ? `${cagrResult.cagrPercent}%`
              : xirrResult.xirrPercent !== null
                ? `${xirrResult.xirrPercent}%`
                : "Couldn't solve"}
          </div>
          {mode === "cagr" && (
            <p className="tabular mt-1 text-sm text-white/70">
              Absolute return: {cagrResult.absoluteReturnPercent}%
            </p>
          )}
        </div>

        <div className="px-6 py-6 sm:px-8">
          {mode === "cagr" ? (
            <>
              <LineRow label="Initial investment" value={cagrResult.initialValue} />
              <LineRow label="Final value" value={cagrResult.finalValue} />
              <p className="mt-4 text-xs text-ink-soft">
                CAGR smooths out the growth into a single annual rate — useful for comparing
                investments with different holding periods, even though actual year-to-year
                returns were almost certainly uneven.
              </p>
            </>
          ) : xirrResult.xirrPercent === null ? (
            <p className="text-sm text-deduction">
              Couldn&apos;t solve for a rate with these cash flows — make sure you have at least
              one negative (investment) and one positive (return) amount with valid dates.
            </p>
          ) : (
            <p className="text-sm text-ink-soft">
              XIRR accounts for the exact dates of each cash flow, which is why it's more accurate
              than CAGR when you've invested at multiple points in time rather than a single
              lumpsum.
            </p>
          )}
        </div>
      </div>

      <CalculatorActions shareTitle="My investment returns" shareText={shareText} />
    </div>
  );
}

function LineRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-rule py-1.5">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="tabular text-sm text-ink">{formatINR(value)}</span>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition sm:text-sm ${
        active ? "bg-surface text-brand shadow-card" : "text-brand/70 hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}
