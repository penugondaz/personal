export type AssetClass = "listed_equity_or_equity_mf" | "debt_mf_or_other";

export interface CapitalGainsInput {
  assetClass: AssetClass;
  purchasePrice: number;
  salePrice: number;
  holdingPeriodMonths: number;
}

export interface CapitalGainsResult {
  gainAmount: number;
  gainType: "short_term" | "long_term";
  exemptionApplied: number;
  taxableGain: number;
  taxRatePercent: number;
  taxPayable: number;
  cessIncluded: boolean;
  note: string;
}

// Thresholds per current rules (FY 2025-26, post the Budget 2024 LTCG changes)
const EQUITY_LTCG_HOLDING_MONTHS = 12;
const DEBT_LTCG_HOLDING_MONTHS = 24;
const EQUITY_LTCG_EXEMPTION = 125_000; // per financial year
const EQUITY_LTCG_RATE = 0.125; // 12.5% above exemption, post Budget 2024
const EQUITY_STCG_RATE = 0.2; // 20%, post Budget 2024
const DEBT_OTHER_LTCG_RATE = 0.125; // 12.5% without indexation, post Budget 2024 (simplification)
const CESS_RATE = 0.04;

/**
 * Capital gains tax depends on asset class and holding period:
 *
 *  Listed equity / equity mutual funds:
 *   - Held > 12 months = LTCG, taxed at 12.5% above a 1.25 lakh/year
 *     exemption (no indexation benefit).
 *   - Held <= 12 months = STCG, taxed flat at 20%.
 *
 *  Debt mutual funds / other capital assets (simplified):
 *   - Held > 24 months = LTCG, taxed at 12.5% (no indexation, per the
 *     Budget 2024 rules that removed indexation for most assets).
 *   - Held <= 24 months = STCG, added to total income and taxed at
 *     your slab rate (this calculator shows the gain only — applying
 *     a marginal slab rate requires knowing the rest of your income).
 *
 * This is a simplified model — real capital gains computation involves
 * cost inflation indexation history, grandfathering rules for pre-2018
 * equity holdings, and asset-specific carve-outs not modeled here.
 */
export function calculateCapitalGains(input: CapitalGainsInput): CapitalGainsResult {
  const { assetClass, purchasePrice, salePrice, holdingPeriodMonths } = input;
  const gainAmount = salePrice - purchasePrice;

  if (assetClass === "listed_equity_or_equity_mf") {
    const isLongTerm = holdingPeriodMonths > EQUITY_LTCG_HOLDING_MONTHS;

    if (isLongTerm) {
      const exemptionApplied = Math.min(Math.max(0, gainAmount), EQUITY_LTCG_EXEMPTION);
      const taxableGain = Math.max(0, gainAmount - exemptionApplied);
      const taxBeforeCess = taxableGain * EQUITY_LTCG_RATE;
      const taxPayable = Math.round(taxBeforeCess * (1 + CESS_RATE));

      return {
        gainAmount: Math.round(gainAmount),
        gainType: "long_term",
        exemptionApplied: Math.round(exemptionApplied),
        taxableGain: Math.round(taxableGain),
        taxRatePercent: EQUITY_LTCG_RATE * 100,
        taxPayable,
        cessIncluded: true,
        note: `Long-term equity gains are exempt up to ${EQUITY_LTCG_EXEMPTION.toLocaleString("en-IN")}/year, taxed at 12.5% above that, plus 4% cess.`,
      };
    }

    const taxBeforeCess = Math.max(0, gainAmount) * EQUITY_STCG_RATE;
    const taxPayable = Math.round(taxBeforeCess * (1 + CESS_RATE));

    return {
      gainAmount: Math.round(gainAmount),
      gainType: "short_term",
      exemptionApplied: 0,
      taxableGain: Math.max(0, Math.round(gainAmount)),
      taxRatePercent: EQUITY_STCG_RATE * 100,
      taxPayable,
      cessIncluded: true,
      note: "Short-term equity gains (held 12 months or less) are taxed flat at 20%, plus 4% cess. No exemption applies.",
    };
  }

  // Debt / other assets
  const isLongTerm = holdingPeriodMonths > DEBT_LTCG_HOLDING_MONTHS;

  if (isLongTerm) {
    const taxBeforeCess = Math.max(0, gainAmount) * DEBT_OTHER_LTCG_RATE;
    const taxPayable = Math.round(taxBeforeCess * (1 + CESS_RATE));

    return {
      gainAmount: Math.round(gainAmount),
      gainType: "long_term",
      exemptionApplied: 0,
      taxableGain: Math.max(0, Math.round(gainAmount)),
      taxRatePercent: DEBT_OTHER_LTCG_RATE * 100,
      taxPayable,
      cessIncluded: true,
      note: "Long-term gains on debt funds / other assets (held over 24 months) are taxed at 12.5% without indexation, plus 4% cess.",
    };
  }

  return {
    gainAmount: Math.round(gainAmount),
    gainType: "short_term",
    exemptionApplied: 0,
    taxableGain: Math.max(0, Math.round(gainAmount)),
    taxRatePercent: 0,
    taxPayable: 0,
    cessIncluded: false,
    note: "Short-term gains on debt funds / other assets are added to your total income and taxed at your income tax slab rate — not a flat rate, so no fixed tax figure is shown here.",
  };
}
