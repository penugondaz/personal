"use client";
import { useState, useMemo } from "react";
import { formatINR, formatINRCompact } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

type FireType = "lean" | "standard" | "fat";

interface FireInputs {
  currentAge: number;
  retirementAge: number;
  currentNetWorth: string;
  monthlyInvestment: string;
  annualReturn: number;
  monthlyExpenses: string;
  inflationRate: number;
  fireType: FireType;
}

const FIRE_MULTIPLIERS: Record<FireType, number> = { lean: 20, standard: 25, fat: 35 };
const FIRE_LABELS: Record<FireType, string> = {
  lean: "Lean FIRE",
  standard: "Standard FIRE",
  fat: "Fat FIRE",
};

// ─── Calculation engine ───────────────────────────────────────────────────────

function calcFire(inputs: FireInputs) {
  const {
    currentAge, retirementAge, annualReturn, inflationRate, fireType,
  } = inputs;

  const netWorth        = Math.max(0, Number(inputs.currentNetWorth.replace(/[^0-9.]/g, "")) || 0);
  const monthlyInv      = Math.max(0, Number(inputs.monthlyInvestment.replace(/[^0-9.]/g, "")) || 0);
  const monthlyExp      = Math.max(0, Number(inputs.monthlyExpenses.replace(/[^0-9.]/g, "")) || 0);

  const years           = Math.max(1, retirementAge - currentAge);
  const months          = years * 12;
  const r               = annualReturn / 100;
  const inf             = inflationRate / 100;
  const mr              = r / 12;
  const multiplier      = FIRE_MULTIPLIERS[fireType];

  // Step 1-4: Required corpus
  const annualExp         = monthlyExp * 12;
  const futureAnnualExp   = annualExp * Math.pow(1 + inf, years);
  const requiredCorpus    = futureAnnualExp * multiplier;

  // Step 5: Future value of current net worth
  const futureNetWorth    = netWorth * Math.pow(1 + r, years);

  // Step 6: SIP future value
  const futureSIP = mr > 0
    ? monthlyInv * (((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr))
    : monthlyInv * months;

  // Step 7-10
  const projectedCorpus = futureNetWorth + futureSIP;
  const corpusGap       = Math.max(0, requiredCorpus - projectedCorpus);
  const firePercent     = Math.min(200, (projectedCorpus / requiredCorpus) * 100);
  const fireScore       = Math.min(100, firePercent);

  // Monthly SIP needed to close gap
  let additionalSipNeeded = 0;
  if (corpusGap > 0 && mr > 0 && months > 0) {
    additionalSipNeeded = corpusGap / (((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr));
  }

  // What-if scenarios
  const calcProjected = (yrOverride?: number, invOverride?: number, rOverride?: number, infOverride?: number) => {
    const y2  = yrOverride  ?? years;
    const m2  = y2 * 12;
    const r2  = (rOverride  ?? annualReturn) / 100;
    const inf2= (infOverride ?? inflationRate) / 100;
    const mr2 = r2 / 12;
    const inv2 = invOverride ?? monthlyInv;
    const fae2 = annualExp * Math.pow(1 + inf2, y2);
    const req2 = fae2 * multiplier;
    const fnw2 = netWorth * Math.pow(1 + r2, y2);
    const sip2 = mr2 > 0 ? inv2 * (((Math.pow(1 + mr2, m2) - 1) / mr2) * (1 + mr2)) : inv2 * m2;
    const proj2 = fnw2 + sip2;
    return { projected: proj2, required: req2, score: Math.min(100, (proj2 / req2) * 100) };
  };

  const scenarios = [
    {
      label: `Retire at ${retirementAge + 5}`,
      desc: "Work 5 more years",
      ...calcProjected(years + 5),
    },
    {
      label: "Increase SIP 10%",
      desc: `₹${formatINRCompact(monthlyInv * 1.1)}/mo`,
      ...calcProjected(undefined, monthlyInv * 1.1),
    },
    {
      label: "SIP +₹10,000",
      desc: `₹${formatINRCompact(monthlyInv + 10000)}/mo`,
      ...calcProjected(undefined, monthlyInv + 10000),
    },
    {
      label: "Returns drop to 10%",
      desc: "Conservative scenario",
      ...calcProjected(undefined, undefined, 10),
    },
    {
      label: "Inflation rises to 7%",
      desc: "Pessimistic scenario",
      ...calcProjected(undefined, undefined, undefined, 7),
    },
  ];

  // Insights
  const inflationImpact   = futureAnnualExp - annualExp;
  const nwContribPct      = requiredCorpus > 0 ? (futureNetWorth / requiredCorpus) * 100 : 0;
  const delay5            = calcProjected(years + 5);
  const extraSip10k       = calcProjected(undefined, monthlyInv + 10000);

  return {
    years, months, requiredCorpus, futureNetWorth, futureSIP, projectedCorpus,
    corpusGap, fireScore, firePercent, futureAnnualExp, annualExp,
    additionalSipNeeded, scenarios, inflationImpact, nwContribPct,
    delay5Corpus: delay5.projected, extra10kScore: extraSip10k.score,
    monthlyInv, netWorth,
  };
}

// ─── FIRE Score Gauge ─────────────────────────────────────────────────────────

function FireScoreGauge({ score }: { score: number }) {
  const color = score >= 100 ? "#16a34a" : score >= 75 ? "#65a30d" : score >= 50 ? "#d97706" : "#dc2626";
  const circumference = 2 * Math.PI * 40;
  const dash = (Math.min(score, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circumference}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }} />
        <text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="700" fill={color}>{Math.round(score)}</text>
        <text x="50" y="60" textAnchor="middle" fontSize="9" fill="#6b7280">/ 100</text>
      </svg>
      <p className="text-sm font-semibold mt-1" style={{ color }}>{
        score >= 100 ? "On Track! 🎉" :
        score >= 75  ? "Almost There" :
        score >= 50  ? "Good Progress" : "Needs Work"
      }</p>
    </div>
  );
}

