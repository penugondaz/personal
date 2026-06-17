"use client";

import { useMemo, useState } from "react";
import { calculateNps, NPS_MIN_ANNUITY_PERCENT } from "@/lib/calculators/nps";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function NpsCalculator() {
  const [ageInput, setAgeInput] = useState("30");
  const [retirementAgeInput, setRetirementAgeInput] = useState("60");
  const [monthlyInput, setMonthlyInput] = useState("5000");
  const [returnInput, setReturnInput] = useState("10");
  const [annuityPercentInput, setAnnuityPercentInput] = useState(String(NPS_MIN_ANNUITY_PERCENT));
  const [annuityRateInput, setAnnuityRateInput] = useState("6");

  const currentAge = Math.max(18, Number(ageInput.replace(/[^0-9.]/g, "")) || 18);
  const retirementAge = Math.max(currentAge + 1, Number(retirementAgeInput.replace(/[^0-9.]/g, "")) || 60);
  const monthlyContribution = Math.max(0, Number(monthlyInput.replace(/[^0-9.]/g, "")) || 0);
  const expectedAnnualReturn = Math.max(0, Number(returnInput.replace(/[^0-9.]/g, "")) || 0);
  const annuityPurchasePercent = Math.min(
    100,
    Math.max(NPS_MIN_ANNUITY_PERCENT, Number(annuityPercentInput.replace(/[^0-9.]/g, "")) || NPS_MIN_ANNUITY_PERCENT)
  );
  const annuityReturnRate = Math.max(0, Number(annuityRateInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () =>
      calculateNps({
        currentAge,
        retirementAge,
        monthlyContribution,
        expectedAnnualReturn,
        annuityPurchasePercent,
        annuityReturnRate,
      }),
    [currentAge, retirementAge, monthlyContribution, expectedAnnualReturn, annuityPurchasePercent, annuityReturnRate]
  );

  const shareText = `My NPS corpus is projected to be ${formatINR(result.corpusAtRetirement)} at retirement, giving an estimated pension of ${formatINR(result.estimatedMonthlyPension)}/month. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Current age</span>
            <input
              type="text"
              inputMode="numeric"
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Retirement age</span>
            <input
              type="text"
              inputMode="numeric"
              value={retirementAgeInput}
              onChange={(e) => setRetirementAgeInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
        </div>

        <label className="mt-3 block">
          <span className="mb-1 block text-xs text-ink-soft">Monthly contribution</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={monthlyInput}
              onChange={(e) => setMonthlyInput(e.target.value)}
              className="tabular w-full bg-transparent text-base font-medium text-ink outline-none"
            />
          </div>
        </label>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Expected return (%)</span>
            <input
              type="text"
              inputMode="decimal"
              value={returnInput}
              onChange={(e) => setReturnInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Annuity % (min {NPS_MIN_ANNUITY_PERCENT}%)</span>
            <input
              type="text"
              inputMode="numeric"
              value={annuityPercentInput}
              onChange={(e) => setAnnuityPercentInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Annuity rate (%)</span>
            <input
              type="text"
              inputMode="decimal"
              value={annuityRateInput}
              onChange={(e) => setAnnuityRateInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
        </div>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            Corpus at Retirement (Age {retirementAge})
          </p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.corpusAtRetirement)}
          </div>
          <p className="tabular mt-1 text-sm text-white/70">
            Estimated pension: {formatINR(result.estimatedMonthlyPension)}/month
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Total contribution" value={result.totalContribution} />
          <LineRow label={`Lumpsum withdrawal (${100 - annuityPurchasePercent}%, tax-free)`} value={result.lumpsumWithdrawal} />
          <LineRow label={`Annuity purchase (${annuityPurchasePercent}%)`} value={result.annuityCorpus} emphasis />

          <p className="mt-4 text-xs text-ink-soft">
            At least {NPS_MIN_ANNUITY_PERCENT}% of your corpus must go toward an annuity purchase,
            which is what funds your monthly pension. The annuity rate you'll actually get is set
            by the insurer at the time of purchase — this calculator uses your assumed rate as an
            estimate only.
          </p>
        </div>
      </div>

      <CalculatorActions shareTitle="My NPS projection" shareText={shareText} />
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
