"use client";

import { useMemo, useState } from "react";
import {
  BarChart2,
  PieChart,
  TrendingUp,
  Target,
  Award,
  Layers,
} from "lucide-react";

type CourseBreakdownItem = {
  courseTitle?: string;
  count?: number | string;
};

type Props = {
  data: CourseBreakdownItem[];
  totalPublishedCourses?: number;
};

// Curated modern color palette for courses
const PALETTE = [
  { fill: "#3b82f6", light: "#93c5fd", gradStart: "#3b82f6", gradEnd: "#60a5fa" }, // Blue
  { fill: "#10b981", light: "#6ee7b7", gradStart: "#10b981", gradEnd: "#34d399" }, // Emerald
  { fill: "#8b5cf6", light: "#c4b5fd", gradStart: "#8b5cf6", gradEnd: "#a78bfa" }, // Violet
  { fill: "#f59e0b", light: "#fcd34d", gradStart: "#f59e0b", gradEnd: "#fbbf24" }, // Amber
  { fill: "#ec4899", light: "#f9a8d4", gradStart: "#ec4899", gradEnd: "#f472b6" }, // Pink
  { fill: "#06b6d4", light: "#67e8f9", gradStart: "#06b6d4", gradEnd: "#22d3ee" }, // Cyan
];

