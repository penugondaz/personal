import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

export default defineConfig({
  name: "salarytools",
  title: "SalaryTools CMS",

  projectId: "c5v8ecsd",
  dataset: "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.listItem()
              .title("Homepage")
              .child(
                S.document()
                  .schemaType("homepageSections")
                  .documentId("homepageSections")
              ),
            S.divider(),
            S.documentTypeListItem("pageMeta").title("All Pages"),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: [
      // ── Site Settings ──────────────────────────────────────────────────────
      {
        name: "siteSettings",
        title: "Site Settings",
        type: "document",
        fields: [
          { name: "siteName",        title: "Site Name",              type: "string" },
          { name: "siteDescription", title: "Default Meta Description", type: "text"   },
          { name: "ogImage",         title: "Default OG Image URL",   type: "url"    },
          { name: "heroHeadline",    title: "Homepage Hero Headline", type: "string" },
          { name: "heroSubtext",     title: "Homepage Hero Subtext",  type: "text"   },
          { name: "badgeText",       title: "Homepage Badge Text",    type: "string",
            description: 'e.g. "FY 2026-27 tax rules · Updated June 2026"' },
        ],
      },

      // ── Homepage Sections ──────────────────────────────────────────────────
      {
        name: "homepageSections",
        title: "Homepage Sections",
        type: "document",
        fields: [
          {
            name: "faqs", title: "Homepage FAQs", type: "array",
            of: [{
              type: "object",
              fields: [
                { name: "question", title: "Question", type: "string" },
                { name: "answer",   title: "Answer",   type: "text"   },
              ],
              preview: { select: { title: "question" } },
            }],
          },
          { name: "whyCTCNote", title: "Why CTC ≠ In-Hand text", type: "text" },
        ],
      },

      // ── Page Meta (every calculator / tool page) ───────────────────────────
      {
        name: "pageMeta",
        title: "Page",
        type: "document",
        fields: [
          {
            name: "slug", title: "Page URL slug", type: "slug",
            description: 'e.g. "calculator/sip-calculator" or "tools/word-counter"',
            options: { source: "pageTitle" },
            validation: (R: any) => R.required(),
          },
          { name: "pageTitle",       title: "Page Heading (H1)",       type: "string",
            validation: (R: any) => R.required() },
          { name: "metaTitle",       title: "Meta Title (browser tab)", type: "string",
            description: "Leave blank to use the H1" },
          { name: "metaDescription", title: "Meta Description",         type: "text",
            validation: (R: any) => R.max(165) },
          { name: "introText",       title: "Intro Paragraph",          type: "text",
            description: "Text shown below the H1" },
          {
            name: "faqs", title: "FAQs", type: "array",
            of: [{
              type: "object",
              fields: [
                { name: "question", title: "Question", type: "string" },
                { name: "answer",   title: "Answer",   type: "text"   },
              ],
              preview: { select: { title: "question" } },
            }],
          },
          {
            name: "relatedLinks", title: "Related Links", type: "array",
            of: [{
              type: "object",
              fields: [
                { name: "label", title: "Label", type: "string" },
                { name: "href",  title: "URL",   type: "string" },
              ],
              preview: { select: { title: "label", subtitle: "href" } },
            }],
          },
        ],
        preview: {
          select: { title: "pageTitle", subtitle: "slug.current" },
          prepare: ({ title, subtitle }: any) => ({ title, subtitle: `/${subtitle}` }),
        },
      },
    ],
  },
});
