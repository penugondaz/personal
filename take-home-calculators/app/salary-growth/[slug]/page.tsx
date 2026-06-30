// take-home-calculators/app/salary-growth/[slug]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SALARY_GROWTH_LPA_VALUES, salaryGrowthSlug, parseSalaryGrowthSlug } from "@/lib/salary-growth-data";
import { calculateSalaryGrowth, HIKE_SCENARIOS } from "@/lib/calculators/salary-growth";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";

export function generateStaticParams() {
  return SALARY_GROWTH_LPA_VALUES.map((lpa) => ({ slug: salaryGrowthSlug(lpa) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lpa = parseSalaryGrowthSlug(slug);
  if (lpa === null) return {};

  const data = calculateSalaryGrowth(lpa * 100_000);
  const avg = data.scenarios[1]; // 12% hike

  const title = `${lpa} LPA Salary Growth — In 5 & 10 Years at Different Hike Rates`;
  const description = `Starting at ${lpa} LPA, your salary reaches ${formatINRCompact(avg.ctcAt5Years)} in 5 years and ${formatINRCompact(avg.ctcAt10Years)} in 10 years at a 12% annual hike. See all scenarios including 8%, 18%, and 25%.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/salary-growth/${salaryGrowthSlug(lpa)}`) },
    openGraph: { title, description, url: absoluteUrl(`/salary-growth/${salaryGrowthSlug(lpa)}`) },
  };
}

