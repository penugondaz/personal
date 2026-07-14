"use client";
import { useState, useMemo } from "react";
import { calculateXIRR, getRating, type CashFlow } from "@/lib/calculators/xirr-engine";
import { formatINR, formatINRCompact } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "quick" | "advanced" | "surrender" | "estimate-surrender";

interface QuickInputs {
  annualPremium: string;
  premiumTerm: string;
  maturityAmount: string;
  startDate: string;
}

interface AdvancedRow {
  id: number;
  date: string;
  type: string;
  amount: string;
}

interface SurrenderInputs {
  premiumPaid: string;
  surrenderValue: string;
  futurePremium: string;
  futurePremiumYears: string;
  maturityValue: string;
  yearsRemaining: string;
  altRate: string;
}

interface EstimateInputs {
  planCode: string;
  sumAssured: string;
  policyTerm: string;
  annualPremium: string;
  yearsCompleted: string;
  survivalBenefitsPaid: string;
}

// ─── LIC Bonus Data (Valuation 31-03-2025) ───────────────────────────────────

interface SrbSlab {
  termMin: number;
  termMax: number;
  baseRate: number;
  extraRate5L: number;
  extraRate10L?: number;
}

interface LicPlan {
  code: string;
  name: string;
  type: string;
  srb: SrbSlab[];
}

const LIC_PLANS_DATA: LicPlan[] = [
  { code: "714", name: "New Endowment (714)", type: "endowment",
    srb: [
      { termMin: 12, termMax: 15, baseRate: 35, extraRate5L: 1 },
      { termMin: 16, termMax: 20, baseRate: 39, extraRate5L: 1 },
      { termMin: 21, termMax: 99, baseRate: 45, extraRate5L: 1 },
    ]},
  { code: "715", name: "New Jeevan Anand (715)", type: "endowment",
    srb: [
      { termMin: 15, termMax: 15, baseRate: 38, extraRate5L: 1 },
      { termMin: 16, termMax: 20, baseRate: 42, extraRate5L: 1 },
      { termMin: 21, termMax: 99, baseRate: 46, extraRate5L: 1 },
    ]},
  { code: "717", name: "Single Premium Endowment (717)", type: "endowment",
    srb: [
      { termMin: 10, termMax: 15, baseRate: 38, extraRate5L: 1 },
      { termMin: 16, termMax: 20, baseRate: 43, extraRate5L: 1 },
      { termMin: 21, termMax: 99, baseRate: 48, extraRate5L: 1 },
    ]},
  { code: "733", name: "Jeevan Lakshya (733)", type: "endowment",
    srb: [
      { termMin: 13, termMax: 15, baseRate: 38, extraRate5L: 1 },
      { termMin: 16, termMax: 20, baseRate: 42, extraRate5L: 1 },
      { termMin: 21, termMax: 99, baseRate: 46, extraRate5L: 1 },
    ]},
  { code: "736", name: "Jeevan Labh (736)", type: "endowment",
    srb: [
      { termMin: 16, termMax: 16, baseRate: 40, extraRate5L: 1, extraRate10L: 2 },
      { termMin: 21, termMax: 21, baseRate: 44, extraRate5L: 1, extraRate10L: 2 },
      { termMin: 25, termMax: 25, baseRate: 47, extraRate5L: 1, extraRate10L: 2 },
    ]},
  { code: "720", name: "Money Back 20yr (720)", type: "moneyback",
    srb: [{ termMin: 20, termMax: 20, baseRate: 36, extraRate5L: 1 }]},
  { code: "721", name: "Money Back 25yr (721)", type: "moneyback",
    srb: [{ termMin: 25, termMax: 25, baseRate: 41, extraRate5L: 1 }]},
  { code: "732", name: "Children Money Back (732)", type: "moneyback",
    srb: [
      { termMin: 13, termMax: 15, baseRate: 35, extraRate5L: 1 },
      { termMin: 16, termMax: 20, baseRate: 39, extraRate5L: 1 },
      { termMin: 21, termMax: 99, baseRate: 45, extraRate5L: 1 },
    ]},
  { code: "734", name: "Jeevan Tarun (734)", type: "moneyback",
    srb: [
      { termMin: 13, termMax: 15, baseRate: 35, extraRate5L: 1 },
      { termMin: 16, termMax: 20, baseRate: 39, extraRate5L: 1 },
      { termMin: 21, termMax: 99, baseRate: 45, extraRate5L: 1 },
    ]},
  { code: "745", name: "Jeevan Umang (745)", type: "wholelife",
    srb: [
      { termMin: 15, termMax: 20, baseRate: 40, extraRate5L: 1 },
      { termMin: 21, termMax: 30, baseRate: 44, extraRate5L: 1 },
      { termMin: 31, termMax: 99, baseRate: 46, extraRate5L: 1 },
    ]},
];

