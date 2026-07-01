import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, buildJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Disclaimer — SalaryTools India",
  description: "SalaryTools India disclaimer. Our calculators are for educational purposes only and do not constitute financial, tax, or legal advice. Results are estimates.",
  alternates: { canonical: absoluteUrl("/disclaimer") },
};

const LAST_UPDATED = "1 July 2026";

const jsonLd = buildJsonLd(
  breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Disclaimer", href: "/disclaimer" },
  ])
);

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Disclaimer</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Disclaimer</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated: {LAST_UPDATED}</p>

      <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5">
        <p className="font-semibold text-orange-800">Important Notice</p>
        <p className="mt-1 text-sm text-orange-700">
          The calculators and content on SalaryTools India are for educational and informational
          purposes only. They do not constitute financial, tax, investment, or legal advice.
          Please consult a qualified professional for advice specific to your situation.
        </p>
      </div>

      <div className="mt-8 space-y-8 text-ink-soft leading-relaxed">

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Accuracy of Calculations</h2>
          <p className="text-sm">
            SalaryTools India makes every effort to ensure the accuracy of its calculators and
            to keep them updated with current tax slabs, PF rates, interest rates, and government
            rules. However, all results are <strong className="text-ink">estimates only</strong>.
            Actual figures will depend on your specific employer&apos;s salary structure, your
            HR&apos;s payroll system, your individual tax situation, and applicable local rules.
          </p>
          <p className="mt-3 text-sm">
            Key assumptions used in our calculators include:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
            <li>Basic salary is assumed at 40% of CTC (industry average; actual varies by employer)</li>
            <li>HRA is assumed at 50% of basic salary</li>
            <li>Standard deduction of ₹75,000 (new regime) or ₹50,000 (old regime) as applicable</li>
            <li>PF calculated on actual basic salary unless otherwise specified</li>
            <li>Professional tax applied at standard state rates (Maharashtra default)</li>
            <li>Gratuity calculated as per Payment of Gratuity Act 1972</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Not Financial or Tax Advice</h2>
          <p className="text-sm">
            Nothing on SalaryTools India constitutes financial, investment, tax, or legal advice.
            The calculators and articles are provided for general informational and educational
            purposes only. You should not make financial decisions — including salary negotiations,
            tax regime selection, investment choices, or loan decisions — solely based on our
            calculators without consulting a qualified professional.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Tax Rules Change</h2>
          <p className="text-sm">
            Indian income tax slabs, deduction limits, PF interest rates, and other statutory
            figures change periodically. While we endeavour to update our calculators promptly
            after each Union Budget and relevant government notifications, there may be a delay
            between a rule change and its reflection on this site. Always verify the latest rules
            from official sources such as the{" "}
            <a href="https://incometaxindia.gov.in" target="_blank" rel="noopener noreferrer"
              className="text-brand hover:underline">Income Tax Department</a>,{" "}
            <a href="https://www.epfindia.gov.in" target="_blank" rel="noopener noreferrer"
              className="text-brand hover:underline">EPFO</a>, or your tax consultant.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">No Warranty</h2>
          <p className="text-sm">
            SalaryTools India is provided &quot;as is&quot; without any warranty, express or
            implied. We do not warrant that the site will be error-free, uninterrupted, or free
            from viruses or other harmful components. We are not liable for any loss or damage
            arising from your use of or reliance on the information provided on this site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Third-Party Content</h2>
          <p className="text-sm">
            Our site may reference third-party sources (government portals, news articles, and
            research). We are not responsible for the accuracy, completeness, or timeliness of
            third-party content. Links to external sites do not constitute endorsement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Contact</h2>
          <p className="text-sm">
            If you believe any information on our site is inaccurate, please{" "}
            <Link href="/contact" className="text-brand hover:underline">contact us</Link> and we
            will investigate promptly.
          </p>
        </section>

      </div>
    </main>
  );
}
