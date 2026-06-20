import Link from "next/link";
import { NAV_SECTIONS } from "@/lib/navigation";

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

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* About */}
          <div>
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
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Free, fast salary, tax, EPF, and PPF calculators built for India&apos;s actual tax
              rules and payroll structures. Every calculation runs entirely in your browser —
              nothing you type is ever sent to a server or stored. We built this because most
              salary calculators online are either outdated, ad-choked, or hide the real math.
              This one shows its work.
            </p>
          </div>

          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="font-display text-sm font-semibold text-white/90">{section.title}</p>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/65 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} SalaryTools. Figures are estimates based on current
            FY 2025-26 tax rules and common salary structures — actual amounts depend on your
            specific employer policies. This site does not provide financial, tax, or legal advice.
          </p>
          <div className="flex gap-4 whitespace-nowrap">
            <Link href="/salary" className="hover:text-white">Salary</Link>
            <Link href="/calculator/epf-calculator" className="hover:text-white">EPF</Link>
            <Link href="/calculator/ppf-calculator" className="hover:text-white">PPF</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
