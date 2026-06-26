import type { Metadata, Viewport } from "next";
// Fonts loaded via CSS in globals.css
import Script from "next/script";

import "./globals.css";
import { SITE_URL } from "@/lib/paths";
import SiteShell from "@/components/SiteShell";

const fraunces = { variable: "--font-fraunces" };

const inter = { variable: "--font-inter" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Salary Tools — Salary, Tax, EPF & Payroll Calculators India",
    template: "%s | Salary Tools",
  },
  description:
    "Salary Tools — Free in-hand salary, CTC, income tax, EPF, PPF, gratuity, and payroll calculators for India. Accurate, fast, and easy to use.",
  other: {
    "google-adsense-account": "ca-pub-7212641459831379",
  },
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
    <html
      lang="en"
      className={`h-full antialiased ${fraunces.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SiteShell>{children}</SiteShell>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DBYZXD16PJ"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DBYZXD16PJ');
          `}
        </Script>
      </body>
    </html>
  );
}
