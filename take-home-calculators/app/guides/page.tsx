import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Salary & Tax Guides — India",
  description:
    "Plain-English guides to salary structure, income tax, and payroll terms used in Indian job offers and payslips.",
  alternates: { canonical: absoluteUrl("/guides") },
};

const guides = [
  {
    href: "/guides/lpa-full-form",
    title: "LPA Full Form",
    description: "What LPA means, and how it differs from your in-hand salary.",
  },
];

export default function GuidesIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Salary & Tax Guides</h1>
      <p className="mt-3 text-ink-soft">
        Plain-English explanations of the terms you&apos;ll run into on offer letters, payslips,
        and tax forms in India.
      </p>

      <ul className="mt-8 space-y-3">
        {guides.map((guide) => (
          <li key={guide.href}>
            <Link
              href={guide.href}
              className="block rounded-lg border border-rule bg-surface px-5 py-4 hover:border-brand"
            >
              <span className="font-medium text-brand">{guide.title}</span>
              <p className="mt-1 text-sm text-ink-soft">{guide.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
