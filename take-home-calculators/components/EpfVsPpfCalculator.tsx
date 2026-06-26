"use client";

import { useState, useMemo } from "react";
import {
  calculatePfBreakup,
  projectEpfMaturity,
  EPF_INTEREST_RATE_FY2025_26,
} from "@/lib/calculators/epf";
import {
  projectPpfMaturity,
  PPF_INTEREST_RATE,
  PPF_MAX_ANNUAL_DEPOSIT,
} from "@/lib/calculators/ppf";
import { formatINR } from "@/lib/format";

export default function EpfVsPpfCalculator() {
  const [basicSalary, setBasicSalary] = useState(30000);
  const [years, setYears] = useState(20);
  const [ppfAnnual, setPpfAnnual] = useState(50000);
  const [activeTab, setActiveTab] = useState<"summary" | "yearly">("summary");

  const epf = useMemo(() => {
    const pf = calculatePfBreakup(basicSalary);
    const result = projectEpfMaturity(
      pf.employeeContribution,
      pf.employerEpfContribution,
      years
    );
    return {
      monthlyEmployee: pf.employeeContribution,
      monthlyEmployer: pf.employerEpfContribution,
      monthlyTotal: pf.employeeContribution + pf.employerEpfContribution,
      annualContribution: (pf.employeeContribution + pf.employerEpfContribution) * 12,
      totalContribution: result.totalContribution,
      totalInterest: result.totalInterest,
      maturity: result.maturityAmount,
      rate: EPF_INTEREST_RATE_FY2025_26 * 100,
    };
  }, [basicSalary, years]);

  const ppf = useMemo(() => {
    const clamped = Math.min(ppfAnnual, PPF_MAX_ANNUAL_DEPOSIT);
    const effectiveYears = Math.min(years, 15);
    const result = projectPpfMaturity(clamped, effectiveYears);
    return {
      annualDeposit: clamped,
      monthlyDeposit: Math.round(clamped / 12),
      effectiveYears,
      totalContribution: result.totalInvestment,
      totalInterest: result.totalInterest,
      maturity: result.maturityAmount,
      yearlyBreakdown: result.yearlyBreakdown,
      rate: PPF_INTEREST_RATE * 100,
    };
  }, [ppfAnnual, years]);

  const winner = epf.maturity > ppf.maturity ? "epf" : "ppf";
  const diff = Math.abs(epf.maturity - ppf.maturity);

  // Build year-by-year EPF table
  const epfYearly = useMemo(() => {
    const pf = calculatePfBreakup(basicSalary);
    const monthly = pf.employeeContribution + pf.employerEpfContribution;
    const rate = EPF_INTEREST_RATE_FY2025_26 / 12;
    let balance = 0;
    const rows = [];
    for (let y = 1; y <= years; y++) {
      const openingBalance = balance;
      const yearlyDeposit = monthly * 12;
      let yearInterest = 0;
      for (let m = 0; m < 12; m++) {
        balance += monthly;
        yearInterest += balance * rate;
      }
      balance += yearInterest;
      rows.push({
        year: y,
        deposit: yearlyDeposit,
        interest: Math.round(yearInterest),
        closing: Math.round(balance),
      });
    }
    return rows;
  }, [basicSalary, years]);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Calculator Inputs</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Basic Salary (Monthly)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-ink-soft text-sm">₹</span>
              <input type="number" value={basicSalary} min={5000} max={500000}
                onChange={e => setBasicSalary(Number(e.target.value))}
                className="w-full rounded-lg border border-rule bg-paper pl-7 pr-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
            </div>
            <p className="text-xs text-ink-soft mt-1">EPF = 12% of this amount</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              PPF Annual Deposit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-ink-soft text-sm">₹</span>
              <input type="number" value={ppfAnnual} min={500} max={150000}
                onChange={e => setPpfAnnual(Number(e.target.value))}
                className="w-full rounded-lg border border-rule bg-paper pl-7 pr-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
            </div>
            <p className="text-xs text-ink-soft mt-1">Max ₹1,50,000/year</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Investment Period: <span className="text-brand font-semibold">{years} years</span>
            </label>
            <input type="range" min={5} max={35} value={years}
              onChange={e => setYears(Number(e.target.value))}
              className="w-full accent-brand mt-2" />
            <div className="flex justify-between text-xs text-ink-soft mt-1">
              <span>5 yrs</span><span>35 yrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Winner banner */}
      <div className={`rounded-xl border p-4 text-sm font-medium ${
        winner === "epf"
          ? "border-brand/30 bg-brand-soft text-brand"
          : "border-orange-200 bg-orange-50 text-orange-700"
      }`}>
        {winner === "epf" ? "🏆 EPF" : "🏆 PPF"} builds{" "}
        <strong>{formatINR(diff)}</strong> more over {years} years.
        {winner === "epf" && " This is mainly because EPF includes an employer contribution of 3.67%."}
        {winner === "ppf" && ppf.effectiveYears < years && ` Note: PPF runs for ${ppf.effectiveYears} years (15-year lock-in applies).`}
      </div>

      {/* Side by side results */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* EPF Card */}
        <div className="rounded-xl border border-brand/20 bg-brand-soft p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-brand">EPF</h3>
            <span className="text-xs font-medium bg-brand/10 text-brand px-2 py-0.5 rounded-full">
              {epf.rate.toFixed(2)}% p.a.
            </span>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: "Your monthly contribution", value: formatINR(epf.monthlyEmployee) },
              { label: "Employer's contribution", value: formatINR(epf.monthlyEmployer) },
              { label: "Total monthly PF", value: formatINR(epf.monthlyTotal) },
              { label: "Total invested", value: formatINR(epf.totalContribution) },
              { label: "Total interest earned", value: formatINR(epf.totalInterest) },
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span className="text-ink-soft">{row.label}</span>
                <span className="tabular font-medium text-ink">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-brand/20 pt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-ink">Maturity corpus</span>
              <span className="tabular font-display text-xl font-bold text-brand">
                {formatINR(epf.maturity)}
              </span>
            </div>
          </div>
        </div>

        {/* PPF Card */}
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-orange-700">PPF</h3>
            <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
              {ppf.rate.toFixed(1)}% p.a.
            </span>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: "Annual deposit", value: formatINR(ppf.annualDeposit) },
              { label: "Monthly equivalent", value: formatINR(ppf.monthlyDeposit) },
              { label: "Lock-in period", value: `${ppf.effectiveYears} years` },
              { label: "Total invested", value: formatINR(ppf.totalContribution) },
              { label: "Total interest earned", value: formatINR(ppf.totalInterest) },
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span className="text-ink-soft">{row.label}</span>
                <span className="tabular font-medium text-ink">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-orange-200 pt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-ink">Maturity corpus</span>
              <span className="tabular font-display text-xl font-bold text-orange-700">
                {formatINR(ppf.maturity)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bar chart comparison */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-4">Corpus Comparison</h3>
        <div className="space-y-3">
          {[
            { label: "EPF Corpus", value: epf.maturity, color: "bg-brand", textColor: "text-brand" },
            { label: "PPF Corpus", value: ppf.maturity, color: "bg-orange-400", textColor: "text-orange-600" },
          ].map(item => {
            const max = Math.max(epf.maturity, ppf.maturity);
            const pct = Math.round((item.value / max) * 100);
            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ink-soft">{item.label}</span>
                  <span className={`tabular font-semibold ${item.textColor}`}>{formatINR(item.value)}</span>
                </div>
                <div className="h-5 w-full rounded-full bg-paper overflow-hidden">
                  <div className={`h-5 rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs: Summary vs Yearly breakdown */}
      <div>
        <div className="flex gap-2 mb-4">
          {(["summary", "yearly"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-brand text-white"
                  : "border border-rule text-ink-soft hover:border-brand hover:text-brand"
              }`}>
              {tab === "summary" ? "Feature Comparison" : "Year-by-Year Breakdown"}
            </button>
          ))}
        </div>

        {activeTab === "summary" && (
          <div className="overflow-hidden rounded-lg border border-rule">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper text-left">
                  <th className="px-4 py-2.5 font-medium text-ink-soft">Feature</th>
                  <th className="px-4 py-2.5 font-medium text-brand">EPF</th>
                  <th className="px-4 py-2.5 font-medium text-orange-600">PPF</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Who can use", epf: "Salaried employees only", ppf: "Any Indian resident" },
                  { feature: "Interest rate", epf: `${epf.rate.toFixed(2)}% p.a.`, ppf: `${ppf.rate.toFixed(1)}% p.a.` },
                  { feature: "Employer match", epf: "Yes — 3.67% EPF + 8.33% EPS", ppf: "No" },
                  { feature: "Contribution", epf: "12% of basic (mandatory)", ppf: "Voluntary, up to ₹1.5L/yr" },
                  { feature: "Lock-in", epf: "Until retirement/resignation", ppf: "15 years minimum" },
                  { feature: "Tax treatment", epf: "EEE (taxable >₹2.5L/yr)", ppf: "Fully EEE — no threshold" },
                  { feature: "Loan facility", epf: "Not available", ppf: "Years 3–6" },
                  { feature: "Partial withdrawal", epf: "Allowed for specific needs", ppf: "From 7th year onward" },
                ].map(row => (
                  <tr key={row.feature} className="border-b border-rule last:border-0 hover:bg-paper">
                    <td className="px-4 py-2.5 font-medium text-ink">{row.feature}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{row.epf}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{row.ppf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "yearly" && (
          <div className="overflow-x-auto rounded-lg border border-rule">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper text-left">
                  <th className="px-4 py-2.5 font-medium text-ink-soft">Year</th>
                  <th className="px-4 py-2.5 text-right font-medium text-brand">EPF Balance</th>
                  <th className="px-4 py-2.5 text-right font-medium text-brand">EPF Interest</th>
                  <th className="px-4 py-2.5 text-right font-medium text-orange-600">PPF Balance</th>
                  <th className="px-4 py-2.5 text-right font-medium text-orange-600">PPF Interest</th>
                </tr>
              </thead>
              <tbody>
                {epfYearly.map((epfRow, i) => {
                  const ppfRow = ppf.yearlyBreakdown[i];
                  return (
                    <tr key={epfRow.year} className="border-b border-rule last:border-0 hover:bg-paper">
                      <td className="px-4 py-2 font-medium text-ink">Year {epfRow.year}</td>
                      <td className="tabular px-4 py-2 text-right text-brand">{formatINR(epfRow.closing)}</td>
                      <td className="tabular px-4 py-2 text-right text-ink-soft">{formatINR(epfRow.interest)}</td>
                      <td className="tabular px-4 py-2 text-right text-orange-600">
                        {ppfRow ? formatINR(ppfRow.closingBalance) : "—"}
                      </td>
                      <td className="tabular px-4 py-2 text-right text-ink-soft">
                        {ppfRow ? formatINR(ppfRow.interestEarned) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
