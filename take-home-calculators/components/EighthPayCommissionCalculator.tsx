"use client";
import { useState, useMemo } from "react";
import { formatINR } from "@/lib/format";

const HRA_RATES: Record<"x" | "y" | "z", { label: string; percent: number }> = {
  x: { label: "X — Metro (Delhi, Mumbai, Bengaluru, etc.)", percent: 30 },
  y: { label: "Y — Tier-2 city", percent: 20 },
  z: { label: "Z — Other areas", percent: 10 },
};

function calc(currentBasic: number, fitmentFactor: number, currentDaPercent: number, hraPercent: number) {
  const oldDa = currentBasic * (currentDaPercent / 100);
  const oldHra = currentBasic * (hraPercent / 100);
  const oldGross = currentBasic + oldDa + oldHra;

  const newBasic = currentBasic * fitmentFactor;
  // DA resets to 0% on the day a new pay commission is implemented, then
  // starts accumulating again from the next revision cycle.
  const newHra = newBasic * (hraPercent / 100);
  const newGrossDay1 = newBasic + newHra;

  const basicIncrease = newBasic - currentBasic;
  const grossIncrease = newGrossDay1 - oldGross;
  const grossIncreasePercent = oldGross > 0 ? (grossIncrease / oldGross) * 100 : 0;

  return { oldDa, oldHra, oldGross, newBasic, newHra, newGrossDay1, basicIncrease, grossIncrease, grossIncreasePercent };
}

export default function EighthPayCommissionCalculator() {
  const [basicInput, setBasicInput] = useState("44900");
  const [fitmentFactor, setFitmentFactor] = useState(2.57);
  const [currentDaPercent, setCurrentDaPercent] = useState(60);
  const [hraClass, setHraClass] = useState<"x" | "y" | "z">("x");

  const currentBasic = Math.max(0, Number(basicInput.replace(/[^0-9]/g, "")) || 0);
  const hraPercent = HRA_RATES[hraClass].percent;
  const result = useMemo(
    () => calc(currentBasic, fitmentFactor, currentDaPercent, hraPercent),
    [currentBasic, fitmentFactor, currentDaPercent, hraPercent]
  );

  return (
    <>
      <div className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-ink">
        <strong>⚠️ Not yet finalised.</strong> The 8th Pay Commission has been constituted and is holding
        consultations, but it has <strong>not submitted its recommendations</strong>. The fitment factor,
        revised HRA slabs, and effective date are all still under discussion — employee unions have proposed
        anywhere from 1.82x to 3.83x. Everything below is an illustrative estimate, not an official figure.
      </div>

      <div className="mt-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Current Basic Pay (7th CPC, ₹/month)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-ink-soft">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={basicInput}
                onChange={(e) => setBasicInput(e.target.value)}
                className="tabular w-full bg-transparent text-lg font-semibold text-ink outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Current DA (%)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <input
                type="text"
                inputMode="numeric"
                value={currentDaPercent}
                onChange={(e) => setCurrentDaPercent(Math.max(0, Number(e.target.value.replace(/[^0-9]/g, "")) || 0))}
                className="tabular w-full bg-transparent text-lg font-semibold text-ink outline-none"
              />
              <span className="text-ink-soft">%</span>
            </div>
          </label>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink">
              Fitment Factor: <span className="tabular text-brand font-semibold">{fitmentFactor.toFixed(2)}x</span>
            </span>
            <span className="text-xs text-ink-soft">Unions want up to 3.83x</span>
          </div>
          <input
            type="range"
            min={1.83}
            max={3.83}
            step={0.01}
            value={fitmentFactor}
            onChange={(e) => setFitmentFactor(Number(e.target.value))}
            className="mt-2 w-full accent-brand"
          />
          <div className="mt-1 flex justify-between text-[10px] text-ink-soft">
            <span>1.83x (conservative)</span>
            <span>2.57x (= 7th CPC)</span>
            <span>3.83x (union demand)</span>
          </div>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs text-ink-soft">HRA City Class</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(Object.keys(HRA_RATES) as Array<"x" | "y" | "z">).map((key) => (
              <button
                key={key}
                onClick={() => setHraClass(key)}
                className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
                  hraClass === key ? "border-brand bg-brand text-white" : "border-rule text-ink-soft hover:border-brand hover:text-brand"
                }`}
              >
                {HRA_RATES[key].label} ({HRA_RATES[key].percent}%)
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            Estimated New Basic Pay
          </p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.newBasic)}
          </div>
          <p className="mt-1 text-sm text-white/70">
            vs current basic of {formatINR(currentBasic)} — at {fitmentFactor.toFixed(2)}x fitment factor
          </p>
        </div>
        <div className="px-6 py-5 sm:px-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Current (7th CPC)</p>
          {[
            { label: "Basic Pay", value: formatINR(currentBasic) },
            { label: `DA (${currentDaPercent}%)`, value: formatINR(result.oldDa) },
            { label: `HRA (${hraPercent}%)`, value: formatINR(result.oldHra) },
            { label: "Current Gross", value: formatINR(result.oldGross) },
          ].map((item) => (
            <div key={item.label} className="flex justify-between border-b border-dashed border-rule py-1.5 text-sm">
              <span className="text-ink-soft">{item.label}</span>
              <span className="tabular font-medium text-ink">{item.value}</span>
            </div>
          ))}

          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Estimated Day 1 of 8th CPC (DA resets to 0%)
          </p>
          {[
            { label: "New Basic Pay", value: formatINR(result.newBasic) },
            { label: `New HRA (${hraPercent}% of new basic)`, value: formatINR(result.newHra) },
            { label: "New Gross (Day 1)", value: formatINR(result.newGrossDay1) },
          ].map((item) => (
            <div key={item.label} className="flex justify-between border-b border-dashed border-rule py-1.5 text-sm">
              <span className="text-ink-soft">{item.label}</span>
              <span className="tabular font-medium text-brand">{item.value}</span>
            </div>
          ))}

          <div className="mt-4 flex justify-between rounded-lg bg-brand-soft px-3 py-2.5 text-sm font-semibold">
            <span className="text-ink">Estimated Increase</span>
            <span className="tabular text-brand">
              {formatINR(result.grossIncrease)} ({result.grossIncreasePercent.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-ink-soft">
        This compares your gross pay on the day the 8th CPC is implemented (when DA resets to 0%) against your
        current gross. It excludes Transport Allowance and other components, and assumes HRA percentage slabs
        carry over unchanged — none of which is confirmed yet. Once DA starts accumulating again post-implementation,
        your gross will rise further, same as under the 7th CPC.
      </p>
    </>
  );
}
