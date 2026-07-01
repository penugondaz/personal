import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, buildJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact Us — SalaryTools India",
  description: "Get in touch with the SalaryTools India team. Report a calculation error, suggest a new calculator, or ask a question about our tools.",
  alternates: { canonical: absoluteUrl("/contact") },
};

const jsonLd = buildJsonLd(
  breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Contact Us", href: "/contact" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact SalaryTools India",
    "url": absoluteUrl("/contact"),
  }
);

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Contact Us</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Contact Us</h1>
      <p className="mt-4 text-lg text-ink-soft">
        We&apos;d love to hear from you — whether you&apos;ve spotted an error, have a feature
        request, or just want to say hello.
      </p>

      {/* Contact card */}
      <div className="mt-10 rounded-2xl border border-rule bg-surface p-6 shadow-card">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-2xl">
            ✉️
          </div>
          <div>
            <p className="font-semibold text-ink">Email us</p>
            <p className="mt-1 text-sm text-ink-soft">
              We typically respond within 1–2 business days.
            </p>
            <a href="mailto:chaprama2016@gmail.com"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
              chaprama2016@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Reasons to contact */}
      <div className="mt-8 space-y-3">
        <h2 className="font-display text-xl text-ink">What to write to us about</h2>
        {[
          { icon: "🐛", title: "Calculator error or inaccuracy", desc: "Found a number that doesn't look right? Please share the inputs you used and the result you expected — we'll investigate and fix it." },
          { icon: "💡", title: "Suggest a new calculator", desc: "Have a financial calculation you do manually and wish we had a tool for? Tell us — we prioritise suggestions from our users." },
          { icon: "🤝", title: "Business enquiries", desc: "For partnerships, advertising, or licensing our calculators for your platform." },
          { icon: "📝", title: "Content corrections", desc: "Spotted outdated tax rules, incorrect percentages, or missing information on any page? We appreciate the help keeping our content accurate." },
        ].map(item => (
          <div key={item.title} className="flex items-start gap-3 rounded-xl border border-rule bg-surface p-4 shadow-card">
            <span className="text-xl shrink-0">{item.icon}</span>
            <div>
              <p className="font-medium text-ink">{item.title}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Address */}
      <div className="mt-8 rounded-xl border border-rule bg-surface p-5 shadow-card">
        <p className="font-semibold text-ink mb-2">Registered Address</p>
        <p className="text-sm text-ink-soft leading-relaxed">
          SalaryTools India<br />
          Nizampet, Hyderabad — 500090<br />
          Telangana, India
        </p>
      </div>

      <p className="mt-6 text-xs text-ink-soft">
        For tax, legal, or financial advice, please consult a qualified professional. Our
        calculators are educational tools only —{" "}
        <Link href="/disclaimer" className="text-brand hover:underline">see our disclaimer</Link>.
      </p>
    </main>
  );
}
