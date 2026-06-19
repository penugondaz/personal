// take-home-calculators/app/layoffs/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface LayoffRecord {
  id: number;
  company: string;
  location: string;
  country: string;
  laid_off: number | null;
  date: string;
  percent: number | null;
  industry: string;
  source: string;
  stage: string;
  raised_m: number | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Replace with your published Google Sheets CSV URL:
// File → Share → Publish to web → CSV
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsQQlL0piel4Y4xlwSLysGe7VnBShO7SBgia0BXbrh09PdoGa08EOxSq6dTVXtCgvjEKUyRQVIa4yd/pub?gid=0&single=true&output=csv";

const INDUSTRY_COLORS: Record<string, string> = {
  Finance:      "bg-blue-100 text-blue-800",
  Media:        "bg-purple-100 text-purple-800",
  Transport:    "bg-orange-100 text-orange-800",
  Support:      "bg-teal-100 text-teal-800",
  "Real Estate":"bg-yellow-100 text-yellow-800",
  Food:         "bg-green-100 text-green-800",
  Sales:        "bg-pink-100 text-pink-800",
  Tech:         "bg-indigo-100 text-indigo-800",
  Healthcare:   "bg-red-100 text-red-800",
  Education:    "bg-cyan-100 text-cyan-800",
  Retail:       "bg-amber-100 text-amber-800",
  HR:           "bg-violet-100 text-violet-800",
};

const STAGE_COLORS: Record<string, string> = {
  "Post-IPO":  "bg-brand-soft text-brand",
  "Series A":  "bg-blue-50 text-blue-700",
  "Series B":  "bg-blue-100 text-blue-800",
  "Series C":  "bg-blue-200 text-blue-900",
  "Series D":  "bg-indigo-100 text-indigo-800",
  "Private":   "bg-paper text-ink-soft",
  "Unknown":   "bg-paper text-ink-soft",
};

function industryColor(ind: string) {
  for (const [key, cls] of Object.entries(INDUSTRY_COLORS)) {
    if (ind.toLowerCase().includes(key.toLowerCase())) return cls;
  }
  return "bg-paper text-ink-soft";
}

function stageColor(stage: string) {
  for (const [key, cls] of Object.entries(STAGE_COLORS)) {
    if (stage.toLowerCase().includes(key.toLowerCase())) return cls;
  }
  return "bg-paper text-ink-soft";
}

// ─── CSV parser ───────────────────────────────────────────────────────────────

