import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogSlugs, getBlogPost, formatBlogDate } from "@/lib/blog-loader";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, buildJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const { frontmatter: fm } = post;
  return {
    title: fm.title,
    description: fm.description,
    keywords: fm.keywords,
    alternates: { canonical: absoluteUrl(`/blog/${slug}`) },
    openGraph: {
      title: fm.title,
      description: fm.description,
      url: absoluteUrl(`/blog/${slug}`),
      type: "article",
      publishedTime: fm.date,
      modifiedTime: fm.lastUpdated || fm.date,
      authors: [fm.author || "SalaryTools India"],
      ...(fm.ogImage ? { images: [{ url: absoluteUrl(fm.ogImage), width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const { frontmatter: fm } = post;

  // Dynamically import the MDX file
  let MDXContent: React.ComponentType;
  try {
    const mod = await import(`../../../content/blog/${slug}.mdx`);
    MDXContent = mod.default;
  } catch {
    notFound();
  }

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Blog", href: "/blog" },
      { name: fm.title, href: `/blog/${slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": fm.title,
      "description": fm.description,
      "url": absoluteUrl(`/blog/${slug}`),
      "datePublished": fm.date,
      "dateModified": fm.lastUpdated || fm.date,
      "author": {
        "@type": "Person",
        "name": fm.author || "SalaryTools India",
      },
      "publisher": {
        "@type": "Organization",
        "name": "SalaryTools India",
        "url": "https://salarytools.in",
        "logo": {
          "@type": "ImageObject",
          "url": absoluteUrl("/icon-192x192.png"),
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": absoluteUrl(`/blog/${slug}`),
      },
      ...(fm.ogImage ? {
        "image": {
          "@type": "ImageObject",
          "url": absoluteUrl(fm.ogImage),
          "width": 1200,
          "height": 630,
        },
      } : {}),
    },
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/blog" className="hover:text-brand">Blog</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{fm.title}</span>
      </nav>

      {/* Article meta */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
        {fm.category && (
          <span className="rounded-full bg-brand-soft px-3 py-0.5 font-semibold text-brand">
            {fm.category}
          </span>
        )}
        <span>{formatBlogDate(fm.date)}</span>
        {fm.readTime && <><span>·</span><span>{fm.readTime}</span></>}
        {fm.author && <><span>·</span><span>By {fm.author}</span></>}
      </div>

      {/* Title & description from frontmatter */}
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
        {fm.title}
      </h1>
      {fm.description && (
        <p className="mt-4 text-lg text-ink-soft leading-relaxed">
          {fm.description}
        </p>
      )}

      {/* OG Image — below title & description */}
      {fm.ogImage && (
        <img src={fm.ogImage} alt={fm.title}
          className="mt-8 w-full rounded-2xl border border-rule object-contain bg-paper" />
      )}

      {/* MDX content */}
      <article className="mt-8 prose-article">
        <MDXContent />
      </article>

      {/* Author bio */}
      <div className="mt-12 rounded-2xl border border-rule bg-surface p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-soft text-2xl font-display font-bold text-brand">
            {(fm.author || "S").charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <p className="font-semibold text-ink">{fm.author || "SalaryTools India"}</p>
              <a href="https://x.com/penugondaz" target="_blank" rel="noopener noreferrer"
                className="text-ink-soft hover:text-ink transition"
                aria-label="X (Twitter)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
            <p className="mt-0.5 text-xs text-ink-soft">Co-founder, SalaryTools India</p>
            {/* Bio text — add when ready */}
          </div>
        </div>
      </div>

      {/* Back to blog */}
      <div className="mt-6 pt-6 border-t border-rule">
        <Link href="/blog" className="text-sm font-medium text-brand hover:underline">
          ← Back to Blog
        </Link>
      </div>
    </main>
  );
}
