import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vyren — Deterministic Protocol",
    template: "%s | Vyren",
  },
  description:
    "Vyren is a deterministic protocol architecture currently operating in PRE-GENESIS mode. Participation is not open.",
  metadataBase: new URL("https://vyren.io"),
  openGraph: {
    title: "Vyren — Deterministic Protocol",
    description:
      "Explicit rules, bounded authority, and verifiable state. Current mode: PRE-GENESIS.",
    url: "https://vyren.io",
    siteName: "Vyren",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-black text-zinc-100 antialiased`}
      >
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
