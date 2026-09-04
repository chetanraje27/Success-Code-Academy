"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Images,
  LayoutDashboard,
  MessageSquareText,
  Pencil,
  RefreshCw,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { adminApiFetch } from "@/lib/admin-api";
import { AdminNotice } from "@/components/admin/AdminUi";

type RecentStudent = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber: string;
  createdAt: string;
};

type RecentCourseRegistration = {
  id: number;
  courseTitle: string;
  studentName: string;
  studentEmail?: string;
  studentPhone: string;
  createdAt: string;
};

type RecentScholarship = {
  id: number;
  studentName: string;
  studentPhone: string;
  studentClass?: string;
  preferredCourse?: string;
  createdAt: string;
};

type RecentContactMessage = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  createdAt: string;
};

type CourseBreakdownItem = {
  courseTitle?: string;
  count?: number | string;
};

type DashboardStats = {
  totalStudents?: number;
  totalCourseForms?: number;
  totalScholarshipForms?: number;
  totalContactMessages?: number;
  totalCourses?: number;
  recentStudents?: RecentStudent[];
  recentCourseRegistrations?: RecentCourseRegistration[];
  recentScholarships?: RecentScholarship[];
  recentContactMessages?: RecentContactMessage[];
  courseBreakdown?: CourseBreakdownItem[];
};

type ActivityType = "all" | "students" | "courses" | "scholarships" | "messages";

type UnifiedActivityItem = {
  id: string;
  type: "students" | "courses" | "scholarships" | "messages";
  typeLabel: string;
  name: string;
  email: string;
  phone: string;
  detail: string;
  createdAt: string;
  link: string;
};

const formatNumber = (value?: number | string | null): string => {
  if (value === null || value === undefined) return "0";
  const num = Number(value);
  return Number.isNaN(num) ? "0" : num.toLocaleString();
};

