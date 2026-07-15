/**
 * Freelancer / Consultant Tax Calculator — FY 2025-26
 * Covers: 44ADA presumptive taxation, actual expense method,
 *         TDS reconciliation, advance tax, GST threshold check
 */

import {
  NEW_REGIME_SLABS, OLD_REGIME_SLABS,
  STANDARD_DEDUCTION, SECTION_87A,
  HEALTH_AND_EDUCATION_CESS_RATE, SURCHARGE_BANDS,
  calculateSlabTax, applyRebate, type TaxRegime,
} from "./income-tax";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TaxMethod = "presumptive_44ADA" | "actual_expenses";

export interface FreelancerInput {
  // Income
  grossReceipts: number;          // Total billing / gross receipts in the year
  tdsDeducted: number;            // TDS already deducted by clients (from 26AS)
  otherIncome: number;            // Interest, rent, salary from part-time job etc.

  // Method
  method: TaxMethod;

  // Actual expenses (only if method = actual_expenses)
  businessExpenses: {
    internet: number;
    phone: number;
    laptop: number;               // Depreciation (33% per year typically)
    coworking: number;
    software: number;
    travel: number;
    professional: number;         // CA fees, legal, professional services
    marketing: number;
    other: number;
  };

  // Deductions (old regime)
  regime: TaxRegime;
  deductions: {
    section80C: number;
    section80D: number;
    nps80CCD: number;
    otherDeductions: number;
  };
}

export interface AdvanceTaxInstallment {
  dueDate: string;
  percentage: number;
  cumulativePct: number;
  cumulativeAmount: number;
  installmentAmount: number;
}

export interface FreelancerTaxResult {
  // Income computation
  grossReceipts: number;
  method: TaxMethod;
  presumptiveProfitPct: number;    // 50% under 44ADA
  businessProfit: number;          // Presumptive: 50% of receipts / Actual: receipts - expenses
  totalExpenses: number;           // Only for actual method
  otherIncome: number;
  totalGrossIncome: number;

  // Deductions
  totalDeductions: number;
  taxableIncome: number;

  // Tax
  taxBeforeRebate: number;
  rebate87A: number;
  surcharge: number;
  cess: number;
  totalTaxPayable: number;
  effectiveRate: number;
  marginalRate: number;

  // TDS & advance tax
  tdsDeducted: number;
  netTaxPayable: number;           // After TDS credit
  advanceTaxInstallments: AdvanceTaxInstallment[];

  // GST & compliance
  gstRequired: boolean;
  gstThreshold: number;

  // Comparison (44ADA vs actual)
  actualExpensesTotal: number;
  betterMethod: TaxMethod | "same";
  taxSavingByBetterMethod: number;

