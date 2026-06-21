"use client";
import { useState, useMemo } from "react";
import { formatINR, formatINRCompact } from "@/lib/format";
import { EPF_INTEREST_RATE_FY2025_26 } from "@/lib/calculators/epf";
import { PPF_INTEREST_RATE } from "@/lib/calculators/ppf";

const EPF_RATE = EPF_INTEREST_RATE_FY2025_26; // 8.25%
const PPF_RATE = PPF_INTEREST_RATE;            // 7.1%

function calcEpf(monthlyBasic: number, years: number, vpfExtra: number) {
  const employeeContrib = monthlyBasic * 0.12;
  const employerEpf    = monthlyBasic * 0.0367;
  const totalMonthly   = employeeContrib + employerEpf + vpfExtra;
  const r              = EPF_RATE / 12;
  const months         = years * 12;
  // SIP formula — monthly compounding
  const maturity = totalMonthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const totalInvested = totalMonthly * months;
  const breakdown: { year: number; invested: number; balance: number }[] = [];
  let bal = 0;
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      bal = (bal + totalMonthly) * (1 + r);
    }
    breakdown.push({ year: y, invested: totalMonthly * y * 12, balance: Math.round(bal) });
  }
  return {
    maturity: Math.round(maturity),
    totalInvested: Math.round(totalInvested),
    interest: Math.round(maturity - totalInvested),
    monthlyContrib: Math.round(totalMonthly),
    employeeContrib: Math.round(employeeContrib),
    employerContrib: Math.round(employerEpf),
    breakdown,
  };
}

