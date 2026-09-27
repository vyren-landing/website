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
  icons: {
    icon: [
      {
        url: "/vyren-favicon.jpg",
        type: "image/jpeg",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vyren — Deterministic Protocol",
    description:
      "Explicit rules, bounded authority, and verifiable state. Current mode: PRE-GENESIS.",
    url: "https://vyren.io",
    siteName: "Vyren",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyren — Deterministic Protocol",
    description:
      "Explicit rules, bounded authority, and verifiable state. Current mode: PRE-GENESIS.",
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
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
