"use client";
import { useState, useMemo } from "react";
import { formatINR } from "@/lib/format";

const SSY_RATE = 8.2;
const SSY_CONTRIBUTION_YEARS = 15;
const SSY_MATURITY_YEARS = 21;
const SSY_MIN_DEPOSIT = 250;
const SSY_MAX_DEPOSIT = 150_000;

function calcSsy(annualDeposit: number, girlAge: number) {
  const rate = SSY_RATE / 100;
  const clampedDeposit = Math.min(Math.max(annualDeposit, 0), SSY_MAX_DEPOSIT);
  let balance = 0;
  let totalInterest = 0;
  const breakdown: { year: number; age: number; deposit: number; interest: number; balance: number }[] = [];

  for (let year = 1; year <= SSY_MATURITY_YEARS; year++) {
    const deposit = year <= SSY_CONTRIBUTION_YEARS ? clampedDeposit : 0;
    balance += deposit;
    const interest = Math.round(balance * rate);
    balance = Math.round(balance + interest);
    totalInterest += interest;
    breakdown.push({ year, age: girlAge + year, deposit, interest, balance });
  }

  return {
    maturity: balance,
    totalInvestment: clampedDeposit * SSY_CONTRIBUTION_YEARS,
    totalInterest,
    breakdown,
  };
}

export default function SsyCalculator() {
  const [depositInput, setDepositInput] = useState("50000");
  const [ageInput, setAgeInput] = useState("5");

  const deposit = Math.min(SSY_MAX_DEPOSIT, Math.max(0, Number(depositInput.replace(/[^0-9]/g, "")) || 0));
  const girlAge = Math.min(10, Math.max(0, Number(ageInput.replace(/[^0-9]/g, "")) || 0));

  const result = useMemo(() => calcSsy(deposit, girlAge), [deposit, girlAge]);

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Annual Deposit (₹, max 1.5L)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-ink-soft">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={depositInput}
                onChange={(e) => setDepositInput(e.target.value)}
                className="tabular w-full bg-transparent text-xl font-semibold text-ink outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Girl&apos;s Current Age (years, must be ≤10 to open)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <input
                type="text"
                inputMode="numeric"
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
                className="tabular w-full bg-transparent text-xl font-semibold text-ink outline-none"
              />
            </div>
          </label>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[25000, 50000, 150000].map((v) => (
            <button
              key={v}
              onClick={() => setDepositInput(String(v))}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                deposit === v ? "border-brand bg-brand text-white" : "border-rule text-ink-soft hover:border-brand hover:text-brand"
              }`}
            >
              ₹{(v / 1000).toFixed(0)}K
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            Maturity Value (at age {girlAge + SSY_MATURITY_YEARS})
          </p>
          <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
            {formatINR(result.maturity)}
          </div>
          <p className="mt-1 text-sm text-white/70">
            After {SSY_CONTRIBUTION_YEARS} years of deposits, held to {SSY_MATURITY_YEARS}-year maturity at {SSY_RATE}% p.a.
          </p>
        </div>
        <div className="px-6 py-5 sm:px-8">
          {[
            { label: "Total invested (15 years)", value: formatINR(result.totalInvestment) },
            { label: "Total interest earned", value: formatINR(result.totalInterest) },
            { label: "80C eligible (per year, up to)", value: formatINR(Math.min(deposit, 150000)) },
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
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Deposit</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Interest</th>
              <th className="px-3 py-2 text-right font-medium text-ink-soft">Balance</th>
            </tr>
          </thead>
          <tbody>
            {result.breakdown.map((r) => (
              <tr
                key={r.year}
                className={`border-b border-rule last:border-0 ${r.year === SSY_MATURITY_YEARS ? "bg-brand-soft font-semibold" : ""}`}
              >
                <td className="px-3 py-2 text-ink-soft">
                  Year {r.year} {r.deposit === 0 && <span className="text-xs">(no deposit)</span>}
                </td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.deposit)}</td>
                <td className="tabular px-3 py-2 text-right text-ink">{formatINR(r.interest)}</td>
                <td className="tabular px-3 py-2 text-right text-brand">{formatINR(r.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Deposits stop after 15 years, but the balance keeps earning interest until the account matures 21 years
        from opening. Interest is fully tax-free (EEE status), and this uses the current {SSY_RATE}% p.a. rate,
        which the government revises quarterly.
      </p>
    </>
  );
}