  // Slab breakdown
  slabBreakdown: { from: number; to: number | null; rate: number; taxInSlab: number }[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESUMPTIVE_PROFIT_RATE = 0.50;   // 44ADA: 50% of gross receipts = deemed profit
const SECTION_44ADA_LIMIT     = 7_500_000; // ₹75L limit for 44ADA (increased in Budget 2023)
const GST_THRESHOLD           = 2_000_000; // ₹20L (₹10L for special category states)

// Advance tax schedule (% of annual tax liability)
const ADVANCE_TAX_SCHEDULE = [
  { dueDate: "15 Jun",  cumulativePct: 15 },
  { dueDate: "15 Sep",  cumulativePct: 45 },
  { dueDate: "15 Dec",  cumulativePct: 75 },
  { dueDate: "15 Mar",  cumulativePct: 100 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSurcharge(taxableIncome: number, tax: number): number {
  const band = [...SURCHARGE_BANDS].reverse().find(b => taxableIncome > b.from);
  return Math.round(tax * (band?.rate ?? 0));
}

export function calculateFreelancerTax(input: FreelancerInput): FreelancerTaxResult {
  const {
    grossReceipts, tdsDeducted, otherIncome,
    method, businessExpenses, regime, deductions,
  } = input;

  // ── Step 1: Business profit ────────────────────────────────────────────────

  const totalExpenses = method === "actual_expenses"
    ? Object.values(businessExpenses).reduce((s, v) => s + v, 0)
    : 0;

  const businessProfit = method === "presumptive_44ADA"
    ? Math.round(grossReceipts * PRESUMPTIVE_PROFIT_RATE)
    : Math.max(0, grossReceipts - totalExpenses);

  const presumptiveProfitPct = method === "presumptive_44ADA" ? 50 : 0;

  // ── Step 2: Total income ───────────────────────────────────────────────────

  const totalGrossIncome = businessProfit + otherIncome;

  // ── Step 3: Deductions ─────────────────────────────────────────────────────

  // Note: Standard deduction ₹75K is only for salaried — freelancers don't get it
  // NPS deduction available for self-employed: 80CCD(1) up to 20% of gross income + 80CCD(1B) ₹50K
  let totalDeductions = 0;
  if (regime === "old") {
    const cap80C   = Math.min(deductions.section80C, 150_000);
    const cap80D   = Math.min(deductions.section80D, 75_000);
    const capNPS   = Math.min(deductions.nps80CCD, 50_000);
    totalDeductions = cap80C + cap80D + capNPS + deductions.otherDeductions;
  }
  // New regime: 80CCD(2) only for employees — freelancers get no standard deductions

  const taxableIncome = Math.max(0, totalGrossIncome - totalDeductions);

  // ── Step 4: Tax ────────────────────────────────────────────────────────────

  const slabs = regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
  const { totalTax, breakdown: slabBreakdown } = calculateSlabTax(taxableIncome, slabs);
  const taxAfterRebate = applyRebate(totalTax, taxableIncome, regime);
  const rebate87A = totalTax - taxAfterRebate;
  const surcharge = getSurcharge(taxableIncome, taxAfterRebate);
  const cess = Math.round((taxAfterRebate + surcharge) * HEALTH_AND_EDUCATION_CESS_RATE);
  const totalTaxPayable = taxAfterRebate + surcharge + cess;

  const effectiveRate = totalGrossIncome > 0 ? (totalTaxPayable / totalGrossIncome) * 100 : 0;
  const lastSlab = slabBreakdown.filter(s => s.taxInSlab > 0).pop();
  const marginalRate = lastSlab ? lastSlab.rate * 100 : 0;

  // ── Step 5: TDS & advance tax ──────────────────────────────────────────────

  const netTaxPayable = Math.max(0, totalTaxPayable - tdsDeducted);

  // Advance tax required if net tax > ₹10,000
  const advanceTaxRequired = netTaxPayable > 10_000;
  const advanceTaxInstallments: AdvanceTaxInstallment[] = advanceTaxRequired
    ? ADVANCE_TAX_SCHEDULE.map((s, i, arr) => {
        const cumulativeAmount = Math.round(netTaxPayable * s.cumulativePct / 100);
        const prevCumulative = i === 0 ? 0 : Math.round(netTaxPayable * arr[i - 1].cumulativePct / 100);
        return {
          dueDate: s.dueDate,
          percentage: s.cumulativePct - (i === 0 ? 0 : arr[i - 1].cumulativePct),
          cumulativePct: s.cumulativePct,
          cumulativeAmount,
          installmentAmount: cumulativeAmount - prevCumulative,
        };
      })
    : [];

  // ── Step 6: GST check ─────────────────────────────────────────────────────

  const gstRequired = grossReceipts > GST_THRESHOLD;

  // ── Step 7: Compare methods ────────────────────────────────────────────────

  // Compute tax under the other method for comparison
  const actualExpensesTotal = Object.values(businessExpenses).reduce((s, v) => s + v, 0);
  const actualProfit = Math.max(0, grossReceipts - actualExpensesTotal);
  const presumptiveProfit = Math.round(grossReceipts * PRESUMPTIVE_PROFIT_RATE);

  let betterMethod: TaxMethod | "same" = "same";
  let taxSavingByBetterMethod = 0;

  if (actualProfit !== presumptiveProfit) {
    // Tax under actual
    const taxableActual = Math.max(0, actualProfit + otherIncome - totalDeductions);
    const { totalTax: taxActual } = calculateSlabTax(taxableActual, slabs);
    const netTaxActual = applyRebate(taxActual, taxableActual, regime);
    const cessActual = Math.round(netTaxActual * (1 + HEALTH_AND_EDUCATION_CESS_RATE));

    // Tax under presumptive
    const taxablePresumptive = Math.max(0, presumptiveProfit + otherIncome - totalDeductions);
    const { totalTax: taxPresumptive } = calculateSlabTax(taxablePresumptive, slabs);
    const netTaxPresumptive = applyRebate(taxPresumptive, taxablePresumptive, regime);
    const cessPresumptive = Math.round(netTaxPresumptive * (1 + HEALTH_AND_EDUCATION_CESS_RATE));

    if (cessActual < cessPresumptive) {
      betterMethod = "actual_expenses";
      taxSavingByBetterMethod = Math.abs(cessPresumptive - cessActual);
    } else if (cessPresumptive < cessActual) {
      betterMethod = "presumptive_44ADA";
      taxSavingByBetterMethod = Math.abs(cessActual - cessPresumptive);
    }
  }

  return {
    grossReceipts, method, presumptiveProfitPct,
    businessProfit, totalExpenses, otherIncome, totalGrossIncome,
    totalDeductions, taxableIncome,
    taxBeforeRebate: Math.round(totalTax),
    rebate87A: Math.round(rebate87A),
    surcharge, cess, totalTaxPayable,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    marginalRate,
    tdsDeducted, netTaxPayable,
    advanceTaxInstallments,
    gstRequired, gstThreshold: GST_THRESHOLD,
    actualExpensesTotal,
    betterMethod, taxSavingByBetterMethod,
    slabBreakdown,
  };
}
