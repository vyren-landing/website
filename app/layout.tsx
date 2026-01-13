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

export const metadata: Metadata = {
  title: "Vyren — Deterministic Constitutional Protocol (Rev4.6)",
  description:
    "Vyren is a governance-free, deterministic protocol operating under a finalized constitutional architecture. Participation is not yet enabled.",
  metadataBase: new URL("https://vyren.io"),
  openGraph: {
    title: "Vyren — Deterministic Constitutional Protocol (Rev4.6)",
    description:
      "A constitutionally locked protocol architecture. Deterministic execution. No governance. No early participation.",
    url: "https://vyren.io",
    siteName: "Vyren",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {/* SIGNAL NAVIGATION — LOCKED BY DESIGN */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-black/85 backdrop-blur border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 md:px-16 py-6 flex justify-between items-center">
            
            {/* BRAND ANCHOR */}
            <div className="text-sm font-semibold tracking-[0.25em] text-orange-400">
              VYREN
            </div>

            {/* LOCKED NAV ITEMS */}
            <ul className="flex gap-6 text-xs text-gray-400">
              {[
                "Architecture",
                "Economics",
                "Participation",
                "Documentation",
                "Status",
              ].map((item) => (
                <li
                  key={item}
                  className="relative cursor-default group"
                >
                  <span className="hover:text-gray-200">
                    {item}
                  </span>

                  <span className="absolute left-1/2 -translate-x-1/2 top-10 whitespace-nowrap text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Locked by design · Available after protocol activation
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <div className="pt-28">
          {children}
        </div>
      </body>
    </html>
  );
}
