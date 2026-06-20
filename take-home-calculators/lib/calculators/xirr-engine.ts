// ─── True XIRR via Newton-Raphson ────────────────────────────────────────────

export interface CashFlow {
  date: Date;
  amount: number; // negative = outflow, positive = inflow
}

function daysBetween(d1: Date, d2: Date): number {
  return (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
}

function npv(rate: number, flows: CashFlow[], d0: Date): number {
  return flows.reduce((sum, cf) => {
    const t = daysBetween(d0, cf.date) / 365;
    return sum + cf.amount / Math.pow(1 + rate, t);
  }, 0);
}

function npvDeriv(rate: number, flows: CashFlow[], d0: Date): number {
  return flows.reduce((sum, cf) => {
    const t = daysBetween(d0, cf.date) / 365;
    return sum - (t * cf.amount) / Math.pow(1 + rate, t + 1);
  }, 0);
}

export function calculateXIRR(flows: CashFlow[], guess = 0.1): number | null {
  if (flows.length < 2) return null;
  const hasPos = flows.some(f => f.amount > 0);
  const hasNeg = flows.some(f => f.amount < 0);
  if (!hasPos || !hasNeg) return null;

  const d0 = flows.reduce((mn, f) => (f.date < mn ? f.date : mn), flows[0].date);
  const sorted = [...flows].sort((a, b) => a.date.getTime() - b.date.getTime());

  let rate = guess;
  for (let i = 0; i < 1000; i++) {
    const f  = npv(rate, sorted, d0);
    const df = npvDeriv(rate, sorted, d0);
    if (Math.abs(df) < 1e-12) break;
    const next = rate - f / df;
    if (Math.abs(next - rate) < 1e-8) return Math.round(next * 1e6) / 1e6;
    rate = next;
    if (rate <= -1) rate = -0.9999;
  }
  // try alternate guess if didn't converge
  if (guess === 0.1) return calculateXIRR(flows, -0.5);
  return null;
}

// ─── Investment rating ────────────────────────────────────────────────────────

export interface Rating {
  label: string;
  color: string;
  bg: string;
  description: string;
}

export function getRating(xirr: number): Rating {
  if (xirr < 0.04) return { label: "Very Poor", color: "#dc2626", bg: "#fef2f2", description: "Your policy return is below inflation. You are losing real wealth." };
  if (xirr < 0.06) return { label: "Poor",      color: "#c2410c", bg: "#fff7ed", description: "Returns are below savings account alternatives like PPF or EPF." };
  if (xirr < 0.08) return { label: "Average",   color: "#d97706", bg: "#fffbeb", description: "Roughly in line with PPF. Barely beats inflation after tax." };
  if (xirr < 0.10) return { label: "Good",      color: "#65a30d", bg: "#f7fee7", description: "Competitive return for a guaranteed insurance product." };
  if (xirr < 0.12) return { label: "Very Good", color: "#16a34a", bg: "#f0fdf4", description: "Excellent for a life insurance policy. Beats most guaranteed products." };
  return               { label: "Excellent",  color: "#0369a1", bg: "#eff6ff", description: "Outstanding. Rare for traditional insurance — verify your inputs." };
}
