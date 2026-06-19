import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/paths";
import ClientPage from "./ClientPage";

const title = "Average Calculator — Mean, Median, Mode, Standard Deviation";
const description = "Calculate mean, median, mode, min, max, sum, and standard deviation for any set of numbers. Enter values separated by commas or new lines.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/tools/average-calculator") },
  openGraph: { title, description, url: absoluteUrl("/tools/average-calculator") },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <ClientPage />;
}
