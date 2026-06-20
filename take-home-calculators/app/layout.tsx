import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { SITE_URL } from "@/lib/paths";
import SiteShell from "@/components/SiteShell";

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
  openGraph: {
    images: [
      {
        url: "https://raw.githubusercontent.com/penugondaz/personal/refs/heads/main/images/meta%20image.png",
        width: 1200,
        height: 630,
        alt: "Salary Tools — India Salary & Tax Calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://raw.githubusercontent.com/penugondaz/personal/refs/heads/main/images/meta%20image.png",
    ],
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
