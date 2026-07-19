import Link from "next/link";

export interface CalculatorSource {
  label: string;
  url?: string;
}

export default function CalculatorSources({ sources }: { sources: CalculatorSource[] }) {
  return (
    <section className="mt-12 rounded-xl border border-rule bg-paper p-5">
      <h2 className="font-display text-lg text-ink">Sources & Methodology</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
        {sources.map((s) => (
          <li key={s.label} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-soft" />
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                {s.label}
              </a>
            ) : (
              <span>{s.label}</span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-soft">
        This calculator is for educational and informational purposes only and does not
        constitute financial, tax, or legal advice. Rules and rates are current as of FY 2025-26
        and may change — verify against official sources or consult a qualified professional
        before making financial decisions. See our{" "}
        <Link href="/disclaimer" className="text-brand hover:underline">full disclaimer</Link>.
      </p>
    </section>
  );
}
