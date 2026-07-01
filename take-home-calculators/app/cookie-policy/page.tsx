import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, buildJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Cookie Policy — SalaryTools India",
  description: "SalaryTools India cookie policy. Learn what cookies we use, why, and how you can control them.",
  alternates: { canonical: absoluteUrl("/cookie-policy") },
};

const LAST_UPDATED = "1 July 2026";

const jsonLd = buildJsonLd(
  breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Cookie Policy", href: "/cookie-policy" },
  ])
);

export default function CookiePolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Cookie Policy</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Cookie Policy</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-8 text-ink-soft leading-relaxed">

        <section>
          <h2 className="font-display text-xl text-ink mb-3">What Are Cookies</h2>
          <p className="text-sm">
            Cookies are small text files placed on your device by websites you visit. They are
            widely used to make websites work efficiently and to provide information to site owners.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Cookies We Use</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-rule">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper text-left">
                  <th className="px-4 py-2.5 font-medium text-ink-soft">Cookie Type</th>
                  <th className="px-4 py-2.5 font-medium text-ink-soft">Purpose</th>
                  <th className="px-4 py-2.5 font-medium text-ink-soft">Provider</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Analytics", purpose: "Anonymously track pages visited and usage patterns to improve the site", provider: "Google Analytics" },
                  { type: "Advertising", purpose: "Serve relevant advertisements based on browsing history", provider: "Google AdSense" },
                  { type: "Functional", purpose: "Remember your preferences (e.g. dark mode, tax regime selection)", provider: "SalaryTools India" },
                ].map(row => (
                  <tr key={row.type} className="border-b border-rule last:border-0">
                    <td className="px-4 py-2.5 font-medium text-ink">{row.type}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{row.purpose}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{row.provider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">What We Do Not Use Cookies For</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>We do not use cookies to store your salary, tax, or financial data</li>
            <li>We do not use cookies to identify you personally</li>
            <li>We do not sell cookie data to third parties</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">How to Control Cookies</h2>
          <p className="text-sm">
            You can control and delete cookies through your browser settings. Here are links to
            cookie management instructions for popular browsers:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {[
              { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
              { name: "Mozilla Firefox", url: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" },
              { name: "Microsoft Edge", url: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
              { name: "Safari", url: "https://support.apple.com/en-in/guide/safari/sfri11471/mac" },
            ].map(browser => (
              <li key={browser.name}>
                <a href={browser.url} target="_blank" rel="noopener noreferrer"
                  className="text-brand hover:underline">{browser.name}</a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            To opt out of Google Analytics tracking, you can install the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer"
              className="text-brand hover:underline">Google Analytics Opt-out Browser Add-on</a>.
            To opt out of personalised Google Ads, visit{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
              className="text-brand hover:underline">Google Ad Settings</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Changes to This Policy</h2>
          <p className="text-sm">
            We may update this Cookie Policy occasionally. Changes will be posted here with an
            updated date.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-3">Contact</h2>
          <p className="text-sm">
            Questions about cookies?{" "}
            <Link href="/contact" className="text-brand hover:underline">Contact us</Link>.
          </p>
        </section>

      </div>
    </main>
  );
}
