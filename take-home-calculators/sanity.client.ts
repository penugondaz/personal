import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: "c5v8ecsd",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function getPageMeta(slug: string) {
  return sanityClient.fetch(
    `*[_type == "pageMeta" && slug.current == $slug][0]`,
    { slug }
  );
}

export async function getSiteSettings() {
  return sanityClient.fetch(`*[_type == "siteSettings"][0]`);
}
