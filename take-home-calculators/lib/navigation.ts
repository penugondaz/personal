export interface NavLink {
  href: string;
  label: string;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Tracker",
    links: [
      { href: "/layoffs", label: "Layoffs Tracker 🔴" },
    ],
  },
  {
    title: "Salary Calculators",
    links: [
      { href: "/salary", label: "In-Hand Salary (All CTC Slabs)" },
      { href: "/salary/10-lpa-in-hand", label: "10 LPA In-Hand" },
      { href: "/salary/12-lpa-in-hand", label: "12 LPA In-Hand" },
      { href: "/salary/inhand-to-ctc-calculator", label: "In-Hand to CTC Calculator" },
      { href: "/salary/salary-structure-calculator", label: "Salary Structure Calculator" },
      { href: "/salary-growth", label: "Salary Growth Projection" },
    ],
  },
  {
    title: "Retirement & Savings",
    links: [
      { href: "/calculator/epf-calculator", label: "EPF & VPF Calculator" },
      { href: "/calculator/ppf-calculator", label: "PPF Calculator" },
      { href: "/calculator/nps-calculator", label: "NPS Calculator" },
      { href: "/calculator/gratuity-calculator", label: "Gratuity Calculator" },
      { href: "/calculator/epf-vs-ppf", label: "EPF vs PPF" },
    ],
  },
  {
    title: "Tax & Pay Components",
    links: [
      { href: "/tax-saving", label: "Tax Saving Guide" },
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
    links: [
      { href: "/calculator/sip-calculator", label: "SIP Calculator" },
      { href: "/calculator/lumpsum-calculator", label: "Lumpsum Calculator" },
      { href: "/calculator/mutual-fund-calculator", label: "Mutual Fund Calculator" },
      { href: "/calculator/swp-calculator", label: "SWP Calculator" },
      { href: "/calculator/goal-planning-calculator", label: "Goal Planning Calculator" },
      { href: "/calculator/stock-average-calculator", label: "Stock Average Calculator" },
      { href: "/calculator/xirr-calculator", label: "XIRR Calculator" },
      { href: "/calculator/cagr-xirr-calculator", label: "CAGR & XIRR Calculator" },
    ],
  },
  {
    title: "Loans & Deposits",
    links: [
      { href: "/calculator/emi-calculator", label: "EMI Calculator" },
      { href: "/calculator/fd-calculator", label: "FD Calculator" },
      { href: "/calculator/rd-calculator", label: "RD Calculator" },
      { href: "/calculator/compound-interest-calculator", label: "Compound Interest Calculator" },
      { href: "/calculator/simple-interest-calculator", label: "Simple Interest Calculator" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/guides", label: "All Guides" },
      { href: "/guides/lpa-full-form", label: "LPA Full Form" },
    ],
  },
];

export const PRIMARY_NAV_LINKS: NavLink[] = [
  { href: "/salary", label: "Salary" },
  { href: "/tax-saving", label: "Tax Saving" },
  { href: "/salary-growth", label: "Salary Growth" },
  { href: "/calculator/emi-calculator", label: "Loans" },
];
