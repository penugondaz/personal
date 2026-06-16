/**
 * Site navigation structure — single source of truth used by the header,
 * sidebar, and footer, so adding a new calculator/guide here automatically
 * surfaces it everywhere rather than requiring three separate edits.
 */

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

/** Flat list of primary links for the header's top-level nav (desktop). */
export const PRIMARY_NAV_LINKS: NavLink[] = [
  { href: "/salary", label: "Salary" },
  { href: "/epf-calculator", label: "EPF & VPF" },
  { href: "/ppf-calculator", label: "PPF" },
  { href: "/guides", label: "Guides" },
];
