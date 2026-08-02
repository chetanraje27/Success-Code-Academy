import { NextResponse } from "next/server";

/**
 * Public API proxy – forwards public POST/PUT/GET requests to the Express
 * backend so that client-side components never need to call Express directly.
 * This avoids CORS issues in production where the Express server may live on
 * a different domain from the Next.js frontend.
 *
 * Usage: fetch("/api/public/forms/contact", { method: "POST", body: ... })
 *   → proxied to  http://backend:5000/api/v1/forms/contact
 */

function backendBase(): string {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");
}

async function proxy(request: Request, params: Promise<{ path: string[] }>) {
  const { path } = await params;
  const safePath = path
    .map((s) => encodeURIComponent(s))
    .join("/");

  const target = new URL(`${backendBase()}/api/v1/${safePath}`);

  // Forward query params
  const { searchParams } = new URL(request.url);
  searchParams.forEach((v, k) => target.searchParams.set(k, v));

  // Build headers – forward content-type + auth if present
  const fwdHeaders: Record<string, string> = {};
  const ct = request.headers.get("content-type");
  if (ct) fwdHeaders["Content-Type"] = ct;
  const auth = request.headers.get("authorization");
  if (auth) fwdHeaders["Authorization"] = auth;

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

  try {
    const response = await fetch(target.toString(), {
      method: request.method,
      headers: fwdHeaders,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    const responseBody = await response.text();
    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Backend service is temporarily unavailable." },
      { status: 502 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, context.params);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, context.params);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, context.params);
}
