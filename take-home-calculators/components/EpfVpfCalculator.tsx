"use client";

import { useState, useMemo } from "react";
import {
  calculatePfBreakup,
  projectEpfMaturity,
  EPF_INTEREST_RATE_FY2025_26,
} from "@/lib/calculators/epf";
import { projectPpfMaturity, PPF_INTEREST_RATE } from "@/lib/calculators/ppf";
import { formatINR } from "@/lib/format";

export default function EpfVsPpfCalculator() {
  const [basicSalary, setBasicSalary] = useState(30000);
  const [years, setYears] = useState(20);
  const [annualHike, setAnnualHike] = useState(8);
  const [ppfAnnual, setPpfAnnual] = useState(50000);

  const epfResult = useMemo(() => {
    const pf = calculatePfBreakup(basicSalary);
    return projectEpfMaturity(
      pf.employeeContribution,
      pf.employerEpfContribution,
      years
    );
  }, [basicSalary, years]);

  const ppfResult = useMemo(() => {
    return projectPpfMaturity(ppfAnnual, Math.min(years, 15));
  }, [ppfAnnual, years]);

  const epfCorpus = epfResult.maturityAmount;
  const ppfCorpus = ppfResult.maturityAmount;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Basic Salary (Monthly) ₹</label>
          <input type="number" value={basicSalary}
            onChange={e => setBasicSalary(Number(e.target.value))}
            className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">PPF Annual Deposit ₹</label>
          <input type="number" value={ppfAnnual}
            onChange={e => setPpfAnnual(Number(e.target.value))}
            className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Period: {years} years</label>
          <input type="range" min={5} max={35} value={years}
            onChange={e => setYears(Number(e.target.value))}
            className="w-full accent-brand" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Annual Hike: {annualHike}%</label>
          <input type="range" min={0} max={20} value={annualHike}
            onChange={e => setAnnualHike(Number(e.target.value))}
            className="w-full accent-brand" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-brand/20 bg-brand-soft p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">EPF Corpus</p>
          <p className="tabular mt-2 font-display text-2xl font-bold text-brand">{formatINR(epfCorpus)}</p>
          <p className="text-xs text-ink-soft mt-1">After {years} years at {(EPF_INTEREST_RATE_FY2025_26 * 100).toFixed(2)}%</p>
        </div>
        <div className="rounded-xl border border-rule bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">PPF Corpus</p>
          <p className="tabular mt-2 font-display text-2xl font-bold text-ink">{formatINR(ppfCorpus)}</p>
          <p className="text-xs text-ink-soft mt-1">After {Math.min(years, 15)} years at {(PPF_INTEREST_RATE * 100).toFixed(1)}%</p>
        </div>
      </div>

      {epfCorpus > 0 && ppfCorpus > 0 && (
        <p className="rounded-xl border border-rule bg-paper px-4 py-3 text-sm text-ink-soft">
          {epfCorpus > ppfCorpus
            ? <><strong className="text-brand">EPF builds {formatINR(epfCorpus - ppfCorpus)} more</strong> than PPF over this period.</>
            : <><strong className="text-brand">PPF builds {formatINR(ppfCorpus - epfCorpus)} more</strong> than EPF over this period.</>}
        </p>
      )}
    </div>
  );
}
