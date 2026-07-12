"use client";
import { useState, useMemo } from "react";
import { calculateHomeAffordability } from "@/lib/calculators/real-estate";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { formatINR, formatINRCompact } from "@/lib/format";

export default function HomeAffordabilityCalculator() {
  const [annualCtc, setAnnualCtc] = useState(1_000_000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [emiRatio, setEmiRatio] = useState(40);

  const result = useMemo(() => {
    const breakup = calculateSalaryBreakup({ annualCtc, regime: "new" });
    return calculateHomeAffordability({
      annualCtc,
      inHandMonthly: breakup.inHandMonthly,
      interestRate,
      tenureYears,
      downPaymentPercent,
      emiToIncomeRatio: emiRatio / 100,
    });
  }, [annualCtc, interestRate, tenureYears, downPaymentPercent, emiRatio]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Your Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Annual CTC</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-ink-soft text-sm">₹</span>
              <input type="number" value={annualCtc} step={100000}
                onChange={e => setAnnualCtc(Number(e.target.value))}
                className="w-full rounded-lg border border-rule bg-paper pl-7 pr-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
            </div>
            <p className="text-xs text-ink-soft mt-1">In-hand: {formatINR(result.monthlyIncome)}/mo</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Home Loan Rate: {interestRate}%</label>
            <input type="range" min={6} max={12} step={0.1} value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
              className="w-full accent-brand mt-2" />
            <div className="flex justify-between text-xs text-ink-soft mt-1"><span>6%</span><span>12%</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Loan Tenure: {tenureYears} years</label>
            <input type="range" min={5} max={30} step={1} value={tenureYears}
              onChange={e => setTenureYears(Number(e.target.value))}
              className="w-full accent-brand mt-2" />
            <div className="flex justify-between text-xs text-ink-soft mt-1"><span>5 yrs</span><span>30 yrs</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Down Payment: {downPaymentPercent}%</label>
            <input type="range" min={10} max={50} step={5} value={downPaymentPercent}
              onChange={e => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-brand mt-2" />
            <div className="flex justify-between text-xs text-ink-soft mt-1"><span>10%</span><span>50%</span></div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-ink mb-1">EMI as % of in-hand: {emiRatio}%</label>
          <input type="range" min={20} max={60} step={5} value={emiRatio}
            onChange={e => setEmiRatio(Number(e.target.value))}
            className="w-full accent-brand" />
          <p className="text-xs text-ink-soft mt-1">Banks typically allow up to 40-50%. Lower = safer.</p>
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Max Property Value", value: formatINRCompact(result.maxPropertyValue), color: "text-brand", sub: "you can afford" },
          { label: "Max Loan Amount", value: formatINRCompact(result.maxLoanAmount), color: "text-ink", sub: "bank may sanction" },
          { label: "Min Down Payment", value: formatINRCompact(result.minDownPayment), color: "text-deduction", sub: `${downPaymentPercent}% upfront` },
        ].map(card => (
          <div key={card.label} className="rounded-xl border border-rule bg-surface p-4 shadow-card text-center">
            <p className="text-xs text-ink-soft">{card.label}</p>
            <p className={`tabular mt-1 font-display text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-ink-soft mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-3">Monthly Breakdown</h3>
        <div className="space-y-2">
          {[
            { label: "Your in-hand salary", value: formatINR(result.monthlyIncome) },
            { label: "Max EMI (${emiRatio}% of in-hand)", value: formatINR(result.maxEmi) },
            { label: "Remaining after EMI", value: formatINR(result.monthlyIncome - result.maxEmi) },
            { label: "Total interest payable", value: formatINR(result.emiResult.totalInterest) },
            { label: "Total payment (loan + interest)", value: formatINR(result.emiResult.totalPayment) },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm border-b border-rule last:border-0 pb-2">
              <span className="text-ink-soft">{row.label}</span>
              <span className="tabular font-medium text-ink">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-soft">
        Based on your in-hand salary of {formatINR(result.monthlyIncome)}/month. Actual loan eligibility depends
        on your credit score, existing liabilities, and lender policies. Add stamp duty (~5-8% of property value)
        and registration charges (~1%) to your budget.
      </p>
    </div>
  );
}
