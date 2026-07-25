import { NextResponse } from "next/server";

function backendUrl(pageKey: string): string {
  const base =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";
  return `${base.replace(/\/$/, "")}/api/v1/content/page/${encodeURIComponent(pageKey)}`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ pageKey: string }> },
) {
  const { pageKey } = await context.params;
  if (
    !pageKey ||
    pageKey.length > 160 ||
    !/^[a-z0-9][a-z0-9._:-]*$/.test(pageKey)
  ) {
    return NextResponse.json(
      { status: "fail", message: "Invalid page key." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(backendUrl(pageKey), {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message: "Live website content is temporarily unavailable.",
      },
      { status: 502 },
    );
  }
}
