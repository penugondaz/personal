import type { Metadata } from "next";
import Link from "next/link";
import PmSuryaGharCalculator from "@/components/PmSuryaGharCalculator";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, calculatorSchema, buildJsonLd } from "@/lib/schema";

const TITLE = "PM Surya Ghar Muft Bijli Yojana Calculator 2026 — Subsidy & Savings Calculator";
const DESCRIPTION = "Calculate your PM Surya Ghar subsidy amount, rooftop solar system size, monthly electricity savings, and payback period. Central government gives up to ₹78,000 subsidy on 1-3 kW solar systems.";
const URL = "/calculator/pm-surya-ghar-calculator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(URL),
  },
  keywords: [
    "PM Surya Ghar calculator",
    "PM Surya Ghar Muft Bijli Yojana calculator",
    "rooftop solar subsidy calculator India 2025",
    "solar panel subsidy calculator",
    "pm surya ghar yojana subsidy amount",
    "free electricity scheme calculator",
    "rooftop solar savings calculator India",
    "1kw solar panel subsidy india",
    "2kw solar panel cost after subsidy",
    "3kw solar panel cost after subsidy",
    "solar panel payback period calculator india",
  ],
};

const faqs = [
  {
    question: "What is PM Surya Ghar Muft Bijli Yojana?",
    answer: "PM Surya Ghar Muft Bijli Yojana is a central government scheme launched in February 2024 to provide free electricity to 1 crore households by installing rooftop solar panels. The scheme gives a direct subsidy of up to ₹78,000 on solar systems up to 3 kW, and eligible households can generate 300 units of free electricity per month.",
  },
  {
    question: "How much subsidy do I get under PM Surya Ghar scheme?",
    answer: "The central government subsidy is ₹30,000 per kW for systems up to 2 kW, and ₹18,000 per kW for the additional capacity between 2-3 kW. Maximum subsidy is ₹78,000 for a 3 kW system (₹60,000 + ₹18,000). Many states offer additional subsidies on top of this.",
  },
  {
    question: "Who is eligible for PM Surya Ghar Yojana?",
    answer: "Any Indian household with a valid residential electricity connection is eligible. There is no income limit — all categories of households can apply. The property must have a suitable rooftop, and you must get the system installed through an MNRE-empanelled vendor. The application is done online at pmsuryaghar.gov.in.",
  },
  {
    question: "How many free units of electricity will I get?",
    answer: "The scheme provides approximately 300 free units per month for a 3 kW system. The exact amount depends on your system size and location. A 1 kW system generates about 100 units/month, a 2 kW generates ~200 units/month, and a 3 kW generates ~300 units/month. Surplus electricity is sold back to the grid via net metering.",
  },
  {
    question: "What is the cost of a solar system after PM Surya Ghar subsidy?",
    answer: "A 1 kW system costs approximately ₹65,000 gross — after the ₹30,000 subsidy, your cost is ₹35,000. A 2 kW system costs ₹1,30,000 gross — after ₹60,000 subsidy, your cost is ₹70,000. A 3 kW system costs ₹1,95,000 gross — after ₹78,000 subsidy, your cost is ₹1,17,000. Prices vary by state and vendor.",
  },
  {
    question: "How long does it take to get PM Surya Ghar subsidy?",
    answer: "After the solar system is installed and the net meter is connected, the subsidy is typically credited to your bank account within 30 days. The entire process from registration to installation usually takes 30–60 days depending on your DISCOM's processing time.",
  },
  {
    question: "How do I apply for PM Surya Ghar Yojana?",
    answer: "Apply online at pmsuryaghar.gov.in. You need your electricity consumer number, Aadhaar, and bank account details. After registration, your DISCOM approves the installation, you get it installed by an empanelled vendor, and the subsidy is disbursed after net meter installation.",
  },
  {
    question: "What is the payback period for rooftop solar under this scheme?",
    answer: "With the PM Surya Ghar subsidy, the payback period for a 2-3 kW system is typically 4-6 years depending on your state's electricity rate. In states with high electricity rates (₹7-9/unit) like Maharashtra and Karnataka, payback can be as low as 3-4 years. After payback, the system generates free electricity for another 20+ years.",
  },
];

