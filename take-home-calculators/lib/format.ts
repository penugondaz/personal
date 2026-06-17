const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrFormatterNoSymbol = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return inrFormatter.format(Math.round(amount));
}

export function formatNumberINR(amount: number): string {
  return inrFormatterNoSymbol.format(Math.round(amount));
}

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
