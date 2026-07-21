"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { calculateIncomeTax } from "@/lib/calculators/income-tax";
import { formatINR } from "@/lib/format";
import { salarySlug, SALARY_LPA_VALUES } from "@/lib/salary-data";

const QUICK_CTC_LPA = [6, 10, 15, 25, 50];

function nearestAvailableLpa(lpa: number): number {
  return SALARY_LPA_VALUES.reduce((closest, v) =>
    Math.abs(v - lpa) < Math.abs(closest - lpa) ? v : closest
  , SALARY_LPA_VALUES[0]);
}

export default function HeroLiveCalculator() {
  const [ctcInput, setCtcInput] = useState("10,00,000");

  const ctc = Math.max(0, Number(ctcInput.replace(/[^0-9]/g, "")) || 0);
  const ctcLpa = ctc / 100_000;

  const result = useMemo(() => {
    if (ctc < 100_000) return null;
    const r = calculateSalaryBreakup({ annualCtc: ctc, regime: "new" });
    const tax = calculateIncomeTax(r.grossSalaryAnnual, "new");
    return { breakup: r, monthlyTds: Math.round(tax.totalTaxPayable / 12), isTaxFree: tax.totalTaxPayable === 0 };
  }, [ctc]);

  const nearestSlug = ctcLpa >= 1 ? salarySlug(nearestAvailableLpa(ctcLpa)) : null;

  const formatLpaLabel = (lpa: number) => (lpa >= 100 ? `${lpa / 100}Cr` : `${lpa}L`);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] backdrop-blur-md p-5
      shadow-2xl ring-1 ring-white/5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
        Try it — enter your CTC
      </p>

      <label className="mt-2 flex items-center gap-1.5 rounded-xl border border-white/15
        bg-white/[0.06] px-3.5 py-2.5 transition focus-within:border-[#7dd9a8]/50
        focus-within:bg-white/[0.09]">
        <span className="font-display text-xl font-bold text-white/50">₹</span>
        <input
          type="text"
          inputMode="numeric"
          value={ctcInput}
          onChange={(e) => setCtcInput(e.target.value)}
          aria-label="Your annual CTC"
          className="tabular w-full bg-transparent font-display text-2xl font-bold text-white outline-none"
        />
        <span className="shrink-0 text-xs text-white/40">/ year</span>
      </label>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {QUICK_CTC_LPA.map((lpa) => (
          <button
            key={lpa}
            type="button"
            onClick={() => setCtcInput((lpa * 100_000).toLocaleString("en-IN"))}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              ctcLpa === lpa
                ? "bg-[#7dd9a8] text-[#0d2b1a]"
                : "border border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
            }`}
          >
            {formatLpaLabel(lpa)}
          </button>
        ))}
      </div>

      {result ? (
        <>
          <div className="mt-4 space-y-0 divide-y divide-white/10">
            {[
              { label: "Monthly CTC", value: formatINR(result.breakup.monthlyCtc), color: "text-white" },
              { label: "TDS (income tax)", value: result.isTaxFree ? "Zero ✓" : `− ${formatINR(result.monthlyTds)}`, color: result.isTaxFree ? "text-[#7dd9a8]" : "text-red-400" },
              { label: "Employee PF", value: `− ${formatINR(result.breakup.employeePfMonthly)}`, color: "text-red-400" },
              { label: "Professional tax", value: result.breakup.professionalTaxMonthly > 0 ? `− ${formatINR(result.breakup.professionalTaxMonthly)}` : "—", color: "text-red-400" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2.5">
                <span className="text-xs text-white/50">{row.label}</span>
                <span className={`tabular text-sm font-medium ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: "rgba(47,111,79,0.35)", border: "1px solid rgba(125,217,168,0.2)" }}>
            <span className="text-sm font-semibold text-white">In-hand salary</span>
            <span className="tabular text-base font-bold text-[#7dd9a8]">
              {formatINR(result.breakup.inHandMonthly)}<span className="text-xs font-normal text-white/50">/mo</span>
            </span>
          </div>

          {nearestSlug && (
            <Link href={`/salary/${nearestSlug}`}
              className="mt-3 flex items-center justify-center gap-1 py-2 text-xs
                text-white/40 transition hover:text-white/70">
              See the full breakdown →
            </Link>
          )}
        </>
      ) : (
        <p className="mt-6 py-8 text-center text-sm text-white/40">
          Enter a CTC above ₹1,00,000 to see your breakdown
        </p>
      )}
    </div>
  );
}
