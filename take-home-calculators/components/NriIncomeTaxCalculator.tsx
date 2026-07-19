"use client";

import { useMemo, useState } from "react";
import { calculateNriIncomeTax, NRI_TDS_RATES } from "@/lib/calculators/nri-tax";
import { formatINR, formatINRCompact } from "@/lib/format";
import CalculatorActions from "./CalculatorActions";

export default function NriIncomeTaxCalculator() {
  const [salary, setSalary] = useState("0");
  const [rental, setRental] = useState("360000");
  const [nroInterest, setNroInterest] = useState("150000");
  const [stcg, setStcg] = useState("0");
  const [ltcg, setLtcg] = useState("200000");
  const [other, setOther] = useState("0");
  const [deductions, setDeductions] = useState("0");

  const parsed = {
    salary: Math.max(0, Number(salary.replace(/[^0-9]/g, "")) || 0),
    rental: Math.max(0, Number(rental.replace(/[^0-9]/g, "")) || 0),
    nroInterest: Math.max(0, Number(nroInterest.replace(/[^0-9]/g, "")) || 0),
    stcg: Math.max(0, Number(stcg.replace(/[^0-9]/g, "")) || 0),
    ltcg: Math.max(0, Number(ltcg.replace(/[^0-9]/g, "")) || 0),
    other: Math.max(0, Number(other.replace(/[^0-9]/g, "")) || 0),
    deductions: Math.max(0, Number(deductions.replace(/[^0-9]/g, "")) || 0),
  };

  const result = useMemo(
    () =>
      calculateNriIncomeTax({
        salaryIncome: parsed.salary,
        rentalIncome: parsed.rental,
        nroInterestIncome: parsed.nroInterest,
        shortTermCapitalGains: parsed.stcg,
        longTermCapitalGains: parsed.ltcg,
        otherIncome: parsed.other,
        oldRegimeDeductions: parsed.deductions,
      }),
    [parsed.salary, parsed.rental, parsed.nroInterest, parsed.stcg, parsed.ltcg, parsed.other, parsed.deductions]
  );

  const winner = result[result.betterRegime];
  const shareText = `My India tax liability as an NRI: ${formatINR(winner.totalTaxPayable)} under the ${result.betterRegime} regime. Check yours:`;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">India-Sourced Income Only</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <MoneyField label="Salary for services rendered in India" value={salary} onChange={setSalary} />
          <MoneyField label="Rental income (India property)" value={rental} onChange={setRental} />
          <MoneyField label="NRO account / FD interest" value={nroInterest} onChange={setNroInterest} />
          <MoneyField label="Other India income" value={other} onChange={setOther} />
          <MoneyField label="Short-term capital gains (equity, ≤12 months)" value={stcg} onChange={setStcg} />
          <MoneyField label="Long-term capital gains (equity, &gt;12 months)" value={ltcg} onChange={setLtcg} />
        </div>
        <div className="mt-4">
          <MoneyField label="Deductions you'll claim (80C, 80D etc. — old regime only)" value={deductions} onChange={setDeductions} />
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          NRE and FCNR account interest is fully tax-exempt in India — don&apos;t include it here.
        </p>
      </div>

      <div className="print-card relative overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            Better Regime: {result.betterRegime === "new" ? "New" : "Old"}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="tabular font-display text-4xl font-semibold text-white sm:text-5xl">
              {formatINR(winner.totalTaxPayable)}
            </span>
            <span className="text-base font-normal text-white/70">total tax</span>
          </div>
          <p className="mt-1 text-sm text-white/70">
            You save {formatINR(result.savings)} vs the other regime · Effective rate: {winner.effectiveTaxRate.toFixed(1)}%
          </p>
        </div>

        <div className="px-6 py-5 sm:px-8">
          <div className="grid grid-cols-2 gap-6">
            <RegimeColumn title="New Regime" data={result.new} highlighted={result.betterRegime === "new"} />
            <RegimeColumn title="Old Regime" data={result.old} highlighted={result.betterRegime === "old"} />
          </div>

          <div className="mt-5 rounded-lg bg-brand-soft px-3 py-2.5 text-sm text-brand">
            No Section 87A rebate applies to NRIs under either regime — even if your taxable
            income falls below the resident rebate threshold, you still pay slab-rate tax on it.
          </div>
        </div>
      </div>

      <CalculatorActions shareTitle="My NRI India tax liability" shareText={shareText} />

      <div className="mt-6 overflow-x-auto rounded-xl border border-rule">
        <table className="w-full text-sm" style={{ minWidth: 480 }}>
          <thead>
            <tr className="border-b border-rule bg-paper text-left">
              <th className="px-3 py-2 font-medium text-ink-soft">Income Type</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Typical TDS Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-rule">
              <td className="px-3 py-2 text-ink-soft">NRO interest</td>
              <td className="tabular px-3 py-2 text-right text-ink">{NRI_TDS_RATES.nroInterest}%</td>
            </tr>
            <tr className="border-b border-rule">
              <td className="px-3 py-2 text-ink-soft">Rent paid by tenant (Section 195)</td>
              <td className="tabular px-3 py-2 text-right text-ink">{NRI_TDS_RATES.rentPaidByTenant}%</td>
            </tr>
            <tr className="border-b border-rule">
              <td className="px-3 py-2 text-ink-soft">Property sale — long-term gains</td>
              <td className="tabular px-3 py-2 text-right text-ink">{NRI_TDS_RATES.propertySaleLTCG}%</td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-ink-soft">Property sale — short-term gains</td>
              <td className="tabular px-3 py-2 text-right text-ink">{NRI_TDS_RATES.propertySaleSTCG}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        TDS rates are indicative and deducted at source by the payer — if your actual tax liability (shown above) is lower, you can claim a refund by filing an ITR. DTAA benefits, if applicable, aren&apos;t modeled here.
      </p>
    </div>
  );
}

function RegimeColumn({ title, data, highlighted }: { title: string; data: ReturnType<typeof calculateNriIncomeTax>["new"]; highlighted: boolean }) {
  return (
    <div>
      <p className={`text-sm font-semibold ${highlighted ? "text-brand" : "text-ink"}`}>
        {title}
        {highlighted && " ✓"}
      </p>
      <div className="mt-2 space-y-1 text-xs">
        <Row label="Standard deduction" value={data.standardDeduction} />
        <Row label="Deductions applied" value={data.deductionsApplied} />
        <Row label="Ordinary taxable income" value={data.ordinaryTaxableIncome} />
        <Row label="Slab tax" value={data.slabTaxOnOrdinaryIncome} />
        <Row label="LTCG tax" value={data.ltcgTax} />
        <Row label="STCG tax" value={data.stcgTax} />
        <Row label="Surcharge" value={data.surcharge} />
        <Row label="Cess (4%)" value={data.cess} />
        <div className="mt-1.5 flex justify-between border-t border-rule pt-1.5 font-semibold text-ink">
          <span>Total tax</span>
          <span className="tabular">{formatINRCompact(data.totalTaxPayable)}</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-ink-soft">
      <span>{label}</span>
      <span className="tabular">{formatINRCompact(value)}</span>
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
