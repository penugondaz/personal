import Link from "next/link";

/**
 * Patterns to follow in every future page:
 *
 *  - Internal links: use next/link with a ROOT-RELATIVE href ("/salary/...").
 *    Next.js automatically prepends `basePath` for you — do NOT manually
 *    prepend it here, or links will break in local dev (where basePath is "").
 *
 *  - Images served from /public: use next/image (or <img>) with a
 *    ROOT-RELATIVE src and let `images.unoptimized` + Next's automatic
 *    basePath handling deal with the prefix. next/image adds basePath
 *    automatically; a raw <img> does NOT — wrap those with withBasePath()
 *    from "@/lib/paths" if you ever reach for a plain <img> tag.
 *
 *  - Canonical / absolute URLs (metadata, JSON-LD, sitemap): use
 *    absoluteUrl() from "@/lib/paths", never string-concatenate by hand.
 */
export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
        Take Home Calculators
      </h1>
      <p className="max-w-xl text-base text-gray-600">
        Salary, CTC, income tax, EPF, PPF, gratuity, and payroll calculators
        for India. Project scaffolding is live — calculators ship next.
      </p>
      <Link
        href="/salary"
        className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
      >
        Browse salary calculators
      </Link>
    </main>
  );
}
