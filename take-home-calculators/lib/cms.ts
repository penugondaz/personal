/**
 * CMS helpers — fetch page content from Sanity with hardcoded fallbacks.
 * Every function returns the Sanity value if set, otherwise the default.
 * This means pages always work even if Sanity is empty.
 */

import { getPageMeta } from "@/sanity.client";

export interface CmsPageContent {
  pageTitle:       string;
  metaTitle:       string;
  metaDescription: string;
  introText:       string;
  faqs:            { question: string; answer: string }[];
  relatedLinks:    { label: string; href: string }[];
}

/**
 * Fetch CMS content for a page by its slug.
 * Falls back to provided defaults if Sanity has no entry for this slug.
 */
export async function getCmsPage(
  slug: string,
  defaults: Partial<CmsPageContent>
): Promise<CmsPageContent> {
  let cms: Record<string, any> | null = null;
  try {
    cms = await getPageMeta(slug);
  } catch {
    // Sanity unreachable — use defaults silently
  }

  return {
    pageTitle:       cms?.pageTitle       ?? defaults.pageTitle       ?? "",
    metaTitle:       cms?.metaTitle       ?? defaults.metaTitle       ?? defaults.pageTitle ?? "",
    metaDescription: cms?.metaDescription ?? defaults.metaDescription ?? "",
    introText:       cms?.introText       ?? defaults.introText       ?? "",
    faqs:            (cms?.faqs?.length   ?? 0) > 0 ? cms!.faqs : (defaults.faqs ?? []),
    relatedLinks:    (cms?.relatedLinks?.length ?? 0) > 0 ? cms!.relatedLinks : (defaults.relatedLinks ?? []),
  };
}
