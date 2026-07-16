"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS, type NavSection } from "@/lib/navigation";

// ─── Logo ─────────────────────────────────────────────────────────────────────

function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
      <rect width="40" height="40" rx="10" fill="#2f6f4f" />
      <line x1="12" y1="12" x2="28" y2="12" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="19" x2="28" y2="19" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="12" x2="16" y2="32" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <rect x="21" y="27" width="4" height="5" rx="1" fill="white" opacity="0.55" />
      <rect x="27" y="23" width="4" height="9" rx="1" fill="white" opacity="0.8" />
      <polyline points="29,19 29,14 32,17" fill="none" stroke="white" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}

function LogoWordmark() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3 transition hover:opacity-90"
      aria-label="SalaryTools — Home">
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

// ─── Nav config ───────────────────────────────────────────────────────────────

const HEADER_LABELS: Record<string, string> = {
  "Salary Calculators":   "Salary",
  "Tax & Pay Components": "Tax Saving",
  "Retirement & Savings": "Retirement",
  "Loans & Deposits":     "Loans",
  "Free Tools":           "Tools",
};

const DROPDOWN_SECTION_TITLES = [
  "Salary Calculators",
  "Tax & Pay Components",
  "Retirement & Savings",
  "Investments",
  "Loans & Deposits",
  "Free Tools",
];

// ─── Header ───────────────────────────────────────────────────────────────────

export default function SiteHeader({
  onMenuToggle,
  menuOpen,
}: {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}) {
  const [openTitle, setOpenTitle]     = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Close dropdowns on outside click / Escape
  useEffect(() => {
    function outside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenTitle(null);
    }
    function esc(e: KeyboardEvent) { if (e.key === "Escape") { setOpenTitle(null); setMobileOpen(false); } }
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", esc); };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const dropdownSections = DROPDOWN_SECTION_TITLES
    .map(t => NAV_SECTIONS.find(s => s.title === t))
    .filter((s): s is NavSection => !!s);
  const trackerSection = NAV_SECTIONS.find(s => s.title === "Tracker");

  return (
    <>
      <header className="sticky top-0 z-30">
        <div className="brand-gradient h-[3px]" aria-hidden="true" />
        <div className="border-b border-rule bg-surface/95 shadow-sm backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
            <LogoWordmark />

            {/* Desktop nav */}
            <nav ref={navRef} className="hidden flex-nowrap items-center gap-0.5 lg:flex"
              aria-label="Primary">
              {dropdownSections.map(section => (
                <NavDropdown
                  key={section.title}
                  section={section}
                  label={HEADER_LABELS[section.title] ?? section.title}
                  isOpen={openTitle === section.title}
                  onToggle={() => setOpenTitle(t => t === section.title ? null : section.title)}
                  onClose={() => setOpenTitle(null)}
                />
              ))}

              {trackerSection && (
                <Link href={trackerSection.href ?? "/layoffs"}
                  className="ml-1 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full
                    border border-rule px-3.5 py-2 text-sm font-medium text-ink-soft transition
                    hover:border-deduction/40 hover:bg-deduction/5 hover:text-deduction">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-deduction/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-deduction" />
                  </span>
                  Layoffs
                </Link>
              )}

              <Link href="/salary"
                className="ml-2 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full
                  bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-card transition
                  hover:-translate-y-0.5 hover:opacity-95 hover:shadow-card-lg">
                Calculate Now
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </nav>

            {/* Mobile hamburger — opens full-screen nav, not sidebar */}
            <button
              type="button"
              onClick={() => setMobileOpen(o => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-rule
                text-ink transition hover:bg-brand-soft hover:border-brand hover:text-brand lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <MenuIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen nav drawer ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col
            bg-surface shadow-card-lg lg:hidden overflow-y-auto">

            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-rule px-5 py-4">
              <LogoWordmark />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-rule
                  text-ink-soft hover:bg-paper"
                aria-label="Close menu"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Primary CTAs */}
            <div className="border-b border-rule px-5 py-4 flex flex-col gap-2">
              <Link href="/salary" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand py-3
                  text-sm font-semibold text-white">
                💰 In-Hand Salary Calculator
              </Link>
              <Link href="/calculator/income-tax-calculator" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-rule
                  bg-paper py-3 text-sm font-medium text-ink hover:border-brand hover:text-brand">
                🧾 Income Tax Calculator
              </Link>
            </div>

            {/* Nav sections — collapsible */}
            <div className="flex-1 px-4 py-4 space-y-1">
              {dropdownSections.map(section => (
                <MobileNavSection
                  key={section.title}
                  section={section}
                  label={HEADER_LABELS[section.title] ?? section.title}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}

              {/* Layoffs tracker */}
              {trackerSection && (
                <Link href={trackerSection.href ?? "/layoffs"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-rule bg-paper px-4
                    py-3 text-sm font-medium text-deduction">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-deduction/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-deduction" />
                  </span>
                  Layoffs Tracker
                </Link>
              )}
            </div>

            {/* Privacy note at bottom */}
            <div className="border-t border-rule px-5 py-4 text-center">
              <p className="text-xs text-ink-soft">
                🔒 All calculations run in your browser · No data stored
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─── Desktop dropdown ─────────────────────────────────────────────────────────

function NavDropdown({ section, label, isOpen, onToggle, onClose }: {
  section: NavSection;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const twoColumns = section.links.length > 6;

  return (
    <div className="relative">
      <button type="button" onClick={onToggle} aria-expanded={isOpen}
        className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2
          text-sm font-medium transition ${isOpen
            ? "bg-brand-soft text-brand"
            : "text-ink-soft hover:bg-brand-soft hover:text-brand"}`}>
        {label}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute left-0 top-full z-40 mt-2 rounded-2xl border border-rule
          bg-surface p-4 shadow-card-lg ${twoColumns ? "w-[420px]" : "w-64"}`}>
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
            {section.title}
          </p>
          <div className={twoColumns ? "grid grid-cols-2 gap-x-2" : ""}>
            {section.links.map(link => (
              <Link key={link.href} href={link.href} onClick={onClose}
                className="block rounded-lg px-2 py-1.5 text-sm text-ink-soft transition
                  hover:bg-paper hover:text-ink">
                {link.label}
              </Link>
            ))}
          </div>
          {section.href && (
            <>
              <div className="mt-2 border-t border-rule pt-2" />
              <Link href={section.href} onClick={onClose}
                className="block rounded-lg px-2 py-1.5 text-sm font-semibold text-brand
                  transition hover:bg-brand-soft">
                View all {label} →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mobile nav section ───────────────────────────────────────────────────────

function MobileNavSection({ section, label, onNavigate }: {
  section: NavSection;
  label: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-rule">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-rule bg-paper px-3 pb-3 pt-2">
          <div className="grid grid-cols-2 gap-1">
            {section.links.map(link => (
              <Link key={link.href} href={link.href} onClick={onNavigate}
                className="rounded-lg px-3 py-2 text-xs text-ink-soft transition
                  hover:bg-surface hover:text-ink">
                {link.label.replace(/ Calculator$/, "").replace(/ Tracker$/, "")}
              </Link>
            ))}
          </div>
          {section.href && (
            <Link href={section.href} onClick={onNavigate}
              className="mt-2 block rounded-lg px-3 py-1.5 text-xs font-semibold text-brand
                hover:bg-brand-soft transition">
              View all {label} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Menu icon ────────────────────────────────────────────────────────────────

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M1 4H17M1 9H17M1 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