export default function CourseDemandAnalytics({
  data = [],
  totalPublishedCourses = 0,
}: Props) {
  const [viewMode, setViewMode] = useState<"bar" | "donut">("bar");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Process data with percentages and rank
  const { items, totalLeads, maxCount, topCourse, isTie, diversityRatio } = useMemo(() => {
    const parsed = data
      .map((item) => ({
        title: (item.courseTitle || "Unspecified Course").trim(),
        count: Math.max(0, Number(item.count) || 0),
      }))
      .filter((i) => i.count > 0)
      .sort((a, b) => b.count - a.count);

    const total = parsed.reduce((acc, curr) => acc + curr.count, 0);
    const max = Math.max(...parsed.map((p) => p.count), 1);

    const enriched = parsed.map((item, index) => {
      const pct = total > 0 ? (item.count / total) * 100 : 0;
      const color = PALETTE[index % PALETTE.length];
      return {
        ...item,
        percentage: pct,
        percentageFormatted: pct.toFixed(1),
        color,
      };
    });

    const top = enriched[0] || null;
    const tie =
      enriched.length > 1 &&
      enriched[0].count === enriched[1].count;

    // Proportion of catalog with inquiries
    const diversity =
      totalPublishedCourses > 0
        ? Math.min(100, Math.round((enriched.length / totalPublishedCourses) * 100))
        : null;

    return {
      items: enriched,
      totalLeads: total,
      maxCount: max,
      topCourse: top,
      isTie: tie,
      diversityRatio: diversity,
    };
  }, [data, totalPublishedCourses]);

  // Donut geometry calculations
  const donutSegments = useMemo(() => {
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    let accumulatedAngle = 0;

    return items.map((item) => {
      const strokeLength = (item.percentage / 100) * circumference;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += strokeLength;

      return {
        ...item,
        strokeDasharray: `${strokeLength} ${circumference - strokeLength}`,
        strokeDashoffset,
      };
    });
  }, [items]);

  return (
    <section className="admin-dash-panel admin-dash-analytics" aria-label="Course Enquiries Analytics">
      {/* 1. Header with View Toggle & Metric Pill */}
      <header className="admin-dash-panel-head">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <TrendingUp size={15} style={{ color: "var(--admin-brand)" }} />
          <h2 className="admin-dash-panel-title">Course Demand Analytics</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Chart View Switcher */}
          <div className="admin-dash-view-toggle" role="group" aria-label="Chart view mode">
            <button
              type="button"
              className={`admin-dash-toggle-btn ${viewMode === "bar" ? "is-active" : ""}`}
              onClick={() => setViewMode("bar")}
              title="Bar Chart Distribution"
              aria-label="Bar Chart Distribution"
            >
              <BarChart2 size={13} />
              <span className="admin-dash-toggle-text">Volume</span>
            </button>
            <button
              type="button"
              className={`admin-dash-toggle-btn ${viewMode === "donut" ? "is-active" : ""}`}
              onClick={() => setViewMode("donut")}
              title="Donut Market Share"
              aria-label="Donut Market Share"
            >
              <PieChart size={13} />
              <span className="admin-dash-toggle-text">Share</span>
            </button>
          </div>

          <span className="admin-dash-badge">
            {totalLeads} {totalLeads === 1 ? "Lead" : "Leads"}
          </span>
        </div>
      </header>

      <div className="admin-analytics-body">
        {items.length === 0 ? (
          <div className="admin-dash-empty" style={{ padding: "36px 16px" }}>
            <Target size={28} style={{ opacity: 0.4, marginBottom: "8px" }} />
            <p style={{ margin: 0, fontWeight: 500 }}>No course enquiries recorded yet.</p>
            <small style={{ color: "var(--admin-muted)" }}>
              Student submissions from course registration forms will generate interactive analytics here.
            </small>
          </div>
        ) : (
          <>
            {/* 2. Interactive Chart Stage */}
            <div className="admin-chart-stage">
              {viewMode === "bar" ? (
                /* Professional Column / Bar Distribution Graph */
                <div className="admin-bar-chart-container">
                  <div className="admin-bar-chart-legend">
                    <span>Program Enquiry Volume & Share %</span>
                    <span className="admin-bar-chart-scale">Scale: 0 – {maxCount}</span>
                  </div>

                  <div className="admin-bar-chart-bars">
                    {items.map((item, idx) => {
                      const heightPct = Math.max(16, Math.round((item.count / maxCount) * 100));
                      const isHovered = hoveredIndex === idx;

                      return (
                        <div
                          key={item.title}
                          className={`admin-bar-col ${isHovered ? "is-hovered" : ""}`}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          {/* Value Pill on Top */}
                          <div className="admin-bar-val-wrapper">
                            <span
                              className="admin-bar-val-pill"
                              style={{
                                color: item.color.fill,
                                borderColor: isHovered ? item.color.fill : "transparent",
                              }}
                            >
                              <strong>{item.count}</strong>
                              <small>({item.percentageFormatted}%)</small>
                            </span>
                          </div>

                          {/* Bar Fill Pillar */}
                          <div className="admin-bar-pillar-track">
                            <div
                              className="admin-bar-pillar-fill"
                              style={{
                                height: `${heightPct}%`,
                                background: `linear-gradient(180deg, ${item.color.gradEnd} 0%, ${item.color.gradStart} 100%)`,
                                boxShadow: isHovered
                                  ? `0 4px 12px ${item.color.fill}40`
                                  : "none",
                              }}
                            />
                          </div>

                          {/* Bottom Course Label */}
                          <div className="admin-bar-label" title={item.title}>
                            <span
                              className="admin-bar-dot"
                              style={{ backgroundColor: item.color.fill }}
                            />
                            <span className="admin-bar-label-text">{item.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Modern Donut / Radial Share Graph */
                <div className="admin-donut-container">
                  <div className="admin-donut-graphic">
                    <svg viewBox="0 0 120 120" className="admin-donut-svg">
                      {/* Sunken track background */}
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        fill="none"
                        stroke="var(--admin-surface-sunken)"
                        strokeWidth="14"
                      />
                      {/* Color Segments */}
                      {donutSegments.map((seg, idx) => (
                        <circle
                          key={seg.title}
                          cx="60"
                          cy="60"
                          r="48"
                          fill="none"
                          stroke={seg.color.fill}
                          strokeWidth={hoveredIndex === idx ? 17 : 14}
                          strokeDasharray={seg.strokeDasharray}
                          strokeDashoffset={seg.strokeDashoffset}
                          transform="rotate(-90 60 60)"
                          className="admin-donut-segment"
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          style={{
                            transition: "all 0.25s ease",
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </svg>
                    {/* Donut Center Label */}
                    <div className="admin-donut-center">
                      <span className="admin-donut-center-num">{totalLeads}</span>
                      <span className="admin-donut-center-sub">Leads</span>
                    </div>
                  </div>

                  {/* Donut Side Legend */}
                  <div className="admin-donut-legend">
                    {items.map((item, idx) => (
                      <div
                        key={item.title}
                        className={`admin-donut-legend-item ${hoveredIndex === idx ? "is-hovered" : ""}`}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <div className="admin-donut-legend-left">
                          <span
                            className="admin-donut-legend-dot"
                            style={{ backgroundColor: item.color.fill }}
                          />
                          <span className="admin-donut-legend-title" title={item.title}>
                            {item.title}
                          </span>
                        </div>
                        <div className="admin-donut-legend-right">
                          <span className="admin-donut-legend-count">{item.count}</span>
                          <span className="admin-donut-legend-pct">{item.percentageFormatted}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Micro Metrics Cards Grid */}
            <div className="admin-insights-kpis">
              <div className="admin-insight-card">
                <div className="admin-insight-card-header">
                  <Award size={13} style={{ color: "#3b82f6" }} />
                  <span>Top Candidate Choice</span>
                </div>
                <div className="admin-insight-card-body">
                  <strong>{topCourse ? topCourse.title : "—"}</strong>
                  <span className="admin-insight-sub">
                    {topCourse
                      ? `${topCourse.percentageFormatted}% of candidate pool`
                      : "No data"}
                  </span>
                </div>
              </div>

              <div className="admin-insight-card">
                <div className="admin-insight-card-header">
                  <Layers size={13} style={{ color: "#10b981" }} />
                  <span>Program Demand Spread</span>
                </div>
                <div className="admin-insight-card-body">
                  <strong>
                    {items.length} Active {items.length === 1 ? "Program" : "Programs"}
                  </strong>
                  <span className="admin-insight-sub">
                    {isTie
                      ? "Equal demand distribution"
                      : `${items.length} courses receiving leads`}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
