import type { Metadata } from "next";
import Link from "next/link";
import LayoffRiskCalculator from "@/components/LayoffRiskCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "Layoff Risk Calculator — What Is Your Probability of Being Laid Off?";
const description =
  "Estimate your personal layoff risk score (0–100) based on company health, department risk, AI automation exposure, individual performance, and industry outlook. Free, private, and data-driven.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/layoff-risk-calculator") },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/calculator/layoff-risk-calculator"),
  },
  keywords: [
    "layoff risk calculator",
    "am I going to be laid off",
    "job loss risk calculator",
    "layoff probability India",
    "AI job replacement risk",
    "tech layoff risk score",
    "will I be laid off calculator",
    "job security calculator India",
  ],
};

const faqs = [
  {
    question: "How accurate is the Layoff Risk Calculator?",
    answer:
      "This calculator is not a prediction tool — it estimates relative risk based on publicly known patterns from thousands of layoff events since 2022. It uses a weighted model across company health (40%), department risk (20%), individual factors (20%), AI automation risk (10%), and industry outlook (10%). Think of it like a credit score: it gives you a data-informed signal, not a certainty.",
  },
  {
    question: "What factors most increase layoff risk?",
    answer:
      "The highest-risk signals are: company in a hiring freeze, significant recent layoffs at your company, declining revenue or low cash runway, working in high-risk departments like Recruiting or Marketing, being in a role with high AI automation potential, and short tenure (under 1 year).",
  },
  {
    question: "Which departments get cut first during layoffs?",
    answer:
      "Historically, the first departments to be cut are Recruiting/TA (since hiring stops), Marketing, Customer Support, DEI, Content, and HR/L&D. Core engineering, security, and revenue-generating roles tend to be protected the longest.",
  },
  {
    question: "Which job roles are most at risk from AI automation?",
    answer:
      "Data entry operators, customer support executives, content writers, translators, social media managers, and certain accounting and HR roles face the highest AI displacement risk. Roles requiring system design, creative judgment, physical presence, or human relationships are more protected.",
  },
  {
    question: "Does working remotely increase my layoff risk?",
    answer:
      "Remote workers — especially those in a different country from HQ — do face slightly higher layoff risk when companies downsize, because they are often in lower-cost locations and face timezone/collaboration friction. Fully in-office employees in the same city as HQ tend to have better visibility to leadership.",
  },
  {
    question: "How do I reduce my layoff risk score?",
    answer:
      "The most effective ways to reduce risk: build unique, hard-to-replace domain knowledge; move into roles with strong AI demand (ML, cloud, security); increase visibility to senior leaders by owning high-impact projects; build a track record of measurable business impact; and have 6–12 months emergency savings as a buffer.",
  },
  {
    question: "What is a safe layoff risk score?",
    answer:
      "Scores of 0–20 are Very Safe, 21–40 are Low Risk. Most people in stable companies, in-demand roles, with good performance ratings will score between 25–45. Scores above 60 warrant active preparation, and above 80 suggest immediate job search activity.",
  },
  {
    question: "Is my data stored or shared?",
    answer:
      "No. All calculations happen entirely in your browser. No personal data is sent to any server or stored anywhere. Your inputs are private.",
  },
];

