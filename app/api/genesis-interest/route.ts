import { createHash } from "node:crypto";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
const CONSENT_VERSION = "2026-10-04-v1";

function isOpen() {
  return (
    process.env.GENESIS_INTEREST_OPEN === "true" &&
    Boolean(process.env.GENESIS_INTEREST_CONTROLLER_LABEL) &&
    Boolean(process.env.GENESIS_INTEREST_PRIVACY_EMAIL)
  );
}

export async function POST(request: Request) {
  if (!isOpen()) {
    return NextResponse.json(
      { ok: false, code: "INTEREST_CAPTURE_NOT_OPEN" },
      { status: 503 },
    );
  }

  const origin = request.headers.get("origin");
  if (origin && !origin.endsWith("vyren.io") && !origin.includes(".vercel.app")) {
    return NextResponse.json({ ok: false, code: "ORIGIN_REJECTED" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 });
  }

  const input = body as {
    email?: string;
    consent?: boolean;
    source?: string;
    website?: string;
  };

  // Honeypot: humans never fill this field.
  if (input.website) {
    return NextResponse.json({ ok: true });
  }

  const email = input.email?.trim().toLowerCase() ?? "";
  if (!EMAIL_RE.test(email) || email.length > 254 || input.consent !== true) {
    return NextResponse.json(
      { ok: false, code: "INVALID_SUBMISSION" },
      { status: 400 },
    );
  }

  const source = (input.source ?? "c0-site-02").slice(0, 120);
  const emailHash = createHash("sha256").update(email).digest("hex");
  const now = new Date().toISOString();

  const record = {
    schema: "vyren-genesis-interest-v1",
    email,
    emailHash,
    consent: true,
    consentVersion: CONSENT_VERSION,
    consentTimestamp: now,
    source,
    purpose: "VYREN project / Genesis status and participation-readiness updates",
    nonBinding: true,
    createsAllocation: false,
    createsEntitlement: false,
    createsPriority: false,
  };

  await put(
    `genesis-interest/${emailHash}.json`,
    JSON.stringify(record),
    {
      access: "private",
      allowOverwrite: true,
      contentType: "application/json",
    },
  );

  return NextResponse.json({ ok: true });
}
