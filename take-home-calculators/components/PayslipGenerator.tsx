"use client";
import { useState, useMemo, useEffect } from "react";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { formatINR, amountToWords } from "@/lib/format";
import type { TaxRegime } from "@/lib/calculators/income-tax";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface LineItem {
  id: string;
  label: string;
  amount: number;
}

let idCounter = 0;
function newId() {
  idCounter += 1;
  return `item-${idCounter}`;
}

export default function PayslipGenerator() {
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [designation, setDesignation] = useState("");
  const [payMonth, setPayMonth] = useState(0);
  const [payYear, setPayYear] = useState(2025);
  const [panNumber, setPanNumber] = useState("");
  const [bankAccountLast4, setBankAccountLast4] = useState("");

  const [annualCtcInput, setAnnualCtcInput] = useState("1200000");
  const [regime, setRegime] = useState<TaxRegime>("new");
  const annualCtc = Math.max(0, Number(annualCtcInput.replace(/[^0-9]/g, "")) || 0);

  const calculated = useMemo(() => calculateSalaryBreakup({ annualCtc, regime }), [annualCtc, regime]);

  const [earnings, setEarnings] = useState<LineItem[]>([]);
  const [deductions, setDeductions] = useState<LineItem[]>([]);

  // Re-populate line items whenever the underlying calculation changes —
  // but only auto-fill; the person can still hand-edit any individual
  // amount afterwards without it snapping back until CTC/regime changes.
  useEffect(() => {
    setEarnings([
      { id: newId(), label: "Basic Salary", amount: Math.round(calculated.basicMonthly) },
      { id: newId(), label: "HRA", amount: Math.round(calculated.hraMonthly) },
      { id: newId(), label: "Special Allowance", amount: Math.round(calculated.specialAllowanceMonthly) },
    ]);
    setDeductions([
      { id: newId(), label: "Provident Fund (PF)", amount: Math.round(calculated.employeePfMonthly) },
      ...(calculated.professionalTaxMonthly > 0
        ? [{ id: newId(), label: "Professional Tax", amount: Math.round(calculated.professionalTaxMonthly) }]
        : []),
      { id: newId(), label: "Income Tax (TDS)", amount: Math.round(calculated.incomeTaxMonthly) },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annualCtc, regime]);

  // "Today" is only known client-side — set the real pay period after
  // mount so build-time and page-load-time don't disagree during hydration.
  useEffect(() => {
    const now = new Date();
    setPayMonth(now.getMonth());
    setPayYear(now.getFullYear());
  }, []);

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
  const netPay = totalEarnings - totalDeductions;

  function updateLine(list: LineItem[], setList: (l: LineItem[]) => void, id: string, field: "label" | "amount", value: string) {
    setList(list.map((item) => (item.id === id ? { ...item, [field]: field === "amount" ? Math.max(0, Number(value.replace(/[^0-9]/g, "")) || 0) : value } : item)));
  }

  function addLine(list: LineItem[], setList: (l: LineItem[]) => void) {
    setList([...list, { id: newId(), label: "New Item", amount: 0 }]);
  }

  function removeLine(list: LineItem[], setList: (l: LineItem[]) => void, id: string) {
    setList(list.filter((item) => item.id !== id));
  }

  const canGenerate = companyName.trim() && employeeName.trim();

  return (
    <>
      <div className="no-print mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-brand">Company & Employee</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Company Name</span>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Technologies Pvt Ltd"
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Company Address (optional)</span>
            <input type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)}
              placeholder="City, State"
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Employee Name</span>
            <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Designation</span>
            <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Senior Analyst"
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Employee ID (optional)</span>
            <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">PAN (optional)</span>
            <input type="text" value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              maxLength={10}
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Pay Period</span>
            <div className="grid grid-cols-2 gap-2">
              <select value={payMonth} onChange={(e) => setPayMonth(Number(e.target.value))}
                className="rounded-lg border border-rule bg-paper px-2 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15">
                {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <input type="number" value={payYear} onChange={(e) => setPayYear(Number(e.target.value))}
                className="rounded-lg border border-rule bg-paper px-2 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Bank A/C — last 4 digits (optional)</span>
            <input type="text" value={bankAccountLast4} onChange={(e) => setBankAccountLast4(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
              maxLength={4}
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
        </div>

        <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-brand">Auto-fill from CTC</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Enter your annual CTC to pre-fill earnings and deductions below using our salary breakup calculator —
          then edit any line to match your actual payslip exactly.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Annual CTC (₹)</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-2.5 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <span className="text-ink-soft">₹</span>
              <input type="text" inputMode="numeric" value={annualCtcInput} onChange={(e) => setAnnualCtcInput(e.target.value)}
                className="tabular w-full bg-transparent text-sm font-medium text-ink outline-none" />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Tax Regime</span>
            <select value={regime} onChange={(e) => setRegime(e.target.value as TaxRegime)}
              className="w-full rounded-lg border border-rule bg-paper px-2 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15">
              <option value="new">New Regime</option>
              <option value="old">Old Regime</option>
            </select>
          </label>
        </div>
      </div>

      {canGenerate ? (
        <div className="mt-8">
          <div className="no-print mb-4">
            <button onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:border-brand hover:text-brand">
              🖨️ Print Payslip
            </button>
          </div>

          <div className="payslip-card rounded-2xl border border-rule bg-surface p-6 shadow-card sm:p-8">
            <div className="border-b border-rule pb-4 text-center">
              <h3 className="font-display text-xl text-ink">{companyName}</h3>
              {companyAddress && <p className="mt-1 text-xs text-ink-soft">{companyAddress}</p>}
              <p className="mt-2 text-sm font-medium text-brand">
                Payslip for {MONTH_NAMES[payMonth]} {payYear}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex justify-between border-b border-dashed border-rule py-1">
                <span className="text-ink-soft">Employee Name</span><span className="text-ink">{employeeName}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-rule py-1">
                <span className="text-ink-soft">Designation</span><span className="text-ink">{designation || "—"}</span>
              </div>
              {employeeId && (
                <div className="flex justify-between border-b border-dashed border-rule py-1">
                  <span className="text-ink-soft">Employee ID</span><span className="text-ink">{employeeId}</span>
                </div>
              )}
              {panNumber && (
                <div className="flex justify-between border-b border-dashed border-rule py-1">
                  <span className="text-ink-soft">PAN</span><span className="text-ink">{panNumber}</span>
                </div>
              )}
              {bankAccountLast4 && (
                <div className="flex justify-between border-b border-dashed border-rule py-1">
                  <span className="text-ink-soft">Bank A/C</span><span className="text-ink">XXXXXXXX{bankAccountLast4}</span>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand">Earnings</h4>
                {earnings.map((item) => (
                  <EditableLine key={item.id} item={item}
                    onLabelChange={(v) => updateLine(earnings, setEarnings, item.id, "label", v)}
                    onAmountChange={(v) => updateLine(earnings, setEarnings, item.id, "amount", v)}
                    onRemove={() => removeLine(earnings, setEarnings, item.id)} />
                ))}
                <button onClick={() => addLine(earnings, setEarnings)} className="no-print mt-1 text-xs font-medium text-brand hover:underline">
                  + Add earning
                </button>
                <div className="mt-2 flex justify-between border-t border-rule pt-2 text-sm font-semibold">
                  <span className="text-ink">Gross Earnings</span>
                  <span className="tabular text-ink">{formatINR(totalEarnings)}</span>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-deduction">Deductions</h4>
                {deductions.map((item) => (
                  <EditableLine key={item.id} item={item} deduction
                    onLabelChange={(v) => updateLine(deductions, setDeductions, item.id, "label", v)}
                    onAmountChange={(v) => updateLine(deductions, setDeductions, item.id, "amount", v)}
                    onRemove={() => removeLine(deductions, setDeductions, item.id)} />
                ))}
                <button onClick={() => addLine(deductions, setDeductions)} className="no-print mt-1 text-xs font-medium text-brand hover:underline">
                  + Add deduction
                </button>
                <div className="mt-2 flex justify-between border-t border-rule pt-2 text-sm font-semibold">
                  <span className="text-ink">Total Deductions</span>
                  <span className="tabular text-deduction">{formatINR(totalDeductions)}</span>
                </div>
              </div>
            </div>

            <div className="brand-gradient mt-6 rounded-xl px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-white/90">Net Pay</span>
                <span className="tabular font-display text-2xl font-semibold text-white">{formatINR(netPay)}</span>
              </div>
              <p className="mt-1 text-xs text-white/70">{amountToWords(netPay)} Rupees Only</p>
            </div>

            <p className="mt-6 text-center text-[10px] text-ink-soft">
              This is a computer-generated payslip and does not require a signature.
            </p>
          </div>
        </div>
      ) : (
        <p className="no-print mt-8 text-sm text-ink-soft">
          Enter company name and employee name to generate the payslip preview.
        </p>
      )}
    </>
  );
}

function EditableLine({
  item,
  deduction = false,
  onLabelChange,
  onAmountChange,
  onRemove,
}: {
  item: LineItem;
  deduction?: boolean;
  onLabelChange: (v: string) => void;
  onAmountChange: (v: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="group flex items-center justify-between gap-2 border-b border-dashed border-rule py-1.5 text-sm">
      <input
        value={item.label}
        onChange={(e) => onLabelChange(e.target.value)}
        className="w-full min-w-0 bg-transparent text-ink-soft outline-none focus:text-ink"
      />
      <input
        value={item.amount}
        onChange={(e) => onAmountChange(e.target.value)}
        inputMode="numeric"
        className={`tabular w-24 shrink-0 bg-transparent text-right font-medium outline-none ${deduction ? "text-deduction" : "text-ink"}`}
      />
      <button onClick={onRemove} className="no-print shrink-0 text-ink-soft opacity-0 transition group-hover:opacity-100 hover:text-deduction">
        ✕
      </button>
    </div>
  );
}