export default async function SalaryGrowthPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lpa = parseSalaryGrowthSlug(slug);
  if (lpa === null) notFound();

  const annualCtc = Math.round(lpa * 100_000);
  const data = calculateSalaryGrowth(annualCtc);

  const nearbyLpas = SALARY_GROWTH_LPA_VALUES.filter(
    (v) => Math.abs(v - lpa) > 0 && Math.abs(v - lpa) <= 3
  ).slice(0, 6);

  const avgScenario = data.scenarios[1]; // 12% — used for hero numbers

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What will ${lpa} LPA salary become in 5 years?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Starting at ${lpa} LPA, at an 8% annual hike your salary reaches ${formatINRCompact(data.scenarios[0].ctcAt5Years)}, at 12% it reaches ${formatINRCompact(data.scenarios[1].ctcAt5Years)}, at 18% it reaches ${formatINRCompact(data.scenarios[2].ctcAt5Years)}, and at 25% it reaches ${formatINRCompact(data.scenarios[3].ctcAt5Years)} in 5 years.`,
        },
      },
      {
        "@type": "Question",
        name: `What will ${lpa} LPA salary become in 10 years?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `After 10 years, a ${lpa} LPA salary grows to ${formatINRCompact(data.scenarios[0].ctcAt10Years)} at 8% hike, ${formatINRCompact(data.scenarios[1].ctcAt10Years)} at 12%, ${formatINRCompact(data.scenarios[2].ctcAt10Years)} at 18%, and ${formatINRCompact(data.scenarios[3].ctcAt10Years)} at 25% annual hike.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the in-hand salary on ${lpa} LPA after 10 years?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `At a 12% annual hike, in-hand monthly salary grows from ${formatINR(data.startingInHand)} today to ${formatINR(avgScenario.inHandAt5Years)} in 5 years and ${formatINR(avgScenario.inHandAt10Years)} in 10 years. Note that in-hand grows slower than CTC due to India's progressive income tax slabs.`,
        },
      },
      {
        "@type": "Question",
        name: `How much will I earn in total over 10 years starting from ${lpa} LPA?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `At a 12% annual hike, the total cumulative in-hand earnings over 10 years starting from ${lpa} LPA would be approximately ${formatINRCompact(avgScenario.totalEarnedOver10Years)}.`,
        },
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/salary-growth" className="hover:text-brand">Salary Growth</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{lpa} LPA</span>
      </nav>

      {/* Hero */}
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        {lpa} LPA Salary Growth Projection
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Starting at <strong className="text-ink">{lpa} LPA</strong> ({formatINR(data.startingInHand)}/month in-hand),
        here's where your salary lands in 5 and 10 years across different annual hike scenarios.
      </p>

      {/* 5yr / 10yr snapshot cards */}
      <section className="mt-8">
        <div className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
          <div className="brand-gradient px-6 py-7 sm:px-8">
            <p className="text-xs font-medium uppercase tracking-wide text-white/70">
              At 12% Annual Hike — The Indian Average
            </p>
            <div className="mt-2 grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-white/70">CTC after 5 years</p>
                <p className="tabular font-display text-3xl font-semibold text-white">
                  {formatINRCompact(avgScenario.ctcAt5Years)}
                </p>
                <p className="tabular mt-0.5 text-sm text-white/70">
                  {formatINR(avgScenario.inHandAt5Years)}/mo in-hand
                </p>
              </div>
              <div>
                <p className="text-sm text-white/70">CTC after 10 years</p>
                <p className="tabular font-display text-3xl font-semibold text-white">
                  {formatINRCompact(avgScenario.ctcAt10Years)}
                </p>
                <p className="tabular mt-0.5 text-sm text-white/70">
                  {formatINR(avgScenario.inHandAt10Years)}/mo in-hand
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 sm:px-8">
            <p className="text-xs text-ink-soft">
              Real purchasing power growth (after 6% inflation) at 12% hike ={" "}
              <strong className="text-brand">{data.realGrowthAt12Pct}% per year</strong>
            </p>
          </div>
        </div>
      </section>

      {/* All 4 scenarios — 5yr & 10yr cards */}
      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">All Hike Scenarios</h2>
        <p className="mt-2 text-sm text-ink-soft">CTC and monthly in-hand after 5 and 10 years.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {data.scenarios.map((sc) => (
            <div key={sc.hikePercent} className="rounded-xl border border-rule bg-surface p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${sc.bg} ${sc.color}`}>
                  {sc.label}
                </span>
                <span className="font-display text-lg font-semibold text-ink">{sc.hikePercent}%/yr</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-paper p-3">
                  <p className="text-xs text-ink-soft">After 5 years</p>
                  <p className="tabular mt-1 font-display text-xl font-semibold text-ink">
                    {formatINRCompact(sc.ctcAt5Years)}
                  </p>
                  <p className="tabular mt-0.5 text-xs text-ink-soft">
                    {formatINR(sc.inHandAt5Years)}/mo
                  </p>
                </div>
                <div className="rounded-lg bg-paper p-3">
                  <p className="text-xs text-ink-soft">After 10 years</p>
                  <p className={`tabular mt-1 font-display text-xl font-semibold ${sc.color}`}>
                    {formatINRCompact(sc.ctcAt10Years)}
                  </p>
                  <p className="tabular mt-0.5 text-xs text-ink-soft">
                    {formatINR(sc.inHandAt10Years)}/mo
                  </p>
                </div>
              </div>

              <div className="mt-3 border-t border-rule pt-3">
                <p className="text-xs text-ink-soft">
                  Total in-hand over 10 years:{" "}
                  <span className="font-medium text-ink">
                    {formatINRCompact(sc.totalEarnedOver10Years)}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Year-by-year table — avg scenario */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Year-by-Year Breakdown (12% Hike)</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Full projection at the average 12% annual hike, showing CTC and take-home for each year.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft">Year</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">Annual CTC</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">In-Hand/Month</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">Growth</th>
              </tr>
            </thead>
            <tbody>
              {avgScenario.years.map((yr) => (
                <tr
                  key={yr.year}
                  className={`border-b border-rule last:border-0 ${yr.year === 5 || yr.year === 10 ? "bg-brand-soft" : ""}`}
                >
                  <td className="px-4 py-2.5 font-medium text-ink">
                    Year {yr.year}
                    {yr.year === 5 && <span className="ml-1.5 text-xs text-brand">(5yr)</span>}
                    {yr.year === 10 && <span className="ml-1.5 text-xs text-brand">(10yr)</span>}
                  </td>
                  <td className="tabular px-4 py-2.5 text-right text-ink">
                    {formatINRCompact(yr.ctc)}
                  </td>
                  <td className="tabular px-4 py-2.5 text-right font-medium text-ink">
                    {formatINR(yr.inHandMonthly)}
                  </td>
                  <td className="tabular px-4 py-2.5 text-right text-brand">
                    +{yr.cumulativeGrowthPercent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          In-hand calculated under the new tax regime with no additional deductions. Actual take-home
          varies based on your employer's salary structure and tax-saving investments.
        </p>
      </section>

      {/* Switch vs Stay insight */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Switching Jobs vs. Staying — Which Grows Faster?</h2>
        <p className="mt-3 text-ink-soft">
          Annual increments (8–18%) are only part of the picture. Job switches in India typically
          bring <strong className="text-ink">25–40% salary jumps</strong> — far more than even an
          &quot;exceptional&quot; internal hike. Here&apos;s how staying vs. switching compares over 5 years
          from {lpa} LPA:
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-rule bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Stay & Get Annual Hikes</p>
            <p className="mt-2 text-sm text-ink-soft">12% average hike, compounded yearly</p>
            <p className="tabular mt-3 font-display text-2xl font-bold text-ink">
              {formatINRCompact(data.scenarios[1].ctcAt5Years)}
            </p>
            <p className="text-xs text-ink-soft mt-1">after 5 years at this company</p>
          </div>
          <div className="rounded-xl border border-brand/30 bg-brand-soft p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Switch Once (Year 3) + Hikes</p>
            <p className="mt-2 text-sm text-ink-soft">~30% jump at switch, then 10% hikes</p>
            <p className="tabular mt-3 font-display text-2xl font-bold text-brand">
              {formatINRCompact(Math.round(annualCtc * Math.pow(1.12, 2) * 1.30 * Math.pow(1.10, 2)))}
            </p>
            <p className="text-xs text-ink-soft mt-1">after 5 years, with one switch</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-rule bg-paper p-4">
          <p className="text-sm text-ink-soft">
            <strong className="text-ink">The trade-off:</strong> switching jobs accelerates pay growth
            but resets your tenure (affecting gratuity eligibility), may mean a steeper learning curve,
            and isn&apos;t guaranteed every time. Staying offers stability, deeper expertise, and
            sometimes better non-cash benefits (ESOPs, deferred bonuses). Most people who switch jobs
            every 2-3 years in their first decade end up earning meaningfully more than those who stay
            put — but it depends heavily on performance, market conditions, and the specific roles available.
          </p>
        </div>
      </section>

      {/* Comparison table — all 4 scenarios side by side */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Side-by-Side: All 4 Scenarios</h2>
        <p className="mt-2 text-sm text-ink-soft">
          How much does the hike rate matter over a decade?
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-3 py-2.5 font-medium text-ink-soft">Milestone</th>
                {data.scenarios.map((sc) => (
                  <th key={sc.hikePercent} className="px-3 py-2.5 text-right font-medium text-ink-soft">
                    {sc.hikePercent}%
                    <span className={`ml-1 text-xs ${sc.color}`}>({sc.label})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-rule">
                <td className="px-3 py-2.5 text-ink-soft">CTC — Year 5</td>
                {data.scenarios.map((sc) => (
                  <td key={sc.hikePercent} className="tabular px-3 py-2.5 text-right text-ink">
                    {formatINRCompact(sc.ctcAt5Years)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-rule">
                <td className="px-3 py-2.5 text-ink-soft">In-hand/mo — Year 5</td>
                {data.scenarios.map((sc) => (
                  <td key={sc.hikePercent} className="tabular px-3 py-2.5 text-right text-ink">
                    {formatINR(sc.inHandAt5Years)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-rule">
                <td className="px-3 py-2.5 text-ink-soft">CTC — Year 10</td>
                {data.scenarios.map((sc) => (
                  <td key={sc.hikePercent} className={`tabular px-3 py-2.5 text-right font-semibold ${sc.color}`}>
                    {formatINRCompact(sc.ctcAt10Years)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-rule">
                <td className="px-3 py-2.5 text-ink-soft">In-hand/mo — Year 10</td>
                {data.scenarios.map((sc) => (
                  <td key={sc.hikePercent} className={`tabular px-3 py-2.5 text-right font-semibold ${sc.color}`}>
                    {formatINR(sc.inHandAt10Years)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-ink-soft">Total earned (10yr)</td>
                {data.scenarios.map((sc) => (
                  <td key={sc.hikePercent} className="tabular px-3 py-2.5 text-right text-ink">
                    {formatINRCompact(sc.totalEarnedOver10Years)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Insight callout */}
      <section className="mt-10 rounded-xl border border-rule bg-brand-soft p-5">
        <h3 className="font-semibold text-brand">💡 The compounding gap</h3>
        <p className="mt-2 text-sm text-ink-soft">
          The difference between a 8% and 25% hike compounds dramatically. Starting at {lpa} LPA,
          after 10 years the gap between conservative (8%) and exceptional (25%) outcomes
          is{" "}
          <strong className="text-ink">
            {formatINRCompact(data.scenarios[3].ctcAt10Years - data.scenarios[0].ctcAt10Years)}
          </strong>{" "}
          in annual CTC — that's{" "}
          <strong className="text-ink">
            {formatINRCompact(data.scenarios[3].totalEarnedOver10Years - data.scenarios[0].totalEarnedOver10Years)}
          </strong>{" "}
          more in cumulative take-home over the decade. Early career decisions about which company
          and role to join matter enormously.
        </p>
      </section>

      {/* Inflation note */}
      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Real vs Nominal Growth</h2>
        <p className="mt-3 text-ink-soft">
          A 12% annual hike sounds great, but with India's inflation running around 5–6%, your
          actual purchasing power grows at only{" "}
          <strong className="text-ink">{data.realGrowthAt12Pct}% per year</strong> in real terms.
          At 8% hike with 6% inflation, real growth is just{" "}
          <strong className="text-ink">~1.9%</strong> — barely ahead of inflation. This is why
          switching jobs or getting promoted (not just annual increments) makes a meaningful
          difference to long-term financial outcomes.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          <FaqItem
            question={`What will my salary be in 5 years if I earn ${lpa} LPA now?`}
            answer={`At an 8% annual hike, ${lpa} LPA becomes ${formatINRCompact(data.scenarios[0].ctcAt5Years)}. At 12%, it becomes ${formatINRCompact(data.scenarios[1].ctcAt5Years)}. At 18%, it reaches ${formatINRCompact(data.scenarios[2].ctcAt5Years)}, and at 25%, it reaches ${formatINRCompact(data.scenarios[3].ctcAt5Years)} in 5 years.`}
          />
          <FaqItem
            question={`What will my salary be in 10 years if I earn ${lpa} LPA now?`}
            answer={`After 10 years: 8% hike → ${formatINRCompact(data.scenarios[0].ctcAt10Years)}, 12% hike → ${formatINRCompact(data.scenarios[1].ctcAt10Years)}, 18% hike → ${formatINRCompact(data.scenarios[2].ctcAt10Years)}, 25% hike → ${formatINRCompact(data.scenarios[3].ctcAt10Years)}.`}
          />
          <FaqItem
            question="Why does my in-hand salary grow slower than my CTC?"
            answer="India uses progressive income tax slabs — as your CTC rises, more of the additional income falls into higher tax brackets (20%, 30%). So a 12% CTC increase might only translate to a 9–10% in-hand increase. This gap widens at higher income levels."
          />
          <FaqItem
            question="What is a good annual salary hike in India?"
            answer="The Indian IT and services sector average is around 10–12% for standard annual increments. A hike below 8% doesn't beat inflation meaningfully. A jump of 20–30% usually happens through job switches or promotions, not standard annual reviews."
          />
          <FaqItem
            question="How can I grow my salary faster?"
            answer="The highest-leverage moves: (1) switching jobs every 2–3 years — job changes typically yield 20–40% CTC jumps vs 10–12% for internal hikes, (2) upskilling in high-demand areas (cloud, AI, product), (3) targeting high-growth companies or sectors, (4) moving into people management or specialist roles sooner."
          />
        </div>
      </section>

      {/* Related calculators */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <li>
            <Link href={`/salary/${lpa}-lpa-in-hand`} className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              {lpa} LPA In-Hand Salary
            </Link>
          </li>
          <li>
            <Link href={`/tax-saving/${lpa}-lpa`} className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              {lpa} LPA Tax Saving
            </Link>
          </li>
          <li>
            <Link href="/calculator/salary-hike-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              Salary Hike Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/sip-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              SIP Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/goal-planning-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              Goal Planning Calculator
            </Link>
          </li>
          <li>
            <Link href="/calculator/epf-calculator" className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
              EPF Calculator
            </Link>
          </li>
        </ul>
      </section>

      {/* Nearby LPAs */}
      {nearbyLpas.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink">Other Salary Growth Projections</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {nearbyLpas.map((nearLpa) => (
              <li key={nearLpa}>
                <Link
                  href={`/salary-growth/${salaryGrowthSlug(nearLpa)}`}
                  className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand"
                >
                  {nearLpa} LPA Growth
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-rule pb-4">
      <h3 className="font-medium text-ink">{question}</h3>
      <p className="mt-1.5 text-sm text-ink-soft">{answer}</p>
    </div>
  );
}