const formatUpdatedTime = (value: string | null) => {
  if (!value) return "Waiting for sync";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently updated";
  return `Synced ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const getInitial = (name: string) => {
  const trimmed = name ? name.trim() : "";
  return (trimmed ? trimmed[0] : "U").toUpperCase();
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActivityType>("all");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApiFetch<DashboardStats>("stats");
      setStats(response.data);
      setGeneratedAt(new Date().toISOString());
    } catch (caught: unknown) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Merge genuine database records into unified recent activity stream
  const unifiedActivities = useMemo<UnifiedActivityItem[]>(() => {
    if (!stats) return [];
    const list: UnifiedActivityItem[] = [];

    (stats.recentStudents || []).forEach((s) => {
      const fullName =
        [s.firstName, s.lastName].filter(Boolean).join(" ") || "Student";
      list.push({
        id: `student-${s.id}`,
        type: "students",
        typeLabel: "Student",
        name: fullName,
        email: s.email || "No email provided",
        phone: s.mobileNumber || "—",
        detail: "Registered Student Account",
        createdAt: s.createdAt,
        link: "/admin/database/students",
      });
    });

    (stats.recentCourseRegistrations || []).forEach((c) => {
      list.push({
        id: `course-${c.id}`,
        type: "courses",
        typeLabel: "Course Enquiry",
        name: c.studentName || "Prospective Student",
        email: c.studentEmail || "No email provided",
        phone: c.studentPhone || "—",
        detail: c.courseTitle || "Course Registration",
        createdAt: c.createdAt,
        link: "/admin/database/course-forms",
      });
    });

    (stats.recentScholarships || []).forEach((sc) => {
      const details = [
        sc.studentClass ? `Class ${sc.studentClass}` : null,
        sc.preferredCourse,
      ]
        .filter(Boolean)
        .join(" • ");

      list.push({
        id: `scholarship-${sc.id}`,
        type: "scholarships",
        typeLabel: "Scholarship",
        name: sc.studentName || "Scholarship Applicant",
        email: "Entrance Form",
        phone: sc.studentPhone || "—",
        detail: details || "Scholarship Registration",
        createdAt: sc.createdAt,
        link: "/admin/database/scholarship-forms",
      });
    });

    (stats.recentContactMessages || []).forEach((m) => {
      list.push({
        id: `message-${m.id}`,
        type: "messages",
        typeLabel: "Message",
        name: m.name || "Inquirer",
        email: m.email || "No email provided",
        phone: m.phone || "—",
        detail: m.message
          ? m.message.length > 55
            ? `${m.message.slice(0, 55)}…`
            : m.message
          : "Contact Form Message",
        createdAt: m.createdAt,
        link: "/admin/database/contact-messages",
      });
    });

    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [stats]);

  // Dynamic filter counters
  const filterCounts = useMemo(() => {
    return {
      all: unifiedActivities.length,
      students: unifiedActivities.filter((i) => i.type === "students").length,
      courses: unifiedActivities.filter((i) => i.type === "courses").length,
      scholarships: unifiedActivities.filter((i) => i.type === "scholarships")
        .length,
      messages: unifiedActivities.filter((i) => i.type === "messages").length,
    };
  }, [unifiedActivities]);

  // Filtered table records
  const filteredActivities = useMemo(() => {
    return unifiedActivities.filter((item) => {
      if (activeFilter !== "all" && item.type !== activeFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.phone.toLowerCase().includes(q) ||
          item.detail.toLowerCase().includes(q) ||
          item.typeLabel.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [unifiedActivities, activeFilter, searchTerm]);

  // Course demand breakdown from real database records
  const breakdownStats = useMemo(() => {
    const raw = stats?.courseBreakdown || [];
    const items = raw.map((b) => ({
      title: b?.courseTitle || "Unspecified Course",
      count: Number(b?.count) || 0,
    }));
    const totalCount = items.reduce((acc, curr) => acc + curr.count, 0);
    const maxCount = Math.max(...items.map((i) => i.count), 1);
    return { items, totalCount, maxCount };
  }, [stats?.courseBreakdown]);

  return (
    <div className="admin-dash">
      {/* 1. Executive Header Bar */}

      {error && <AdminNotice>{error}</AdminNotice>}

      {/* 2. Key Performance Indicators (Genuine Database Counts) */}
      <section className="admin-dash-kpis" aria-label="Academy KPIs">
        {/* Student Accounts */}
        <Link href="/admin/database/students" className="admin-dash-kpi is-students">
          <div className="admin-dash-kpi-top">
            <span className="admin-dash-kpi-label">Students</span>
            <div className="admin-dash-kpi-icon">
              <Users size={14} />
            </div>
          </div>
          <span className="admin-dash-kpi-val">
            {stats ? formatNumber(stats.totalStudents) : "—"}
          </span>
          <span className="admin-dash-kpi-desc">Registered portal accounts</span>
        </Link>

        {/* Course Enquiries */}
        <Link href="/admin/database/course-forms" className="admin-dash-kpi is-courses">
          <div className="admin-dash-kpi-top">
            <span className="admin-dash-kpi-label">Course Enquiries</span>
            <div className="admin-dash-kpi-icon">
              <ClipboardList size={14} />
            </div>
          </div>
          <span className="admin-dash-kpi-val">
            {stats ? formatNumber(stats.totalCourseForms) : "—"}
          </span>
          <span className="admin-dash-kpi-desc">Admissions enquiry forms</span>
        </Link>

        {/* Scholarships */}
        <Link href="/admin/database/scholarship-forms" className="admin-dash-kpi is-scholarships">
          <div className="admin-dash-kpi-top">
            <span className="admin-dash-kpi-label">Scholarships</span>
            <div className="admin-dash-kpi-icon">
              <GraduationCap size={14} />
            </div>
          </div>
          <span className="admin-dash-kpi-val">
            {stats ? formatNumber(stats.totalScholarshipForms) : "—"}
          </span>
          <span className="admin-dash-kpi-desc">Entrance test candidates</span>
        </Link>

        {/* Inbound Messages */}
        <Link href="/admin/database/contact-messages" className="admin-dash-kpi is-messages">
          <div className="admin-dash-kpi-top">
            <span className="admin-dash-kpi-label">Messages</span>
            <div className="admin-dash-kpi-icon">
              <MessageSquareText size={14} />
            </div>
          </div>
          <span className="admin-dash-kpi-val">
            {stats ? formatNumber(stats.totalContactMessages) : "—"}
          </span>
          <span className="admin-dash-kpi-desc">Website contact messages</span>
        </Link>

        {/* Courses */}
        <Link href="/admin/content/courses" className="admin-dash-kpi is-catalog">
          <div className="admin-dash-kpi-top">
            <span className="admin-dash-kpi-label">Courses</span>
            <div className="admin-dash-kpi-icon">
              <BookOpen size={14} />
            </div>
          </div>
          <span className="admin-dash-kpi-val">
            {stats ? formatNumber(stats.totalCourses) : "—"}
          </span>
          <span className="admin-dash-kpi-desc">Active published programs</span>
        </Link>
      </section>

      {/* 3. Middle Section (Course Demand Breakdown + Quick Shortcuts) */}
      <div className="admin-dash-mid">
        {/* Course Demand Breakdown */}
        <section className="admin-dash-panel" aria-label="Course Demand">
          <header className="admin-dash-panel-head">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <BarChart3 size={15} style={{ color: "var(--admin-brand)" }} />
              <h2 className="admin-dash-panel-title">Course Enquiries Breakdown</h2>
            </div>
            <span className="admin-dash-badge">
              {formatNumber(breakdownStats.totalCount)} Leads
            </span>
          </header>

          <div className="admin-dash-breakdown-list">
            {breakdownStats.items.length === 0 ? (
              <div className="admin-dash-empty">
                No course enquiry records found in the database.
              </div>
            ) : (
              breakdownStats.items.map((item, idx) => {
                const widthPct = Math.round(
                  (item.count / breakdownStats.maxCount) * 100,
                );

                return (
                  <div className="admin-dash-breakdown-row" key={item.title}>
                    <div className="admin-dash-breakdown-top">
                      <div className="admin-dash-breakdown-info">
                        <span className="admin-dash-rank">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <p className="admin-dash-course-name">{item.title}</p>
                      </div>
                      <span className="admin-dash-count-pill">
                        {formatNumber(item.count)} enquiries
                      </span>
                    </div>

                    <div className="admin-dash-track">
                      <div
                        className="admin-dash-fill"
                        style={{ width: `${Math.max(widthPct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Quick Operations Shortcuts */}
        <section className="admin-dash-panel" aria-label="Quick Shortcuts">
          <header className="admin-dash-panel-head">
            <h2 className="admin-dash-panel-title">Operations & Content</h2>
            <span className="admin-dash-badge">Quick Links</span>
          </header>

          <div className="admin-dash-shortcuts">
            <Link href="/?edit=1" target="_blank" className="admin-dash-shortcut">
              <div className="admin-dash-shortcut-icon">
                <Pencil size={15} />
              </div>
              <div className="admin-dash-shortcut-text">
                <p className="admin-dash-shortcut-title">Edit Live Website</p>
                <p className="admin-dash-shortcut-desc">
                  Open visual editor controls directly on the live website
                </p>
              </div>
              <ArrowRight size={13} className="admin-dash-shortcut-arrow" />
            </Link>

            <Link href="/admin/banners" className="admin-dash-shortcut">
              <div className="admin-dash-shortcut-icon">
                <Images size={15} />
              </div>
              <div className="admin-dash-shortcut-text">
                <p className="admin-dash-shortcut-title">Homepage Banners</p>
                <p className="admin-dash-shortcut-desc">
                  Manage hero slides and promotional banners
                </p>
              </div>
              <ArrowRight size={13} className="admin-dash-shortcut-arrow" />
            </Link>

            <Link href="/admin/content/courses" className="admin-dash-shortcut">
              <div className="admin-dash-shortcut-icon">
                <BookOpen size={15} />
              </div>
              <div className="admin-dash-shortcut-text">
                <p className="admin-dash-shortcut-title">Course Curriculum</p>
                <p className="admin-dash-shortcut-desc">
                  Update syllabus, faculty, and fee structure
                </p>
              </div>
              <ArrowRight size={13} className="admin-dash-shortcut-arrow" />
            </Link>

            <Link href="/admin/notifications" className="admin-dash-shortcut">
              <div className="admin-dash-shortcut-icon">
                <Bell size={15} />
              </div>
              <div className="admin-dash-shortcut-text">
                <p className="admin-dash-shortcut-title">Announcements & Alerts</p>
                <p className="admin-dash-shortcut-desc">
                  Publish admissions notices and important updates
                </p>
              </div>
              <ArrowRight size={13} className="admin-dash-shortcut-arrow" />
            </Link>

            <Link href="/admin/settings" className="admin-dash-shortcut">
              <div className="admin-dash-shortcut-icon">
                <Settings size={15} />
              </div>
              <div className="admin-dash-shortcut-text">
                <p className="admin-dash-shortcut-title">Academy Settings</p>
                <p className="admin-dash-shortcut-desc">
                  Update contact numbers, email addresses, and location
                </p>
              </div>
              <ArrowRight size={13} className="admin-dash-shortcut-arrow" />
            </Link>
          </div>
        </section>
      </div>

      {/* 4. Recent Intake & Inquiries Table */}
      <section className="admin-dash-panel" aria-label="Recent Enquiries">
        <header className="admin-dash-table-toolbar">
          <div className="admin-dash-filter-tabs" role="tablist">
            {(
              [
                { key: "all", label: "All" },
                { key: "students", label: "Students" },
                { key: "courses", label: "Course Enquiries" },
                { key: "scholarships", label: "Scholarships" },
                { key: "messages", label: "Messages" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`admin-dash-tab ${activeFilter === tab.key ? "is-active" : ""}`}
              >
                <span>{tab.label}</span>
                <span className="admin-dash-tab-count">
                  {filterCounts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="admin-dash-search-box">
            <Search size={13} className="admin-dash-search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search enquiries, name, phone..."
              className="admin-dash-search-input"
            />
          </div>
        </header>

        <div style={{ overflowX: "auto", width: "100%" }}>
          <table className="admin-dash-table">
            <thead>
              <tr>
                <th>Student / Contact</th>
                <th>Category</th>
                <th>Detail / Program</th>
                <th>Mobile</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-dash-empty">
                    {searchTerm
                      ? `No records matching "${searchTerm}".`
                      : "No activity records found in this category."}
                  </td>
                </tr>
              ) : (
                filteredActivities.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-dash-user-cell">
                        <div className="admin-dash-avatar">
                          {getInitial(item.name)}
                        </div>
                        <div>
                          <div className="admin-dash-user-name">{item.name}</div>
                          <div className="admin-dash-user-email">{item.email}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`admin-dash-pill is-${item.type}`}>
                        {item.typeLabel}
                      </span>
                    </td>

                    <td>
                      <span className="admin-dash-detail" title={item.detail}>
                        {item.detail}
                      </span>
                    </td>

                    <td>
                      <span className="admin-dash-phone">{item.phone}</span>
                    </td>

                    <td>
                      <span className="admin-dash-date">
                        {formatDate(item.createdAt)}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <Link href={item.link} className="admin-dash-link">
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="admin-dash-footer">
          <span>
            Showing {filteredActivities.length} of {unifiedActivities.length} database records
          </span>
          <div className="admin-dash-footer-links">
            <Link href="/admin/database/students">Students &rarr;</Link>
            <Link href="/admin/database/course-forms">Course Enquiries &rarr;</Link>
            <Link href="/admin/database/scholarship-forms">Scholarships &rarr;</Link>
            <Link href="/admin/database/contact-messages">Messages &rarr;</Link>
          </div>
        </footer>
      </section>
    </div>
  );
}
