import { NextResponse } from "next/server";

function backendUrl(pageKey: string): string {
  const base =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";
  const publicCollections = new Set([
    "banners",
    "courses",
    "news",
    "notifications",
    "results",
    "settings",
    "stars",
    "videos",
  ]);
  const contentPath = publicCollections.has(pageKey)
    ? pageKey
    : `page/${encodeURIComponent(pageKey)}`;
  return `${base.replace(/\/$/, "")}/api/v1/content/${contentPath}`;
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
    let payload: unknown;
    try {
      payload = body ? JSON.parse(body) : null;
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message: "The content service returned an invalid response.",
        },
        { status: response.ok ? 502 : response.status },
      );
    }

    return NextResponse.json(payload, {
      status: response.status,
      headers: {
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
