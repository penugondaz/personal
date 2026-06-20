import Link from "next/link";
import Image from "next/image";
import { PRIMARY_NAV_LINKS } from "@/lib/navigation";

const LOGO_URL =
  "https://raw.githubusercontent.com/penugondaz/personal/refs/heads/main/images/logo.png";

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
        {/* Logo — full horizontal lockup, text already in the image */}
        <Link href="/" className="flex items-center" aria-label="Salary Tools — Home">
          <Image
            src={LOGO_URL}
            alt="Salary Tools"
            width={160}
            height={44}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

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
