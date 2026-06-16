"use client";

import { useMemo, useState } from "react";
import { projectPpfMaturity, PPF_MIN_ANNUAL_DEPOSIT, PPF_MAX_ANNUAL_DEPOSIT, PPF_INTEREST_RATE } from "@/lib/calculators/ppf";
import { formatINR } from "@/lib/format";

/**
 * Same ledger-card visual language as the salary calculator, adapted for
 * a multi-year investment projection rather than a monthly payslip: the
 * "net pay" signature element becomes the maturity amount, and the
 * year-by-year table plays the role the earnings/deductions rows play
 * in the salary calculator.
 */

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

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Input row */}
      <div className="mb-6 rounded-lg border border-rule bg-surface p-5">
        <label htmlFor="ppf-deposit" className="mb-2 block text-sm font-medium text-ink">
          Annual investment (₹ per year)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-lg text-ink-muted">₹</span>
          <input
            id="ppf-deposit"
            type="text"
            inputMode="numeric"
            value={depositInput}
            onChange={(e) => setDepositInput(e.target.value)}
            className="tabular w-full rounded-md border border-rule bg-paper px-3 py-2 text-lg text-ink focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/30"
            placeholder="1,50,000"
          />
        </div>
        {isBelowMinimum && (
          <p className="mt-1.5 text-xs text-deduction">
            PPF requires a minimum deposit of {formatINR(PPF_MIN_ANNUAL_DEPOSIT)}/year to keep the
            account active.
          </p>
        )}
        <p className="mt-1.5 text-xs text-ink-muted">
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
          className="w-full accent-[var(--ledger-green)]"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-muted">
          <span>15 years (standard lock-in)</span>
          <span>40 years</span>
        </div>
      </div>

      {/* Result card */}
      <div className="relative overflow-hidden rounded-lg border border-rule bg-surface shadow-sm">
        <div
          className="h-3 w-full bg-paper"
          style={{
            backgroundImage: "radial-gradient(circle at 6px 0, transparent 4px, var(--surface) 4.5px)",
            backgroundSize: "12px 6px",
            backgroundPosition: "top",
          }}
          aria-hidden="true"
        />

        <div className="px-6 py-6 sm:px-8">
          <p className="font-display text-sm uppercase tracking-wide text-ink-muted">
            PPF Projection ({years} years @ {(PPF_INTEREST_RATE * 100).toFixed(1)}% p.a.)
          </p>

          <div className="mt-5">
            <LineRow label="Total investment" value={result.totalInvestment} />
            <LineRow label="Total interest earned" value={result.totalInterest} />
          </div>

          <div className="mt-6 border-t-2 border-rule-strong pt-5">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-base text-ink">Maturity Amount</span>
              <span className="tabular font-display text-3xl font-bold text-ledger sm:text-4xl">
                {formatINR(result.maturityAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-year table */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowTable((s) => !s)}
          className="text-sm font-medium text-ledger underline-offset-2 hover:underline"
        >
          {showTable ? "Hide" : "Show"} year-by-year breakdown
        </button>
        {showTable && (
          <div className="mt-3 overflow-hidden rounded-lg border border-rule">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper text-left">
                  <th className="px-3 py-2 font-medium text-ink-muted">Year</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-muted">Deposit</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-muted">Interest</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-muted">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyBreakdown.map((row) => (
                  <tr key={row.year} className="border-b border-rule last:border-0">
                    <td className="px-3 py-2 text-ink-muted">{row.year}</td>
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

function LineRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-rule py-1.5">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className="tabular text-sm text-ink">{formatINR(value)}</span>
    </div>
  );
}
