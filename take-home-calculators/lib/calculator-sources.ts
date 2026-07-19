export interface CalculatorSource {
  label: string;
  url?: string;
}

/**
 * Central registry of "Sources & Methodology" citations, keyed by the
 * calculator's URL slug (the last path segment — e.g. for
 * /calculator/hra-calculator/ the key is "hra-calculator").
 *
 * This is the ONLY file you need to touch to add or update citations.
 * `app/calculator/layout.tsx` reads this map automatically for every
 * page under /calculator/* and renders the matching entry — no changes
 * to individual page.tsx files required. A slug with no entry here
 * simply renders nothing (no broken UI, no placeholder box).
 */
export const CALCULATOR_SOURCES: Record<string, CalculatorSource[]> = {
  "home-loan-tax-benefit-calculator": [
    { label: "Income Tax Act, 1961 — Section 24(b), interest on borrowed capital for house property", url: "https://incometaxindia.gov.in" },
    { label: "Income Tax Act, 1961 — Section 80EEA, additional interest deduction for affordable housing", url: "https://incometaxindia.gov.in" },
    { label: "Income Tax Act, 1961 — Section 80C, deduction for principal repayment", url: "https://incometaxindia.gov.in" },
    { label: "Tax slabs and standard deduction as per Finance Act, FY 2025-26" },
  ],
  "nri-income-tax-calculator": [
    { label: "Income Tax Act, 1961 — Section 5, scope of total income for a non-resident", url: "https://incometaxindia.gov.in" },
    { label: "Income Tax Act, 1961 — Section 87A rebate, applicable to resident individuals only", url: "https://incometaxindia.gov.in" },
    { label: "Income Tax Act, 1961 — Section 195, TDS on payments to non-residents", url: "https://incometaxindia.gov.in" },
    { label: "RBI FEMA guidelines — NRE/FCNR/NRO account interest tax treatment", url: "https://www.rbi.org.in" },
  ],
  "rsu-esop-tax-calculator": [
    { label: "Income Tax Act, 1961 — Section 17(2)(vi), perquisite value of ESOP/RSU shares", url: "https://incometaxindia.gov.in" },
    { label: "Income Tax Act, 1961 — Section 111A/112A, short-term and long-term capital gains on equity", url: "https://incometaxindia.gov.in" },
    { label: "Finance Act 2024 — removal of indexation and revised LTCG/STCG rates on equity" },
  ],
  "new-regime-break-even-calculator": [
    { label: "Income Tax Act, 1961 — Section 115BAC, new tax regime slabs and conditions", url: "https://incometaxindia.gov.in" },
    { label: "Finance Act (Union Budget) FY 2025-26 — revised new regime slabs and rebate limits", url: "https://incometaxindia.gov.in" },
  ],
  "apy-calculator": [
    { label: "PFRDA — official Atal Pension Yojana contribution chart", url: "https://npscra.nsdl.co.in" },
    { label: "Atal Pension Yojana Scheme Details, Pension Fund Regulatory and Development Authority", url: "https://www.pfrda.org.in" },
  ],
  "nps-tier2-calculator": [
    { label: "PFRDA — National Pension System Tier II account rules", url: "https://www.pfrda.org.in" },
    { label: "Income Tax Act, 1961 — Section 80CCD, deduction available only to Central Government employees on Tier 2", url: "https://incometaxindia.gov.in" },
  ],
  "hra-calculator": [
    { label: "Income Tax Act, 1961 — Section 10(13A), HRA exemption", url: "https://incometaxindia.gov.in" },
    { label: "Income Tax Rules, 1962 — Rule 2A, method of computing HRA exemption", url: "https://incometaxindia.gov.in" },
  ],
  "gratuity-calculator": [
    { label: "Payment of Gratuity Act, 1972 — gratuity calculation formula and eligibility", url: "https://labour.gov.in" },
  ],
};
