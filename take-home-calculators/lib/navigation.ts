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
    title: "Salary Calculators",
    links: [
      { href: "/salary", label: "In-Hand Salary (All CTC Slabs)" },
      { href: "/salary/10-lpa-in-hand", label: "10 LPA In-Hand" },
      { href: "/salary/12-lpa-in-hand", label: "12 LPA In-Hand" },
    ],
  },
  {
    title: "Retirement & Savings",
    links: [
      { href: "/epf-calculator", label: "EPF & VPF Calculator" },
      { href: "/ppf-calculator", label: "PPF Calculator" },
      { href: "/nps-calculator", label: "NPS Calculator" },
      { href: "/gratuity-calculator", label: "Gratuity Calculator" },
      { href: "/epf-vs-ppf", label: "EPF vs PPF" },
    ],
  },
  {
    title: "Tax & Pay Components",
    links: [
      { href: "/hra-calculator", label: "HRA Calculator" },
      { href: "/salary-hike-calculator", label: "Salary Hike Calculator" },
      { href: "/leave-encashment-calculator", label: "Leave Encashment Calculator" },
      { href: "/overtime-calculator", label: "Overtime Calculator" },
      { href: "/advance-tax-calculator", label: "Advance Tax Calculator" },
      { href: "/capital-gains-calculator", label: "Capital Gains Calculator" },
      { href: "/old-vs-new-tax-regime", label: "Old vs New Tax Regime" },
    ],
  },
  {
    title: "Loans & Investments",
    links: [
      { href: "/emi-calculator", label: "EMI Calculator" },
      { href: "/sip-calculator", label: "SIP Calculator" },
      { href: "/fd-calculator", label: "FD Calculator" },
      { href: "/rd-calculator", label: "RD Calculator" },
      { href: "/cagr-xirr-calculator", label: "CAGR & XIRR Calculator" },
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
  { href: "/epf-calculator", label: "EPF & VPF" },
  { href: "/emi-calculator", label: "Loans" },
  { href: "/guides", label: "Guides" },
];
