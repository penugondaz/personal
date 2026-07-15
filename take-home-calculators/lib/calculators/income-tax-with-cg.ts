/**
 * Unified Income Tax + Capital Gains Calculator
 * Covers FY 2025-26 rules including post-Budget 2024 capital gains changes
 */

import {
  NEW_REGIME_SLABS, OLD_REGIME_SLABS,
  STANDARD_DEDUCTION, SECTION_87A,
  HEALTH_AND_EDUCATION_CESS_RATE, SURCHARGE_BANDS,
  calculateSlabTax, type TaxRegime,
} from "./income-tax";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IncomeSource {
  salary: number;              // Gross salary (before std deduction)
  interestIncome: number;      // FD interest, savings bank interest
  rentalIncome: number;        // Annual rent received
  businessIncome: number;      // Business / freelance / professional income
  otherIncome: number;         // Dividends, gifts, etc.
}

export interface CapitalGainEntry {
  id: number;
  label: string;
  type: "equity_ltcg" | "equity_stcg" | "debt_ltcg" | "debt_stcg" | "property_ltcg" | "property_stcg";
  amount: number;              // Net gain (sale - purchase)
}

export interface Deductions {
  // Old regime only
  section80C: number;          // PF, ELSS, PPF, LIC etc. (max 1.5L)
  section80D: number;          // Health insurance (max 25k/50k)
  section24b: number;          // Home loan interest (max 2L)
  nps80CCD: number;            // NPS 80CCD(1B) (max 50k)
  hra: number;                 // HRA exemption
  lta: number;                 // LTA exemption
  otherDeductions: number;     // 80G, 80TTA, etc.
  // Common
  rentalExpenses: number;      // 30% standard deduction on rental income (auto)
}

export interface TaxWithCGResult {
  // Income breakdown
  grossSalary: number;
  standardDeduction: number;
  netSalary: number;
  totalOrdinaryIncome: number;
  totalDeductions: number;
  taxableOrdinaryIncome: number;

  // Capital gains breakdown
  equityLtcg: number;
  equityStcg: number;
  debtLtcg: number;
  debtStcgAddedToIncome: number;   // added to ordinary income
  propertyLtcg: number;
  propertyStcgAddedToIncome: number;
  ltcgExemption: number;           // ₹1.25L on equity LTCG

  // Tax on each component
  taxOnOrdinaryIncome: number;
  taxOnEquityLtcg: number;         // 12.5% above ₹1.25L exemption
  taxOnEquityStcg: number;         // 20%
  taxOnDebtLtcg: number;           // 12.5% without indexation
  taxOnPropertyLtcg: number;       // 12.5% without indexation

  // Totals
  totalTaxBeforeRebate: number;
  rebate87A: number;
  surcharge: number;
  cess: number;
  totalTaxPayable: number;
  effectiveRate: number;

  // Slab breakdown for ordinary income
  slabBreakdown: { from: number; to: number | null; rate: number; taxInSlab: number }[];

