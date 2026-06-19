// take-home-calculators/lib/guides-loader.ts
// Markdown-driven guides loader.
// Guides live in the /content/guides/ directory as .md files with frontmatter.
// If no markdown files exist yet, this returns empty arrays gracefully.

import fs from "fs";
import path from "path";

export interface GuideFrontmatter {
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
  metaImage?: string;
}

export interface Guide {
  slug: string;
  frontmatter: GuideFrontmatter;
  htmlContent: string;
}

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

function parseFrontmatter(raw: string): { frontmatter: GuideFrontmatter; body: string } {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    return {
      frontmatter: {
        title: "Untitled",
        description: "",
        date: new Date().toISOString().split("T")[0],
      },
      body: raw,
    };
  }

  const fmRaw = fmMatch[1];
  const body = fmMatch[2];

  const fm: Record<string, string | string[]> = {};
  for (const line of fmRaw.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (key === "tags") {
      fm[key] = value
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((t) => t.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      fm[key] = value;
    }
  }

  return {
    frontmatter: {
      title: String(fm.title || "Untitled"),
      description: String(fm.description || ""),
      date: String(fm.date || new Date().toISOString().split("T")[0]),
      author: fm.author ? String(fm.author) : undefined,
      tags: Array.isArray(fm.tags) ? fm.tags : undefined,
      metaImage: fm.metaImage ? String(fm.metaImage) : undefined,
    },
    body,
  };
}

// Very simple markdown → HTML converter (no external deps)
function markdownToHtml(md: string): string {
  let html = md
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Paragraphs (blank-line separated)
    .split(/\n\n+/)
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("<h") || block.startsWith("<li")) return block;
      if (block.startsWith("<ul") || block.startsWith("<ol")) return block;
      return `<p>${block.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");

  // Wrap consecutive <li> blocks in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  return html;
}

function guidesExist(): boolean {
  try {
    return fs.existsSync(GUIDES_DIR) && fs.statSync(GUIDES_DIR).isDirectory();
  } catch {
    return false;
  }
}

export function getAllGuideSlugs(): string[] {
  if (!guidesExist()) return [];
  try {
    return fs
      .readdirSync(GUIDES_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

export function getGuideBySlug(slug: string): Guide | null {
  if (!guidesExist()) return null;
  const filePath = path.join(GUIDES_DIR, `${slug}.md`);
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(raw);
    const htmlContent = markdownToHtml(body);
    return { slug, frontmatter, htmlContent };
  } catch {
    return null;
  }
}

export function getAllGuides(): Guide[] {
  return getAllGuideSlugs()
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is Guide => g !== null)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}
