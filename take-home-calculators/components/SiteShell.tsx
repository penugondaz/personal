"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS, PRIMARY_NAV_LINKS } from "@/lib/navigation";

/**
 * Combined header + sidebar shell, designed as a "ledger index" rather
 * than a generic SaaS sidebar — the kind of tabbed section divider you'd
 * find in a physical accounting ledger book, listing categories down the
 * side. On mobile, the sidebar collapses into a slide-out drawer
 * triggered from the header, keeping the same hairline-rule, serif-label
 * visual language rather than defaulting to a generic hamburger panel.
 */

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-col">
      {/* Header — slim letterhead bar */}
      <header className="sticky top-0 z-30 border-b border-rule bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="font-display text-lg text-ink" onClick={() => setDrawerOpen(false)}>
            Take Home Calculators
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {PRIMARY_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium hover:text-ledger ${
                  pathname === link.href ? "text-ledger" : "text-ink-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setDrawerOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-rule text-ink md:hidden"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
          >
            <MenuIcon open={drawerOpen} />
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1">
        {/* Desktop sidebar — ledger index, hidden on mobile */}
        <aside
          className="hidden w-56 shrink-0 border-r border-rule px-4 py-8 md:block"
          aria-label="Calculator index"
        >
          <LedgerIndex pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <>
            <div
              className="fixed inset-0 z-20 bg-ink/30 md:hidden"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <aside
              className="fixed inset-y-0 left-0 z-20 w-72 overflow-y-auto border-r border-rule bg-paper px-5 py-8 shadow-lg md:hidden"
              aria-label="Calculator index"
            >
              <LedgerIndex pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            </aside>
          </>
        )}

        {/* Main content */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      {/* Footer */}
      <footer className="border-t border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="font-display text-sm text-ink">Take Home Calculators</p>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Free salary, tax, EPF, and PPF calculators for India. Figures are estimates based on
            current tax rules and common salary structures — actual amounts depend on your
            specific employer policies and tax situation. This site does not provide financial,
            tax, or legal advice.
          </p>
          <nav className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer">
            {PRIMARY_NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-ink-muted hover:text-ledger">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-6 text-xs text-ink-muted">
            © {new Date().getFullYear()} Take Home Calculators. Tax figures based on FY 2025-26
            rules.
          </p>
        </div>
      </footer>
    </div>
  );
}

function LedgerIndex({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <nav aria-label="Calculator index">
      {NAV_SECTIONS.map((section, i) => (
        <div key={section.title} className={i > 0 ? "mt-6" : ""}>
          <p className="font-display text-xs uppercase tracking-wide text-ink-muted">
            {section.title}
          </p>
          <ul className="mt-2 space-y-1.5 border-l border-rule pl-3">
            {section.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className={`block text-sm ${
                      active ? "font-medium text-ledger" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M1 4H17M1 9H17M1 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
