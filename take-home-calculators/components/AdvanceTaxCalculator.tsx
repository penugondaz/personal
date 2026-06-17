"use client";

import { useMemo, useState } from "react";
import { calculateAdvanceTax } from "@/lib/calculators/advance-tax";
import type { TaxRegime } from "@/lib/calculators/income-tax";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function AdvanceTaxCalculator() {
  const [incomeInput, setIncomeInput] = useState("1500000");
  const [tdsInput, setTdsInput] = useState("80000");
  const [regime, setRegime] = useState<TaxRegime>("new");

  const estimatedAnnualIncome = Math.max(0, Number(incomeInput.replace(/[^0-9.]/g, "")) || 0);
  const tdsAlreadyDeducted = Math.max(0, Number(tdsInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () => calculateAdvanceTax({ estimatedAnnualIncome, regime, tdsAlreadyDeducted }),
    [estimatedAnnualIncome, regime, tdsAlreadyDeducted]
  );

  const shareText = result.isLiable
    ? `My advance tax liability is ${formatINR(result.netAdvanceTaxPayable)} across 4 installments. Check yours:`
    : "Check whether you owe advance tax:";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Estimated total annual income (all sources)</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={incomeInput}
              onChange={(e) => setIncomeInput(e.target.value)}
              className="tabular w-full bg-transparent text-base font-medium text-ink outline-none"
            />
          </div>
        </label>

        <label className="mt-3 block">
          <span className="mb-1 block text-xs text-ink-soft">TDS already deducted (by employer, bank, etc.)</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-sm text-ink-soft">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={tdsInput}
              onChange={(e) => setTdsInput(e.target.value)}
              className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none"
            />
          </div>
        </label>

        <fieldset className="mt-4">
          <legend className="mb-1.5 text-xs text-ink-soft">Tax regime</legend>
          <div className="flex gap-2">
            <RadioPill label="New regime" active={regime === "new"} onClick={() => setRegime("new")} />
            <RadioPill label="Old regime" active={regime === "old"} onClick={() => setRegime("old")} />
          </div>
        </fieldset>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            {result.isLiable ? "Net Advance Tax Payable" : "Advance Tax Status"}
          </p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {result.isLiable ? formatINR(result.netAdvanceTaxPayable) : "Not liable"}
          </div>
          {!result.isLiable && (
            <p className="tabular mt-1 text-sm text-white/70">
              Net liability is below the ₹10,000 threshold
            </p>
          )}
        </div>

        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Total tax liability" value={result.totalTaxLiability} />
          <LineRow label="TDS already deducted" value={result.tdsAlreadyDeducted} />
          <LineRow label="Net advance tax payable" value={result.netAdvanceTaxPayable} emphasis />

          {result.isLiable && (
            <>
              <h3 className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-brand">
                Installment Schedule
              </h3>
              <div className="overflow-hidden rounded-lg border border-rule">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-rule bg-paper text-left">
                      <th className="px-3 py-2 font-medium text-ink-soft">Due Date</th>
                      <th className="px-3 py-2 text-right font-medium text-ink-soft">Cumulative %</th>
                      <th className="px-3 py-2 text-right font-medium text-ink-soft">Installment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.installments.map((inst) => (
                      <tr key={inst.dueDate} className="border-b border-rule last:border-0">
                        <td className="px-3 py-2 text-ink">{inst.dueDate}</td>
                        <td className="tabular px-3 py-2 text-right text-ink-soft">{inst.cumulativePercentRequired}%</td>
                        <td className="tabular px-3 py-2 text-right font-medium text-ink">{formatINR(inst.installmentAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <p className="mt-4 text-xs text-ink-soft">
            Interest under Sections 234B and 234C applies if installments are paid late or
            underpaid — this calculator shows the required schedule only, not penalty interest.
          </p>
        </div>
      </div>

      <CalculatorActions shareTitle="My advance tax schedule" shareText={shareText} />
    </div>
  );
}

function LineRow({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${emphasis ? "font-semibold" : ""}`}>
      <span className={`text-sm ${emphasis ? "text-ink" : "text-ink-soft"}`}>{label}</span>
      <span className="tabular text-sm text-ink">{formatINR(value)}</span>
    </div>
  );
}

function RadioPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand hover:text-brand"
      }`}
    >
      {label}
    </button>
  );
}
