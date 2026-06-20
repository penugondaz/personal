import Link from "next/link";
import { PRIMARY_NAV_LINKS } from "@/lib/navigation";

function LogoMark({ size = 40 }: { size?: number }) {
  const s = size / 40; // scale factor
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="40" height="40" rx="10" fill="#2f6f4f" />
      {/* ₹ stem + horizontal bars */}
      <line x1="12" y1="12" x2="28" y2="12" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="19" x2="28" y2="19" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="12" x2="16" y2="32" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Bar chart — ascending bars rising from base */}
      <rect x="21" y="27" width="4" height="5" rx="1" fill="white" opacity="0.55" />
      <rect x="27" y="23" width="4" height="9" rx="1" fill="white" opacity="0.8" />
      {/* Growth arrow above tallest bar */}
      <polyline points="29,19 29,14 32,17" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}

function LogoWordmark() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="SalaryTools — Home">
      <LogoMark size={38} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-bold tracking-tight text-ink">
          Salary<span className="text-brand">Tools</span>
        </span>
        <span className="text-[10px] font-medium tracking-widest text-ink-soft uppercase hidden sm:block">
          India
        </span>
      </span>
    </Link>
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
        <LogoWordmark />

        {/* Desktop nav */}
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
