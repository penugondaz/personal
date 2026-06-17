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
import CalculatorActions from "./CalculatorActions";

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

  const shareText = `My EPF + VPF is projected to grow to ${formatINR(projection.maturityAmount)} in ${years} years. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label htmlFor="basic-input" className="mb-2 block text-sm font-medium text-ink">
          Monthly Basic Salary + DA (₹)
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-rule bg-paper px-3 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
          <span className="text-lg text-ink-soft">₹</span>
          <input
            id="basic-input"
            type="text"
            inputMode="numeric"
            value={basicInput}
            onChange={(e) => setBasicInput(e.target.value)}
            className="tabular w-full bg-transparent text-lg font-medium text-ink outline-none"
            placeholder="30,000"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">PF wage base</span>
            <select
              value={pfMode}
              onChange={(e) => setPfMode(e.target.value as PfWageCeilingMode)}
              className="w-full rounded-lg border border-rule bg-paper px-2 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
            >
              <option value="uncapped_actual_basic">Actual basic</option>
              <option value="capped_15000">₹15,000 cap</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Current age</span>
            <input
              type="number"
              min={18}
              max={59}
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
            />
          </label>
        </div>

        <label htmlFor="vpf-percent" className="mt-4 mb-2 block text-sm font-medium text-ink">
          Additional VPF contribution: {vpfPercent}% of basic{" "}
          <span className="text-ink-soft">(on top of mandatory 12% EPF)</span>
        </label>
        <input
          id="vpf-percent"
          type="range"
          min={0}
          max={88}
          step={1}
          value={vpfPercent}
          onChange={(e) => setVpfPercent(Number(e.target.value))}
          className="w-full accent-[var(--brand)]"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-soft">
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
          className="w-full accent-[var(--brand)]"
        />
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            Projected Value After {years} Years
          </p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(projection.maturityAmount)}
          </div>
          <p className="tabular mt-1 text-sm text-white/70">
            of which {formatINR(projection.totalInterest)} is interest earned
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">
            Monthly Contribution Breakdown
          </p>
          <LineRow label="Your EPF contribution (12%)" value={pfBreakup.employeeContribution} />
          {vpf.monthlyVpfContribution > 0 && (
            <LineRow label={`Your VPF contribution (${vpfPercent}%)`} value={vpf.monthlyVpfContribution} />
          )}
          <LineRow label="Employer EPF contribution" value={pfBreakup.employerEpfContribution} />
          <LineRow label="Employer EPS contribution" value={pfBreakup.employerEpsContribution} />
          <LineRow
            label="Total monthly contribution"
            value={pfBreakup.employeeContribution + vpf.monthlyVpfContribution + pfBreakup.totalEmployerContribution}
            emphasis
          />

          {vpf.exceedsTaxableThreshold && (
            <p className="mt-3 text-xs text-deduction">
              Your combined EPF + VPF contribution exceeds {formatINR(VPF_TAXABLE_INTEREST_THRESHOLD)}
              /year — interest on the amount above this threshold becomes taxable.
            </p>
          )}
        </div>
      </div>

      <CalculatorActions shareTitle="My EPF + VPF projection" shareText={shareText} />
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
