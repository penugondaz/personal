import type { Metadata } from "next";
import Link from "next/link";
import FireCalculator from "@/components/FireCalculator";
import { absoluteUrl } from "@/lib/paths";

const title = "FIRE Calculator India — Financial Independence & Early Retirement Calculator";
const description =
  "Calculate your FIRE number, retirement corpus, and monthly investment needed to retire early in India. Supports Lean FIRE, Standard FIRE, and Fat FIRE with inflation-adjusted projections.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/calculator/fire-calculator") },
  openGraph: { title, description, url: absoluteUrl("/calculator/fire-calculator") },
  keywords: [
    "FIRE calculator India", "financial independence calculator", "retirement corpus calculator",
    "early retirement calculator", "FIRE number calculator", "how much money do I need to retire",
    "can I retire early", "lean FIRE", "fat FIRE", "4% rule calculator India",
  ],
};

const faqs = [
  {
    question: "What is FIRE?",
    answer: "FIRE stands for Financial Independence, Retire Early. It is a movement focused on saving and investing aggressively — typically 50–70% of income — so you can retire far earlier than the traditional retirement age of 60. The goal is to build a corpus large enough that the returns from your investments cover your living expenses forever, freeing you from mandatory employment.",
  },
  {
    question: "How much money do I need to retire in India?",
    answer: "The amount depends on your monthly expenses, desired lifestyle, and when you plan to retire. A common formula is: Required Corpus = (Monthly Expenses × 12 × 25). For example, if your current monthly expenses are ₹60,000, you need approximately ₹1.8 crore at today's value — but after adjusting for inflation over 15 years at 6%, the actual corpus needed could be ₹4–5 crore.",
  },
  {
    question: "What is the 4% rule and does it apply in India?",
    answer: "The 4% rule (also called the Safe Withdrawal Rate) says you can safely withdraw 4% of your retirement corpus every year without running out of money for 30+ years. This is equivalent to saving 25× your annual expenses. In India, where inflation has historically been higher (5–7%), some planners prefer a 3–3.5% withdrawal rate (28–33× expenses) to be conservative.",
  },
  {
    question: "What is Lean FIRE?",
    answer: "Lean FIRE targets a minimal lifestyle with lower spending. It uses a 20× annual expenses multiplier (5% withdrawal rate). This requires a smaller corpus and lets you retire sooner, but leaves less buffer for lifestyle upgrades, healthcare emergencies, or unexpected expenses. It works best for people with genuinely low expenses and who enjoy a simple lifestyle.",
  },
  {
    question: "What is Fat FIRE?",
    answer: "Fat FIRE targets a premium retirement lifestyle with higher spending. It uses a 35× annual expenses multiplier (about 2.9% withdrawal rate). This requires significantly more savings but provides a substantial buffer for luxuries, travel, and healthcare. Fat FIRE is ideal for people who want to maintain or upgrade their current lifestyle in retirement.",
  },
  {
    question: "What is Standard FIRE?",
    answer: "Standard FIRE — the most widely used approach — uses a 25× annual expenses multiplier (4% withdrawal rate). It targets a comfortable retirement lifestyle similar to your working years, balancing achievability with security. This is the default in most FIRE calculators and financial planning frameworks.",
  },
  {
    question: "Does EPF count towards FIRE?",
    answer: "Yes — your EPF balance is a significant retirement asset and should absolutely be included in your net worth for FIRE calculations. EPF currently earns 8.25% tax-free interest, making it one of the best fixed-income instruments available. Include your current EPF balance in the 'Current Net Worth' field.",
  },
  {
    question: "Should I include my house in FIRE calculations?",
    answer: "Generally, no — if the house is your primary residence, exclude it. You still need to live somewhere, so it cannot generate income to fund your expenses. However, if you own additional property that generates rental income, you can factor that rental income as reducing your monthly expenses (thus reducing your required corpus). Or if you plan to downsize and invest the difference, you can factor in the expected proceeds.",
  },
  {
    question: "How does inflation affect my FIRE number?",
    answer: "Inflation is one of the most significant variables in retirement planning. At 6% annual inflation, ₹60,000/month of expenses today becomes ₹1,44,000/month in 15 years. This roughly doubles your required retirement corpus compared to a calculation that ignores inflation. This calculator automatically inflation-adjusts all projections using your specified inflation rate.",
  },
  {
    question: "Can I retire with ₹1 crore in India?",
    answer: "At a 4% withdrawal rate, ₹1 crore supports ₹4 lakh annual expenses (₹33,333/month) at today's value. Whether this is enough depends entirely on your lifestyle. If you are debt-free, live in a lower-cost city, and have minimal needs, ₹1 crore may suffice for a frugal retirement. For most urban families with standard expenses, ₹1 crore is typically insufficient for a full retirement.",
  },
  {
    question: "Can I retire with ₹2 crore in India?",
    answer: "₹2 crore supports ₹8 lakh annual expenses (₹66,667/month) at today's value using the 4% rule. For someone retiring today with no debt and in a lower-cost location, ₹2 crore could work with careful budgeting. However, after accounting for inflation and healthcare costs, ₹2 crore is typically considered adequate only for frugal retirement in India as of 2026.",
  },
  {
    question: "How much should I invest monthly to retire early?",
    answer: "This depends on your current age, target retirement age, current net worth, expected returns, and monthly expenses. Use this calculator to find your exact number. As a rough guide: starting at 35 with ₹20 lakh in net worth and wanting to retire at 50, you might need to invest ₹80,000–₹1,20,000 per month assuming 12% returns and ₹60,000/month current expenses.",
  },
  {
    question: "What return rate should I assume for FIRE planning?",
    answer: "Indian equity mutual funds have historically delivered 12–15% CAGR over long periods, but future returns are not guaranteed. Most financial planners recommend using 10–12% for equity-heavy portfolios and 7–8% for balanced portfolios. This calculator defaults to 12%, but you should run scenarios at 10% as a stress test to ensure your plan is robust.",
  },
  {
    question: "What happens to my FIRE plan after I retire?",
    answer: "After retiring, you shift from accumulation to the withdrawal phase. Your corpus should be invested in a balanced portfolio (typically 50–60% equity, 40–50% debt) to continue growing while funding withdrawals. The 4% withdrawal rule is designed to last 30+ years. You should also build a 1–2 year cash buffer so you do not need to sell investments during market downturns.",
  },
  {
    question: "Why do expenses matter more than salary for FIRE?",
    answer: "Your savings rate — the gap between income and expenses — determines how fast you reach FIRE. A high earner who spends everything will never reach FIRE. A moderate earner who saves 50–60% of income can reach FIRE in 15–17 years. Reducing expenses also directly reduces your required FIRE corpus (since the corpus is a multiple of your annual expenses), creating a double benefit.",
  },
];

