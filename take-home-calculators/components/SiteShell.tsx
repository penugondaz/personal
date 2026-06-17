"use client";

import { useState } from "react";
import SiteHeader from "./SiteHeader";
import SiteSidebar from "./SiteSidebar";
import SiteFooter from "./SiteFooter";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader onMenuToggle={() => setDrawerOpen((o) => !o)} menuOpen={drawerOpen} />

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        {/* Mobile drawer */}
        {drawerOpen && (
          <>
            <div
              className="fixed inset-0 z-20 bg-ink/30 lg:hidden"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <SiteSidebar variant="drawer" onNavigate={() => setDrawerOpen(false)} />
          </>
        )}

        {/* Main content */}
        <div className="min-w-0 flex-1">{children}</div>

        {/* Desktop sidebar — right-hand side */}
        <SiteSidebar variant="desktop" />
      </div>

      <SiteFooter />
    </div>
  );
}
