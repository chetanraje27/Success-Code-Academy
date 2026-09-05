import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminRole } from "@/lib/roles";

const COOKIE_NAME = "sca_admin_session";

/*
 * Server-side proxy for Vercel Web Analytics. The browser never sees the
 * Vercel API token; the admin console authenticates with its usual session
 * cookie and this route fans out to the documented query endpoints:
 *   GET /v1/query/web-analytics/visits/aggregate
 *   GET /v1/query/web-analytics/events/aggregate
 */

const VERCEL_API_BASE = "https://api.vercel.com/v1/query/web-analytics";

const RANGES: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };

type TimeseriesRow = { timestamp: string; pageviews: number; visitors: number };
type DimensionRow = Record<string, string | number>;
type EventsRow = { eventName: string; count: number; visitors: number };

function backendBase(): string {
  const base =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";
  return base.replace(/\/$/, "");
}

function isSameOrigin(request: NextRequest): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "same-origin") return true;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const candidate = origin || referer;
  if (!candidate) {
    return secFetchSite === "none" || !secFetchSite;
  }

  try {
    const candidateUrl = new URL(candidate);
    if (candidateUrl.origin === request.nextUrl.origin) return true;
    const candHost = candidateUrl.hostname;
    const reqHost = request.nextUrl.hostname;
    if (
      (candHost.endsWith("successcodeacademy.in") || candHost.includes("localhost") || candHost.includes("127.0.0.1")) &&
      (reqHost.endsWith("successcodeacademy.in") || reqHost.includes("localhost") || reqHost.includes("127.0.0.1"))
    ) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function vercelQuery(
  token: string,
  params: Record<string, string>,
): Promise<unknown> {
  const search = new URLSearchParams(params);
  const response = await fetch(`${VERCEL_API_BASE}?${search.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const payload = (await response.json().catch(() => null)) as {
    data?: unknown;
    error?: { message?: string };
  } | null;
  if (!response.ok) {
    throw new Error(
      payload?.error?.message ||
        `Vercel Analytics request failed (${response.status}).`,
    );
  }
  return payload?.data ?? null;
}

export async function GET(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { status: "fail", message: "Invalid request origin." },
      { status: 403 },
    );
  }

  // Verify the caller holds a live administrator session.
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      { status: "fail", message: "Admin sign-in required." },
      { status: 401 },
    );
  }
  try {
    const me = await fetch(backendBase() + "/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const payload = (await me.json().catch(() => null)) as {
      data?: { user?: { role?: string } };
    } | null;
    if (!me.ok || !isAdminRole(payload?.data?.user?.role)) {
      return NextResponse.json(
        { status: "fail", message: "Admin sign-in required." },
        { status: 401 },
      );
    }
  } catch {
    return NextResponse.json(
      { status: "error", message: "Unable to verify the admin session." },
      { status: 502 },
    );
  }

  const vercelToken =
    process.env.VERCEL_ANALYTICS_TOKEN || process.env.VERCEL_TOKEN;
  const projectId =
    process.env.VERCEL_ANALYTICS_PROJECT_ID || process.env.VERCEL_PROJECT_ID;
  const teamId =
    process.env.VERCEL_ANALYTICS_TEAM_ID || process.env.VERCEL_TEAM_ID;

  if (!vercelToken || !projectId) {
    return NextResponse.json(
      {
        status: "fail",
        message:
          "Web Analytics is not configured. Add VERCEL_ANALYTICS_TOKEN and VERCEL_ANALYTICS_PROJECT_ID to the environment, then redeploy.",
      },
      { status: 503 },
    );
  }

  const rangeKey = request.nextUrl.searchParams.get("range") ?? "30d";
  const days = RANGES[rangeKey] ?? 30;

  const today = new Date();
  const until = toDateOnly(today);
  const sinceDate = new Date(today);
  sinceDate.setUTCDate(sinceDate.getUTCDate() - (days - 1));
  const since = toDateOnly(sinceDate);
  const prevUntilDate = new Date(sinceDate);
  prevUntilDate.setUTCDate(prevUntilDate.getUTCDate() - 1);
  const prevUntil = toDateOnly(prevUntilDate);
  const prevSinceDate = new Date(prevUntilDate);
  prevSinceDate.setUTCDate(prevSinceDate.getUTCDate() - (days - 1));
  const prevSince = toDateOnly(prevSinceDate);

  const common: Record<string, string> = { projectId };
  if (teamId) common.teamId = teamId;

  try {
    const [
      timeseries,
      prevTimeseries,
      topPaths,
      topReferrers,
      countries,
      devices,
      browsers,
      events,
    ] = await Promise.all([
      vercelQuery(vercelToken, { ...common, since, until, by: "day" }),
      vercelQuery(vercelToken, {
        ...common,
        since: prevSince,
        until: prevUntil,
        by: "day",
      }),
      vercelQuery(vercelToken, {
        ...common,
        since,
        until,
        by: "requestPath",
        limit: "8",
      }),
      vercelQuery(vercelToken, {
        ...common,
        since,
        until,
        by: "referrerHostname",
        limit: "8",
      }),
      vercelQuery(vercelToken, {
        ...common,
        since,
        until,
        by: "country",
        limit: "8",
      }),
      vercelQuery(vercelToken, {
        ...common,
        since,
        until,
        by: "deviceType",
        limit: "5",
      }),
      vercelQuery(vercelToken, {
        ...common,
        since,
        until,
        by: "browserName",
        limit: "5",
      }),
      vercelQuery(vercelToken, {
        ...common,
        since,
        until,
        by: "eventName",
        limit: "10",
      }),
    ]);

    const series = (Array.isArray(timeseries) ? timeseries : []) as TimeseriesRow[];
    const prevSeries = (Array.isArray(prevTimeseries) ? prevTimeseries : []) as TimeseriesRow[];

    const sum = (rows: TimeseriesRow[], key: "pageviews" | "visitors") =>
      rows.reduce((total, row) => total + (Number(row?.[key]) || 0), 0);

    const pageviews = sum(series, "pageviews");
    const visitors = sum(series, "visitors");
    const prevPageviews = sum(prevSeries, "pageviews");
    const prevVisitors = sum(prevSeries, "visitors");
    const delta = (current: number, previous: number) =>
      previous === 0 ? null : Math.round(((current - previous) / previous) * 100);

    return NextResponse.json(
      {
        status: "success",
        data: {
          range: rangeKey,
          since,
          until,
          totals: {
            pageviews,
            visitors,
            deltaPageviews: delta(pageviews, prevPageviews),
            deltaVisitors: delta(visitors, prevVisitors),
            eventsTotal: ((events as EventsRow[]) || []).reduce(
              (total, row) => total + (Number(row?.count) || 0),
              0,
            ),
          },
          timeseries: series,
          topPaths: (Array.isArray(topPaths) ? topPaths : []) as DimensionRow[],
          topReferrers: (Array.isArray(topReferrers) ? topReferrers : []) as DimensionRow[],
          countries: (Array.isArray(countries) ? countries : []) as DimensionRow[],
          devices: (Array.isArray(devices) ? devices : []) as DimensionRow[],
          browsers: (Array.isArray(browsers) ? browsers : []) as DimensionRow[],
          events: (Array.isArray(events) ? events : []) as EventsRow[],
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to load Web Analytics data.",
      },
      { status: 502 },
    );
  }
}
