import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vyren",
    short_name: "VYREN",
    description:
      "Deterministic protocol architecture. Current state: PRE-GENESIS.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
  };
}
