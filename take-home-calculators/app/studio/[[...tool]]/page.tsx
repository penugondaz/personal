/**
 * Sanity Studio embedded at /studio
 * Access at: https://salarytools.in/studio  (or GitHub Pages URL/studio)
 *
 * This is a client-only route — it does NOT export metadata.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
