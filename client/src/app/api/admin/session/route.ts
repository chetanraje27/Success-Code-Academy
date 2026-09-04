import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminRole } from "@/lib/roles";

const COOKIE_NAME = "sca_admin_session";
const COOKIE_MAX_AGE = 8 * 60 * 60;

function backendUrl(path: string): string {
  const base =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";
  return `${base.replace(/\/$/, "")}${path}`;
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

async function parseBackendResponse(response: Response) {
  const text = await response.text();
  try {
    return text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    return { message: text || "The authentication service returned an invalid response." };
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { status: "fail", message: "Invalid request origin." },
      { status: 403 },
    );
  }

  try {
    const credentials = await request.json();
    const response = await fetch(backendUrl("/api/v1/auth/admin/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });
    const payload = await parseBackendResponse(response);

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    const data = payload.data as
      | { token?: string; user?: { role?: string } }
      | undefined;
    // Either administrator role may open a dashboard session; what each one is
    // allowed to do afterwards is decided by the API on every request.
    if (!data?.token || !isAdminRole(data.user?.role)) {
      return NextResponse.json(
        { status: "error", message: "The server returned an invalid admin session." },
        { status: 502 },
      );
    }

    const result = NextResponse.json({
      status: "success",
      data: { user: data.user },
    });
    const host = request.headers.get("host") || "";
    const cookieDomain = host.includes("successcodeacademy.in")
      ? ".successcodeacademy.in"
      : undefined;

    result.cookies.set(COOKIE_NAME, data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: cookieDomain,
      maxAge: COOKIE_MAX_AGE,
      priority: "high",
    });
    return result;
  } catch {
    return NextResponse.json(
      { status: "error", message: "Unable to reach the authentication service." },
      { status: 502 },
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      { status: "success", data: { user: null } },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const response = await fetch(backendUrl("/api/v1/auth/me"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const payload = await parseBackendResponse(response);
    const user = (payload.data as { user?: { role?: string } } | undefined)?.user;

    if (!response.ok || !isAdminRole(user?.role)) {
      cookieStore.delete(COOKIE_NAME);

      if (response.status === 401 || response.status === 403 || response.ok) {
        return NextResponse.json(
          { status: "success", data: { user: null } },
          { headers: { "Cache-Control": "no-store" } },
        );
      }

      return NextResponse.json(
        {
          status: "error",
          message:
            typeof payload.message === "string"
              ? payload.message
              : "Admin session is no longer valid.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { status: "error", message: "Unable to verify the admin session." },
      { status: 502 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { status: "fail", message: "Invalid request origin." },
      { status: 403 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      { status: "fail", message: "Admin sign-in required." },
      { status: 401 },
    );
  }

  try {
    const body = await request.text();
    const response = await fetch(backendUrl("/api/v1/auth/admin/password"), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });
    const payload = await parseBackendResponse(response);
    if (response.ok) {
      cookieStore.delete(COOKIE_NAME);
    }
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Unable to update the password." },
      { status: 502 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { status: "fail", message: "Invalid request origin." },
      { status: 403 },
    );
  }
  const cookieStore = await cookies();
  const host = request.headers.get("host") || "";
  const cookieDomain = host.includes("successcodeacademy.in")
    ? ".successcodeacademy.in"
    : undefined;

  if (cookieDomain) {
    cookieStore.set(COOKIE_NAME, "", {
      domain: cookieDomain,
      path: "/",
      maxAge: 0,
    });
  }
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ status: "success" });
}