// ─── Slider input ─────────────────────────────────────────────────────────────

function Slider({ label, value, min, max, step = 1, unit = "%", onChange }: {
  label: string; value: number; min: number; max: number;
  step?: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="tabular text-sm font-bold text-brand">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[var(--brand)]" />
      <div className="flex justify-between text-[10px] text-ink-soft mt-0.5">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </label>
  );
}

function CurrencyInput({ label, hint, value, onChange }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {hint && <span className="mb-1 block text-xs text-ink-soft">{hint}</span>}
      <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <span className="text-ink-soft text-sm">₹</span>
        <input type="text" inputMode="numeric" value={value} onChange={e => onChange(e.target.value)}
          className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
      </div>
    </label>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FireCalculator() {
  const [inputs, setInputs] = useState<FireInputs>({
    currentAge: 35,
    retirementAge: 50,
    currentNetWorth: "2000000",
    monthlyInvestment: "50000",
    annualReturn: 12,
    monthlyExpenses: "60000",
    inflationRate: 6,
    fireType: "standard",
  });

  const set = (k: keyof FireInputs) => (v: any) => setInputs(p => ({ ...p, [k]: v }));
  const result = useMemo(() => calcFire(inputs), [inputs]);

  const statusMsg =
    result.fireScore >= 100 ? "🎉 Congratulations! You are on track to achieve FIRE." :
    result.fireScore >= 75  ? "You are close to achieving FIRE. A small boost will get you there." :
    result.fireScore >= 50  ? "You are making good progress but need additional investments." :
                              "You may need significant changes to reach your FIRE goal.";

  const statusColor =
    result.fireScore >= 100 ? "text-brand" :
    result.fireScore >= 75  ? "text-brand" :
    result.fireScore >= 50  ? "text-amber-600" : "text-deduction";

  return (
    <div className="space-y-6">
      {/* ── Inputs ── */}
      <div className="rounded-2xl border border-rule bg-surface p-5 shadow-card space-y-6">

        {/* Personal */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-soft mb-4">Personal Details</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink">Current Age</span>
              <div className="flex items-center gap-2 rounded-lg border border-rule bg-paper px-3 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
                <input type="number" min={18} max={65} value={inputs.currentAge}
                  onChange={e => set("currentAge")(Math.max(18, Math.min(65, Number(e.target.value))))}
                  className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
                <span className="text-ink-soft text-xs">yrs</span>
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink">Target Retirement Age</span>
              <div className="flex items-center gap-2 rounded-lg border border-rule bg-paper px-3 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
                <input type="number" min={inputs.currentAge + 1} max={75} value={inputs.retirementAge}
                  onChange={e => set("retirementAge")(Math.max(inputs.currentAge + 1, Math.min(75, Number(e.target.value))))}
                  className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
                <span className="text-ink-soft text-xs">yrs</span>
              </div>
            </label>
          </div>
          <div className="mt-3 rounded-lg bg-brand-soft px-4 py-2 text-xs text-brand">
            ⏱ {result.years} years to retirement ({inputs.retirementAge - inputs.currentAge} year{result.years !== 1 ? "s" : ""})
          </div>
        </div>

        {/* Finances */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-soft mb-4">Current Financial Position</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <CurrencyInput label="Current Net Worth" value={inputs.currentNetWorth} onChange={set("currentNetWorth")}
              hint="MF, stocks, EPF, PPF, NPS, FD, gold. Exclude primary home." />
            <CurrencyInput label="Monthly Investment" value={inputs.monthlyInvestment} onChange={set("monthlyInvestment")}
              hint="Total SIP + any other monthly savings" />
          </div>
          <div className="mt-4">
            <Slider label="Expected Annual Return" value={inputs.annualReturn} min={5} max={20} onChange={set("annualReturn")} />
          </div>
        </div>

        {/* Expenses */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-soft mb-4">Monthly Expenses</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <CurrencyInput label="Current Monthly Expenses" value={inputs.monthlyExpenses} onChange={set("monthlyExpenses")} />
            <div className="mt-0">
              <Slider label="Inflation Rate" value={inputs.inflationRate} min={2} max={12} onChange={set("inflationRate")} />
            </div>
          </div>
        </div>

        {/* FIRE Type */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-soft mb-3">FIRE Type</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {(["lean","standard","fat"] as FireType[]).map(t => (
              <button key={t} onClick={() => set("fireType")(t)}
                className={`rounded-xl border px-4 py-3 text-left transition ${inputs.fireType === t ? "border-brand bg-brand-soft" : "border-rule bg-surface hover:border-brand/40"}`}>
                <p className={`text-sm font-semibold ${inputs.fireType === t ? "text-brand" : "text-ink"}`}>{FIRE_LABELS[t]}</p>
                <p className="text-xs text-ink-soft mt-0.5">
                  {t === "lean" ? "Minimal lifestyle · 20× expenses" :
                   t === "standard" ? "Comfortable lifestyle · 25× expenses" :
                   "Premium lifestyle · 35× expenses"}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        {/* Header */}
        <div className="brand-gradient px-6 py-6 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <FireScoreGauge score={result.fireScore} />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">FIRE Score</p>
              <p className="font-display text-5xl font-bold text-white mt-1">
                {Math.round(result.fireScore)}<span className="text-2xl text-white/60">/100</span>
              </p>
              <p className="mt-2 text-sm text-white/80">{statusMsg}</p>
            </div>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 divide-x divide-rule border-t border-rule sm:grid-cols-4">
          {[
            { label: "Required Corpus", value: formatINRCompact(result.requiredCorpus), sub: `${FIRE_LABELS[inputs.fireType]}` },
            { label: "Projected Corpus", value: formatINRCompact(result.projectedCorpus), sub: `At ${inputs.retirementAge}` },
            { label: "Corpus Gap", value: result.corpusGap > 0 ? formatINRCompact(result.corpusGap) : "₹0 ✓", sub: result.corpusGap > 0 ? "Shortfall" : "Goal achieved!" },
            { label: "Monthly Expenses at Retirement", value: formatINRCompact(result.futureAnnualExp / 12), sub: `After ${inputs.inflationRate}% inflation` },
          ].map(m => (
            <div key={m.label} className="px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{m.label}</p>
              <p className="tabular mt-1 font-display text-lg font-bold text-ink">{m.value}</p>
              <p className="text-[10px] text-ink-soft">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Additional SIP needed */}
        {result.corpusGap > 0 && (
          <div className="px-6 py-4 border-t border-rule bg-amber-50">
            <p className="text-sm font-semibold text-amber-800">
              💡 To reach your FIRE goal, invest{" "}
              <span className="text-amber-900">{formatINR(Math.round(result.additionalSipNeeded))} more per month</span>
              {" "}(total: {formatINR(Math.round(result.monthlyInv + result.additionalSipNeeded))}/mo)
            </p>
          </div>
        )}
        {result.corpusGap === 0 && (
          <div className="px-6 py-4 border-t border-rule bg-brand-soft">
            <p className="text-sm font-semibold text-brand">
              🎉 You are on track! Your projected corpus exceeds your FIRE target by {formatINRCompact(result.projectedCorpus - result.requiredCorpus)}.
            </p>
          </div>
        )}
      </div>

      {/* ── Corpus breakdown ── */}
      <div className="rounded-xl border border-rule bg-surface p-5 shadow-card">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-soft mb-4">Corpus Breakdown</p>
        <div className="space-y-3">
          {[
            { label: "Future value of current net worth", value: result.futureNetWorth, pct: result.requiredCorpus > 0 ? (result.futureNetWorth / result.requiredCorpus) * 100 : 0, color: "bg-brand" },
            { label: "Future value of monthly investments", value: result.futureSIP, pct: result.requiredCorpus > 0 ? (result.futureSIP / result.requiredCorpus) * 100 : 0, color: "bg-accent" },
          ].map(b => (
            <div key={b.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-ink-soft">{b.label}</span>
                <span className="tabular font-medium text-ink">{formatINRCompact(b.value)}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-rule overflow-hidden">
                <div className={`h-full rounded-full ${b.color}`} style={{ width: `${Math.min(100, b.pct)}%` }} />
              </div>
              <p className="text-[10px] text-ink-soft mt-0.5">{b.pct.toFixed(1)}% of required corpus</p>
            </div>
          ))}
          <div className="pt-2 border-t border-rule flex justify-between text-sm font-semibold">
            <span className="text-ink">Total Projected</span>
            <span className="tabular text-brand">{formatINRCompact(result.projectedCorpus)}</span>
          </div>
        </div>
      </div>

      {/* ── Dynamic Insights ── */}
      <div className="rounded-xl border border-rule bg-surface p-5 shadow-card">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-soft mb-4">📊 Personalised Insights</p>
        <ul className="space-y-3">
          {[
            `Inflation will increase your annual expenses from ${formatINRCompact(result.annualExp)} to ${formatINRCompact(result.futureAnnualExp)} by retirement — an impact of ${formatINRCompact(result.inflationImpact)}.`,
            `Your existing net worth contributes ${result.nwContribPct.toFixed(0)}% of your required retirement corpus.`,
            `Delaying retirement by 5 years could increase your projected corpus to ${formatINRCompact(result.delay5Corpus)} — ${formatINRCompact(result.delay5Corpus - result.projectedCorpus)} more.`,
            `Increasing your SIP by ₹10,000/month could improve your FIRE score to ${Math.round(result.extra10kScore)}/100.`,
            `You need ${formatINRCompact(result.requiredCorpus)} to fund ${result.futureAnnualExp > 0 ? (result.requiredCorpus / result.futureAnnualExp).toFixed(0) : "0"} years of retirement expenses at today&apos;s ${inputs.fireType} FIRE standard.`,
          ].map((insight, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink-soft">
              <span className="mt-0.5 shrink-0 text-brand font-bold">→</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── What-if Scenarios ── */}
      <div className="rounded-xl border border-rule bg-surface overflow-hidden shadow-card">
        <div className="px-5 py-4 border-b border-rule">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">What-If Scenarios</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: 480 }}>
            <thead><tr className="border-b border-rule bg-paper text-left">
              <th className="px-4 py-2.5 font-medium text-ink-soft">Scenario</th>
              <th className="px-4 py-2.5 text-right font-medium text-ink-soft">Projected Corpus</th>
              <th className="px-4 py-2.5 text-right font-medium text-ink-soft">FIRE Score</th>
              <th className="px-4 py-2.5 text-right font-medium text-ink-soft">vs Current</th>
            </tr></thead>
            <tbody>
              <tr className="border-b border-rule bg-brand-soft">
                <td className="px-4 py-2.5 font-semibold text-brand">Current Plan</td>
                <td className="tabular px-4 py-2.5 text-right font-semibold text-brand">{formatINRCompact(result.projectedCorpus)}</td>
                <td className="tabular px-4 py-2.5 text-right font-semibold text-brand">{Math.round(result.fireScore)}</td>
                <td className="px-4 py-2.5 text-right text-ink-soft">—</td>
              </tr>
              {result.scenarios.map(s => {
                const diff = s.projected - result.projectedCorpus;
                const scoreDiff = s.score - result.fireScore;
                return (
                  <tr key={s.label} className="border-b border-rule last:border-0 hover:bg-paper">
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-ink">{s.label}</p>
                      <p className="text-xs text-ink-soft">{s.desc}</p>
                    </td>
                    <td className="tabular px-4 py-2.5 text-right text-ink">{formatINRCompact(s.projected)}</td>
                    <td className="tabular px-4 py-2.5 text-right text-ink">{Math.round(s.score)}</td>
                    <td className={`tabular px-4 py-2.5 text-right font-medium ${diff >= 0 ? "text-brand" : "text-deduction"}`}>
                      {diff >= 0 ? "+" : ""}{formatINRCompact(diff)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