export default function PmSuryaGharPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Calculators", href: "/calculator" },
      { name: "PM Surya Ghar Calculator", href: URL },
    ]),
    calculatorSchema({
      name: "PM Surya Ghar Muft Bijli Yojana Calculator",
      description: DESCRIPTION,
      url: URL,
    }),
    faqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "GovernmentService",
      "name": "PM Surya Ghar Muft Bijli Yojana",
      "description": "Central government scheme providing rooftop solar subsidies of up to ₹78,000 to 1 crore households in India",
      "provider": {
        "@type": "GovernmentOrganization",
        "name": "Ministry of New and Renewable Energy, Government of India",
      },
      "serviceType": "Rooftop Solar Subsidy",
      "areaServed": {
        "@type": "Country",
        "name": "India",
      },
      "url": "https://pmsuryaghar.gov.in",
    }
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/calculator" className="hover:text-brand">Calculators</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">PM Surya Ghar Calculator</span>
      </nav>

      {/* Hero */}
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-surface px-3 py-1 text-xs font-medium text-brand">
        🌞 Updated for FY 2025-26
      </div>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        PM Surya Ghar Muft Bijli Yojana Calculator
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Find out how much <strong className="text-ink">central government subsidy</strong> you get,
        what size solar system you need, and how much you save on electricity bills every month.
        The scheme gives up to{" "}
        <strong className="text-brand">₹78,000 subsidy</strong> and{" "}
        <strong className="text-brand">300 free units/month</strong>.
      </p>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Max subsidy", value: "₹78,000", icon: "💰" },
          { label: "Free units/month", value: "300 units", icon: "⚡" },
          { label: "Target households", value: "1 crore", icon: "🏠" },
          { label: "System lifetime", value: "25 years", icon: "☀️" },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-rule bg-surface p-3 text-center shadow-card">
            <p className="text-xl">{stat.icon}</p>
            <p className="tabular mt-1 font-display text-lg font-bold text-ink">{stat.value}</p>
            <p className="text-xs text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Calculator */}
      <div className="mt-10">
        <PmSuryaGharCalculator />
      </div>

      {/* About the scheme */}
      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink">About PM Surya Ghar Muft Bijli Yojana</h2>
        <div className="mt-4 space-y-3 text-ink-soft text-sm leading-relaxed">
          <p>
            Launched by Prime Minister Narendra Modi in February 2024, PM Surya Ghar Muft Bijli Yojana
            is one of the largest rooftop solar schemes in the world. The scheme aims to install
            rooftop solar panels in 1 crore households across India, making India a global leader
            in renewable energy.
          </p>
          <p>
            Under the scheme, households installing 1-3 kW rooftop solar systems receive a direct
            subsidy of up to ₹78,000 from the central government. The solar system connects to
            the grid via net metering — surplus electricity generated by your panels is exported
            to the grid, and you get credit against your future bills.
          </p>
          <p>
            A 3 kW system generates approximately 300-360 units of electricity per month — enough
            to cover the average Indian household&apos;s consumption entirely. The scheme effectively
            makes electricity free for participating households after the payback period of 4-6 years.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map(faq => (
            <div key={faq.question} className="border-b border-rule pb-4">
              <h3 className="font-medium text-ink">{faq.question}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: "/calculator/fire-calculator", label: "FIRE Calculator" },
            { href: "/calculator/epf-calculator", label: "EPF Calculator" },
            { href: "/calculator/sip-calculator", label: "SIP Calculator" },
            { href: "/calculator/fd-calculator", label: "FD Calculator" },
            { href: "/tax-saving", label: "Tax Saving Guide" },
            { href: "/calculator/old-vs-new-tax-regime", label: "Old vs New Tax Regime" },
          ].map(l => (
            <li key={l.href}>
              <Link href={l.href}
                className="block rounded-md border border-rule bg-surface px-4 py-3 text-center text-sm font-medium text-brand hover:border-brand">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
