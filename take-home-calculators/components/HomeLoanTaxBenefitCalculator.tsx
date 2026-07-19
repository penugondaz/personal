"use client";

import { useMemo, useState } from "react";
import {
  calculateHomeLoanTaxBenefit,
  SECTION_24B_SELF_OCCUPIED_CAP,
  SECTION_80EEA_CAP,
  type PropertyUsage,
} from "@/lib/calculators/home-loan-tax-benefit";
import { formatINR, formatINRCompact } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function HomeLoanTaxBenefitCalculator() {
  const [loanAmount, setLoanAmount] = useState("4000000");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("20");
  const [usage, setUsage] = useState<PropertyUsage>("self_occupied");
  const [rentalIncome, setRentalIncome] = useState("240000");
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);
  const [stampValue, setStampValue] = useState("4200000");
  const [sanctionedInWindow, setSanctionedInWindow] = useState(false);
  const [annualIncome, setAnnualIncome] = useState("1200000");

  const parsed = {
    loanAmount: Math.max(0, Number(loanAmount.replace(/[^0-9]/g, "")) || 0),
    rate: Math.max(0, Number(rate) || 0),
    tenure: Math.max(1, Number(tenure) || 1),
    rentalIncome: Math.max(0, Number(rentalIncome.replace(/[^0-9]/g, "")) || 0),
    stampValue: Math.max(0, Number(stampValue.replace(/[^0-9]/g, "")) || 0),
    annualIncome: Math.max(0, Number(annualIncome.replace(/[^0-9]/g, "")) || 0),
  };

  const result = useMemo(
    () =>
      calculateHomeLoanTaxBenefit({
        loanAmount: parsed.loanAmount,
        annualInterestRate: parsed.rate,
        tenureYears: parsed.tenure,
        usage,
        annualRentalIncome: parsed.rentalIncome,
        isFirstTimeBuyer,
        stampDutyValue: parsed.stampValue,
        sanctionedInEligibleWindow: sanctionedInWindow,
        annualTaxableIncomeExcludingHomeLoan: parsed.annualIncome,
      }),
    [
      parsed.loanAmount,
      parsed.rate,
      parsed.tenure,
      usage,
      parsed.rentalIncome,
      isFirstTimeBuyer,
      parsed.stampValue,
      sanctionedInWindow,
      parsed.annualIncome,
    ]
  );

  const shareText = `My home loan tax benefit: ~${formatINR(result.year1.taxSavedOldRegime)}/year saved in tax under the old regime. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Inputs */}
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2">
          <MoneyField label="Home loan amount" value={loanAmount} onChange={setLoanAmount} />
          <TextField label="Interest rate (% p.a.)" value={rate} onChange={setRate} suffix="%" />
          <TextField label="Loan tenure (years)" value={tenure} onChange={setTenure} suffix="yrs" />
          <MoneyField label="Your annual taxable income (before this deduction)" value={annualIncome} onChange={setAnnualIncome} />
        </div>

        <fieldset className="mt-4">
          <legend className="mb-1.5 text-xs text-ink-soft">Property usage</legend>
          <div className="flex gap-2">
            <RadioPill label="Self-occupied" active={usage === "self_occupied"} onClick={() => setUsage("self_occupied")} />
            <RadioPill label="Let-out (rented)" active={usage === "let_out"} onClick={() => setUsage("let_out")} />
          </div>
        </fieldset>

        {usage === "let_out" && (
          <div className="mt-4">
            <MoneyField label="Annual rental income received" value={rentalIncome} onChange={setRentalIncome} />
          </div>
        )}

        <fieldset className="mt-4">
          <legend className="mb-1.5 text-xs text-ink-soft">Section 80EEA eligibility (extra ₹1.5L deduction)</legend>
          <div className="flex flex-wrap items-center gap-4">
            <Checkbox label="I'm a first-time home buyer" checked={isFirstTimeBuyer} onChange={setIsFirstTimeBuyer} />
            <Checkbox
              label="Loan sanctioned between Apr 2019 – Mar 2022"
              checked={sanctionedInWindow}
              onChange={setSanctionedInWindow}
            />
          </div>
          {isFirstTimeBuyer && (
            <div className="mt-3 max-w-xs">
              <MoneyField label="Property stamp duty value" value={stampValue} onChange={setStampValue} />
            </div>
          )}
        </fieldset>
      </div>

      {/* Result card */}
      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            Estimated Tax Saved — Year 1 (Old Regime)
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="tabular font-display text-4xl font-semibold text-white sm:text-5xl">
              {formatINR(result.year1.taxSavedOldRegime)}
            </span>
            <span className="text-base font-normal text-white/70">/year</span>
          </div>
          <p className="mt-1 text-sm text-white/70">
            EMI: {formatINR(result.monthlyEmi)}/month · Total interest over tenure: {formatINRCompact(result.totalInterestOverTenure)}
          </p>
        </div>

        <div className="px-6 py-5 sm:px-8">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">Year 1 Deduction Breakdown</h3>
          <LineRow label="Interest paid (Year 1)" value={result.year1.interestPaid} />
          {usage === "self_occupied" ? (
            <>
              <LineRow
                label={`Section 24(b) — self-occupied (capped ${formatINRCompact(SECTION_24B_SELF_OCCUPIED_CAP)})`}
                value={result.year1.section24bDeduction}
                winner
              />
              <LineRow
                label={`Section 80EEA — first-time buyer (capped ${formatINRCompact(SECTION_80EEA_CAP)})`}
                value={result.year1.section80EEADeduction}
                winner={result.year1.section80EEADeduction > 0}
              />
            </>
          ) : (
            <>
              <LineRow label="Section 24(b) — full interest against rental income" value={result.year1.section24bDeduction} winner />
              <LineRow label="Loss set off against salary (old regime, capped ₹2L)" value={result.year1.lossSetOffOldRegime} winner={result.year1.lossSetOffOldRegime > 0} />
            </>
          )}
          <LineRow label="Section 80C — principal repaid (capped ₹1.5L, shared bucket)" value={result.year1.section80CDeduction} />

          <div className="mt-4 rounded-lg bg-brand-soft px-3 py-2.5 text-sm text-brand">
            Total Year 1 deduction (old regime): <strong>{formatINR(result.year1.totalDeductionOldRegime)}</strong>
          </div>

          {!result.is80EEAEligible && usage === "self_occupied" && (
            <p className="mt-3 text-xs text-ink-soft">
              80EEA not applied: {result.eightyEEAIneligibilityReason}
            </p>
          )}

          <h3 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-deduction">Old vs New Regime</h3>
          <LineRow label="Tax saved — Old Regime (Year 1)" value={result.year1.taxSavedOldRegime} winner />
          <LineRow label="Tax saved — New Regime (Year 1)" value={result.year1.taxSavedNewRegime} deduction={result.year1.taxSavedNewRegime === 0} />
          {usage === "self_occupied" && (
            <p className="mt-2 text-xs text-ink-soft">
              Self-occupied home loan interest gets ₹0 benefit under the new regime — Section 115BAC
              disallows this deduction entirely, regardless of interest paid.
            </p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-rule pt-4">
            <div>
              <p className="text-xs text-ink-soft">Total tax saved over full tenure (old regime)</p>
              <p className="tabular mt-0.5 font-display text-lg font-semibold text-brand">
                {formatINRCompact(result.totalTaxSavedOldRegimeOverTenure)}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-soft">Total tax saved over full tenure (new regime)</p>
              <p className="tabular mt-0.5 font-display text-lg font-semibold text-ink">
                {formatINRCompact(result.totalTaxSavedNewRegimeOverTenure)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <CalculatorActions shareTitle="My home loan tax benefit" shareText={shareText} />

      {/* Year-by-year table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-rule">
        <table className="w-full text-sm" style={{ minWidth: 640 }}>
          <thead>
            <tr className="border-b border-rule bg-paper text-left">
              <th className="px-3 py-2 font-medium text-ink-soft">Year</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Interest Paid</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Principal Paid</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Total Deduction (Old)</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Tax Saved (Old)</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Tax Saved (New)</th>
            </tr>
          </thead>
          <tbody>
            {result.yearlyBreakdown.map((r) => (
              <tr key={r.year} className="border-b border-rule last:border-0">
                <td className="px-3 py-2 text-ink-soft">Year {r.year}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINRCompact(r.interestPaid)}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINRCompact(r.principalPaid)}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINRCompact(r.totalDeductionOldRegime)}</td>
                <td className="tabular px-3 py-2 text-right font-medium text-brand">{formatINRCompact(r.taxSavedOldRegime)}</td>
                <td className="tabular px-3 py-2 text-right text-ink-soft">{formatINRCompact(r.taxSavedNewRegime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Simplified model for a single self-occupied or let-out property held by one borrower — doesn&apos;t account for co-borrower splits, pre-construction interest, or multiple properties.
      </p>
    </div>
  );
}

function LineRow({
  label,
  value,
  winner = false,
  deduction = false,
}: {
  label: string;
  value: number;
  winner?: boolean;
  deduction?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-rule py-1.5">
      <span className={`text-sm ${winner ? "font-semibold text-brand" : "text-ink-soft"}`}>
        {label}
        {winner && " ✓"}
      </span>
      <span className={`tabular shrink-0 text-sm ${deduction ? "text-deduction" : winner ? "font-semibold text-brand" : "text-ink"}`}>
        {formatINR(value)}
      </span>
    </div>
  );
}

function MoneyField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-soft">{label}</span>
      <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <span className="text-sm text-ink-soft">₹</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none"
        />
      </div>
    </label>
  );
}

function TextField({ label, value, onChange, suffix }: { label: string; value: string; onChange: (v: string) => void; suffix?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-soft">{label}</span>
      <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none"
        />
        {suffix && <span className="text-sm text-ink-soft">{suffix}</span>}
      </div>
    </label>
  );
}

function RadioPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand hover:text-brand"
      }`}
    >
      {label}
    </button>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--brand)]"
      />
      {label}
    </label>
  );
}
