/**
 * Centralised JSON-LD schema builders.
 * Import and call these from any page.tsx — no duplication needed.
 */

import { absoluteUrl, SITE_URL } from "@/lib/paths";

// ── Breadcrumbs ───────────────────────────────────────────────────────────────

export function breadcrumbSchema(
  items: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

export function faqSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

// ── Calculator (WebApplication) ───────────────────────────────────────────────

export function calculatorSchema({
  name,
  description,
  url,
  category = "FinanceApplication",
}: {
  name: string;
  description: string;
  url: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: absoluteUrl(url),
    applicationCategory: category,
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    provider: {
      "@type": "Organization",
      name: "SalaryTools India",
      url: SITE_URL,
    },
  };
}

// ── WebPage (for salary/guide pages) ─────────────────────────────────────────

export function webPageSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(url),
    publisher: {
      "@type": "Organization",
      name: "SalaryTools India",
      url: SITE_URL,
    },
  };
}

// ── FinancialProduct schema (for salary pages) ────────────────────────────────
// Google doesn't have a dedicated "salary" type, but these help:

export function salaryPageSchema({
  lpa,
  inHandMonthly,
  inHandAnnual,
  url,
}: {
  lpa: number;
  inHandMonthly: number;
  inHandAnnual: number;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${lpa} LPA In-Hand Salary`,
    description: `${lpa} LPA CTC in-hand salary is approximately ₹${inHandMonthly.toLocaleString("en-IN")} per month after tax and PF deductions.`,
    url: absoluteUrl(url),
    mainEntity: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: inHandMonthly,
      description: `Monthly in-hand salary for ${lpa} LPA CTC`,
    },
    publisher: {
      "@type": "Organization",
      name: "SalaryTools India",
      url: SITE_URL,
    },
  };
}

// ── Combine multiple schemas into one <script> tag ────────────────────────────

export function buildJsonLd(...schemas: (object | null | undefined)[]) {
  const valid = schemas.filter(Boolean) as object[];
  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];
  return { "@context": "https://schema.org", "@graph": valid.map(s => {
    // Remove duplicate @context from individual schemas when using @graph
    const { "@context": _, ...rest } = s as any;
    return rest;
  })};
}
