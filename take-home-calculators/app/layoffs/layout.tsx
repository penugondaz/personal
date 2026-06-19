import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/paths";

export const metadata: Metadata = {
  title: "India Tech Layoffs Tracker 2026 — IT Companies Layoffs Live Data",
  description: "Live tracker for tech and IT company layoffs in India and globally. Track companies, headcount, dates, industry, and sources. Updated in real-time. Covering Bengaluru, Hyderabad, Pune, NCR and global IT layoffs.",
  keywords: ["layoffs tracker", "tech layoffs india", "IT companies layoffs", "layoff tracker india", "india layoffs 2026", "layoffs in india", "tech layoffs 2026", "startup layoffs india"],
  openGraph: {
    title: "India Tech Layoffs Tracker — Live IT Layoffs Data",
    description: "Real-time tracker for tech and IT company layoffs in India and globally.",
    type: "website",
  },
  alternates: { canonical: absoluteUrl("/layoffs") },
};

export default function LayoffsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
