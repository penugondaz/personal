import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllGuideSlugs, getGuideBySlug, getAllGuides } from "@/lib/guides-loader";
import { absoluteUrl } from "@/lib/paths";

// Hard-coded custom pages that live at their own path (not markdown-driven)
const CUSTOM_GUIDE_SLUGS = ["lpa-full-form"];

export function generateStaticParams() {
  return getAllGuideSlugs()
    .filter((slug) => !CUSTOM_GUIDE_SLUGS.includes(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  const { title, description, metaImage } = guide.frontmatter;
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/guides/${slug}`) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/guides/${slug}`),
      ...(metaImage ? { images: [{ url: metaImage }] } : {}),
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Don't render custom pages through this route
  if (CUSTOM_GUIDE_SLUGS.includes(slug)) notFound();

  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const { frontmatter, htmlContent } = guide;
  const allGuides = getAllGuides().filter((g) => g.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    ...(frontmatter.author ? { author: { "@type": "Person", name: frontmatter.author } } : {}),
    ...(frontmatter.metaImage ? { image: frontmatter.metaImage } : {}),
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/guides" className="hover:text-brand">Guides</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{frontmatter.title}</span>
      </nav>

      {frontmatter.metaImage && (
        <img
          src={frontmatter.metaImage}
          alt={frontmatter.title}
          className="mb-8 w-full rounded-xl border border-rule object-cover"
          style={{ maxHeight: 360 }}
        />
      )}

      <h1 className="font-display text-3xl text-ink sm:text-4xl">{frontmatter.title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
        <time dateTime={frontmatter.date}>
          {new Date(frontmatter.date + "T00:00:00").toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
        {frontmatter.author && (
          <>
            <span>·</span>
            <span>{frontmatter.author}</span>
          </>
        )}
        {frontmatter.tags?.length ? (
          <>
            <span>·</span>
            <div className="flex gap-1.5">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Article body — rendered from Markdown */}
      <article
        className="guide-article mt-10"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Related guides */}
      {allGuides.length > 0 && (
        <section className="mt-14 border-t border-rule pt-8">
          <h2 className="font-display text-xl text-ink">More Guides</h2>
          <ul className="mt-4 space-y-3">
            {allGuides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="block rounded-lg border border-rule bg-surface px-5 py-4 hover:border-brand"
                >
                  <span className="font-medium text-brand">{g.frontmatter.title}</span>
                  <p className="mt-1 text-sm text-ink-soft">{g.frontmatter.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
