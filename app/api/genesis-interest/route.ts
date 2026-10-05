import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      code: "EMAIL_CAPTURE_RETIRED",
      message:
        "Genesis update email registration is not in use. Follow VYREN through the official website and public channels.",
    },
    { status: 410 },
  );
}
