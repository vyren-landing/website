import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/protocol",
          "/architecture",
          "/economics",
          "/lifecycle",
          "/evidence",
          "/docs",
          "/status",
          "/genesis",
          "/network",
          "/liquidity",
          "/verification",
        ],
        disallow: [
          "/internal/",
          "/account/",
          "/genesis/eligibility",
          "/genesis/participate",
          "/genesis/confirmation",
        ],
      },
    ],
    sitemap: "https://vyren.io/sitemap.xml",
    host: "https://vyren.io",
  };
}
