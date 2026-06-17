export type LeaveEncashmentContext = "on_retirement_govt" | "on_retirement_private" | "during_service";

export interface LeaveEncashmentInput {
  lastDrawnBasicMonthly: number;
  lastDrawnDaMonthly?: number;
  leaveDaysEncashed: number;
  context: LeaveEncashmentContext;
  averageMonthlySalaryLast10Months?: number; // used for the exemption cap calc, defaults to basic+DA
  yearsOfService?: number; // used to compute the 30-days-per-year cap for private-sector exemption
}

export interface LeaveEncashmentResult {
  perDaySalary: number;
  grossEncashmentAmount: number;
  exemptAmount: number;
  taxableAmount: number;
  exemptionNote: string;
}

export const LEAVE_ENCASHMENT_EXEMPTION_CAP = 2_500_000; // ₹25 lakh lifetime cap for private-sector employees

const WORKING_DAYS_PER_MONTH = 30;

/**
 * Leave encashment tax treatment differs sharply by context:
 *  - Government employees: fully exempt on retirement, no cap.
 *  - Private-sector employees: exempt on retirement up to the LOWEST of
 *    (a) the statutory cap (₹25 lakh, lifetime, across employers),
 *    (b) actual leave encashment received,
 *    (c) 10 months' average salary, or
 *    (d) cash equivalent of leave balance (capped at 30 days per year
 *        of service actually completed).
 *  - Encashment received WHILE still in service (not on retirement) is
 *    fully taxable for everyone, government or private.
 */
export function calculateLeaveEncashment(input: LeaveEncashmentInput): LeaveEncashmentResult {
  const {
    lastDrawnBasicMonthly,
    lastDrawnDaMonthly = 0,
    leaveDaysEncashed,
    context,
    averageMonthlySalaryLast10Months,
    yearsOfService = 0,
  } = input;

  const salaryComponentMonthly = lastDrawnBasicMonthly + lastDrawnDaMonthly;
  const perDaySalary = salaryComponentMonthly / WORKING_DAYS_PER_MONTH;
  const grossEncashmentAmount = Math.round(perDaySalary * leaveDaysEncashed);

  if (context === "during_service") {
    return {
      perDaySalary: Math.round(perDaySalary),
      grossEncashmentAmount,
      exemptAmount: 0,
      taxableAmount: grossEncashmentAmount,
      exemptionNote: "Leave encashed while still employed is fully taxable as salary income, regardless of sector.",
    };
  }

  if (context === "on_retirement_govt") {
    return {
      perDaySalary: Math.round(perDaySalary),
      grossEncashmentAmount,
      exemptAmount: grossEncashmentAmount,
      taxableAmount: 0,
      exemptionNote: "Fully exempt for government employees on retirement — no cap applies.",
    };
  }

  // Private sector, on retirement: lowest of four limbs
  const avgSalary = averageMonthlySalaryLast10Months ?? salaryComponentMonthly;
  const cappedLeaveDays = Math.min(leaveDaysEncashed, yearsOfService * 30);
  const leaveBalanceCashEquivalent = Math.round(perDaySalary * cappedLeaveDays);

  const limbs = [
    LEAVE_ENCASHMENT_EXEMPTION_CAP,
    grossEncashmentAmount,
    avgSalary * 10,
    leaveBalanceCashEquivalent,
  ];

  const exemptAmount = Math.max(0, Math.round(Math.min(...limbs)));
  const taxableAmount = Math.max(0, grossEncashmentAmount - exemptAmount);

  return {
    perDaySalary: Math.round(perDaySalary),
    grossEncashmentAmount,
    exemptAmount,
    taxableAmount,
    exemptionNote:
      "Exemption is the lowest of: the ₹25 lakh lifetime cap, actual encashment received, 10 months' average salary, or cash value of leave balance capped at 30 days/year of service.",
  };
}
