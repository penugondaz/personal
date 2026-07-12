/**
 * Real Estate Calculator Library
 * Covers: Home Affordability, Rent vs Buy, Rental Yield,
 *         Property Appreciation, Stamp Duty, Registration Charges
 */

import { calculateEmi, type EmiResult } from "./emi";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HomeAffordabilityInput {
  annualCtc: number;
  inHandMonthly: number;
  emiToIncomeRatio?: number;   // default 0.40 (40% of in-hand)
  interestRate?: number;        // default 8.5%
  tenureYears?: number;         // default 20
  downPaymentPercent?: number;  // default 20%
}

export interface HomeAffordabilityResult {
  maxEmi: number;
  maxLoanAmount: number;
  minDownPayment: number;
  maxPropertyValue: number;
  emiResult: EmiResult;
  monthlyIncome: number;
  emiToIncomeRatio: number;
}

export interface RentVsBuyInput {
  propertyValue: number;
  downPaymentPercent?: number;   // default 20%
  homeLoanRate?: number;         // default 8.5%
  tenureYears?: number;          // default 20
  monthlyRent: number;
  rentEscalationRate?: number;   // default 5% per year
  propertyAppreciationRate?: number; // default 7% per year
  investmentReturnRate?: number;  // default 12% per year (if renting + investing)
  maintenanceCostPercent?: number; // default 0.5% of property per year
  propertyTaxPercent?: number;    // default 0.1% of property per year
  years?: number;                 // default 20
}

export interface RentVsBuyResult {
  buyingCost: {
    totalEmiPaid: number;
    downPayment: number;
    totalMaintenance: number;
    totalPropertyTax: number;
    totalCost: number;
    propertyValueAtEnd: number;
    netWorth: number;
  };
  rentingCost: {
    totalRentPaid: number;
    investmentCorpus: number;
    netWorth: number;
  };
  breakEvenYear: number | null;
  recommendation: "buy" | "rent";
  netWorthDifference: number;
}

export interface RentalYieldInput {
  propertyValue: number;
  monthlyRent: number;
  annualMaintenance?: number;
  annualPropertyTax?: number;
  vacancyMonths?: number;        // default 1 month per year
}

export interface RentalYieldResult {
  grossYieldPercent: number;
  netYieldPercent: number;
  annualGrossRent: number;
  annualNetRent: number;
  monthsToBreakEven: number;
  verdict: "excellent" | "good" | "average" | "poor";
}

export interface PropertyAppreciationInput {
  currentValue: number;
  annualAppreciationRate?: number;  // default 7%
  years?: number;                    // default 10
}

export interface PropertyAppreciationResult {
  futureValue: number;
  totalAppreciation: number;
  appreciationPercent: number;
  yearlyBreakdown: { year: number; value: number; gain: number }[];
  cagr: number;
}

export interface StampDutyInput {
  propertyValue: number;
  state: string;
  ownerType?: "male" | "female" | "joint";  // default "male"
  propertyType?: "residential" | "commercial"; // default "residential"
}

export interface StampDutyResult {
  stampDutyPercent: number;
  stampDutyAmount: number;
  registrationCharges: number;
  otherCharges: number;
  totalCharges: number;
  totalCost: number;
  state: string;
  stateName: string;
}

// ── State-wise Stamp Duty Data ─────────────────────────────────────────────────

export interface StateStampDuty {
  code: string;
  name: string;
  male: number;
  female: number;
  joint: number;
  registrationPercent: number;  // as % of property value
  registrationCap?: number;     // max registration in ₹
  notes?: string;
}

