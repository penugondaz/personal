import type { ReactNode } from "react";
import CalculatorSourcesAuto from "@/components/CalculatorSourcesAuto";

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CalculatorSourcesAuto />
    </>
  );
}
