import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "c5v8ecsd",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Fetch meta for any page by slug
export async function getPageMeta(slug: string) {
  try {
    return await sanityClient.fetch(
      `*[_type == "pageMeta" && slug.current == $slug][0]`,
      { slug }
    );
  } catch {
    return null;
  }
}

// Fetch global site settings
export async function getSiteSettings() {
  try {
    return await sanityClient.fetch(`*[_type == "siteSettings"][0]`);
  } catch {
    return null;
  }
}

// Fetch homepage sections (FAQs etc.)
export async function getHomepageSections() {
  try {
    return await sanityClient.fetch(`*[_type == "homepageSections"][0]`);
  } catch {
    return null;
  }
}
