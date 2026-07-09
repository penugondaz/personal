"use client";
import { useState, useMemo } from "react";
import { formatINR } from "@/lib/format";

const DEFAULT_RATE = 8.5;
const DEFAULT_TENURE_YEARS = 20;

function calcEligibility(monthlyIncome: number, existingEmis: number, foirPercent: number, rate: number, tenureYears: number) {
  const maxAffordableEmi = Math.max(0, monthlyIncome * (foirPercent / 100) - existingEmis);
  const monthlyRate = rate / 12 / 100;
  const n = tenureYears * 12;

  let eligibleLoanAmount: number;
  if (monthlyRate === 0) {
    eligibleLoanAmount = maxAffordableEmi * n;
  } else {
    const factor = Math.pow(1 + monthlyRate, n);
    // Inverse of the EMI formula, solved for principal
    eligibleLoanAmount = (maxAffordableEmi * (factor - 1)) / (monthlyRate * factor);
  }

  return {
    maxAffordableEmi: Math.round(maxAffordableEmi),
    eligibleLoanAmount: Math.round(eligibleLoanAmount),
  };
}

export default function HomeLoanEligibilityCalculator() {
  const [incomeInput, setIncomeInput] = useState("100000");
  const [emiInput, setEmiInput] = useState("0");
  const [foirPercent, setFoirPercent] = useState(50);
  const [rateInput, setRateInput] = useState(String(DEFAULT_RATE));
  const [tenureYears, setTenureYears] = useState(DEFAULT_TENURE_YEARS);

  const monthlyIncome = Math.max(0, Number(incomeInput.replace(/[^0-9]/g, "")) || 0);
  const existingEmis = Math.max(0, Number(emiInput.replace(/[^0-9]/g, "")) || 0);
  const rate = Math.max(0, Number(rateInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () => calcEligibility(monthlyIncome, existingEmis, foirPercent, rate, tenureYears),
    [monthlyIncome, existingEmis, foirPercent, rate, tenureYears]
  );

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Net Monthly Income (₹, take-home)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-ink-soft">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                className="tabular w-full bg-transparent text-lg font-semibold text-ink outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Existing EMIs (₹/month, if any)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-ink-soft">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={emiInput}
                onChange={(e) => setEmiInput(e.target.value)}
                className="tabular w-full bg-transparent text-lg font-semibold text-ink outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Interest Rate (% p.a.)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <input
                type="text"
                inputMode="decimal"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                className="tabular w-full bg-transparent text-lg font-semibold text-ink outline-none"
              />
              <span className="text-ink-soft">%</span>
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Loan Tenure: <span className="tabular text-brand font-semibold">{tenureYears} yrs</span></span>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="mt-2.5 w-full accent-brand"
            />
          </label>
        </div>

        <div className="mt-4">
          <span className="mb-1.5 block text-xs text-ink-soft">
            FOIR (% of income lenders allow toward all EMIs combined)
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[40, 50, 60].map((f) => (
              <button
                key={f}
                onClick={() => setFoirPercent(f)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  foirPercent === f ? "border-brand bg-brand text-white" : "border-rule text-ink-soft hover:border-brand hover:text-brand"
                }`}
              >
                {f}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Estimated Loan Eligibility</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.eligibleLoanAmount)}
          </div>
          <p className="mt-1 text-sm text-white/70">
            At {rate}% for {tenureYears} years, with EMI up to {formatINR(result.maxAffordableEmi)}/month
          </p>
        </div>
        <div className="px-6 py-5 sm:px-8">
          {[
            { label: "Net monthly income", value: formatINR(monthlyIncome) },
            { label: "Existing EMI obligations", value: formatINR(existingEmis) },
            { label: `Max affordable EMI (${foirPercent}% FOIR)`, value: formatINR(result.maxAffordableEmi) },
            { label: "Estimated eligible loan amount", value: formatINR(result.eligibleLoanAmount) },
          ].map((item) => (
            <div key={item.label} className="flex justify-between border-b border-dashed border-rule py-1.5 text-sm">
              <span className="text-ink-soft">{item.label}</span>
              <span className="tabular font-medium text-ink">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        FOIR (Fixed Obligation to Income Ratio) is the lender&apos;s rule of thumb for how much of your income can
        go toward EMIs. Most banks use 40-60% depending on your income level and credit profile. Your actual
        eligibility also depends on credit score, age, employment type, and the specific lender&apos;s policy —
        treat this as an estimate to plan around, not a sanction guarantee.
      </p>
    </>
  );
}
