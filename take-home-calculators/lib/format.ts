/**
 * Indian numbering system formatting (lakh/crore grouping: 12,34,567
 * rather than the international 1,234,567). This is the format every
 * payslip, bank statement, and salary discussion in India actually uses
 * — using international grouping here would read as foreign and wrong
 * to the target audience.
 */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrFormatterNoSymbol = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/** Formats a number as "₹12,34,567". */
export function formatINR(amount: number): string {
  return inrFormatter.format(Math.round(amount));
}

/** Formats a number as "12,34,567" (no currency symbol). */
export function formatNumberINR(amount: number): string {
  return inrFormatterNoSymbol.format(Math.round(amount));
}

/**
 * Formats large rupee amounts in lakh/crore shorthand for headlines,
 * e.g. 1234567 -> "₹12.3 L", 50000000 -> "₹5 Cr".
 */
export function formatINRCompact(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_00_00_000) {
    return `₹${(amount / 1_00_00_000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (abs >= 1_00_000) {
    return `₹${(amount / 1_00_000).toFixed(2).replace(/\.00$/, "")} L`;
  }
  return formatINR(amount);
}
