/**
 * Professional Tax (PT) — a state-levied monthly tax on salaried income
 * in India, separate from central income tax. Rules are set independently
 * by each state government, so unlike EPF/income tax there is no single
 * national table — and public sources disagree more than usual on exact
 * figures (especially Maharashtra's gender-based thresholds).
 *
 * SCOPE: deliberately limited to the two states most consistently
 * verified across multiple independent sources as of June 2026
 * (Maharashtra, Karnataka), plus a `none` option for the many states that
 * levy no PT at all (Delhi, UP, Haryana, Punjab, Rajasthan, Uttarakhand).
 * Do NOT add more states without re-verifying each one individually —
 * PT slabs are notified by individual state gazettes and go stale silently.
 *
 * Maharashtra: ₹7,500/month exemption for men, ₹25,000/month for women;
 *   above threshold, ₹200/month for 11 months + ₹300 in February (so the
 *   annual total lands exactly at the ₹2,500 constitutional ceiling under
 *   Article 276).
 * Karnataka: ₹25,000/month exemption (all genders); ₹200/month flat above
 *   that, revised effective 1 April 2025, no special adjustment month.
 */

export type ProfessionalTaxState = "maharashtra" | "karnataka" | "none";
export type Gender = "male" | "female";

export interface ProfessionalTaxResult {
  state: ProfessionalTaxState;
  monthlyAmount: number;
  /** Amount specifically in the adjustment month (Maharashtra: February). null if not applicable. */
  adjustmentMonthAmount: number | null;
  annualAmount: number;
  exempt: boolean;
  note: string;
}

export function calculateProfessionalTax(
  monthlyGrossSalary: number,
  state: ProfessionalTaxState,
  gender: Gender = "male"
): ProfessionalTaxResult {
  if (state === "none") {
    return {
      state,
      monthlyAmount: 0,
      adjustmentMonthAmount: null,
      annualAmount: 0,
      exempt: true,
      note: "This state does not levy professional tax (e.g. Delhi, UP, Haryana, Punjab, Rajasthan, Uttarakhand).",
    };
  }

  if (state === "maharashtra") {
    const threshold = gender === "female" ? 25_000 : 7_500;
    if (monthlyGrossSalary <= threshold) {
      return {
        state,
        monthlyAmount: 0,
        adjustmentMonthAmount: null,
        annualAmount: 0,
        exempt: true,
        note: `Exempt: Maharashtra PT applies above ₹${threshold.toLocaleString("en-IN")}/month for ${gender === "female" ? "women" : "men"}.`,
      };
    }
    return {
      state,
      monthlyAmount: 200,
      adjustmentMonthAmount: 300,
      annualAmount: 200 * 11 + 300,
      exempt: false,
      note: "₹200/month for 11 months, ₹300 in February — annual total ₹2,500.",
    };
  }

  // Karnataka
  const threshold = 25_000;
  if (monthlyGrossSalary <= threshold) {
    return {
      state,
      monthlyAmount: 0,
      adjustmentMonthAmount: null,
      annualAmount: 0,
      exempt: true,
      note: `Exempt: Karnataka PT applies above ₹${threshold.toLocaleString("en-IN")}/month gross salary.`,
    };
  }
  return {
    state,
    monthlyAmount: 200,
    adjustmentMonthAmount: null,
    annualAmount: 200 * 12,
    exempt: false,
    note: "Flat ₹200/month above the threshold, revised effective 1 April 2025.",
  };
}
