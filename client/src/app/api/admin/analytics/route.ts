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

// 90d is intentionally unsupported: the Hobby plan only serves the latest 31
// days, and by=day grouping is capped at 62 days even on higher plans. A
// longer view would need weekly granularity.
const RANGES: Record<string, number> = { "7d": 7, "30d": 30 };

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

/** Marker so GET() can surface token problems as actionable setup guidance. */
class AnalyticsAuthError extends Error {}

async function vercelQuery(
  token: string,
  endpoint: "visits/aggregate" | "events/aggregate",
  params: Record<string, string>,
): Promise<unknown> {
  const search = new URLSearchParams(params);
  // The endpoint path is required — the dataset segment (visits/events) plus
  // the query style (aggregate) select the resource; without it Vercel
  // answers 404 "Not Found".
  const response = await fetch(
    `${VERCEL_API_BASE}/${endpoint}?${search.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    },
  );
  const payload = (await response.json().catch(() => null)) as {
    data?: unknown;
    error?: {
      message?: string;
      code?: string;
      invalidToken?: boolean;
      missingToken?: boolean;
    };
  } | null;

  if (!response.ok) {
    // Vercel answers an unknown/revoked token exactly like a bogus one, so
    // translate it into instructions the admin can act on.
    if (payload?.error?.invalidToken || payload?.error?.missingToken) {
      throw new AnalyticsAuthError(
        "Your Vercel access token was rejected (it is invalid, revoked, or was copied incompletely). Create a fresh token at vercel.com/account/settings/tokens and update VERCEL_ANALYTICS_TOKEN, then restart the dev server or redeploy.",
      );
    }
    if (response.status === 403 || response.status === 401) {
      throw new AnalyticsAuthError(
        "Vercel refused this request. If the project belongs to a team, add VERCEL_ANALYTICS_TEAM_ID (found in the Vercel dashboard URL) and redeploy. Otherwise re-create the access token with access to this project.",
      );
    }
    const message =
      payload?.error?.message ||
      `Vercel Analytics request failed (${response.status}).`;
    // Attach the status so callers can distinguish plan limits (402) and
    // window limits (400) from real failures.
    const failure = new Error(message) as Error & { status?: number };
    failure.status = response.status;
    throw failure;
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
      topPaths,
      topReferrers,
      countries,
      devices,
      browsers,
    ] = await Promise.all([
      vercelQuery(vercelToken, "visits/aggregate", {
        ...common,
        since,
        until,
        by: "day",
      }),
      vercelQuery(vercelToken, "visits/aggregate", {
        ...common,
        since,
        until,
        by: "requestPath",
        limit: "8",
      }),
      vercelQuery(vercelToken, "visits/aggregate", {
        ...common,
        since,
        until,
        by: "referrerHostname",
        limit: "8",
      }),
      vercelQuery(vercelToken, "visits/aggregate", {
        ...common,
        since,
        until,
        by: "country",
        limit: "8",
      }),
      vercelQuery(vercelToken, "visits/aggregate", {
        ...common,
        since,
        until,
        by: "deviceType",
        limit: "5",
      }),
      vercelQuery(vercelToken, "visits/aggregate", {
        ...common,
        since,
        until,
        by: "browserName",
        limit: "5",
      }),
    ]);

    // The previous-period comparison reaches `days` further back than the
    // current window. The Hobby plan only serves the latest 31 days, so for
    // the 30-day view (60 days back) Vercel rejects this query. Degrade to
    // "no prior data" instead of failing the whole dashboard.
    const prevTimeseries = (await vercelQuery(vercelToken, "visits/aggregate", {
      ...common,
      since: prevSince,
      until: prevUntil,
      by: "day",
    }).catch(() => null)) as TimeseriesRow[] | null;

    // Custom events are a separate dataset gated behind the Pro plan (402 on
    // Hobby); a failure here must not take the traffic dashboard down.
    let eventsPlanRequired = false;
    const events = (await vercelQuery(vercelToken, "events/aggregate", {
      ...common,
      since,
      until,
      by: "eventName",
      limit: "10",
    }).catch((error: unknown) => {
      if ((error as { status?: number }).status === 402) {
        eventsPlanRequired = true;
      }
      return null;
    })) as EventsRow[] | null;

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

    const eventRows: EventsRow[] = Array.isArray(events) ? events : [];

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
            eventsTotal: eventRows.reduce(
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
          events: eventRows,
          eventsPlanRequired,
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    // Token and permission problems are configuration issues, not outages:
    // answer 503 so the dashboard shows its setup card with these steps
    // instead of a bare error banner.
    if (error instanceof AnalyticsAuthError) {
      return NextResponse.json(
        { status: "fail", message: error.message },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to load Web Analytics data.",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
