import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SALARY_GROWTH_LPA_VALUES, salaryGrowthSlug, parseSalaryGrowthSlug } from "@/lib/salary-growth-data";
import { calculateSalaryGrowth } from "@/lib/calculators/salary-growth";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, webPageSchema, buildJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return SALARY_GROWTH_LPA_VALUES.map((lpa) => ({ slug: salaryGrowthSlug(lpa) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lpa = parseSalaryGrowthSlug(slug);
  if (lpa === null) return {};

  const data = calculateSalaryGrowth(lpa * 100_000);
  const avg = data.scenarios[1];

  const title = `${lpa} LPA सैलरी 5 और 10 साल में कितनी होगी?`;
  const description = `${lpa} LPA से शुरू करके 12% सालाना हाइक पर 5 साल में ${formatINRCompact(avg.ctcAt5Years)} और 10 साल में ${formatINRCompact(avg.ctcAt10Years)} हो सकती है। सभी हाइक रेट पर देखें।`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/hi/salary-growth/${slug}`),
      languages: {
        "en": absoluteUrl(`/salary-growth/${slug}`),
        "hi": absoluteUrl(`/hi/salary-growth/${slug}`),
      },
    },
    openGraph: { title, description, url: absoluteUrl(`/hi/salary-growth/${slug}`) },
  };
}

export default async function HindiSalaryGrowthPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lpa = parseSalaryGrowthSlug(slug);
  if (lpa === null) notFound();

  const data = calculateSalaryGrowth(lpa * 100_000);
  const avgScenario = data.scenarios[1]; // 12% hike

  const nearbyLpas = SALARY_GROWTH_LPA_VALUES.filter(
    (v) => Math.abs(v - lpa) > 0 && Math.abs(v - lpa) <= 3
  ).slice(0, 6);

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "होम", href: "/hi" },
      { name: "सैलरी ग्रोथ", href: "/salary-growth" },
      { name: `${lpa} LPA ग्रोथ`, href: `/hi/salary-growth/${slug}` },
    ]),
    webPageSchema({
      name: `${lpa} LPA सैलरी 5 और 10 साल में कितनी होगी`,
      description: `${lpa} LPA सैलरी ग्रोथ प्रोजेक्शन`,
      url: `/hi/salary-growth/${slug}`,
    }),
    faqSchema([
      {
        question: `${lpa} LPA सैलरी 10 साल में कितनी होगी?`,
        answer: `12% सालाना हाइक पर ${lpa} LPA की सैलरी 10 साल में ${formatINRCompact(avgScenario.ctcAt10Years)} हो जाएगी। 8% हाइक पर ${formatINRCompact(data.scenarios[0].ctcAt10Years)} और 18% हाइक पर ${formatINRCompact(data.scenarios[2].ctcAt10Years)} होगी।`,
      },
      {
        question: `${lpa} LPA से 5 साल में कितनी सैलरी बनेगी?`,
        answer: `${lpa} LPA से 12% सालाना हाइक पर 5 साल में ${formatINRCompact(avgScenario.ctcAt5Years)} CTC हो जाएगा। यह ${formatINR(avgScenario.inHandAt5Years)}/माह इन-हैंड बनता है।`,
      },
    ]),
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Language switcher */}
      <div className="mb-6 flex items-center gap-3 text-sm">
        <Link href={`/salary-growth/${slug}`} className="rounded-full border border-rule px-3 py-1 text-ink-soft hover:border-brand hover:text-brand">
          English
        </Link>
        <span className="rounded-full border border-brand bg-brand-soft px-3 py-1 font-medium text-brand">
          हिंदी
        </span>
      </div>

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/hi" className="hover:text-brand">होम</Link>
        <span className="mx-1.5">/</span>
        <Link href="/salary-growth" className="hover:text-brand">सैलरी ग्रोथ</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{lpa} LPA</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        {lpa} LPA सैलरी — 5 और 10 साल में कितनी होगी?
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        {lpa} LPA से शुरू करके 12% सालाना हाइक पर{" "}
        <strong className="text-brand">5 साल में {formatINRCompact(avgScenario.ctcAt5Years)}</strong> और{" "}
        <strong className="text-brand">10 साल में {formatINRCompact(avgScenario.ctcAt10Years)}</strong> CTC हो सकती है।
      </p>

      {/* Hero cards */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-brand/20 bg-brand-soft p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">5 साल बाद (12% हाइक)</p>
          <p className="tabular mt-2 font-display text-2xl font-bold text-brand">{formatINRCompact(avgScenario.ctcAt5Years)}</p>
          <p className="text-xs text-ink-soft mt-1">इन-हैंड: {formatINR(avgScenario.inHandAt5Years)}/माह</p>
        </div>
        <div className="rounded-xl border border-rule bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">10 साल बाद (12% हाइक)</p>
          <p className="tabular mt-2 font-display text-2xl font-bold text-ink">{formatINRCompact(avgScenario.ctcAt10Years)}</p>
          <p className="text-xs text-ink-soft mt-1">इन-हैंड: {formatINR(avgScenario.inHandAt10Years)}/माह</p>
        </div>
      </div>

      {/* All scenarios table */}
      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">सभी हाइक रेट पर सैलरी ग्रोथ</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft">सालाना हाइक</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">5 साल में CTC</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">10 साल में CTC</th>
              </tr>
            </thead>
            <tbody>
              {data.scenarios.map((s) => (
                <tr key={s.hikePercent} className="border-b border-rule last:border-0 hover:bg-paper">
                  <td className="px-4 py-2.5 font-medium text-ink">{s.hikePercent}% हाइक</td>
                  <td className="tabular px-4 py-2.5 text-right text-brand">{formatINRCompact(s.ctcAt5Years)}</td>
                  <td className="tabular px-4 py-2.5 text-right text-ink">{formatINRCompact(s.ctcAt10Years)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">अक्सर पूछे जाने वाले सवाल</h2>
        <div className="mt-4 space-y-5">
          {[
            { q: `${lpa} LPA 10 साल में कितना होगा?`, a: `12% सालाना हाइक पर ${lpa} LPA, 10 साल में ${formatINRCompact(avgScenario.ctcAt10Years)} हो जाएगा। 8% हाइक पर ${formatINRCompact(data.scenarios[0].ctcAt10Years)} और 18% पर ${formatINRCompact(data.scenarios[2].ctcAt10Years)} होगा।` },
            { q: "भारत में औसत सैलरी हाइक कितना होता है?", a: "भारत के IT सेक्टर में औसत सालाना हाइक 10-15% रहता है। प्रमोशन मिलने पर 20-30% तक भी हो सकता है। बड़ी कंपनियों में हाइक छोटा लेकिन स्थिर होता है।" },
            { q: "क्या मुझे जल्दी नौकरी बदलनी चाहिए?", a: "अक्सर नौकरी बदलने पर 25-40% सैलरी बढ़ोतरी मिलती है, जो एक-दो साल के हाइक से ज्यादा होती है। लेकिन स्किल, नेटवर्क, और काम की स्थिरता भी देखनी चाहिए।" },
          ].map(faq => (
            <div key={faq.q} className="border-b border-rule pb-4">
              <h3 className="font-medium text-ink">{faq.q}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">अन्य सैलरी ग्रोथ कैलकुलेटर</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {nearbyLpas.map(nearbyLpa => (
            <li key={nearbyLpa}>
              <Link href={`/hi/salary-growth/${salaryGrowthSlug(nearbyLpa)}`}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
                {nearbyLpa} LPA ग्रोथ
              </Link>
            </li>
          ))}
          <li>
            <Link href={`/salary-growth/${slug}`}
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-ink-soft hover:border-brand hover:text-brand">
              English version →
            </Link>
          </li>
        </ul>
      </section>

    </main>
  );
}
