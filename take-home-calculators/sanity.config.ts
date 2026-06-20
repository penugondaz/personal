import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool }    from "@sanity/vision";
import { schemaTypes }   from "./schemas";

export default defineConfig({
  name:    "salarytools",
  title:   "SalaryTools CMS",
  projectId: "c5v8ecsd",
  dataset:   "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem().title("Site Settings").child(
              S.document().schemaType("siteSettings").documentId("siteSettings")
            ),
            S.listItem().title("Homepage Sections").child(
              S.document().schemaType("homepageSections").documentId("homepageSections")
            ),
            S.divider(),
            S.listItem().title("All Pages (Meta & FAQs)").child(
              S.documentTypeList("pageMeta").title("Pages")
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: { types: schemaTypes },
});
