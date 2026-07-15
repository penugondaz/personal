"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";
import SiteSidebar from "./SiteSidebar";
import SiteFooter from "./SiteFooter";

// Pages where the sidebar should NOT appear
const NO_SIDEBAR_PATHS = ["/"];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const showSidebar = !NO_SIDEBAR_PATHS.includes(pathname);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader onMenuToggle={() => setDrawerOpen((o) => !o)} menuOpen={drawerOpen} />

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        {/* Mobile drawer — only on non-home pages */}
        {drawerOpen && showSidebar && (
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

        {/* Desktop sidebar — hidden on homepage */}
        {showSidebar && <SiteSidebar variant="desktop" />}
      </div>

      <SiteFooter />
    </div>
  );
}
