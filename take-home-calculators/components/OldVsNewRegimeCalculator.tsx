"use client";

import { useMemo, useState } from "react";
import { compareRegimes } from "@/lib/calculators/income-tax";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function OldVsNewRegimeCalculator() {
  const [incomeInput, setIncomeInput] = useState("1200000");
  const [deductionsInput, setDeductionsInput] = useState("150000");

  const grossIncome = Math.max(0, Number(incomeInput.replace(/[^0-9.]/g, "")) || 0);
  const oldRegimeDeductions = Math.max(0, Number(deductionsInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(() => compareRegimes(grossIncome, oldRegimeDeductions), [grossIncome, oldRegimeDeductions]);

  const shareText = `Under my income, the ${result.betterRegime} regime saves ${formatINR(result.savings)}/year. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Gross annual income</span>
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
          <span className="mb-1 block text-xs text-ink-soft">
            Deductions you&apos;d claim under the old regime (80C, HRA, home loan interest, etc.)
          </span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-sm text-ink-soft">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={deductionsInput}
              onChange={(e) => setDeductionsInput(e.target.value)}
              className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none"
            />
          </div>
        </label>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Better Choice</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {result.betterRegime === "new" ? "New Regime" : "Old Regime"}
          </div>
          <p className="tabular mt-1 text-sm text-white/70">Saves you {formatINR(result.savings)}/year</p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <div className="overflow-hidden rounded-lg border border-rule">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper text-left">
                  <th className="px-3 py-2 font-medium text-ink-soft"></th>
                  <th className="px-3 py-2 text-right font-medium text-ink-soft">New</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-soft">Old</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-rule">
                  <td className="px-3 py-2 text-ink-soft">Standard deduction</td>
                  <td className="tabular px-3 py-2 text-right text-ink">{formatINR(result.new.standardDeduction)}</td>
                  <td className="tabular px-3 py-2 text-right text-ink">{formatINR(result.old.standardDeduction)}</td>
                </tr>
                <tr className="border-b border-rule">
                  <td className="px-3 py-2 text-ink-soft">Taxable income</td>
                  <td className="tabular px-3 py-2 text-right text-ink">{formatINR(result.new.taxableIncome)}</td>
                  <td className="tabular px-3 py-2 text-right text-ink">{formatINR(result.old.taxableIncome)}</td>
                </tr>
                <tr className={result.betterRegime === "new" ? "bg-brand-soft" : ""}>
                  <td className="px-3 py-2 font-semibold text-ink">Tax payable</td>
                  <td className={`tabular px-3 py-2 text-right font-semibold ${result.betterRegime === "new" ? "text-brand" : "text-ink"}`}>
                    {formatINR(result.new.totalTaxPayable)}
                  </td>
                  <td className={`tabular px-3 py-2 text-right font-semibold ${result.betterRegime === "old" ? "text-brand" : "text-ink"}`}>
                    {formatINR(result.old.totalTaxPayable)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CalculatorActions shareTitle="Old vs New regime comparison" shareText={shareText} />
    </div>
  );
}
