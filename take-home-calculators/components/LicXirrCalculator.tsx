"use client";
import { useState, useMemo, useCallback } from "react";
import { calculateXIRR, getRating, type CashFlow } from "@/lib/calculators/xirr-engine";
import { formatINR, formatINRCompact } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "quick" | "advanced" | "surrender";

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

// ─── Constants ────────────────────────────────────────────────────────────────

const FLOW_TYPES = [
  { label: "Premium Paid",        sign: -1 },
  { label: "Survival Benefit",    sign:  1 },
  { label: "Money Back Benefit",  sign:  1 },
  { label: "Policy Loan Received",sign:  1 },
  { label: "Partial Withdrawal",  sign:  1 },
  { label: "Maturity Benefit",    sign:  1 },
  { label: "Surrender Value",     sign:  1 },
  { label: "Death Benefit",       sign:  1 },
];

const BENCHMARKS = [
  { label: "PPF",    rate: 0.071  },
  { label: "EPF",    rate: 0.0825 },
  { label: "FD",     rate: 0.065  },
  { label: "NPS",    rate: 0.10   },
  { label: "Nifty 50", rate: 0.12 },
];

const LIC_PLANS = [
  { label: "— Select a plan (optional) —", premium: "", term: "", maturity: "" },
  { label: "LIC Jeevan Anand (20yr, ₹50k)", premium: "50000", term: "20", maturity: "1500000" },
  { label: "LIC Jeevan Labh (25yr, ₹30k)",  premium: "30000", term: "25", maturity: "1200000" },
  { label: "LIC Jeevan Umang (30yr, ₹40k)", premium: "40000", term: "30", maturity: "1800000" },
  { label: "LIC New Endowment (15yr, ₹60k)",premium: "60000", term: "15", maturity: "1100000" },
  { label: "LIC Money Back (20yr, ₹50k)",   premium: "50000", term: "20", maturity: "1000000" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(s: string): Date | null {
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
function parseAmt(s: string): number { return Math.abs(Number(s.replace(/[^0-9.]/g, "")) || 0); }
function pct(r: number) { return (r * 100).toFixed(2) + "%"; }
function today() { return new Date().toISOString().slice(0, 10); }
function addYears(dateStr: string, y: number): string {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + y);
  return d.toISOString().slice(0, 10);
}

// ─── Quick mode compute ───────────────────────────────────────────────────────

function computeQuick(inputs: QuickInputs) {
  const premium = parseAmt(inputs.annualPremium);
  const term    = parseInt(inputs.premiumTerm) || 0;
  const maturity= parseAmt(inputs.maturityAmount);
  const start   = parseDate(inputs.startDate);
  if (!premium || !term || !maturity || !start) return null;

  const flows: CashFlow[] = [];
  for (let i = 0; i < term; i++) {
    const d = new Date(start);
    d.setFullYear(d.getFullYear() + i);
    flows.push({ date: d, amount: -premium });
  }
  // Maturity on start + term years
  const matDate = new Date(start);
  matDate.setFullYear(matDate.getFullYear() + term);
  flows.push({ date: matDate, amount: maturity });

  const xirr = calculateXIRR(flows);
  const totalPremium = premium * term;
  const netProfit = maturity - totalPremium;
  return { xirr, totalPremium, totalBenefits: maturity, netProfit, flows };
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
  const totalPremium = flows.filter(f => f.amount < 0).reduce((s, f) => s + Math.abs(f.amount), 0);
  const totalBenefits = flows.filter(f => f.amount > 0).reduce((s, f) => s + f.amount, 0);
  return { xirr, totalPremium, totalBenefits, netProfit: totalBenefits - totalPremium, flows };
}

// ─── Surrender mode compute ───────────────────────────────────────────────────

function computeSurrender(inputs: SurrenderInputs) {
  const paidSoFar   = parseAmt(inputs.premiumPaid);
  const surrender   = parseAmt(inputs.surrenderValue);
  const futPremium  = parseAmt(inputs.futurePremium);
  const futYears    = parseInt(inputs.futurePremiumYears) || 0;
  const maturity    = parseAmt(inputs.maturityValue);
  const yrsLeft     = parseInt(inputs.yearsRemaining) || 0;
  const altRate     = (parseFloat(inputs.altRate) || 12) / 100;

  if (!surrender || !maturity || !yrsLeft) return null;

  // Scenario A — continue: maturity value at end
  const continueValue = maturity;

  // Scenario B — surrender and invest
  // Step 1: surrender value grows for yrsLeft years
  let altValue = surrender * Math.pow(1 + altRate, yrsLeft);
  // Step 2: future premiums NOT paid get invested each year
  for (let i = 0; i < Math.min(futYears, yrsLeft); i++) {
    altValue += futPremium * Math.pow(1 + altRate, yrsLeft - i);
  }

  const diff = altValue - continueValue;
  const better = diff > 0 ? "surrender" : "continue";

  // XIRR for continue scenario (simplified from today)
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

  return { continueValue, altValue, diff, better, continueXirr, altRate, paidSoFar };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active
        ? "bg-brand text-white shadow-card"
        : "text-ink-soft hover:bg-brand-soft hover:text-brand"}`}>
      {children}
    </button>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
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
  type?: string; placeholder?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
      {prefix && <span className="shrink-0 text-ink-soft text-sm">{prefix}</span>}
      <input type={type} inputMode={inputMode} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-soft/50" />
    </div>
  );
}

function ResultCard({ xirr, totalPremium, totalBenefits, netProfit }: {
  xirr: number | null; totalPremium: number; totalBenefits: number; netProfit: number;
}) {
  if (xirr === null) return (
    <div className="mt-6 rounded-xl border border-rule bg-surface p-5 text-center text-sm text-ink-soft">
      Could not calculate XIRR. Please ensure cashflows have both premiums paid and benefits received.
    </div>
  );

  const rating = getRating(xirr);
  const absReturn = totalPremium > 0 ? ((totalBenefits - totalPremium) / totalPremium) * 100 : 0;

  return (
    <div className="mt-6 space-y-4">
      {/* Main result */}
      <div className="overflow-hidden rounded-2xl border shadow-card-lg" style={{ borderColor: rating.color + "40" }}>
        <div className="px-6 py-6 sm:px-8" style={{ background: rating.bg }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: rating.color }}>Your XIRR</p>
              <p className="font-display text-5xl font-bold mt-1" style={{ color: rating.color }}>{pct(xirr)}</p>
              <p className="mt-1 text-sm text-ink-soft">{rating.description}</p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold" style={{ background: rating.color, color: "white" }}>
                {rating.label}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-rule border-t border-rule sm:grid-cols-4">
          {[
            { label: "Total Premiums", value: formatINRCompact(totalPremium), sub: "paid" },
            { label: "Total Benefits", value: formatINRCompact(totalBenefits), sub: "received" },
            { label: "Net Profit",     value: formatINRCompact(netProfit),     sub: netProfit >= 0 ? "gain" : "loss" },
            { label: "Absolute Return",value: absReturn.toFixed(1) + "%",       sub: "total" },
          ].map(s => (
            <div key={s.label} className="px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{s.label}</p>
              <p className={`tabular font-display text-lg font-semibold mt-0.5 ${netProfit < 0 && s.label === "Net Profit" ? "text-deduction" : "text-ink"}`}>{s.value}</p>
              <p className="text-[10px] text-ink-soft">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmark comparison */}
      <div className="rounded-xl border border-rule bg-surface overflow-hidden">
        <div className="border-b border-rule px-5 py-3">
          <p className="text-sm font-semibold text-ink">How your return compares</p>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-rule bg-paper text-left">
            <th className="px-4 py-2 font-medium text-ink-soft">Investment</th>
            <th className="px-4 py-2 text-right font-medium text-ink-soft">Return</th>
            <th className="px-4 py-2 text-right font-medium text-ink-soft">Difference</th>
          </tr></thead>
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
                  <td className={`tabular px-4 py-2 text-right font-medium ${diff >= 0 ? "text-brand" : "text-deduction"}`}>
                    {diff >= 0 ? "+" : ""}{(diff * 100).toFixed(2)}pp
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dynamic insight */}
      <div className="rounded-xl border border-rule bg-surface px-5 py-4 text-sm text-ink-soft leading-relaxed">
        <p className="font-semibold text-ink mb-1">📊 What this means</p>
        <p>
          {xirr < 0.04
            ? `Your policy returned ${pct(xirr)} annually — below inflation. In real terms, your money has lost purchasing power over the policy term.`
            : xirr < 0.071
            ? `Your policy returned ${pct(xirr)} annually. This is below what you would have earned in PPF (7.1%) — a completely risk-free government instrument. The life cover component partly explains this gap.`
            : xirr < 0.10
            ? `Your policy returned ${pct(xirr)} annually — roughly in line with PPF and EPF. The return is decent for a traditional insurance product, but equity-linked options would likely have earned more over the same period.`
            : `Your policy returned ${pct(xirr)} annually — an excellent result for a traditional insurance policy. Verify your inputs, particularly survival benefits and bonus amounts, to ensure accuracy.`}
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LicXirrCalculator() {
  const [mode, setMode] = useState<Mode>("quick");

  // Quick mode state
  const [quick, setQuick] = useState<QuickInputs>({
    annualPremium: "50000", premiumTerm: "20",
    maturityAmount: "1500000", startDate: "2005-01-01",
  });
  const setQ = (k: keyof QuickInputs) => (v: string) => setQuick(p => ({ ...p, [k]: v }));

  // Advanced mode state
  const [rows, setRows] = useState<AdvancedRow[]>([
    { id: 1, date: "2005-01-01", type: "Premium Paid",    amount: "50000" },
    { id: 2, date: "2006-01-01", type: "Premium Paid",    amount: "50000" },
    { id: 3, date: "2025-01-01", type: "Maturity Benefit",amount: "1500000" },
  ]);
  const addRow = () => setRows(r => [...r, { id: Date.now(), date: today(), type: "Premium Paid", amount: "" }]);
  const removeRow = (id: number) => setRows(r => r.filter(x => x.id !== id));
  const updateRow = (id: number, k: keyof AdvancedRow, v: string) =>
    setRows(r => r.map(x => x.id === id ? { ...x, [k]: v } : x));

  // Surrender state
  const [surr, setSurr] = useState<SurrenderInputs>({
    premiumPaid: "600000", surrenderValue: "450000",
    futurePremium: "50000", futurePremiumYears: "5",
    maturityValue: "1500000", yearsRemaining: "5", altRate: "12",
  });
  const setS = (k: keyof SurrenderInputs) => (v: string) => setSurr(p => ({ ...p, [k]: v }));

  // Compute
  const quickResult   = useMemo(() => mode === "quick"    ? computeQuick(quick)      : null, [mode, quick]);
  const advResult     = useMemo(() => mode === "advanced" ? computeAdvanced(rows)    : null, [mode, rows]);
  const surrResult    = useMemo(() => mode === "surrender"? computeSurrender(surr)   : null, [mode, surr]);

  // LIC plan prefill
  const prefillPlan = (plan: typeof LIC_PLANS[0]) => {
    if (!plan.premium) return;
    setQuick(q => ({ ...q, annualPremium: plan.premium, premiumTerm: plan.term, maturityAmount: plan.maturity }));
    setMode("quick");
  };

  return (
    <div>
      {/* Plan selector */}
      <div className="mb-6 rounded-xl border border-rule bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">Quick fill — common LIC plans</p>
        <select onChange={e => prefillPlan(LIC_PLANS[Number(e.target.value)])}
          className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-brand">
          {LIC_PLANS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
        </select>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 rounded-xl border border-rule bg-paper p-1 mb-6">
        <TabBtn active={mode === "quick"}     onClick={() => setMode("quick")}>⚡ Quick Calculator</TabBtn>
        <TabBtn active={mode === "advanced"}  onClick={() => setMode("advanced")}>📋 Advanced Cashflows</TabBtn>
        <TabBtn active={mode === "surrender"} onClick={() => setMode("surrender")}>⚖️ Continue vs Surrender</TabBtn>
      </div>

      {/* ── Quick mode ── */}
      {mode === "quick" && (
        <div>
          <div className="rounded-2xl border border-rule bg-surface p-5 shadow-card">
            <h3 className="font-semibold text-ink mb-4">Policy Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Annual Premium (₹)">
                <Input prefix="₹" value={quick.annualPremium} onChange={setQ("annualPremium")} inputMode="numeric" placeholder="50,000" />
              </Field>
              <Field label="Premium Paying Term (years)">
                <Input value={quick.premiumTerm} onChange={setQ("premiumTerm")} inputMode="numeric" placeholder="20" />
              </Field>
              <Field label="Maturity Amount (₹)" hint="Include bonuses, survival benefits, and any additions">
                <Input prefix="₹" value={quick.maturityAmount} onChange={setQ("maturityAmount")} inputMode="numeric" placeholder="15,00,000" />
              </Field>
              <Field label="Policy Start Date">
                <Input type="date" value={quick.startDate} onChange={setQ("startDate")} />
              </Field>
            </div>
            <p className="mt-4 text-xs text-ink-soft">
              Maturity date is automatically calculated as Start Date + Premium Term years.
            </p>
          </div>
          {quickResult
            ? <ResultCard {...quickResult} />
            : <div className="mt-4 text-xs text-ink-soft text-center">Fill in all fields to see results</div>}
        </div>
      )}

      {/* ── Advanced mode ── */}
      {mode === "advanced" && (
        <div>
          <div className="rounded-2xl border border-rule bg-surface shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-rule flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">Cashflow Entries</p>
                <p className="text-xs text-ink-soft mt-0.5">Enter each premium and benefit as a separate row</p>
              </div>
              <button onClick={addRow}
                className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-dark transition">
                + Add Row
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 560 }}>
                <thead><tr className="border-b border-rule bg-paper text-left">
                  <th className="px-3 py-2 font-medium text-ink-soft w-36">Date</th>
                  <th className="px-3 py-2 font-medium text-ink-soft">Type</th>
                  <th className="px-3 py-2 font-medium text-ink-soft w-36">Amount (₹)</th>
                  <th className="px-3 py-2 w-10" />
                </tr></thead>
                <tbody>
                  {rows.map(row => {
                    const sign = FLOW_TYPES.find(t => t.label === row.type)?.sign ?? 1;
                    return (
                      <tr key={row.id} className="border-b border-rule last:border-0">
                        <td className="px-2 py-1.5">
                          <input type="date" value={row.date} onChange={e => updateRow(row.id, "date", e.target.value)}
                            className="w-full rounded border border-rule bg-paper px-2 py-1.5 text-xs text-ink outline-none focus:border-brand" />
                        </td>
                        <td className="px-2 py-1.5">
                          <select value={row.type} onChange={e => updateRow(row.id, "type", e.target.value)}
                            className="w-full rounded border border-rule bg-paper px-2 py-1.5 text-xs text-ink outline-none focus:border-brand">
                            {FLOW_TYPES.map(t => <option key={t.label}>{t.label}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <div className={`flex items-center gap-1 rounded border px-2 py-1.5 text-xs focus-within:border-brand ${sign < 0 ? "border-deduction/40 bg-deduction/5" : "border-brand/40 bg-brand-soft"}`}>
                            <span className={`font-bold ${sign < 0 ? "text-deduction" : "text-brand"}`}>{sign < 0 ? "−" : "+"}</span>
                            <input type="text" inputMode="numeric" value={row.amount}
                              onChange={e => updateRow(row.id, "amount", e.target.value)}
                              placeholder="0" className="w-full bg-transparent text-ink outline-none" />
                          </div>
                        </td>
                        <td className="px-2 py-1.5">
                          <button onClick={() => removeRow(row.id)}
                            className="flex h-7 w-7 items-center justify-center rounded text-ink-soft hover:bg-deduction/10 hover:text-deduction transition text-base">
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
              {rows.length} cashflow{rows.length !== 1 ? "s" : ""} — Premiums are negative (outflows), benefits are positive (inflows)
            </div>
          </div>
          {advResult
            ? <ResultCard {...advResult} />
            : <div className="mt-4 text-xs text-ink-soft text-center">Add at least one premium and one benefit to calculate</div>}
        </div>
      )}

      {/* ── Surrender mode ── */}
      {mode === "surrender" && (
        <div>
          <div className="rounded-2xl border border-rule bg-surface p-5 shadow-card">
            <h3 className="font-semibold text-ink mb-4">Policy Status Today</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Total Premium Paid So Far (₹)">
                <Input prefix="₹" value={surr.premiumPaid} onChange={setS("premiumPaid")} inputMode="numeric" />
              </Field>
              <Field label="Current Surrender Value (₹)" hint="Get from LIC agent or policy document">
                <Input prefix="₹" value={surr.surrenderValue} onChange={setS("surrenderValue")} inputMode="numeric" />
              </Field>
              <Field label="Future Annual Premium (₹)">
                <Input prefix="₹" value={surr.futurePremium} onChange={setS("futurePremium")} inputMode="numeric" />
              </Field>
              <Field label="Years of Future Premiums Remaining">
                <Input value={surr.futurePremiumYears} onChange={setS("futurePremiumYears")} inputMode="numeric" placeholder="5" />
              </Field>
              <Field label="Expected Maturity Value (₹)">
                <Input prefix="₹" value={surr.maturityValue} onChange={setS("maturityValue")} inputMode="numeric" />
              </Field>
              <Field label="Years to Maturity">
                <Input value={surr.yearsRemaining} onChange={setS("yearsRemaining")} inputMode="numeric" placeholder="5" />
              </Field>
              <Field label="Alternative Investment Return (%)" hint="Return you expect from MF, PPF, FD etc.">
                <Input prefix="%" value={surr.altRate} onChange={setS("altRate")} inputMode="decimal" placeholder="12" />
              </Field>
            </div>
          </div>

          {surrResult && (
            <div className="mt-6 space-y-4">
              {/* Decision header */}
              <div className={`overflow-hidden rounded-2xl border shadow-card-lg ${surrResult.better === "surrender" ? "border-brand/30" : "border-amber-400/30"}`}>
                <div className={`px-6 py-5 ${surrResult.better === "surrender" ? "bg-brand-soft" : "bg-amber-50"}`}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Recommendation</p>
                  <p className={`font-display text-2xl font-bold mt-1 ${surrResult.better === "surrender" ? "text-brand" : "text-amber-700"}`}>
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
                    <p className="tabular font-display text-xl font-bold text-ink mt-1">{formatINRCompact(surrResult.continueValue)}</p>
                    {surrResult.continueXirr !== null && (
                      <p className="text-xs text-brand mt-0.5">XIRR: {pct(surrResult.continueXirr)}</p>
                    )}
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-xs text-ink-soft">Alternative at {surr.altRate}%</p>
                    <p className="tabular font-display text-xl font-bold text-ink mt-1">{formatINRCompact(surrResult.altValue)}</p>
                    <p className="text-xs text-ink-soft mt-0.5">annualised return</p>
                  </div>
                  <div className="px-5 py-4 col-span-2 sm:col-span-1">
                    <p className="text-xs text-ink-soft">Difference</p>
                    <p className={`tabular font-display text-xl font-bold mt-1 ${surrResult.diff > 0 ? "text-brand" : "text-deduction"}`}>
                      {surrResult.diff > 0 ? "+" : ""}{formatINRCompact(surrResult.diff)}
                    </p>
                    <p className="text-xs text-ink-soft mt-0.5">in favour of {surrResult.diff > 0 ? "alternative" : "LIC"}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-rule bg-surface px-5 py-4 text-sm text-ink-soft">
                <p className="font-semibold text-ink mb-1">⚠ Important caveats</p>
                <p>This comparison assumes the alternative investment consistently delivers {surr.altRate}% annually, which is not guaranteed. LIC provides life cover and guaranteed maturity — equity returns are market-linked. Consider your risk tolerance, tax implications, and insurance needs before surrendering.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
