"use client";
import { useState, useMemo } from "react";
import {
  calculateFreelancerTax,
  type FreelancerInput,
  type TaxMethod,
} from "@/lib/calculators/freelancer-tax";
import { formatINR, formatINRCompact } from "@/lib/format";

type Regime = "new" | "old";
function n(s: string) { return Number(s.replace(/[^0-9.]/g, "")) || 0; }
function pct(r: number) { return r.toFixed(2) + "%"; }

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
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
      <span className="shrink-0 text-sm text-ink-soft">₹</span>
      <input type="text" inputMode="numeric" value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-soft/40" />
    </div>
  );
}

function SectionBox({ emoji, title, sub, children }: {
  emoji: string; title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-rule bg-surface p-5">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-rule">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-lg">{emoji}</span>
        <div>
          <p className="font-semibold text-ink">{title}</p>
          {sub && <p className="text-xs text-ink-soft">{sub}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function FreelancerTaxCalculator() {
  const [regime, setRegime] = useState<Regime>("new");
  const [method, setMethod] = useState<TaxMethod>("presumptive_44ADA");

  // Income
  const [grossReceipts, setGrossReceipts]   = useState("2400000");
  const [tdsDeducted, setTdsDeducted]       = useState("240000");
  const [otherIncome, setOtherIncome]       = useState("0");

  // Expenses
  const [exp, setExp] = useState({
    internet:     "24000",
    phone:        "12000",
    laptop:       "33000",
    coworking:    "60000",
    software:     "24000",
    travel:       "30000",
    professional: "15000",
    marketing:    "12000",
    other:        "0",
  });
  const setE = (k: keyof typeof exp) => (v: string) => setExp(p => ({ ...p, [k]: v }));

  // Deductions
  const [ded, setDed] = useState({ section80C: "150000", section80D: "25000", nps80CCD: "50000", otherDeductions: "0" });
  const setD = (k: keyof typeof ded) => (v: string) => setDed(p => ({ ...p, [k]: v }));

  const result = useMemo(() => {
    const input: FreelancerInput = {
      grossReceipts: n(grossReceipts),
      tdsDeducted:   n(tdsDeducted),
      otherIncome:   n(otherIncome),
      method,
      businessExpenses: {
        internet:     n(exp.internet),
        phone:        n(exp.phone),
        laptop:       n(exp.laptop),
        coworking:    n(exp.coworking),
        software:     n(exp.software),
        travel:       n(exp.travel),
        professional: n(exp.professional),
        marketing:    n(exp.marketing),
        other:        n(exp.other),
      },
      regime,
      deductions: {
        section80C:      n(ded.section80C),
        section80D:      n(ded.section80D),
        nps80CCD:        n(ded.nps80CCD),
        otherDeductions: n(ded.otherDeductions),
      },
    };
    return calculateFreelancerTax(input);
  }, [grossReceipts, tdsDeducted, otherIncome, method, exp, ded, regime]);

  const expenseTotal = Object.values(exp).reduce((s, v) => s + n(v), 0);

  return (
    <div className="space-y-6">

      {/* Regime */}
      <div className="flex gap-1 rounded-xl border border-rule bg-paper p-1">
        {(["new", "old"] as Regime[]).map(r => (
          <button key={r} onClick={() => setRegime(r)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              regime === r ? "bg-brand text-white shadow-card" : "text-ink-soft hover:text-ink"}`}>
            {r === "new" ? "New Regime" : "Old Regime"}
          </button>
        ))}
      </div>

      {/* Method */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            value: "presumptive_44ADA" as TaxMethod,
            emoji: "⚡",
            title: "Presumptive (44ADA)",
            desc: "50% of gross receipts = taxable profit. No books needed. Best when actual expenses < 50% of receipts.",
          },
          {
            value: "actual_expenses" as TaxMethod,
            emoji: "📋",
            title: "Actual Expenses",
            desc: "Deduct real business expenses. Requires books of accounts. Best when expenses > 50% of receipts.",
          },
        ].map(opt => (
          <button key={opt.value} onClick={() => setMethod(opt.value)}
            className={`rounded-xl border p-4 text-left transition ${
              method === opt.value
                ? "border-brand bg-brand-soft ring-2 ring-brand/20"
                : "border-rule bg-surface hover:border-brand/40"}`}>
            <p className="text-xl mb-2">{opt.emoji}</p>
            <p className={`font-semibold text-sm ${method === opt.value ? "text-brand" : "text-ink"}`}>{opt.title}</p>
            <p className="text-xs text-ink-soft mt-1 leading-relaxed">{opt.desc}</p>
          </button>
        ))}
      </div>

      {/* Income */}
      <SectionBox emoji="💰" title="Income" sub="Annual figures">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Gross Receipts / Billing" hint="Total invoiced to all clients this year">
            <AmtInput value={grossReceipts} onChange={setGrossReceipts} />
          </Field>
          <Field label="TDS Already Deducted" hint="Total TDS cut by clients — check Form 26AS">
            <AmtInput value={tdsDeducted} onChange={setTdsDeducted} />
          </Field>
          <Field label="Other Income" hint="Interest, rent, dividends, part-time salary">
            <AmtInput value={otherIncome} onChange={setOtherIncome} />
          </Field>
        </div>
        {n(grossReceipts) > 7_500_000 && (
          <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-xs text-orange-700">
            ⚠️ Gross receipts exceed ₹75L — Section 44ADA presumptive scheme is not available. Use actual expenses method.
          </div>
        )}
      </SectionBox>

      {/* Expenses (actual method only) */}
      {method === "actual_expenses" && (
        <SectionBox emoji="🧾" title="Business Expenses" sub="Only deductible business expenses — not personal">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: "internet" as const,     label: "Internet & Broadband",   hint: "Monthly bill × 12" },
              { key: "phone" as const,         label: "Phone / Mobile Bill",    hint: "Business use portion" },
              { key: "laptop" as const,        label: "Laptop Depreciation",    hint: "~33% of laptop cost per year" },
              { key: "coworking" as const,     label: "Office / Coworking",     hint: "Desk, coworking memberships" },
              { key: "software" as const,      label: "Software & Subscriptions",hint: "Figma, GitHub, tools etc." },
              { key: "travel" as const,        label: "Business Travel",        hint: "Client meetings, conferences" },
              { key: "professional" as const,  label: "Professional Fees",      hint: "CA, legal, accountant fees" },
              { key: "marketing" as const,     label: "Marketing & Ads",        hint: "LinkedIn, Google Ads, etc." },
              { key: "other" as const,         label: "Other Business Expenses",hint: "Books, training, misc" },
            ].map(f => (
              <Field key={f.key} label={f.label} hint={f.hint}>
                <AmtInput value={exp[f.key]} onChange={setE(f.key)} />
              </Field>
            ))}
          </div>
          <div className="mt-3 flex justify-between rounded-lg border border-rule bg-paper px-4 py-2.5 text-sm">
            <span className="text-ink-soft">Total business expenses</span>
            <span className="tabular font-semibold text-ink">{formatINR(expenseTotal)}</span>
          </div>
        </SectionBox>
      )}

      {/* Deductions (old regime) */}
      {regime === "old" && (
        <SectionBox emoji="📋" title="Deductions" sub="Old regime only — caps applied automatically">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="80C" hint="PPF, ELSS, LIC — max ₹1.5L"><AmtInput value={ded.section80C} onChange={setD("section80C")} /></Field>
            <Field label="80D Health Insurance" hint="Max ₹25K self + ₹50K parents"><AmtInput value={ded.section80D} onChange={setD("section80D")} /></Field>
            <Field label="NPS 80CCD(1B)" hint="Max ₹50K additional"><AmtInput value={ded.nps80CCD} onChange={setD("nps80CCD")} /></Field>
            <Field label="Other (80G, 80TTA etc.)"><AmtInput value={ded.otherDeductions} onChange={setD("otherDeductions")} /></Field>
          </div>
        </SectionBox>
      )}

      {/* Method comparison banner */}
      {result.betterMethod !== "same" && result.taxSavingByBetterMethod > 0 && (
        <div className={`rounded-xl border p-4 ${
          result.betterMethod === method
            ? "border-brand/20 bg-brand-soft"
            : "border-orange-200 bg-orange-50"}`}>
          <p className={`font-semibold text-sm ${result.betterMethod === method ? "text-brand" : "text-orange-700"}`}>
            {result.betterMethod === method
              ? `✓ You're using the better method — saving ${formatINR(result.taxSavingByBetterMethod)} in tax`
              : `⚡ Switch to ${result.betterMethod === "presumptive_44ADA" ? "Presumptive (44ADA)" : "Actual Expenses"} to save ${formatINR(result.taxSavingByBetterMethod)} in tax`}
          </p>
          <p className="text-xs text-ink-soft mt-1">
            {result.betterMethod === "presumptive_44ADA"
              ? "Your actual expenses are less than 50% of gross receipts — 44ADA gives you a higher deemed profit deduction."
              : "Your actual expenses exceed 50% of gross receipts — claiming real expenses gives lower taxable profit."}
          </p>
          {result.betterMethod !== method && (
            <button onClick={() => setMethod(result.betterMethod as TaxMethod)}
              className="mt-2 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition">
              Switch to {result.betterMethod === "presumptive_44ADA" ? "44ADA" : "Actual Expenses"} →
            </button>
          )}
        </div>
      )}

      {/* GST warning */}
      {result.gstRequired && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-4">
          <p className="font-semibold text-orange-700 text-sm">⚠️ GST Registration Required</p>
          <p className="text-xs text-orange-600 mt-1">
            Your gross receipts of {formatINRCompact(result.grossReceipts)} exceed the GST threshold of ₹20L.
            You must register for GST and charge 18% GST on your invoices (or 0% for export of services).
            GST paid on business expenses (input tax credit) can be claimed.
          </p>
        </div>
      )}

      {/* Main result */}
      <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-soft to-paper shadow-card-lg overflow-hidden">
        <div className="px-6 py-6 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Total Tax Payable</p>
          <p className="font-display text-5xl font-bold text-brand mt-1">{formatINR(result.totalTaxPayable)}</p>
          <p className="text-sm text-ink-soft mt-1">
            Effective rate: {pct(result.effectiveRate)} · Marginal rate: {pct(result.marginalRate)}
            {result.rebate87A > 0 && ` · 87A rebate: ${formatINR(result.rebate87A)}`}
          </p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-rule border-t border-rule sm:grid-cols-4">
          {[
            { label: "Gross Receipts",   value: formatINRCompact(result.grossReceipts) },
            { label: "Taxable Profit",   value: formatINRCompact(result.businessProfit), sub: method === "presumptive_44ADA" ? "50% deemed" : "after expenses" },
            { label: "TDS Credit",       value: formatINR(result.tdsDeducted) },
            { label: "Net Tax to Pay",   value: formatINR(result.netTaxPayable), highlight: true },
          ].map(card => (
            <div key={card.label} className="px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{card.label}</p>
              <p className={`tabular font-display text-lg font-semibold mt-0.5 ${card.highlight ? "text-deduction" : "text-ink"}`}>{card.value}</p>
              {card.sub && <p className="text-[10px] text-ink-soft">{card.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Income computation */}
      <div className="rounded-xl border border-rule bg-surface overflow-hidden">
        <div className="border-b border-rule bg-paper px-5 py-3">
          <p className="text-sm font-semibold text-ink">Income Computation</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {[
              { label: "Gross Receipts",            value: result.grossReceipts },
              method === "presumptive_44ADA"
                ? { label: "Less: Deemed Expenses (50% under 44ADA)", value: result.grossReceipts - result.businessProfit, deduct: true }
                : { label: "Less: Actual Business Expenses", value: result.totalExpenses, deduct: true },
              { label: "Business Profit",            value: result.businessProfit, bold: true },
              ...(result.otherIncome > 0 ? [{ label: "Add: Other Income", value: result.otherIncome }] : []),
              { label: "Total Gross Income",         value: result.totalGrossIncome, bold: true },
              ...(result.totalDeductions > 0 ? [{ label: "Less: Deductions", value: result.totalDeductions, deduct: true }] : []),
              { label: "Taxable Income",             value: result.taxableIncome, bold: true },
            ].filter(Boolean).map((row: any, i) => (
              <tr key={i} className="border-b border-rule last:border-0 hover:bg-paper">
                <td className={`px-5 py-2.5 ${row.deduct ? "pl-8 text-ink-soft" : ""} ${row.bold ? "font-semibold text-ink" : "text-ink-soft"}`}>
                  {row.label}
                </td>
                <td className={`tabular px-5 py-2.5 text-right font-medium ${row.deduct ? "text-deduction" : "text-ink"}`}>
                  {row.deduct ? `− ${formatINR(row.value)}` : formatINR(row.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tax computation */}
      <div className="rounded-xl border border-rule bg-surface overflow-hidden">
        <div className="border-b border-rule bg-paper px-5 py-3">
          <p className="text-sm font-semibold text-ink">Tax Computation</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {[
              { label: "Tax on taxable income (slab)", value: result.taxBeforeRebate },
              ...(result.rebate87A > 0 ? [{ label: "Less: 87A Rebate", value: result.rebate87A, deduct: true }] : []),
              ...(result.surcharge > 0 ? [{ label: "Surcharge", value: result.surcharge }] : []),
              { label: "Health & Education Cess (4%)", value: result.cess },
              { label: "Total Tax Payable",            value: result.totalTaxPayable, bold: true },
              { label: "Less: TDS Credit (from 26AS)", value: result.tdsDeducted, deduct: true },
              { label: "Net Tax Payable / Refund",     value: result.netTaxPayable, bold: true, highlight: true },
            ].map((row: any, i) => (
              <tr key={i} className="border-b border-rule last:border-0 hover:bg-paper">
                <td className={`px-5 py-2.5 ${row.deduct ? "pl-8" : ""} ${row.bold ? "font-semibold text-ink" : "text-ink-soft"}`}>
                  {row.label}
                </td>
                <td className={`tabular px-5 py-2.5 text-right font-medium ${
                  row.deduct ? "text-brand" : row.highlight ? "text-deduction" : "text-ink"}`}>
                  {row.deduct ? `− ${formatINR(row.value)}` : formatINR(row.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slab breakdown */}
      <div className="rounded-xl border border-rule bg-surface overflow-hidden">
        <div className="border-b border-rule bg-paper px-5 py-3">
          <p className="text-sm font-semibold text-ink">Tax Slab Breakdown</p>
          <p className="text-xs text-ink-soft mt-0.5">On taxable income of {formatINR(result.taxableIncome)}</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule bg-paper text-left">
              <th className="px-5 py-2 font-medium text-ink-soft">Slab</th>
              <th className="px-5 py-2 text-right font-medium text-ink-soft">Rate</th>
              <th className="px-5 py-2 text-right font-medium text-ink-soft">Tax</th>
            </tr>
          </thead>
          <tbody>
            {result.slabBreakdown.map((slab, i) => (
              <tr key={i} className={`border-b border-rule last:border-0 ${slab.taxInSlab > 0 ? "hover:bg-paper" : "opacity-40"}`}>
                <td className="px-5 py-2 text-ink-soft">
                  {formatINR(slab.from)} – {slab.to ? formatINR(slab.to) : "above"}
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

      {/* Advance tax */}
      {result.advanceTaxInstallments.length > 0 && (
        <div className="rounded-xl border border-rule bg-surface overflow-hidden">
          <div className="border-b border-rule bg-paper px-5 py-3">
            <p className="text-sm font-semibold text-ink">Advance Tax Schedule</p>
            <p className="text-xs text-ink-soft mt-0.5">
              Net tax payable of {formatINR(result.netTaxPayable)} exceeds ₹10,000 — advance tax required
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-5 py-2 font-medium text-ink-soft">Due Date</th>
                <th className="px-5 py-2 text-right font-medium text-ink-soft">% Due</th>
                <th className="px-5 py-2 text-right font-medium text-ink-soft">Installment</th>
                <th className="px-5 py-2 text-right font-medium text-ink-soft">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {result.advanceTaxInstallments.map((inst, i) => (
                <tr key={i} className="border-b border-rule last:border-0 hover:bg-paper">
                  <td className="px-5 py-2.5 font-medium text-ink">{inst.dueDate}</td>
                  <td className="tabular px-5 py-2.5 text-right text-ink-soft">{inst.percentage}%</td>
                  <td className="tabular px-5 py-2.5 text-right font-semibold text-brand">{formatINR(inst.installmentAmount)}</td>
                  <td className="tabular px-5 py-2.5 text-right text-ink-soft">{formatINR(inst.cumulativeAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-rule bg-paper text-xs text-ink-soft">
            Missing advance tax deadlines attracts interest under Section 234B (1%/month) and 234C (1%/month per installment).
          </div>
        </div>
      )}

      <p className="text-xs text-ink-soft leading-relaxed">
        FY 2025-26 · Section 44ADA applies to professionals (doctors, lawyers, engineers, CA, architects,
        designers, IT consultants) with gross receipts up to ₹75L. Maintain books of accounts if opting
        for actual expenses method. Consult a CA for ITR-3/ITR-4 filing.
      </p>
    </div>
  );
}
