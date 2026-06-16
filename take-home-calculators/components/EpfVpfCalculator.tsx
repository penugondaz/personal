"use client";

import { useMemo, useState } from "react";
import {
  calculatePfBreakup,
  calculateVpfContribution,
  projectEpfMaturity,
  EPF_INTEREST_RATE_FY2025_26,
  VPF_TAXABLE_INTEREST_THRESHOLD,
  type PfWageCeilingMode,
} from "@/lib/calculators/epf";
import { formatINR } from "@/lib/format";

/**
 * Combines the mandatory EPF contribution (employee + employer) with an
 * optional VPF top-up in one calculator, since they share the same
 * underlying account and interest rate — the only thing that changes is
 * whether a voluntary employee-only top-up is added on top of the
 * statutory 12%.
 */

interface EpfVpfCalculatorProps {
  initialBasicMonthly?: number;
}

export default function EpfVpfCalculator({ initialBasicMonthly = 30_000 }: EpfVpfCalculatorProps) {
  const [basicInput, setBasicInput] = useState(String(initialBasicMonthly));
  const [pfMode, setPfMode] = useState<PfWageCeilingMode>("uncapped_actual_basic");
  const [vpfPercent, setVpfPercent] = useState(0);
  const [years, setYears] = useState(20);
  const [currentAge, setCurrentAge] = useState(30);

  const basicMonthly = Math.max(0, Number(basicInput.replace(/[^0-9.]/g, "")) || 0);

  const pfBreakup = useMemo(() => calculatePfBreakup(basicMonthly, pfMode), [basicMonthly, pfMode]);

  const vpf = useMemo(
    () => calculateVpfContribution(basicMonthly, vpfPercent / 100, pfBreakup.employeeContribution),
    [basicMonthly, vpfPercent, pfBreakup.employeeContribution]
  );

  const projection = useMemo(
    () =>
      projectEpfMaturity(
        pfBreakup.employeeContribution + vpf.monthlyVpfContribution,
        pfBreakup.totalEmployerContribution,
        years,
        EPF_INTEREST_RATE_FY2025_26
      ),
    [pfBreakup, vpf, years]
  );

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Inputs */}
      <div className="mb-6 rounded-lg border border-rule bg-surface p-5">
        <label htmlFor="basic-input" className="mb-2 block text-sm font-medium text-ink">
          Monthly Basic Salary + DA (₹)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-lg text-ink-muted">₹</span>
          <input
            id="basic-input"
            type="text"
            inputMode="numeric"
            value={basicInput}
            onChange={(e) => setBasicInput(e.target.value)}
            className="tabular w-full rounded-md border border-rule bg-paper px-3 py-2 text-lg text-ink focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/30"
            placeholder="30,000"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-muted">PF wage base</span>
            <select
              value={pfMode}
              onChange={(e) => setPfMode(e.target.value as PfWageCeilingMode)}
              className="w-full rounded-md border border-rule bg-paper px-2 py-1.5 text-sm text-ink focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/30"
            >
              <option value="uncapped_actual_basic">Actual basic</option>
              <option value="capped_15000">₹15,000 cap</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-muted">Current age</span>
            <input
              type="number"
              min={18}
              max={59}
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="tabular w-full rounded-md border border-rule bg-paper px-2 py-1.5 text-sm text-ink focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/30"
            />
          </label>
        </div>

        <label htmlFor="vpf-percent" className="mt-4 mb-2 block text-sm font-medium text-ink">
          Additional VPF contribution: {vpfPercent}% of basic{" "}
          <span className="text-ink-muted">(on top of mandatory 12% EPF)</span>
        </label>
        <input
          id="vpf-percent"
          type="range"
          min={0}
          max={88}
          step={1}
          value={vpfPercent}
          onChange={(e) => setVpfPercent(Number(e.target.value))}
          className="w-full accent-[var(--ledger-green)]"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-muted">
          <span>0% (EPF only)</span>
          <span>88% (100% combined with mandatory 12%)</span>
        </div>

        <label htmlFor="years-input" className="mt-4 mb-2 block text-sm font-medium text-ink">
          Years to project: {years}
        </label>
        <input
          id="years-input"
          type="range"
          min={1}
          max={Math.max(1, 58 - currentAge)}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full accent-[var(--ledger-green)]"
        />
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
            Monthly Contribution Breakdown
          </p>

          <div className="mt-5">
            <LineRow label="Your EPF contribution (12%)" value={pfBreakup.employeeContribution} />
            {vpf.monthlyVpfContribution > 0 && (
              <LineRow label={`Your VPF contribution (${vpfPercent}%)`} value={vpf.monthlyVpfContribution} />
            )}
            <LineRow label="Employer EPF contribution" value={pfBreakup.employerEpfContribution} />
            <LineRow label="Employer EPS contribution" value={pfBreakup.employerEpsContribution} />
            <LineRow
              label="Total monthly contribution"
              value={
                pfBreakup.employeeContribution +
                vpf.monthlyVpfContribution +
                pfBreakup.totalEmployerContribution
              }
              emphasis
            />
          </div>

          {vpf.exceedsTaxableThreshold && (
            <p className="mt-3 text-xs text-deduction">
              Your combined EPF + VPF contribution exceeds {formatINR(VPF_TAXABLE_INTEREST_THRESHOLD)}
              /year — interest on the amount above this threshold becomes taxable.
            </p>
          )}

          <div className="mt-6 border-t-2 border-rule-strong pt-5">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-base text-ink">
                Projected Value After {years} Years
              </span>
              <span className="tabular font-display text-3xl font-bold text-ledger sm:text-4xl">
                {formatINR(projection.maturityAmount)}
              </span>
            </div>
            <p className="tabular mt-1 text-right text-sm text-ink-muted">
              of which {formatINR(projection.totalInterest)} is interest earned
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LineRow({ label, value, emphasis = false }: { label: string; value: number; emphasis?: boolean }) {
  return (
    <div
      className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${
        emphasis ? "font-semibold" : ""
      }`}
    >
      <span className={`text-sm ${emphasis ? "text-ink" : "text-ink-muted"}`}>{label}</span>
      <span className="tabular text-sm text-ink">{formatINR(value)}</span>
    </div>
  );
}
