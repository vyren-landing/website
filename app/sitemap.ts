import type { MetadataRoute } from "next";

const publicRoutes = [
  "",
  "/protocol",
  "/architecture",
  "/ecosystem",
  "/economics",
  "/lifecycle",
  "/evidence",
  "/docs",\n  "/docs/participation",
  "/status",
  "/genesis",
  "/network",
  "/liquidity",
  "/verification",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicRoutes.map((route) => ({
    url: `https://vyren.io${route}`,
    lastModified: now,
    changeFrequency: route === "/status" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/status" ? 0.9 : 0.7,
  }));
}
