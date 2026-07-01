import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, buildJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Privacy Policy — SalaryTools India",
  description: "SalaryTools India privacy policy. We do not collect personal financial data. All calculations run in your browser. Learn how we handle data and cookies.",
  alternates: { canonical: absoluteUrl("/privacy-policy") },
};

const LAST_UPDATED = "1 July 2026";

const jsonLd = buildJsonLd(
  breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ])
);

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Privacy Policy</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-8 text-ink-soft leading-relaxed">

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Overview</h2>
          <p>
            SalaryTools India (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is operated by
            Praveen Penugonda and Venkatesh Babu Gorantla, based in Hyderabad, India. We are
            committed to protecting your privacy. This policy explains what data we collect (if
            any), how we use it, and your rights.
          </p>
          <p className="mt-3">
            <strong className="text-ink">The short version:</strong> All calculations on
            SalaryTools India run entirely in your browser. We do not collect, store, or transmit
            the salary, tax, or financial figures you enter into our calculators. We do not require
            you to create an account or provide any personal information to use our tools.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Information We Do Not Collect</h2>
          <p>We do not collect:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
            <li>Your name, email address, or contact information (unless you contact us directly)</li>
            <li>Your salary, income, tax, or any other financial figures entered into calculators</li>
            <li>Your date of birth, PAN, Aadhaar, or any government identification</li>
            <li>Your bank account details or investment information</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Information We May Collect</h2>

          <h3 className="font-semibold text-ink mt-4 mb-2">1. Usage Data (Analytics)</h3>
          <p className="text-sm">
            We may use Google Analytics or similar tools to collect anonymous usage data such as
            pages visited, time spent on pages, device type, and approximate geographic location
            (country/city level). This data is aggregated and cannot identify you personally. It
            helps us understand which calculators are most useful and improve our site.
          </p>

          <h3 className="font-semibold text-ink mt-4 mb-2">2. Advertising (Google AdSense)</h3>
          <p className="text-sm">
            We may display advertisements served by Google AdSense. Google may use cookies to
            serve ads based on your prior visits to this and other websites. You can opt out of
            personalised advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
              className="text-brand hover:underline">Google Ad Settings</a>.
          </p>

          <h3 className="font-semibold text-ink mt-4 mb-2">3. Email Communications</h3>
          <p className="text-sm">
            If you email us at chaprama2016@gmail.com, we will retain your email address and the
            content of your message to respond to your query. We will not add you to any mailing
            list or use your email for marketing without your explicit consent.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Cookies</h2>
          <p className="text-sm">
            Our site may use cookies for analytics and advertising purposes. You can control or
            disable cookies through your browser settings. For more information, see our{" "}
            <Link href="/cookie-policy" className="text-brand hover:underline">Cookie Policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Third-Party Links</h2>
          <p className="text-sm">
            Our site may contain links to external websites (such as the Income Tax Department,
            EPFO, or PMSURYAGHAR portal). We are not responsible for the privacy practices of
            those sites and encourage you to read their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Children&apos;s Privacy</h2>
          <p className="text-sm">
            SalaryTools India is not directed at children under 13 years of age. We do not
            knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Changes to This Policy</h2>
          <p className="text-sm">
            We may update this Privacy Policy from time to time. Changes will be posted on this
            page with an updated &quot;Last updated&quot; date. Continued use of our site after
            changes constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Contact Us</h2>
          <p className="text-sm">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:chaprama2016@gmail.com" className="text-brand hover:underline">
              chaprama2016@gmail.com
            </a>{" "}
            or visit our{" "}
            <Link href="/contact" className="text-brand hover:underline">Contact page</Link>.
          </p>
        </section>

      </div>
    </main>
  );
}
