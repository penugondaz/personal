"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS } from "@/lib/navigation";

export default function SiteSidebar({
  variant,
  onNavigate,
}: {
  variant: "desktop" | "drawer";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  if (variant === "desktop") {
    return (
      <aside
        className="hidden w-64 shrink-0 border-l border-rule px-5 py-8 lg:block"
        aria-label="Calculator index"
      >
        <SidebarContent pathname={pathname} onNavigate={onNavigate} />
      </aside>
    );
  }

  return (
    <aside
      className="fixed inset-y-0 left-0 z-20 w-72 overflow-y-auto border-r border-rule bg-surface px-5 py-8 shadow-card-lg lg:hidden"
      aria-label="Calculator index"
    >
      <SidebarContent pathname={pathname} onNavigate={onNavigate} />
    </aside>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Calculator index">
      <p className="mb-4 font-display text-sm font-semibold text-ink">On this site</p>
      {NAV_SECTIONS.map((section, i) => (
        <div key={section.title} className={i > 0 ? "mt-6" : ""}>
          <p className="font-display text-xs uppercase tracking-wide text-ink-soft">
            {section.href ? (
              <Link href={section.href} className="hover:text-brand">
                {section.title}
              </Link>
            ) : (
              section.title
            )}
          </p>
          <ul className="mt-2 space-y-1.5 border-r-2 border-brand-soft pr-3">
            {section.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className={`block rounded-md px-2 py-1.5 text-sm transition ${
                      active
                        ? "bg-brand-soft font-medium text-brand"
                        : "text-ink-soft hover:bg-paper hover:text-ink"
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

      <div className="mt-8 rounded-xl border border-rule bg-brand-soft p-4">
        <p className="font-display text-sm font-semibold text-brand">No data stored</p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
          Every calculation runs in your browser. Nothing you type is sent anywhere.
        </p>
      </div>
    </nav>
  );
}
