"use client";

import { useMemo, useState } from "react";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import type { TaxRegime } from "@/lib/calculators/income-tax";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function SalaryStructureCalculator() {
  const [ctcInput, setCtcInput] = useState("1200000");
  const [basicPctInput, setBasicPctInput] = useState("40");
  const [hraPctInput, setHraPctInput] = useState("50");
  const [regime, setRegime] = useState<TaxRegime>("new");

  const annualCtc = Math.max(0, Number(ctcInput.replace(/[^0-9.]/g, "")) || 0);
  const basicPct = Math.min(100, Math.max(10, Number(basicPctInput) || 40));
  const hraPct = Math.min(100, Math.max(0, Number(hraPctInput) || 50));

  const result = useMemo(() => calculateSalaryBreakup({ annualCtc, regime, basicPercentOfCtc: basicPct / 100, hraPercentOfBasic: hraPct / 100 }), [annualCtc, regime, basicPct, hraPct]);

  const components = [
    { label: "Basic Salary", monthly: result.basicMonthly, annual: result.basicAnnual },
    { label: "HRA", monthly: result.hraMonthly, annual: result.hraAnnual },
    { label: "Special Allowance", monthly: result.specialAllowanceMonthly, annual: result.specialAllowanceAnnual },
    { label: "Employer PF", monthly: result.employerPfMonthly, annual: result.employerPfAnnual },
    { label: "Gratuity", monthly: result.gratuityMonthly, annual: result.gratuityAnnual },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Annual CTC</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input type="text" inputMode="numeric" value={ctcInput} onChange={(e) => setCtcInput(e.target.value)} className="tabular w-full bg-transparent text-base font-medium text-ink outline-none" />
          </div>
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Basic as % of CTC: {basicPct}%</span>
            <input type="range" min={20} max={60} step={1} value={basicPct} onChange={(e) => setBasicPctInput(e.target.value)} className="w-full accent-[var(--brand)]" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">HRA as % of Basic: {hraPct}%</span>
            <input type="range" min={0} max={100} step={5} value={hraPct} onChange={(e) => setHraPctInput(e.target.value)} className="w-full accent-[var(--brand)]" />
          </label>
        </div>
        <fieldset className="mt-4">
          <legend className="mb-1.5 text-xs text-ink-soft">Tax regime</legend>
          <div className="flex gap-2">
            <button type="button" onClick={() => setRegime("new")} className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${regime === "new" ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand"}`}>New</button>
            <button type="button" onClick={() => setRegime("old")} className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${regime === "old" ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand"}`}>Old</button>
          </div>
        </fieldset>
      </div>
      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">In-Hand Salary</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="tabular font-display text-4xl font-semibold text-white sm:text-5xl">{formatINR(result.inHandMonthly)}</span>
            <span className="text-base font-normal text-white/70">/month</span>
          </div>
        </div>
        <div className="px-6 py-6 sm:px-8">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">CTC Breakdown</h3>
          <div className="overflow-x-auto rounded-lg border border-rule">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-rule bg-paper text-left"><th className="px-3 py-2 font-medium text-ink-soft">Component</th><th className="px-3 py-2 text-right font-medium text-ink-soft">Monthly</th><th className="px-3 py-2 text-right font-medium text-ink-soft">Annual</th></tr></thead>
              <tbody>
                {components.map((c) => (<tr key={c.label} className="border-b border-rule last:border-0"><td className="px-3 py-2 text-ink">{c.label}</td><td className="tabular px-3 py-2 text-right text-ink">{formatINR(c.monthly)}</td><td className="tabular px-3 py-2 text-right text-ink">{formatINR(c.annual)}</td></tr>))}
                <tr className="bg-brand-soft"><td className="px-3 py-2 font-semibold text-brand">Total CTC</td><td className="tabular px-3 py-2 text-right font-semibold text-brand">{formatINR(result.monthlyCtc)}</td><td className="tabular px-3 py-2 text-right font-semibold text-brand">{formatINR(result.annualCtc)}</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-deduction">Deductions</h3>
          <LineRow label="Employee PF" value={result.employeePfMonthly} deduction />
          <LineRow label="Income Tax (TDS)" value={result.incomeTaxMonthly} deduction />
          {result.professionalTaxMonthly > 0 && <LineRow label="Professional Tax" value={result.professionalTaxMonthly} deduction />}
        </div>
      </div>
      <CalculatorActions shareTitle="Salary structure" shareText={`My CTC of ${formatINR(annualCtc)} with ${basicPct}% basic gives ${formatINR(result.inHandMonthly)}/month in-hand.`} />
    </div>
  );
}

function LineRow({ label, value, deduction = false }: { label: string; value: number; deduction?: boolean }) {
  return (<div className="flex items-baseline justify-between border-b border-dashed border-rule py-1.5"><span className="text-sm text-ink-soft">{label}</span><span className={`tabular text-sm ${deduction ? "text-deduction" : "text-ink"}`}>{formatINR(value)}</span></div>);
}
