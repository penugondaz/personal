"use client";
import { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";

export default function DiscountCalculatorPage() {
  const [original, setOriginal] = useState("1000");
  const [discount, setDiscount] = useState("20");
  const [mode, setMode] = useState<"percent"|"flat">("percent");

  const orig = Math.max(0, Number(original.replace(/[^0-9.]/g,""))||0);
  const disc = Math.max(0, Number(discount.replace(/[^0-9.]/g,""))||0);
  const discAmt = mode === "percent" ? Math.round(orig * disc / 100) : Math.min(disc, orig);
  const finalPrice = Math.max(0, orig - discAmt);
  const pctOff = orig > 0 ? ((discAmt / orig) * 100).toFixed(2) : "0";
  const savings = discAmt;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft"><Link href="/" className="hover:text-brand">Home</Link><span className="mx-1.5">/</span><Link href="/tools" className="hover:text-brand">Tools</Link><span className="mx-1.5">/</span><span aria-current="page">Discount Calculator</span></nav>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Discount Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">Calculate the final price after applying a percentage or flat discount. Ideal for shopping, invoicing, and offers.</p>

      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card space-y-4">
        <div className="flex gap-2">
          {(["percent","flat"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${mode===m?"border-brand bg-brand text-white":"border-rule text-ink-soft hover:border-brand"}`}>
              {m === "percent" ? "% Discount" : "Flat Amount Off"}
            </button>
          ))}
        </div>
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">Original Price (₹)</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span className="text-ink-soft">₹</span>
            <input type="text" inputMode="numeric" value={original} onChange={e => setOriginal(e.target.value)} className="tabular w-full bg-transparent text-xl font-semibold text-ink outline-none" />
          </div>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink-soft">{mode === "percent" ? "Discount %" : "Discount Amount (₹)"}</span>
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper px-3 py-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            {mode === "flat" && <span className="text-ink-soft">₹</span>}
            <input type="text" inputMode="decimal" value={discount} onChange={e => setDiscount(e.target.value)} className="tabular w-full bg-transparent text-xl font-semibold text-ink outline-none" />
            {mode === "percent" && <span className="text-ink-soft">%</span>}
          </div>
        </label>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
        <div className="brand-gradient px-6 py-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">Final Price</p>
          <div className="mt-1 font-display text-5xl font-semibold text-white">{formatINR(finalPrice)}</div>
          <p className="mt-1 text-sm text-white/70">You save {formatINR(savings)} ({pctOff}% off)</p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-rule px-6 py-5 sm:px-8">
          <div className="pr-4"><p className="text-xs text-ink-soft">Original</p><p className="tabular mt-1 font-display text-lg font-semibold text-ink">{formatINR(orig)}</p></div>
          <div className="px-4"><p className="text-xs text-ink-soft">Discount</p><p className="tabular mt-1 font-display text-lg font-semibold text-deduction">−{formatINR(discAmt)}</p></div>
          <div className="pl-4"><p className="text-xs text-ink-soft">You Pay</p><p className="tabular mt-1 font-display text-lg font-semibold text-brand">{formatINR(finalPrice)}</p></div>
        </div>
      </div>

      {/* Visual bar */}
      <div className="mt-4 rounded-xl border border-rule bg-surface p-4">
        <p className="text-xs text-ink-soft mb-2">Savings breakdown</p>
        <div className="flex h-6 w-full overflow-hidden rounded-full">
          <div className="bg-brand h-full transition-all" style={{width:`${100 - Number(pctOff)}%`}} />
          <div className="bg-deduction/30 h-full transition-all" style={{width:`${Number(pctOff)}%`}} />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-ink-soft">
          <span>You pay {(100 - Number(pctOff)).toFixed(1)}%</span>
          <span>Save {pctOff}%</span>
        </div>
      </div>
    </main>
  );
}