export default function LayoffRiskCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Layoff Risk Calculator</span>
      </nav>

      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-deduction/10 px-3 py-1 text-xs font-semibold text-deduction">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-deduction opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-deduction" />
        </span>
        Free · Private · No signup required
      </div>

      <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
        Layoff Risk Calculator
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Get a personalised layoff risk score (0–100) based on your company&apos;s health, your
        department, your performance, and AI automation risk for your role. Takes 2 minutes.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 text-center">
        {[
          { icon: "🏢", label: "Company Health", weight: "40%" },
          { icon: "👥", label: "Dept & Team", weight: "20%" },
          { icon: "🧑‍💼", label: "Your Profile", weight: "20%" },
          { icon: "🤖", label: "AI Risk", weight: "10%" },
        ].map(f => (
          <div key={f.label} className="rounded-xl border border-rule bg-surface px-3 py-3">
            <div className="text-xl">{f.icon}</div>
            <p className="mt-1 text-xs font-medium text-ink">{f.label}</p>
            <p className="text-xs text-ink-soft">{f.weight} weight</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-rule bg-surface p-6 shadow-card-lg sm:p-8">
        <LayoffRiskCalculator />
      </div>

      <p className="mt-4 text-xs text-ink-soft text-center">
        This is an estimation tool, not a guarantee. Risk scores are based on general layoff patterns
        and should not be taken as professional career or legal advice.
      </p>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink">How the Scoring Model Works</h2>
        <p className="mt-3 text-ink-soft">
          The Layoff Risk Score is a weighted composite of five factor groups, designed to reflect
          how real-world layoff decisions are made. Company-level signals carry the most weight
          because macro company health is the strongest predictor of workforce reductions.
        </p>
        <div className="mt-5 space-y-3">
          {[
            { label: "Company Health", weight: "40%", desc: "Size, funding stage, revenue growth, profitability, stock performance, hiring trend, recent layoffs, and leadership stability." },
            { label: "Department & Team Risk", weight: "20%", desc: "Some departments (Recruiting, Marketing, Content) are historically cut first. Team budget cuts and peer layoffs are leading indicators." },
            { label: "Individual Profile", weight: "20%", desc: "Tenure, performance rating, visibility to leadership, remote vs in-office status, and replaceability of your domain knowledge." },
            { label: "AI Automation Risk", weight: "10%", desc: "Based on a database of 90+ job roles scored for AI displacement risk, adjusted by your most in-demand skill." },
            { label: "Industry Outlook", weight: "10%", desc: "Industry-level layoff risk across 55+ sectors, combined with geography risk for your market." },
          ].map(f => (
            <div key={f.label} className="flex gap-4 rounded-xl border border-rule bg-surface p-4">
              <div className="shrink-0 w-12 text-right">
                <span className="font-display text-xl font-bold text-brand">{f.weight}</span>
              </div>
              <div>
                <p className="font-medium text-ink">{f.label}</p>
                <p className="mt-0.5 text-sm text-ink-soft">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Risk Score Bands</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left">
                <th className="px-4 py-2.5 font-medium text-ink-soft">Score</th>
                <th className="px-4 py-2.5 font-medium text-ink-soft">Band</th>
                <th className="px-4 py-2.5 font-medium text-ink-soft">What it means</th>
              </tr>
            </thead>
            <tbody>
              {[
                { range: "0–20",   label: "Very Safe",     color: "#16a34a", desc: "Strong protective factors, stable environment" },
                { range: "21–40",  label: "Low Risk",      color: "#65a30d", desc: "Generally stable, minor risks present" },
                { range: "41–60",  label: "Moderate Risk", color: "#d97706", desc: "Noticeable signals — take proactive steps" },
                { range: "61–80",  label: "High Risk",     color: "#ea580c", desc: "Multiple red flags — begin job search prep" },
                { range: "81–100", label: "Critical Risk", color: "#dc2626", desc: "Severe signals — act immediately" },
              ].map(b => (
                <tr key={b.range} className="border-b border-rule last:border-0">
                  <td className="tabular px-4 py-2.5 font-mono font-medium" style={{ color: b.color }}>{b.range}</td>
                  <td className="px-4 py-2.5 font-medium" style={{ color: b.color }}>{b.label}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{b.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-rule pb-4">
              <h3 className="font-medium text-ink">{faq.question}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Tools</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: "/layoffs", label: "India Layoffs Tracker 🔴" },
            { href: "/calculator/epf-calculator", label: "EPF Calculator" },
            { href: "/calculator/goal-planning-calculator", label: "Emergency Fund Planner" },
            { href: "/salary", label: "In-Hand Salary Calculator" },
            { href: "/calculator/sip-calculator", label: "SIP Calculator" },
            { href: "/salary-growth", label: "Salary Growth Projection" },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
