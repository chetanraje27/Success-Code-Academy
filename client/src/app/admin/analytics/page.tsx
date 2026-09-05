"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  Globe2,
  Laptop,
  Link2,
  MapPin,
  MonitorSmartphone,
  MousePointerClick,
  RefreshCw,
  Smartphone,
  TabletSmartphone,
  Users,
  Zap,
} from "lucide-react";
import {
  AdminLoadingState,
  AdminNotice,
  AdminPageHeader,
} from "@/components/admin/AdminUi";

/* ── API contract (mirrors /api/admin/analytics) ─────────────────── */

type TimeseriesRow = { timestamp: string; pageviews: number; visitors: number };
type DimensionRow = Record<string, string | number>;
type EventsRow = { eventName: string; count: number; visitors: number };

type AnalyticsData = {
  range: string;
  since: string;
  until: string;
  totals: {
    pageviews: number;
    visitors: number;
    deltaPageviews: number | null;
    deltaVisitors: number | null;
    eventsTotal: number;
  };
  timeseries: TimeseriesRow[];
  topPaths: DimensionRow[];
  topReferrers: DimensionRow[];
  countries: DimensionRow[];
  devices: DimensionRow[];
  browsers: DimensionRow[];
  events: EventsRow[];
  /** True when the Vercel plan does not include custom events (Hobby). */
  eventsPlanRequired?: boolean;
};

type RangeKey = "7d" | "30d";
// 90d is not offered: the Hobby plan only keeps 31 days of analytics data,
// and daily grouping is capped at 62 days even on higher plans.
const RANGES: Array<{ key: RangeKey; label: string }> = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
];

/* ── Formatting helpers ──────────────────────────────────────────── */

const formatNumber = (value: number) => value.toLocaleString("en-IN");

const formatCompact = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value);

const formatDay = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const formatFullDay = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function countryFlag(code: string): string {
  return /^[A-Z]{2}$/.test(code)
    ? code.replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    : "";
}

function deviceIcon(label: string) {
  const value = label.toLowerCase();
  if (value.includes("mobile")) return Smartphone;
  if (value.includes("tablet")) return TabletSmartphone;
  if (value.includes("desktop") || value.includes("pc")) return Laptop;
  return MonitorSmartphone;
}

/* ── Small presentational pieces ─────────────────────────────────── */

function DeltaBadge({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="analytics-delta is-muted">no prior data</span>;
  }
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`analytics-delta ${up ? "is-up" : "is-down"}`}>
      <Icon size={12} aria-hidden="true" />
      {up ? "+" : ""}
      {value}%
    </span>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  tone,
  delta,
  footer,
}: {
  label: string;
  value: string;
  icon: typeof Users;
  tone: string;
  delta?: number | null;
  footer?: string;
}) {
  return (
    <article className="analytics-kpi">
      <div className="analytics-kpi-top">
        <span className="analytics-kpi-label">{label}</span>
        <span className={`analytics-kpi-icon ${tone}`}>
          <Icon size={14} aria-hidden="true" />
        </span>
      </div>
      <span className="analytics-kpi-value">{value}</span>
      <div className="analytics-kpi-foot">
        {delta !== undefined && <DeltaBadge value={delta} />}
        {footer && <span className="analytics-kpi-footer">{footer}</span>}
      </div>
    </article>
  );
}

/* ── Traffic chart (custom SVG, no chart dependency) ─────────────── */

const CHART_HEIGHT = 280;
const CHART_PADDING = { top: 16, right: 14, bottom: 28, left: 44 };

