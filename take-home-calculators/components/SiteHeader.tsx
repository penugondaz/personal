import Link from "next/link";
import { PRIMARY_NAV_LINKS } from "@/lib/navigation";

/**
 * Logo mark: a rounded-square rupee glyph in the brand gradient. Built
 * as inline SVG (not an image asset) so it costs zero network requests
 * and never causes an LCP image-load delay — the header renders
 * instantly on first paint.
 */
function LogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" className="shrink-0">
      <rect width="34" height="34" rx="10" fill="var(--brand)" />
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
  );
}

export default function SiteHeader({
  onMenuToggle,
  menuOpen,
}: {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-lg font-semibold text-ink sm:text-xl">
            Take Home Calculators
          </span>
        </Link>

        {/* Desktop main menu */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {PRIMARY_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-brand-soft hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/salary"
            className="ml-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
          >
            Calculate Now
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-rule text-ink md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <MenuIcon open={!!menuOpen} />
        </button>
      </div>
    </header>
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
