import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/paths";
import { breadcrumbSchema, webPageSchema, faqSchema, buildJsonLd } from "@/lib/schema";
import LandingHubLinks from "@/components/LandingHubLinks";
import LandingFaq from "@/components/LandingFaq";

const URL = "/real-estate";
const TITLE = "Real Estate Calculators India — Home Affordability, Stamp Duty, Rent vs Buy";
const DESCRIPTION =
  "Free real estate calculators for India. Calculate home affordability from salary, stamp duty by state, rental yield, rent vs buy comparison, and property appreciation.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(URL) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(URL) },
};

const QUICK_GLANCE = [
  { icon: "🏠", label: "Affordability", desc: "Max home budget from salary" },
  { icon: "⚖️", label: "Rent vs Buy", desc: "20-year net worth comparison" },
  { icon: "📊", label: "Rental Yield", desc: "Gross & net yield on a property" },
  { icon: "📋", label: "Stamp Duty", desc: "State-wise, all 22 states" },
  { icon: "📝", label: "Registration", desc: "Total buying cost breakdown" },
  { icon: "📈", label: "Appreciation", desc: "Future value by city" },
];

const CALCULATORS = [
  { href: "/real-estate/home-affordability-calculator", emoji: "🏠", title: "Home Affordability Calculator", desc: "How much home can you afford based on your salary? Find your max loan, down payment, and property budget." },
  { href: "/real-estate/rent-vs-buy-calculator", emoji: "⚖️", title: "Rent vs Buy Calculator", desc: "Compare 20-year net worth from buying vs renting. Accounts for EMI, appreciation, and investment returns." },
  { href: "/real-estate/rental-yield-calculator", emoji: "📊", title: "Rental Yield Calculator", desc: "Calculate gross and net rental yield on any property. Benchmark against Indian market averages." },
  { href: "/real-estate/stamp-duty-calculator", emoji: "📋", title: "Stamp Duty Calculator", desc: "State-wise stamp duty and registration charges for all 22 states. Includes female owner discounts." },
  { href: "/real-estate/registration-charges-calculator", emoji: "📝", title: "Registration Charges Calculator", desc: "Calculate property registration charges, legal fees, and total buying cost by state." },
  { href: "/real-estate/property-appreciation-calculator", emoji: "📈", title: "Property Appreciation Calculator", desc: "Project future property value with city-wise historical appreciation rates and year-by-year breakdown." },
];

const FAQS = [
  {
    question: "How much home loan can I get based on my salary?",
    answer:
      "Most Indian banks lend up to 4-5× your annual gross salary, provided your total EMI obligations (including the new home loan) stay within roughly 40-50% of your monthly take-home pay. The exact figure depends on your credit score, existing loans, and the lender's policy — the Home Affordability Calculator models this using your actual numbers.",
  },
  {
    question: "Is it better to rent or buy in India?",
    answer:
      "It depends on your city, how long you plan to stay, and whether the rent-to-price ratio favors renting. In most metro cities, renting and investing the difference can outperform buying over 10-15 years unless property appreciation is unusually strong or you value the stability of owning. Run the Rent vs Buy Calculator with your actual city's numbers to see which wins for your situation.",
  },
  {
    question: "How is stamp duty calculated in India?",
    answer:
      "Stamp duty is charged as a percentage of the property's market value or the transaction value, whichever is higher — and the rate varies by state, typically ranging from 3% to 7%. Many states offer a 1-2% discount when the property is registered in a woman's name, which the Stamp Duty Calculator accounts for.",
  },
  {
    question: "What's a good rental yield in India?",
    answer:
      "Gross rental yields in most Indian cities range from 2-4%, which is low compared to global markets. Properties in Tier-2 cities or peripheral areas of metros sometimes yield 4-6%. If you're buying primarily for rental income rather than appreciation, a yield below 3% is usually a signal to look elsewhere or negotiate the price down.",
  },
];

export default function RealEstateLandingPage() {
  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Real Estate Calculators", href: URL },
    ]),
    webPageSchema({ name: TITLE, description: DESCRIPTION, url: URL }),
    faqSchema(FAQS)
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">Real Estate Calculators</span>
      </nav>

      <h1 className="font-display text-3xl text-ink sm:text-4xl">Real Estate Calculators</h1>
      <p className="mt-4 text-lg text-ink-soft max-w-2xl">
        Every calculator you need for India&apos;s property market — from figuring out how much home
        you can afford on your salary, to stamp duty by state, rental yield, and 20-year rent vs buy analysis.
      </p>

      {/* Quick glance */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_GLANCE.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-rule bg-surface px-4 py-3 shadow-card">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-medium text-ink">{item.label}</p>
              <p className="text-xs text-ink-soft">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CALCULATORS.map(calc => (
          <Link key={calc.href} href={calc.href}
            className="group flex flex-col rounded-2xl border border-rule bg-surface p-5 shadow-card hover:border-brand hover:-translate-y-0.5 transition">
            <span className="text-3xl mb-3">{calc.emoji}</span>
            <p className="font-semibold text-ink group-hover:text-brand transition">{calc.title}</p>
            <p className="mt-2 text-sm text-ink-soft flex-1">{calc.desc}</p>
            <span className="mt-4 text-sm font-medium text-brand">Calculate →</span>
          </Link>
        ))}
      </div>

      <section className="mt-14 rounded-xl border border-brand/20 bg-brand-soft p-6">
        <h2 className="font-display text-xl text-ink">Planning to buy a home?</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Start with the Home Affordability Calculator to know your budget, then use Stamp Duty to estimate
          registration costs, and run a Rent vs Buy comparison to make the final call.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/real-estate/home-affordability-calculator"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
            Check Affordability →
          </Link>
          <Link href="/calculator/emi-calculator"
            className="rounded-full border border-brand px-5 py-2 text-sm font-medium text-brand hover:bg-brand-soft transition">
            EMI Calculator
          </Link>
        </div>
      </section>

      {/* Educational content */}
      <section className="mt-12 max-w-3xl">
        <h2 className="font-display text-2xl text-ink">How Home Buying Costs Work in India</h2>
        <p className="mt-3 text-ink-soft">
          Buying property in India involves more than just the sale price. On top of the
          agreement value, buyers pay stamp duty (3-7% depending on the state), registration
          charges (typically around 1%), legal and documentation fees, and often GST on
          under-construction properties. Together these can add 7-10% to your effective purchase
          cost — a figure many first-time buyers underestimate when budgeting.
        </p>
        <p className="mt-3 text-ink-soft">
          On the financing side, banks typically fund 75-90% of the property value (loan-to-value
          ratio), meaning you need the remaining 10-25% as a down payment plus the stamp duty and
          registration costs in cash upfront. Whether buying makes more financial sense than
          renting depends heavily on your city&apos;s price-to-rent ratio, how long you plan to
          stay, and what alternative return your down payment could earn if invested instead —
          which is exactly what the Rent vs Buy Calculator models.
        </p>
      </section>

      <LandingFaq faqs={FAQS} />
      <div className="max-w-3xl">
        <LandingHubLinks currentHref={URL} />
      </div>
    </main>
  );
}
