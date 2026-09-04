import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "sca_admin_session";

type HandlerContext = {
  params: Promise<{ path: string[] }>;
};

function backendBase(): string {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  if (origin === request.nextUrl.origin) return true;
  try {
    const originHost = new URL(origin).hostname;
    const reqHost = request.nextUrl.hostname;
    if (
      (originHost.endsWith("successcodeacademy.in") || originHost.includes("localhost") || originHost.includes("127.0.0.1")) &&
      (reqHost.endsWith("successcodeacademy.in") || reqHost.includes("localhost") || reqHost.includes("127.0.0.1"))
    ) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

async function forward(request: NextRequest, context: HandlerContext) {
  if (
    !["GET", "HEAD"].includes(request.method) &&
    !isSameOrigin(request)
  ) {
    return NextResponse.json(
      { status: "fail", message: "Invalid request origin." },
      { status: 403 },
    );
  }

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      { status: "fail", message: "Admin sign-in required." },
      { status: 401 },
    );
  }

  const { path } = await context.params;
  const safePath = path.map(encodeURIComponent).join("/");
  const target = new URL(`${backendBase()}/api/v1/admin/${safePath}`);
  target.search = request.nextUrl.search;

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    Accept: request.headers.get("accept") || "application/json",
  });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  try {
    const body = ["GET", "HEAD"].includes(request.method)
      ? undefined
      : await request.arrayBuffer();
    const response = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    responseHeaders.set(
      "Content-Type",
      response.headers.get("content-type") || "application/json",
    );

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Unable to reach the admin service." },
      { status: 502 },
    );
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