function TrafficChart({ rows }: { rows: TimeseriesRow[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(760);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width;
      if (next && next > 0) setWidth(Math.round(next));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const geometry = useMemo(() => {
    if (rows.length === 0 || width <= 0) return null;
    const innerW = Math.max(width - CHART_PADDING.left - CHART_PADDING.right, 10);
    const innerH = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
    const maxValue = Math.max(
      ...rows.map((row) => Math.max(row.pageviews || 0, row.visitors || 0)),
      1,
    );
    // Round the axis maximum up to a clean value so labels stay readable.
    const magnitude = 10 ** Math.floor(Math.log10(maxValue));
    const axisMax = Math.ceil(maxValue / magnitude) * magnitude;

    const x = (index: number) =>
      CHART_PADDING.left +
      (rows.length === 1 ? innerW / 2 : (index / (rows.length - 1)) * innerW);
    const y = (value: number) =>
      CHART_PADDING.top + innerH - (value / axisMax) * innerH;

    const line = (key: "pageviews" | "visitors") =>
      rows
        .map((row, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(1)},${y(row[key] || 0).toFixed(1)}`)
        .join(" ");

    const visitorsLine = line("visitors");
    const pageviewsLine = line("pageviews");
    const area = `${visitorsLine} L${x(rows.length - 1).toFixed(1)},${(CHART_PADDING.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(CHART_PADDING.top + innerH).toFixed(1)} Z`;

    const gridValues = [0.25, 0.5, 0.75, 1].map((fraction) => axisMax * fraction);
    const gridLines = gridValues.map((value) => ({
      value,
      y: y(value),
    }));

    const labelStep = Math.max(1, Math.ceil(rows.length / (width < 520 ? 4 : 8)));

    return { x, y, axisMax, visitorsLine, pageviewsLine, area, gridLines, labelStep, innerH };
  }, [rows, width]);

  const hover =
    hoverIndex !== null && rows[hoverIndex] ? rows[hoverIndex] : null;
  const hoverX =
    hoverIndex !== null && geometry ? geometry.x(hoverIndex) : 0;

  return (
    <div className="analytics-chart-wrap" ref={wrapRef}>
      {geometry ? (
        <svg
          className="analytics-chart"
          viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
          width={width}
          height={CHART_HEIGHT}
          role="img"
          aria-label="Visitors and pageviews over time"
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const relative = event.clientX - rect.left - CHART_PADDING.left;
            const innerW = Math.max(width - CHART_PADDING.left - CHART_PADDING.right, 10);
            const ratio = Math.min(Math.max(relative / innerW, 0), 1);
            setHoverIndex(Math.round(ratio * (rows.length - 1)));
          }}
        >
          <defs>
            <linearGradient id="analyticsVisitorsArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--admin-brand)", stopOpacity: 0.22 }} />
              <stop offset="100%" style={{ stopColor: "var(--admin-brand)", stopOpacity: 0.01 }} />
            </linearGradient>
          </defs>

          {geometry.gridLines.map((line) => (
            <g key={line.value}>
              <line
                className="analytics-chart-grid"
                x1={CHART_PADDING.left}
                x2={width - CHART_PADDING.right}
                y1={line.y}
                y2={line.y}
              />
              <text
                className="analytics-chart-axis"
                x={CHART_PADDING.left - 8}
                y={line.y + 4}
                textAnchor="end"
              >
                {formatCompact(Math.round(line.value))}
              </text>
            </g>
          ))}

          {rows.map((row, index) =>
            index % geometry.labelStep === 0 ? (
              <text
                key={row.timestamp}
                className="analytics-chart-axis"
                x={geometry.x(index)}
                y={CHART_HEIGHT - 8}
                textAnchor="middle"
              >
                {formatDay(row.timestamp)}
              </text>
            ) : null,
          )}

          <path className="analytics-chart-area" d={geometry.area} />
          <path className="analytics-chart-line is-pageviews" d={geometry.pageviewsLine} />
          <path className="analytics-chart-line is-visitors" d={geometry.visitorsLine} />

          {hoverIndex !== null && hover && (
            <g>
              <line
                className="analytics-chart-crosshair"
                x1={hoverX}
                x2={hoverX}
                y1={CHART_PADDING.top}
                y2={CHART_HEIGHT - CHART_PADDING.bottom}
              />
              <circle
                className="analytics-chart-dot is-visitors"
                cx={hoverX}
                cy={geometry.y(hover.visitors || 0)}
                r={4}
              />
              <circle
                className="analytics-chart-dot is-pageviews"
                cx={hoverX}
                cy={geometry.y(hover.pageviews || 0)}
                r={4}
              />
            </g>
          )}
        </svg>
      ) : (
        <div className="analytics-chart-empty">
          No traffic recorded in this period yet.
        </div>
      )}

      {hover && (
        <div
          className="analytics-chart-tooltip"
          style={{
            left: Math.min(Math.max(hoverX - 80, 0), Math.max(width - 170, 0)),
          }}
        >
          <strong>{formatFullDay(hover.timestamp)}</strong>
          <span className="is-visitors">
            <i aria-hidden="true" /> {formatNumber(hover.visitors || 0)} visitors
          </span>
          <span className="is-pageviews">
            <i aria-hidden="true" /> {formatNumber(hover.pageviews || 0)} pageviews
          </span>
        </div>
      )}

      <div className="analytics-chart-legend" aria-hidden="true">
        <span className="is-visitors"><i />Visitors</span>
        <span className="is-pageviews"><i />Pageviews</span>
      </div>
    </div>
  );
}

/* ── Bar list (top pages / referrers / countries / devices) ──────── */

function BarList({
  title,
  icon: Icon,
  rows,
  labelKey,
  valueKey = "visitors",
  emptyLabel,
  formatLabel,
}: {
  title: string;
  icon: typeof Users;
  rows: DimensionRow[];
  labelKey: string;
  valueKey?: string;
  emptyLabel: string;
  formatLabel?: (label: string) => string;
}) {
  const entries = rows
    .map((row) => ({
      label: String(row[labelKey] ?? "—"),
      value: Number(row[valueKey] ?? 0),
      secondary: Number(row.visitors ?? 0),
    }))
    .filter((entry) => entry.label !== "—" || entry.value > 0);
  const max = Math.max(...entries.map((entry) => entry.value), 1);

  return (
    <section className="admin-card analytics-panel">
      <header className="admin-card-header analytics-panel-head">
        <div>
          <h2>
            <Icon size={15} aria-hidden="true" />
            {title}
          </h2>
        </div>
      </header>
      <div className="analytics-panel-body">
        {entries.length === 0 ? (
          <p className="analytics-empty">{emptyLabel}</p>
        ) : (
          entries.map((entry) => (
            <div className="analytics-bar-row" key={`${entry.label}-${entry.value}`}>
              <div className="analytics-bar-meta">
                <span className="analytics-bar-label" title={entry.label}>
                  {formatLabel ? formatLabel(entry.label) : entry.label}
                </span>
                <span className="analytics-bar-value">
                  {formatNumber(entry.value)}
                </span>
              </div>
              <div
                className="analytics-bar-track"
                role="presentation"
              >
                <span
                  className="analytics-bar-fill"
                  style={{ width: `${Math.max((entry.value / max) * 100, 2)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [setupNeeded, setSetupNeeded] = useState(false);

  const load = useCallback(async (nextRange: RangeKey, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    setSetupNeeded(false);
    try {
      const response = await fetch(`/api/admin/analytics?range=${nextRange}`, {
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload = (await response.json().catch(() => ({}))) as {
        status?: string;
        message?: string;
        data?: AnalyticsData;
      };
      if (!response.ok) {
        if (response.status === 503) setSetupNeeded(true);
        throw new Error(
          payload.message || "Unable to load Web Analytics right now.",
        );
      }
      if (payload.data) setData(payload.data);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to load analytics.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(range);
  }, [range, load]);

  const totals = data?.totals;
  const pagesPerVisitor =
    totals && totals.visitors > 0 ? totals.pageviews / totals.visitors : 0;

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Observability"
        title="Web analytics"
        description="Visitor traffic, top content, audience, and conversion events for the public website."
      />

      {error && !setupNeeded && <AdminNotice>{error}</AdminNotice>}

      {setupNeeded && (
        <section className="admin-card analytics-setup">
          <header className="admin-card-header">
            <div>
              <h2>Connect Vercel Web Analytics</h2>
              <p>The dashboard is ready — it just needs API access to your analytics data.</p>
            </div>
            <Zap size={20} aria-hidden="true" />
          </header>
          <div className="admin-card-body">
            {error && <p className="analytics-setup-error">{error}</p>}
            <ol className="analytics-setup-steps">
              <li>
                Open your project on Vercel → <strong>Storage / Analytics</strong> tab and
                enable <strong>Web Analytics</strong> for the production domain.
              </li>
              <li>
                Create a Vercel access token at{" "}
                <span className="analytics-setup-code">vercel.com/account/settings/tokens</span>{" "}
                (read access is enough).
              </li>
              <li>
                Add environment variables to the frontend deployment and redeploy:
                <pre className="analytics-setup-env">
                  <code>VERCEL_ANALYTICS_TOKEN=your_vercel_token</code>
                  <code>VERCEL_ANALYTICS_PROJECT_ID=prj_xxxxxxxx</code>
                </pre>
                <small>
                  The project ID is optional on Vercel (VERCEL_PROJECT_ID is injected
                  automatically) — set it explicitly only for local development. For team
                  projects also set <span className="analytics-setup-code">VERCEL_ANALYTICS_TEAM_ID</span>.
                </small>
              </li>
            </ol>
          </div>
        </section>
      )}

      <div className="analytics-toolbar">
        <div className="analytics-range-tabs" role="group" aria-label="Date range">
          {RANGES.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`analytics-range-tab ${range === option.key ? "is-active" : ""}`}
              onClick={() => setRange(option.key)}
              aria-pressed={range === option.key}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="analytics-toolbar-meta">
          {data && (
            <span className="analytics-range-dates">
              {formatDay(`${data.since}T00:00:00.000Z`)} –{" "}
              {formatDay(`${data.until}T00:00:00.000Z`)}
            </span>
          )}
          <button
            type="button"
            className="admin-button secondary"
            onClick={() => void load(range, true)}
            disabled={loading || refreshing}
          >
            <RefreshCw size={15} className={refreshing ? "admin-notification-spin" : ""} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="analytics-loading">
          <AdminLoadingState label="Loading analytics…" />
        </div>
      ) : data ? (
        <>
          <section className="analytics-kpis" aria-label="Traffic summary">
            <KpiCard
              label="Visitors"
              value={formatNumber(totals?.visitors ?? 0)}
              icon={Users}
              tone="is-blue"
              delta={totals?.deltaVisitors ?? null}
              footer="unique in period"
            />
            <KpiCard
              label="Pageviews"
              value={formatNumber(totals?.pageviews ?? 0)}
              icon={Eye}
              tone="is-teal"
              delta={totals?.deltaPageviews ?? null}
              footer="total views"
            />
            <KpiCard
              label="Pages / visitor"
              value={pagesPerVisitor ? pagesPerVisitor.toFixed(1) : "—"}
              icon={MousePointerClick}
              tone="is-violet"
              footer="engagement"
            />
            <KpiCard
              label="Tracked events"
              value={data.eventsPlanRequired ? "—" : formatNumber(totals?.eventsTotal ?? 0)}
              icon={Activity}
              tone="is-amber"
              footer={data.eventsPlanRequired ? "needs Vercel Pro" : "form actions"}
            />
          </section>

          <section className="admin-card analytics-chart-card">
            <header className="admin-card-header analytics-panel-head">
              <div>
                <h2>
                  <Activity size={15} aria-hidden="true" />
                  Traffic trend
                </h2>
                <p>Visitors and pageviews, compared with the previous period.</p>
              </div>
            </header>
            <div className="analytics-chart-card-body">
              <TrafficChart rows={data.timeseries} />
            </div>
          </section>

          <div className="analytics-grid">
            <BarList
              title="Top pages"
              icon={Eye}
              rows={data.topPaths}
              labelKey="requestPath"
              emptyLabel="No page views recorded yet."
            />
            <BarList
              title="Referrers"
              icon={Link2}
              rows={data.topReferrers}
              labelKey="referrerHostname"
              emptyLabel="No referrer traffic recorded yet."
            />
          </div>

          <div className="analytics-grid analytics-grid-triple">
            <BarList
              title="Countries"
              icon={MapPin}
              rows={data.countries}
              labelKey="country"
              valueKey="visitors"
              emptyLabel="No country data recorded yet."
              formatLabel={(label) =>
                /^[A-Z]{2}$/.test(label)
                  ? `${countryFlag(label)} ${label}`
                  : label
              }
            />
            <BarList
              title="Devices"
              icon={Laptop}
              rows={data.devices}
              labelKey="deviceType"
              valueKey="visitors"
              emptyLabel="No device data recorded yet."
            />
            <BarList
              title="Browsers"
              icon={Globe2}
              rows={data.browsers}
              labelKey="browserName"
              valueKey="visitors"
              emptyLabel="No browser data recorded yet."
            />
          </div>

          <section className="admin-card analytics-panel">
            <header className="admin-card-header analytics-panel-head">
              <div>
                <h2>
                  <Zap size={15} aria-hidden="true" />
                  Conversion events
                </h2>
                <p>Form actions visitors completed on the website.</p>
              </div>
            </header>
            <div className="analytics-panel-body analytics-events-body">
              {data.eventsPlanRequired ? (
                <p className="analytics-empty">
                  Custom event tracking is a Vercel Pro plan feature. Traffic
                  analytics above work on every plan; the form-event reports
                  activate automatically if the Vercel project is upgraded.
                </p>
              ) : data.events.length === 0 ? (
                <p className="analytics-empty">
                  No custom events yet. Form submissions on the public site
                  (course enquiries, scholarship registrations, contact
                  messages, newsletter sign-ups) will appear here.
                </p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table analytics-events-table">
                    <thead>
                      <tr>
                        <th scope="col">Event</th>
                        <th scope="col">Completions</th>
                        <th scope="col">Visitors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.events.map((event) => (
                        <tr key={event.eventName}>
                          <td>
                            <span className="analytics-event-name">
                              {event.eventName}
                            </span>
                          </td>
                          <td>{formatNumber(event.count ?? 0)}</td>
                          <td>{formatNumber(event.visitors ?? 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </>
      ) : !setupNeeded ? (
        <section className="admin-card">
          <div className="admin-card-body">
            <p className="analytics-empty">
              No analytics data is available for this period yet.
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
