export interface NavLink {
  href: string;
  label: string;
}

export interface NavSection {
  title: string;
  href?: string;
  links: NavLink[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Tracker",
    href: "/layoffs",
    links: [
      { href: "/layoffs", label: "Layoffs Tracker 🔴" },
      { href: "/calculator/layoff-risk-calculator", label: "Layoff Risk Calculator" },
    ],
  },
  {
    title: "Salary Calculators",
    href: "/salary",
    links: [
      { href: "/salary", label: "In-Hand Salary (All CTC Slabs)" },
      { href: "/salary/10-lpa-in-hand", label: "10 LPA In-Hand" },
      { href: "/salary/12-lpa-in-hand", label: "12 LPA In-Hand" },
      { href: "/salary/inhand-to-ctc-calculator", label: "In-Hand to CTC Calculator" },
      { href: "/salary/salary-structure-calculator", label: "Salary Structure Calculator" },
      { href: "/salary-growth", label: "Salary Growth Projection" },
      { href: "/calculator/8th-pay-commission-calculator", label: "8th Pay Commission Calculator" },
    ],
  },
  {
    title: "Retirement & Savings",
    href: "/retirement",
    links: [
      { href: "/calculator/epf-calculator", label: "EPF & VPF Calculator" },
      { href: "/calculator/epf-vs-ppf", label: "EPF vs PPF" },
      { href: "/calculator/ppf-calculator", label: "PPF Calculator" },
      { href: "/calculator/nps-calculator", label: "NPS Calculator" },
      { href: "/calculator/gratuity-calculator", label: "Gratuity Calculator" },
      { href: "/calculator/nsc-calculator", label: "NSC Calculator" },
      { href: "/calculator/ssy-calculator", label: "SSY Calculator" },
      { href: "/calculator/scss-calculator", label: "SCSS Calculator" },
      { href: "/calculator/fire-calculator", label: "FIRE Calculator 🔥" },
    ],
  },
  {
    title: "Tax & Pay Components",
    href: "/tax-saving",
    links: [
      { href: "/tax-saving", label: "Tax Saving Guide" },
      { href: "/calculator/income-tax-calculator", label: "Income Tax Calculator" },
      { href: "/calculator/old-vs-new-tax-regime", label: "Old vs New Tax Regime" },
      { href: "/calculator/hra-calculator", label: "HRA Calculator" },
      { href: "/calculator/advance-tax-calculator", label: "Advance Tax Calculator" },
      { href: "/calculator/capital-gains-calculator", label: "Capital Gains Calculator" },
      { href: "/calculator/salary-hike-calculator", label: "Salary Hike Calculator" },
      { href: "/calculator/leave-encashment-calculator", label: "Leave Encashment Calculator" },
      { href: "/calculator/overtime-calculator", label: "Overtime Calculator" },
    ],
  },
  {
    title: "Investments",
    href: "/investments",
    links: [
      { href: "/calculator/sip-calculator", label: "SIP Calculator" },
      { href: "/calculator/step-up-sip-calculator", label: "Step-Up SIP Calculator" },
      { href: "/calculator/lumpsum-calculator", label: "Lumpsum Calculator" },
      { href: "/calculator/mutual-fund-calculator", label: "Mutual Fund Calculator" },
      { href: "/calculator/swp-calculator", label: "SWP Calculator" },
      { href: "/calculator/swp-inflation-calculator", label: "SWP with Inflation" },
      { href: "/calculator/goal-planning-calculator", label: "Goal Planning Calculator" },
      { href: "/calculator/xirr-calculator", label: "XIRR Calculator" },
      { href: "/calculator/lic-xirr-calculator", label: "LIC XIRR Calculator" },
      { href: "/calculator/cagr-xirr-calculator", label: "CAGR & XIRR Calculator" },
      { href: "/calculator/elss-calculator", label: "ELSS Calculator" },
      { href: "/calculator/real-returns-calculator", label: "Inflation-Adjusted Returns" },
    ],
  },
  {
    title: "Loans & Deposits",
    href: "/loans-deposits",
    links: [
      { href: "/calculator/emi-calculator", label: "EMI Calculator" },
      { href: "/calculator/fd-calculator", label: "FD Calculator" },
      { href: "/calculator/rd-calculator", label: "RD Calculator" },
      { href: "/calculator/compound-interest-calculator", label: "Compound Interest Calculator" },
      { href: "/calculator/simple-interest-calculator", label: "Simple Interest Calculator" },
      { href: "/calculator/home-loan-eligibility-calculator", label: "Home Loan Eligibility" },
      { href: "/calculator/car-loan-emi-calculator", label: "Car Loan EMI Calculator" },
    ],
  },
  {
    title: "Free Tools",
    href: "/tools",
    links: [
      { href: "/tools", label: "All Tools" },
      { href: "/tools/rent-receipt-generator", label: "Rent Receipt Generator" },
      { href: "/tools/payslip-generator", label: "Payslip Generator" },
      { href: "/tools/discount-calculator", label: "Discount Calculator" },
      { href: "/tools/percentage-calculator", label: "Percentage Calculator" },
      { href: "/tools/average-calculator", label: "Average Calculator" },
      { href: "/tools/number-converter", label: "Number to Words Converter" },
      { href: "/tools/character-counter", label: "Character Counter" },
      { href: "/tools/word-counter", label: "Word Counter" },
      { href: "/tools/text-case-converter", label: "Text Case Converter" },
    ],
  },
  {
    title: "Guides",
    href: "/blog",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/blog/lpa-full-form", label: "LPA Full Form" },
    ],
  },
];

export const PRIMARY_NAV_LINKS: NavLink[] = [
  { href: "/salary", label: "Salary" },
  { href: "/tax-saving", label: "Tax Saving" },
  { href: "/salary-growth", label: "Salary Growth" },
  { href: "/calculator/emi-calculator", label: "Loans" },
  { href: "/tools", label: "Tools" },
];
