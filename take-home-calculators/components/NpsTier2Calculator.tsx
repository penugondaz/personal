"use client";

import { useMemo, useState } from "react";
import { calculateNpsTier2 } from "@/lib/calculators/nps-tier2";
import { formatINR, formatINRCompact } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function NpsTier2Calculator() {
  const [mode, setMode] = useState<"sip" | "lumpsum">("sip");
  const [monthly, setMonthly] = useState("10000");
  const [lumpsum, setLumpsum] = useState("500000");
  const [returns, setReturns] = useState("10");
  const [years, setYears] = useState("10");
  const [isGovtEmployee, setIsGovtEmployee] = useState(false);
  const [taxSlab, setTaxSlab] = useState("30");

  const parsed = {
    monthly: Math.max(0, Number(monthly.replace(/[^0-9]/g, "")) || 0),
    lumpsum: Math.max(0, Number(lumpsum.replace(/[^0-9]/g, "")) || 0),
    returns: Math.max(0, Number(returns) || 0),
    years: Math.max(1, Number(years) || 1),
    taxSlab: Math.max(0, Number(taxSlab) || 0),
  };

  const result = useMemo(
    () =>
      calculateNpsTier2({
        investmentMode: mode,
        monthlyContribution: parsed.monthly,
        lumpsumAmount: parsed.lumpsum,
        expectedAnnualReturn: parsed.returns,
        investmentHorizonYears: parsed.years,
        isCentralGovtEmployee: isGovtEmployee,
        marginalTaxRatePercent: parsed.taxSlab,
      }),
    [mode, parsed.monthly, parsed.lumpsum, parsed.returns, parsed.years, isGovtEmployee, parsed.taxSlab]
  );

  const shareText = `My NPS Tier 2 investment could grow to ${formatINRCompact(result.corpusAtEnd)} in ${years} years. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <fieldset className="mb-4">
          <legend className="mb-1.5 text-xs text-ink-soft">Investment mode</legend>
          <div className="flex gap-2">
            <RadioPill label="Monthly (SIP-style)" active={mode === "sip"} onClick={() => setMode("sip")} />
            <RadioPill label="One-time lumpsum" active={mode === "lumpsum"} onClick={() => setMode("lumpsum")} />
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          {mode === "sip" ? (
            <MoneyField label="Monthly contribution" value={monthly} onChange={setMonthly} />
          ) : (
            <MoneyField label="Lumpsum amount" value={lumpsum} onChange={setLumpsum} />
          )}
          <TextField label="Expected annual return (%)" value={returns} onChange={setReturns} />
          <TextField label="Investment horizon (years)" value={years} onChange={setYears} />
          <TextField label="Your income tax slab rate (%)" value={taxSlab} onChange={setTaxSlab} />
        </div>

        <div className="mt-4">
          <Checkbox label="I'm a Central Government employee (eligible for 80C on Tier 2)" checked={isGovtEmployee} onChange={setIsGovtEmployee} />
        </div>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Corpus at End of {years} Years</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="tabular font-display text-4xl font-semibold text-white sm:text-5xl">
              {formatINRCompact(result.corpusAtEnd)}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/70">
            Total invested: {formatINRCompact(result.totalInvested)} · Gains: {formatINRCompact(result.totalGains)}
          </p>
        </div>

        <div className="px-6 py-5 sm:px-8">
          <LineRow label="Total invested" value={result.totalInvested} />
          <LineRow label="Total gains" value={result.totalGains} winner />
          <LineRow label={`Estimated tax on gains at withdrawal (${taxSlab}% slab)`} value={result.estimatedTaxOnGainsAtWithdrawal} deduction />
          <LineRow label="Net corpus after tax" value={result.netCorpusAfterTax} winner />

          {result.eightyCBenefitAvailable ? (
            <div className="mt-4 rounded-lg bg-brand-soft px-3 py-2.5 text-sm text-brand">
              As a Central Government employee, contributions to Tier 2 qualify for Section 80C
              (within the overall ₹1.5 lakh cap) if you accept a mandatory 3-year lock-in on
              that contribution.
            </div>
          ) : (
            <p className="mt-3 text-xs text-ink-soft">
              Tier 2 has no 80C benefit for private-sector or state government employees —
              it&apos;s a flexible, no-lock-in investment account only, unlike Tier 1.
            </p>
          )}
        </div>
      </div>

      <CalculatorActions shareTitle="My NPS Tier 2 projection" shareText={shareText} />

      <div className="mt-6 overflow-x-auto rounded-xl border border-rule">
        <table className="w-full text-sm" style={{ minWidth: 420 }}>
          <thead>
            <tr className="border-b border-rule bg-paper text-left">
              <th className="px-3 py-2 font-medium text-ink-soft">Year</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Invested</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Corpus</th>
            </tr>
          </thead>
          <tbody>
            {result.yearlyBreakdown.map((r) => (
              <tr key={r.year} className="border-b border-rule last:border-0">
                <td className="px-3 py-2 text-ink-soft">Year {r.year}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINRCompact(r.invested)}</td>
                <td className="tabular px-3 py-2 text-right font-medium text-brand">{formatINRCompact(r.corpus)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Growth is modeled like a regular SIP/lumpsum investment — actual Tier 2 returns depend on which underlying scheme (equity, corporate debt, government bonds) you allocate to.
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

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[var(--brand)]" />
      {label}
    </label>
  );
}
