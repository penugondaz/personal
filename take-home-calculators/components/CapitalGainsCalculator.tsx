"use client";

import { useMemo, useState } from "react";
import { calculateCapitalGains, type AssetClass } from "@/lib/calculators/capital-gains";
import { formatINR } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function CapitalGainsCalculator() {
  const [assetClass, setAssetClass] = useState<AssetClass>("listed_equity_or_equity_mf");
  const [purchaseInput, setPurchaseInput] = useState("100000");
  const [saleInput, setSaleInput] = useState("180000");
  const [holdingMonths, setHoldingMonths] = useState(18);

  const purchasePrice = Math.max(0, Number(purchaseInput.replace(/[^0-9.]/g, "")) || 0);
  const salePrice = Math.max(0, Number(saleInput.replace(/[^0-9.]/g, "")) || 0);

  const result = useMemo(
    () => calculateCapitalGains({ assetClass, purchasePrice, salePrice, holdingPeriodMonths: holdingMonths }),
    [assetClass, purchasePrice, salePrice, holdingMonths]
  );

  const shareText = `My capital gains tax works out to ${formatINR(result.taxPayable)} on a gain of ${formatINR(result.gainAmount)}. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <fieldset>
          <legend className="mb-1.5 text-xs text-ink-soft">Asset type</legend>
          <div className="flex flex-wrap gap-2">
            <RadioPill
              label="Listed equity / equity mutual funds"
              active={assetClass === "listed_equity_or_equity_mf"}
              onClick={() => setAssetClass("listed_equity_or_equity_mf")}
            />
            <RadioPill
              label="Debt mutual funds / other assets"
              active={assetClass === "debt_mf_or_other"}
              onClick={() => setAssetClass("debt_mf_or_other")}
            />
          </div>
        </fieldset>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Purchase price</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-sm text-ink-soft">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={purchaseInput}
                onChange={(e) => setPurchaseInput(e.target.value)}
                className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Sale price</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-sm text-ink-soft">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={saleInput}
                onChange={(e) => setSaleInput(e.target.value)}
                className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none"
              />
            </div>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium text-ink">Holding period: {holdingMonths} months</span>
          <input
            type="range"
            min={1}
            max={60}
            step={1}
            value={holdingMonths}
            onChange={(e) => setHoldingMonths(Number(e.target.value))}
            className="w-full accent-[var(--brand)]"
          />
        </label>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            {result.gainType === "long_term" ? "Long-Term" : "Short-Term"} Capital Gains Tax
          </p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {result.taxRatePercent > 0 || result.cessIncluded ? formatINR(result.taxPayable) : "Slab rate"}
          </div>
          <p className="tabular mt-1 text-sm text-white/70">on a gain of {formatINR(result.gainAmount)}</p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <LineRow label="Gain amount" value={result.gainAmount} />
          {result.exemptionApplied > 0 && <LineRow label="Exemption applied" value={result.exemptionApplied} />}
          <LineRow label="Taxable gain" value={result.taxableGain} />
          {result.taxRatePercent > 0 && (
            <div className="flex items-baseline justify-between border-b border-dashed border-rule py-1.5">
              <span className="text-sm text-ink-soft">Tax rate</span>
              <span className="tabular text-sm text-ink">{result.taxRatePercent}%</span>
            </div>
          )}

          <div className="mt-4 rounded-lg bg-brand-soft px-3 py-2.5 text-sm text-brand">{result.note}</div>
        </div>
      </div>

      <CalculatorActions shareTitle="My capital gains tax" shareText={shareText} />
    </div>
  );
}

function LineRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-rule py-1.5">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="tabular text-sm text-ink">{formatINR(value)}</span>
    </div>
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
