import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, buildJsonLd } from "@/lib/schema";
import { getAllBlogPosts, formatBlogDate } from "@/lib/blog-loader";

export const metadata: Metadata = {
  title: "Blog — Salary, Tax & Finance Articles | SalaryTools India",
  description:
    "Articles, guides, how-tos and listicles on Indian salary, income tax, EPF, investments, and personal finance. Practical, accurate, updated for the latest rules.",
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: {
    title: "Blog — Salary, Tax & Finance Articles | SalaryTools India",
    description: "Articles, guides, how-tos and listicles on Indian salary, income tax, EPF, investments, and personal finance.",
    url: absoluteUrl("/blog"),
  },
};

const jsonLd = buildJsonLd(
  breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "SalaryTools India Blog",
    "description": "Articles on Indian salary, income tax, EPF, investments and personal finance",
    "url": absoluteUrl("/blog"),
    "publisher": {
      "@type": "Organization",
      "name": "SalaryTools India",
      "url": "https://salarytools.in",
    },
  }
);

// All articles — add new ones here

function categoryEmoji(category?: string): string {
  const map: Record<string, string> = {
    "Guide": "📖", "How-to": "🛠️", "Listicle": "📋", "News": "📰",
  };
  return map[category || ""] || "📝";
}

const TSX_ARTICLES = [
  {
    slug: "lpa-full-form",
    href: "/blog/lpa-full-form",
    title: "LPA Full Form — What Does LPA Mean in Salary?",
    description: "LPA full form is Lakh Per Annum — salary expressed in lakhs (₹1,00,000) per year. Learn what LPA means, how it differs from in-hand salary, and see LPA to monthly salary conversions.",
    date: "2026-07-01",
    readTime: "4 min read",
    category: "Guide",
    emoji: "💰",
    ogImage: undefined as string | undefined,
  },
];

const CATEGORIES = ["All", "Guide", "How-to", "Listicle", "News"];

export default function BlogPage() {
  // Load MDX articles dynamically from content/blog/
  const mdxPosts = getAllBlogPosts().map(post => ({
    slug: post.slug,
    href: `/blog/${post.slug}`,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    date: post.frontmatter.date,
    readTime: post.frontmatter.readTime || "5 min read",
    category: post.frontmatter.category || "Guide",
    emoji: categoryEmoji(post.frontmatter.category),
    ogImage: post.frontmatter.ogImage,
  }));

  // Merge MDX posts + TSX articles, sorted by date descending
  const ALL_ARTICLES = [...mdxPosts, ...TSX_ARTICLES]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    // Deduplicate by slug (MDX takes priority over TSX)
    .filter((article, index, self) =>
      index === self.findIndex(a => a.slug === article.slug)
    );

  const featured = ALL_ARTICLES[0];
  const rest = ALL_ARTICLES.slice(1);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Blog</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">Blog</h1>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">
          Articles, guides, and how-tos on Indian salary, income tax, EPF, and personal finance —
          written for salaried professionals.
        </p>
      </div>

      {/* Category filter — static display, future JS enhancement */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat, i) => (
          <span key={cat}
            className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${
              i === 0
                ? "bg-brand text-white border-brand"
                : "border-rule text-ink-soft hover:border-brand hover:text-brand cursor-pointer"
            }`}>
            {cat}
          </span>
        ))}
      </div>

      {/* Featured article */}
      {featured && (
        <Link href={featured.href}
          className="group mb-10 flex flex-col overflow-hidden rounded-2xl border border-rule bg-surface shadow-card hover:border-brand hover:-translate-y-0.5 transition sm:flex-row">
          {/* Featured image or emoji fallback */}
          {featured.ogImage ? (
            <div className="sm:w-72 sm:shrink-0 overflow-hidden">
              <img src={featured.ogImage} alt={featured.title}
                className="h-48 w-full object-contain sm:h-full bg-paper" />
            </div>
          ) : (
            <div className="flex items-center justify-center bg-gradient-to-br from-brand-soft to-paper sm:w-72 sm:shrink-0 p-10 sm:p-0">
              <span className="text-7xl">{featured.emoji}</span>
            </div>
          )}
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full bg-brand-soft px-3 py-0.5 text-xs font-semibold text-brand">
                {featured.category}
              </span>
              <span className="text-xs text-ink-soft">{formatBlogDate(featured.date)}</span>
              <span className="text-xs text-ink-soft">·</span>
              <span className="text-xs text-ink-soft">{featured.readTime}</span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-ink group-hover:text-brand transition">
              {featured.title}
            </h2>
            <p className="mt-2 text-ink-soft leading-relaxed">{featured.description}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
              Read article <span aria-hidden>→</span>
            </span>
          </div>
        </Link>
      )}

      {/* Article grid */}
      {rest.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map(article => (
            <Link key={article.href} href={article.href}
              className="group flex flex-col rounded-xl border border-rule bg-surface p-5 shadow-card hover:border-brand hover:-translate-y-0.5 transition">
              {article.ogImage ? (
                <img src={article.ogImage} alt={article.title}
                  className="w-full h-36 object-contain rounded-lg mb-3 border border-rule bg-paper" />
              ) : (
                <span className="text-3xl mb-3">{article.emoji}</span>
              )}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand">
                  {article.category}
                </span>
                <span className="text-xs text-ink-soft">{article.readTime}</span>
              </div>
              <h2 className="font-display text-lg font-semibold text-ink group-hover:text-brand transition">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-ink-soft line-clamp-3">{article.description}</p>
              <span className="mt-4 text-sm font-medium text-brand">Read →</span>
            </Link>
          ))}
        </div>
      )}

      {/* Empty state for future articles */}
      {ALL_ARTICLES.length === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-rule p-8 text-center text-ink-soft">
          <p className="text-lg">More articles coming soon.</p>
          <p className="mt-1 text-sm">We&apos;re working on guides for income tax, EPF withdrawal, HRA exemption, and more.</p>
        </div>
      )}

      {/* Topics */}
      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink mb-4">Browse by Topic</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Salary & CTC", icon: "💰", href: "/salary" },
            { label: "Income Tax", icon: "🧾", href: "/calculator/income-tax-calculator" },
            { label: "EPF & PF", icon: "🏦", href: "/calculator/epf-calculator" },
            { label: "Tax Saving", icon: "💡", href: "/tax-saving" },
            { label: "Investments", icon: "📈", href: "/calculator/sip-calculator" },
            { label: "Retirement", icon: "🏖️", href: "/calculator/fire-calculator" },
            { label: "Loans & EMI", icon: "🏠", href: "/calculator/emi-calculator" },
            { label: "All Calculators", icon: "🔢", href: "/calculator" },
          ].map(topic => (
            <Link key={topic.label} href={topic.href}
              className="flex items-center gap-3 rounded-xl border border-rule bg-surface px-4 py-3 hover:border-brand hover:-translate-y-0.5 transition shadow-card">
              <span className="text-xl">{topic.icon}</span>
              <span className="text-sm font-medium text-ink">{topic.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
