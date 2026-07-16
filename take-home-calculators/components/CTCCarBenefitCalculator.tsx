"use client";
import { useState, useMemo } from "react";
import { calculateCTCCarBenefit, type CarBenefitType } from "@/lib/calculators/auto";
import { formatINR, formatINRCompact } from "@/lib/format";

function n(s: string) { return Number(s.replace(/[^0-9.]/g, "")) || 0; }

const BENEFIT_LABELS: Record<CarBenefitType, string> = {
  cash_allowance: "Cash Allowance",
  car_lease:      "Car Lease",
  company_car:    "Company Car",
};

const BENEFIT_ICONS: Record<CarBenefitType, string> = {
  cash_allowance: "💵",
  car_lease:      "🔑",
  company_car:    "🏢",
};

export default function CTCCarBenefitCalculator() {
  const [monthly, setMonthly]     = useState("15000");
  const [taxBracket, setTaxBracket] = useState("30");
  const [engine, setEngine]       = useState<"below_1600" | "above_1600">("below_1600");
  const [driver, setDriver]       = useState(false);
  const [carPrice, setCarPrice]   = useState("1200000");
  const [tenure, setTenure]       = useState("3");

  const result = useMemo(() => calculateCTCCarBenefit({
    monthlyBenefitAmount: n(monthly),
    taxBracketPct:        n(taxBracket),
    engineSize:           engine,
    driverProvided:       driver,
    carPrice:             n(carPrice),
    leaseTenureYears:     n(tenure),
  }), [monthly, taxBracket, engine, driver, carPrice, tenure]);

  const options: { type: CarBenefitType; value: number }[] = [
    { type: "cash_allowance", value: result.cashAllowance.annualInHand },
    { type: "car_lease",      value: result.carLease.annualBenefit },
    { type: "company_car",    value: result.companyCar.annualBenefit },
  ];
  const maxValue = Math.max(...options.map(o => o.value));

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-2xl border border-rule bg-surface p-5">
        <h3 className="font-semibold text-ink mb-4">Your Car Benefit Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Monthly benefit amount</label>
            <p className="text-xs text-ink-soft mb-1">Cash offered or lease amount</p>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2.5 focus-within:border-brand">
              <span className="text-ink-soft text-sm">₹</span>
              <input type="text" inputMode="numeric" value={monthly}
                onChange={e => setMonthly(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-ink outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Your tax bracket</label>
            <div className="flex gap-2 mt-1">
              {["5", "10", "15", "20", "30"].map(b => (
                <button key={b} onClick={() => setTaxBracket(b)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                    taxBracket === b
                      ? "bg-brand text-white"
                      : "border border-rule text-ink-soft hover:border-brand hover:text-brand"
                  }`}>
                  {b}%
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Engine size (for company car)</label>
            <div className="flex gap-2 mt-1">
              {(["below_1600", "above_1600"] as const).map(e => (
                <button key={e} onClick={() => setEngine(e)}
                  className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition ${
                    engine === e ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand"
                  }`}>
                  {e === "below_1600" ? "≤ 1600cc" : "> 1600cc"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Driver provided?</label>
            <div className="flex gap-2 mt-1">
              {[false, true].map(d => (
                <button key={String(d)} onClick={() => setDriver(d)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                    driver === d ? "bg-brand text-white" : "border border-rule text-ink-soft hover:border-brand"
                  }`}>
                  {d ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Car price (for lease)</label>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-2.5 focus-within:border-brand">
              <span className="text-ink-soft text-sm">₹</span>
              <input type="text" inputMode="numeric" value={carPrice}
                onChange={e => setCarPrice(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-ink outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Lease tenure: {tenure} years</label>
            <input type="range" min={2} max={5} value={tenure}
              onChange={e => setTenure(e.target.value)}
              className="w-full accent-brand mt-3" />
            <div className="flex justify-between text-xs text-ink-soft mt-1">
              <span>2 yrs</span><span>5 yrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best option banner */}
      <div className="rounded-2xl border border-brand/20 bg-brand-soft p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">Best Option for You</p>
        <p className="font-display text-3xl font-bold text-brand mt-1">
          {BENEFIT_ICONS[result.bestOption]} {BENEFIT_LABELS[result.bestOption]}
        </p>
        <p className="text-sm text-ink-soft mt-1">
          Saves you approximately{" "}
          <strong className="text-ink">{formatINR(result.bestOptionSaving)}/year</strong>{" "}
          compared to the worst option.
        </p>
      </div>

      {/* Comparison bars */}
      <div className="rounded-2xl border border-rule bg-surface p-5 space-y-4">
        <h3 className="font-semibold text-ink">Annual Benefit Comparison</h3>
        {options.map(opt => {
          const isBest = opt.type === result.bestOption;
          const pct = Math.round((opt.value / maxValue) * 100);
          return (
            <div key={opt.type}>
              <div className="flex justify-between items-center mb-1.5">
                <span className={`text-sm font-medium ${isBest ? "text-brand" : "text-ink"}`}>
                  {BENEFIT_ICONS[opt.type]} {BENEFIT_LABELS[opt.type]}
                  {isBest && <span className="ml-2 text-[10px] font-bold text-white bg-brand rounded-full px-2 py-0.5">BEST</span>}
                </span>
                <span className={`tabular text-sm font-bold ${isBest ? "text-brand" : "text-ink"}`}>
                  {formatINR(opt.value)}/yr
                </span>
              </div>
              <div className="h-3 rounded-full bg-rule overflow-hidden">
                <div className={`h-full rounded-full transition-all ${isBest ? "bg-brand" : "bg-ink-soft/30"}`}
                  style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail breakdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Cash */}
        <div className="rounded-xl border border-rule bg-surface p-4">
          <p className="text-xs font-semibold text-ink-soft mb-3">💵 Cash Allowance</p>
          {[
            { l: "Gross amount",  v: formatINR(result.cashAllowance.grossAmount) },
            { l: "Tax paid",      v: `− ${formatINR(result.cashAllowance.taxPaid)}` },
            { l: "In-hand/month", v: formatINR(result.cashAllowance.inHandMonthly), bold: true },
          ].map(row => (
            <div key={row.l} className="flex justify-between text-xs py-1.5 border-b border-rule last:border-0">
              <span className="text-ink-soft">{row.l}</span>
              <span className={`tabular font-medium ${row.bold ? "text-ink" : "text-ink-soft"}`}>{row.v}</span>
            </div>
          ))}
        </div>

        {/* Lease */}
        <div className={`rounded-xl border p-4 ${result.bestOption === "car_lease" ? "border-brand/30 bg-brand-soft" : "border-rule bg-surface"}`}>
          <p className="text-xs font-semibold text-ink-soft mb-3">🔑 Car Lease</p>
          {[
            { l: "Lease amount",   v: formatINR(result.carLease.leaseAmount) },
            { l: "Tax saving",     v: `+ ${formatINR(result.carLease.taxSaving)}` },
            { l: "Car ownership",  v: `+ ${formatINR(result.carLease.carOwnershipValue)}` },
            { l: "Annual benefit", v: formatINR(result.carLease.annualBenefit), bold: true },
          ].map(row => (
            <div key={row.l} className="flex justify-between text-xs py-1.5 border-b border-rule last:border-0">
              <span className="text-ink-soft">{row.l}</span>
              <span className={`tabular font-medium ${row.bold ? "text-brand" : "text-ink-soft"}`}>{row.v}</span>
            </div>
          ))}
        </div>

        {/* Company car */}
        <div className="rounded-xl border border-rule bg-surface p-4">
          <p className="text-xs font-semibold text-ink-soft mb-3">🏢 Company Car</p>
          {[
            { l: "Car usage value",  v: formatINR(n(monthly) * 12) },
            { l: "Perquisite value", v: formatINR(result.companyCar.perquisiteValue) },
            { l: "Tax on perquisite",v: `− ${formatINR(result.companyCar.taxOnPerquisite)}` },
            { l: "Net benefit",      v: formatINR(result.companyCar.netBenefit), bold: true },
          ].map(row => (
            <div key={row.l} className="flex justify-between text-xs py-1.5 border-b border-rule last:border-0">
              <span className="text-ink-soft">{row.l}</span>
              <span className={`tabular font-medium ${row.bold ? "text-ink" : "text-ink-soft"}`}>{row.v}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-soft">
        Car lease is pre-tax — your employer deducts the lease amount before computing TDS.
        Company car perquisite is taxed at flat values under Rule 3 (not actual car value).
        Consult your HR and CA for exact structuring.
      </p>
    </div>
  );
}
