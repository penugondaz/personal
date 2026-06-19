// take-home-calculators/app/layoffs/metadata.ts
// Import this in a layout.tsx or as generateMetadata if you convert to a server component

import type { Metadata } from "next";

export const layoffsMetadata: Metadata = {
  title: "India Tech Layoffs Tracker 2025 — IT Companies Layoffs Live Data",
  description:
    "Live tracker for tech and IT company layoffs in India and globally. Track companies, headcount, dates, industry, and sources. Updated in real-time. Covering Bengaluru, Hyderabad, Pune, NCR and global IT layoffs.",
  keywords: [
    "layoffs tracker",
    "tech layoffs india",
    "IT companies layoffs",
    "layoff tracker india",
    "india layoffs 2025",
    "layoffs in india",
    "tech layoffs 2025",
    "startup layoffs india",
    "IT layoffs bangalore",
    "india tech job cuts",
  ],
  openGraph: {
    title: "India Tech Layoffs Tracker — Live IT Layoffs Data",
    description:
      "Real-time tracker for tech and IT company layoffs in India and globally. Filter by company, industry, country. Source-verified entries.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "India Tech Layoffs Tracker 2025",
    description: "Live tech and IT layoffs tracker for India. Updated as news breaks.",
  },
  alternates: {
    canonical: "https://salarytools.in/layoffs",
  },
};
