import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({ name: "siteName",        title: "Site Name",         type: "string" }),
    defineField({ name: "siteDescription", title: "Default Meta Description", type: "text", rows: 3 }),
    defineField({ name: "ogImage",         title: "Default OG Image URL",    type: "url"  }),
    defineField({ name: "heroHeadline",    title: "Homepage Hero Headline",  type: "string" }),
    defineField({ name: "heroSubtext",     title: "Homepage Hero Subtext",   type: "text", rows: 2 }),
    defineField({ name: "badgeText",       title: "Homepage Badge Text",     type: "string",
      description: 'e.g. "FY 2026-27 tax rules · Updated June 2026"' }),
  ],
  preview: { select: { title: "siteName" } },
});
