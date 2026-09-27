import { ImageResponse } from "next/og";

export const alt = "VYREN — Explicit rules. Bounded authority. Verifiable state.";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          color: "#f4f4f5",
          padding: "72px",
          border: "1px solid #27272a",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 8,
              color: "#fb923c",
              fontWeight: 700,
            }}
          >
            VYREN
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#a1a1aa",
              border: "1px solid #3f3f46",
              borderRadius: 999,
              padding: "10px 18px",
            }}
          >
            PRE-GENESIS
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 68, lineHeight: 1.02, fontWeight: 600 }}>
            Explicit rules.
          </div>
          <div style={{ fontSize: 68, lineHeight: 1.02, fontWeight: 600 }}>
            Bounded authority.
          </div>
          <div style={{ fontSize: 68, lineHeight: 1.02, fontWeight: 600 }}>
            Verifiable state.
          </div>
        </div>

        <div style={{ fontSize: 20, color: "#71717a" }}>
          Deterministic protocol architecture · Rev4.6
        </div>
      </div>
    ),
    size
  );
}
