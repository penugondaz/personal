import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SalaryInputCalculator from "@/components/SalaryInputCalculator";
import { salarySlug, parseSalarySlug, lpaToAnnualCtc } from "@/lib/salary-data";
import { HI_SALARY_LPA_VALUES } from "@/lib/hi-salary-data";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { compareRegimes } from "@/lib/calculators/income-tax";
import { formatINR, formatINRCompact } from "@/lib/format";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, salaryPageSchema, buildJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return HI_SALARY_LPA_VALUES.map((lpa) => ({ slug: salarySlug(lpa) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lpa = parseSalarySlug(slug);
  if (lpa === null) return {};

  const title = `${lpa} LPA इन-हैंड सैलरी — टैक्स के बाद मासिक सैलरी (FY 2025-26)`;
  const description = `${lpa} LPA CTC पर इन-हैंड सैलरी लगभग ${formatINR((calculateSalaryBreakup({ annualCtc: lpa * 100_000, regime: "new" })).inHandMonthly)} प्रति माह है। PF, प्रोफेशनल टैक्स और इनकम टैक्स काटने के बाद।`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/hi/salary/${slug}`),
      languages: {
        "en": absoluteUrl(`/salary/${slug}`),
        "hi": absoluteUrl(`/hi/salary/${slug}`),
      },
    },
    openGraph: { title, description, url: absoluteUrl(`/hi/salary/${slug}`) },
  };
}

export default async function HindiSalaryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lpa = parseSalarySlug(slug);
  if (lpa === null) notFound();

  const annualCtc = lpaToAnnualCtc(lpa);
  const result = calculateSalaryBreakup({ annualCtc, regime: "new" });
  const regimeComparison = compareRegimes(result.grossSalaryAnnual);

  const relatedLpas = HI_SALARY_LPA_VALUES.filter(
    (v) => Math.abs(v - lpa) > 0 && Math.abs(v - lpa) <= 3
  ).slice(0, 6);

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "होम", href: "/hi" },
      { name: "सैलरी कैलकुलेटर", href: "/salary" },
      { name: `${lpa} LPA इन-हैंड`, href: `/hi/salary/${slug}` },
    ]),
    salaryPageSchema({
      lpa,
      inHandMonthly: result.inHandMonthly,
      inHandAnnual: result.inHandAnnual,
      url: `/hi/salary/${slug}`,
    }),
    faqSchema([
      {
        question: `${lpa} LPA में कितनी इन-हैंड सैलरी मिलती है?`,
        answer: `${lpa} LPA CTC पर नई टैक्स रिजीम के अनुसार इन-हैंड सैलरी लगभग ${formatINR(result.inHandMonthly)} प्रति माह होती है। इसमें PF और इनकम टैक्स की कटौती के बाद की राशि है।`,
      },
      {
        question: `${lpa} LPA पर कितना टैक्स लगता है?`,
        answer: `${lpa} LPA CTC पर नई टैक्स रिजीम में सालाना इनकम टैक्स लगभग ${formatINR(regimeComparison.new.totalTaxPayable)} है। पुरानी रिजीम में यह ${formatINR(regimeComparison.old.totalTaxPayable)} हो सकता है।`,
      },
      {
        question: `${lpa} LPA पर PF कितना कटता है?`,
        answer: `${lpa} LPA सैलरी पर एम्प्लॉई का PF ${formatINR(result.employeePfMonthly)} प्रति माह कटता है। एम्प्लॉयर भी ${formatINR(result.employerPfMonthly)} प्रति माह EPF में जोड़ता है।`,
      },
      {
        question: `क्या ${lpa} LPA अच्छी सैलरी है?`,
        answer: `यह आपके शहर, अनुभव और इंडस्ट्री पर निर्भर करता है। ${lpa} LPA का मतलब है हर महीने ${formatINR(result.inHandMonthly)} इन-हैंड। मेट्रो शहरों में यह औसत माना जाता है, जबकि छोटे शहरों में यह बहुत अच्छी सैलरी है।`,
      },
    ]),
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Language switcher */}
      <div className="mb-6 flex items-center gap-3 text-sm">
        <Link href={`/salary/${slug}`} className="rounded-full border border-rule px-3 py-1 text-ink-soft hover:border-brand hover:text-brand">
          English
        </Link>
        <span className="rounded-full border border-brand bg-brand-soft px-3 py-1 font-medium text-brand">
          हिंदी
        </span>
      </div>

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/hi" className="hover:text-brand">होम</Link>
        <span className="mx-1.5">/</span>
        <Link href="/salary" className="hover:text-brand">सैलरी</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{lpa} LPA</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        {lpa} LPA इन-हैंड सैलरी — मासिक टेक-होम ब्रेकडाउन
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        <strong className="text-ink">{formatINRCompact(annualCtc)} सालाना</strong> CTC पर
        आपकी अनुमानित इन-हैंड सैलरी{" "}
        <strong className="text-brand">{formatINR(result.inHandMonthly)} प्रति माह</strong>{" "}
        है ({formatINR(result.inHandAnnual)} सालाना) — नई टैक्स रिजीम के अनुसार, PF और
        इनकम टैक्स काटने के बाद।
      </p>

      {/* Calculator */}
      <div className="mt-10">
        <SalaryInputCalculator initialAnnualCtc={annualCtc} />
      </div>

      {/* How it breaks down */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">
          {lpa} LPA से {formatINR(result.inHandMonthly)} कैसे बनती है?
        </h2>
        <p className="mt-3 text-ink-soft">
          CTC और इन-हैंड सैलरी में फर्क होता है क्योंकि CTC में कई ऐसे हिस्से शामिल होते हैं
          जो आपके बैंक में नहीं आते। यहाँ पूरा ब्रेकडाउन है:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-soft">
          <li>
            <strong className="text-ink">बेसिक सैलरी</strong> — CTC का लगभग 40% यानी{" "}
            {formatINR(result.basicMonthly)} प्रति माह।
          </li>
          <li>
            <strong className="text-ink">HRA</strong> (हाउस रेंट अलाउंस) — बेसिक का 50% यानी{" "}
            {formatINR(result.hraMonthly)} प्रति माह। किराया देने पर यह टैक्स से exempt हो सकता है।
          </li>
          <li>
            <strong className="text-ink">एम्प्लॉयर PF</strong> ({formatINR(result.employerPfMonthly)}/माह)
            और <strong className="text-ink">ग्रेच्युटी</strong> ({formatINR(result.gratuityMonthly)}/माह)
            CTC में होते हैं लेकिन हर महीने नहीं मिलते।
          </li>
          <li>
            आपकी ग्रॉस सैलरी {formatINR(result.grossSalaryMonthly)}/माह से{" "}
            <strong className="text-ink">आपका PF</strong> ({formatINR(result.employeePfMonthly)}) और{" "}
            <strong className="text-ink">इनकम टैक्स</strong> ({formatINR(result.incomeTaxMonthly)}) कटता है।
          </li>
        </ol>
      </section>

      {/* Annual summary table */}
      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">सालाना सारांश</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-rule">
          <table className="w-full text-sm">
            <tbody>
              {[
                { label: "सालाना CTC", value: annualCtc },
                { label: "ग्रॉस सैलरी (सालाना)", value: result.grossSalaryAnnual },
                { label: "कुल PF कटौती (सालाना)", value: result.employeePfAnnual },
                { label: "इनकम टैक्स (सालाना)", value: result.incomeTax.totalTaxPayable },
                { label: "नेट इन-हैंड (सालाना)", value: result.inHandAnnual, emphasis: true },
              ].map(row => (
                <tr key={row.label} className={`border-b border-rule last:border-0 ${row.emphasis ? "bg-paper font-semibold" : ""}`}>
                  <td className="px-4 py-2.5 text-ink-soft">{row.label}</td>
                  <td className="tabular px-4 py-2.5 text-right text-ink">{formatINR(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Old vs New regime */}
      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">पुरानी रिजीम vs नई रिजीम</h2>
        <p className="mt-3 text-ink-soft">
          इस CTC पर{" "}
          <strong className="text-brand">
            {regimeComparison.betterRegime === "new" ? "नई" : "पुरानी"} टैक्स रिजीम
          </strong>{" "}
          {formatINR(regimeComparison.savings)} सालाना सस्ती पड़ती है।
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft"></th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">नई रिजीम</th>
                <th className="px-4 py-2.5 text-right font-medium text-ink-soft">पुरानी रिजीम</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-rule">
                <td className="px-4 py-2.5 text-ink-soft">स्टैंडर्ड डिडक्शन</td>
                <td className="tabular px-4 py-2.5 text-right text-ink">{formatINR(regimeComparison.new.standardDeduction)}</td>
                <td className="tabular px-4 py-2.5 text-right text-ink">{formatINR(regimeComparison.old.standardDeduction)}</td>
              </tr>
              <tr className="border-b border-rule">
                <td className="px-4 py-2.5 text-ink-soft">टैक्सेबल इनकम</td>
                <td className="tabular px-4 py-2.5 text-right text-ink">{formatINR(regimeComparison.new.taxableIncome)}</td>
                <td className="tabular px-4 py-2.5 text-right text-ink">{formatINR(regimeComparison.old.taxableIncome)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-semibold text-ink">देय टैक्स</td>
                <td className="tabular px-4 py-2.5 text-right font-semibold text-ink">{formatINR(regimeComparison.new.totalTaxPayable)}</td>
                <td className="tabular px-4 py-2.5 text-right font-semibold text-ink">{formatINR(regimeComparison.old.totalTaxPayable)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">अक्सर पूछे जाने वाले सवाल</h2>
        <div className="mt-4 space-y-5">
          {[
            {
              q: `${lpa} LPA में हर महीने कितना मिलता है?`,
              a: `${lpa} LPA CTC पर नई टैक्स रिजीम में हर महीने लगभग ${formatINR(result.inHandMonthly)} इन-हैंड मिलते हैं। यह राशि PF (${formatINR(result.employeePfMonthly)}/माह) और इनकम टैक्स (${formatINR(result.incomeTaxMonthly)}/माह) काटने के बाद है।`,
            },
            {
              q: `${lpa} LPA पर कितना टैक्स देना होगा?`,
              a: `नई रिजीम में ${lpa} LPA पर सालाना ${formatINR(regimeComparison.new.totalTaxPayable)} टैक्स लगता है यानी ${formatINR(result.incomeTaxMonthly)}/माह। पुरानी रिजीम में (अतिरिक्त डिडक्शन के बिना) ${formatINR(regimeComparison.old.totalTaxPayable)} सालाना होगा।`,
            },
            {
              q: `${lpa} LPA पर PF कितना होगा?`,
              a: `${lpa} LPA पर आपका PF कटौती ${formatINR(result.employeePfMonthly)}/माह है (बेसिक का 12%)। आपका एम्प्लॉयर भी ${formatINR(result.employerPfMonthly)}/माह आपके EPF अकाउंट में डालता है।`,
            },
            {
              q: `क्या ${lpa} LPA भारत में अच्छी सैलरी है?`,
              a: `${lpa} LPA यानी ${formatINR(result.inHandMonthly)}/माह इन-हैंड। मेट्रो शहरों (मुंबई, दिल्ली, बेंगलुरु) में यह मध्यम वर्ग की सैलरी है। छोटे शहरों और टियर-2 शहरों में यह अच्छी सैलरी मानी जाती है।`,
            },
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
        <h2 className="font-display text-2xl text-ink">अन्य सैलरी कैलकुलेटर</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {relatedLpas.map((relatedLpa) => (
            <li key={relatedLpa}>
              <Link href={`/hi/salary/${salarySlug(relatedLpa)}`}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
                {relatedLpa} LPA इन-हैंड
              </Link>
            </li>
          ))}
          <li>
            <Link href={`/salary/${slug}`}
              className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-ink-soft hover:border-brand hover:text-brand">
              English version →
            </Link>
          </li>
        </ul>
      </section>

    </main>
  );
}