  // Marginal rate
  marginalRate: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const CAPITAL_GAINS_TYPES = [
  {
    type: "equity_ltcg",
    label: "Equity / Equity MF — Long Term (>12 months)",
    desc: "Listed stocks, equity mutual funds held >1 year",
    rate: "12.5% above ₹1.25L exemption",
    addedToIncome: false,
  },
  {
    type: "equity_stcg",
    label: "Equity / Equity MF — Short Term (≤12 months)",
    desc: "Listed stocks, equity mutual funds held ≤1 year",
    rate: "20% flat",
    addedToIncome: false,
  },
  {
    type: "debt_ltcg",
    label: "Debt MF / Bonds — Long Term (>24 months)",
    desc: "Debt funds, bonds, NCDs held >2 years",
    rate: "12.5% (no indexation)",
    addedToIncome: false,
  },
  {
    type: "debt_stcg",
    label: "Debt MF / Bonds — Short Term (≤24 months)",
    desc: "Debt funds, bonds held ≤2 years — taxed at slab",
    rate: "Slab rate (added to income)",
    addedToIncome: true,
  },
  {
    type: "property_ltcg",
    label: "Property / Land — Long Term (>24 months)",
    desc: "House, flat, land held >2 years",
    rate: "12.5% (no indexation, post Jul 2024)",
    addedToIncome: false,
  },
  {
    type: "property_stcg",
    label: "Property / Land — Short Term (≤24 months)",
    desc: "House, flat, land held ≤2 years — taxed at slab",
    rate: "Slab rate (added to income)",
    addedToIncome: true,
  },
] as const;

export type CGType = typeof CAPITAL_GAINS_TYPES[number]["type"];

const EQUITY_LTCG_EXEMPTION = 125_000;
const EQUITY_LTCG_RATE      = 0.125;
const EQUITY_STCG_RATE      = 0.20;
const DEBT_LTCG_RATE        = 0.125;
const PROPERTY_LTCG_RATE    = 0.125;

// ─── Surcharge on special rate income ────────────────────────────────────────

function getSurchargeRate(totalIncome: number): number {
  const band = SURCHARGE_BANDS.slice().reverse().find(b => totalIncome > b.from);
  return band?.rate ?? 0;
}

// Capital gains surcharge is capped at 15% (post Budget 2022)
function getCGSurchargeRate(totalIncome: number): number {
  return Math.min(getSurchargeRate(totalIncome), 0.15);
}

// ─── Main calculator ──────────────────────────────────────────────────────────

export function calculateIncomeTaxWithCG(
  income: IncomeSource,
  capitalGains: CapitalGainEntry[],
  deductions: Deductions,
  regime: TaxRegime,
): TaxWithCGResult {

  // ── Step 1: Ordinary income ──────────────────────────────────────────────

  const stdDed = STANDARD_DEDUCTION[regime];
  const netSalary = Math.max(0, income.salary - stdDed);

  // Rental: 30% standard deduction allowed under both regimes
  const netRental = Math.max(0, income.rentalIncome * 0.70);

  // Capital gains that get added to ordinary income (STCG on debt/property)
  const debtStcgAddedToIncome = capitalGains
    .filter(cg => cg.type === "debt_stcg")
    .reduce((s, cg) => s + cg.amount, 0);
  const propertyStcgAddedToIncome = capitalGains
    .filter(cg => cg.type === "property_stcg")
    .reduce((s, cg) => s + cg.amount, 0);

  const totalOrdinaryIncome =
    netSalary +
    income.interestIncome +
    netRental +
    income.businessIncome +
    income.otherIncome +
    debtStcgAddedToIncome +
    propertyStcgAddedToIncome;

  // ── Step 2: Deductions (old regime only) ────────────────────────────────

  let totalDeductions = 0;
  if (regime === "old") {
    const cap80C = Math.min(deductions.section80C, 150_000);
    const cap80D = Math.min(deductions.section80D, 75_000);   // 25k self + 50k parents (senior)
    const cap24b = Math.min(deductions.section24b, 200_000);
    const capNPS = Math.min(deductions.nps80CCD, 50_000);
    totalDeductions = cap80C + cap80D + cap24b + capNPS +
      deductions.hra + deductions.lta + deductions.otherDeductions;
  }
  // New regime: only standard deduction (already applied above)

  const taxableOrdinaryIncome = Math.max(0, totalOrdinaryIncome - totalDeductions);

  // ── Step 3: Slab tax on ordinary income ─────────────────────────────────

  const slabs = regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
  const { totalTax: slabTax, breakdown: slabBreakdown } = calculateSlabTax(taxableOrdinaryIncome, slabs);

  // ── Step 4: Capital gains (special rates) ───────────────────────────────

  const equityLtcgTotal = capitalGains
    .filter(cg => cg.type === "equity_ltcg")
    .reduce((s, cg) => s + cg.amount, 0);
  const equityLtcgExemption = Math.min(equityLtcgTotal, EQUITY_LTCG_EXEMPTION);
  const taxableEquityLtcg = Math.max(0, equityLtcgTotal - equityLtcgExemption);
  const taxOnEquityLtcg = taxableEquityLtcg * EQUITY_LTCG_RATE;

  const equityStcgTotal = capitalGains
    .filter(cg => cg.type === "equity_stcg")
    .reduce((s, cg) => s + cg.amount, 0);
  const taxOnEquityStcg = equityStcgTotal * EQUITY_STCG_RATE;

  const debtLtcgTotal = capitalGains
    .filter(cg => cg.type === "debt_ltcg")
    .reduce((s, cg) => s + cg.amount, 0);
  const taxOnDebtLtcg = debtLtcgTotal * DEBT_LTCG_RATE;

  const propertyLtcgTotal = capitalGains
    .filter(cg => cg.type === "property_ltcg")
    .reduce((s, cg) => s + cg.amount, 0);
  const taxOnPropertyLtcg = propertyLtcgTotal * PROPERTY_LTCG_RATE;

  // ── Step 5: Total income for surcharge/87A purposes ─────────────────────

  const totalIncome =
    taxableOrdinaryIncome +
    equityLtcgTotal +
    equityStcgTotal +
    debtLtcgTotal +
    propertyLtcgTotal;

  // ── Step 6: 87A rebate — only on ordinary income tax (not on CG tax) ────

  const rebate87AConfig = SECTION_87A[regime];
  // 87A applies only when TOTAL income (including CG) ≤ threshold
  // But rebate is limited to tax on ordinary income only
  const rebate87A = totalIncome <= rebate87AConfig.threshold
    ? Math.min(slabTax, rebate87AConfig.maxRebate)
    : 0;

  const netSlabTax = Math.max(0, slabTax - rebate87A);
  const totalTaxBeforeRebate = netSlabTax + taxOnEquityLtcg + taxOnEquityStcg + taxOnDebtLtcg + taxOnPropertyLtcg;

  // ── Step 7: Surcharge ────────────────────────────────────────────────────

  const ordinarySurchargeRate = getSurchargeRate(totalIncome);
  const cgSurchargeRate = getCGSurchargeRate(totalIncome);

  const surchargeOnOrdinary = netSlabTax * ordinarySurchargeRate;
  const surchargeOnCG =
    (taxOnEquityLtcg + taxOnEquityStcg + taxOnDebtLtcg + taxOnPropertyLtcg) * cgSurchargeRate;
  const surcharge = surchargeOnOrdinary + surchargeOnCG;

  // ── Step 8: Cess ─────────────────────────────────────────────────────────

  const cess = (totalTaxBeforeRebate + surcharge) * HEALTH_AND_EDUCATION_CESS_RATE;

  // ── Step 9: Final total ──────────────────────────────────────────────────

  const totalTaxPayable = Math.round(totalTaxBeforeRebate + surcharge + cess);

  const grossTotalIncome =
    income.salary + income.interestIncome + income.rentalIncome +
    income.businessIncome + income.otherIncome +
    equityLtcgTotal + equityStcgTotal + debtLtcgTotal +
    debtStcgAddedToIncome + propertyLtcgTotal + propertyStcgAddedToIncome;

  const effectiveRate = grossTotalIncome > 0
    ? (totalTaxPayable / grossTotalIncome) * 100
    : 0;

  // Marginal rate on ordinary income
  const lastSlab = slabBreakdown.filter(s => s.taxInSlab > 0).pop();
  const marginalRate = lastSlab ? lastSlab.rate * 100 : 0;

  return {
    grossSalary: income.salary,
    standardDeduction: stdDed,
    netSalary,
    totalOrdinaryIncome,
    totalDeductions,
    taxableOrdinaryIncome,
    equityLtcg: equityLtcgTotal,
    equityStcg: equityStcgTotal,
    debtLtcg: debtLtcgTotal,
    debtStcgAddedToIncome,
    propertyLtcg: propertyLtcgTotal,
    propertyStcgAddedToIncome,
    ltcgExemption: equityLtcgExemption,
    taxOnOrdinaryIncome: Math.round(netSlabTax),
    taxOnEquityLtcg: Math.round(taxOnEquityLtcg),
    taxOnEquityStcg: Math.round(taxOnEquityStcg),
    taxOnDebtLtcg: Math.round(taxOnDebtLtcg),
    taxOnPropertyLtcg: Math.round(taxOnPropertyLtcg),
    totalTaxBeforeRebate: Math.round(totalTaxBeforeRebate),
    rebate87A: Math.round(rebate87A),
    surcharge: Math.round(surcharge),
    cess: Math.round(cess),
    totalTaxPayable,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    slabBreakdown,
    marginalRate,
  };
}
