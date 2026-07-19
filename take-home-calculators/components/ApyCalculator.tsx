"use client";

import { useMemo, useState } from "react";
import {
  calculateApy,
  APY_MIN_ENTRY_AGE,
  APY_MAX_ENTRY_AGE,
  type ApyPensionAmount,
} from "@/lib/calculators/apy";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

const PENSION_OPTIONS: ApyPensionAmount[] = [1000, 2000, 3000, 4000, 5000];

export default function ApyCalculator() {
  const [age, setAge] = useState("28");
  const [pension, setPension] = useState<ApyPensionAmount>(5000);

  const parsedAge = Math.max(0, Math.round(Number(age) || 0));

  const result = useMemo(() => calculateApy({ currentAge: parsedAge, desiredMonthlyPension: pension }), [parsedAge, pension]);

  const shareText = result.isEligible
    ? `I'll pay just ${formatINR(result.monthlyContribution)}/month under APY to get a guaranteed ₹${pension}/month pension from age 60. Check yours:`
    : "Check your Atal Pension Yojana contribution:";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label={`Your current age (${APY_MIN_ENTRY_AGE}-${APY_MAX_ENTRY_AGE})`} value={age} onChange={setAge} />
          <div>
            <span className="mb-1 block text-xs text-ink-soft">Desired monthly pension from age 60</span>
            <div className="flex flex-wrap gap-2">
              {PENSION_OPTIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPension(p)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    pension === p ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand hover:text-brand"
                  }`}
                >
                  ₹{p.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!result.isEligible ? (
        <div className="rounded-2xl border border-deduction/30 bg-deduction/5 p-5 text-sm text-deduction">
          {result.ineligibilityReason}
        </div>
      ) : (
        <>
          <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
            <div className="brand-gradient px-6 py-7 sm:px-8">
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">Monthly Contribution Required</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="tabular font-display text-4xl font-semibold text-white sm:text-5xl">
                  {formatINR(result.monthlyContribution)}
                </span>
                <span className="text-base font-normal text-white/70">/month</span>
              </div>
              <p className="mt-1 text-sm text-white/70">
                For {result.yearsOfContribution} years, until age {60}
              </p>
            </div>

            <div className="px-6 py-5 sm:px-8">
              <LineRow label="Total months of contribution" value={`${result.totalMonthsOfContribution} months`} />
              <LineRow label="Total contribution over the years" value={formatINR(result.totalContributionPaid)} />
              <LineRow label="Guaranteed monthly pension from age 60" value={formatINR(result.guaranteedMonthlyPensionAt60)} winner />
              <LineRow label="Guaranteed annual pension" value={formatINR(result.annualPensionAt60)} />
              <LineRow label="Corpus returned to nominee (if both spouse & subscriber pass)" value={formatINR(result.corpusReturnedToNominee)} />

              <div className="mt-4 rounded-lg bg-brand-soft px-3 py-2.5 text-sm text-brand">
                This is a government-guaranteed defined-benefit pension — your contribution is
                fixed by PFRDA&apos;s official chart, not market-linked.
              </div>
            </div>
          </div>

          <CalculatorActions shareTitle="My Atal Pension Yojana plan" shareText={shareText} />
        </>
      )}

      <p className="mt-4 text-xs text-ink-soft">
        APY contribution amounts follow PFRDA&apos;s official chart by entry age and are fixed
        for the life of the scheme once you enroll — they don&apos;t change with market returns.
        On the subscriber&apos;s death after 60, the spouse receives the same pension for life.
      </p>
    </div>
  );
}

function LineRow({ label, value, winner = false }: { label: string; value: string; winner?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-rule py-1.5">
      <span className={`text-sm ${winner ? "font-semibold text-brand" : "text-ink-soft"}`}>{label}</span>
      <span className={`tabular shrink-0 text-sm ${winner ? "font-semibold text-brand" : "text-ink"}`}>{value}</span>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-soft">{label}</span>
      <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <input type="text" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
      </div>
    </label>
  );
}
