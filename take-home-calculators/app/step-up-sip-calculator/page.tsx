import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import StepUpSipCalculator from "@/components/StepUpSipCalculator";

const title = "Step-Up SIP Calculator — Annual Top-Up SIP Returns India";
const description = "Calculate how your mutual fund SIP grows when you increase your monthly investment by a fixed % every year. Compare step-up vs flat SIP corpus over 1–40 years.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/step-up-sip-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/step-up-sip-calculator") },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link><span className="mx-1.5">/</span><Link href="/calculator/sip-calculator" className="hover:text-brand">SIP Calculator</Link><span className="mx-1.5">/</span><span aria-current="page">Step-Up SIP</span>
      </nav>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Step-Up SIP Calculator</h1>
      <p className="mt-4 text-lg text-ink-soft">Calculate how your corpus grows when you increase your monthly SIP by a fixed % every year — matching salary hikes. Compare step-up vs flat SIP side by side.</p>
      <StepUpSipCalculator />
    </main>
  );
}
