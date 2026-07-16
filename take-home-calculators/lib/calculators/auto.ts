/**
 * Auto / Car Benefits Calculator Library — FY 2025-26
 * Covers: Car Lease vs Buy, Perquisite Tax, CTC Car Benefit, Fuel Reimbursement
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type EngineSize = "below_1600" | "above_1600";
export type CarBenefitType = "cash_allowance" | "car_lease" | "company_car";

export interface CarLeaseVsBuyInput {
  carPrice: number;
  monthlyLease: number;
  leaseTenureYears: number;
  residualValuePct: number;       // % of car price at end of lease
  taxBracketPct: number;          // 20 or 30
  downPaymentPct: number;         // for buying: % down payment
  loanInterestRate: number;       // for buying: home loan rate
  annualDepreciation: number;     // % depreciation per year
}

export interface CarLeaseVsBuyResult {
  // Lease path
  totalLeasePaid: number;
  taxSavingOnLease: number;
  effectiveLeaseCost: number;
  residualValue: number;
  netLeaseCost: number;           // after residual value buyout

  // Buy path
  downPayment: number;
  totalEmiPaid: number;
  totalInterestPaid: number;
  depreciation: number;
  carValueAtEnd: number;
  netBuyCost: number;             // total cost minus car value at end

  // Comparison
  saving: number;
  betterOption: "lease" | "buy";
  monthlyLeaseTaxSaving: number;
}

export interface CarPerquisiteInput {
  engineSize: EngineSize;
  driverProvided: boolean;
  monthsInYear: number;           // default 12
  taxBracketPct: number;
  personalUsePct: number;         // 0-100, portion for personal use
}

export interface CarPerquisiteResult {
  monthlyPerquisiteValue: number;
  annualPerquisiteValue: number;
  annualTaxOnPerquisite: number;
  monthlyTaxOnPerquisite: number;
  vsFullCarAllowance: {
    allowanceAmount: number;
    taxOnAllowance: number;
    saving: number;
  };
}

export interface CTCCarBenefitInput {
  monthlyBenefitAmount: number;   // amount company offers (cash or lease)
  taxBracketPct: number;
  engineSize: EngineSize;
  driverProvided: boolean;
  carPrice: number;               // for lease path
  leaseTenureYears: number;
}

export interface CTCCarBenefitResult {
  cashAllowance: {
    grossAmount: number;
    taxPaid: number;
    inHandMonthly: number;
    annualInHand: number;
  };
  carLease: {
    leaseAmount: number;
    taxSaving: number;
    effectiveCostMonthly: number;
    annualBenefit: number;
    carOwnershipValue: number;
  };
  companyCar: {
    perquisiteValue: number;
    taxOnPerquisite: number;
    netBenefit: number;
    annualBenefit: number;
  };
  bestOption: CarBenefitType;
  bestOptionSaving: number;
}

export interface FuelReimbursementInput {
  monthlyFuelAmount: number;
  monthlyMaintenanceAmount: number;
  regime: "new" | "old";
  taxBracketPct: number;
  isReimbursementWithBills: boolean;
}

export interface FuelReimbursementResult {
  grossMonthlyAmount: number;
  taxableAmount: number;
  taxPaid: number;
  inHandBenefit: number;
  annualTaxCost: number;
  // Old regime comparison
  oldRegimeTaxable: number;
  oldRegimeTax: number;
  oldRegimeSaving: number;
}

// ─── Perquisite rates — per Section 17(2), Rule 3 ────────────────────────────

const PERQUISITE_RATES = {
  below_1600: { withoutDriver: 1800, withDriver: 2400 },
  above_1600: { withoutDriver: 2400, withDriver: 3300 },
};

// ─── Calculators ─────────────────────────────────────────────────────────────

export function calculateCarLeaseVsBuy(input: CarLeaseVsBuyInput): CarLeaseVsBuyResult {
  const {
    carPrice, monthlyLease, leaseTenureYears,
    residualValuePct, taxBracketPct,
    downPaymentPct, loanInterestRate, annualDepreciation,
  } = input;

  const tenureMonths = leaseTenureYears * 12;
  const taxRate = taxBracketPct / 100;

  // ── Lease path ──
  const totalLeasePaid = monthlyLease * tenureMonths;
  const taxSavingOnLease = Math.round(totalLeasePaid * taxRate * 1.04); // with cess
  const effectiveLeaseCost = totalLeasePaid - taxSavingOnLease;
  const residualValue = Math.round(carPrice * residualValuePct / 100);
  const netLeaseCost = effectiveLeaseCost + residualValue; // pay residual to own
  const monthlyLeaseTaxSaving = Math.round((monthlyLease * taxRate * 1.04));

  // ── Buy path ──
  const downPayment = Math.round(carPrice * downPaymentPct / 100);
  const loanAmount = carPrice - downPayment;
  const monthlyRate = loanInterestRate / 12 / 100;
  const emi = loanAmount > 0 ? Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  ) : 0;
  const totalEmiPaid = emi * tenureMonths;
  const totalInterestPaid = totalEmiPaid - loanAmount;
  const carValueAtEnd = Math.round(carPrice * Math.pow(1 - annualDepreciation / 100, leaseTenureYears));
  const depreciation = carPrice - carValueAtEnd;
  const netBuyCost = downPayment + totalEmiPaid - carValueAtEnd;

  const saving = Math.abs(netLeaseCost - netBuyCost);
  const betterOption: "lease" | "buy" = netLeaseCost < netBuyCost ? "lease" : "buy";

  return {
    totalLeasePaid, taxSavingOnLease, effectiveLeaseCost,
    residualValue, netLeaseCost,
    downPayment, totalEmiPaid, totalInterestPaid,
    depreciation, carValueAtEnd, netBuyCost,
    saving, betterOption, monthlyLeaseTaxSaving,
  };
}

export function calculateCarPerquisite(input: CarPerquisiteInput): CarPerquisiteResult {
  const { engineSize, driverProvided, monthsInYear = 12, taxBracketPct, personalUsePct } = input;
  const taxRate = taxBracketPct / 100;

  const rates = PERQUISITE_RATES[engineSize];
  const monthlyPerquisiteValue = driverProvided ? rates.withDriver : rates.withoutDriver;
  const annualPerquisiteValue = monthlyPerquisiteValue * monthsInYear;
  const annualTaxOnPerquisite = Math.round(annualPerquisiteValue * taxRate * 1.04);
  const monthlyTaxOnPerquisite = Math.round(annualTaxOnPerquisite / 12);

  // vs getting the same as cash allowance
  const allowanceAmount = annualPerquisiteValue * (personalUsePct / 100);
  const taxOnAllowance = Math.round(allowanceAmount * taxRate * 1.04);
  const saving = taxOnAllowance - annualTaxOnPerquisite;

  return {
    monthlyPerquisiteValue,
    annualPerquisiteValue,
    annualTaxOnPerquisite,
    monthlyTaxOnPerquisite,
    vsFullCarAllowance: {
      allowanceAmount: Math.round(allowanceAmount),
      taxOnAllowance,
      saving,
    },
  };
}

export function calculateCTCCarBenefit(input: CTCCarBenefitInput): CTCCarBenefitResult {
  const {
    monthlyBenefitAmount, taxBracketPct, engineSize,
    driverProvided, carPrice, leaseTenureYears,
  } = input;
  const taxRate = taxBracketPct / 100;
  const cessRate = 0.04;
  const effectiveTaxRate = taxRate * (1 + cessRate);

  // ── Option 1: Cash allowance ──
  const grossAmount = monthlyBenefitAmount * 12;
  const taxOnCash = Math.round(grossAmount * effectiveTaxRate);
  const cashInHandAnnual = grossAmount - taxOnCash;

  // ── Option 2: Car lease ──
  const leaseAmount = monthlyBenefitAmount * 12;
  const leaseTaxSaving = Math.round(leaseAmount * effectiveTaxRate);
  const tenureMonths = leaseTenureYears * 12;
  // Residual value benefit (typically 15-20% of car price at end of lease)
  const carOwnershipValue = Math.round(carPrice * 0.15);
  const annualCarOwnershipBenefit = Math.round(carOwnershipValue / leaseTenureYears);
  const leaseBenefitAnnual = leaseAmount + leaseTaxSaving + annualCarOwnershipBenefit;

  // ── Option 3: Company car (perquisite) ──
  const rates = PERQUISITE_RATES[engineSize];
  const monthlyPerq = driverProvided ? rates.withDriver : rates.withoutDriver;
  const annualPerq = monthlyPerq * 12;
  const taxOnPerq = Math.round(annualPerq * effectiveTaxRate);
  // Value of car usage ≈ market rent for equivalent car
  const carUsageValue = monthlyBenefitAmount * 12; // company bears this
  const companyCarNetBenefit = carUsageValue - taxOnPerq;

  // Best option
  const options: [CarBenefitType, number][] = [
    ["cash_allowance", cashInHandAnnual],
    ["car_lease", leaseBenefitAnnual],
    ["company_car", companyCarNetBenefit],
  ];
  const best = options.reduce((a, b) => a[1] > b[1] ? a : b);
  const worst = options.reduce((a, b) => a[1] < b[1] ? a : b);

  return {
    cashAllowance: {
      grossAmount,
      taxPaid: taxOnCash,
      inHandMonthly: Math.round(cashInHandAnnual / 12),
      annualInHand: cashInHandAnnual,
    },
    carLease: {
      leaseAmount,
      taxSaving: leaseTaxSaving,
      effectiveCostMonthly: Math.round((leaseAmount - leaseTaxSaving) / 12),
      annualBenefit: leaseBenefitAnnual,
      carOwnershipValue,
    },
    companyCar: {
      perquisiteValue: annualPerq,
      taxOnPerquisite: taxOnPerq,
      netBenefit: companyCarNetBenefit,
      annualBenefit: companyCarNetBenefit,
    },
    bestOption: best[0],
    bestOptionSaving: best[1] - worst[1],
  };
}

export function calculateFuelReimbursement(input: FuelReimbursementInput): FuelReimbursementResult {
  const {
    monthlyFuelAmount, monthlyMaintenanceAmount,
    regime, taxBracketPct,
  } = input;

  const taxRate = taxBracketPct / 100;
  const effectiveTaxRate = taxRate * 1.04;

  const grossMonthlyAmount = monthlyFuelAmount + monthlyMaintenanceAmount;
  const annualAmount = grossMonthlyAmount * 12;

  // New regime: fully taxable regardless of bills
  // Old regime with bills: exempt (but this benefit no longer exists under new regime)
  const taxableAmount = annualAmount; // both regimes now — new regime fully taxable
  const taxPaid = Math.round(taxableAmount * effectiveTaxRate);
  const inHandBenefit = annualAmount - taxPaid;
  const annualTaxCost = taxPaid;

  // Old regime: fuel reimbursement with bills was exempt
  const oldRegimeTaxable = 0;
  const oldRegimeTax = 0;
  const oldRegimeSaving = taxPaid; // what you would save under old regime

  return {
    grossMonthlyAmount,
    taxableAmount,
    taxPaid,
    inHandBenefit,
    annualTaxCost,
    oldRegimeTaxable,
    oldRegimeTax,
    oldRegimeSaving,
  };
}
