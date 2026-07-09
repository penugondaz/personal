"use client";
import { useState, useMemo } from "react";
import { formatINR } from "@/lib/format";

const SCSS_RATE = 8.2;
const SCSS_TENURE_YEARS = 5;
const SCSS_MIN_DEPOSIT = 1_000;
const SCSS_MAX_DEPOSIT = 3_000_000;

function calcScss(principal: number) {
  const clamped = Math.min(Math.max(principal, 0), SCSS_MAX_DEPOSIT);
  const quarterlyInterest = Math.round((clamped * (SCSS_RATE / 100)) / 4);
  const totalQuarters = SCSS_TENURE_YEARS * 4;
  const totalInterest = quarterlyInterest * totalQuarters;

  const breakdown: { year: number; quarterlyPayout: number; annualPayout: number }[] = [];
  for (let year = 1; year <= SCSS_TENURE_YEARS; year++) {
    breakdown.push({ year, quarterlyPayout: quarterlyInterest, annualPayout: quarterlyInterest * 4 });
  }

  return { quarterlyInterest, totalInterest, principalReturned: clamped, breakdown };
}

export default function ScssCalculator() {
  const [principalInput, setPrincipalInput] = useState("1500000");
  const principal = Math.min(SCSS_MAX_DEPOSIT, Math.max(0, Number(principalInput.replace(/[^0-9]/g, "")) || 0));
  const result = useMemo(() => calcScss(principal), [principal]);

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Deposit Amount (₹, max 30L)</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-ink-soft">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={principalInput}
              onChange={(e) => setPrincipalInput(e.target.value)}
              className="tabular w-full bg-transparent text-xl font-semibold text-ink outline-none"
            />
          </div>
        </label>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[500000, 1500000, 3000000].map((v) => (
            <button
              key={v}
              onClick={() => setPrincipalInput(String(v))}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                principal === v ? "border-brand bg-brand text-white" : "border-rule text-ink-soft hover:border-brand hover:text-brand"
              }`}
            >
              ₹{(v / 100000).toFixed(0)}L
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Quarterly Payout</p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.quarterlyInterest)}
          </div>
          <p className="mt-1 text-sm text-white/70">
            Paid every quarter to your linked account, at {SCSS_RATE}% p.a. — not reinvested or compounded.
          </p>
        </div>
        <div className="px-6 py-5 sm:px-8">
          {[
            { label: "Principal deposited", value: formatINR(result.principalReturned) },
            { label: `Total interest (${SCSS_TENURE_YEARS} years)`, value: formatINR(result.totalInterest) },
            { label: "Principal returned at maturity", value: formatINR(result.principalReturned) },
          ].map((item) => (
            <div key={item.label} className="flex justify-between border-b border-dashed border-rule py-1.5 text-sm">
              <span className="text-ink-soft">{item.label}</span>
              <span className="tabular font-medium text-ink">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-rule">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule bg-paper text-left">
              <th className="px-3 py-2 font-medium text-ink-soft">Year</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Per Quarter</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Annual Payout</th>
            </tr>
          </thead>
          <tbody>
            {result.breakdown.map((r) => (
              <tr key={r.year} className="border-b border-rule last:border-0">
                <td className="px-3 py-2 text-ink-soft">Year {r.year}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.quarterlyPayout)}</td>
                <td className="tabular px-3 py-2 text-right text-brand">{formatINR(r.annualPayout)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        SCSS interest is paid out quarterly, not compounded — it doesn&apos;t add back to your principal. It&apos;s
        fully taxable at your slab rate, and TDS applies if total interest exceeds ₹50,000/year. Available to
        those 60+ (55+ for retirees under VRS).
      </p>
    </>
  );
}
