"use client";

import { useMemo, useState } from "react";
import { projectPpfMaturity, PPF_MIN_ANNUAL_DEPOSIT, PPF_MAX_ANNUAL_DEPOSIT, PPF_INTEREST_RATE } from "@/lib/calculators/ppf";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

interface PpfCalculatorProps {
  initialAnnualDeposit?: number;
  initialYears?: number;
}

export default function PpfCalculator({ initialAnnualDeposit = 150_000, initialYears = 15 }: PpfCalculatorProps) {
  const [depositInput, setDepositInput] = useState(String(initialAnnualDeposit));
  const [years, setYears] = useState(initialYears);
  const [showTable, setShowTable] = useState(false);

  const annualDeposit = Math.min(
    PPF_MAX_ANNUAL_DEPOSIT,
    Math.max(0, Number(depositInput.replace(/[^0-9.]/g, "")) || 0)
  );

  const result = useMemo(() => projectPpfMaturity(annualDeposit, years), [annualDeposit, years]);
  const isBelowMinimum = annualDeposit > 0 && annualDeposit < PPF_MIN_ANNUAL_DEPOSIT;

  const shareText = `My PPF investment of ${formatINR(annualDeposit)}/year grows to ${formatINR(result.maturityAmount)} in ${years} years. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label htmlFor="ppf-deposit" className="mb-2 block text-sm font-medium text-ink">
          Annual investment (₹ per year)
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-rule bg-paper px-3 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
          <span className="text-lg text-ink-soft">₹</span>
          <input
            id="ppf-deposit"
            type="text"
            inputMode="numeric"
            value={depositInput}
            onChange={(e) => setDepositInput(e.target.value)}
            className="tabular w-full bg-transparent text-lg font-medium text-ink outline-none"
            placeholder="1,50,000"
          />
        </div>
        {isBelowMinimum && (
          <p className="mt-1.5 text-xs text-deduction">
            PPF requires a minimum deposit of {formatINR(PPF_MIN_ANNUAL_DEPOSIT)}/year to keep the
            account active.
          </p>
        )}
        <p className="mt-1.5 text-xs text-ink-soft">
          Maximum {formatINR(PPF_MAX_ANNUAL_DEPOSIT)}/year — deposits above this don&apos;t earn
          interest or qualify for Section 80C benefit.
        </p>

        <label htmlFor="ppf-years" className="mt-4 mb-2 block text-sm font-medium text-ink">
          Investment period: {years} years
        </label>
        <input
          id="ppf-years"
          type="range"
          min={15}
          max={40}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full accent-[var(--brand)]"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-soft">
          <span>15 years (standard lock-in)</span>
          <span>40 years</span>
        </div>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            PPF Projection ({years} years @ {(PPF_INTEREST_RATE * 100).toFixed(1)}% p.a.)
          </p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.maturityAmount)}
          </div>
          <p className="tabular mt-1 text-sm text-white/70">Maturity amount</p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Total investment" value={result.totalInvestment} />
          <LineRow label="Total interest earned" value={result.totalInterest} emphasis />
        </div>
      </div>

      <CalculatorActions shareTitle="My PPF projection" shareText={shareText} />

      <div className="no-print mt-4">
        <button
          type="button"
          onClick={() => setShowTable((s) => !s)}
          className="text-sm font-medium text-brand underline-offset-2 hover:underline"
        >
          {showTable ? "Hide" : "Show"} year-by-year breakdown
        </button>
        {showTable && (
          <div className="mt-3 overflow-hidden rounded-xl border border-rule">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper text-left">
                  <th className="px-3 py-2 font-medium text-ink-soft">Year</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-soft">Deposit</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-soft">Interest</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-soft">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyBreakdown.map((row) => (
                  <tr key={row.year} className="border-b border-rule last:border-0">
                    <td className="px-3 py-2 text-ink-soft">{row.year}</td>
                    <td className="tabular px-3 py-2 text-right text-ink">{formatINR(row.deposit)}</td>
                    <td className="tabular px-3 py-2 text-right text-ink">{formatINR(row.interestEarned)}</td>
                    <td className="tabular px-3 py-2 text-right font-medium text-ink">
                      {formatINR(row.closingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
