"use client";

import { useState, useMemo } from "react";
import {
  calculateIncomeTax,
  compareRegimes,
  NEW_REGIME_SLABS,
  OLD_REGIME_SLABS,
  STANDARD_DEDUCTION,
  getCurrentFY,
} from "@/lib/calculators/income-tax";
import { formatINR, formatNumberINR } from "@/lib/format";

const { fyLabel } = getCurrentFY();

// Deduction limits
const DEDUCTION_LIMITS = {
  sec80C: 150_000,
  sec80CCD1B: 50_000,   // NPS additional
  sec80D_self: 25_000,
  sec80D_parents: 50_000,
  sec80TTA: 10_000,     // Savings interest
  sec80EEA: 150_000,    // Home loan interest (affordable housing)
  hra: 0,               // dynamic
  homeLoanInterest: 200_000,
};

interface Deductions {
  sec80C: number;
  vpf: number;
  nps: number;
  sec80D_self: number;
  sec80D_parents: number;
  hra: number;
  homeLoanInterest: number;
  sec80TTA: number;
  otherDeductions: number;
}

export default function IncomeTaxCalculator({ defaultAnnualIncome = 1_000_000 }: { defaultAnnualIncome?: number }) {
  const [annualIncome, setAnnualIncome] = useState(defaultAnnualIncome);
  const [showDeductions, setShowDeductions] = useState(false);
  const [deductions, setDeductions] = useState<Deductions>({
    sec80C: 150_000,
    vpf: 0,
    nps: 0,
    sec80D_self: 25_000,
    sec80D_parents: 0,
    hra: 0,
    homeLoanInterest: 0,
    sec80TTA: 0,
    otherDeductions: 0,
  });

  const updateDeduction = (key: keyof Deductions, val: number) => {
    setDeductions(prev => ({ ...prev, [key]: val }));
  };

  const result = useMemo(() => {
    const totalOldDeductions =
      Math.min(deductions.sec80C + deductions.vpf, DEDUCTION_LIMITS.sec80C) +
      Math.min(deductions.nps, DEDUCTION_LIMITS.sec80CCD1B) +
      Math.min(deductions.sec80D_self, DEDUCTION_LIMITS.sec80D_self) +
      Math.min(deductions.sec80D_parents, DEDUCTION_LIMITS.sec80D_parents) +
      Math.min(deductions.hra, annualIncome * 0.5) +
      Math.min(deductions.homeLoanInterest, DEDUCTION_LIMITS.homeLoanInterest) +
      Math.min(deductions.sec80TTA, DEDUCTION_LIMITS.sec80TTA) +
      deductions.otherDeductions;

    const comparison = compareRegimes(annualIncome, totalOldDeductions);

    // Slab breakdown for bar chart
    const newSlabData = NEW_REGIME_SLABS.map(slab => {
      const taxable = comparison.new.taxableIncome;
      if (taxable <= slab.from) return { ...slab, taxInSlab: 0, incomeInSlab: 0 };
      const upper = slab.to === null ? taxable : Math.min(taxable, slab.to);
      const incomeInSlab = Math.max(0, upper - slab.from);
      return { ...slab, taxInSlab: Math.round(incomeInSlab * slab.rate), incomeInSlab };
    }).filter(s => s.incomeInSlab > 0);

    const oldSlabData = OLD_REGIME_SLABS.map(slab => {
      const taxable = comparison.old.taxableIncome;
      if (taxable <= slab.from) return { ...slab, taxInSlab: 0, incomeInSlab: 0 };
      const upper = slab.to === null ? taxable : Math.min(taxable, slab.to);
      const incomeInSlab = Math.max(0, upper - slab.from);
      return { ...slab, taxInSlab: Math.round(incomeInSlab * slab.rate), incomeInSlab };
    }).filter(s => s.incomeInSlab > 0);

    const effectiveRateNew = annualIncome > 0
      ? ((comparison.new.totalTaxPayable / annualIncome) * 100).toFixed(1)
      : "0.0";
    const effectiveRateOld = annualIncome > 0
      ? ((comparison.old.totalTaxPayable / annualIncome) * 100).toFixed(1)
      : "0.0";

    return { comparison, newSlabData, oldSlabData, totalOldDeductions, effectiveRateNew, effectiveRateOld };
  }, [annualIncome, deductions]);

  const { comparison, newSlabData, oldSlabData, totalOldDeductions, effectiveRateNew, effectiveRateOld } = result;
  const winner = comparison.betterRegime;

  return (
    <div className="space-y-8">

      {/* Income input */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">Annual Income Details</h2>
          <span className="text-xs text-ink-soft bg-paper border border-rule px-2 py-1 rounded-full">{fyLabel}</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Annual Income (Gross)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-ink-soft text-sm">₹</span>
              <input type="number" value={annualIncome} min={0} max={100_000_000} step={10000}
                onChange={e => setAnnualIncome(Number(e.target.value))}
                className="w-full rounded-lg border border-rule bg-paper pl-7 pr-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
            </div>
            <p className="text-xs text-ink-soft mt-1">
              Enter your gross annual salary / total income
            </p>
          </div>
          <div className="flex items-end">
            <div className="rounded-lg bg-paper border border-rule px-4 py-2.5 w-full">
              <p className="text-xs text-ink-soft">Monthly equivalent</p>
              <p className="tabular font-semibold text-ink">{formatINR(annualIncome / 12)}/month</p>
            </div>
          </div>
        </div>

        {/* Deductions toggle */}
        <button onClick={() => setShowDeductions(!showDeductions)}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-brand hover:underline">
          <span>{showDeductions ? "▼" : "▶"}</span>
          {showDeductions ? "Hide" : "Add"} deductions (for Old Regime comparison)
        </button>

        {showDeductions && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 border-t border-rule pt-4">
            {[
              { key: "sec80C", label: "80C Investments", sublabel: "ELSS, PPF, LIC, NSC etc.", max: 150_000 },
              { key: "vpf", label: "VPF Contribution", sublabel: "Voluntary Provident Fund", max: annualIncome },
              { key: "nps", label: "NPS (80CCD 1B)", sublabel: "Additional NPS contribution", max: 50_000 },
              { key: "sec80D_self", label: "Health Insurance (Self)", sublabel: "Section 80D — self & family", max: 25_000 },
              { key: "sec80D_parents", label: "Health Insurance (Parents)", sublabel: "Section 80D — parents", max: 50_000 },
              { key: "hra", label: "HRA Exemption", sublabel: "House rent allowance claimed", max: annualIncome },
              { key: "homeLoanInterest", label: "Home Loan Interest", sublabel: "Section 24B — max ₹2L", max: 200_000 },
              { key: "sec80TTA", label: "Savings Interest (80TTA)", sublabel: "Bank savings account", max: 10_000 },
              { key: "otherDeductions", label: "Other Deductions", sublabel: "80E, 80G, 80EE etc.", max: annualIncome },
            ].map(item => (
              <div key={item.key}>
                <label className="block text-xs font-medium text-ink mb-1">{item.label}</label>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-ink-soft text-xs">₹</span>
                  <input type="number" value={deductions[item.key as keyof Deductions]} min={0} max={item.max}
                    onChange={e => updateDeduction(item.key as keyof Deductions, Math.min(Number(e.target.value), item.max))}
                    className="w-full rounded-md border border-rule bg-paper pl-5 pr-2 py-1.5 text-xs text-ink focus:border-brand focus:outline-none" />
                </div>
                <p className="text-[10px] text-ink-soft mt-0.5">{item.sublabel}</p>
              </div>
            ))}
            <div className="col-span-full rounded-lg bg-brand-soft border border-brand/20 px-3 py-2">
              <p className="text-xs font-medium text-brand">
                Total Old Regime Deductions: {formatINR(totalOldDeductions)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Winner banner */}
      <div className={`rounded-xl border p-4 ${
        winner === "new"
          ? "border-brand/30 bg-brand-soft"
          : "border-orange-200 bg-orange-50"
      }`}>
        <p className="font-semibold text-ink">
          {winner === "new" ? "✅ New Tax Regime is better" : "✅ Old Tax Regime is better"} for you
        </p>
        <p className="text-sm text-ink-soft mt-1">
          You save <strong className="text-brand">{formatINR(comparison.savings)}</strong> per year
          by choosing the {winner === "new" ? "new" : "old"} regime.
        </p>
      </div>

      {/* Side by side comparison */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* New Regime */}
        <div className={`rounded-xl border p-5 space-y-3 ${winner === "new" ? "border-brand/30 bg-brand-soft" : "border-rule bg-surface"}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-brand">New Regime</h3>
            {winner === "new" && <span className="text-xs bg-brand text-white px-2 py-0.5 rounded-full">✓ Better</span>}
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: "Gross Income", value: formatINR(comparison.new.grossIncome) },
              { label: "Standard Deduction", value: `− ${formatINR(STANDARD_DEDUCTION.new)}` },
              { label: "Taxable Income", value: formatINR(comparison.new.taxableIncome) },
              { label: "Tax on Slabs", value: formatINR(comparison.new.taxBeforeRebate) },
              { label: "Rebate u/s 87A", value: comparison.new.rebate > 0 ? `− ${formatINR(comparison.new.rebate)}` : "Nil" },
              { label: "Surcharge", value: comparison.new.surcharge > 0 ? formatINR(comparison.new.surcharge) : "Nil" },
              { label: "Health & Ed. Cess (4%)", value: formatINR(comparison.new.cess) },
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span className="text-ink-soft">{row.label}</span>
                <span className="tabular font-medium text-ink">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-brand/20 pt-3 space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold text-ink">Total Tax</span>
              <span className="tabular font-display text-xl font-bold text-brand">{formatINR(comparison.new.totalTaxPayable)}</span>
            </div>
            <div className="flex justify-between text-xs text-ink-soft">
              <span>Effective rate</span>
              <span className="tabular">{effectiveRateNew}%</span>
            </div>
            <div className="flex justify-between text-xs text-ink-soft">
              <span>Monthly tax</span>
              <span className="tabular">{formatINR(comparison.new.totalTaxPayable / 12)}/mo</span>
            </div>
          </div>
        </div>

        {/* Old Regime */}
        <div className={`rounded-xl border p-5 space-y-3 ${winner === "old" ? "border-orange-200 bg-orange-50" : "border-rule bg-surface"}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-orange-700">Old Regime</h3>
            {winner === "old" && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">✓ Better</span>}
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: "Gross Income", value: formatINR(comparison.old.grossIncome) },
              { label: "Standard Deduction", value: `− ${formatINR(STANDARD_DEDUCTION.old)}` },
              { label: "Other Deductions", value: totalOldDeductions > 0 ? `− ${formatINR(totalOldDeductions)}` : "None added" },
              { label: "Taxable Income", value: formatINR(comparison.old.taxableIncome) },
              { label: "Tax on Slabs", value: formatINR(comparison.old.taxBeforeRebate) },
              { label: "Rebate u/s 87A", value: comparison.old.rebate > 0 ? `− ${formatINR(comparison.old.rebate)}` : "Nil" },
              { label: "Health & Ed. Cess (4%)", value: formatINR(comparison.old.cess) },
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span className="text-ink-soft">{row.label}</span>
                <span className="tabular font-medium text-ink">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-orange-200 pt-3 space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold text-ink">Total Tax</span>
              <span className="tabular font-display text-xl font-bold text-orange-700">{formatINR(comparison.old.totalTaxPayable)}</span>
            </div>
            <div className="flex justify-between text-xs text-ink-soft">
              <span>Effective rate</span>
              <span className="tabular">{effectiveRateOld}%</span>
            </div>
            <div className="flex justify-between text-xs text-ink-soft">
              <span>Monthly tax</span>
              <span className="tabular">{formatINR(comparison.old.totalTaxPayable / 12)}/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bar chart comparison */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-4">Tax Comparison Chart</h3>
        <div className="space-y-4">
          {[
            { label: "New Regime Tax", value: comparison.new.totalTaxPayable, color: "bg-brand", textColor: "text-brand" },
            { label: "Old Regime Tax", value: comparison.old.totalTaxPayable, color: "bg-orange-400", textColor: "text-orange-600" },
            { label: "Your Annual Income", value: annualIncome, color: "bg-ink/20", textColor: "text-ink-soft" },
          ].map(item => {
            const pct = Math.min(100, Math.round((item.value / annualIncome) * 100));
            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ink-soft">{item.label}</span>
                  <span className={`tabular font-semibold ${item.textColor}`}>{formatINR(item.value)}</span>
                </div>
                <div className="h-6 w-full rounded-full bg-paper overflow-hidden border border-rule">
                  <div className={`h-6 rounded-full ${item.color} transition-all duration-500 flex items-center pl-2`}
                    style={{ width: `${Math.max(pct, 2)}%` }}>
                    {pct >= 8 && <span className="text-[10px] text-white font-medium">{pct}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slab breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* New regime slabs */}
        <div className="rounded-xl border border-rule bg-surface p-5">
          <h3 className="font-semibold text-ink mb-3">New Regime — Slab Breakdown</h3>
          <div className="overflow-hidden rounded-lg border border-rule">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-rule bg-paper text-left">
                  <th className="px-3 py-2 font-medium text-ink-soft">Income Slab</th>
                  <th className="px-3 py-2 font-medium text-ink-soft">Rate</th>
                  <th className="px-3 py-2 text-right font-medium text-brand">Tax</th>
                </tr>
              </thead>
              <tbody>
                {NEW_REGIME_SLABS.map((slab, i) => {
                  const taxable = comparison.new.taxableIncome;
                  const upper = slab.to === null ? taxable : Math.min(taxable, slab.to);
                  const incomeInSlab = Math.max(0, upper - slab.from);
                  const taxInSlab = Math.round(incomeInSlab * slab.rate);
                  const isActive = incomeInSlab > 0;
                  return (
                    <tr key={i} className={`border-b border-rule last:border-0 ${isActive ? "" : "opacity-40"}`}>
                      <td className="px-3 py-2 text-ink-soft">
                        {formatNumberINR(slab.from)} – {slab.to ? formatNumberINR(slab.to) : "above"}
                      </td>
                      <td className="px-3 py-2 font-medium text-ink">{(slab.rate * 100).toFixed(0)}%</td>
                      <td className="tabular px-3 py-2 text-right text-brand font-medium">
                        {isActive ? formatINR(taxInSlab) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Old regime slabs */}
        <div className="rounded-xl border border-rule bg-surface p-5">
          <h3 className="font-semibold text-ink mb-3">Old Regime — Slab Breakdown</h3>
          <div className="overflow-hidden rounded-lg border border-rule">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-rule bg-paper text-left">
                  <th className="px-3 py-2 font-medium text-ink-soft">Income Slab</th>
                  <th className="px-3 py-2 font-medium text-ink-soft">Rate</th>
                  <th className="px-3 py-2 text-right font-medium text-orange-600">Tax</th>
                </tr>
              </thead>
              <tbody>
                {OLD_REGIME_SLABS.map((slab, i) => {
                  const taxable = comparison.old.taxableIncome;
                  const upper = slab.to === null ? taxable : Math.min(taxable, slab.to);
                  const incomeInSlab = Math.max(0, upper - slab.from);
                  const taxInSlab = Math.round(incomeInSlab * slab.rate);
                  const isActive = incomeInSlab > 0;
                  return (
                    <tr key={i} className={`border-b border-rule last:border-0 ${isActive ? "" : "opacity-40"}`}>
                      <td className="px-3 py-2 text-ink-soft">
                        {formatNumberINR(slab.from)} – {slab.to ? formatNumberINR(slab.to) : "above"}
                      </td>
                      <td className="px-3 py-2 font-medium text-ink">{(slab.rate * 100).toFixed(0)}%</td>
                      <td className="tabular px-3 py-2 text-right text-orange-600 font-medium">
                        {isActive ? formatINR(taxInSlab) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Monthly TDS */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-3">Monthly TDS Deduction</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "New Regime", monthly: comparison.new.totalTaxPayable / 12, color: "text-brand" },
            { label: "Old Regime", monthly: comparison.old.totalTaxPayable / 12, color: "text-orange-600" },
          ].map(item => (
            <div key={item.label} className="rounded-lg border border-rule bg-paper p-3">
              <p className="text-xs text-ink-soft">{item.label} — Monthly TDS</p>
              <p className={`tabular font-display text-xl font-bold mt-1 ${item.color}`}>
                {formatINR(item.monthly)}
              </p>
              <p className="text-xs text-ink-soft mt-0.5">per month deducted from salary</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
