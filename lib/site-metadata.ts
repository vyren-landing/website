import type { Metadata } from "next";

export function publicPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | Vyren`,
      description,
      url: path,
      siteName: "Vyren",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Vyren`,
      description,
    },
  };
}
