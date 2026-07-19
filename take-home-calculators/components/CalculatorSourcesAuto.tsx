"use client";

import { usePathname } from "next/navigation";
import { CALCULATOR_SOURCES } from "@/lib/calculator-sources";
import CalculatorSources from "./CalculatorSources";

export default function CalculatorSourcesAuto() {
  const pathname = usePathname();
  const slug = pathname.replace(/\/$/, "").split("/").filter(Boolean).pop() ?? "";
  const sources = CALCULATOR_SOURCES[slug];

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl px-6">
      <CalculatorSources sources={sources} />
    </div>
  );
}
