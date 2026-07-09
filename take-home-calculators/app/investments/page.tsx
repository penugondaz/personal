import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, webPageSchema, buildJsonLd } from "@/lib/schema";

const URL = "/investments";
const TITLE = "Investment Calculators — SIP, Lumpsum, SWP, Goal Planning";
const DESCRIPTION =
  "Free investment calculators for India — SIP, step-up SIP, lumpsum, SWP with inflation, and goal planning. Project mutual fund returns and plan your investments.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
};

const CALCULATORS = [
  {
    href: "/calculator/sip-calculator",
    icon: "📈",
    title: "SIP Calculator",
    desc: "Project mutual fund SIP returns with monthly contributions and expected growth rate.",
  },
  {
    href: "/calculator/step-up-sip-calculator",
    icon: "🪜",
    title: "Step-Up SIP Calculator",
    desc: "SIP returns when you increase your contribution every year.",
  },
  {
    href: "/calculator/lumpsum-calculator",
    icon: "💵",
    title: "Lumpsum Calculator",
    desc: "One-time mutual fund investment growth over your chosen time horizon.",
  },
  {
    href: "/calculator/swp-inflation-calculator",
    icon: "📉",
    title: "SWP with Inflation",
    desc: "Systematic withdrawal plan payouts adjusted for inflation, and how long your corpus lasts.",
  },
  {
    href: "/calculator/goal-planning-calculator",
    icon: "🎯",
    title: "Goal Planning Calculator",
    desc: "How much to invest monthly to hit a specific financial goal by a target date.",
  },
];

export default function InvestmentsLandingPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Investments", href: URL },
    ]),
    webPageSchema({ name: TITLE, description: DESCRIPTION, url: URL })
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Investments</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Investment Calculators</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Plan and project your mutual fund and market-linked investments — SIP, lumpsum,
        systematic withdrawals, and goal-based investing.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {CALCULATORS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex items-start gap-4 rounded-xl border border-rule bg-surface px-5 py-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg"
          >
            <span className="text-2xl">{c.icon}</span>
            <div>
              <p className="font-medium text-brand">{c.title}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
