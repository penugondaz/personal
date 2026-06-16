"use client";

import { useMemo, useState } from "react";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import type { ProfessionalTaxState, Gender } from "@/lib/calculators/professional-tax";
import type { TaxRegime } from "@/lib/calculators/income-tax";
import type { PfWageCeilingMode } from "@/lib/calculators/epf";
import { formatINR } from "@/lib/format";

/**
 * Salary slip ledger design: the result reads like a printed payslip —
 * earnings lines add, deduction lines carry a small minus-rule, and the
 * net-pay figure sits below a heavier rule exactly the way a real
 * payslip's "Net Payable" total does. Tabular numerals throughout so
 * every rupee column actually lines up.
 */

interface SalaryInputCalculatorProps {
  /** Pre-fills the CTC input, e.g. for a programmatic /salary/10-lpa-in-hand page. */
  initialAnnualCtc?: number;
}

export default function SalaryInputCalculator({ initialAnnualCtc = 1_000_000 }: SalaryInputCalculatorProps) {
  const [ctcInput, setCtcInput] = useState(String(initialAnnualCtc));
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [ptState, setPtState] = useState<ProfessionalTaxState>("none");
  const [gender, setGender] = useState<Gender>("male");
  const [pfMode, setPfMode] = useState<PfWageCeilingMode>("uncapped_actual_basic");
  const [showAssumptions, setShowAssumptions] = useState(false);

  const annualCtc = Math.max(0, Number(ctcInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () =>
      calculateSalaryBreakup({
        annualCtc,
        regime,
        professionalTaxState: ptState,
        gender,
        pfWageCeilingMode: pfMode,
      }),
    [annualCtc, regime, ptState, gender, pfMode]
  );

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Input row */}
      <div className="mb-6 rounded-lg border border-rule bg-surface p-5">
        <label htmlFor="ctc-input" className="mb-2 block text-sm font-medium text-ink">
          Annual CTC (₹ per year)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-lg text-ink-muted">₹</span>
          <input
            id="ctc-input"
            type="text"
            inputMode="numeric"
            value={ctcInput}
            onChange={(e) => setCtcInput(e.target.value)}
            className="tabular w-full rounded-md border border-rule bg-paper px-3 py-2 text-lg text-ink focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/30"
            placeholder="10,00,000"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <FieldSelect
            label="Tax regime"
            value={regime}
            onChange={(v) => setRegime(v as TaxRegime)}
            options={[
              { value: "new", label: "New regime" },
              { value: "old", label: "Old regime" },
            ]}
          />
          <FieldSelect
            label="State (PT)"
            value={ptState}
            onChange={(v) => setPtState(v as ProfessionalTaxState)}
            options={[
              { value: "none", label: "No PT / Other" },
              { value: "maharashtra", label: "Maharashtra" },
              { value: "karnataka", label: "Karnataka" },
            ]}
          />
          <FieldSelect
            label="Gender"
            value={gender}
            onChange={(v) => setGender(v as Gender)}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
          <FieldSelect
            label="PF wage base"
            value={pfMode}
            onChange={(v) => setPfMode(v as PfWageCeilingMode)}
            options={[
              { value: "uncapped_actual_basic", label: "Actual basic" },
              { value: "capped_15000", label: "₹15,000 cap" },
            ]}
          />
        </div>
      </div>

      {/* Payslip card */}
      <div className="relative overflow-hidden rounded-lg border border-rule bg-surface shadow-sm">
        {/* Perforated tear-edge, evoking a slip torn from a pad */}
        <div
          className="h-3 w-full bg-paper"
          style={{
            backgroundImage:
              "radial-gradient(circle at 6px 0, transparent 4px, var(--surface) 4.5px)",
            backgroundSize: "12px 6px",
            backgroundPosition: "top",
          }}
          aria-hidden="true"
        />

        <div className="px-6 py-6 sm:px-8">
          <p className="font-display text-sm uppercase tracking-wide text-ink-muted">
            Estimated Salary Breakup
          </p>

          {/* Earnings */}
          <section className="mt-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ledger">
              Earnings (Monthly)
            </h3>
            <LineRow label="Basic salary" value={result.basicMonthly} />
            <LineRow label="HRA" value={result.hraMonthly} />
            <LineRow label="Special allowance" value={result.specialAllowanceMonthly} />
            <LineRow label="Gross salary" value={result.grossSalaryMonthly} emphasis />
          </section>

          {/* Deductions */}
          <section className="mt-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-deduction">
              Deductions (Monthly)
            </h3>
            <LineRow label="Employee PF" value={result.employeePfMonthly} deduction />
            {result.professionalTaxMonthly > 0 && (
              <LineRow label="Professional tax" value={result.professionalTaxMonthly} deduction />
            )}
            <LineRow label="Income tax (TDS)" value={result.incomeTaxMonthly} deduction />
          </section>

          {/* Net pay — the signature element, set apart by a heavier rule */}
          <div className="mt-6 border-t-2 border-rule-strong pt-5">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-base text-ink">Net In-Hand Salary</span>
              <span className="tabular font-display text-3xl font-bold text-ledger sm:text-4xl">
                {formatINR(result.inHandMonthly)}
                <span className="ml-1 text-base font-normal text-ink-muted">/month</span>
              </span>
            </div>
            <p className="tabular mt-1 text-right text-sm text-ink-muted">
              {formatINR(result.inHandAnnual)} / year
            </p>
          </div>
        </div>
      </div>

      {/* Assumptions disclosure */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowAssumptions((s) => !s)}
          className="text-sm font-medium text-ledger underline-offset-2 hover:underline"
        >
          {showAssumptions ? "Hide" : "Show"} calculation assumptions
        </button>
        {showAssumptions && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
            {result.breakupAssumptions.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function LineRow({
  label,
  value,
  emphasis = false,
  deduction = false,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
  deduction?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${
        emphasis ? "font-semibold" : ""
      }`}
    >
      <span className={`text-sm ${emphasis ? "text-ink" : "text-ink-muted"}`}>
        {deduction ? "− " : ""}
        {label}
      </span>
      <span
        className={`tabular text-sm ${
          deduction ? "text-deduction" : emphasis ? "text-ink" : "text-ink"
        }`}
      >
        {formatINR(value)}
      </span>
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-rule bg-paper px-2 py-1.5 text-sm text-ink focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/30"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
