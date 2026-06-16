import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="font-display text-3xl sm:text-4xl text-ink">
        Take Home Calculators
      </h1>
      <p className="max-w-xl text-base text-ink-muted">
        Salary, CTC, income tax, EPF, PPF, gratuity, and payroll calculators
        for India. See exactly what lands in your bank account.
      </p>
      <Link
        href="/salary"
        className="rounded-md bg-ledger px-5 py-2.5 text-sm font-medium text-white hover:bg-ledger-soft"
      >
        Browse salary calculators
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link href="/epf-calculator" className="text-ledger hover:underline">
          EPF & VPF Calculator
        </Link>
        <span className="text-rule">·</span>
        <Link href="/ppf-calculator" className="text-ledger hover:underline">
          PPF Calculator
        </Link>
        <span className="text-rule">·</span>
        <Link href="/guides" className="text-ledger hover:underline">
          Salary & Tax Guides
        </Link>
      </div>
    </main>
  );
}
