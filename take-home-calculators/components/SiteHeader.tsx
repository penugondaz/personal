"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NAV_SECTIONS, type NavSection } from "@/lib/navigation";

function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
      <rect width="40" height="40" rx="10" fill="#2f6f4f" />
      <line x1="12" y1="12" x2="28" y2="12" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="19" x2="28" y2="19" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="12" x2="16" y2="32" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <rect x="21" y="27" width="4" height="5" rx="1" fill="white" opacity="0.55" />
      <rect x="27" y="23" width="4" height="9" rx="1" fill="white" opacity="0.8" />
      <polyline points="29,19 29,14 32,17" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}

function LogoWordmark() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3 transition hover:opacity-90" aria-label="SalaryTools — Home">
      <LogoMark size={38} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-bold tracking-tight text-ink">
          Salary<span className="text-brand">Tools</span>
        </span>
        <span className="hidden text-[10px] font-medium tracking-widest text-ink-soft uppercase sm:block">
          India
        </span>
      </span>
    </Link>
  );
}

/**
 * Desktop primary nav: each entry is either a dropdown (built straight from
 * NAV_SECTIONS, so the header can never drift from the sidebar/footer —
 * same lesson learned from the calculator-page URL mismatch) or, for
 * "Tracker", a standalone live-badge link since it's the site's clearest
 * differentiator and deserves to not be buried inside a menu.
 */
const HEADER_LABELS: Record<string, string> = {
  "Salary Calculators": "Salary",
  "Tax & Pay Components": "Tax Saving",
  "Retirement & Savings": "Retirement",
  "Loans & Deposits": "Loans",
  "Free Tools": "Tools",
};

const DROPDOWN_SECTION_TITLES = [
  "Salary Calculators",
  "Tax & Pay Components",
  "Retirement & Savings",
  "Investments",
  "Loans & Deposits",
  "Free Tools",
];

export default function SiteHeader({
  onMenuToggle,
  menuOpen,
}: {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}) {
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenTitle(null);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenTitle(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const dropdownSections = DROPDOWN_SECTION_TITLES.map((t) => NAV_SECTIONS.find((s) => s.title === t)).filter(
    (s): s is NavSection => !!s
  );
  const trackerSection = NAV_SECTIONS.find((s) => s.title === "Tracker");

  return (
    <header className="sticky top-0 z-30">
      {/* Thin brand accent — a small "this is a real, cared-for product" cue */}
      <div className="brand-gradient h-[3px]" aria-hidden="true" />
      <div className="border-b border-rule bg-surface/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <LogoWordmark />

          {/* Desktop nav */}
          <nav ref={navRef} className="hidden flex-nowrap items-center gap-0.5 overflow-x-auto lg:flex" aria-label="Primary">
            {dropdownSections.map((section) => (
              <NavDropdown
                key={section.title}
                section={section}
                label={HEADER_LABELS[section.title] ?? section.title}
                isOpen={openTitle === section.title}
                onToggle={() => setOpenTitle((t) => (t === section.title ? null : section.title))}
                onClose={() => setOpenTitle(null)}
              />
            ))}

            {trackerSection && (
              <Link
                href={trackerSection.href ?? "/layoffs"}
                className="ml-1 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-rule px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:border-deduction/40 hover:bg-deduction/5 hover:text-deduction"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-deduction/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-deduction" />
                </span>
                Layoffs
              </Link>
            )}

            <Link
              href="/salary"
              className="ml-2 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:opacity-95 hover:shadow-card-lg"
            >
              Calculate Now
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </nav>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-rule text-ink lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <MenuIcon open={!!menuOpen} />
          </button>
        </div>
      </div>
    </header>
  );
}

function NavDropdown({
  section,
  label,
  isOpen,
  onToggle,
  onClose,
}: {
  section: NavSection;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const twoColumns = section.links.length > 6;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition ${
          isOpen ? "bg-brand-soft text-brand" : "text-ink-soft hover:bg-brand-soft hover:text-brand"
        }`}
      >
        {label}
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 top-full z-40 mt-2 rounded-2xl border border-rule bg-surface p-4 shadow-card-lg ${
            twoColumns ? "w-[420px]" : "w-64"
          }`}
        >
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
            {section.title}
          </p>
          <div className={twoColumns ? "grid grid-cols-2 gap-x-2" : ""}>
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block rounded-lg px-2 py-1.5 text-sm text-ink-soft transition hover:bg-paper hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {section.href && (
            <>
              <div className="mt-2 border-t border-rule pt-2" />
              <Link
                href={section.href}
                onClick={onClose}
                className="block rounded-lg px-2 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand-soft"
              >
                View all {label} →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
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