export const STAMP_DUTY_STATES: StateStampDuty[] = [
  { code: "MH", name: "Maharashtra", male: 6, female: 5, joint: 6, registrationPercent: 1, notes: "Additional 1% Metro cess in Mumbai" },
  { code: "DL", name: "Delhi", male: 6, female: 4, joint: 5, registrationPercent: 1, registrationCap: 0 },
  { code: "KA", name: "Karnataka", male: 5, female: 5, joint: 5, registrationPercent: 1, notes: "Slab-based: 2% upto ₹20L, 3% 20-45L, 5% above ₹45L" },
  { code: "TN", name: "Tamil Nadu", male: 7, female: 7, joint: 7, registrationPercent: 1, registrationCap: 400000 },
  { code: "TS", name: "Telangana", male: 5, female: 5, joint: 5, registrationPercent: 0.5 },
  { code: "AP", name: "Andhra Pradesh", male: 5, female: 5, joint: 5, registrationPercent: 1 },
  { code: "GJ", name: "Gujarat", male: 4.9, female: 4.9, joint: 4.9, registrationPercent: 1 },
  { code: "UP", name: "Uttar Pradesh", male: 7, female: 6, joint: 7, registrationPercent: 1, registrationCap: 20000 },
  { code: "RJ", name: "Rajasthan", male: 6, female: 5, joint: 5, registrationPercent: 1, registrationCap: 125000 },
  { code: "WB", name: "West Bengal", male: 6, female: 6, joint: 6, registrationPercent: 1 },
  { code: "HR", name: "Haryana", male: 7, female: 5, joint: 6, registrationPercent: 1, registrationCap: 50000 },
  { code: "MP", name: "Madhya Pradesh", male: 7.5, female: 7.5, joint: 7.5, registrationPercent: 1 },
  { code: "PB", name: "Punjab", male: 7, female: 5, joint: 6, registrationPercent: 1 },
  { code: "KL", name: "Kerala", male: 8, female: 8, joint: 8, registrationPercent: 2, notes: "Includes 2% surcharge" },
  { code: "BR", name: "Bihar", male: 6.3, female: 5.7, joint: 6, registrationPercent: 2, notes: "Includes urban development fee" },
  { code: "OD", name: "Odisha", male: 5, female: 4, joint: 4.5, registrationPercent: 2 },
  { code: "JH", name: "Jharkhand", male: 4, female: 4, joint: 4, registrationPercent: 3 },
  { code: "CG", name: "Chhattisgarh", male: 5, female: 4, joint: 4.5, registrationPercent: 4, registrationCap: 600000 },
  { code: "AS", name: "Assam", male: 8.25, female: 6, joint: 7, registrationPercent: 1 },
  { code: "UK", name: "Uttarakhand", male: 5, female: 3.75, joint: 4, registrationPercent: 2 },
  { code: "HP", name: "Himachal Pradesh", male: 6, female: 4, joint: 5, registrationPercent: 2 },
  { code: "GA", name: "Goa", male: 3.5, female: 3.5, joint: 3.5, registrationPercent: 1 },
];

// ── Calculator Functions ────────────────────────────────────────────────────────

