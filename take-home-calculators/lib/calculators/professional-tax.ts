export type ProfessionalTaxState = "maharashtra" | "karnataka" | "none";
export type Gender = "male" | "female";

export interface ProfessionalTaxResult {
  state: ProfessionalTaxState;
  monthlyAmount: number;
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