// GSV factors (%) by policy year — IRDAI mandated
const GSV_FACTORS: Record<number, number> = {
  1: 0, 2: 0, 3: 30, 4: 50, 5: 50, 6: 50, 7: 50,
  8: 55, 9: 55, 10: 55, 11: 60, 12: 60, 13: 60,
  14: 65, 15: 65, 16: 65, 17: 70, 18: 70, 19: 70,
  20: 70, 21: 75, 22: 75, 23: 75, 24: 80, 25: 80,
};

// FAB rates per ₹1000 SA by policy duration (2025)
const FAB_RATES = [
  { minDuration: 40, rateBelow2L: 3000, rateAbove2L: 3550 },
  { minDuration: 35, rateBelow2L: 1850, rateAbove2L: 2300 },
  { minDuration: 30, rateBelow2L: 900,  rateAbove2L: 1100 },
  { minDuration: 25, rateBelow2L: 330,  rateAbove2L: 450  },
  { minDuration: 20, rateBelow2L: 40,   rateAbove2L: 70   },
  { minDuration: 15, rateBelow2L: 10,   rateAbove2L: 20   },
];

function getSRBRate(planCode: string, term: number, sumAssured: number): number {
  const plan = LIC_PLANS_DATA.find(p => p.code === planCode);
  if (!plan) return 40;
  const slab = plan.srb.find(s => term >= s.termMin && term <= s.termMax)
    ?? plan.srb[plan.srb.length - 1];
  let rate = slab.baseRate;
  if (sumAssured >= 1_000_000 && slab.extraRate10L != null) rate += slab.extraRate10L;
  else if (sumAssured >= 500_000) rate += slab.extraRate5L;
  return rate;
}

function getGSVFactor(year: number): number {
  return GSV_FACTORS[Math.min(year, 25)] ?? 80;
}

function getFAB(policyTerm: number, sumAssured: number): number {
  if (policyTerm < 15) return 0;
  const fab = FAB_RATES.find(f => policyTerm >= f.minDuration);
  if (!fab) return 0;
  const ratePerThousand = sumAssured >= 200_000 ? fab.rateAbove2L : fab.rateBelow2L;
  return Math.round((ratePerThousand / 1000) * sumAssured);
}

