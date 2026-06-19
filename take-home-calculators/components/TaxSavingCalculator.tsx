"use client";

// take-home-calculators/components/TaxSavingCalculator.tsx

import { useMemo, useState } from "react";
import { calculateTaxSaving } from "@/lib/calculators/tax-saving";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

interface TaxSavingCalculatorProps {
  initialAnnualCtc?: number;
}

export default function TaxSavingCalculator({
  initialAnnualCtc = 1_000_000,
}: TaxSavingCalculatorProps) {
  const [ctcInput, setCtcInput] = useState(String(initialAnnualCtc));
  const [cityType, setCityType] = useState<"metro" | "non_metro">("non_metro");
  const [rentInput, setRentInput] = useState("0");
  const [showAll, setShowAll] = useState(false);

  const annualCtc = Math.max(0, Number(ctcInput.replace(/[^0-9.]/g, "")) || 0);
  const rentPaidMonthly = Math.max(0, Number(rentInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () =>
      calculateTaxSaving({
        annualCtc,
        cityType,
        rentPaidMonthly,
      }),
    [annualCtc, cityType, rentPaidMonthly]
  );

  const visibleOpportunities = showAll
    ? result.opportunities
    : result.opportunities.filter((o) => o.priority !== "low");

  const shareText = `At ${formatINR(annualCtc)} CTC, I can save up to ${formatINR(result.maxPossibleSaving)} in taxes. Check yours:`;

  const categoryColors: Record<string, string> = {
    investment: "bg-brand-soft text-brand",
    insurance: "bg-blue-50 text-blue-700",
    housing: "bg-amber-50 text-amber-700",
    pension: "bg-purple-50 text-purple-700",
    other: "bg-paper text-ink-soft",
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Inputs */}
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">
            Annual CTC
          </span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={ctcInput}
              onChange={(e) => setCtcInput(e.target.value)}
              className="tabular w-full bg-transparent text-base font-medium text-ink outline-none"
            />
          </div>
        </label>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <span className="mb-1.5 block text-xs text-ink-soft">City type (for HRA)</span>
            <div className="flex gap-2">
              <RadioPill
                label="Metro"
                active={cityType === "metro"}
                onClick={() => setCityType("metro")}
              />
              <RadioPill
                label="Non-metro"
                active={cityType === "non_metro"}
                onClick={() => setCityType("non_metro")}
              />
            </div>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Rent paid (monthly)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-sm text-ink-soft">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={rentInput}
                onChange={(e) => setRentInput(e.target.value)}
                placeholder="0"
                className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none"
              />
            </div>
          </label>
        </div>
      </div>

      {/* Tax Summary Card */}
      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            Maximum Tax You Can Save
          </p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.maxPossibleSaving)}
          </div>
          <p className="tabular mt-1 text-sm text-white/70">
            by switching to old regime + claiming all deductions
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {/* Current Tax Comparison */}
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">
            Current Tax Liability
          </h3>
          <div className="overflow-hidden rounded-lg border border-rule">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper text-left">
                  <th className="px-3 py-2 font-medium text-ink-soft">Regime</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-soft">Tax Payable</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-soft">Eff. Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  className={`border-b border-rule ${
                    result.recommendedRegime === "new" ? "bg-brand-soft" : ""
                  }`}
                >
                  <td className="px-3 py-2.5 text-ink">
                    New Regime
                    {result.recommendedRegime === "new" && (
                      <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-xs font-medium text-white">
                        Better
                      </span>
                    )}
                  </td>
                  <td className="tabular px-3 py-2.5 text-right font-medium text-ink">
                    {formatINR(result.currentTaxNew)}
                  </td>
                  <td className="tabular px-3 py-2.5 text-right text-ink-soft">
                    {result.effectiveTaxRateNew.toFixed(1)}%
                  </td>
                </tr>
                <tr
                  className={
                    result.recommendedRegime === "old" ? "bg-brand-soft" : ""
                  }
                >
                  <td className="px-3 py-2.5 text-ink">
                    Old Regime (no deductions)
                    {result.recommendedRegime === "old" && (
                      <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-xs font-medium text-white">
                        Better
                      </span>
                    )}
                  </td>
                  <td className="tabular px-3 py-2.5 text-right font-medium text-ink">
                    {formatINR(result.currentTaxOld)}
                  </td>
                  <td className="tabular px-3 py-2.5 text-right text-ink-soft">
                    {result.effectiveTaxRateOld.toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Marginal rates */}
          <div className="mt-4 flex gap-3">
            <div className="flex-1 rounded-lg bg-paper px-3 py-2.5 text-center">
              <p className="text-xs text-ink-soft">Marginal rate (New)</p>
              <p className="mt-0.5 font-display text-lg font-semibold text-brand">
                {result.marginalSlabNew}%
              </p>
            </div>
            <div className="flex-1 rounded-lg bg-paper px-3 py-2.5 text-center">
              <p className="text-xs text-ink-soft">Marginal rate (Old)</p>
              <p className="mt-0.5 font-display text-lg font-semibold text-brand">
                {result.marginalSlabOld}%
              </p>
            </div>
            <div className="flex-1 rounded-lg bg-paper px-3 py-2.5 text-center">
              <p className="text-xs text-ink-soft">Break-even deductions</p>
              <p className="mt-0.5 font-display text-lg font-semibold text-ink">
                {result.breakEvenDeductions > 0
                  ? formatINR(result.breakEvenDeductions)
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Best-case scenario */}
          {result.maxPossibleSaving > 0 && (
            <div className="mt-4 rounded-lg border border-brand/20 bg-brand-soft px-4 py-3">
              <p className="text-sm font-medium text-brand">
                Best case: claim all deductions → pay only{" "}
                {formatINR(result.taxAfterAllDeductions)} in tax (saving{" "}
                {formatINR(result.maxPossibleSaving)} vs. new regime)
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                Requires ₹80C + NPS + health insurance + HRA + home loan deductions
              </p>
            </div>
          )}
        </div>
      </div>

      <CalculatorActions shareTitle="My tax saving opportunities" shareText={shareText} />

      {/* Tax Saving Opportunities */}
      <div className="mt-8">
        <h2 className="font-display text-xl text-ink">Tax Saving Opportunities</h2>
        <p className="mt-2 text-sm text-ink-soft">
          All deductions below are only available under the old tax regime. The new regime doesn't allow
          these but offers lower slab rates instead.
        </p>

        <div className="mt-4 space-y-3">
          {visibleOpportunities.map((opp) => (
            <div
              key={opp.section}
              className="rounded-xl border border-rule bg-surface p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        categoryColors[opp.category] || "bg-paper text-ink-soft"
                      }`}
                    >
                      {opp.section}
                    </span>
                    {opp.priority === "high" && (
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                        High Impact
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1.5 font-medium text-ink">{opp.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{opp.description}</p>
                </div>
                {opp.maxDeduction > 0 && (
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-ink-soft">Max deduction</p>
                    <p className="tabular font-semibold text-ink">
                      {formatINR(opp.maxDeduction)}
                    </p>
                    {opp.taxSavedAtSlab > 0 && (
                      <>
                        <p className="mt-1 text-xs text-ink-soft">Tax saved</p>
                        <p className="tabular text-sm font-medium text-brand">
                          up to {formatINR(opp.taxSavedAtSlab)}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {result.opportunities.length > visibleOpportunities.length && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="mt-4 text-sm font-medium text-brand underline-offset-2 hover:underline"
          >
            Show {result.opportunities.length - visibleOpportunities.length} more deductions
          </button>
        )}
      </div>
    </div>
  );
}

function RadioPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-brand text-white"
          : "border border-rule text-ink-soft hover:border-brand hover:text-brand"
      }`}
    >
      {label}
    </button>
  );
}
