/**
 * Blog article loader.
 * Articles live in /content/blog/ as .mdx files with frontmatter.
 *
 * Frontmatter fields:
 *   title:       string  (required) — <title> tag and H1
 *   description: string  (required) — meta description
 *   date:        string  (required) — YYYY-MM-DD published date
 *   lastUpdated: string  (optional) — YYYY-MM-DD, defaults to date
 *   author:      string  (optional) — defaults to "SalaryTools India"
 *   ogImage:     string  (optional) — path to og:image e.g. /images/blog/filename.png
 *   category:    string  (optional) — Guide | How-to | Listicle | News
 *   readTime:    string  (optional) — e.g. "5 min read"
 *   featured:    boolean (optional) — show prominently on /blog
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  lastUpdated?: string;
  author?: string;
  ogImage?: string;
  category?: string;
  readTime?: string;
  featured?: boolean;
  keywords?: string[];
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as BlogFrontmatter,
    content,
  };
}

export function getAllBlogPosts(): BlogPost[] {
  return getAllBlogSlugs()
    .map((slug) => getBlogPost(slug))
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
}

export function formatBlogDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