function computeEstimate(inputs: EstimateInputs) {
  const sa        = Number(inputs.sumAssured) || 0;
  const term      = Number(inputs.policyTerm) || 0;
  const premium   = Number(inputs.annualPremium) || 0;
  const yearsComp = Number(inputs.yearsCompleted) || 0;
  const survPaid  = Number(inputs.survivalBenefitsPaid) || 0;

  if (!sa || !term || !premium || !yearsComp) return null;

  const srbRate       = getSRBRate(inputs.planCode, term, sa);
  const accruedBonus  = Math.round((srbRate / 1000) * sa * yearsComp);
  const totalPremiums = premium * yearsComp;
  const gsvFactor     = getGSVFactor(yearsComp);
  const gsv           = Math.max(0, Math.round((totalPremiums * gsvFactor / 100) - survPaid));
  const paidUpValue   = Math.round((yearsComp / term) * sa);
  // LIC uses ~30% for bonus surrender factor in SSV
  const ssv           = Math.round(paidUpValue + accruedBonus * 0.30);
  const surrenderValue= Math.max(gsv, ssv);
  const method        = gsv >= ssv ? "GSV" : "SSV";
  const fabAtMaturity = getFAB(term, sa);

  return {
    srbRate, accruedBonus, totalPremiums, gsvFactor, gsv, paidUpValue,
    ssv, surrenderValue, method, fabAtMaturity,
    planName: LIC_PLANS_DATA.find(p => p.code === inputs.planCode)?.name ?? `Plan ${inputs.planCode}`,
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FLOW_TYPES = [
  { label: "Premium Paid",         sign: -1 },
  { label: "Survival Benefit",     sign:  1 },
  { label: "Money Back Benefit",   sign:  1 },
  { label: "Policy Loan Received", sign:  1 },
  { label: "Partial Withdrawal",   sign:  1 },
  { label: "Maturity Benefit",     sign:  1 },
  { label: "Surrender Value",      sign:  1 },
  { label: "Death Benefit",        sign:  1 },
];

const BENCHMARKS = [
  { label: "PPF",     rate: 0.071  },
  { label: "EPF",     rate: 0.0825 },
  { label: "FD",      rate: 0.065  },
  { label: "NPS",     rate: 0.10   },
  { label: "Nifty 50",rate: 0.12   },
];

const QUICK_FILL_PLANS = [
  { label: "— Select a plan to prefill —",  premium: "", term: "", maturity: "" },
  { label: "Jeevan Anand (20yr, ₹50k/yr)",  premium: "50000",  term: "20", maturity: "1500000" },
  { label: "Jeevan Labh (25yr, ₹30k/yr)",   premium: "30000",  term: "25", maturity: "1200000" },
  { label: "Jeevan Umang (30yr, ₹40k/yr)",  premium: "40000",  term: "30", maturity: "1800000" },
  { label: "New Endowment (15yr, ₹60k/yr)", premium: "60000",  term: "15", maturity: "1100000" },
  { label: "Money Back 20yr (₹50k/yr)",     premium: "50000",  term: "20", maturity: "1000000" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(s: string): Date | null {
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
function parseAmt(s: string): number { return Math.abs(Number(s.replace(/[^0-9.]/g, "")) || 0); }
function pct(r: number) { return (r * 100).toFixed(2) + "%"; }
function today() { return new Date().toISOString().slice(0, 10); }

// ─── Quick mode compute ───────────────────────────────────────────────────────

function computeQuick(inputs: QuickInputs) {
  const premium  = parseAmt(inputs.annualPremium);
  const term     = parseInt(inputs.premiumTerm) || 0;
  const maturity = parseAmt(inputs.maturityAmount);
  const start    = parseDate(inputs.startDate);
  if (!premium || !term || !maturity || !start) return null;

  const flows: CashFlow[] = [];
  for (let i = 0; i < term; i++) {
    const d = new Date(start);
    d.setFullYear(d.getFullYear() + i);
    flows.push({ date: d, amount: -premium });
  }
  const matDate = new Date(start);
  matDate.setFullYear(matDate.getFullYear() + term);
  flows.push({ date: matDate, amount: maturity });

  const xirr = calculateXIRR(flows);
  const totalPremium = premium * term;
  return { xirr, totalPremium, totalBenefits: maturity, netProfit: maturity - totalPremium, flows };
}

// ─── Advanced mode compute ────────────────────────────────────────────────────

function computeAdvanced(rows: AdvancedRow[]) {
  const flows: CashFlow[] = [];
  for (const row of rows) {
    const d = parseDate(row.date);
    const a = parseAmt(row.amount);
    const sign = FLOW_TYPES.find(t => t.label === row.type)?.sign ?? 1;
    if (!d || !a) continue;
    flows.push({ date: d, amount: sign * a });
  }
  if (flows.length < 2) return null;
  const xirr = calculateXIRR(flows);
  const totalPremium   = flows.filter(f => f.amount < 0).reduce((s, f) => s + Math.abs(f.amount), 0);
  const totalBenefits  = flows.filter(f => f.amount > 0).reduce((s, f) => s + f.amount, 0);
  return { xirr, totalPremium, totalBenefits, netProfit: totalBenefits - totalPremium, flows };
}

// ─── Surrender mode compute ───────────────────────────────────────────────────

function computeSurrender(inputs: SurrenderInputs) {
  const surrender   = parseAmt(inputs.surrenderValue);
  const futPremium  = parseAmt(inputs.futurePremium);
  const futYears    = parseInt(inputs.futurePremiumYears) || 0;
  const maturity    = parseAmt(inputs.maturityValue);
  const yrsLeft     = parseInt(inputs.yearsRemaining) || 0;
  const altRate     = (parseFloat(inputs.altRate) || 12) / 100;

  if (!surrender || !maturity || !yrsLeft) return null;

  const continueValue = maturity;
  let altValue = surrender * Math.pow(1 + altRate, yrsLeft);
  for (let i = 0; i < Math.min(futYears, yrsLeft); i++) {
    altValue += futPremium * Math.pow(1 + altRate, yrsLeft - i);
  }
  const diff   = altValue - continueValue;
  const better = diff > 0 ? "surrender" : "continue";

  const now = new Date();
  const futFlows: CashFlow[] = [{ date: now, amount: -surrender }];
  for (let i = 0; i < futYears && i < yrsLeft; i++) {
    const d = new Date(now);
    d.setFullYear(d.getFullYear() + i + 1);
    futFlows.push({ date: d, amount: -futPremium });
  }
  const matDate = new Date(now);
  matDate.setFullYear(matDate.getFullYear() + yrsLeft);
  futFlows.push({ date: matDate, amount: maturity });
  const continueXirr = calculateXIRR(futFlows);

  return { continueValue, altValue, diff, better, continueXirr, altRate };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabBtn({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick}
      className={`flex-1 rounded-xl px-2 py-2.5 text-xs font-medium transition sm:text-sm ${active
        ? "bg-brand text-white shadow-card"
        : "text-ink-soft hover:bg-brand-soft hover:text-brand"}`}>
      {children}
    </button>
  );
}

function Field({ label, hint, children }: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {hint && <span className="mb-1 block text-xs text-ink-soft">{hint}</span>}
      {children}
    </label>
  );
}

function Input({ prefix, value, onChange, type = "text", placeholder, inputMode }: {
  prefix?: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2.5
      focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
      {prefix && <span className="shrink-0 text-ink-soft text-sm">{prefix}</span>}
      <input type={type} inputMode={inputMode} value={value}
        onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-soft/50" />
    </div>
  );
}

function ResultCard({ xirr, totalPremium, totalBenefits, netProfit }: {
  xirr: number | null; totalPremium: number; totalBenefits: number; netProfit: number;
}) {
  if (xirr === null) return (
    <div className="mt-6 rounded-xl border border-rule bg-surface p-5 text-center text-sm text-ink-soft">
      Could not calculate XIRR. Ensure cashflows have both premiums and benefits.
    </div>
  );

  const rating = getRating(xirr);
  const absReturn = totalPremium > 0 ? ((totalBenefits - totalPremium) / totalPremium) * 100 : 0;

  return (
    <div className="mt-6 space-y-4">
      <div className="overflow-hidden rounded-2xl border shadow-card-lg" style={{ borderColor: rating.color + "40" }}>
        <div className="px-6 py-6 sm:px-8" style={{ background: rating.bg }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: rating.color }}>Your XIRR</p>
              <p className="font-display text-5xl font-bold mt-1" style={{ color: rating.color }}>{pct(xirr)}</p>
              <p className="mt-1 text-sm text-ink-soft">{rating.description}</p>
            </div>
            <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold"
              style={{ background: rating.color, color: "white" }}>
              {rating.label}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-rule border-t border-rule sm:grid-cols-4">
          {[
            { label: "Total Premiums",  value: formatINRCompact(totalPremium),  sub: "paid" },
            { label: "Total Benefits",  value: formatINRCompact(totalBenefits), sub: "received" },
            { label: "Net Profit",      value: formatINRCompact(netProfit),     sub: netProfit >= 0 ? "gain" : "loss" },
            { label: "Absolute Return", value: absReturn.toFixed(1) + "%",      sub: "total" },
          ].map(s => (
            <div key={s.label} className="px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{s.label}</p>
              <p className={`tabular font-display text-lg font-semibold mt-0.5
                ${s.label === "Net Profit" && netProfit < 0 ? "text-deduction" : "text-ink"}`}>
                {s.value}
              </p>
              <p className="text-[10px] text-ink-soft">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-rule bg-surface overflow-hidden">
        <div className="border-b border-rule px-5 py-3">
          <p className="text-sm font-semibold text-ink">How your return compares</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule bg-paper text-left">
              <th className="px-4 py-2 font-medium text-ink-soft">Investment</th>
              <th className="px-4 py-2 text-right font-medium text-ink-soft">Return</th>
              <th className="px-4 py-2 text-right font-medium text-ink-soft">Difference</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-rule bg-brand-soft">
              <td className="px-4 py-2 font-semibold text-brand">Your LIC Policy</td>
              <td className="tabular px-4 py-2 text-right font-bold text-brand">{pct(xirr)}</td>
              <td className="px-4 py-2 text-right text-ink-soft">—</td>
            </tr>
            {BENCHMARKS.map(b => {
              const diff = xirr - b.rate;
              return (
                <tr key={b.label} className="border-b border-rule last:border-0 hover:bg-paper">
                  <td className="px-4 py-2 text-ink">{b.label}</td>
                  <td className="tabular px-4 py-2 text-right text-ink">{pct(b.rate)}</td>
                  <td className={`tabular px-4 py-2 text-right font-medium
                    ${diff >= 0 ? "text-brand" : "text-deduction"}`}>
                    {diff >= 0 ? "+" : ""}{(diff * 100).toFixed(2)}pp
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-rule bg-surface px-5 py-4 text-sm text-ink-soft leading-relaxed">
        <p className="font-semibold text-ink mb-1">📊 What this means</p>
        <p>
          {xirr < 0.04
            ? `Your policy returned ${pct(xirr)} annually — below inflation. In real terms, your money has lost purchasing power.`
            : xirr < 0.071
            ? `Your policy returned ${pct(xirr)} annually — below PPF (7.1%), a risk-free government instrument. The life cover partly explains this gap.`
            : xirr < 0.10
            ? `Your policy returned ${pct(xirr)} annually — in line with PPF/EPF. Decent for a traditional insurance product.`
            : `Your policy returned ${pct(xirr)} annually — an excellent result. Verify inputs including survival benefits and bonuses.`}
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LicXirrCalculator() {
  const [mode, setMode] = useState<Mode>("quick");

  // Quick mode
  const [quick, setQuick] = useState<QuickInputs>({
    annualPremium: "50000", premiumTerm: "20",
    maturityAmount: "1500000", startDate: "2005-01-01",
  });
  const setQ = (k: keyof QuickInputs) => (v: string) => setQuick(p => ({ ...p, [k]: v }));

  // Advanced mode
  const [rows, setRows] = useState<AdvancedRow[]>([
    { id: 1, date: "2005-01-01", type: "Premium Paid",     amount: "50000" },
    { id: 2, date: "2006-01-01", type: "Premium Paid",     amount: "50000" },
    { id: 3, date: "2025-01-01", type: "Maturity Benefit", amount: "1500000" },
  ]);
  const addRow = () => setRows(r => [...r, { id: Date.now(), date: today(), type: "Premium Paid", amount: "" }]);
  const removeRow = (id: number) => setRows(r => r.filter(x => x.id !== id));
  const updateRow = (id: number, k: keyof AdvancedRow, v: string) =>
    setRows(r => r.map(x => x.id === id ? { ...x, [k]: v } : x));

  // Surrender mode
  const [surr, setSurr] = useState<SurrenderInputs>({
    premiumPaid: "600000", surrenderValue: "450000",
    futurePremium: "50000", futurePremiumYears: "5",
    maturityValue: "1500000", yearsRemaining: "5", altRate: "12",
  });
  const setS = (k: keyof SurrenderInputs) => (v: string) => setSurr(p => ({ ...p, [k]: v }));

  // Estimate surrender mode
  const [est, setEst] = useState<EstimateInputs>({
    planCode: "715", sumAssured: "500000", policyTerm: "20",
    annualPremium: "30000", yearsCompleted: "10", survivalBenefitsPaid: "0",
  });
  const setE = (k: keyof EstimateInputs) => (v: string) => setEst(p => ({ ...p, [k]: v }));

  // Compute
  const quickResult = useMemo(() => mode === "quick"    ? computeQuick(quick)     : null, [mode, quick]);
  const advResult   = useMemo(() => mode === "advanced" ? computeAdvanced(rows)   : null, [mode, rows]);
  const surrResult  = useMemo(() => mode === "surrender"? computeSurrender(surr)  : null, [mode, surr]);
  const estResult   = useMemo(() => mode === "estimate-surrender" ? computeEstimate(est) : null, [mode, est]);

  const prefillPlan = (plan: typeof QUICK_FILL_PLANS[0]) => {
    if (!plan.premium) return;
    setQuick(q => ({ ...q, annualPremium: plan.premium, premiumTerm: plan.term, maturityAmount: plan.maturity }));
    setMode("quick");
  };

  return (
    <div>
      {/* Plan quick-fill */}
      <div className="mb-6 rounded-xl border border-rule bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">
          Quick fill — common LIC plans
        </p>
        <select onChange={e => prefillPlan(QUICK_FILL_PLANS[Number(e.target.value)])}
          className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink
            outline-none focus:border-brand">
          {QUICK_FILL_PLANS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
        </select>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 rounded-xl border border-rule bg-paper p-1 mb-6">
        <TabBtn active={mode === "quick"}               onClick={() => setMode("quick")}>⚡ Quick</TabBtn>
        <TabBtn active={mode === "advanced"}            onClick={() => setMode("advanced")}>📋 Advanced</TabBtn>
        <TabBtn active={mode === "surrender"}           onClick={() => setMode("surrender")}>⚖️ Continue vs Surrender</TabBtn>
        <TabBtn active={mode === "estimate-surrender"}  onClick={() => setMode("estimate-surrender")}>🔍 Estimate Surrender Value</TabBtn>
      </div>

      {/* ── Quick mode ── */}
      {mode === "quick" && (
        <div>
          <div className="rounded-2xl border border-rule bg-surface p-5 shadow-card">
            <h3 className="font-semibold text-ink mb-4">Policy Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Annual Premium (₹)">
                <Input prefix="₹" value={quick.annualPremium} onChange={setQ("annualPremium")}
                  inputMode="numeric" placeholder="50,000" />
              </Field>
              <Field label="Premium Paying Term (years)">
                <Input value={quick.premiumTerm} onChange={setQ("premiumTerm")}
                  inputMode="numeric" placeholder="20" />
              </Field>
              <Field label="Expected Maturity Amount (₹)"
                hint="Include bonuses and survival benefits if known">
                <Input prefix="₹" value={quick.maturityAmount} onChange={setQ("maturityAmount")}
                  inputMode="numeric" placeholder="15,00,000" />
              </Field>
              <Field label="Policy Start Date">
                <Input type="date" value={quick.startDate} onChange={setQ("startDate")} />
              </Field>
            </div>
          </div>
          {quickResult
            ? <ResultCard {...quickResult} />
            : <p className="mt-4 text-center text-xs text-ink-soft">Fill in all fields to see results</p>}
        </div>
      )}

      {/* ── Advanced mode ── */}
      {mode === "advanced" && (
        <div>
          <div className="rounded-2xl border border-rule bg-surface shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-rule flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">Cashflow Entries</p>
                <p className="text-xs text-ink-soft mt-0.5">
                  Enter each premium (−) and benefit (+) as a separate row with its exact date
                </p>
              </div>
              <button onClick={addRow}
                className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white
                  hover:opacity-90 transition">
                + Add Row
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 560 }}>
                <thead>
                  <tr className="border-b border-rule bg-paper text-left">
                    <th className="px-3 py-2 font-medium text-ink-soft w-36">Date</th>
                    <th className="px-3 py-2 font-medium text-ink-soft">Type</th>
                    <th className="px-3 py-2 font-medium text-ink-soft w-36">Amount (₹)</th>
                    <th className="px-3 py-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => {
                    const sign = FLOW_TYPES.find(t => t.label === row.type)?.sign ?? 1;
                    return (
                      <tr key={row.id} className="border-b border-rule last:border-0">
                        <td className="px-2 py-1.5">
                          <input type="date" value={row.date}
                            onChange={e => updateRow(row.id, "date", e.target.value)}
                            className="w-full rounded border border-rule bg-paper px-2 py-1.5
                              text-xs text-ink outline-none focus:border-brand" />
                        </td>
                        <td className="px-2 py-1.5">
                          <select value={row.type}
                            onChange={e => updateRow(row.id, "type", e.target.value)}
                            className="w-full rounded border border-rule bg-paper px-2 py-1.5
                              text-xs text-ink outline-none focus:border-brand">
                            {FLOW_TYPES.map(t => <option key={t.label}>{t.label}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <div className={`flex items-center gap-1 rounded border px-2 py-1.5 text-xs
                            focus-within:border-brand
                            ${sign < 0 ? "border-deduction/40 bg-deduction/5" : "border-brand/40 bg-brand-soft"}`}>
                            <span className={`font-bold ${sign < 0 ? "text-deduction" : "text-brand"}`}>
                              {sign < 0 ? "−" : "+"}
                            </span>
                            <input type="text" inputMode="numeric" value={row.amount}
                              onChange={e => updateRow(row.id, "amount", e.target.value)}
                              placeholder="0"
                              className="w-full bg-transparent text-ink outline-none" />
                          </div>
                        </td>
                        <td className="px-2 py-1.5">
                          <button onClick={() => removeRow(row.id)}
                            className="flex h-7 w-7 items-center justify-center rounded text-ink-soft
                              hover:bg-deduction/10 hover:text-deduction transition text-base">
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-rule bg-paper text-xs text-ink-soft">
              {rows.length} cashflow{rows.length !== 1 ? "s" : ""} — Premiums are negative outflows,
              benefits are positive inflows
            </div>
          </div>
          {advResult
            ? <ResultCard {...advResult} />
            : <p className="mt-4 text-center text-xs text-ink-soft">
                Add at least one premium and one benefit to calculate
              </p>}
        </div>
      )}

      {/* ── Continue vs Surrender mode ── */}
      {mode === "surrender" && (
        <div>
          <div className="rounded-2xl border border-rule bg-surface p-5 shadow-card">
            <h3 className="font-semibold text-ink mb-1">Policy Status Today</h3>
            <p className="text-xs text-ink-soft mb-4">
              Don&apos;t know your surrender value?{" "}
              <button onClick={() => setMode("estimate-surrender")}
                className="text-brand underline underline-offset-2 hover:no-underline">
                Estimate it first →
              </button>
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Total Premium Paid So Far (₹)">
                <Input prefix="₹" value={surr.premiumPaid} onChange={setS("premiumPaid")} inputMode="numeric" />
              </Field>
              <Field label="Current Surrender Value (₹)"
                hint="Get this from LIC portal / agent, or estimate using the 4th tab">
                <Input prefix="₹" value={surr.surrenderValue} onChange={setS("surrenderValue")} inputMode="numeric" />
              </Field>
              <Field label="Future Annual Premium (₹)">
                <Input prefix="₹" value={surr.futurePremium} onChange={setS("futurePremium")} inputMode="numeric" />
              </Field>
              <Field label="Years of Future Premiums Remaining">
                <Input value={surr.futurePremiumYears} onChange={setS("futurePremiumYears")} inputMode="numeric" />
              </Field>
              <Field label="Expected Maturity Value (₹)">
                <Input prefix="₹" value={surr.maturityValue} onChange={setS("maturityValue")} inputMode="numeric" />
              </Field>
              <Field label="Years to Maturity">
                <Input value={surr.yearsRemaining} onChange={setS("yearsRemaining")} inputMode="numeric" />
              </Field>
              <Field label="Alternative Investment Return (%)"
                hint="Expected return from MF, PPF, FD etc.">
                <Input prefix="%" value={surr.altRate} onChange={setS("altRate")} inputMode="decimal" />
              </Field>
            </div>
          </div>

          {surrResult && (
            <div className="mt-6 space-y-4">
              <div className={`overflow-hidden rounded-2xl border shadow-card-lg
                ${surrResult.better === "surrender" ? "border-brand/30" : "border-amber-400/30"}`}>
                <div className={`px-6 py-5
                  ${surrResult.better === "surrender" ? "bg-brand-soft" : "bg-amber-50"}`}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                    Recommendation
                  </p>
                  <p className={`font-display text-2xl font-bold mt-1
                    ${surrResult.better === "surrender" ? "text-brand" : "text-amber-700"}`}>
                    {surrResult.better === "surrender"
                      ? "Surrendering may be better"
                      : "Continuing may be better"}
                  </p>
                  <p className="text-sm text-ink-soft mt-1">
                    {surrResult.better === "surrender"
                      ? `Investing the surrender value + future premiums elsewhere could give you ${formatINRCompact(surrResult.diff)} more at maturity.`
                      : `Continuing the policy could give you ${formatINRCompact(Math.abs(surrResult.diff))} more than surrendering and investing.`}
                  </p>
                </div>
                <div className="grid grid-cols-2 divide-x divide-rule border-t border-rule sm:grid-cols-3">
                  <div className="px-5 py-4">
                    <p className="text-xs text-ink-soft">Continue LIC</p>
                    <p className="tabular font-display text-xl font-bold text-ink mt-1">
                      {formatINRCompact(surrResult.continueValue)}
                    </p>
                    {surrResult.continueXirr !== null && (
                      <p className="text-xs text-brand mt-0.5">XIRR: {pct(surrResult.continueXirr)}</p>
                    )}
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-xs text-ink-soft">Alternative at {surr.altRate}%</p>
                    <p className="tabular font-display text-xl font-bold text-ink mt-1">
                      {formatINRCompact(surrResult.altValue)}
                    </p>
                    <p className="text-xs text-ink-soft mt-0.5">annualised return</p>
                  </div>
                  <div className="px-5 py-4 col-span-2 sm:col-span-1">
                    <p className="text-xs text-ink-soft">Difference</p>
                    <p className={`tabular font-display text-xl font-bold mt-1
                      ${surrResult.diff > 0 ? "text-brand" : "text-deduction"}`}>
                      {surrResult.diff > 0 ? "+" : ""}{formatINRCompact(surrResult.diff)}
                    </p>
                    <p className="text-xs text-ink-soft mt-0.5">
                      in favour of {surrResult.diff > 0 ? "alternative" : "LIC"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-rule bg-surface px-5 py-4 text-sm text-ink-soft">
                <p className="font-semibold text-ink mb-1">⚠ Important caveats</p>
                <p>This model assumes the alternative consistently delivers {surr.altRate}% annually —
                  not guaranteed for equity. LIC provides life cover and guaranteed maturity.
                  Consider your risk tolerance, tax implications (LTCG, Section 10(10D)), and
                  insurance needs before surrendering. Consult a fee-only financial planner.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Estimate Surrender Value mode ── */}
      {mode === "estimate-surrender" && (
        <div>
          <div className="rounded-2xl border border-rule bg-surface p-5 shadow-card">
            <h3 className="font-semibold text-ink mb-1">Estimate Your Surrender Value</h3>
            <p className="text-xs text-ink-soft mb-4">
              Uses 2025 LIC bonus rates (SRB) and IRDAI-mandated GSV formula.
              Result is an estimate — actual value may vary by ±10%.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="LIC Plan">
                <select value={est.planCode} onChange={e => setE("planCode")(e.target.value)}
                  className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm
                    text-ink outline-none focus:border-brand">
                  {LIC_PLANS_DATA.map(p => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Sum Assured (₹)" hint="The SA printed on your policy document">
                <Input prefix="₹" value={est.sumAssured} onChange={setE("sumAssured")} inputMode="numeric" />
              </Field>
              <Field label="Policy Term (years)">
                <Input value={est.policyTerm} onChange={setE("policyTerm")} inputMode="numeric" />
              </Field>
              <Field label="Annual Premium (₹)" hint="Excluding GST / service tax">
                <Input prefix="₹" value={est.annualPremium} onChange={setE("annualPremium")} inputMode="numeric" />
              </Field>
              <Field label="Years Completed (premiums paid)">
                <Input value={est.yearsCompleted} onChange={setE("yearsCompleted")} inputMode="numeric" />
              </Field>
              <Field label="Survival Benefits Already Received (₹)"
                hint="Money-back payouts received so far. Enter 0 for endowment plans.">
                <Input prefix="₹" value={est.survivalBenefitsPaid} onChange={setE("survivalBenefitsPaid")} inputMode="numeric" />
              </Field>
            </div>
          </div>

          {estResult && (
            <div className="mt-6 space-y-4">
              {/* Main result */}
              <div className="overflow-hidden rounded-2xl border border-brand/20 bg-brand-soft shadow-card-lg">
                <div className="px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand">
                    Estimated Surrender Value
                  </p>
                  <p className="font-display text-4xl font-bold text-brand mt-1">
                    {formatINR(estResult.surrenderValue)}
                  </p>
                  <p className="text-sm text-ink-soft mt-1">
                    Based on {estResult.method} (higher of GSV and SSV) — {estResult.planName}
                  </p>
                </div>
                <div className="grid grid-cols-2 divide-x divide-rule border-t border-rule sm:grid-cols-4">
                  {[
                    { label: "GSV",           value: formatINR(estResult.gsv),         sub: `${estResult.gsvFactor}% of premiums` },
                    { label: "SSV",           value: formatINR(estResult.ssv),         sub: "paid-up + bonus×30%" },
                    { label: "Accrued Bonus", value: formatINR(estResult.accruedBonus),sub: `₹${estResult.srbRate}/1000 SA/yr` },
                    { label: "FAB at Maturity",value: formatINR(estResult.fabAtMaturity), sub: "if you continue till end" },
                  ].map(s => (
                    <div key={s.label} className="px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{s.label}</p>
                      <p className="tabular font-display text-base font-semibold mt-0.5 text-ink">{s.value}</p>
                      <p className="text-[10px] text-ink-soft mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakdown */}
              <div className="rounded-xl border border-rule bg-surface p-5">
                <p className="font-semibold text-ink mb-3">How this is calculated</p>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Total premiums paid",       value: formatINR(estResult.totalPremiums) },
                    { label: `GSV factor (year ${est.yearsCompleted})`, value: `${estResult.gsvFactor}%` },
                    { label: "Guaranteed Surrender Value (GSV)", value: formatINR(estResult.gsv), bold: true },
                    { label: "─" , value: "" },
                    { label: "Paid-up value",             value: formatINR(estResult.paidUpValue) },
                    { label: `Accrued bonus (₹${estResult.srbRate}/1000 SA × ${est.yearsCompleted} yrs)`, value: formatINR(estResult.accruedBonus) },
                    { label: "Bonus surrender factor",    value: "~30%" },
                    { label: "Special Surrender Value (SSV)", value: formatINR(estResult.ssv), bold: true },
                    { label: "─", value: "" },
                    { label: "Surrender Value = max(GSV, SSV)", value: formatINR(estResult.surrenderValue), highlight: true },
                  ].map((row, i) => row.label === "─"
                    ? <div key={i} className="border-t border-rule my-1" />
                    : (
                      <div key={row.label} className={`flex justify-between pb-1.5 border-b border-rule last:border-0
                        ${row.highlight ? "font-bold" : ""}`}>
                        <span className={row.highlight ? "text-brand" : row.bold ? "text-ink" : "text-ink-soft"}>
                          {row.label}
                        </span>
                        <span className={`tabular ${row.highlight ? "text-brand" : "text-ink"}`}>{row.value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Use in surrender tab CTA */}
              <div className="rounded-xl border border-brand/20 bg-brand-soft p-4 text-sm">
                <p className="font-semibold text-ink mb-1">Next step</p>
                <p className="text-ink-soft mb-3">
                  Use this estimated surrender value of{" "}
                  <strong className="text-brand">{formatINR(estResult.surrenderValue)}</strong>{" "}
                  in the Continue vs Surrender tab to decide whether surrendering makes financial sense.
                </p>
                <button
                  onClick={() => {
                    setSurr(s => ({ ...s, surrenderValue: String(estResult.surrenderValue) }));
                    setMode("surrender");
                  }}
                  className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white
                    hover:opacity-90 transition">
                  Use this value in Continue vs Surrender →
                </button>
              </div>

              <p className="text-xs text-ink-soft">
                Bonus rates from LIC valuation as at 31-03-2025. GSV formula per IRDAI regulations.
                SSV uses a 30% bonus surrender factor which is an estimate — actual SSV may differ.
                Final surrender value can only be confirmed by LIC. This tool is for indicative
                purposes only and not a substitute for official LIC communication.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
