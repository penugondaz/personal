import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuides } from "@/lib/guides-loader";
import { absoluteUrl } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Salary & Tax Guides — India",
  description:
    "Plain-English guides to salary structure, income tax, and payroll terms used in Indian job offers and payslips.",
  alternates: { canonical: absoluteUrl("/guides") },
};

interface GuideListItem {
  href: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
}

const CUSTOM_GUIDES: GuideListItem[] = [
  {
    href: "/guides/lpa-full-form",
    title: "LPA Full Form",
    description: "What LPA means, and how it differs from your in-hand salary.",
    date: "2026-06-01",
  },
];

export default function GuidesIndexPage() {
  const mdGuides: GuideListItem[] = getAllGuides().map((g) => ({
    href: `/guides/${g.slug}`,
    title: g.frontmatter.title,
    description: g.frontmatter.description,
    date: g.frontmatter.date,
    tags: g.frontmatter.tags,
  }));

  const allGuides = [...CUSTOM_GUIDES, ...mdGuides].sort(
    (a, b) => b.date.localeCompare(a.date)
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Salary & Tax Guides</h1>
      <p className="mt-3 text-ink-soft">
        Plain-English explanations of the terms you&apos;ll run into on offer letters, payslips,
        and tax forms in India.
      </p>

      <ul className="mt-8 space-y-3">
        {allGuides.map((guide) => (
          <li key={guide.href}>
            <Link
              href={guide.href}
              className="block rounded-lg border border-rule bg-surface px-5 py-4 hover:border-brand"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-medium text-brand">{guide.title}</span>
                  <p className="mt-1 text-sm text-ink-soft">{guide.description}</p>
                </div>
                <time dateTime={guide.date} className="shrink-0 text-xs text-ink-soft">
                  {new Date(guide.date + "T00:00:00").toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
              {guide.tags && guide.tags.length > 0 && (
                <div className="mt-2 flex gap-1.5">
                  {guide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
