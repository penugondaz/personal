"use client";

import { useMemo, useState } from "react";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { compareRegimes } from "@/lib/calculators/income-tax";
import type { ProfessionalTaxState, Gender } from "@/lib/calculators/professional-tax";
import type { TaxRegime } from "@/lib/calculators/income-tax";
import type { PfWageCeilingMode } from "@/lib/calculators/epf";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

interface SalaryInputCalculatorProps {
  initialAnnualCtc?: number;
}

type ViewMode = "summary" | "breakup" | "regimes";

export default function SalaryInputCalculator({ initialAnnualCtc = 1_000_000 }: SalaryInputCalculatorProps) {
  const [ctcInput, setCtcInput] = useState(String(initialAnnualCtc));
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [ptState, setPtState] = useState<ProfessionalTaxState>("none");
  const [gender, setGender] = useState<Gender>("male");
  const [pfMode, setPfMode] = useState<PfWageCeilingMode>("uncapped_actual_basic");
  const [view, setView] = useState<ViewMode>("summary");

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

  const regimeComparison = useMemo(() => compareRegimes(result.grossSalaryAnnual), [result.grossSalaryAnnual]);

  const shareText = `My in-hand salary on ${formatINR(annualCtc)} CTC works out to ${formatINR(
    result.inHandMonthly
  )}/month. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Input row */}
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label htmlFor="ctc-input" className="mb-2 block text-sm font-medium text-ink">
          Annual CTC (₹ per year)
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-rule bg-paper px-3 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
          <span className="text-lg text-ink-soft">₹</span>
          <input
            id="ctc-input"
            type="text"
            inputMode="numeric"
            value={ctcInput}
            onChange={(e) => setCtcInput(e.target.value)}
            className="tabular w-full bg-transparent text-lg font-medium text-ink outline-none"
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

      {/* View switcher */}
      <div className="no-print mb-4 flex gap-1.5 rounded-full bg-brand-soft p-1.5">
        <TabButton active={view === "summary"} onClick={() => setView("summary")}>
          Summary
        </TabButton>
        <TabButton active={view === "breakup"} onClick={() => setView("breakup")}>
          Detailed CTC breakup
        </TabButton>
        <TabButton active={view === "regimes"} onClick={() => setView("regimes")}>
          Old vs New regime
        </TabButton>
      </div>

      {/* Result card */}
      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            {view === "regimes" ? "Old vs New Tax Regime" : "Net In-Hand Salary"}
          </p>
          {view !== "regimes" ? (
            <>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="tabular font-display text-4xl font-semibold text-white sm:text-5xl">
                  {formatINR(result.inHandMonthly)}
                </span>
                <span className="text-base font-normal text-white/70">/month</span>
              </div>
              <p className="tabular mt-1 text-sm text-white/70">
                {formatINR(result.inHandAnnual)} per year · {regime === "new" ? "New" : "Old"} regime
              </p>
            </>
          ) : (
            <p className="mt-1 font-display text-2xl font-semibold text-white">
              {regimeComparison.betterRegime === "new" ? "New regime" : "Old regime"} saves you{" "}
              {formatINR(regimeComparison.savings)}/year
            </p>
          )}
        </div>

        <div className="px-6 py-6 sm:px-8">
          {view === "summary" && <SummaryView result={result} />}
          {view === "breakup" && <BreakupView result={result} />}
          {view === "regimes" && <RegimesView comparison={regimeComparison} />}
        </div>
      </div>

      <CalculatorActions shareTitle="My in-hand salary breakdown" shareText={shareText} />
    </div>
  );
}

function SummaryView({ result }: { result: ReturnType<typeof calculateSalaryBreakup> }) {
  return (
    <>
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">
          Earnings (Monthly)
        </h3>
        <LineRow label="Basic salary" value={result.basicMonthly} />
        <LineRow label="HRA" value={result.hraMonthly} />
        <LineRow label="Special allowance" value={result.specialAllowanceMonthly} />
        <LineRow label="Gross salary" value={result.grossSalaryMonthly} emphasis />
      </section>

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

      <AssumptionsDisclosure assumptions={result.breakupAssumptions} />
    </>
  );
}

function BreakupView({ result }: { result: ReturnType<typeof calculateSalaryBreakup> }) {
  const ctcRows: { label: string; annual: number; monthly: number; note?: string }[] = [
    { label: "Basic salary", annual: result.basicAnnual, monthly: result.basicMonthly },
    { label: "HRA", annual: result.hraAnnual, monthly: result.hraMonthly },
    {
      label: "Special allowance",
      annual: result.specialAllowanceAnnual,
      monthly: result.specialAllowanceMonthly,
      note: "Balancing figure — absorbs whatever's left of CTC",
    },
    {
      label: "Employer PF contribution",
      annual: result.employerPfAnnual,
      monthly: result.employerPfMonthly,
      note: "Part of CTC, not paid to you monthly",
    },
    {
      label: "Gratuity (reserved)",
      annual: result.gratuityAnnual,
      monthly: result.gratuityMonthly,
      note: "Only payable after 5+ years of service",
    },
  ];

  return (
    <>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand">
        Full CTC Breakup
      </h3>
      <div className="overflow-hidden rounded-xl border border-rule">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule bg-paper text-left">
              <th className="px-3 py-2 font-medium text-ink-soft">Component</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Monthly</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Annual</th>
            </tr>
          </thead>
          <tbody>
            {ctcRows.map((row) => (
              <tr key={row.label} className="border-b border-rule last:border-0">
                <td className="px-3 py-2.5">
                  <span className="text-ink">{row.label}</span>
                  {row.note && <p className="mt-0.5 text-xs text-ink-soft">{row.note}</p>}
                </td>
                <td className="tabular px-3 py-2.5 text-right text-ink">{formatINR(row.monthly)}</td>
                <td className="tabular px-3 py-2.5 text-right text-ink">{formatINR(row.annual)}</td>
              </tr>
            ))}
            <tr className="bg-brand-soft">
              <td className="px-3 py-2.5 font-semibold text-brand">Total CTC</td>
              <td className="tabular px-3 py-2.5 text-right font-semibold text-brand">
                {formatINR(result.monthlyCtc)}
              </td>
              <td className="tabular px-3 py-2.5 text-right font-semibold text-brand">
                {formatINR(result.annualCtc)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wide text-deduction">
        Gross Salary → In-Hand
      </h3>
      <div className="overflow-hidden rounded-xl border border-rule">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-rule">
              <td className="px-3 py-2.5 text-ink">Gross salary (annual, taxable)</td>
              <td className="tabular px-3 py-2.5 text-right text-ink">{formatINR(result.grossSalaryAnnual)}</td>
            </tr>
            <tr className="border-b border-rule">
              <td className="px-3 py-2.5 text-deduction">− Employee PF</td>
              <td className="tabular px-3 py-2.5 text-right text-deduction">{formatINR(result.employeePfAnnual)}</td>
            </tr>
            {result.professionalTaxAnnual > 0 && (
              <tr className="border-b border-rule">
                <td className="px-3 py-2.5 text-deduction">− Professional tax</td>
                <td className="tabular px-3 py-2.5 text-right text-deduction">
                  {formatINR(result.professionalTaxAnnual)}
                </td>
              </tr>
            )}
            <tr className="border-b border-rule">
              <td className="px-3 py-2.5 text-deduction">− Income tax</td>
              <td className="tabular px-3 py-2.5 text-right text-deduction">
                {formatINR(result.incomeTax.totalTaxPayable)}
              </td>
            </tr>
            <tr className="bg-brand-soft">
              <td className="px-3 py-2.5 font-semibold text-brand">Net in-hand (annual)</td>
              <td className="tabular px-3 py-2.5 text-right font-semibold text-brand">
                {formatINR(result.inHandAnnual)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AssumptionsDisclosure assumptions={result.breakupAssumptions} />
    </>
  );
}

function RegimesView({ comparison }: { comparison: ReturnType<typeof compareRegimes> }) {
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-rule">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule bg-paper text-left">
              <th className="px-3 py-2 font-medium text-ink-soft"></th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">New Regime</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Old Regime</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-rule">
              <td className="px-3 py-2.5 text-ink-soft">Standard deduction</td>
              <td className="tabular px-3 py-2.5 text-right text-ink">
                {formatINR(comparison.new.standardDeduction)}
              </td>
              <td className="tabular px-3 py-2.5 text-right text-ink">
                {formatINR(comparison.old.standardDeduction)}
              </td>
            </tr>
            <tr className="border-b border-rule">
              <td className="px-3 py-2.5 text-ink-soft">Taxable income</td>
              <td className="tabular px-3 py-2.5 text-right text-ink">
                {formatINR(comparison.new.taxableIncome)}
              </td>
              <td className="tabular px-3 py-2.5 text-right text-ink">
                {formatINR(comparison.old.taxableIncome)}
              </td>
            </tr>
            <tr className="border-b border-rule">
              <td className="px-3 py-2.5 text-ink-soft">Rebate (Sec 87A)</td>
              <td className="tabular px-3 py-2.5 text-right text-ink">{formatINR(comparison.new.rebate)}</td>
              <td className="tabular px-3 py-2.5 text-right text-ink">{formatINR(comparison.old.rebate)}</td>
            </tr>
            <tr className="border-b border-rule">
              <td className="px-3 py-2.5 text-ink-soft">Cess (4%)</td>
              <td className="tabular px-3 py-2.5 text-right text-ink">{formatINR(comparison.new.cess)}</td>
              <td className="tabular px-3 py-2.5 text-right text-ink">{formatINR(comparison.old.cess)}</td>
            </tr>
            <tr className={comparison.betterRegime === "new" ? "bg-brand-soft" : ""}>
              <td className="px-3 py-2.5 font-semibold text-ink">Total tax payable</td>
              <td
                className={`tabular px-3 py-2.5 text-right font-semibold ${
                  comparison.betterRegime === "new" ? "text-brand" : "text-ink"
                }`}
              >
                {formatINR(comparison.new.totalTaxPayable)}
              </td>
              <td
                className={`tabular px-3 py-2.5 text-right font-semibold ${
                  comparison.betterRegime === "old" ? "text-brand" : "text-ink"
                }`}
              >
                {formatINR(comparison.old.totalTaxPayable)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ink-soft">
        The old-regime figures above assume no additional deductions (80C, HRA exemption, home
        loan interest). If you have significant deductions, the old regime may work out better
        than shown here — this comparison is meant as a starting point, not a final answer.
      </p>
    </>
  );
}

function AssumptionsDisclosure({ assumptions }: { assumptions: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="no-print mt-5 border-t border-rule pt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-medium text-brand underline-offset-2 hover:underline"
      >
        {open ? "Hide" : "Show"} calculation assumptions
      </button>
      {open && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
          {assumptions.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      )}
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
      <span className={`text-sm ${emphasis ? "text-ink" : "text-ink-soft"}`}>
        {deduction ? "− " : ""}
        {label}
      </span>
      <span className={`tabular text-sm ${deduction ? "text-deduction" : "text-ink"}`}>
        {formatINR(value)}
      </span>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
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
      <span className="mb-1 block text-xs text-ink-soft">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-rule bg-paper px-2 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
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
