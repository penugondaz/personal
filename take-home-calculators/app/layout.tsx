import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/paths";

export const metadata: Metadata = {
  // metadataBase makes next/head resolve relative og:image / canonical
  // paths against the correct subpath-aware origin automatically.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Take Home Calculators — Salary, Tax, EPF & Payroll Calculators India",
    template: "%s | Take Home Calculators",
  },
  description:
    "Free in-hand salary, CTC, income tax, EPF, PPF, gratuity, and payroll calculators for India — accurate, fast, and easy to use.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
