"use client";
import { useState, useMemo, useEffect } from "react";
import { formatINR, amountToWords } from "@/lib/format";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Receipt {
  month: string;
  year: number;
}

export default function RentReceiptGenerator() {
  const [tenantName, setTenantName] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [landlordPan, setLandlordPan] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [monthlyRentInput, setMonthlyRentInput] = useState("15000");
  const [paymentMode, setPaymentMode] = useState<"cash" | "cheque" | "bank_transfer" | "upi">("bank_transfer");
  const [generateFullYear, setGenerateFullYear] = useState(false);
  // Stable placeholder for the server-rendered pass — real "today" is only
  // known client-side, so we fill it in after mount to avoid a hydration
  // mismatch between build time and whenever the page is actually loaded.
  const [fyStartYear, setFyStartYear] = useState(2025);
  const [singleMonth, setSingleMonth] = useState(0);
  const [singleYear, setSingleYear] = useState(2025);

  useEffect(() => {
    const now = new Date();
    setFyStartYear(now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1);
    setSingleMonth(now.getMonth());
    setSingleYear(now.getFullYear());
  }, []);

  const monthlyRent = Math.max(0, Number(monthlyRentInput.replace(/[^0-9]/g, "")) || 0);
  const annualRent = monthlyRent * 12;
  const panRequired = annualRent > 100_000;
  const stampRequired = paymentMode === "cash" && monthlyRent > 5_000;

  const receipts: Receipt[] = useMemo(() => {
    if (!generateFullYear) {
      return [{ month: MONTH_NAMES[singleMonth], year: singleYear }];
    }
    // Indian financial year: April (fyStartYear) through March (fyStartYear + 1)
    const list: Receipt[] = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = (3 + i) % 12; // start at April = index 3
      const year = monthIndex >= 3 ? fyStartYear : fyStartYear + 1;
      list.push({ month: MONTH_NAMES[monthIndex], year });
    }
    return list;
  }, [generateFullYear, singleMonth, singleYear, fyStartYear]);

  const canGenerate = tenantName.trim() && landlordName.trim() && propertyAddress.trim() && monthlyRent > 0;

  return (
    <>
      <div className="no-print mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Tenant Name</span>
            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Landlord Name</span>
            <input
              type="text"
              value={landlordName}
              onChange={(e) => setLandlordName(e.target.value)}
              placeholder="Landlord's full name"
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1 block text-xs text-ink-soft">Rented Property Address</span>
          <textarea
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            placeholder="Full address of the rented premises"
            rows={2}
            className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Monthly Rent (₹)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-ink-soft">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={monthlyRentInput}
                onChange={(e) => setMonthlyRentInput(e.target.value)}
                className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">
              Landlord PAN {panRequired ? <span className="text-deduction">(required — rent &gt; ₹1L/yr)</span> : "(optional)"}
            </span>
            <input
              type="text"
              value={landlordPan}
              onChange={(e) => setLandlordPan(e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength={10}
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs text-ink-soft">Payment Mode</span>
          <div className="grid grid-cols-4 gap-2">
            {([
              ["bank_transfer", "Bank Transfer"],
              ["upi", "UPI"],
              ["cheque", "Cheque"],
              ["cash", "Cash"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setPaymentMode(value)}
                className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                  paymentMode === value ? "border-brand bg-brand text-white" : "border-rule text-ink-soft hover:border-brand hover:text-brand"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </label>

        <label className="mt-4 flex items-center gap-2.5 border-t border-rule pt-4">
          <input
            type="checkbox"
            checked={generateFullYear}
            onChange={(e) => setGenerateFullYear(e.target.checked)}
            className="h-4 w-4 accent-brand"
          />
          <span className="text-sm text-ink">Generate all 12 months at once (for HRA filing)</span>
        </label>

        {!generateFullYear ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs text-ink-soft">Month</span>
              <select
                value={singleMonth}
                onChange={(e) => setSingleMonth(Number(e.target.value))}
                className="w-full rounded-lg border border-rule bg-paper px-2 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
              >
                {MONTH_NAMES.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-ink-soft">Year</span>
              <input
                type="number"
                value={singleYear}
                onChange={(e) => setSingleYear(Number(e.target.value))}
                className="w-full rounded-lg border border-rule bg-paper px-2 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
            </label>
          </div>
        ) : (
          <label className="mt-3 block">
            <span className="mb-1 block text-xs text-ink-soft">Financial Year Starting</span>
            <select
              value={fyStartYear}
              onChange={(e) => setFyStartYear(Number(e.target.value))}
              className="w-full rounded-lg border border-rule bg-paper px-2 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
            >
              {[fyStartYear - 1, fyStartYear, fyStartYear + 1].map((y) => (
                <option key={y} value={y}>FY {y}-{String(y + 1).slice(2)}</option>
              ))}
            </select>
          </label>
        )}

        {stampRequired && (
          <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-xs text-ink">
            ⚠️ Cash payments above ₹5,000 legally require a ₹1 revenue stamp affixed to the physical receipt,
            with the landlord's signature across it.
          </p>
        )}
      </div>

      {canGenerate ? (
        <div className="mt-8">
          <div className="no-print mb-4">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:border-brand hover:text-brand"
            >
              🖨️ Print {receipts.length > 1 ? `all ${receipts.length} receipts` : "receipt"}
            </button>
          </div>

          {receipts.map((r, i) => (
            <div
              key={`${r.month}-${r.year}`}
              className="receipt-card mb-6 rounded-2xl border border-rule bg-surface p-6 shadow-card sm:p-8 print:mb-0 print:break-inside-avoid print:rounded-none print:border-0 print:border-b print:border-dashed print:border-ink/40 print:p-4 print:shadow-none print:last:border-b-0"
              style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
            >
              <div className="flex items-start justify-between border-b border-dashed border-rule pb-4 print:pb-1.5">
                <h3 className="font-display text-xl text-ink print:text-sm print:font-semibold">Rent Receipt</h3>
                <span className="text-sm text-ink-soft print:text-xs">{r.month} {r.year}</span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-ink print:mt-1.5 print:text-[11px] print:leading-snug">
                Received with thanks from <strong>{tenantName}</strong> a sum of{" "}
                <strong>{formatINR(monthlyRent)}</strong> ({amountToWords(monthlyRent)} Rupees Only) towards
                rent for the month of <strong>{r.month} {r.year}</strong>, for the premises situated at:
              </p>
              <p className="mt-2 text-sm text-ink-soft print:mt-0.5 print:text-[11px]">{propertyAddress}</p>

              <div className="mt-5 grid grid-cols-2 gap-4 text-sm print:mt-1.5 print:gap-2">
                <div>
                  <p className="text-xs text-ink-soft print:text-[10px]">Payment Mode</p>
                  <p className="mt-0.5 text-ink capitalize print:text-[11px]">{paymentMode.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft print:text-[10px]">Landlord PAN</p>
                  <p className="mt-0.5 text-ink print:text-[11px]">{landlordPan || "Not provided"}</p>
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between border-t border-dashed border-rule pt-6 print:mt-2 print:pt-1.5">
                <div>
                  <p className="text-xs text-ink-soft print:text-[10px]">Date: ___________________</p>
                </div>
                <div className="text-center">
                  {stampRequired && (
                    <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded border border-dashed border-rule text-[10px] text-ink-soft print:mb-1 print:h-8 print:w-8 print:text-[7px]">
                      Revenue<br />Stamp
                    </div>
                  )}
                  <p className="border-t border-ink pt-1 text-xs text-ink print:text-[10px]">{landlordName}</p>
                  <p className="text-[10px] text-ink-soft print:text-[8px]">Signature of Landlord</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-print mt-8 text-sm text-ink-soft">
          Fill in tenant name, landlord name, property address, and rent amount to generate your receipt(s).
        </p>
      )}
    </>
  );
}
