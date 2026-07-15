"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS } from "@/lib/navigation";

// ── Section metadata ──────────────────────────────────────────────────────

const SECTION_META: Record<string, { icon: string; bg: string; border: string }> = {
  "Tracker":              { icon: "📡", bg: "bg-red-50",      border: "border-red-200/80" },
  "Salary Calculators":   { icon: "💰", bg: "bg-brand-soft",  border: "border-brand/20"   },
  "Tax & Pay Components": { icon: "🧾", bg: "bg-brand-soft",  border: "border-brand/20"   },
  "Retirement & Savings": { icon: "🏦", bg: "bg-blue-50",     border: "border-blue-200"   },
  "Investments":          { icon: "📈", bg: "bg-emerald-50",  border: "border-emerald-200"},
  "Loans & Deposits":     { icon: "💳", bg: "bg-violet-50",   border: "border-violet-200" },
  "Real Estate":          { icon: "🏠", bg: "bg-amber-50",    border: "border-amber-200"  },
  "Free Tools":           { icon: "🛠️", bg: "bg-paper",       border: "border-rule"       },
};

const DEFAULT_META = { icon: "📋", bg: "bg-paper", border: "border-rule" };

function shortTitle(title: string): string {
  const map: Record<string, string> = {
    "Salary Calculators":   "Salary",
    "Tax & Pay Components": "Tax & Payroll",
    "Retirement & Savings": "Retirement",
    "Free Tools":           "Tools",
  };
  return map[title] ?? title;
}

// ── Shell ─────────────────────────────────────────────────────────────────

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
        className="hidden w-[210px] shrink-0 border-l border-rule bg-paper/60 lg:block"
        aria-label="Calculator index"
      >
        <div className="px-3 py-6">
          <SidebarContent pathname={pathname} onNavigate={onNavigate} />
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="fixed inset-y-0 left-0 z-20 w-72 overflow-y-auto border-r border-rule
        bg-surface px-3 py-6 shadow-card-lg lg:hidden"
      aria-label="Calculator index"
    >
      <SidebarContent pathname={pathname} onNavigate={onNavigate} />
    </aside>
  );
}

// ── Content ───────────────────────────────────────────────────────────────

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft/50">
        Calculators
      </p>

      {NAV_SECTIONS.map((section) => {
        const meta = SECTION_META[section.title] ?? DEFAULT_META;
        const hasActive = section.links.some(l => pathname === l.href || pathname.startsWith(l.href + "/"));
        const autoOpen = hasActive
          || section.title === "Salary Calculators"
          || section.title === "Tax & Pay Components";

        return (
          <SidebarSection
            key={section.title}
            section={section}
            meta={meta}
            pathname={pathname}
            defaultOpen={autoOpen}
            onNavigate={onNavigate}
          />
        );
      })}

      {/* Privacy badge */}
      <div className="mt-5 rounded-xl border border-brand/15 bg-brand-soft/50 px-3 py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">🔒</span>
          <p className="text-xs font-semibold text-brand">100% private</p>
        </div>
        <p className="text-[11px] leading-relaxed text-ink-soft">
          All calculations run in your browser. Nothing is stored or sent anywhere.
        </p>
      </div>
    </div>
  );
}

// ── Collapsible section ───────────────────────────────────────────────────

function SidebarSection({
  section,
  meta,
  pathname,
  defaultOpen,
  onNavigate,
}: {
  section: typeof NAV_SECTIONS[0];
  meta: { icon: string; bg: string; border: string };
  pathname: string;
  defaultOpen: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      {/* Section header — clickable toggle */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-2
          text-left transition hover:bg-paper"
      >
        {/* Icon pill */}
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md
          border text-[12px] ${meta.bg} ${meta.border}`}>
          {meta.icon}
        </span>

        {/* Title */}
        <span className="flex-1 text-xs font-semibold text-ink truncate">
          {shortTitle(section.title)}
        </span>

        {/* Chevron */}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`shrink-0 text-ink-soft/50 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Links */}
      {open && (
        <ul className="ml-[34px] border-l border-rule/50 pl-3 py-1 mb-1 space-y-0.5">
          {section.links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            // Strip trailing " Calculator" / " Tracker" to save width
            const label = link.label
              .replace(/ Calculator$/, "")
              .replace(/ Tracker$/, "")
              .replace(/ 🔴$/, " 🔴");
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1.5
                    text-[12px] leading-tight transition ${
                      active
                        ? "bg-brand-soft font-semibold text-brand"
                        : "text-ink-soft hover:bg-paper hover:text-ink"
                    }`}
                >
                  {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}
                  {label}
                </Link>
              </li>
            );
          })}
          {section.href && (
            <li>
              <Link
                href={section.href}
                onClick={onNavigate}
                className="flex items-center gap-1 rounded-md px-2 py-1.5
                  text-[11px] font-semibold text-brand/70 transition hover:text-brand hover:bg-brand-soft"
              >
                View all →
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
