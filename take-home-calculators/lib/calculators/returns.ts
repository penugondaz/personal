export interface CagrInput {
  initialValue: number;
  finalValue: number;
  years: number;
}

export interface CagrResult {
  initialValue: number;
  finalValue: number;
  years: number;
  cagrPercent: number;
  absoluteReturnPercent: number;
}

/**
 * CAGR = (Final / Initial)^(1/years) − 1
 * The standard "smoothed annual growth rate" figure, useful for
 * comparing investments held for different periods or with uneven
 * year-to-year returns.
 */
export function calculateCagr(input: CagrInput): CagrResult {
  const { initialValue, finalValue, years } = input;
  const cagrPercent =
    initialValue > 0 && years > 0 ? (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100 : 0;
  const absoluteReturnPercent = initialValue > 0 ? ((finalValue - initialValue) / initialValue) * 100 : 0;

  return {
    initialValue,
    finalValue,
    years,
    cagrPercent: Math.round(cagrPercent * 100) / 100,
    absoluteReturnPercent: Math.round(absoluteReturnPercent * 100) / 100,
  };
}

export interface XirrCashFlow {
  date: Date;
  amount: number; // negative for investments (outflows), positive for redemptions/current value (inflow)
}

export interface XirrResult {
  xirrPercent: number | null;
  converged: boolean;
}

/**
 * XIRR solves for the rate r such that:
 *   sum( CFi / (1+r)^(di/365) ) = 0
 * where di is days from the first cash flow date. Unlike CAGR, XIRR
 * handles irregular, multiple cash flows (e.g. several lumpsum top-ups
 * at different dates) — this is what mutual fund platforms actually
 * use to report "returns" when there isn't a single clean initial/final
 * pair. Solved numerically via Newton-Raphson since there's no
 * closed-form solution for irregular cash flows.
 */
export function calculateXirr(cashFlows: XirrCashFlow[]): XirrResult {
  if (cashFlows.length < 2) return { xirrPercent: null, converged: false };

  const sorted = [...cashFlows].sort((a, b) => a.date.getTime() - b.date.getTime());
  const firstDate = sorted[0].date;
  const dayDiffs = sorted.map((cf) => (cf.date.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

  function npv(rate: number): number {
    return sorted.reduce((sum, cf, i) => sum + cf.amount / Math.pow(1 + rate, dayDiffs[i] / 365), 0);
  }

  function npvDerivative(rate: number): number {
    return sorted.reduce(
      (sum, cf, i) =>
        sum - (cf.amount * (dayDiffs[i] / 365)) / Math.pow(1 + rate, dayDiffs[i] / 365 + 1),
      0
    );
  }

  let rate = 0.1; // initial guess: 10%
  let converged = false;

  for (let i = 0; i < 100; i++) {
    const value = npv(rate);
    const derivative = npvDerivative(rate);
    if (Math.abs(derivative) < 1e-10) break;

    const newRate = rate - value / derivative;
    if (Math.abs(newRate - rate) < 1e-7) {
      rate = newRate;
      converged = true;
      break;
    }
    rate = newRate;
    if (rate <= -0.99) rate = -0.99; // guard against runaway negative rates
  }

  if (!converged || !Number.isFinite(rate)) {
    return { xirrPercent: null, converged: false };
  }

  return { xirrPercent: Math.round(rate * 10000) / 100, converged: true };
}