export default function FireCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Calculators", item: absoluteUrl("/calculator") },
          { "@type": "ListItem", position: 3, name: "FIRE Calculator", item: absoluteUrl("/calculator/fire-calculator") },
        ],
      },
      {
        "@type": "WebPage",
        name: title,
        description,
        url: absoluteUrl("/calculator/fire-calculator"),
        mainEntity: {
          "@type": "SoftwareApplication",
          name: "FIRE Calculator India",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web Browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        },
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">FIRE Calculator</span>
      </nav>

      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
        🔥 Financial Independence · Retire Early
      </div>

      <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">FIRE Calculator India</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Calculate when you can achieve Financial Independence and Retire Early. Find your FIRE
        corpus, track your progress, and model what-if scenarios to accelerate your retirement.
      </p>

      {/* FIRE type quick explainer */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
        {[
          { icon: "🌿", type: "Lean FIRE",     mult: "20×", desc: "Minimal lifestyle" },
          { icon: "🏡", type: "Standard FIRE", mult: "25×", desc: "Comfortable lifestyle" },
          { icon: "✨", type: "Fat FIRE",       mult: "35×", desc: "Premium lifestyle" },
        ].map(f => (
          <div key={f.type} className="rounded-xl border border-rule bg-surface px-4 py-3 shadow-card">
            <p className="font-semibold text-ink">{f.icon} {f.type}</p>
            <p className="text-xs text-ink-soft mt-0.5">{f.mult} annual expenses · {f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <FireCalculator />
      </div>

      <p className="mt-3 text-xs text-ink-soft text-center">
        All calculations are estimates based on assumed constant returns and inflation. Actual returns will vary. This is not financial advice.
      </p>

      {/* Educational content */}
      <section className="mt-14">
        <h2 className="font-display text-2xl text-ink">What Is FIRE?</h2>
        <p className="mt-3 text-ink-soft">
          FIRE — Financial Independence, Retire Early — is a financial philosophy built on one idea: save and invest aggressively enough that your investment returns exceed your living expenses, making paid employment optional. The movement originated in the US with the 1992 book <em>Your Money or Your Life</em> and was formalized by the <strong>Trinity Study</strong> which established the 4% Safe Withdrawal Rate.
        </p>
        <p className="mt-3 text-ink-soft">
          In India, FIRE is gaining traction as a generation of salaried professionals — especially in tech, finance, and consulting — realise that high incomes, disciplined saving, and India&apos;s equity market returns make early retirement achievable in 15–20 years of focused effort.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">The 4% Rule & Safe Withdrawal Rate</h2>
        <p className="mt-3 text-ink-soft">
          The 4% rule says: if you withdraw 4% of your retirement corpus in year one, then adjust for inflation each year, your money is statistically likely to last 30+ years. This implies a required corpus of 25× your annual expenses.
        </p>
        <p className="mt-3 text-ink-soft">
          In India, where inflation has historically averaged 5–7%, some planners prefer using a 3–3.5% withdrawal rate (implying 28–33× annual expenses) for added safety. This calculator lets you choose your FIRE type, which maps to different multipliers.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Why Expenses Matter More Than Salary</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-rule">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-rule bg-paper text-left">
              <th className="px-4 py-2.5 font-medium text-ink-soft">Monthly Savings</th>
              <th className="px-4 py-2.5 font-medium text-ink-soft">Savings Rate</th>
              <th className="px-4 py-2.5 font-medium text-ink-soft">Years to FIRE</th>
            </tr></thead>
            <tbody>
              {[
                ["₹10,000",  "10%",  "~43 years"],
                ["₹25,000",  "25%",  "~32 years"],
                ["₹50,000",  "50%",  "~17 years"],
                ["₹75,000",  "65%",  "~12 years"],
                ["₹1,00,000","75%+", "~7 years"],
              ].map(r => (
                <tr key={r[0]} className="border-b border-rule last:border-0 hover:bg-paper">
                  <td className="tabular px-4 py-2.5 text-ink">{r[0]}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{r[1]}</td>
                  <td className="px-4 py-2.5 font-medium text-brand">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          Assumes starting net worth of ₹0, 12% returns, 6% inflation, and Standard FIRE (25× expenses). Every rupee you reduce from monthly expenses both reduces the corpus you need <em>and</em> increases your savings rate — a powerful double effect.
        </p>
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
        <h2 className="font-display text-2xl text-ink">Related Calculators</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: "/calculator/sip-calculator",            label: "SIP Calculator" },
            { href: "/calculator/step-up-sip-calculator",    label: "Step-Up SIP" },
            { href: "/calculator/epf-calculator",            label: "EPF Calculator" },
            { href: "/calculator/ppf-calculator",            label: "PPF Calculator" },
            { href: "/calculator/nps-calculator",            label: "NPS Calculator" },
            { href: "/calculator/goal-planning-calculator",  label: "Goal Planning" },
            { href: "/calculator/swp-inflation-calculator",  label: "SWP + Inflation" },
            { href: "/calculator/xirr-calculator",           label: "XIRR Calculator" },
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
