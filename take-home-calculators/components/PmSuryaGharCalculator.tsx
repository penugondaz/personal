"use client";

import { useState, useMemo } from "react";
import { formatINR } from "@/lib/format";

// ── Subsidy rules (as of FY 2025-26) ─────────────────────────────────────────
const SUBSIDY_PER_KW_UPTO_2KW = 30_000;
const SUBSIDY_PER_KW_2TO3KW = 18_000;
const MAX_CAPACITY_KW = 3;

// ── State electricity rates (₹/unit, approximate avg) ────────────────────────
const STATE_RATES: Record<string, { rate: number; label: string }> = {
  MH: { rate: 8.5,  label: "Maharashtra" },
  DL: { rate: 7.0,  label: "Delhi" },
  KA: { rate: 7.5,  label: "Karnataka" },
  TN: { rate: 5.5,  label: "Tamil Nadu" },
  GJ: { rate: 5.0,  label: "Gujarat" },
  RJ: { rate: 7.0,  label: "Rajasthan" },
  UP: { rate: 6.5,  label: "Uttar Pradesh" },
  WB: { rate: 7.5,  label: "West Bengal" },
  AP: { rate: 6.5,  label: "Andhra Pradesh" },
  TS: { rate: 7.0,  label: "Telangana" },
  KL: { rate: 5.0,  label: "Kerala" },
  MP: { rate: 6.5,  label: "Madhya Pradesh" },
  HR: { rate: 7.0,  label: "Haryana" },
  PB: { rate: 6.0,  label: "Punjab" },
  BR: { rate: 6.5,  label: "Bihar" },
  OD: { rate: 5.5,  label: "Odisha" },
  JH: { rate: 6.0,  label: "Jharkhand" },
  CG: { rate: 5.5,  label: "Chhattisgarh" },
  HP: { rate: 5.0,  label: "Himachal Pradesh" },
  UK: { rate: 5.5,  label: "Uttarakhand" },
  OTHER: { rate: 6.5, label: "Other State" },
};

// ── Solar generation (units/kW/day, India average) ────────────────────────────
const UNITS_PER_KW_PER_DAY = 4;
const SYSTEM_COST_PER_KW = 65_000; // avg installed cost
const PANEL_LIFETIME_YEARS = 25;
const MAINTENANCE_ANNUAL = 3_000; // per kW per year

function calcSubsidy(capacityKw: number): number {
  const capped = Math.min(capacityKw, MAX_CAPACITY_KW);
  if (capped <= 2) return capped * SUBSIDY_PER_KW_UPTO_2KW;
  return 2 * SUBSIDY_PER_KW_UPTO_2KW + (capped - 2) * SUBSIDY_PER_KW_2TO3KW;
}

