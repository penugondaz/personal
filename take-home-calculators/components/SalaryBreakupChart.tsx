import { formatINR } from "@/lib/format";

export interface SalaryBreakupSegment {
  label: string;
  monthly: number;
  color: string;
}

/**
 * Pure-SVG donut chart showing where a monthly CTC amount goes.
 * No charting library — matches the site's zero-client-JS-cost approach
 * to visuals (see app/globals.css design notes). Renders server-side.
 */
export default function SalaryBreakupChart({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: SalaryBreakupSegment[];
  centerLabel: string;
  centerValue: string;
}) {
  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, seg) => sum + Math.max(seg.monthly, 0), 0);

  let cumulativeFraction = 0;
  const arcs = segments.map((seg) => {
    const fraction = total > 0 ? Math.max(seg.monthly, 0) / total : 0;
    const offset = -cumulativeFraction * circumference;
    cumulativeFraction += fraction;
    const dash = fraction * circumference;
    return { ...seg, dash, offset, fraction };
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
      <div className="relative shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label={`Salary breakup chart: ${segments
            .map((s) => `${s.label} ${formatINR(s.monthly)} per month`)
            .join(", ")}`}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--rule)"
            strokeWidth={strokeWidth}
          />
          {arcs
            .filter((arc) => arc.fraction > 0)
            .map((arc) => (
              <circle
                key={arc.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
                strokeDashoffset={arc.offset}
              />
            ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">
            {centerLabel}
          </span>
          <span className="font-display text-xl text-ink">{centerValue}</span>
        </div>
      </div>

      <ul className="w-full space-y-2.5">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink-soft">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: seg.color }}
                aria-hidden="true"
              />
              {seg.label}
            </span>
            <span className="tabular whitespace-nowrap font-medium text-ink">
              {formatINR(seg.monthly)}/mo
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
