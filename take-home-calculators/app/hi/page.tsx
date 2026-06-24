import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { SALARY_LPA_VALUES, salarySlug } from "@/lib/salary-data";
import { calculateSalaryBreakup } from "@/lib/calculators/salary-breakup";
import { formatINR } from "@/lib/format";

export const metadata: Metadata = {
  title: "सैलरी टूल्स इंडिया — इन-हैंड सैलरी, टैक्स, EPF कैलकुलेटर",
  description:
    "भारत के लिए फ्री सैलरी कैलकुलेटर। CTC से इन-हैंड सैलरी, इनकम टैक्स, EPF, SIP और निवेश कैलकुलेटर। FY 2025-26 के नियमों के अनुसार।",
  alternates: {
    canonical: absoluteUrl("/hi"),
    languages: { "en": absoluteUrl("/"), "hi": absoluteUrl("/hi") },
  },
};

const POPULAR_LPAS = [5, 6, 8, 10, 12, 15, 20, 25];

export default function HindiHomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">

      {/* Language switcher */}
      <div className="mb-6 flex items-center gap-3 text-sm">
        <Link href="/" className="rounded-full border border-rule px-3 py-1 text-ink-soft hover:border-brand hover:text-brand">
          English
        </Link>
        <span className="rounded-full border border-brand bg-brand-soft px-3 py-1 font-medium text-brand">
          हिंदी
        </span>
      </div>

      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-surface px-3 py-1 text-xs font-medium text-brand">
          FY 2025-26 के टैक्स नियम लागू
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold text-ink sm:text-5xl">
          भारत का सैलरी और फाइनेंस कैलकुलेटर
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft">
          सैलरी, टैक्स, EPF, निवेश — अपनी कमाई को पूरी तरह समझें। फ्री, प्राइवेट, कोई साइनअप नहीं।
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/hi/salary/10-lpa-in-hand" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition">
            इन-हैंड सैलरी कैलकुलेट करें →
          </Link>
          <Link href="/salary" className="rounded-full border border-rule px-6 py-3 text-sm font-medium text-ink hover:border-brand hover:text-brand transition">
            सभी कैलकुलेटर देखें
          </Link>
        </div>
      </div>

      {/* Salary quick pick */}
      <section className="mt-14">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">CTC के अनुसार इन-हैंड सैलरी</h2>
          <Link href="/salary" className="text-sm font-medium text-brand hover:underline">सभी →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {POPULAR_LPAS.map((lpa) => {
            const result = calculateSalaryBreakup({ annualCtc: lpa * 100_000, regime: "new" });
            return (
              <Link key={lpa} href={`/hi/salary/${salarySlug(lpa)}`}
                className="block rounded-xl border border-rule bg-surface px-3 py-3 shadow-card transition hover:-translate-y-0.5 hover:border-brand text-center">
                <span className="font-display text-lg font-semibold text-ink">{lpa} LPA</span>
                <p className="tabular mt-1 text-[11px] text-ink-soft">{formatINR(result.inHandMonthly)}<span className="text-[10px]">/माह</span></p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Calculator categories */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-ink mb-5">सभी कैलकुलेटर</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { emoji: "💰", title: "सैलरी कैलकुलेटर", desc: "CTC से इन-हैंड, सैलरी स्ट्रक्चर, हाइक कैलकुलेटर", href: "/salary" },
            { emoji: "🧾", title: "टैक्स सेविंग", desc: "80C, NPS, HRA, पुराना vs नया टैक्स रिजीम", href: "/tax-saving" },
            { emoji: "🏦", title: "रिटायरमेंट", desc: "EPF, PPF, NPS, ग्रेच्युटी कैलकुलेटर", href: "/calculator/epf-calculator" },
            { emoji: "📈", title: "निवेश", desc: "SIP, लमसम, SWP, गोल प्लानिंग", href: "/calculator/sip-calculator" },
            { emoji: "🏠", title: "लोन और डिपॉजिट", desc: "EMI, FD, RD, कम्पाउंड इंटरेस्ट", href: "/calculator/emi-calculator" },
            { emoji: "🔥", title: "FIRE कैलकुलेटर", desc: "जल्दी रिटायरमेंट की प्लानिंग करें", href: "/calculator/fire-calculator" },
          ].map(cat => (
            <Link key={cat.title} href={cat.href}
              className="flex items-start gap-3 rounded-xl border border-rule bg-surface p-4 shadow-card hover:border-brand hover:-translate-y-0.5 transition">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-xl">{cat.emoji}</span>
              <div>
                <p className="font-semibold text-ink">{cat.title}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Salary growth section */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">सैलरी ग्रोथ — 5 और 10 साल में</h2>
          <Link href="/salary-growth" className="text-sm font-medium text-brand hover:underline">सभी →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[5, 8, 10, 15].map(lpa => (
            <Link key={lpa} href={`/hi/salary-growth/${lpa}-lpa`}
              className="block rounded-xl border border-rule bg-surface px-3 py-3 shadow-card hover:border-brand transition text-center">
              <span className="font-semibold text-ink">{lpa} LPA</span>
              <p className="text-xs text-ink-soft mt-0.5">5/10 साल में कितना?</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tax saving section */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">टैक्स सेविंग गाइड — सैलरी के अनुसार</h2>
          <Link href="/tax-saving" className="text-sm font-medium text-brand hover:underline">सभी →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[5, 8, 10, 15].map(lpa => (
            <Link key={lpa} href={`/hi/tax-saving/${lpa}-lpa`}
              className="block rounded-xl border border-rule bg-surface px-3 py-3 shadow-card hover:border-brand transition text-center">
              <span className="font-semibold text-ink">{lpa} LPA</span>
              <p className="text-xs text-ink-soft mt-0.5">टैक्स बचाने के तरीके</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why CTC note */}
      <section className="mt-12">
        <div className="rounded-2xl border border-rule bg-surface px-6 py-7">
          <h2 className="font-display text-xl font-semibold text-ink">CTC और इन-हैंड सैलरी में फर्क क्यों होता है?</h2>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            जब कोई कंपनी आपको "10 LPA" ऑफर करती है, तो यह आपका CTC (Cost to Company) होता है — 
            वो कुल राशि जो कंपनी आप पर खर्च करती है। इसमें आपकी बेसिक सैलरी, HRA, एम्प्लॉयर का PF योगदान, 
            और ग्रेच्युटी सब शामिल होते हैं। लेकिन PF और ग्रेच्युटी का हिस्सा आपके बैंक अकाउंट में 
            मासिक नहीं आता। इसके ऊपर, आपकी सैलरी से PF और इनकम टैक्स भी कटता है। इसीलिए 
            इन-हैंड सैलरी CTC से काफी कम होती है।
          </p>
          <Link href="/hi/salary/10-lpa-in-hand" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
            अपनी सैलरी का पूरा ब्रेकडाउन देखें →
          </Link>
        </div>
      </section>

    </main>
  );
}
