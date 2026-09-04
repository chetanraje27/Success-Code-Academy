"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Calendar,
  Check,
  ClipboardList,
  Copy,
  ExternalLink,
  GraduationCap,
  Images,
  LayoutDashboard,
  Mail,
  MessageSquare,
  MessageSquareText,
  Pencil,
  Phone,
  RefreshCw,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { adminApiFetch } from "@/lib/admin-api";
import { AdminNotice } from "@/components/admin/AdminUi";
import AdminDetailDrawer from "@/components/admin/AdminDetailDrawer";
import CourseDemandAnalytics from "@/components/admin/CourseDemandAnalytics";
import { getAdminHref } from "@/lib/admin-routing";

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
  rawId: number;
  type: "students" | "courses" | "scholarships" | "messages";
  typeLabel: string;
  name: string;
  email: string;
  phone: string;
  detail: string;
  createdAt: string;
  link: string;
  studentClass?: string;
  preferredCourse?: string;
  courseTitle?: string;
  message?: string;
  firstName?: string;
  lastName?: string;
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

const formatFullDateTime = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
  const [selectedActivity, setSelectedActivity] = useState<UnifiedActivityItem | null>(null);

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
        rawId: s.id,
        type: "students",
        typeLabel: "Student",
        name: fullName,
        email: s.email || "No email provided",
        phone: s.mobileNumber || "—",
        detail: "Registered Student Account",
        createdAt: s.createdAt,
        link: "/admin/database/students",
        firstName: s.firstName,
        lastName: s.lastName,
      });
    });

    (stats.recentCourseRegistrations || []).forEach((c) => {
      list.push({
        id: `course-${c.id}`,
        rawId: c.id,
        type: "courses",
        typeLabel: "Course Enquiry",
        name: c.studentName || "Prospective Student",
        email: c.studentEmail || "No email provided",
        phone: c.studentPhone || "—",
        detail: c.courseTitle || "Course Registration",
        createdAt: c.createdAt,
        link: "/admin/database/course-forms",
        courseTitle: c.courseTitle,
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
        rawId: sc.id,
        type: "scholarships",
        typeLabel: "Scholarship",
        name: sc.studentName || "Scholarship Applicant",
        email: "Entrance Form",
        phone: sc.studentPhone || "—",
        detail: details || "Scholarship Registration",
        createdAt: sc.createdAt,
        link: "/admin/database/scholarship-forms",
        studentClass: sc.studentClass,
        preferredCourse: sc.preferredCourse,
      });
    });

    (stats.recentContactMessages || []).forEach((m) => {
      list.push({
        id: `message-${m.id}`,
        rawId: m.id,
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
        message: m.message,
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

  return (
    <div className="admin-dash">
      {/* 1. Executive Header Bar */}

      {error && <AdminNotice>{error}</AdminNotice>}

      {/* 2. Key Performance Indicators (Genuine Database Counts) */}
      <section className="admin-dash-kpis" aria-label="Academy KPIs">
        {/* Student Accounts */}
        <Link href={getAdminHref("/admin/database/students")} className="admin-dash-kpi is-students">
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
        <Link href={getAdminHref("/admin/database/course-forms")} className="admin-dash-kpi is-courses">
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
        <Link href={getAdminHref("/admin/database/scholarship-forms")} className="admin-dash-kpi is-scholarships">
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
        <Link href={getAdminHref("/admin/database/contact-messages")} className="admin-dash-kpi is-messages">
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
        <Link href={getAdminHref("/admin/content/courses")} className="admin-dash-kpi is-catalog">
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
        {/* Course Demand Analytics & Strategic Insights */}
        <CourseDemandAnalytics
          data={stats?.courseBreakdown || []}
          totalPublishedCourses={stats?.totalCourses || 0}
        />

        {/* Quick Operations Shortcuts */}
        <section className="admin-dash-panel" aria-label="Quick Shortcuts">
          <header className="admin-dash-panel-head">
            <h2 className="admin-dash-panel-title">Operations & Content</h2>
            <span className="admin-dash-badge">Quick Links</span>
          </header>

          <div className="admin-dash-shortcuts">
            <Link href={getAdminHref("/?edit=1")} target="_blank" className="admin-dash-shortcut">
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

            <Link href={getAdminHref("/admin/banners")} className="admin-dash-shortcut">
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

            <Link href={getAdminHref("/admin/content/courses")} className="admin-dash-shortcut">
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

            <Link href={getAdminHref("/admin/notifications")} className="admin-dash-shortcut">
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

            <Link href={getAdminHref("/admin/settings")} className="admin-dash-shortcut">
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
            <Search size={14} className="admin-dash-search-icon" aria-hidden="true" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search enquiries, name, phone..."
              className="admin-dash-search-input"
              aria-label="Search enquiries, name, or phone"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="admin-dash-search-clear"
                aria-label="Clear search"
                title="Clear search"
              >
                <X size={11} />
              </button>
            )}
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
                filteredActivities.map((item) => {
                  const isSelected = selectedActivity?.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedActivity(item)}
                      className={`admin-dash-row ${isSelected ? "is-selected" : ""}`}
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for ${item.name}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedActivity(item);
                        }
                      }}
                    >
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
                        <button
                          type="button"
                          className="admin-dash-link-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActivity(item);
                          }}
                          title="Open details"
                        >
                          View &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <footer className="admin-dash-footer">
          <span>
            Showing {filteredActivities.length} of {unifiedActivities.length} database records
          </span>
          <div className="admin-dash-footer-links">
            <Link href={getAdminHref("/admin/database/students")}>Students &rarr;</Link>
            <Link href={getAdminHref("/admin/database/course-forms")}>Course Enquiries &rarr;</Link>
            <Link href={getAdminHref("/admin/database/scholarship-forms")}>Scholarships &rarr;</Link>
            <Link href={getAdminHref("/admin/database/contact-messages")}>Messages &rarr;</Link>
          </div>
        </footer>
      </section>

      {/* 5. Responsive Right Details Drawer */}
      {selectedActivity && (
        <AdminDetailDrawer
          open={Boolean(selectedActivity)}
          onClose={() => setSelectedActivity(null)}
          recordId={selectedActivity.rawId}
          badge={{
            label: selectedActivity.typeLabel,
            variant: selectedActivity.type,
          }}
          title={selectedActivity.name}
          timestamp={formatFullDateTime(selectedActivity.createdAt)}
          email={
            selectedActivity.email !== "No email provided" &&
            selectedActivity.email !== "Entrance Form"
              ? selectedActivity.email
              : undefined
          }
          phone={selectedActivity.phone !== "—" ? selectedActivity.phone : undefined}
          fields={[
            { label: "Category", value: selectedActivity.typeLabel },
            ...(selectedActivity.type !== "messages"
              ? [{ label: "Program / Record", value: selectedActivity.detail }]
              : [{ label: "Inquiry Type", value: "Website Contact Form" }]),
            ...(selectedActivity.phone && selectedActivity.phone !== "—"
              ? [{ label: "Contact Phone", value: selectedActivity.phone, isPhone: true }]
              : []),
            ...(selectedActivity.email &&
            selectedActivity.email !== "No email provided" &&
            selectedActivity.email !== "Entrance Form"
              ? [
                  {
                    label: "Email Address",
                    value: selectedActivity.email,
                    isEmail: true,
                    fullWidth: true,
                  },
                ]
              : []),
            ...(selectedActivity.studentClass
              ? [{ label: "Student Class", value: `Class ${selectedActivity.studentClass}` }]
              : []),
            ...(selectedActivity.preferredCourse
              ? [{ label: "Preferred Course", value: selectedActivity.preferredCourse, fullWidth: true }]
              : []),
            ...(selectedActivity.courseTitle
              ? [{ label: "Course Applied", value: selectedActivity.courseTitle, fullWidth: true }]
              : []),
          ]}
          message={
            selectedActivity.message
              ? {
                  title: "Inquiry Message Content",
                  content: selectedActivity.message,
                  replySubject: `Regarding your inquiry at Success Code Academy`,
                }
              : undefined
          }
          databaseLink={{
            label: `Open in ${selectedActivity.typeLabel} Database`,
            href: getAdminHref(selectedActivity.link),
          }}
        />
      )}
    </div>
  );
}