export function calculateHomeAffordability(input: HomeAffordabilityInput): HomeAffordabilityResult {
  const {
    inHandMonthly,
    emiToIncomeRatio = 0.40,
    interestRate = 8.5,
    tenureYears = 20,
    downPaymentPercent = 20,
  } = input;

  const maxEmi = Math.round(inHandMonthly * emiToIncomeRatio);
  const tenureMonths = tenureYears * 12;
  const monthlyRate = interestRate / 12 / 100;

  // Reverse EMI formula: P = EMI × [(1+r)^n - 1] / [r × (1+r)^n]
  const maxLoanAmount = Math.round(
    (maxEmi * (Math.pow(1 + monthlyRate, tenureMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths))
  );

  const maxPropertyValue = Math.round(maxLoanAmount / (1 - downPaymentPercent / 100));
  const minDownPayment = maxPropertyValue - maxLoanAmount;

  const emiResult = calculateEmi({
    principal: maxLoanAmount,
    annualInterestRate: interestRate,
    tenureMonths,
  });

  return {
    maxEmi,
    maxLoanAmount,
    minDownPayment,
    maxPropertyValue,
    emiResult,
    monthlyIncome: inHandMonthly,
    emiToIncomeRatio,
  };
}

export function calculateRentalYield(input: RentalYieldInput): RentalYieldResult {
  const {
    propertyValue,
    monthlyRent,
    annualMaintenance = 0,
    annualPropertyTax = 0,
    vacancyMonths = 1,
  } = input;

  const annualGrossRent = monthlyRent * (12 - vacancyMonths);
  const annualNetRent = annualGrossRent - annualMaintenance - annualPropertyTax;

  const grossYieldPercent = Math.round((annualGrossRent / propertyValue) * 10000) / 100;
  const netYieldPercent = Math.round((annualNetRent / propertyValue) * 10000) / 100;

  const monthsToBreakEven = Math.round(propertyValue / (annualNetRent / 12));

  const verdict =
    netYieldPercent >= 4 ? "excellent" :
    netYieldPercent >= 3 ? "good" :
    netYieldPercent >= 2 ? "average" : "poor";

  return {
    grossYieldPercent,
    netYieldPercent,
    annualGrossRent,
    annualNetRent,
    monthsToBreakEven,
    verdict,
  };
}

export function calculatePropertyAppreciation(input: PropertyAppreciationInput): PropertyAppreciationResult {
  const {
    currentValue,
    annualAppreciationRate = 7,
    years = 10,
  } = input;

  const rate = annualAppreciationRate / 100;
  const futureValue = Math.round(currentValue * Math.pow(1 + rate, years));
  const totalAppreciation = futureValue - currentValue;
  const appreciationPercent = Math.round((totalAppreciation / currentValue) * 100);

  const yearlyBreakdown = Array.from({ length: years }, (_, i) => {
    const yr = i + 1;
    const value = Math.round(currentValue * Math.pow(1 + rate, yr));
    const prevValue = Math.round(currentValue * Math.pow(1 + rate, yr - 1));
    return { year: yr, value, gain: value - prevValue };
  });

  return {
    futureValue,
    totalAppreciation,
    appreciationPercent,
    yearlyBreakdown,
    cagr: annualAppreciationRate,
  };
}

export function calculateStampDuty(input: StampDutyInput): StampDutyResult {
  const {
    propertyValue,
    state,
    ownerType = "male",
    propertyType = "residential",
  } = input;

  const stateData = STAMP_DUTY_STATES.find(s => s.code === state)
    ?? STAMP_DUTY_STATES[0];

  const stampDutyPercent = stateData[ownerType];
  const stampDutyAmount = Math.round(propertyValue * stampDutyPercent / 100);

  let registrationCharges = Math.round(propertyValue * stateData.registrationPercent / 100);
  if (stateData.registrationCap && stateData.registrationCap > 0) {
    registrationCharges = Math.min(registrationCharges, stateData.registrationCap);
  }

  // Standard misc charges (legal fees, franking etc.)
  const otherCharges = Math.round(propertyValue * 0.002); // ~0.2%

  const totalCharges = stampDutyAmount + registrationCharges + otherCharges;
  const totalCost = propertyValue + totalCharges;

  return {
    stampDutyPercent,
    stampDutyAmount,
    registrationCharges,
    otherCharges,
    totalCharges,
    totalCost,
    state,
    stateName: stateData.name,
  };
}

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const {
    propertyValue,
    downPaymentPercent = 20,
    homeLoanRate = 8.5,
    tenureYears = 20,
    monthlyRent,
    rentEscalationRate = 5,
    propertyAppreciationRate = 7,
    investmentReturnRate = 12,
    maintenanceCostPercent = 0.5,
    propertyTaxPercent = 0.1,
    years = 20,
  } = input;

  const downPayment = Math.round(propertyValue * downPaymentPercent / 100);
  const loanAmount = propertyValue - downPayment;
  const tenureMonths = tenureYears * 12;

  // EMI
  const monthlyRate = homeLoanRate / 12 / 100;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  // Buying costs over `years`
  const totalEmiPaid = emi * Math.min(years, tenureYears) * 12;
  const totalMaintenance = Array.from({ length: years }, (_, i) =>
    Math.round(propertyValue * (1 + propertyAppreciationRate / 100) ** i * maintenanceCostPercent / 100)
  ).reduce((a, b) => a + b, 0);
  const totalPropertyTax = Math.round(propertyValue * propertyTaxPercent / 100 * years);
  const propertyValueAtEnd = Math.round(propertyValue * Math.pow(1 + propertyAppreciationRate / 100, years));
  const buyingNetWorth = propertyValueAtEnd - (loanAmount - totalEmiPaid * 0.3); // rough equity
  const buyingTotalCost = downPayment + totalEmiPaid + totalMaintenance + totalPropertyTax;

  // Renting costs over `years`
  let totalRentPaid = 0;
  let rent = monthlyRent;
  for (let y = 0; y < years; y++) {
    totalRentPaid += rent * 12;
    rent = Math.round(rent * (1 + rentEscalationRate / 100));
  }

  // If renting, invest down payment + monthly difference (EMI - rent) in market
  const monthlySavings = Math.max(0, emi - monthlyRent);
  const investmentMonthlyRate = investmentReturnRate / 12 / 100;
  const downPaymentCorpus = Math.round(downPayment * Math.pow(1 + investmentReturnRate / 100, years));
  const sipCorpus = monthlySavings > 0
    ? Math.round(monthlySavings * (Math.pow(1 + investmentMonthlyRate, years * 12) - 1) / investmentMonthlyRate)
    : 0;
  const investmentCorpus = downPaymentCorpus + sipCorpus;
  const rentingNetWorth = investmentCorpus - totalRentPaid;

  // Break-even year
  let breakEvenYear: number | null = null;
  for (let y = 1; y <= years; y++) {
    const propVal = Math.round(propertyValue * Math.pow(1 + propertyAppreciationRate / 100, y));
    const corpus = Math.round(downPayment * Math.pow(1 + investmentReturnRate / 100, y));
    if (propVal >= corpus) { breakEvenYear = y; break; }
  }

  const recommendation = propertyValueAtEnd > investmentCorpus ? "buy" : "rent";

  return {
    buyingCost: {
      totalEmiPaid,
      downPayment,
      totalMaintenance,
      totalPropertyTax,
      totalCost: buyingTotalCost,
      propertyValueAtEnd,
      netWorth: buyingNetWorth,
    },
    rentingCost: {
      totalRentPaid,
      investmentCorpus,
      netWorth: rentingNetWorth,
    },
    breakEvenYear,
    recommendation,
    netWorthDifference: Math.abs(buyingNetWorth - rentingNetWorth),
  };
}
