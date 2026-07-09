"use client";
import { useState, useMemo } from "react";
import { formatINR, formatINRCompact } from "@/lib/format";
import {
  computeOffer,
  projectOverYears,
  getEquivalentLpaInCity,
  CITIES,
  type OfferInput,
} from "@/lib/calculators/offer-comparison";
import type { ProfessionalTaxState, Gender } from "@/lib/calculators/professional-tax";
import type { TaxRegime } from "@/lib/calculators/income-tax";

const DEFAULT_OFFER = (label: string, ctc: string, city: string): OfferInput => ({
  label,
  annualCtc: Number(ctc),
  cityName: city,
  professionalTaxState: "none",
  gender: "male",
  regimeChoice: "auto",
  oldRegimeDeductions: 150000,
  employerOffersNps: false,
  expectedAnnualHikePercent: 10,
});

function OfferForm({
  offer,
  onChange,
}: {
  offer: OfferInput;
  onChange: (next: OfferInput) => void;
}) {
  const set = <K extends keyof OfferInput>(key: K, value: OfferInput[K]) => onChange({ ...offer, [key]: value });

  return (
    <div className="rounded-2xl border border-rule bg-surface p-5 shadow-card">
      <input
        value={offer.label}
        onChange={(e) => set("label", e.target.value)}
        className="w-full bg-transparent font-display text-lg font-semibold text-brand outline-none"
        placeholder="Offer name (e.g. company)"
      />

      <label className="mt-3 block">
        <span className="mb-1 block text-xs text-ink-soft">Annual CTC (₹)</span>
        <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
          <span className="text-ink-soft">₹</span>
          <input
            type="text"
            inputMode="numeric"
            value={offer.annualCtc || ""}
            onChange={(e) => set("annualCtc", Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
            className="tabular w-full bg-transparent text-lg font-semibold text-ink outline-none"
          />
        </div>
      </label>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">City</span>
          <select
            value={offer.cityName}
            onChange={(e) => set("cityName", e.target.value)}
            className="w-full rounded-lg border border-rule bg-paper px-2 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
          >
            <option value="">Not sure / other</option>
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Tax Regime</span>
          <select
            value={offer.regimeChoice}
            onChange={(e) => set("regimeChoice", e.target.value as "auto" | TaxRegime)}
            className="w-full rounded-lg border border-rule bg-paper px-2 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
          >
            <option value="auto">Auto (best for me)</option>
            <option value="new">New Regime</option>
            <option value="old">Old Regime</option>
          </select>
        </label>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Professional Tax State</span>
          <select
            value={offer.professionalTaxState}
            onChange={(e) => set("professionalTaxState", e.target.value as ProfessionalTaxState)}
            className="w-full rounded-lg border border-rule bg-paper px-2 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
          >
            <option value="none">Other / None</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="karnataka">Karnataka</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Expected Annual Hike (%)</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <input
              type="text"
              inputMode="decimal"
              value={offer.expectedAnnualHikePercent}
              onChange={(e) => set("expectedAnnualHikePercent", Number(e.target.value.replace(/[^0-9.]/g, "")) || 0)}
              className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none"
            />
            <span className="text-ink-soft">%</span>
          </div>
        </label>
      </div>

      <details className="mt-3 text-xs text-ink-soft">
        <summary className="cursor-pointer font-medium text-ink-soft hover:text-brand">Advanced options</summary>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-[11px] text-ink-soft">Old-regime deductions (₹/yr)</span>
            <input
              type="text"
              inputMode="numeric"
              value={offer.oldRegimeDeductions}
              onChange={(e) => set("oldRegimeDeductions", Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
              className="w-full rounded-lg border border-rule bg-paper px-2 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] text-ink-soft">Gender (for PT slabs)</span>
            <select
              value={offer.gender}
              onChange={(e) => set("gender", e.target.value as Gender)}
              className="w-full rounded-lg border border-rule bg-paper px-2 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>
        <label className="mt-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={offer.employerOffersNps}
            onChange={(e) => set("employerOffersNps", e.target.checked)}
            className="h-4 w-4 accent-brand"
          />
          <span>Employer offers NPS (10% of basic)</span>
        </label>
      </details>
    </div>
  );
}

export default function OfferComparisonTool() {
  const [offerA, setOfferA] = useState<OfferInput>(DEFAULT_OFFER("Offer A", "1800000", "Bengaluru"));
  const [offerB, setOfferB] = useState<OfferInput>(DEFAULT_OFFER("Offer B", "2000000", "Hyderabad"));
  const [projectionYears, setProjectionYears] = useState(5);

  const computedA = useMemo(() => computeOffer(offerA), [offerA]);
  const computedB = useMemo(() => computeOffer(offerB), [offerB]);
  const projection = useMemo(
    () => projectOverYears([computedA, computedB], projectionYears),
    [computedA, computedB, projectionYears]
  );

  const canCompare = offerA.annualCtc > 0 && offerB.annualCtc > 0;

  const inHandDiffMonthly = computedB.breakup.inHandMonthly - computedA.breakup.inHandMonthly;
  const inHandDiffPercent =
    computedA.breakup.inHandMonthly > 0 ? (inHandDiffMonthly / computedA.breakup.inHandMonthly) * 100 : 0;
  const bHigher = inHandDiffMonthly >= 0;

  const equivalentBinACity =
    computedA.city && computedB.city
      ? getEquivalentLpaInCity(offerB.annualCtc / 100000, computedB.city, computedA.city)
      : null;

  const cumulativeA = projection[projection.length - 1]?.cumulativeInHand[0] ?? 0;
  const cumulativeB = projection[projection.length - 1]?.cumulativeInHand[1] ?? 0;

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <OfferForm offer={offerA} onChange={setOfferA} />
        <OfferForm offer={offerB} onChange={setOfferB} />
      </div>

      {canCompare && (
        <>
          {/* ── Headline verdict ── */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
            <div className="brand-gradient px-6 py-7 sm:px-8">
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                {bHigher ? offerB.label : offerA.label} gives more in-hand
              </p>
              <div className="mt-1 font-display text-4xl font-semibold text-white sm:text-5xl">
                {formatINR(Math.abs(inHandDiffMonthly))}/mo
              </div>
              <p className="mt-1 text-sm text-white/70">
                {Math.abs(inHandDiffPercent).toFixed(1)}% {bHigher ? "more" : "less"} than {offerA.label} — after
                tax, PF, and professional tax, using {computedA.regimeUsed === "old" ? "old" : "new"} regime for{" "}
                {offerA.label} and {computedB.regimeUsed === "old" ? "old" : "new"} regime for {offerB.label}
                {computedA.input.regimeChoice === "auto" || computedB.input.regimeChoice === "auto" ? " (auto-picked)" : ""}.
              </p>
            </div>
          </div>

          {/* ── Full side-by-side breakdown ── */}
          <div className="mt-6 overflow-x-auto rounded-2xl border border-rule bg-surface shadow-card">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper text-left">
                  <th className="px-4 py-3 font-medium text-ink-soft">Data Point</th>
                  <th className="px-4 py-3 text-right font-medium text-ink-soft">{offerA.label}</th>
                  <th className="px-4 py-3 text-right font-medium text-ink-soft">{offerB.label}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Annual CTC", a: formatINR(offerA.annualCtc), b: formatINR(offerB.annualCtc) },
                  { label: "Tax regime used", a: computedA.regimeUsed === "old" ? "Old" : "New", b: computedB.regimeUsed === "old" ? "Old" : "New" },
                  { label: "Basic Pay (monthly)", a: formatINR(computedA.breakup.basicMonthly), b: formatINR(computedB.breakup.basicMonthly) },
                  { label: "HRA (monthly)", a: formatINR(computedA.breakup.hraMonthly), b: formatINR(computedB.breakup.hraMonthly) },
                  { label: "Special Allowance (monthly)", a: formatINR(computedA.breakup.specialAllowanceMonthly), b: formatINR(computedB.breakup.specialAllowanceMonthly) },
                  { label: "Employer PF (monthly)", a: formatINR(computedA.breakup.employerPfMonthly), b: formatINR(computedB.breakup.employerPfMonthly) },
                  { label: "Employee PF (monthly)", a: formatINR(computedA.breakup.employeePfMonthly), b: formatINR(computedB.breakup.employeePfMonthly) },
                  { label: "Gratuity (monthly, reserved)", a: formatINR(computedA.breakup.gratuityMonthly), b: formatINR(computedB.breakup.gratuityMonthly) },
                  ...(computedA.breakup.employerNpsMonthly > 0 || computedB.breakup.employerNpsMonthly > 0
                    ? [{ label: "Employer NPS (monthly)", a: formatINR(computedA.breakup.employerNpsMonthly), b: formatINR(computedB.breakup.employerNpsMonthly) }]
                    : []),
                  { label: "Gross Salary (monthly)", a: formatINR(computedA.breakup.grossSalaryMonthly), b: formatINR(computedB.breakup.grossSalaryMonthly) },
                  { label: "Income Tax (monthly)", a: formatINR(computedA.breakup.incomeTaxMonthly), b: formatINR(computedB.breakup.incomeTaxMonthly) },
                  { label: "Professional Tax (monthly)", a: formatINR(computedA.breakup.professionalTaxMonthly), b: formatINR(computedB.breakup.professionalTaxMonthly) },
                  { label: "In-Hand (monthly)", a: formatINR(computedA.breakup.inHandMonthly), b: formatINR(computedB.breakup.inHandMonthly), highlight: true },
                  { label: "In-Hand (annual)", a: formatINR(computedA.breakup.inHandMonthly * 12), b: formatINR(computedB.breakup.inHandMonthly * 12), highlight: true },
                  { label: "Take-home % of CTC", a: `${computedA.takeHomePercentOfCtc.toFixed(1)}%`, b: `${computedB.takeHomePercentOfCtc.toFixed(1)}%` },
                  { label: "Annual retirement contribution (PF+Gratuity+NPS)", a: formatINR(computedA.annualRetirementContribution), b: formatINR(computedB.annualRetirementContribution) },
                ].map((row) => (
                  <tr key={row.label} className={`border-b border-rule last:border-0 ${row.highlight ? "bg-brand-soft" : ""}`}>
                    <td className="px-4 py-2.5 text-ink-soft">{row.label}</td>
                    <td className="tabular px-4 py-2.5 text-right font-medium text-ink">{row.a}</td>
                    <td className="tabular px-4 py-2.5 text-right font-medium text-ink">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Cost of living & disposable income ── */}
          {(computedA.city || computedB.city) && (
            <div className="mt-6 rounded-2xl border border-rule bg-surface p-5 shadow-card sm:p-6">
              <h3 className="font-display text-lg text-ink">Cost of Living & Disposable Income</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[{ label: offerA.label, computed: computedA }, { label: offerB.label, computed: computedB }].map(
                  ({ label, computed }) => (
                    <div key={label} className="rounded-xl border border-rule bg-paper p-4">
                      <p className="font-medium text-ink">{label}{computed.city ? ` — ${computed.city.name}` : ""}</p>
                      {computed.city ? (
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between"><span className="text-ink-soft">Cost-of-living index</span><span className="tabular text-ink">{computed.city.costIndex}</span></div>
                          <div className="flex justify-between"><span className="text-ink-soft">Avg 1BHK rent</span><span className="tabular text-ink">{formatINR(computed.city.avgRent1BHK)}/mo</span></div>
                          <div className="flex justify-between"><span className="text-ink-soft">Rent as % of in-hand</span><span className="tabular text-ink">{computed.rentToIncomePercent?.toFixed(0)}%</span></div>
                          <div className="flex justify-between border-t border-dashed border-rule pt-1 font-medium"><span className="text-ink">Disposable after rent</span><span className="tabular text-brand">{formatINR(computed.disposableAfterRentMonthly ?? 0)}/mo</span></div>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-ink-soft">City not selected — skipping cost-of-living adjustment.</p>
                      )}
                    </div>
                  )
                )}
              </div>
              {equivalentBinACity !== null && computedA.city && computedB.city && (
                <p className="mt-4 rounded-lg bg-brand-soft px-3 py-2.5 text-sm text-ink">
                  Adjusted for cost of living: {offerB.label}&apos;s {formatINRCompact(offerB.annualCtc)} CTC in{" "}
                  {computedB.city.name} feels roughly like <strong>₹{equivalentBinACity} LPA</strong> would in{" "}
                  {computedA.city.name}.
                </p>
              )}
            </div>
          )}

          {/* ── N-year projection ── */}
          <div className="mt-6 rounded-2xl border border-rule bg-surface p-5 shadow-card sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg text-ink">{projectionYears}-Year In-Hand Projection</h3>
              <label className="flex items-center gap-2 text-xs text-ink-soft">
                Years:
                <input
                  type="range"
                  min={2}
                  max={10}
                  step={1}
                  value={projectionYears}
                  onChange={(e) => setProjectionYears(Number(e.target.value))}
                  className="w-32 accent-brand"
                />
                <span className="tabular font-medium text-ink">{projectionYears}</span>
              </label>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              Projects each offer&apos;s own expected annual hike ({offerA.expectedAnnualHikePercent}% for{" "}
              {offerA.label}, {offerB.expectedAnnualHikePercent}% for {offerB.label}) applied to in-hand pay each
              year. A simplification — real hikes change salary structure too — but useful for spotting whether a
              lower starting offer with better hikes catches up.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="border-b border-rule bg-paper text-left">
                    <th className="px-3 py-2 font-medium text-ink-soft">Year</th>
                    <th className="px-3 py-2 text-right font-medium text-ink-soft">{offerA.label} (annual)</th>
                    <th className="px-3 py-2 text-right font-medium text-ink-soft">{offerB.label} (annual)</th>
                  </tr>
                </thead>
                <tbody>
                  {projection.map((row) => (
                    <tr key={row.year} className="border-b border-rule last:border-0">
                      <td className="px-3 py-2 text-ink-soft">Year {row.year}</td>
                      <td className="tabular px-3 py-2 text-right text-ink">{formatINR(row.inHandAnnual[0])}</td>
                      <td className="tabular px-3 py-2 text-right text-ink">{formatINR(row.inHandAnnual[1])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between rounded-lg bg-brand-soft px-3 py-2.5 text-sm font-semibold">
              <span className="text-ink">Total in-hand over {projectionYears} years</span>
              <span className="tabular text-brand">
                {offerA.label}: {formatINRCompact(cumulativeA)} · {offerB.label}: {formatINRCompact(cumulativeB)}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-ink-soft">
            This compares pay, tax, and cost-of-living factors only. It doesn&apos;t account for role scope, growth
            trajectory, company stability, work culture, or non-cash perks — weigh those alongside the numbers, not
            instead of them.
          </p>
        </>
      )}
    </>
  );
}
