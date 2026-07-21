import Link from "next/link";
import { LANDING_PAGES } from "@/lib/landing-pages";

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
      {/* On dark footer bg, use accent coral for the mark */}
      <rect width="40" height="40" rx="10" fill="#ff7a45" />
      <line x1="12" y1="12" x2="28" y2="12" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="19" x2="28" y2="19" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="12" x2="16" y2="32" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <rect x="21" y="27" width="4" height="5" rx="1" fill="white" opacity="0.55" />
      <rect x="27" y="23" width="4" height="9" rx="1" fill="white" opacity="0.8" />
      <polyline points="29,19 29,14 32,17" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22H16.6l-5.2-6.8L5.4 22H2.3l8.1-9.3L1.7 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.7L7.4 4h-1.8l12.1 16Z" />
    </svg>
  );
}

const POPULAR_CALCULATORS = [
  { href: "/salary", label: "In-Hand Salary Calculator" },
  { href: "/calculator/income-tax-calculator", label: "Income Tax Calculator" },
  { href: "/calculator/old-vs-new-tax-regime", label: "Old vs New Tax Regime" },
  { href: "/calculator/hra-calculator", label: "HRA Calculator" },
  { href: "/calculator/emi-calculator", label: "EMI Calculator" },
  { href: "/calculator/sip-calculator", label: "SIP Calculator" },
  { href: "/calculator/epf-calculator", label: "EPF Calculator" },
  { href: "/calculator/home-loan-tax-benefit-calculator", label: "Home Loan Tax Benefit" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

const TRUST_STATS = [
  { icon: "🧮", label: "58+ free calculators" },
  { icon: "🔒", label: "Runs entirely in your browser — nothing is ever stored" },
  { icon: "🇮🇳", label: "Built for India's actual tax and payroll rules" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {/* Brand + trust strip */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5" aria-label="SalaryTools — Home">
              <LogoMark />
              <span className="flex flex-col leading-none">
                <span className="font-display text-base font-bold tracking-tight text-white">
                  Salary<span className="text-accent">Tools</span>
                </span>
                <span className="text-[9px] font-medium tracking-widest text-white/40 uppercase">
                  India
                </span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Free salary, tax, and investment calculators built for India&apos;s actual rules —
              not a US tool adapted after the fact. We built this because most calculators online
              are outdated, ad-choked, or hide the math. This one shows its work.
            </p>
          </div>

          <div className="grid shrink-0 gap-4 sm:grid-cols-3 lg:w-[420px]">
            {TRUST_STATS.map((s) => (
              <div key={s.label} className="flex items-start gap-2.5">
                <span className="text-lg leading-none">{s.icon}</span>
                <span className="text-xs leading-snug text-white/60">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curated link columns */}
        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-sm font-semibold text-white/90">Popular Calculators</p>
            <ul className="mt-3 space-y-2">
              {POPULAR_CALCULATORS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/65 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-white/90">Explore by Category</p>
            <ul className="mt-3 space-y-2">
              {LANDING_PAGES.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="flex items-center gap-1.5 text-sm text-white/65 hover:text-white">
                    <span className="text-xs">{page.icon}</span>
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-white/90">Company</p>
            <ul className="mt-3 space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/65 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-6 font-display text-sm font-semibold text-white/90">Built By</p>
            <div className="mt-3 space-y-2 text-sm text-white/65">
              <a href="https://x.com/penugondaz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white">
                <XIcon /> Praveen Penugonda
              </a>
              <a href="https://x.com/smartvenkat95" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white">
                <XIcon /> Venkatesh Babu Gorantla
              </a>
            </div>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-white/90">Legal</p>
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/65 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-xs leading-relaxed text-white/40">
            © {new Date().getFullYear()} SalaryTools India. Built by Praveen Penugonda &amp; Venkatesh Babu Gorantla, Hyderabad.
            Figures are estimates only — actual amounts depend on your employer&apos;s salary structure and applicable tax rules.
            This site does not provide financial, tax, or legal advice. See our{" "}
            <Link href="/disclaimer" className="underline hover:text-white">disclaimer</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
