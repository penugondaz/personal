import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/paths";
import SiteShell from "@/components/SiteShell";

/**
 * next/font (not a <link> tag) for two Core Web Vitals reasons:
 *  1. Self-hosts the font files at build time — no extra DNS/connection
 *     round-trip to fonts.googleapis.com on the critical path (helps LCP).
 *  2. `display: "swap"` + automatic fallback-metric matching means the
 *     fallback system font is sized to match Fraunces/Inter's metrics,
 *     so when the real font swaps in there's no reflow (helps CLS).
 *
 * Fraunces is used ONLY for display moments (H1s, the big in-hand
 * number) — see globals.css. Inter carries everything else, including
 * tabular rupee figures, which it renders cleanly at small sizes.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Salary Tools — Salary, Tax, EPF & Payroll Calculators India",
    template: "%s | Salary Tools",
  },
  description:
    "Salary Tools — Free in-hand salary, CTC, income tax, EPF, PPF, gratuity, and payroll calculators for India. Accurate, fast, and easy to use.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#2F6F4F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col font-sans">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
