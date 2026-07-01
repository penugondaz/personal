import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, buildJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Terms of Use — SalaryTools India",
  description: "Terms of use for SalaryTools India. By using our free financial calculators, you agree to these terms governing acceptable use, intellectual property, and limitations of liability.",
  alternates: { canonical: absoluteUrl("/terms-of-use") },
};

const LAST_UPDATED = "1 July 2026";

const jsonLd = buildJsonLd(
  breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Terms of Use", href: "/terms-of-use" },
  ])
);

export default function TermsOfUsePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Terms of Use</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Terms of Use</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-8 text-ink-soft leading-relaxed">

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Acceptance of Terms</h2>
          <p className="text-sm">
            By accessing or using SalaryTools India (salarytools.in), you agree to be bound by
            these Terms of Use. If you do not agree to these terms, please do not use our site.
            These terms apply to all visitors and users of the site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Use of the Site</h2>
          <p className="text-sm">You may use SalaryTools India for lawful, personal purposes only. You agree not to:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
            <li>Use the site for any unlawful purpose or in violation of applicable laws</li>
            <li>Attempt to scrape, crawl, or systematically extract data from our site in a manner that burdens our infrastructure</li>
            <li>Use automated bots to excessively access our calculators or content</li>
            <li>Reproduce, republish, or redistribute our calculator tools, code, or content without prior written permission</li>
            <li>Misrepresent results from our calculators as official government calculations or certified financial advice</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Intellectual Property</h2>
          <p className="text-sm">
            All content on SalaryTools India — including but not limited to calculator logic,
            written content, design, and code — is the intellectual property of SalaryTools India
            and its founders, Praveen Penugonda and Venkatesh Babu Gorantla, unless otherwise
            stated. You may not copy, reproduce, distribute, or create derivative works without
            our express written permission.
          </p>
          <p className="mt-3 text-sm">
            You are welcome to <strong className="text-ink">link to any page</strong> on
            SalaryTools India from your website, blog, or social media, with attribution.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Disclaimer of Warranties</h2>
          <p className="text-sm">
            SalaryTools India is provided on an &quot;as is&quot; and &quot;as available&quot;
            basis. We make no warranties, express or implied, regarding the accuracy,
            completeness, reliability, or suitability of the calculators or content for any
            particular purpose. Please see our full{" "}
            <Link href="/disclaimer" className="text-brand hover:underline">Disclaimer</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Limitation of Liability</h2>
          <p className="text-sm">
            To the fullest extent permitted by law, SalaryTools India and its founders shall not
            be liable for any direct, indirect, incidental, special, or consequential damages
            arising from your use of or reliance on this site, including but not limited to
            financial losses resulting from salary negotiation, tax filing, or investment decisions
            made based on our calculators.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Third-Party Links</h2>
          <p className="text-sm">
            Our site may link to third-party websites for reference purposes. We do not control
            these sites and are not responsible for their content, accuracy, or privacy practices.
            Linking does not constitute endorsement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Governing Law</h2>
          <p className="text-sm">
            These Terms of Use are governed by and construed in accordance with the laws of
            India. Any disputes arising from these terms or your use of SalaryTools India shall
            be subject to the exclusive jurisdiction of the courts of Hyderabad, Telangana, India.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Changes to Terms</h2>
          <p className="text-sm">
            We reserve the right to modify these Terms of Use at any time. Changes will be posted
            on this page with an updated &quot;Last updated&quot; date. Continued use of the site
            after any changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Contact</h2>
          <p className="text-sm">
            For questions about these Terms of Use, please{" "}
            <Link href="/contact" className="text-brand hover:underline">contact us</Link>.
          </p>
        </section>

      </div>
    </main>
  );
}
