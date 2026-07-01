import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// This file is required for Next.js MDX support.
// It defines how MDX elements are rendered — so tables, images,
// headings etc. all get your site's styling automatically.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children }) => (
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl mt-8 mb-4 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-2xl font-semibold text-ink mt-10 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl font-semibold text-ink mt-8 mb-2">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-semibold text-ink mt-6 mb-2">{children}</h4>
    ),

    // Paragraph
    p: ({ children }) => (
      <p className="text-ink-soft leading-relaxed mb-4">{children}</p>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="list-disc pl-5 space-y-1.5 text-ink-soft mb-4">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-1.5 text-ink-soft mb-4">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,

    // Links
    a: ({ href, children }) => {
      const isInternal = href?.startsWith("/");
      if (isInternal) {
        return (
          <Link href={href!} className="text-brand hover:underline font-medium">
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="text-brand hover:underline font-medium">
          {children}
        </a>
      );
    },

    // Bold & italic
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-ink-soft">{children}</em>,

    // Code
    code: ({ children }) => (
      <code className="rounded bg-paper border border-rule px-1.5 py-0.5 text-sm font-mono text-ink">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="rounded-xl border border-rule bg-paper p-4 overflow-x-auto text-sm font-mono text-ink mb-4">
        {children}
      </pre>
    ),

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand pl-4 italic text-ink-soft my-4">
        {children}
      </blockquote>
    ),

    // Horizontal rule
    hr: () => <hr className="border-rule my-8" />,

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border border-rule rounded-lg overflow-hidden">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-paper border-b border-rule">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-rule last:border-0 hover:bg-paper">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2.5 text-left font-medium text-ink-soft">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2.5 text-ink-soft">{children}</td>
    ),

    // Images
    img: ({ src, alt }) => (
      <figure className="my-6">
        <img
          src={src}
          alt={alt || ""}
          className="w-full rounded-xl border border-rule"
        />
        {alt && (
          <figcaption className="mt-2 text-center text-xs text-ink-soft">
            {alt}
          </figcaption>
        )}
      </figure>
    ),

    // Pass through any custom components
    ...components,
  };
}
