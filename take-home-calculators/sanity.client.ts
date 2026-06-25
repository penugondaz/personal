import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "c5v8ecsd",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// In-memory cache — deduplicates Sanity fetches across all 300+ static pages
// Without this, each page makes a separate network call = very slow builds
const buildCache = new Map<string, any>();

async function cachedFetch(key: string, query: string, params?: Record<string, unknown>): Promise<any> {
  if (buildCache.has(key)) return buildCache.get(key);
  try {
    const result = await sanityClient.fetch(query, params ?? {});
    buildCache.set(key, result);
    return result;
  } catch {
    buildCache.set(key, null);
    return null;
  }
}

export async function getPageMeta(slug: string) {
  return cachedFetch(
    `pageMeta:${slug}`,
    `*[_type == "pageMeta" && slug.current == $slug][0]`,
    { slug }
  );
}

export async function getSiteSettings() {
  return cachedFetch("siteSettings", `*[_type == "siteSettings"][0]`);
}

export async function getHomepageSections() {
  return cachedFetch("homepageSections", `*[_type == "homepageSections"][0]`);
}
