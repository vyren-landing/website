import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VYREN Command Center · Preview",
  description: "Private execution and team management preview. Not a canonical authority.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
