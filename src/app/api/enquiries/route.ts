import { NextResponse } from "next/server";
import { validateEnquiry } from "@/lib/enquiry";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  try {
    if (
      origin &&
      origin !== new URL(request.url).origin &&
      origin !== process.env.NEXT_PUBLIC_SITE_URL &&
      new URL(origin).host !== request.headers.get("host")
    ) {
      return NextResponse.json({ error: "Origin rejected" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Origin rejected" }, { status: 403 });
  }
  const len = Number(request.headers.get("content-length"));
  if (len > 16000)
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  let raw: unknown;
  try {
    const body = await request.text();
    if (body.length > 16000)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    raw = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const data = validateEnquiry(raw);
  if (!data)
    return NextResponse.json({ error: "Invalid enquiry" }, { status: 400 });
  const base = process.env.SUPABASE_URL,
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (process.env.ENQUIRIES_ENABLED !== "true" || !base || !key)
    return NextResponse.json(
      { error: "Enquiries not configured" },
      { status: 503 },
    );
  const turnstile = process.env.TURNSTILE_SECRET_KEY;
  if (!turnstile)
    return NextResponse.json(
      { error: "Spam protection not configured" },
      { status: 503 },
    );
  try {
    const token = (raw as Record<string, unknown>).turnstileToken;
    if (typeof token !== "string")
      return NextResponse.json(
        { error: "Verification required" },
        { status: 400 },
      );
    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({ secret: turnstile, response: token }),
        signal: AbortSignal.timeout(8000),
      },
    );
    const result = await verification.json();
    const host = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url)
      .hostname;
    if (
      !result.success ||
      result.hostname !== host ||
      result.action !== "private-enquiry"
    )
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 },
      );
    const response = await fetch(
      `${base.replace(/\/$/, "")}/rest/v1/enquiries`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ ...data, privacy_version: "2026-10-29" }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok)
      return NextResponse.json(
        { error: "Delivery unavailable" },
        { status: 503 },
      );
    return NextResponse.json({ received: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Delivery unavailable" },
      { status: 503 },
    );
  }
}
