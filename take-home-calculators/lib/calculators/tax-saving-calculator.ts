// take-home-calculators/lib/calculators/tax-saving.ts
// Tax saving opportunities calculator for Indian salaried employees

export interface TaxSavingInput {
  annualCtc: number;
  regime?: "new" | "old";
  basicPercentOfCtc?: number;
  hraPercentOfBasic?: number;
  cityType?: "metro" | "non_metro";
  rentPaidMonthly?: number;
}

export interface TaxSavingOpportunity {
  section: string;
  title: string;
  description: string;
  maxDeduction: number;
  applicableRegime: "old" | "both";
  category: "investment" | "insurance" | "housing" | "pension" | "other";
  taxSavedAtSlab: number; // at 30% slab (maximum)
  priority: "high" | "medium" | "low";
}

export interface TaxSavingResult {
  grossSalaryAnnual: number;
  basicAnnual: number;
  hraAnnual: number;
  currentTaxNew: number;
  currentTaxOld: number;
  currentTaxOldWithStandardDeduction: number;
  effectiveTaxRateNew: number;
  effectiveTaxRateOld: number;
  marginalSlabNew: number;
  marginalSlabOld: number;
  opportunities: TaxSavingOpportunity[];
  // Scenario: if all deductions claimed under old regime
  maxPossibleDeductions: number;
  taxAfterAllDeductions: number;
  maxPossibleSaving: number; // vs new regime (whichever is less)
  breakEvenDeductions: number; // deductions needed to make old regime better
  recommendedRegime: "new" | "old";
  hraExemptionPotential: number;
  summary: {
    section80C: number;
    section80D: number;
    section80CCD1B: number;
    section80EEA: number;
    hra: number;
    section80G: number;
    total: number;
  };
}

const STANDARD_DEDUCTION_NEW = 75_000;
const STANDARD_DEDUCTION_OLD = 50_000;
const SECTION_80C_MAX = 150_000;
const SECTION_80D_SELF = 25_000;
const SECTION_80D_PARENTS = 50_000; // senior citizen parents
const SECTION_80CCD1B_MAX = 50_000; // NPS additional
const SECTION_80EEA_MAX = 150_000; // affordable housing interest
const SECTION_24B_MAX = 200_000; // home loan interest
const SECTION_87A_NEW_THRESHOLD = 1_200_000;
const SECTION_87A_NEW_REBATE = 60_000;
const SECTION_87A_OLD_THRESHOLD = 500_000;
const SECTION_87A_OLD_REBATE = 12_500;
const CESS_RATE = 0.04;

const NEW_SLABS = [
  { from: 0, to: 400_000, rate: 0 },
  { from: 400_000, to: 800_000, rate: 0.05 },
  { from: 800_000, to: 1_200_000, rate: 0.10 },
  { from: 1_200_000, to: 1_600_000, rate: 0.15 },
  { from: 1_600_000, to: 2_000_000, rate: 0.20 },
  { from: 2_000_000, to: 2_400_000, rate: 0.25 },
  { from: 2_400_000, to: null, rate: 0.30 },
];

const OLD_SLABS = [
  { from: 0, to: 250_000, rate: 0 },
  { from: 250_000, to: 500_000, rate: 0.05 },
  { from: 500_000, to: 1_000_000, rate: 0.20 },
  { from: 1_000_000, to: null, rate: 0.30 },
];

function calcSlabTax(income: number, slabs: typeof NEW_SLABS): number {
  let tax = 0;
  for (const slab of slabs) {
    if (income <= slab.from) break;
    const upper = slab.to === null ? income : Math.min(income, slab.to);
    tax += (upper - slab.from) * slab.rate;
  }
  return tax;
}

function getMarginalRate(income: number, slabs: typeof NEW_SLABS): number {
  for (let i = slabs.length - 1; i >= 0; i--) {
    if (income > slabs[i].from) return slabs[i].rate;
  }
  return 0;
}

