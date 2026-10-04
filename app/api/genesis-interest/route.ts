import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      code: "LOCAL_CAPTURE_REQUIRED",
      message:
        "Genesis update registration is not accepted through Vercel. A Türkiye-local direct capture provider must be bound first.",
    },
    { status: 410 },
  );
}
