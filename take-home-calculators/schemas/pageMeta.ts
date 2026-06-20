import { defineType, defineField } from "sanity";

export const pageMeta = defineType({
  name: "pageMeta",
  title: "Page Meta",
  type: "document",
  fields: [
    defineField({
      name: "slug", title: "Page Slug",
      type: "slug",
      description: 'URL path without leading slash. e.g. "calculator/sip-calculator"',
      options: { source: "pageTitle" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "pageTitle",       title: "Page Title (H1)",           type: "string",
      validation: (r) => r.required() }),
    defineField({ name: "metaTitle",       title: "Meta Title (browser tab)",  type: "string",
      description: "Leave blank to use Page Title" }),
    defineField({ name: "metaDescription", title: "Meta Description",          type: "text", rows: 3,
      validation: (r) => r.max(165) }),
    defineField({ name: "introText",       title: "Intro Paragraph",           type: "text", rows: 4,
      description: "Text shown below the H1 on the page" }),
    defineField({ name: "ogImage",         title: "OG Image URL",              type: "url",
      description: "Leave blank to use site default" }),
    defineField({
      name: "faqs", title: "FAQs",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "question", title: "Question", type: "string" }),
          defineField({ name: "answer",   title: "Answer",   type: "text", rows: 4 }),
        ],
        preview: { select: { title: "question" } },
      }],
    }),
    defineField({
      name: "relatedLinks", title: "Related Links",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "label", title: "Label", type: "string" }),
          defineField({ name: "href",  title: "URL",   type: "string" }),
        ],
        preview: { select: { title: "label", subtitle: "href" } },
      }],
    }),
  ],
  preview: {
    select: { title: "pageTitle", subtitle: "slug.current" },
    prepare({ title, subtitle }) {
      return { title, subtitle: `/${subtitle}` };
    },
  },
  orderings: [{ title: "Slug", name: "slugAsc", by: [{ field: "slug.current", direction: "asc" }] }],
});
