"use client";

import { useMemo, useState } from "react";
import { calculateRsuEsopTax } from "@/lib/calculators/rsu-esop-tax";
import type { TaxRegime } from "@/lib/calculators/income-tax";
import type { AssetClass } from "@/lib/calculators/capital-gains";
import { formatINR, formatINRCompact } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function RsuEsopTaxCalculator() {
  const [grantType, setGrantType] = useState<"rsu" | "esop">("rsu");
  const [shares, setShares] = useState("200");
  const [fmvVesting, setFmvVesting] = useState("1500");
  const [exercisePrice, setExercisePrice] = useState("0");
  const [otherSalary, setOtherSalary] = useState("1800000");
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [salePrice, setSalePrice] = useState("2000");
  const [holdingMonths, setHoldingMonths] = useState("18");
  const [shareType, setShareType] = useState<AssetClass>("listed_equity_or_equity_mf");

  const parsed = {
    shares: Math.max(0, Number(shares.replace(/[^0-9]/g, "")) || 0),
    fmvVesting: Math.max(0, Number(fmvVesting.replace(/[^0-9.]/g, "")) || 0),
    exercisePrice: Math.max(0, Number(exercisePrice.replace(/[^0-9.]/g, "")) || 0),
    otherSalary: Math.max(0, Number(otherSalary.replace(/[^0-9]/g, "")) || 0),
    salePrice: Math.max(0, Number(salePrice.replace(/[^0-9.]/g, "")) || 0),
    holdingMonths: Math.max(0, Number(holdingMonths) || 0),
  };

  const result = useMemo(
    () =>
      calculateRsuEsopTax({
        grantType,
        numberOfShares: parsed.shares,
        fmvAtVesting: parsed.fmvVesting,
        exercisePrice: grantType === "rsu" ? 0 : parsed.exercisePrice,
        otherAnnualSalaryIncome: parsed.otherSalary,
        regime,
        salePricePerShare: parsed.salePrice,
        holdingPeriodMonths: parsed.holdingMonths,
        shareType,
      }),
    [grantType, parsed.shares, parsed.fmvVesting, parsed.exercisePrice, parsed.otherSalary, regime, parsed.salePrice, parsed.holdingMonths, shareType]
  );

  const shareText = `My RSU/ESOP total tax works out to ${formatINR(result.totalTaxOverall)}. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <fieldset className="mb-4">
          <legend className="mb-1.5 text-xs text-ink-soft">Grant type</legend>
          <div className="flex gap-2">
            <RadioPill label="RSU" active={grantType === "rsu"} onClick={() => setGrantType("rsu")} />
            <RadioPill label="ESOP (stock option)" active={grantType === "esop"} onClick={() => setGrantType("esop")} />
          </div>
        </fieldset>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          At Vesting {grantType === "esop" ? "/ Exercise" : ""}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="Number of shares" value={shares} onChange={setShares} />
          <TextField label="FMV per share at vesting (₹)" value={fmvVesting} onChange={setFmvVesting} />
          {grantType === "esop" && (
            <TextField label="Exercise price per share (₹)" value={exercisePrice} onChange={setExercisePrice} />
          )}
          <MoneyField label="Rest of your annual salary (excl. this perquisite)" value={otherSalary} onChange={setOtherSalary} />
        </div>

        <fieldset className="mt-3">
          <legend className="mb-1.5 text-xs text-ink-soft">Tax regime</legend>
          <div className="flex gap-2">
            <RadioPill label="New Regime" active={regime === "new"} onClick={() => setRegime("new")} />
            <RadioPill label="Old Regime" active={regime === "old"} onClick={() => setRegime("old")} />
          </div>
        </fieldset>

        <p className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">At Sale</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="Sale price per share (₹)" value={salePrice} onChange={setSalePrice} />
          <TextField label="Holding period since vesting (months)" value={holdingMonths} onChange={setHoldingMonths} />
        </div>
        <fieldset className="mt-3">
          <legend className="mb-1.5 text-xs text-ink-soft">Share type</legend>
          <div className="flex flex-wrap gap-2">
            <RadioPill
              label="Listed Indian equity (12-mo LTCG)"
              active={shareType === "listed_equity_or_equity_mf"}
              onClick={() => setShareType("listed_equity_or_equity_mf")}
            />
            <RadioPill
              label="Foreign / unlisted company (24-mo LTCG)"
              active={shareType === "debt_mf_or_other"}
              onClick={() => setShareType("debt_mf_or_other")}
            />
          </div>
        </fieldset>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Total Tax (Perquisite + Capital Gains)</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="tabular font-display text-4xl font-semibold text-white sm:text-5xl">
              {formatINR(result.totalTaxOverall)}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/70">
            Net proceeds after all tax and exercise cost: {formatINRCompact(result.netProceedsAfterAllTax)}
          </p>
        </div>

        <div className="px-6 py-5 sm:px-8">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">1. Perquisite Tax (at Vesting)</h3>
          <LineRow label="Perquisite value per share" value={result.perquisiteValuePerShare} />
          <LineRow label="Total perquisite value (added to salary)" value={result.totalPerquisiteValue} winner />
          <LineRow label="Tax on perquisite (at your marginal slab)" value={result.perquisiteTax} deduction />
          <p className="mt-1.5 text-xs text-ink-soft">
            Effective rate on this perquisite: {result.effectivePerquisiteTaxRate.toFixed(1)}% — your employer should deduct this as TDS.
          </p>

          <h3 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-brand">2. Capital Gains Tax (at Sale)</h3>
          <LineRow label="Capital gain (sale price − FMV at vesting)" value={result.capitalGain} winner={result.capitalGain > 0} />
          <LineRow
            label={`${result.capitalGainsTax.gainType === "long_term" ? "Long-term" : "Short-term"} gains tax (${result.capitalGainsTax.taxRatePercent}%)`}
            value={result.capitalGainsTax.taxPayable}
            deduction
          />
          <p className="mt-1.5 text-xs text-ink-soft">{result.capitalGainsTax.note}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-rule pt-4">
            <div>
              <p className="text-xs text-ink-soft">Total sale proceeds</p>
              <p className="tabular mt-0.5 font-display text-lg font-semibold text-ink">{formatINRCompact(result.totalSaleProceeds)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-soft">Exercise cost paid</p>
              <p className="tabular mt-0.5 font-display text-lg font-semibold text-ink">{formatINRCompact(result.totalExerciseCost)}</p>
            </div>
          </div>
        </div>
      </div>

      <CalculatorActions shareTitle="My RSU/ESOP tax" shareText={shareText} />
      <p className="mt-4 text-xs text-ink-soft">
        Simplified model for a single vesting tranche. Multiple tranches vesting on different dates each need this calculation run separately with their own FMV and holding period.
      </p>
    </div>
  );
}

function LineRow({ label, value, winner = false, deduction = false }: { label: string; value: number; winner?: boolean; deduction?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-rule py-1.5">
      <span className={`text-sm ${winner ? "font-semibold text-brand" : "text-ink-soft"}`}>{label}</span>
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
        <input type="text" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
      </div>
    </label>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ink-soft">{label}</span>
      <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <input type="text" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
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
