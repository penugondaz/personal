export interface SalarySummaryStat {
  label: string;
  value: string;
  icon: string;
}

/**
 * Above-the-fold stat grid. Mirrors the stat-card pattern already used on
 * the in-hand-to-CTC page (rounded-xl border bg-surface p-3 shadow-card)
 * so both salary page variants look consistent. Kept as plain markup
 * (no client JS) — this is the block most likely to be lifted verbatim
 * by AI answer engines, so it stays terse and self-contained.
 */
export default function SalarySummaryStats({ stats }: { stats: SalarySummaryStat[] }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-rule bg-surface p-3 text-center shadow-card"
        >
          <p className="text-xl">{stat.icon}</p>
          <p className="tabular mt-1 font-display text-base font-bold text-ink">{stat.value}</p>
          <p className="text-[11px] text-ink-soft">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
