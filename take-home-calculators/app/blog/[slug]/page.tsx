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
    const mod = await import(`@/content/blog/${slug}.mdx`);
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

      {/* OG Image */}
      {fm.ogImage && (
        <img src={fm.ogImage} alt={fm.title}
          className="w-full rounded-2xl border border-rule mb-8 object-cover" />
      )}

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

      {/* MDX content */}
      <article className="prose-article">
        <MDXContent />
      </article>

      {/* Back to blog */}
      <div className="mt-12 pt-6 border-t border-rule">
        <Link href="/blog" className="text-sm font-medium text-brand hover:underline">
          ← Back to Blog
        </Link>
      </div>
    </main>
  );
}
