import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { taxSavingSlug, parseTaxSavingSlug } from "@/lib/tax-saving-data";
import { HI_TAX_SAVING_LPA_VALUES } from "@/lib/hi-salary-data";
import { calculateTaxSaving } from "@/lib/calculators/tax-saving";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, webPageSchema, buildJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return HI_TAX_SAVING_LPA_VALUES.map((lpa) => ({ slug: taxSavingSlug(lpa) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lpa = parseTaxSavingSlug(slug);
  if (lpa === null) return {};

  const title = `${lpa} LPA पर टैक्स कैसे बचाएं — FY 2025-26 पूरी गाइड`;
  const description = `${lpa} LPA सैलरी पर टैक्स बचाने के सभी तरीके — 80C, NPS, HRA, होम लोन। जानें कितना टैक्स लगता है और कितना बचा सकते हैं।`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/hi/tax-saving/${slug}`),
      languages: {
        "en": absoluteUrl(`/tax-saving/${slug}`),
        "hi": absoluteUrl(`/hi/tax-saving/${slug}`),
      },
    },
    openGraph: { title, description, url: absoluteUrl(`/hi/tax-saving/${slug}`) },
  };
}

export default async function HindiTaxSavingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lpa = parseTaxSavingSlug(slug);
  if (lpa === null) notFound();

  const data = calculateTaxSaving(lpa * 100_000);

  const relatedLpas = HI_TAX_SAVING_LPA_VALUES.filter(
    (v) => Math.abs(v - lpa) > 0 && Math.abs(v - lpa) <= 3
  ).slice(0, 6);

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "होम", href: "/hi" },
      { name: "टैक्स सेविंग", href: "/tax-saving" },
      { name: `${lpa} LPA टैक्स सेविंग`, href: `/hi/tax-saving/${slug}` },
    ]),
    webPageSchema({
      name: `${lpa} LPA पर टैक्स कैसे बचाएं`,
      description: `${lpa} LPA पर टैक्स बचाने के तरीके`,
      url: `/hi/tax-saving/${slug}`,
    }),
    faqSchema([
      {
        question: `${lpa} LPA पर कितना टैक्स लगता है?`,
        answer: `${lpa} LPA पर नई टैक्स रिजीम में ${formatINR(data.currentTaxNew)} सालाना टैक्स लगता है। पुरानी रिजीम में (बिना डिडक्शन के) ${formatINR(data.currentTaxOld)} हो सकता है।`,
      },
      {
        question: `${lpa} LPA पर अधिकतम कितना टैक्स बचा सकते हैं?`,
        answer: `${lpa} LPA पर पुरानी रिजीम में सभी डिडक्शन (80C, NPS, HRA, मेडिकल) का उपयोग करके अधिकतम ${formatINR(data.maxPossibleSavingOld)} तक टैक्स बचाया जा सकता है।`,
      },
      {
        question: "80C में क्या-क्या आता है?",
        answer: "80C के तहत EPF, PPF, ELSS म्यूचुअल फंड, NSC, सुकन्या समृद्धि, LIC प्रीमियम, टर्म इंश्योरेंस, और होम लोन का प्रिंसिपल शामिल है। अधिकतम डिडक्शन ₹1.5 लाख है।",
      },
    ]),
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Language switcher */}
      <div className="mb-6 flex items-center gap-3 text-sm">
        <Link href={`/tax-saving/${slug}`} className="rounded-full border border-rule px-3 py-1 text-ink-soft hover:border-brand hover:text-brand">
          English
        </Link>
        <span className="rounded-full border border-brand bg-brand-soft px-3 py-1 font-medium text-brand">
          हिंदी
        </span>
      </div>

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/hi" className="hover:text-brand">होम</Link>
        <span className="mx-1.5">/</span>
        <Link href="/tax-saving" className="hover:text-brand">टैक्स सेविंग</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{lpa} LPA</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        {lpa} LPA पर टैक्स कैसे बचाएं — FY 2025-26
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        {lpa} LPA सैलरी पर आपका वर्तमान टैक्स{" "}
        <strong className="text-deduction">{formatINR(data.currentTaxNew)}</strong> (नई रिजीम) है।
        सभी डिडक्शन का उपयोग करके आप{" "}
        <strong className="text-brand">{formatINR(data.maxPossibleSavingOld)} तक बचा सकते हैं।</strong>
      </p>

      {/* Tax summary cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "नई रिजीम में टैक्स", value: formatINR(data.currentTaxNew), color: "text-deduction" },
          { label: "पुरानी रिजीम में टैक्स", value: formatINR(data.currentTaxOld), color: "text-ink" },
          { label: "अधिकतम बचत संभव", value: formatINR(data.maxPossibleSavingOld), color: "text-brand" },
        ].map(card => (
          <div key={card.label} className="rounded-xl border border-rule bg-surface p-4 shadow-card">
            <p className="text-xs text-ink-soft">{card.label}</p>
            <p className={`tabular mt-1 font-display text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Deductions list */}
      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">टैक्स बचाने के तरीके</h2>
        <div className="mt-4 space-y-3">
          {[
            { category: "80C निवेश", icon: "📊", items: ["EPF/VPF", "PPF", "ELSS म्यूचुअल फंड", "NSC", "सुकन्या समृद्धि", "LIC प्रीमियम"], limit: "₹1.5 लाख", saving: formatINR(Math.min(data.maxPossibleSavingOld * 0.4, 46800)) },
            { category: "NPS (80CCD 1B)", icon: "🏛️", items: ["NPS में अतिरिक्त ₹50,000 जमा"], limit: "₹50,000 अतिरिक्त", saving: formatINR(15600) },
            { category: "HRA छूट", icon: "🏠", items: ["किराया देने पर HRA exempt होता है"], limit: "सैलरी और किराये पर निर्भर", saving: formatINR(Math.min(data.maxPossibleSavingOld * 0.3, 50000)) },
            { category: "मेडिकल इंश्योरेंस (80D)", icon: "🏥", items: ["खुद के लिए ₹25,000", "माता-पिता के लिए ₹25,000-₹50,000"], limit: "₹75,000 तक", saving: formatINR(23400) },
            { category: "होम लोन ब्याज (24B)", icon: "🔑", items: ["होम लोन पर ब्याज की छूट"], limit: "₹2 लाख", saving: formatINR(62400) },
          ].map(item => (
            <div key={item.category} className="rounded-xl border border-rule bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">{item.icon} {item.category}</p>
                <span className="text-xs text-brand font-medium">बचत: ~{item.saving}</span>
              </div>
              <p className="text-xs text-ink-soft mt-1">सीमा: {item.limit}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {item.items.map(i => (
                  <li key={i} className="rounded-full bg-paper px-2 py-0.5 text-xs text-ink-soft border border-rule">{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">अक्सर पूछे जाने वाले सवाल</h2>
        <div className="mt-4 space-y-5">
          {[
            { q: `${lpa} LPA पर कितना टैक्स लगता है?`, a: `${lpa} LPA पर नई रिजीम में ${formatINR(data.currentTaxNew)} और पुरानी रिजीम में (बिना डिडक्शन) ${formatINR(data.currentTaxOld)} टैक्स लगता है।` },
            { q: "नई रिजीम vs पुरानी रिजीम — कौन सी बेहतर है?", a: `${lpa} LPA पर अगर आपके पास कम डिडक्शन हैं तो नई रिजीम बेहतर है। लेकिन अगर आप 80C (₹1.5L), NPS (₹50K), और HRA का पूरा फायदा लेते हैं तो पुरानी रिजीम में ${formatINR(data.maxPossibleSavingOld)} तक बचत हो सकती है।` },
            { q: "80C में अधिकतम कितना निवेश कर सकते हैं?", a: "80C के तहत अधिकतम ₹1,50,000 का डिडक्शन मिलता है। इसमें EPF, PPF, ELSS, NSC, LIC प्रीमियम, और होम लोन का प्रिंसिपल शामिल हैं।" },
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
        <h2 className="font-display text-2xl text-ink">अन्य सैलरी के लिए टैक्स गाइड</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {relatedLpas.map(relatedLpa => (
            <li key={relatedLpa}>
              <Link href={`/hi/tax-saving/${taxSavingSlug(relatedLpa)}`}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
                {relatedLpa} LPA टैक्स सेविंग
              </Link>
            </li>
          ))}
          <li>
            <Link href={`/tax-saving/${slug}`}
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-ink-soft hover:border-brand hover:text-brand">
              English version →
            </Link>
          </li>
        </ul>
      </section>

    </main>
  );
}
