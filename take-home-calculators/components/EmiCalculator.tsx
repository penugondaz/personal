"use client";

import { useMemo, useState } from "react";
import { calculateEmi, yearlyAmortizationSummary, LOAN_TYPE_DEFAULTS, type LoanType } from "@/lib/calculators/emi";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function EmiCalculator() {
  const [loanType, setLoanType] = useState<LoanType>("home");
  const [principalInput, setPrincipalInput] = useState("3000000");
  const [rateInput, setRateInput] = useState(String(LOAN_TYPE_DEFAULTS.home.defaultRate));
  const [tenureYears, setTenureYears] = useState(LOAN_TYPE_DEFAULTS.home.defaultTenureMonths / 12);
  const [showSchedule, setShowSchedule] = useState(false);

  const principal = Math.max(0, Number(principalInput.replace(/[^0-9.]/g, "")) || 0);
  const annualInterestRate = Math.max(0, Number(rateInput.replace(/[^0-9.]/g, "")) || 0);
  const tenureMonths = Math.round(tenureYears * 12);

  const result = useMemo(
    () => calculateEmi({ principal, annualInterestRate, tenureMonths }),
    [principal, annualInterestRate, tenureMonths]
  );

  const yearlySummary = useMemo(() => yearlyAmortizationSummary(result.amortizationSchedule), [result]);

  function handleLoanTypeChange(type: LoanType) {
    setLoanType(type);
    setRateInput(String(LOAN_TYPE_DEFAULTS[type].defaultRate));
    setTenureYears(LOAN_TYPE_DEFAULTS[type].defaultTenureMonths / 12);
  }

  const shareText = `My ${LOAN_TYPE_DEFAULTS[loanType].label} EMI works out to ${formatINR(result.monthlyEmi)}/month. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {(Object.keys(LOAN_TYPE_DEFAULTS) as LoanType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleLoanTypeChange(type)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                loanType === type ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand hover:text-brand"
              }`}
            >
              {LOAN_TYPE_DEFAULTS[type].label}
            </button>
          ))}
        </div>

        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Loan amount</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-base text-ink-soft">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={principalInput}
              onChange={(e) => setPrincipalInput(e.target.value)}
              className="tabular w-full bg-transparent text-base font-medium text-ink outline-none"
            />
          </div>
        </label>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Interest rate (% p.a.)</span>
            <input
              type="text"
              inputMode="decimal"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              className="tabular w-full rounded-lg border border-rule bg-paper px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Tenure: {tenureYears} years</span>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="mt-2.5 w-full accent-[var(--brand)]"
            />
          </label>
        </div>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Monthly EMI</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.monthlyEmi)}
          </div>
          <p className="tabular mt-1 text-sm text-white/70">for {tenureMonths} months</p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Principal amount" value={result.principal} />
          <LineRow label="Total interest payable" value={result.totalInterest} deduction />
          <LineRow label="Total amount payable" value={result.totalPayment} emphasis />
        </div>
      </div>

      <CalculatorActions shareTitle={`My ${LOAN_TYPE_DEFAULTS[loanType].label} EMI`} shareText={shareText} />

      <div className="no-print mt-4">
        <button
          type="button"
          onClick={() => setShowSchedule((s) => !s)}
          className="text-sm font-medium text-brand underline-offset-2 hover:underline"
        >
          {showSchedule ? "Hide" : "Show"} year-by-year amortization
        </button>
        {showSchedule && (
          <div className="mt-3 overflow-hidden rounded-xl border border-rule">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper text-left">
                  <th className="px-3 py-2 font-medium text-ink-soft">Year</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-soft">Principal Paid</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-soft">Interest Paid</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-soft">Balance</th>
                </tr>
              </thead>
              <tbody>
                {yearlySummary.map((row) => (
                  <tr key={row.year} className="border-b border-rule last:border-0">
                    <td className="px-3 py-2 text-ink-soft">{row.year}</td>
                    <td className="tabular px-3 py-2 text-right text-ink">{formatINR(row.principalPaid)}</td>
                    <td className="tabular px-3 py-2 text-right text-ink">{formatINR(row.interestPaid)}</td>
                    <td className="tabular px-3 py-2 text-right font-medium text-ink">{formatINR(row.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function LineRow({ label, value, emphasis = false, deduction = false }: { label: string; value: number; emphasis?: boolean; deduction?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between border-b border-dashed border-rule py-1.5 ${emphasis ? "font-semibold" : ""}`}>
      <span className={`text-sm ${emphasis ? "text-ink" : "text-ink-soft"}`}>{label}</span>
      <span className={`tabular text-sm ${deduction ? "text-deduction" : "text-ink"}`}>{formatINR(value)}</span>
    </div>
  );
}
