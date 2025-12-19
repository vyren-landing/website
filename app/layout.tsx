import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vyren — Autonomous Token & Launch Protocol",
  description:
    "Vyren is an AI-governed, autonomous economic protocol engineered for self-governing token ecosystems.",
  metadataBase: new URL("https://vyren.io"),
  openGraph: {
    title: "Vyren — Autonomous Token & Launch Protocol",
    description:
      "AI-regulated, self-governing economic infrastructure for autonomous token launches.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
