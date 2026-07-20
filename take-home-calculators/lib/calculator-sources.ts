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
 *
 * Deliberately NOT included: calculators that are pure financial
 * arithmetic with no statutory or regulatory basis to cite (compound
 * interest, simple interest, XIRR, CAGR, stock average, salary hike,
 * inflation-adjusted returns, offer comparison, layoff risk). Forcing
 * a government citation onto a plain formula would be padding, not
 * genuine sourcing — the box simply doesn't render for these.
 */
export const CALCULATOR_SOURCES: Record<string, CalculatorSource[]> = {
  // --- Newly built calculators ---
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

  // --- Tax & Pay Components ---
  "hra-calculator": [
    { label: "Income Tax Act, 1961 — Section 10(13A), HRA exemption", url: "https://incometaxindia.gov.in" },
    { label: "Income Tax Rules, 1962 — Rule 2A, method of computing HRA exemption", url: "https://incometaxindia.gov.in" },
  ],
  "income-tax-calculator": [
    { label: "Income Tax Act, 1961 — slab rates under both regimes", url: "https://incometaxindia.gov.in" },
    { label: "Finance Act (Union Budget) FY 2025-26 — revised slabs, standard deduction, and rebate limits", url: "https://incometaxindia.gov.in" },
  ],
  "income-tax-with-capital-gains": [
    { label: "Income Tax Act, 1961 — slab rates under both regimes", url: "https://incometaxindia.gov.in" },
    { label: "Income Tax Act, 1961 — Section 111A/112A, capital gains on equity", url: "https://incometaxindia.gov.in" },
    { label: "Finance Act (Union Budget) FY 2025-26" },
  ],
  "old-vs-new-tax-regime": [
    { label: "Income Tax Act, 1961 — Section 115BAC, new tax regime", url: "https://incometaxindia.gov.in" },
    { label: "Finance Act (Union Budget) FY 2025-26 — revised slabs for both regimes", url: "https://incometaxindia.gov.in" },
  ],
  "advance-tax-calculator": [
    { label: "Income Tax Act, 1961 — Section 208, liability for advance tax", url: "https://incometaxindia.gov.in" },
    { label: "Income Tax Act, 1961 — Section 234B/234C, interest for default or deferment of advance tax", url: "https://incometaxindia.gov.in" },
  ],
  "capital-gains-calculator": [
    { label: "Income Tax Act, 1961 — Section 45, capital gains on transfer of a capital asset", url: "https://incometaxindia.gov.in" },
    { label: "Income Tax Act, 1961 — Section 111A/112A/112, tax rates on short and long-term gains", url: "https://incometaxindia.gov.in" },
    { label: "Finance Act 2024 — removal of indexation and revised capital gains rates" },
  ],
  "freelancer-tax-calculator": [
    { label: "Income Tax Act, 1961 — Section 44ADA, presumptive taxation for professionals", url: "https://incometaxindia.gov.in" },
  ],
  "leave-encashment-calculator": [
    { label: "Income Tax Act, 1961 — Section 10(10AA), exemption on leave encashment", url: "https://incometaxindia.gov.in" },
  ],
  "overtime-calculator": [
    { label: "Code on Wages, 2019 — overtime wage rate provisions", url: "https://labour.gov.in" },
    { label: "Factories Act, 1948 — Section 59, overtime at twice the ordinary rate" },
  ],
  "8th-pay-commission-calculator": [
    { label: "Ministry of Finance, Department of Expenditure — Central Pay Commission fitment factor methodology" },
    { label: "7th Central Pay Commission Report — most recent finalized reference for fitment methodology", url: "https://doe.gov.in" },
  ],

  // --- Retirement & Savings ---
  "epf-calculator": [
    { label: "Employees' Provident Funds & Miscellaneous Provisions Act, 1952", url: "https://www.epfindia.gov.in" },
    { label: "EPFO — annual EPF interest rate notifications", url: "https://www.epfindia.gov.in" },
  ],
  "epf-vs-ppf": [
    { label: "Employees' Provident Funds & Miscellaneous Provisions Act, 1952", url: "https://www.epfindia.gov.in" },
    { label: "Public Provident Fund Scheme, 2019", url: "https://www.nsiindia.gov.in" },
  ],
  "ppf-calculator": [
    { label: "Public Provident Fund Scheme, 2019, under the Government Savings Promotion General Rules, 2018", url: "https://www.nsiindia.gov.in" },
  ],
  "nps-calculator": [
    { label: "PFRDA — National Pension System scheme rules", url: "https://www.pfrda.org.in" },
    { label: "Income Tax Act, 1961 — Section 80CCD, NPS tax deductions", url: "https://incometaxindia.gov.in" },
  ],
  "nsc-calculator": [
    { label: "National Savings Certificates (VIII Issue) Scheme Rules, 2019", url: "https://www.nsiindia.gov.in" },
  ],
  "ssy-calculator": [
    { label: "Sukanya Samriddhi Account Scheme Rules, 2019", url: "https://www.nsiindia.gov.in" },
  ],
  "scss-calculator": [
    { label: "Senior Citizens' Savings Scheme Rules, 2019", url: "https://www.nsiindia.gov.in" },
  ],
  "fire-calculator": [
    { label: "4% Safe Withdrawal Rate methodology — the Trinity Study (Cooley, Hubbard & Walz, 1998) and William Bengen's original SWR research" },
  ],
  "gratuity-calculator": [
    { label: "Payment of Gratuity Act, 1972 — gratuity calculation formula and eligibility", url: "https://labour.gov.in" },
  ],

  // --- Investments ---
  "sip-calculator": [
    { label: "SEBI (Mutual Funds) Regulations, 1996", url: "https://www.sebi.gov.in" },
  ],
  "step-up-sip-calculator": [
    { label: "SEBI (Mutual Funds) Regulations, 1996", url: "https://www.sebi.gov.in" },
  ],
  "lumpsum-calculator": [
    { label: "SEBI (Mutual Funds) Regulations, 1996", url: "https://www.sebi.gov.in" },
  ],
  "mutual-fund-calculator": [
    { label: "SEBI (Mutual Funds) Regulations, 1996", url: "https://www.sebi.gov.in" },
  ],
  "swp-calculator": [
    { label: "SEBI (Mutual Funds) Regulations, 1996 — systematic withdrawal plan structure", url: "https://www.sebi.gov.in" },
  ],
  "swp-inflation-calculator": [
    { label: "SEBI (Mutual Funds) Regulations, 1996 — systematic withdrawal plan structure", url: "https://www.sebi.gov.in" },
  ],
  "goal-planning-calculator": [
    { label: "SEBI (Mutual Funds) Regulations, 1996 — goal-based SIP investment structure", url: "https://www.sebi.gov.in" },
  ],
  "elss-calculator": [
    { label: "Income Tax Act, 1961 — Section 80C, ELSS deduction", url: "https://incometaxindia.gov.in" },
    { label: "SEBI (Mutual Funds) Regulations, 1996 — ELSS 3-year statutory lock-in", url: "https://www.sebi.gov.in" },
  ],
  "lic-xirr-calculator": [
    { label: "Insurance Regulatory and Development Authority of India (IRDAI) — life insurance policy regulations", url: "https://irdai.gov.in" },
  ],

  // --- Loans & Deposits ---
  "emi-calculator": [
    { label: "RBI — reducing-balance EMI computation method used by regulated lenders", url: "https://www.rbi.org.in" },
  ],
  "car-loan-emi-calculator": [
    { label: "RBI — reducing-balance EMI computation method used by regulated lenders", url: "https://www.rbi.org.in" },
  ],
  "home-loan-eligibility-calculator": [
    { label: "RBI — Loan-to-Value (LTV) and income-based lending norms for housing loans", url: "https://www.rbi.org.in" },
  ],
  "fd-calculator": [
    { label: "RBI — guidelines on interest computation for bank fixed deposits", url: "https://www.rbi.org.in" },
  ],
  "rd-calculator": [
    { label: "RBI / India Post — recurring deposit scheme interest computation rules", url: "https://www.rbi.org.in" },
  ],

  // --- Government / Subsidy Schemes ---
  "pm-surya-ghar-calculator": [
    { label: "PM Surya Ghar: Muft Bijli Yojana — scheme guidelines, Ministry of New and Renewable Energy", url: "https://pmsuryaghar.gov.in" },
  ],
};
