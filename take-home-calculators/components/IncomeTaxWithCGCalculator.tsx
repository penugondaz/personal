"use client";
import { useState, useMemo } from "react";
import {
  calculateIncomeTaxWithCG,
  CAPITAL_GAINS_TYPES,
  type IncomeSource,
  type CapitalGainEntry,
  type Deductions,
  type CGType,
} from "@/lib/calculators/income-tax-with-cg";
import { formatINR, formatINRCompact } from "@/lib/format";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type Regime = "new" | "old";

function n(s: string) { return Number(s.replace(/[^0-9.]/g, "")) || 0; }
function pct(r: number) { return r.toFixed(2) + "%"; }

function Field({ label, hint, children }: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {hint && <span className="mb-1.5 block text-xs text-ink-soft">{hint}</span>}
      {children}
    </label>
  );
}

function AmtInput({ value, onChange, placeholder = "0" }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2.5
      focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
      <span className="shrink-0 text-ink-soft text-sm">₹</span>
      <input type="text" inputMode="numeric" value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent text-sm font-medium text-ink outline-none
          placeholder:text-ink-soft/40" />
    </div>
  );
}

function SectionHeader({ emoji, title, sub }: { emoji: string; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-rule">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-lg">
        {emoji}
      </span>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        {sub && <p className="text-xs text-ink-soft">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IncomeTaxWithCGCalculator() {
  const [regime, setRegime] = useState<Regime>("new");

  // Income
  const [income, setIncome] = useState<Record<keyof IncomeSource, string>>({
    salary:         "1200000",
    interestIncome: "0",
    rentalIncome:   "0",
    businessIncome: "0",
    otherIncome:    "0",
  });
  const setI = (k: keyof IncomeSource) => (v: string) => setIncome(p => ({ ...p, [k]: v }));

  // Capital gains
  const [cgEntries, setCgEntries] = useState<CapitalGainEntry[]>([
    { id: 1, label: "Equity mutual funds", type: "equity_ltcg", amount: 200000 },
  ]);

  const addCG = () => setCgEntries(e => [
    ...e,
    { id: Date.now(), label: "", type: "equity_ltcg", amount: 0 },
  ]);
  const removeCG = (id: number) => setCgEntries(e => e.filter(x => x.id !== id));
  const updateCG = (id: number, field: keyof CapitalGainEntry, value: string | number | CGType) =>
    setCgEntries(e => e.map(x => x.id === id ? { ...x, [field]: value } : x));

  // Deductions
  const [ded, setDed] = useState<Record<keyof Deductions, string>>({
    section80C:      "150000",
    section80D:      "25000",
    section24b:      "0",
    nps80CCD:        "0",
    hra:             "0",
    lta:             "0",
    otherDeductions: "0",
    rentalExpenses:  "0",
  });
  const setD = (k: keyof Deductions) => (v: string) => setDed(p => ({ ...p, [k]: v }));

  // Compute
  const result = useMemo(() => {
    const incomeSource: IncomeSource = {
      salary:         n(income.salary),
      interestIncome: n(income.interestIncome),
      rentalIncome:   n(income.rentalIncome),
      businessIncome: n(income.businessIncome),
      otherIncome:    n(income.otherIncome),
    };
    const deductions: Deductions = {
      section80C:      n(ded.section80C),
      section80D:      n(ded.section80D),
      section24b:      n(ded.section24b),
      nps80CCD:        n(ded.nps80CCD),
      hra:             n(ded.hra),
      lta:             n(ded.lta),
      otherDeductions: n(ded.otherDeductions),
      rentalExpenses:  n(ded.rentalExpenses),
    };
    return calculateIncomeTaxWithCG(incomeSource, cgEntries, deductions, regime);
  }, [income, cgEntries, ded, regime]);

  const hasCG = cgEntries.length > 0 && cgEntries.some(cg => cg.amount > 0);
  const totalCGTax = result.taxOnEquityLtcg + result.taxOnEquityStcg +
    result.taxOnDebtLtcg + result.taxOnPropertyLtcg;

  return (
    <div className="space-y-6">

      {/* ── Regime toggle ── */}
      <div className="flex gap-1 rounded-xl border border-rule bg-paper p-1">
        {(["new", "old"] as Regime[]).map(r => (
          <button key={r} onClick={() => setRegime(r)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              regime === r
                ? "bg-brand text-white shadow-card"
                : "text-ink-soft hover:text-ink"}`}>
            {r === "new" ? "New Regime (Default)" : "Old Regime"}
          </button>
        ))}
      </div>
      {regime === "new" && (
        <p className="text-xs text-ink-soft bg-brand-soft rounded-lg px-3 py-2">
          New regime: ₹75,000 standard deduction. Deductions like 80C, 80D not available.
          Zero tax up to ₹12.75 LPA for salaried. Capital gains taxed at special rates in both regimes.
        </p>
      )}

      {/* ── Income sources ── */}
      <div className="rounded-2xl border border-rule bg-surface p-5">
        <SectionHeader emoji="💰" title="Income Sources" sub="Enter annual amounts" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Salary / Pension (Gross)" hint="Before standard deduction">
            <AmtInput value={income.salary} onChange={setI("salary")} />
          </Field>
          <Field label="Interest Income" hint="FD interest, savings bank interest, bonds">
            <AmtInput value={income.interestIncome} onChange={setI("interestIncome")} />
          </Field>
          <Field label="Rental Income" hint="30% standard deduction applied automatically">
            <AmtInput value={income.rentalIncome} onChange={setI("rentalIncome")} />
          </Field>
          <Field label="Business / Freelance Income" hint="Net profit after business expenses">
            <AmtInput value={income.businessIncome} onChange={setI("businessIncome")} />
          </Field>
          <Field label="Other Income" hint="Dividends, winnings, gifts, etc.">
            <AmtInput value={income.otherIncome} onChange={setI("otherIncome")} />
          </Field>
        </div>
      </div>

      {/* ── Capital Gains ── */}
      <div className="rounded-2xl border border-rule bg-surface p-5">
        <SectionHeader emoji="📈" title="Capital Gains"
          sub="Add each sale separately. STCG on debt/property is added to ordinary income." />

        <div className="space-y-3">
          {cgEntries.map(cg => {
            const cgType = CAPITAL_GAINS_TYPES.find(t => t.type === cg.type);
            return (
              <div key={cg.id}
                className="rounded-xl border border-rule bg-paper p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-ink-soft mb-1">Description</label>
                    <input type="text" value={cg.label} placeholder="e.g. Nifty 50 ETF"
                      onChange={e => updateCG(cg.id, "label", e.target.value)}
                      className="w-full rounded-lg border border-rule bg-surface px-3 py-2 text-sm
                        text-ink outline-none focus:border-brand" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Type</label>
                    <select value={cg.type}
                      onChange={e => updateCG(cg.id, "type", e.target.value as CGType)}
                      className="w-full rounded-lg border border-rule bg-surface px-3 py-2 text-sm
                        text-ink outline-none focus:border-brand">
                      {CAPITAL_GAINS_TYPES.map(t => (
                        <option key={t.type} value={t.type}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Net Gain (₹)</label>
                    <div className="flex gap-2">
                      <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-rule
                        bg-surface px-3 py-2 focus-within:border-brand">
                        <span className="text-ink-soft text-sm">₹</span>
                        <input type="text" inputMode="numeric"
                          value={cg.amount === 0 ? "" : cg.amount}
                          placeholder="0"
                          onChange={e => updateCG(cg.id, "amount", Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                          className="w-full bg-transparent text-sm font-medium text-ink outline-none" />
                      </div>
                      <button onClick={() => removeCG(cg.id)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                          border border-rule text-ink-soft hover:border-deduction hover:text-deduction transition">
                        ×
                      </button>
                    </div>
                  </div>
                </div>
                {cgType && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold
                      ${cgType.addedToIncome
                        ? "bg-orange-100 text-orange-700"
                        : "bg-brand-soft text-brand"}`}>
                      {cgType.rate}
                    </span>
                    {cgType.addedToIncome && (
                      <span className="text-[10px] text-ink-soft">
                        Added to ordinary income · taxed at your slab rate
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={addCG}
          className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-brand/40
            px-4 py-2.5 text-sm font-medium text-brand hover:border-brand hover:bg-brand-soft transition">
          + Add Capital Gain
        </button>
      </div>

      {/* ── Deductions (old regime only) ── */}
      {regime === "old" && (
        <div className="rounded-2xl border border-rule bg-surface p-5">
          <SectionHeader emoji="📋" title="Deductions (Old Regime)"
            sub="Enter actual amounts — caps applied automatically" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Section 80C" hint="PF, ELSS, PPF, LIC, home loan principal · max ₹1.5L">
              <AmtInput value={ded.section80C} onChange={setD("section80C")} />
            </Field>
            <Field label="Section 80D" hint="Health insurance · max ₹25K self + ₹50K parents">
              <AmtInput value={ded.section80D} onChange={setD("section80D")} />
            </Field>
            <Field label="Section 24(b)" hint="Home loan interest · max ₹2L">
              <AmtInput value={ded.section24b} onChange={setD("section24b")} />
            </Field>
            <Field label="NPS 80CCD(1B)" hint="Additional NPS contribution · max ₹50K">
              <AmtInput value={ded.nps80CCD} onChange={setD("nps80CCD")} />
            </Field>
            <Field label="HRA Exemption" hint="Use HRA calculator to find this amount">
              <AmtInput value={ded.hra} onChange={setD("hra")} />
            </Field>
            <Field label="LTA + Other (80G, 80TTA etc.)">
              <AmtInput value={ded.otherDeductions} onChange={setD("otherDeductions")} />
            </Field>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-soft to-paper shadow-card-lg overflow-hidden">

        {/* Total tax banner */}
        <div className="px-6 py-6 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Total Tax Payable</p>
          <p className="font-display text-5xl font-bold text-brand mt-1">
            {formatINR(result.totalTaxPayable)}
          </p>
          <p className="text-sm text-ink-soft mt-1">
            Effective rate: {pct(result.effectiveRate)} · Marginal rate: {pct(result.marginalRate)}
            {result.rebate87A > 0 && ` · 87A rebate applied: ${formatINR(result.rebate87A)}`}
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 divide-x divide-rule border-t border-rule sm:grid-cols-4">
          {[
            { label: "Tax on Income",    value: formatINR(result.taxOnOrdinaryIncome), sub: "slab rate" },
            { label: "Tax on CG",        value: formatINR(totalCGTax),                 sub: "special rates" },
            { label: "Surcharge",        value: formatINR(result.surcharge),            sub: result.surcharge > 0 ? "applied" : "nil" },
            { label: "Health & Ed Cess", value: formatINR(result.cess),                 sub: "4%" },
          ].map(card => (
            <div key={card.label} className="px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{card.label}</p>
              <p className="tabular font-display text-lg font-semibold mt-0.5 text-ink">{card.value}</p>
              <p className="text-[10px] text-ink-soft">{card.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Income breakdown ── */}
      <div className="rounded-xl border border-rule bg-surface overflow-hidden">
        <div className="border-b border-rule bg-paper px-5 py-3">
          <p className="text-sm font-semibold text-ink">Income & Tax Breakdown</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {[
              { label: "Gross Salary",               value: result.grossSalary,           indent: false },
              { label: `Less: Standard Deduction`,   value: -result.standardDeduction,    indent: true, sign: "−" },
              { label: "Net Salary",                  value: result.netSalary,             indent: false, bold: true },
              ...(n(income.interestIncome) > 0 ? [{ label: "Interest Income", value: n(income.interestIncome), indent: false }] : []),
              ...(n(income.rentalIncome) > 0   ? [{ label: "Rental Income (net of 30%)", value: Math.round(n(income.rentalIncome) * 0.70), indent: false }] : []),
              ...(n(income.businessIncome) > 0 ? [{ label: "Business Income", value: n(income.businessIncome), indent: false }] : []),
              ...(result.debtStcgAddedToIncome > 0    ? [{ label: "Debt STCG (added to income)", value: result.debtStcgAddedToIncome, indent: false }] : []),
              ...(result.propertyStcgAddedToIncome > 0? [{ label: "Property STCG (added to income)", value: result.propertyStcgAddedToIncome, indent: false }] : []),
              ...(regime === "old" && result.totalDeductions > 0 ? [{ label: "Less: All Deductions", value: -result.totalDeductions, indent: true, sign: "−" }] : []),
              { label: "Taxable Ordinary Income",    value: result.taxableOrdinaryIncome, indent: false, bold: true },
              { label: "Tax on Ordinary Income",     value: result.taxOnOrdinaryIncome,   indent: false, tax: true },
            ].map((row, i) => (
              <tr key={i} className="border-b border-rule last:border-0 hover:bg-paper">
                <td className={`px-5 py-2.5 ${row.indent ? "pl-8 text-ink-soft" : ""} ${row.bold ? "font-semibold text-ink" : "text-ink-soft"}`}>
                  {row.label}
                </td>
                <td className={`tabular px-5 py-2.5 text-right font-medium
                  ${row.tax ? "text-deduction" : row.value < 0 ? "text-deduction" : "text-ink"}`}>
                  {row.value < 0 ? `− ${formatINR(Math.abs(row.value))}` : formatINR(row.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Capital gains breakdown ── */}
      {hasCG && (
        <div className="rounded-xl border border-rule bg-surface overflow-hidden">
          <div className="border-b border-rule bg-paper px-5 py-3">
            <p className="text-sm font-semibold text-ink">Capital Gains Tax Breakdown</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule text-left">
                <th className="px-5 py-2.5 font-medium text-ink-soft">Type</th>
                <th className="px-5 py-2.5 text-right font-medium text-ink-soft">Gain</th>
                <th className="px-5 py-2.5 text-right font-medium text-ink-soft">Rate</th>
                <th className="px-5 py-2.5 text-right font-medium text-ink-soft">Tax</th>
              </tr>
            </thead>
            <tbody>
              {[
                result.equityLtcg > 0 && {
                  label: "Equity LTCG",
                  gain: result.equityLtcg,
                  exemption: result.ltcgExemption,
                  rate: "12.5%",
                  tax: result.taxOnEquityLtcg,
                  note: result.ltcgExemption > 0 ? `₹${(result.ltcgExemption/100000).toFixed(2)}L exempt` : undefined,
                },
                result.equityStcg > 0 && {
                  label: "Equity STCG",
                  gain: result.equityStcg,
                  rate: "20%",
                  tax: result.taxOnEquityStcg,
                },
                result.debtLtcg > 0 && {
                  label: "Debt / Bond LTCG",
                  gain: result.debtLtcg,
                  rate: "12.5%",
                  tax: result.taxOnDebtLtcg,
                },
                result.debtStcgAddedToIncome > 0 && {
                  label: "Debt STCG",
                  gain: result.debtStcgAddedToIncome,
                  rate: "Slab",
                  tax: null,
                  note: "Included in ordinary income above",
                },
                result.propertyLtcg > 0 && {
                  label: "Property LTCG",
                  gain: result.propertyLtcg,
                  rate: "12.5%",
                  tax: result.taxOnPropertyLtcg,
                },
                result.propertyStcgAddedToIncome > 0 && {
                  label: "Property STCG",
                  gain: result.propertyStcgAddedToIncome,
                  rate: "Slab",
                  tax: null,
                  note: "Included in ordinary income above",
                },
              ].filter(Boolean).map((row: any, i: number) => (
                <tr key={i} className="border-b border-rule last:border-0 hover:bg-paper">
                  <td className="px-5 py-2.5 text-ink">
                    {row.label}
                    {row.note && <span className="ml-2 text-[10px] text-ink-soft">({row.note})</span>}
                  </td>
                  <td className="tabular px-5 py-2.5 text-right text-ink">{formatINR(row.gain)}</td>
                  <td className="tabular px-5 py-2.5 text-right text-ink-soft">{row.rate}</td>
                  <td className="tabular px-5 py-2.5 text-right font-medium text-deduction">
                    {row.tax !== null ? formatINR(row.tax) : "—"}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-rule bg-paper font-semibold">
                <td className="px-5 py-2.5 text-ink" colSpan={3}>Total Capital Gains Tax</td>
                <td className="tabular px-5 py-2.5 text-right text-deduction">{formatINR(totalCGTax)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── Slab breakdown ── */}
      <div className="rounded-xl border border-rule bg-surface overflow-hidden">
        <div className="border-b border-rule bg-paper px-5 py-3">
          <p className="text-sm font-semibold text-ink">Income Tax Slab Breakdown</p>
          <p className="text-xs text-ink-soft mt-0.5">On taxable ordinary income of {formatINR(result.taxableOrdinaryIncome)}</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule text-left bg-paper">
              <th className="px-5 py-2 font-medium text-ink-soft">Income Slab</th>
              <th className="px-5 py-2 text-right font-medium text-ink-soft">Rate</th>
              <th className="px-5 py-2 text-right font-medium text-ink-soft">Tax</th>
            </tr>
          </thead>
          <tbody>
            {result.slabBreakdown.map((slab, i) => (
              <tr key={i} className={`border-b border-rule last:border-0 ${slab.taxInSlab > 0 ? "hover:bg-paper" : "opacity-40"}`}>
                <td className="px-5 py-2 text-ink-soft">
                  {formatINRCompact(slab.from)} – {slab.to ? formatINRCompact(slab.to) : "above"}
                </td>
                <td className="tabular px-5 py-2 text-right text-ink">{(slab.rate * 100).toFixed(0)}%</td>
                <td className={`tabular px-5 py-2 text-right font-medium ${slab.taxInSlab > 0 ? "text-deduction" : "text-ink-soft"}`}>
                  {formatINR(Math.round(slab.taxInSlab))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Final tally ── */}
      <div className="rounded-xl border border-rule bg-surface overflow-hidden">
        <div className="border-b border-rule bg-paper px-5 py-3">
          <p className="text-sm font-semibold text-ink">Final Tax Computation</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {[
              { label: "Tax on ordinary income (slab)", value: result.taxOnOrdinaryIncome },
              { label: "Tax on capital gains",          value: totalCGTax },
              ...(result.rebate87A > 0 ? [{ label: "Less: 87A rebate", value: -result.rebate87A }] : []),
              { label: "Surcharge",                     value: result.surcharge },
              { label: "Health & Education Cess (4%)",  value: result.cess },
            ].map((row, i) => (
              <tr key={i} className="border-b border-rule last:border-0 hover:bg-paper">
                <td className="px-5 py-2.5 text-ink-soft">{row.label}</td>
                <td className={`tabular px-5 py-2.5 text-right font-medium
                  ${row.value < 0 ? "text-brand" : "text-ink"}`}>
                  {row.value < 0 ? `− ${formatINR(Math.abs(row.value))}` : formatINR(row.value)}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-rule bg-paper">
              <td className="px-5 py-3 font-bold text-ink">Total Tax Payable</td>
              <td className="tabular px-5 py-3 text-right font-bold text-deduction text-lg">
                {formatINR(result.totalTaxPayable)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-ink-soft leading-relaxed">
        FY 2025-26 · Post Budget 2024 capital gains rules · LTCG exemption of ₹1.25L applies only
        to equity/equity MF. Property LTCG uses 12.5% without indexation (post Jul 23, 2024 purchases).
        Pre-2018 equity grandfathering not modelled. Consult a CA for ITR filing.
      </p>
    </div>
  );
}
