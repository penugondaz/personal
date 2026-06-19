import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/paths";
import ClientPage from "./ClientPage";

const title = "Character Counter — Count Characters, Letters, Digits Online Free";
const description = "Count characters, letters, digits, spaces, and special characters in real time. Set a character limit for tweets (280), SMS (160), bios, and more.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/tools/character-counter") },
  openGraph: { title, description, url: absoluteUrl("/tools/character-counter") },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <ClientPage />;
}