export default function PmSuryaGharCalculator() {
  const [monthlyUnits, setMonthlyUnits] = useState(300);
  const [stateCode, setStateCode] = useState("MH");
  const [roofArea, setRoofArea] = useState(200);

  const result = useMemo(() => {
    const { rate } = STATE_RATES[stateCode];

    // Recommended capacity based on consumption
    const dailyUnits = monthlyUnits / 30;
    const recommendedKw = Math.min(
      Math.ceil((dailyUnits / UNITS_PER_KW_PER_DAY) * 10) / 10,
      MAX_CAPACITY_KW
    );

    // Roof-based capacity limit (approx 10 sq ft per 100W = 100 sq ft per kW)
    const roofCapacityKw = Math.floor(roofArea / 100);
    const finalCapacityKw = Math.min(recommendedKw, Math.max(roofCapacityKw, 1), MAX_CAPACITY_KW);

    // Cost and subsidy
    const grossCost = finalCapacityKw * SYSTEM_COST_PER_KW;
    const subsidy = calcSubsidy(finalCapacityKw);
    const netCost = grossCost - subsidy;

    // Generation and savings
    const monthlyGeneration = finalCapacityKw * UNITS_PER_KW_PER_DAY * 30;
    const unitsExported = Math.max(0, monthlyGeneration - monthlyUnits);
    const unitsConsumed = Math.min(monthlyGeneration, monthlyUnits);
    const monthlySavings = unitsConsumed * rate;
    const annualSavings = monthlySavings * 12;

    // Free units — scheme gives 300 units/month free for up to 3kW
    const freeUnitsPerMonth = Math.min(finalCapacityKw * 100, 300);
    const freeUnitsValue = freeUnitsPerMonth * rate;

    // Payback
    const annualMaintenance = finalCapacityKw * MAINTENANCE_ANNUAL;
    const netAnnualBenefit = annualSavings - annualMaintenance;
    const paybackYears = netCost / netAnnualBenefit;

    // 25-year projection
    const totalSavings25 = netAnnualBenefit * PANEL_LIFETIME_YEARS - netCost;

    return {
      recommendedKw: finalCapacityKw,
      grossCost,
      subsidy,
      netCost,
      monthlyGeneration: Math.round(monthlyGeneration),
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      freeUnitsPerMonth: Math.round(freeUnitsPerMonth),
      freeUnitsValue: Math.round(freeUnitsValue),
      paybackYears: Math.round(paybackYears * 10) / 10,
      totalSavings25: Math.round(totalSavings25),
      electricityRate: rate,
      unitsExported: Math.round(unitsExported),
    };
  }, [monthlyUnits, stateCode, roofArea]);

  return (
    <div className="space-y-8">

      {/* Inputs */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-ink mb-5">Your Details</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Monthly Electricity Usage
            </label>
            <div className="relative">
              <input type="number" value={monthlyUnits} min={50} max={2000}
                onChange={e => setMonthlyUnits(Number(e.target.value))}
                className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none pr-16" />
              <span className="absolute right-3 top-2 text-xs text-ink-soft">units/mo</span>
            </div>
            <p className="text-xs text-ink-soft mt-1">Check your electricity bill</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">State</label>
            <select value={stateCode}
              onChange={e => setStateCode(e.target.value)}
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none">
              {Object.entries(STATE_RATES).map(([code, { label }]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
            <p className="text-xs text-ink-soft mt-1">
              Rate: ₹{STATE_RATES[stateCode].rate}/unit
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Available Roof Area
            </label>
            <div className="relative">
              <input type="number" value={roofArea} min={50} max={1000}
                onChange={e => setRoofArea(Number(e.target.value))}
                className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none pr-12" />
              <span className="absolute right-3 top-2 text-xs text-ink-soft">sq ft</span>
            </div>
            <p className="text-xs text-ink-soft mt-1">Shadow-free area on roof</p>
          </div>
        </div>
      </div>

      {/* Recommended system */}
      <div className="rounded-xl border border-brand/20 bg-brand-soft p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand mb-1">
          Recommended Solar System
        </p>
        <p className="font-display text-4xl font-bold text-brand">
          {result.recommendedKw} kW
        </p>
        <p className="text-sm text-ink-soft mt-1">
          Generates ~{result.monthlyGeneration} units/month · covers {Math.min(100, Math.round((result.monthlyGeneration / monthlyUnits) * 100))}% of your usage
        </p>
      </div>

      {/* Cost breakdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "System Cost", value: formatINR(result.grossCost), sub: `${result.recommendedKw}kW × ₹65,000`, color: "text-ink" },
          { label: "Govt Subsidy", value: formatINR(result.subsidy), sub: "PM Surya Ghar scheme", color: "text-brand" },
          { label: "Your Cost", value: formatINR(result.netCost), sub: "After subsidy", color: "text-deduction" },
        ].map(card => (
          <div key={card.label} className="rounded-xl border border-rule bg-surface p-4 shadow-card">
            <p className="text-xs text-ink-soft">{card.label}</p>
            <p className={`tabular mt-1 font-display text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-ink-soft mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Savings breakdown */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-4">Monthly Savings Breakdown</h3>
        <div className="space-y-3">
          {[
            { label: "Units generated per month", value: `${result.monthlyGeneration} units`, highlight: false },
            { label: "Free units under scheme", value: `${result.freeUnitsPerMonth} units`, highlight: false },
            { label: "Monthly electricity bill saved", value: formatINR(result.monthlySavings), highlight: true },
            { label: "Annual savings", value: formatINR(result.annualSavings), highlight: true },
            { label: "Payback period", value: `${result.paybackYears} years`, highlight: false },
            { label: "Net savings over 25 years", value: formatINR(result.totalSavings25), highlight: true },
          ].map(row => (
            <div key={row.label} className={`flex justify-between py-2 border-b border-rule last:border-0 ${row.highlight ? "font-medium" : ""}`}>
              <span className="text-sm text-ink-soft">{row.label}</span>
              <span className={`tabular text-sm ${row.highlight ? "text-brand font-semibold" : "text-ink"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subsidy slab table */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-3">Subsidy Slabs (Central Government)</h3>
        <div className="overflow-hidden rounded-lg border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft">System Capacity</th>
                <th className="px-4 py-2.5 font-medium text-ink-soft">Subsidy Rate</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">Max Subsidy</th>
              </tr>
            </thead>
            <tbody>
              {[
                { capacity: "Up to 2 kW", rate: "₹30,000 per kW", max: "₹60,000", highlight: result.recommendedKw <= 2 },
                { capacity: "2 kW to 3 kW", rate: "₹18,000 per kW (additional)", max: "₹18,000", highlight: result.recommendedKw > 2 },
                { capacity: "Above 3 kW", rate: "No additional subsidy", max: "₹78,000 total", highlight: false },
              ].map(row => (
                <tr key={row.capacity} className={`border-b border-rule last:border-0 ${row.highlight ? "bg-brand-soft" : ""}`}>
                  <td className="px-4 py-2.5 font-medium text-ink">{row.capacity}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{row.rate}</td>
                  <td className="tabular px-4 py-2.5 text-right text-brand font-medium">{row.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink-soft mt-2">
          * Additional state-level subsidies may apply. Check your state&apos;s DISCOM website.
        </p>
      </div>

      {/* Eligibility checklist */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-3">Eligibility Checklist</h3>
        <ul className="space-y-2">
          {[
            "Indian citizen with a valid residential electricity connection",
            "Own the property (or have owner's consent for rooftop installation)",
            "Electricity connection in the applicant's name",
            "Annual household income — no upper limit (all categories eligible)",
            "System must be installed through MNRE-empanelled vendor",
            "Net metering connection from your DISCOM",
          ].map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
              <span className="mt-0.5 text-brand">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* How to apply */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-3">How to Apply</h3>
        <ol className="space-y-3">
          {[
            { step: "1", text: "Register at pmsuryaghar.gov.in with your electricity consumer number" },
            { step: "2", text: "Apply for rooftop solar — select your DISCOM and fill in details" },
            { step: "3", text: "Get feasibility approval from DISCOM (usually 3–7 days)" },
            { step: "4", text: "Select an empanelled vendor and get the system installed" },
            { step: "5", text: "Submit installation report and apply for net meter" },
            { step: "6", text: "After net meter installation, submit bank details for subsidy" },
            { step: "7", text: "Subsidy credited to bank account within 30 days" },
          ].map(item => (
            <li key={item.step} className="flex items-start gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white text-xs font-bold">
                {item.step}
              </span>
              <span className="text-ink-soft pt-0.5">{item.text}</span>
            </li>
          ))}
        </ol>
      </div>

    </div>
  );
}
