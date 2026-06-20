import { defineType, defineField } from "sanity";

export const homepageSections = defineType({
  name: "homepageSections",
  title: "Homepage Sections",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "faqs", title: "Homepage FAQs",
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
      name: "whyCTCNote", title: "Why CTC ≠ In-Hand — body text",
      type: "text", rows: 5,
    }),
  ],
  preview: { prepare() { return { title: "Homepage Sections" }; } },
});