function parseCsv(csv: string): LayoffRecord[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];
  // Expected columns (0-indexed):
  // 0:company 1:location 2:country 3:laid_off 4:date 5:percent 6:industry
  // 7:source 8:stage 9:raised_m
  return lines.slice(1).map((line, i) => {
    // Handle quoted fields with commas
    const cols: string[] = [];
    let cur = "";
    let inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === "," && !inQ) { cols.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    cols.push(cur.trim());

    return {
      id: i + 1,
      company:   cols[0] ?? "",
      location:  cols[1] ?? "",
      country:   cols[2] ?? "",
      laid_off:  cols[3] ? parseInt(cols[3].replace(/,/g, ""), 10) || null : null,
      date:      cols[4] ?? "",
      percent:   cols[5] ? parseFloat(cols[5]) || null : null,
      industry:  cols[6] ?? "",
      source:    cols[7] ?? "",
      stage:     cols[8] ?? "",
      raised_m:  cols[9] ? parseFloat(cols[9].replace(/[$,]/g, "")) || null : null,
    };
  }).filter(r => r.company);
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-rule bg-surface px-5 py-4 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="tabular mt-1 font-display text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-soft">{sub}</p>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LayoffsPage() {
  const [records, setRecords]   = useState<LayoffRecord[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [filterCountry, setFilterCountry] = useState("All");
  const [filterIndustry, setFilterIndustry] = useState("All");
  const [sortKey, setSortKey]   = useState<"date" | "laid_off" | "percent">("date");
  const [sortDir, setSortDir]   = useState<"asc" | "desc">("desc");
  const [page, setPage]         = useState(1);
  const PER_PAGE = 50;

  // Fetch on mount
  useEffect(() => {
    fetch(SHEET_CSV_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((csv) => {
        setRecords(parseCsv(csv));
        setLoading(false);
      })
      .catch((e) => {
        setError("Could not load data. Please try again shortly.");
        setLoading(false);
        console.error(e);
      });
  }, []);

  // Derived filter options
  const countries  = useMemo(() => ["All", ...Array.from(new Set(records.map(r => r.country).filter(Boolean))).sort()], [records]);
  const industries = useMemo(() => ["All", ...Array.from(new Set(records.map(r => r.industry).filter(Boolean))).sort()], [records]);

  // Filtered + sorted records
  const filtered = useMemo(() => {
    let out = records.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.company.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) || r.industry.toLowerCase().includes(q);
      const matchCountry = filterCountry === "All" || r.country === filterCountry;
      const matchIndustry = filterIndustry === "All" || r.industry === filterIndustry;
      return matchSearch && matchCountry && matchIndustry;
    });
    out = [...out].sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === "date") {
        va = new Date(a.date).getTime(); vb = new Date(b.date).getTime();
      } else if (sortKey === "laid_off") {
        va = a.laid_off ?? -1; vb = b.laid_off ?? -1;
      } else {
        va = a.percent ?? -1; vb = b.percent ?? -1;
      }
      return sortDir === "desc" ? vb - va : va - vb;
    });
    return out;
  }, [records, search, filterCountry, filterIndustry, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageRecords = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Summary stats
  const totalLaidOff = records.reduce((s, r) => s + (r.laid_off ?? 0), 0);
  const indiaLaidOff = records.filter(r => r.country?.toLowerCase() === "india").reduce((s, r) => s + (r.laid_off ?? 0), 0);
  const thisYear = new Date().getFullYear();
  const thisYearCount = records.filter(r => r.date?.includes(String(thisYear))).length;

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  }

  function SortIcon({ col }: { col: typeof sortKey }) {
    if (sortKey !== col) return <span className="ml-1 text-ink-soft opacity-40">↕</span>;
    return <span className="ml-1 text-brand">{sortDir === "desc" ? "↓" : "↑"}</span>;
  }

  const lastUpdated = records[0]?.date ?? "";

  return (
    <>
      {/* ── SEO / structured data injected server-side via layout or metadata ── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-1.5">/</span>
          <span aria-current="page">Layoffs Tracker</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-deduction/10 px-3 py-1 text-xs font-semibold text-deduction">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-deduction opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-deduction"></span>
              </span>
              Live
            </span>
            {lastUpdated && (
              <span className="text-xs text-ink-soft">Last entry: {lastUpdated}</span>
            )}
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            India Tech Layoffs Tracker
          </h1>
          <p className="mt-3 max-w-2xl text-base text-ink-soft">
            Real-time tracking of tech and IT company layoffs in India and globally.
            Updated as news breaks — company, headcount, date, industry, and source.
          </p>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Total laid off (tracked)"
              value={totalLaidOff.toLocaleString("en-IN")}
              sub="across all companies"
            />
            <StatCard
              label={`Events in ${thisYear}`}
              value={thisYearCount.toLocaleString("en-IN")}
              sub="layoff announcements"
            />
            <StatCard
              label="India layoffs"
              value={indiaLaidOff > 0 ? indiaLaidOff.toLocaleString("en-IN") : "—"}
              sub="jobs affected"
            />
            <StatCard
              label="Companies tracked"
              value={records.length.toLocaleString("en-IN")}
              sub="in this dataset"
            />
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-soft">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search company, location, industry…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-rule bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
            />
          </div>

          {/* Country filter */}
          <select
            value={filterCountry}
            onChange={(e) => { setFilterCountry(e.target.value); setPage(1); }}
            className="rounded-lg border border-rule bg-surface px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
          >
            {countries.map(c => <option key={c}>{c}</option>)}
          </select>

          {/* Industry filter */}
          <select
            value={filterIndustry}
            onChange={(e) => { setFilterIndustry(e.target.value); setPage(1); }}
            className="rounded-lg border border-rule bg-surface px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
          >
            {industries.map(i => <option key={i}>{i}</option>)}
          </select>

          {/* Result count */}
          {!loading && (
            <span className="self-center text-xs text-ink-soft">
              {filtered.length.toLocaleString("en-IN")} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-rule bg-surface shadow-card overflow-hidden">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-rule border-t-brand" />
              <p className="text-sm text-ink-soft">Loading layoff data…</p>
            </div>
          )}

          {error && (
            <div className="py-16 text-center">
              <p className="text-sm text-deduction">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg border border-rule px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            /* Horizontal scroll on mobile */
            <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
              <table className="w-full text-sm" style={{ minWidth: 780 }}>
                <thead>
                  <tr className="border-b border-rule bg-paper text-left">
                    <th className="w-8 px-4 py-3 font-medium text-ink-soft">#</th>
                    <th className="px-4 py-3 font-medium text-ink-soft">Company</th>
                    <th className="px-4 py-3 font-medium text-ink-soft">Location</th>
                    <th
                      className="px-4 py-3 font-medium text-ink-soft cursor-pointer select-none hover:text-brand whitespace-nowrap"
                      onClick={() => toggleSort("laid_off")}
                    >
                      # Laid Off <SortIcon col="laid_off" />
                    </th>
                    <th
                      className="px-4 py-3 font-medium text-ink-soft cursor-pointer select-none hover:text-brand whitespace-nowrap"
                      onClick={() => toggleSort("date")}
                    >
                      Date <SortIcon col="date" />
                    </th>
                    <th
                      className="px-4 py-3 font-medium text-ink-soft cursor-pointer select-none hover:text-brand"
                      onClick={() => toggleSort("percent")}
                    >
                      % <SortIcon col="percent" />
                    </th>
                    <th className="px-4 py-3 font-medium text-ink-soft">Industry</th>
                    <th className="px-4 py-3 font-medium text-ink-soft">Stage</th>
                    <th className="px-4 py-3 font-medium text-ink-soft whitespace-nowrap">$ Raised</th>
                    <th className="px-4 py-3 font-medium text-ink-soft">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRecords.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center text-ink-soft">
                        No results match your filters.
                      </td>
                    </tr>
                  )}
                  {pageRecords.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-b border-rule last:border-0 transition-colors hover:bg-paper"
                    >
                      {/* Row number */}
                      <td className="px-4 py-3 tabular text-xs text-ink-soft">
                        {(page - 1) * PER_PAGE + i + 1}
                      </td>

                      {/* Company */}
                      <td className="px-4 py-3">
                        <span className="font-medium text-ink">{r.company}</span>
                        {r.country && r.country.toLowerCase() === "india" && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-700">🇮🇳 India</span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3 text-ink-soft whitespace-nowrap">
                        {r.location || "—"}
                      </td>

                      {/* # Laid off */}
                      <td className="px-4 py-3 tabular font-medium text-ink">
                        {r.laid_off != null ? r.laid_off.toLocaleString("en-IN") : "—"}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 tabular text-ink-soft whitespace-nowrap">
                        {r.date || "—"}
                      </td>

                      {/* % */}
                      <td className="px-4 py-3 tabular text-ink-soft">
                        {r.percent != null ? `${r.percent}%` : "—"}
                      </td>

                      {/* Industry badge */}
                      <td className="px-4 py-3">
                        {r.industry ? (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${industryColor(r.industry)}`}>
                            {r.industry}
                          </span>
                        ) : "—"}
                      </td>

                      {/* Stage badge */}
                      <td className="px-4 py-3">
                        {r.stage ? (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stageColor(r.stage)}`}>
                            {r.stage}
                          </span>
                        ) : "—"}
                      </td>

                      {/* $ Raised */}
                      <td className="px-4 py-3 tabular text-ink-soft whitespace-nowrap">
                        {r.raised_m != null ? `$${r.raised_m.toLocaleString("en-IN")}M` : "—"}
                      </td>

                      {/* Source link */}
                      <td className="px-4 py-3 max-w-[180px]">
                        {r.source ? (
                          <a
                            href={r.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-brand hover:underline underline-offset-2 text-xs"
                            title={r.source}
                          >
                            {(() => {
                              try { return new URL(r.source).hostname.replace("www.", ""); }
                              catch { return r.source.slice(0, 30); }
                            })()}
                          </a>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <p className="text-ink-soft">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length.toLocaleString("en-IN")}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-rule px-3 py-1.5 font-medium text-ink disabled:opacity-40 hover:border-brand hover:text-brand disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page - 2 + i;
                if (p < 1 || p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded-lg border px-3 py-1.5 font-medium ${p === page ? "border-brand bg-brand text-white" : "border-rule text-ink hover:border-brand hover:text-brand"}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-rule px-3 py-1.5 font-medium text-ink disabled:opacity-40 hover:border-brand hover:text-brand disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* SEO content */}
        <section className="mt-16 border-t border-rule pt-10">
          <h2 className="font-display text-2xl text-ink">About This Layoffs Tracker</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-ink-soft">
                This tracker aggregates tech and IT company layoffs in India and globally, updated
                continuously as announcements are made. Each entry includes the company name,
                affected headcount, date, industry, funding stage, and a direct link to the
                source news article.
              </p>
              <p className="mt-3 text-ink-soft">
                Layoffs in India's IT sector have been particularly significant, with major
                employers in Bengaluru, Hyderabad, Pune, and the NCR region reducing headcount
                across software engineering, support, and operations roles.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-ink">How to use this tracker</h3>
              <ul className="mt-2 space-y-2 text-sm text-ink-soft">
                <li>• <strong className="text-ink">Search</strong> by company name, city, or sector</li>
                <li>• <strong className="text-ink">Filter</strong> by country to see India-only layoffs</li>
                <li>• <strong className="text-ink">Filter by industry</strong> — Finance, Tech, Media, etc.</li>
                <li>• <strong className="text-ink">Sort</strong> by date, headcount, or percentage</li>
                <li>• Click any source link to read the original news report</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ — structured for AI/GEO */}
        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
          <div className="mt-4 space-y-5">
            {[
              {
                q: "Which Indian IT companies have laid off employees in 2026–27?",
                a: "Several major IT and tech companies with India operations have announced layoffs in recent months, including companies in Bengaluru, Hyderabad, and Pune. This tracker covers both Indian-headquartered companies and global firms with significant Indian workforces. Filter by country = India to see the full list.",
              },
              {
                q: "How many tech jobs have been lost in India due to layoffs?",
                a: `Based on the data tracked here, ${indiaLaidOff > 0 ? indiaLaidOff.toLocaleString("en-IN") + " jobs" : "thousands of roles"} have been affected in India. The actual number is higher as many layoffs go unreported or are announced without specific headcount figures.`,
              },
              {
                q: "Why are so many tech companies laying off employees?",
                a: "The wave of tech layoffs since 2022 is primarily driven by: over-hiring during the pandemic-era boom, rising interest rates increasing the cost of capital (especially for VC-backed companies), a shift from growth-at-all-costs to profitability, automation and AI replacing some roles, and post-merger restructuring.",
              },
              {
                q: "How is this layoff data collected?",
                a: "Data is sourced from public news reports, company announcements, SEC filings, and verified industry databases. Each entry includes a direct source link so you can verify the information independently.",
              },
              {
                q: "How often is this tracker updated?",
                a: "The tracker is updated as new layoff announcements are reported. The data is pulled live from our source sheet, so new entries appear as soon as they are added.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-rule pb-4">
                <h3 className="font-medium text-ink">{faq.q}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related links */}
        <section className="mt-12">
          <h2 className="font-display text-xl text-ink">Related Tools</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { href: "/salary", label: "In-Hand Salary Calculator" },
              { href: "/tax-saving", label: "Tax Saving Guide" },
              { href: "/salary-growth", label: "Salary Growth Projection" },
              { href: "/calculator/epf-calculator", label: "EPF Calculator" },
              { href: "/calculator/salary-hike-calculator", label: "Salary Hike Calculator" },
              { href: "/calculator/goal-planning-calculator", label: "Goal Planning Calculator" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
