import { calculateIncomeTax, type TaxRegime } from "./income-tax";

export interface AdvanceTaxInput {
  estimatedAnnualIncome: number;
  regime: TaxRegime;
  tdsAlreadyDeducted?: number;
  otherDeductions?: number;
}

export interface AdvanceTaxInstallment {
  dueDate: string;
  cumulativePercentRequired: number;
  cumulativeAmountRequired: number;
  installmentAmount: number;
}

export interface AdvanceTaxResult {
  totalTaxLiability: number;
  tdsAlreadyDeducted: number;
  netAdvanceTaxPayable: number;
  isLiable: boolean;
  installments: AdvanceTaxInstallment[];
}

const ADVANCE_TAX_LIABILITY_THRESHOLD = 10_000;

/**
 * Advance tax is owed in 4 installments (FY, due dates per Income Tax
 * Act Section 211) once your total tax liability for the year, net of
 * TDS, exceeds ₹10,000. Cumulative percentages required by each due
 * date: 15% by 15 June, 45% by 15 Sept, 75% by 15 Dec, 100% by 15 March.
 * Each installment amount is the gap between this cumulative
 * requirement and what's already been paid in prior installments.
 */
export function calculateAdvanceTax(input: AdvanceTaxInput): AdvanceTaxResult {
  const { estimatedAnnualIncome, regime, tdsAlreadyDeducted = 0, otherDeductions = 0 } = input;

  const taxResult = calculateIncomeTax(estimatedAnnualIncome, regime, otherDeductions);
  const totalTaxLiability = taxResult.totalTaxPayable;
  const netAdvanceTaxPayable = Math.max(0, totalTaxLiability - tdsAlreadyDeducted);

  const isLiable = netAdvanceTaxPayable > ADVANCE_TAX_LIABILITY_THRESHOLD;

  const schedule: { dueDate: string; cumulativePercentRequired: number }[] = [
    { dueDate: "15 June", cumulativePercentRequired: 15 },
    { dueDate: "15 September", cumulativePercentRequired: 45 },
    { dueDate: "15 December", cumulativePercentRequired: 75 },
    { dueDate: "15 March", cumulativePercentRequired: 100 },
  ];

  let previousCumulative = 0;
  const installments: AdvanceTaxInstallment[] = schedule.map((step) => {
    const cumulativeAmountRequired = isLiable
      ? Math.round(netAdvanceTaxPayable * (step.cumulativePercentRequired / 100))
      : 0;
    const installmentAmount = Math.max(0, cumulativeAmountRequired - previousCumulative);
    previousCumulative = cumulativeAmountRequired;

    return {
      dueDate: step.dueDate,
      cumulativePercentRequired: step.cumulativePercentRequired,
      cumulativeAmountRequired,
      installmentAmount,
    };
  });

  return {
    totalTaxLiability,
    tdsAlreadyDeducted,
    netAdvanceTaxPayable,
    isLiable,
    installments,
  };
}