function calcPpf(annualDeposit: number, years: number) {
  let balance = 0;
  let totalInvested = 0;
  const breakdown: { year: number; invested: number; balance: number }[] = [];
  const clamped = Math.min(annualDeposit, 150000);
  for (let y = 1; y <= years; y++) {
    // PPF interest on minimum balance between 5th day and end of month
    // Simplified: deposit at start of year, interest at year end
    balance += clamped;
    totalInvested += clamped;
    balance = Math.round(balance * (1 + PPF_RATE));
    breakdown.push({ year: y, invested: totalInvested, balance });
  }
  return {
    maturity: balance,
    totalInvested,
    interest: balance - totalInvested,
    breakdown,
  };
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────

function BarChart({ data }: { data: { year: number; epf: number; ppf: number }[] }) {
  const max = Math.max(...data.flatMap(d => [d.epf, d.ppf]), 1);
  const show = data.length <= 15 ? data : data.filter((_, i) => i % 2 === 0 || i === data.length - 1);

  return (
    <div className="mt-4">
      <div className="relative flex items-end gap-1" style={{ height: "140px" }}>
        {show.map(d => {
          const epfH = Math.max(2, (d.epf / max) * 130);
          const ppfH = Math.max(2, (d.ppf / max) * 130);
          return (
            <div key={d.year} className="group relative flex flex-1 items-end gap-px" style={{ height: "130px" }}>
              <div className="flex-1 rounded-t-sm bg-brand"
                style={{ height: `${epfH}px` }} />
              <div className="flex-1 rounded-t-sm bg-accent/70"
                style={{ height: `${ppfH}px` }} />
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded bg-ink px-2 py-1 text-[10px] text-white whitespace-nowrap group-hover:block">
                <div>EPF: {formatINRCompact(d.epf)}</div>
                <div>PPF: {formatINRCompact(d.ppf)}</div>
              </div>
            </div>
          );
        })}
      </div>
      {/* X axis labels */}
      <div className="flex gap-1 mt-1">
        {show.map(d => (
          <div key={d.year} className="flex-1 text-center text-[8px] text-ink-soft">{d.year}y</div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-3 rounded-sm bg-brand" />EPF</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-3 rounded-sm bg-accent/70" />PPF</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EpfVsPpfCalculator() {
  const [monthlyBasic, setMonthlyBasic] = useState("30000");
  const [annualPpf, setAnnualPpf]       = useState("150000");
  const [vpfExtra, setVpfExtra]         = useState("0");
  const [years, setYears]               = useState(15);

  const basic  = Math.max(0, Number(monthlyBasic.replace(/[^0-9]/g,""))||0);
  const ppfAmt = Math.max(0, Number(annualPpf.replace(/[^0-9]/g,""))||0);
  const vpf    = Math.max(0, Number(vpfExtra.replace(/[^0-9]/g,""))||0);

  const epf = useMemo(() => calcEpf(basic, years, vpf), [basic, years, vpf]);
  const ppf = useMemo(() => calcPpf(ppfAmt, years), [ppfAmt, years]);

  const winner = epf.maturity >= ppf.maturity ? "EPF" : "PPF";
  const diff   = Math.abs(epf.maturity - ppf.maturity);

  const chartData = useMemo(() => {
    const epfB = epf.breakdown;
    const ppfB = ppf.breakdown;
    return epfB.map((e, i) => ({
      year: e.year,
      epf: e.balance,
      ppf: ppfB[i]?.balance ?? 0,
    }));
  }, [epf, ppf]);

  return (
    <div className="space-y-5">
      {/* ── Inputs ── */}
      <div className="rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Monthly Basic Salary (₹)</span>
            <span className="mb-1 block text-xs text-ink-soft">EPF is 12% of basic — enter your basic salary</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-ink-soft text-sm">₹</span>
              <input type="text" inputMode="numeric" value={monthlyBasic} onChange={e => setMonthlyBasic(e.target.value)}
                className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Annual PPF Deposit (₹)</span>
            <span className="mb-1 block text-xs text-ink-soft">Max ₹1,50,000/year</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-ink-soft text-sm">₹</span>
              <input type="text" inputMode="numeric" value={annualPpf} onChange={e => setAnnualPpf(e.target.value)}
                className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Extra VPF per month (₹)</span>
            <span className="mb-1 block text-xs text-ink-soft">Optional voluntary contribution over 12%</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-ink-soft text-sm">₹</span>
              <input type="text" inputMode="numeric" value={vpfExtra} onChange={e => setVpfExtra(e.target.value)}
                className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Investment Period: {years} years</span>
            <span className="mb-1 block text-xs text-ink-soft">PPF matures at 15 years; extendable after</span>
            <input type="range" min={5} max={30} value={years} onChange={e => setYears(Number(e.target.value))}
              className="w-full accent-[var(--brand)] mt-3" />
            <div className="flex justify-between text-[10px] text-ink-soft mt-0.5">
              <span>5 yrs</span><span>30 yrs</span>
            </div>
          </label>
        </div>

        {/* Rate info */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-brand-soft px-4 py-2.5 text-xs">
            <p className="font-semibold text-brand">EPF Rate</p>
            <p className="text-ink-soft">{(EPF_RATE * 100).toFixed(2)}% p.a. (FY 2025-26)</p>
          </div>
          <div className="rounded-lg bg-brand-soft px-4 py-2.5 text-xs">
            <p className="font-semibold text-brand">PPF Rate</p>
            <p className="text-ink-soft">{(PPF_RATE * 100).toFixed(1)}% p.a. (current)</p>
          </div>
        </div>
      </div>

      {/* ── Results header ── */}
      <div className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">After {years} Years</p>
          <p className="mt-1 font-display text-xl font-semibold text-white">
            {winner} wins by <span className="text-2xl">{formatINRCompact(diff)}</span>
          </p>
          <p className="mt-1 text-sm text-white/70">
            EPF: {formatINRCompact(epf.maturity)} vs PPF: {formatINRCompact(ppf.maturity)}
          </p>
        </div>

        {/* Side by side */}
        <div className="grid grid-cols-2 divide-x divide-rule">
          {/* EPF */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              <p className="font-semibold text-brand text-sm">EPF{vpf > 0 ? " + VPF" : ""}</p>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Monthly contribution", value: formatINR(epf.monthlyContrib) },
                { label: "Your share (12%)",     value: formatINR(epf.employeeContrib) },
                { label: "Employer share (3.67%)",value: formatINR(epf.employerContrib) },
                ...(vpf > 0 ? [{ label: "Extra VPF", value: formatINR(vpf) }] : []),
                { label: "Total invested",       value: formatINRCompact(epf.totalInvested) },
                { label: "Interest earned",      value: formatINRCompact(epf.interest) },
                { label: "Maturity value",       value: formatINRCompact(epf.maturity), bold: true },
              ].map(r => (
                <div key={r.label} className={`flex justify-between text-sm border-b border-dashed border-rule pb-1.5 ${r.bold ? "font-semibold" : ""}`}>
                  <span className="text-ink-soft">{r.label}</span>
                  <span className="tabular text-ink">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PPF */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <p className="font-semibold text-accent text-sm">PPF</p>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Annual deposit",   value: formatINR(Math.min(ppfAmt, 150000)) },
                { label: "Monthly equivalent",value: formatINR(Math.round(Math.min(ppfAmt, 150000) / 12)) },
                { label: "Lock-in",          value: "15 years (min)" },
                { label: "Total invested",   value: formatINRCompact(ppf.totalInvested) },
                { label: "Interest earned",  value: formatINRCompact(ppf.interest) },
                { label: "Maturity value",   value: formatINRCompact(ppf.maturity), bold: true },
              ].map(r => (
                <div key={r.label} className={`flex justify-between text-sm border-b border-dashed border-rule pb-1.5 ${r.bold ? "font-semibold" : ""}`}>
                  <span className="text-ink-soft">{r.label}</span>
                  <span className="tabular text-ink">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Return comparison bars */}
        <div className="px-6 pb-6 pt-4 border-t border-rule">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-3">Corpus Growth Comparison</p>
          <BarChart data={chartData} />
        </div>
      </div>

      {/* ── Year-by-year table ── */}
      <div className="overflow-hidden rounded-xl border border-rule">
        <div className="border-b border-rule bg-paper px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Year-by-Year Breakdown</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: 480 }}>
            <thead><tr className="border-b border-rule bg-paper text-left">
              <th className="px-3 py-2.5 font-medium text-ink-soft">Year</th>
              <th className="px-3 py-2.5 text-right font-medium text-brand">EPF Balance</th>
              <th className="px-3 py-2.5 text-right font-medium text-brand">EPF Invested</th>
              <th className="px-3 py-2.5 text-right font-medium text-accent">PPF Balance</th>
              <th className="px-3 py-2.5 text-right font-medium text-accent">PPF Invested</th>
              <th className="px-3 py-2.5 text-right font-medium text-ink-soft">Winner</th>
            </tr></thead>
            <tbody>
              {epf.breakdown.map((e, i) => {
                const p = ppf.breakdown[i];
                const epfWins = e.balance >= (p?.balance ?? 0);
                return (
                  <tr key={e.year} className={`border-b border-rule last:border-0 ${e.year % 5 === 0 ? "bg-brand-soft" : "hover:bg-paper"}`}>
                    <td className="px-3 py-2.5 text-ink-soft font-medium">Year {e.year}</td>
                    <td className="tabular px-3 py-2.5 text-right font-medium text-brand">{formatINRCompact(e.balance)}</td>
                    <td className="tabular px-3 py-2.5 text-right text-ink-soft">{formatINRCompact(e.invested)}</td>
                    <td className="tabular px-3 py-2.5 text-right font-medium text-accent">{p ? formatINRCompact(p.balance) : "—"}</td>
                    <td className="tabular px-3 py-2.5 text-right text-ink-soft">{p ? formatINRCompact(p.invested) : "—"}</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${epfWins ? "bg-brand-soft text-brand" : "bg-orange-50 text-orange-700"}`}>
                        {epfWins ? "EPF" : "PPF"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Key differences ── */}
      <div className="rounded-xl border border-rule bg-surface p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-4">Key Differences to Consider</p>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          {[
            { icon: "💼", label: "Who can use it", epf: "Salaried employees only", ppf: "Anyone — salaried, self-employed, or for children" },
            { icon: "🏦", label: "Employer match", epf: "Yes — 3.67% employer EPF contribution", ppf: "No employer involvement" },
            { icon: "🔒", label: "Lock-in", epf: "Until retirement / resignation", ppf: "Minimum 15 years" },
            { icon: "💸", label: "Partial withdrawal", epf: "Allowed for specific reasons", ppf: "From 7th year onward" },
            { icon: "🏛️", label: "Loan facility", epf: "No direct loan", ppf: "Loan available in years 3–6" },
            { icon: "📊", label: "Tax on interest", epf: "Tax-free up to ₹2.5L/yr contribution", ppf: "Fully tax-free (no limit)" },
          ].map(r => (
            <div key={r.label} className="rounded-lg border border-rule p-3">
              <p className="font-medium text-ink mb-2">{r.icon} {r.label}</p>
              <div className="space-y-1">
                <p className="text-ink-soft"><span className="font-medium text-brand">EPF:</span> {r.epf}</p>
                <p className="text-ink-soft"><span className="font-medium text-orange-600">PPF:</span> {r.ppf}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
