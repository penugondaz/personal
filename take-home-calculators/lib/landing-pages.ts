/**
 * Metadata for every top-level calculator hub / landing page on the site.
 * Used to build consistent "Explore other calculators" cross-linking
 * across all hub pages — add a new hub here once and every page picks it up.
 */

export interface LandingPageInfo {
  href: string;
  icon: string;
  title: string;
  desc: string;
}

export const LANDING_PAGES: LandingPageInfo[] = [
  {
    href: "/salary",
    icon: "💰",
    title: "Salary Calculators",
    desc: "In-hand salary from CTC, salary structure breakdown, and salary growth projections.",
  },
  {
    href: "/tax-saving",
    icon: "🧾",
    title: "Tax Saving Guide",
    desc: "Income tax by salary slab, 80C, NPS, HRA, and home loan deductions for FY 2025-26.",
  },
  {
    href: "/retirement",
    icon: "🏦",
    title: "Retirement & Savings",
    desc: "EPF & VPF, PPF, NPS, gratuity, NSC, SSY, and SCSS calculators.",
  },
  {
    href: "/investments",
    icon: "📈",
    title: "Investments",
    desc: "SIP, step-up SIP, lumpsum, SWP with inflation, ELSS, and goal planning.",
  },
  {
    href: "/loans-deposits",
    icon: "💳",
    title: "Loans & Deposits",
    desc: "EMI, fixed deposit, recurring deposit, and compound/simple interest.",
  },
  {
    href: "/real-estate",
    icon: "🏠",
    title: "Real Estate",
    desc: "Home affordability, rent vs buy, stamp duty, and rental yield by state.",
  },
  {
    href: "/auto",
    icon: "🚗",
    title: "Auto",
    desc: "Car lease vs buy, perquisite tax, and CTC car benefit comparison.",
  },
  {
    href: "/tools",
    icon: "🛠️",
    title: "Free Tools",
    desc: "Percentage, discount, and average calculators, plus text and number tools.",
  },
];

/** Returns every hub page except the one currently being viewed. */
export function otherLandingPages(currentHref: string): LandingPageInfo[] {
  return LANDING_PAGES.filter((p) => p.href !== currentHref);
}
