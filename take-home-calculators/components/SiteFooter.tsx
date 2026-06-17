import Link from "next/link";
import { NAV_SECTIONS } from "@/lib/navigation";

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* About */}
          <div>
            <div className="flex items-center gap-2.5">
              <svg width="28" height="28" viewBox="0 0 34 34" aria-hidden="true">
                <rect width="34" height="34" rx="10" fill="var(--accent)" />
                <path
                  d="M11 10h12M11 10c4.5 0 7 1.6 7 4.4S15.5 18.8 11 18.8h-.3L20 24"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path d="M11 14.4h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="font-display text-base font-semibold">Take Home Calculators</span>
            </div>
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
            © {new Date().getFullYear()} Take Home Calculators. Figures are estimates based on
            current FY 2025-26 tax rules and common salary structures — actual amounts depend on
            your specific employer policies. This site does not provide financial, tax, or legal
            advice.
          </p>
          <div className="flex gap-4 whitespace-nowrap">
            <Link href="/salary" className="hover:text-white">
              Salary
            </Link>
            <Link href="/epf-calculator" className="hover:text-white">
              EPF
            </Link>
            <Link href="/ppf-calculator" className="hover:text-white">
              PPF
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
