"use client";
import { useState } from "react";
import {
  calculateLayoffRisk,
  getRiskBand,
  INDUSTRY_RISK,
  DEPARTMENT_RISK,
  AI_ROLE_RISK,
  SKILL_DEMAND,
  type LayoffRiskInputs,
  type RiskBand,
} from "@/lib/layoff-risk-data";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = ["Company", "Department", "You", "AI & Skills", "Results"];

const EMPTY: LayoffRiskInputs = {
  companySize: "", fundingStage: "", revenueGrowth: "", profitability: "",
  stockPerformance: "", hiringTrend: "", recentLayoffs: "", leadershipStability: "",
  department: "", teamBudgetTrend: "", recentTeamLayoffs: "",
  tenureYears: "", performanceRating: "", visibilityToLeadership: "", remoteStatus: "", hasUniqueDomain: "",
  jobRole: "", skillDemand: "",
  industry: "", geographyRisk: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Select({ label, field, options, value, onChange }: {
  label: string; field: string;
  options: string[]; value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 appearance-none">
        <option value="">— Select —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Radio({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink">{label}</p>
      <div className="flex flex-col gap-2">
        {options.map(o => (
          <label key={o} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${value === o ? "border-brand bg-brand-soft text-brand font-medium" : "border-rule text-ink hover:border-brand/40"}`}>
            <span className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${value === o ? "border-brand" : "border-rule"}`}>
              {value === o && <span className="h-2 w-2 rounded-full bg-brand" />}
            </span>
            <input type="radio" value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── Score Gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({ score, band }: { score: number; band: RiskBand }) {
  // Semi-circle gauge: arc from 180° (left) to 0° (right), top half only
  // This ensures no arc segment ever goes below the centre line
  const cx = 110, cy = 100, r = 72;

  const toXY = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // Arc sweeps from 180° to 0° counter-clockwise (top half only)
  // We divide 180° into 5 equal segments of 36° each
  const arcPath = (startDeg: number, endDeg: number) => {
    const s = toXY(startDeg);
    const e = toXY(endDeg);
    // sweep-flag=0 means counter-clockwise
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 0 0 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  };

  // 180° → 0° split into 5 bands (each 36°)
  // 180→144 green, 144→108 lime, 108→72 amber, 72→36 orange, 36→0 red
  const segments = [
    { from: 180, to: 144, color: "#16a34a" },
    { from: 144, to: 108, color: "#65a30d" },
    { from: 108, to:  72, color: "#d97706" },
    { from:  72, to:  36, color: "#ea580c" },
    { from:  36, to:   0, color: "#dc2626" },
  ];

  // Needle: score 0→100 maps to 180°→0°
  const needleDeg = 180 - (score / 100) * 180;
  const needleRad = (needleDeg * Math.PI) / 180;
  const needleLen = r - 10;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy + needleLen * Math.sin(needleRad);

  return (
    <svg viewBox="0 0 220 130" className="w-full max-w-[280px] mx-auto" aria-label={`Risk score: ${score}`}>
      {/* Background track */}
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="var(--rule)" strokeWidth="12" />

      {/* Coloured segments */}
      {segments.map(s => (
        <path key={s.from} d={arcPath(s.from, s.to)}
          fill="none" stroke={s.color} strokeWidth="12" strokeLinecap="butt" />
      ))}

      {/* Needle */}
      <line x1={cx} y1={cy} x2={nx.toFixed(2)} y2={ny.toFixed(2)}
        stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="6" fill="var(--ink)" />
      <circle cx={cx} cy={cy} r="3" fill="white" />

      {/* Score — centred below arc, above baseline */}
      <text x={cx} y={cy + 22} textAnchor="middle" fontSize="30"
        fontWeight="700" fill={band.color}>{score}</text>

      {/* Labels at arc endpoints */}
      <text x={cx - r - 2} y={cy + 14} textAnchor="end"
        fontSize="8" fill="var(--ink-soft)">Safe</text>
      <text x={cx + r + 2} y={cy + 14} textAnchor="start"
        fontSize="8" fill="var(--ink-soft)">Critical</text>
    </svg>
  );
}

// ─── Mini Score Bar ───────────────────────────────────────────────────────────

function MiniBar({ label, score, weight }: { label: string; score: number; weight: string }) {
  const color = score <= 30 ? "#16a34a" : score <= 50 ? "#d97706" : score <= 70 ? "#ea580c" : "#dc2626";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-ink-soft">{label} <span className="text-ink-soft/60">({weight})</span></span>
        <span className="tabular font-medium" style={{ color }}>{score}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-rule overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LayoffRiskCalculator() {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<LayoffRiskInputs>(EMPTY);
  const [result, setResult] = useState<ReturnType<typeof calculateLayoffRisk> | null>(null);

  const set = (field: keyof LayoffRiskInputs) => (val: string) =>
    setInputs(prev => ({ ...prev, [field]: val }));

  const industries = Object.keys(INDUSTRY_RISK).sort();
  const departments = Object.keys(DEPARTMENT_RISK).sort();
  const roles = Object.keys(AI_ROLE_RISK).sort();
  const skills = Object.keys(SKILL_DEMAND).sort();

  const stepComplete = [
    // Step 0: Company
    !!(inputs.companySize && inputs.fundingStage && inputs.revenueGrowth && inputs.profitability &&
      inputs.stockPerformance && inputs.hiringTrend && inputs.recentLayoffs && inputs.leadershipStability),
    // Step 1: Department
    !!(inputs.department && inputs.teamBudgetTrend && inputs.recentTeamLayoffs),
    // Step 2: Individual
    !!(inputs.tenureYears && inputs.performanceRating && inputs.visibilityToLeadership &&
      inputs.remoteStatus && inputs.hasUniqueDomain && inputs.industry && inputs.geographyRisk),
    // Step 3: AI & Skills
    !!(inputs.jobRole && inputs.skillDemand),
  ];

  const handleCalculate = () => {
    const r = calculateLayoffRisk(inputs);
    setResult(r);
    setStep(4);
  };

  const reset = () => { setInputs(EMPTY); setResult(null); setStep(0); };

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all
                ${i < step ? "border-brand bg-brand text-white"
                  : i === step ? "border-brand text-brand bg-brand-soft"
                  : "border-rule text-ink-soft"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`hidden sm:block text-[10px] font-medium ${i === step ? "text-brand" : "text-ink-soft"}`}>{s}</span>
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full rounded-full bg-rule overflow-hidden">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </div>

      {/* ── Step 0: Company ── */}
      {step === 0 && (
        <div className="space-y-5">
          <h2 className="font-display text-xl text-ink">Company Health</h2>
          <p className="text-sm text-ink-soft">Tell us about the company you work at. This has the largest impact on your risk score (40% weight).</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Company size" field="companySize" value={inputs.companySize} onChange={set("companySize")}
              options={["1–50 (Startup)","51–200 (Early)","201–1000 (Growth)","1001–5000 (Mid)","5000+ (Enterprise)"]} />
            <Select label="Funding stage / ownership" field="fundingStage" value={inputs.fundingStage} onChange={set("fundingStage")}
              options={["Bootstrapped / Profitable","Pre-Seed / Seed","Series A","Series B","Series C+","Pre-IPO","Public Company","Government / PSU"]} />
            <Select label="Revenue growth trend" field="revenueGrowth" value={inputs.revenueGrowth} onChange={set("revenueGrowth")}
              options={["Growing >20% YoY","Growing 5–20% YoY","Flat (0–5%)","Declining slightly","Declining significantly"]} />
            <Select label="Company profitability" field="profitability" value={inputs.profitability} onChange={set("profitability")}
              options={["Profitable","Break-even","Burning cash but funded","Burning cash, low runway"]} />
            <Select label="Stock performance (last 6 months)" field="stockPerformance" value={inputs.stockPerformance} onChange={set("stockPerformance")}
              options={["Not applicable (private)","Up >20% last 6mo","Up 0–20%","Down 0–20%","Down >20%","Down >40%"]} />
            <Select label="Hiring trend at your company" field="hiringTrend" value={inputs.hiringTrend} onChange={set("hiringTrend")}
              options={["Actively hiring","Selective hiring","Hiring freeze","Backfill only"]} />
            <Select label="Recent layoffs at your company" field="recentLayoffs" value={inputs.recentLayoffs} onChange={set("recentLayoffs")}
              options={["No layoffs in 2+ years","Minor layoffs (<5%) last year","Significant layoffs (5–15%) last year","Major layoffs (>15%) last year"]} />
            <Select label="Leadership stability" field="leadershipStability" value={inputs.leadershipStability} onChange={set("leadershipStability")}
              options={["Stable leadership for 2+ years","Recent C-suite changes","Multiple leaders left recently","New CEO / major restructuring"]} />
          </div>
          <button onClick={() => setStep(1)} disabled={!stepComplete[0]}
            className="mt-2 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white disabled:opacity-40 hover:bg-brand-dark transition">
            Continue →
          </button>
        </div>
      )}

      {/* ── Step 1: Department ── */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="font-display text-xl text-ink">Department & Team</h2>
          <p className="text-sm text-ink-soft">Some departments are cut first during downturns. This contributes 20% to your score.</p>
          <Select label="Your department" field="department" value={inputs.department} onChange={set("department")} options={departments} />
          <Radio label="Team budget trend (last 6 months)" value={inputs.teamBudgetTrend} onChange={set("teamBudgetTrend")}
            options={["Budget increasing","Budget flat","Budget cut <20%","Budget cut >20%"]} />
          <Radio label="Layoffs in your immediate team" value={inputs.recentTeamLayoffs} onChange={set("recentTeamLayoffs")}
            options={["No one on my team laid off","1–2 people laid off","3+ people laid off"]} />
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 rounded-xl border border-rule py-3 text-sm font-medium text-ink hover:border-brand transition">← Back</button>
            <button onClick={() => setStep(2)} disabled={!stepComplete[1]}
              className="flex-1 rounded-xl bg-brand py-3 text-sm font-semibold text-white disabled:opacity-40 hover:bg-brand-dark transition">
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Individual ── */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="font-display text-xl text-ink">Your Profile</h2>
          <p className="text-sm text-ink-soft">Individual factors and company context. Contributes 20% to your score.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Your tenure at this company" field="tenureYears" value={inputs.tenureYears} onChange={set("tenureYears")}
              options={["<6 months","6–12 months","1–2 years","2–4 years","4–7 years","7+ years"]} />
            <Select label="Your last performance rating" field="performanceRating" value={inputs.performanceRating} onChange={set("performanceRating")}
              options={["Top performer / Exceeds expectations","Meets expectations","Below expectations / PIP","Not formally reviewed"]} />
            <Select label="Visibility to senior leadership" field="visibilityToLeadership" value={inputs.visibilityToLeadership} onChange={set("visibilityToLeadership")}
              options={["High — known to senior leaders","Medium — known within team/dept","Low — mostly invisible"]} />
            <Select label="Work arrangement" field="remoteStatus" value={inputs.remoteStatus} onChange={set("remoteStatus")}
              options={["Fully in-office (same city as HQ)","Hybrid (2–3 days office)","Fully remote (same country)","Fully remote (different country)"]} />
            <Select label="Industry" field="industry" value={inputs.industry} onChange={set("industry")} options={industries} />
            <Select label="Your geography / market" field="geographyRisk" value={inputs.geographyRisk} onChange={set("geographyRisk")}
              options={["US / UK / Europe (Tier 1 market)","India / Southeast Asia (tech hub)","India / Southeast Asia (non-tech)","Emerging market","High-cost city vs remote team"]} />
          </div>
          <Radio label="Do you hold unique domain knowledge or key relationships?" value={inputs.hasUniqueDomain} onChange={set("hasUniqueDomain")}
            options={["Yes — I hold unique knowledge or relationships","Somewhat — my work could be done by others with effort","No — my role is fairly replaceable"]} />
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-rule py-3 text-sm font-medium text-ink hover:border-brand transition">← Back</button>
            <button onClick={() => setStep(3)} disabled={!stepComplete[2]}
              className="flex-1 rounded-xl bg-brand py-3 text-sm font-semibold text-white disabled:opacity-40 hover:bg-brand-dark transition">
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: AI & Skills ── */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="font-display text-xl text-ink">AI Risk & Skills</h2>
          <p className="text-sm text-ink-soft">AI automation risk by job role and your skill demand. Contributes 10% to your score.</p>
          <Select label="Your job role" field="jobRole" value={inputs.jobRole} onChange={set("jobRole")} options={roles} />
          {inputs.jobRole && AI_ROLE_RISK[inputs.jobRole] && (
            <div className="rounded-lg border border-rule bg-paper px-4 py-3 text-sm">
              <p className="font-medium text-ink">AI risk for this role: <span className="text-brand">{AI_ROLE_RISK[inputs.jobRole].score}/100</span></p>
              <p className="mt-1 text-ink-soft">{AI_ROLE_RISK[inputs.jobRole].reason}</p>
            </div>
          )}
          <Select label="Your most in-demand skill" field="skillDemand" value={inputs.skillDemand} onChange={set("skillDemand")} options={skills} />
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 rounded-xl border border-rule py-3 text-sm font-medium text-ink hover:border-brand transition">← Back</button>
            <button onClick={handleCalculate} disabled={!stepComplete[3]}
              className="flex-1 rounded-xl bg-brand py-3 text-sm font-semibold text-white disabled:opacity-40 hover:bg-brand-dark transition">
              Calculate My Risk →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Results ── */}
      {step === 4 && result && (
        <div className="space-y-6">
          {/* Score header */}
          <div className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
            <div className="px-6 py-6 sm:px-8" style={{ background: `${result.riskBand.color}12`, borderBottom: `2px solid ${result.riskBand.color}30` }}>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ScoreGauge score={result.finalScore} band={result.riskBand} />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: result.riskBand.color }}>Layoff Risk Score</p>
                  <p className="font-display text-5xl font-bold text-ink mt-1">{result.finalScore}<span className="text-2xl text-ink-soft">/100</span></p>
                  <p className="mt-1 text-lg font-semibold" style={{ color: result.riskBand.color }}>{result.riskBand.label}</p>
                  <p className="mt-2 text-sm text-ink-soft max-w-sm">{result.riskBand.description}</p>
                </div>
              </div>
            </div>
            {/* Score breakdown */}
            <div className="px-6 py-5 sm:px-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Score Breakdown</p>
              <MiniBar label="Company Health" score={result.companyScore} weight="40%" />
              <MiniBar label="Department Risk" score={result.departmentScore} weight="20%" />
              <MiniBar label="Individual Profile" score={result.individualScore} weight="20%" />
              <MiniBar label="AI Automation Risk" score={result.aiScore} weight="10%" />
              <MiniBar label="Industry Outlook" score={result.industryScore} weight="10%" />
            </div>
          </div>

          {/* Risk & protective factors */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-rule bg-surface p-5">
              <p className="text-sm font-semibold text-deduction mb-3">⚠ Top Risk Factors</p>
              <ul className="space-y-2">
                {result.topRiskFactors.length > 0 ? result.topRiskFactors.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink">
                    <span className="mt-0.5 shrink-0 text-deduction">↑</span>{f}
                  </li>
                )) : <li className="text-sm text-ink-soft">No major risk factors detected</li>}
              </ul>
            </div>
            <div className="rounded-xl border border-rule bg-surface p-5">
              <p className="text-sm font-semibold text-brand mb-3">✓ Protective Factors</p>
              <ul className="space-y-2">
                {result.topProtectiveFactors.length > 0 ? result.topProtectiveFactors.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink">
                    <span className="mt-0.5 shrink-0 text-brand">↓</span>{f}
                  </li>
                )) : <li className="text-sm text-ink-soft">No strong protective factors detected</li>}
              </ul>
            </div>
          </div>

          {/* Recommended actions */}
          <div className="rounded-xl border border-rule bg-surface p-5">
            <p className="text-sm font-semibold text-ink mb-3">📋 Recommended Actions</p>
            <ul className="space-y-2">
              {result.riskBand.actions.map(a => (
                <li key={a} className="flex items-start gap-2 text-sm text-ink-soft">
                  <span className="mt-0.5 shrink-0 text-brand">→</span>{a}
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-lg bg-brand-soft px-4 py-3 text-sm">
              <span className="font-semibold text-ink">Urgency: </span>
              <span className="text-ink-soft">{result.riskBand.urgency}</span>
            </div>
          </div>

          {/* Emergency fund suggestion */}
          <div className="rounded-xl border border-rule bg-surface p-5">
            <p className="text-sm font-semibold text-ink mb-1">💰 Emergency Fund Recommendation</p>
            <p className="text-sm text-ink-soft">
              {result.finalScore <= 20 && "3 months of expenses is sufficient for your risk level."}
              {result.finalScore > 20 && result.finalScore <= 40 && "Keep 3–4 months of expenses readily accessible."}
              {result.finalScore > 40 && result.finalScore <= 60 && "Build a 6-month emergency fund as a buffer."}
              {result.finalScore > 60 && result.finalScore <= 80 && "Target 9 months of expenses. Start immediately."}
              {result.finalScore > 80 && "12 months emergency fund is strongly advised given your risk level."}
            </p>
          </div>

          {/* ── Social sharing ── */}
          <div className="rounded-xl border border-rule bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-3">Share your result</p>
            <div className="flex flex-wrap gap-2">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `I scored ${result.finalScore}/100 on the Layoff Risk Calculator — ${result.riskBand.label}.\n\nCheck your own score: https://salarytools.in/calculator/layoff-risk-calculator/`
                )}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-rule bg-surface px-3 py-2 text-xs font-medium text-ink hover:border-brand hover:text-brand transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-green-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>

              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `My Layoff Risk Score is ${result.finalScore}/100 — ${result.riskBand.label} 📊\n\nCheck yours free at salarytools.in/calculator/layoff-risk-calculator/`
                )}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-rule bg-surface px-3 py-2 text-xs font-medium text-ink hover:border-brand hover:text-brand transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.847L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Post on X
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  "https://salarytools.in/calculator/layoff-risk-calculator/"
                )}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-rule bg-surface px-3 py-2 text-xs font-medium text-ink hover:border-brand hover:text-brand transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>

              {/* Copy link */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://salarytools.in/calculator/layoff-risk-calculator/`
                  );
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-rule bg-surface px-3 py-2 text-xs font-medium text-ink hover:border-brand hover:text-brand transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                Copy Link
              </button>
            </div>
            <p className="mt-2 text-[10px] text-ink-soft">
              Sharing: &quot;My Layoff Risk Score is {result.finalScore}/100 — {result.riskBand.label}&quot;
            </p>
          </div>

          <button onClick={reset} className="w-full rounded-xl border border-rule py-3 text-sm font-medium text-ink hover:border-brand hover:text-brand transition">
            ← Recalculate
          </button>
        </div>
      )}
    </div>
  );
}
