import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, webPageSchema, buildJsonLd } from "@/lib/schema";

const URL = "/retirement";
const TITLE = "Retirement & Savings Calculators — EPF, PPF, NPS, Gratuity, NSC";
const DESCRIPTION =
  "Free retirement and savings calculators for India — EPF & VPF, PPF, NPS, gratuity, and NSC. Project your retirement corpus and statutory savings accurately.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
};

const CALCULATORS = [
  {
    href: "/calculator/epf-calculator",
    icon: "🏦",
    title: "EPF & VPF Calculator",
    desc: "Project your Employee Provident Fund corpus with employer contribution and interest.",
  },
  {
    href: "/calculator/ppf-calculator",
    icon: "📗",
    title: "PPF Calculator",
    desc: "15-year Public Provident Fund maturity value with current interest rates.",
  },
  {
    href: "/calculator/nps-calculator",
    icon: "📈",
    title: "NPS Calculator",
    desc: "National Pension System corpus and expected pension at retirement.",
  },
  {
    href: "/calculator/gratuity-calculator",
    icon: "🎁",
    title: "Gratuity Calculator",
    desc: "Gratuity payable after 5+ years of service, per the Payment of Gratuity Act.",
  },
  {
    href: "/calculator/nsc-calculator",
    icon: "📜",
    title: "NSC Calculator",
    desc: "National Savings Certificate maturity value and interest earned.",
  },
  {
    href: "/calculator/ssy-calculator",
    icon: "👧",
    title: "Sukanya Samriddhi Yojana",
    desc: "SSY maturity value for your girl child's savings, fully tax-free under 80C.",
  },
  {
    href: "/calculator/scss-calculator",
    icon: "🧓",
    title: "SCSS Calculator",
    desc: "Senior Citizen Savings Scheme quarterly interest payout and total returns.",
  },
];

export default function RetirementLandingPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Retirement", href: URL },
    ]),
    webPageSchema({ name: TITLE, description: DESCRIPTION, url: URL })
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Retirement</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Retirement & Savings Calculators</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Plan your long-term savings and retirement corpus with India&apos;s statutory savings
        schemes — EPF, PPF, NPS, gratuity, and NSC.
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
