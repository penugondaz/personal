import Link from "next/link";
import { otherLandingPages } from "@/lib/landing-pages";

export default function LandingHubLinks({ currentHref }: { currentHref: string }) {
  const pages = otherLandingPages(currentHref);

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl text-ink">Explore Other Calculators</h2>
      <p className="mt-2 text-sm text-ink-soft">
        SalaryTools covers every major money decision — jump to another section.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pages.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="flex items-start gap-3 rounded-xl border border-rule bg-surface px-4 py-3.5 shadow-card transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card-lg"
          >
            <span className="text-xl">{p.icon}</span>
            <div>
              <p className="text-sm font-semibold text-ink">{p.title}</p>
              <p className="mt-0.5 text-xs text-ink-soft">{p.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
