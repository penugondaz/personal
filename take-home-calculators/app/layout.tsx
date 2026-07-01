import type { Metadata, Viewport } from "next";
// Fonts loaded via CSS in globals.css
import Script from "next/script";

import "./globals.css";
import { SITE_URL } from "@/lib/paths";
import SiteShell from "@/components/SiteShell";

const plusJakarta = { variable: "--font-plus-jakarta" };

const inter = { variable: "--font-inter" };  // kept

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Salary Tools — Salary, Tax, EPF & Payroll Calculators India",
    template: "%s | Salary Tools",
  },
  description:
    "Salary Tools — Free in-hand salary, CTC, income tax, EPF, PPF, gratuity, and payroll calculators for India. Accurate, fast, and easy to use.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
      className={`h-full antialiased ${plusJakarta.variable} ${inter.variable}`}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
