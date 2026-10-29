import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "ModularDom — Mallorca Private Residences",
    template: "%s | ModularDom Mallorca",
  },
  description:
    "A considered vision of Mediterranean living. Discover ModularDom Mallorca Private Residences.",
  robots: {
    index: process.env.SITE_PUBLISHED === "true",
    follow: process.env.SITE_PUBLISHED === "true",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