function applyRebateAndCess(
  tax: number,
  taxableIncome: number,
  threshold: number,
  maxRebate: number
): number {
  if (taxableIncome <= threshold) {
    tax = Math.max(0, tax - Math.min(tax, maxRebate));
  }
  // Marginal relief
  if (taxableIncome > threshold && taxableIncome <= threshold + maxRebate) {
    const excessIncome = taxableIncome - threshold;
    tax = Math.min(tax, excessIncome);
  }
  return Math.round(tax * (1 + CESS_RATE));
}

export function calculateTaxSaving(input: TaxSavingInput): TaxSavingResult {
  const {
    annualCtc,
    basicPercentOfCtc = 0.4,
    hraPercentOfBasic = 0.5,
    cityType = "non_metro",
    rentPaidMonthly = 0,
  } = input;

  const basicAnnual = annualCtc * basicPercentOfCtc;
  const hraAnnual = basicAnnual * hraPercentOfBasic;
  const gratuityAnnual = basicAnnual * 0.0481;
  const employerPfAnnual = basicAnnual * 0.12;
  const grossSalaryAnnual = annualCtc - gratuityAnnual - employerPfAnnual;

  // New regime tax
  const taxableNew = Math.max(0, grossSalaryAnnual - STANDARD_DEDUCTION_NEW);
  const slabTaxNew = calcSlabTax(taxableNew, NEW_SLABS);
  const currentTaxNew = applyRebateAndCess(
    slabTaxNew, taxableNew,
    SECTION_87A_NEW_THRESHOLD, SECTION_87A_NEW_REBATE
  );

  // Old regime tax (standard deduction only)
  const taxableOld = Math.max(0, grossSalaryAnnual - STANDARD_DEDUCTION_OLD);
  const slabTaxOld = calcSlabTax(taxableOld, OLD_SLABS);
  const currentTaxOld = applyRebateAndCess(
    slabTaxOld, taxableOld,
    SECTION_87A_OLD_THRESHOLD, SECTION_87A_OLD_REBATE
  );

  const marginalSlabNew = getMarginalRate(taxableNew, NEW_SLABS);
  const marginalSlabOld = getMarginalRate(taxableOld, OLD_SLABS);

  // HRA exemption potential (old regime only)
  const basicMonthly = basicAnnual / 12;
  const hraMonthly = hraAnnual / 12;
  const cityLimitPercent = cityType === "metro" ? 0.5 : 0.4;
  const cityLimitMonthly = basicMonthly * cityLimitPercent;
  const rentMinusTenPercent = Math.max(0, rentPaidMonthly - 0.1 * basicMonthly);
  const hraExemptionMonthly = rentPaidMonthly > 0
    ? Math.min(hraMonthly, cityLimitMonthly, rentMinusTenPercent)
    : 0;
  const hraExemptionPotential = Math.round(hraExemptionMonthly * 12);

  // Max possible deductions under old regime
  const maxDeductions =
    SECTION_80C_MAX +
    SECTION_80CCD1B_MAX +
    SECTION_80D_SELF +
    SECTION_80D_PARENTS +
    SECTION_24B_MAX +
    SECTION_80EEA_MAX +
    hraExemptionPotential;

  const taxableWithAllDeductions = Math.max(
    0,
    taxableOld - maxDeductions
  );
  const slabTaxAllDeductions = calcSlabTax(taxableWithAllDeductions, OLD_SLABS);
  const taxAfterAllDeductions = applyRebateAndCess(
    slabTaxAllDeductions, taxableWithAllDeductions,
    SECTION_87A_OLD_THRESHOLD, SECTION_87A_OLD_REBATE
  );

  const maxPossibleSaving = Math.max(0, currentTaxNew - taxAfterAllDeductions);

  // Break-even: deductions needed to match new regime tax
  // Binary search for break-even
  let low = 0, high = 2_000_000, breakEvenDeductions = 0;
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const ti = Math.max(0, taxableOld - mid);
    const t = applyRebateAndCess(
      calcSlabTax(ti, OLD_SLABS), ti,
      SECTION_87A_OLD_THRESHOLD, SECTION_87A_OLD_REBATE
    );
    if (t > currentTaxNew) { low = mid; }
    else { high = mid; breakEvenDeductions = mid; }
  }

  const recommendedRegime: "new" | "old" =
    taxAfterAllDeductions < currentTaxNew && maxPossibleSaving > 0
      ? "old" : "new";

  // Build opportunities list
  const opportunities: TaxSavingOpportunity[] = [
    {
      section: "80C",
      title: "Section 80C Investments",
      description:
        "ELSS mutual funds, PPF, EPF (employee contribution), NSC, 5-year tax-saving FDs, life insurance premiums, ULIP, Sukanya Samriddhi, tuition fees for children.",
      maxDeduction: SECTION_80C_MAX,
      applicableRegime: "old",
      category: "investment",
      taxSavedAtSlab: Math.round(SECTION_80C_MAX * marginalSlabOld * (1 + CESS_RATE)),
      priority: marginalSlabOld >= 0.2 ? "high" : "medium",
    },
    {
      section: "80CCD(1B)",
      title: "NPS — Additional ₹50,000 Deduction",
      description:
        "Voluntary NPS contributions beyond your employer's NPS offering unlock an exclusive extra ₹50,000 deduction under Section 80CCD(1B), on top of the 80C limit.",
      maxDeduction: SECTION_80CCD1B_MAX,
      applicableRegime: "old",
      category: "pension",
      taxSavedAtSlab: Math.round(SECTION_80CCD1B_MAX * marginalSlabOld * (1 + CESS_RATE)),
      priority: marginalSlabOld >= 0.2 ? "high" : "medium",
    },
    {
      section: "80D",
      title: "Health Insurance Premium",
      description:
        "Premiums paid for health insurance (mediclaim) for yourself, spouse, and children up to ₹25,000. Additional ₹50,000 if you pay for senior citizen parents. ₹5,000 can be for preventive health check-ups.",
      maxDeduction: SECTION_80D_SELF + SECTION_80D_PARENTS,
      applicableRegime: "old",
      category: "insurance",
      taxSavedAtSlab: Math.round((SECTION_80D_SELF + SECTION_80D_PARENTS) * marginalSlabOld * (1 + CESS_RATE)),
      priority: "high",
    },
    {
      section: "HRA",
      title: "House Rent Allowance Exemption",
      description:
        "If you pay rent and receive HRA, the exemption under Section 10(13A) is the lowest of: actual HRA received, 50% of basic (metro) / 40% (non-metro), or rent paid minus 10% of basic. Only available under old regime.",
      maxDeduction: hraExemptionPotential > 0 ? hraExemptionPotential : hraAnnual,
      applicableRegime: "old",
      category: "housing",
      taxSavedAtSlab: Math.round((hraExemptionPotential > 0 ? hraExemptionPotential : Math.min(hraAnnual, 200_000)) * marginalSlabOld * (1 + CESS_RATE)),
      priority: hraAnnual > 60_000 ? "high" : "medium",
    },
    {
      section: "24(b)",
      title: "Home Loan Interest Deduction",
      description:
        "Interest paid on a home loan for a self-occupied property is deductible up to ₹2 lakh per year under Section 24(b). For let-out properties, the full interest is deductible.",
      maxDeduction: SECTION_24B_MAX,
      applicableRegime: "old",
      category: "housing",
      taxSavedAtSlab: Math.round(SECTION_24B_MAX * marginalSlabOld * (1 + CESS_RATE)),
      priority: marginalSlabOld >= 0.2 ? "high" : "low",
    },
    {
      section: "80EEA",
      title: "Affordable Housing Loan Interest",
      description:
        "First-time home buyers of affordable housing (stamp duty value ≤ ₹45 lakh) can claim an additional ₹1.5 lakh interest deduction under 80EEA, over and above the ₹2 lakh under Section 24(b).",
      maxDeduction: SECTION_80EEA_MAX,
      applicableRegime: "old",
      category: "housing",
      taxSavedAtSlab: Math.round(SECTION_80EEA_MAX * marginalSlabOld * (1 + CESS_RATE)),
      priority: "low",
    },
    {
      section: "80G",
      title: "Donations to Charitable Organisations",
      description:
        "Donations to approved funds, trusts, and institutions are deductible at 50% or 100% of the donated amount, subject to limits. PM Relief Fund, National Defence Fund, and some others offer 100% deduction without limit.",
      maxDeduction: 0, // unlimited for qualifying donations
      applicableRegime: "old",
      category: "other",
      taxSavedAtSlab: 0,
      priority: "low",
    },
    {
      section: "80TTA/80TTB",
      title: "Savings Account Interest",
      description:
        "Interest on savings bank accounts (not FDs) is deductible up to ₹10,000 under 80TTA. Senior citizens can deduct up to ₹50,000 on all interest income (savings, FDs, RDs) under 80TTB.",
      maxDeduction: 10_000,
      applicableRegime: "old",
      category: "investment",
      taxSavedAtSlab: Math.round(10_000 * marginalSlabOld * (1 + CESS_RATE)),
      priority: "low",
    },
    {
      section: "80E",
      title: "Education Loan Interest",
      description:
        "Interest on education loans for higher studies is fully deductible under Section 80E for up to 8 years from the year you start repaying, with no upper limit on the deduction amount.",
      maxDeduction: 0, // no cap
      applicableRegime: "old",
      category: "other",
      taxSavedAtSlab: 0,
      priority: "medium",
    },
    {
      section: "80EEB",
      title: "Electric Vehicle Loan Interest",
      description:
        "Interest on loans taken to buy electric vehicles is deductible up to ₹1.5 lakh per year under Section 80EEB. The loan must be sanctioned between April 2019 and March 2023.",
      maxDeduction: 150_000,
      applicableRegime: "old",
      category: "other",
      taxSavedAtSlab: Math.round(150_000 * marginalSlabOld * (1 + CESS_RATE)),
      priority: "low",
    },
  ].filter(o => {
    // Filter out irrelevant ones for very low incomes
    if (annualCtc < 500_000 && o.section === "80EEA") return false;
    if (annualCtc < 300_000 && o.section === "24(b)") return false;
    return true;
  });

  const summary = {
    section80C: SECTION_80C_MAX,
    section80D: SECTION_80D_SELF + SECTION_80D_PARENTS,
    section80CCD1B: SECTION_80CCD1B_MAX,
    section80EEA: SECTION_80EEA_MAX,
    hra: hraExemptionPotential,
    section80G: 0,
    total: SECTION_80C_MAX + (SECTION_80D_SELF + SECTION_80D_PARENTS) + SECTION_80CCD1B_MAX + SECTION_80EEA_MAX + hraExemptionPotential,
  };

  return {
    grossSalaryAnnual: Math.round(grossSalaryAnnual),
    basicAnnual: Math.round(basicAnnual),
    hraAnnual: Math.round(hraAnnual),
    currentTaxNew,
    currentTaxOld,
    currentTaxOldWithStandardDeduction: currentTaxOld,
    effectiveTaxRateNew: grossSalaryAnnual > 0 ? (currentTaxNew / grossSalaryAnnual) * 100 : 0,
    effectiveTaxRateOld: grossSalaryAnnual > 0 ? (currentTaxOld / grossSalaryAnnual) * 100 : 0,
    marginalSlabNew: marginalSlabNew * 100,
    marginalSlabOld: marginalSlabOld * 100,
    opportunities,
    maxPossibleDeductions: Math.round(maxDeductions),
    taxAfterAllDeductions,
    maxPossibleSaving: Math.round(maxPossibleSaving),
    breakEvenDeductions: Math.round(breakEvenDeductions),
    recommendedRegime,
    hraExemptionPotential,
    summary,
  };
}

// LPA values to generate pages for
export const TAX_SAVING_LPA_VALUES = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 18, 20, 25, 30, 35, 40, 50, 60,
];

export function taxSavingSlug(lpa: number): string {
  return `${String(lpa).replace(".", "-")}-lpa`;
}

export function parseTaxSavingSlug(slug: string): number | null {
  const match = slug.match(/^(\d+(?:-\d+)?)-lpa$/);
  if (!match) return null;
  const lpa = Number(match[1].replace("-", "."));
  return TAX_SAVING_LPA_VALUES.includes(lpa) ? lpa : null;
}
