"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ClipboardList,
  GraduationCap,
  ImagePlus,
  Images,
  Pencil,
  Settings,
  Users,
} from "lucide-react";
import { adminApiFetch } from "@/lib/admin-api";
import {
  AdminCardsSkeleton,
  AdminEmptyState,
  AdminNotice,
  AdminPageHeader,
  AdminTableSkeleton,
  formatAdminDate,
} from "@/components/admin/AdminUi";

type RecentStudent = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber: string;
  createdAt: string;
};

type DashboardStats = {
  totalStudents: number;
  totalCourseForms: number;
  totalScholarshipForms: number;
  recentStudents: RecentStudent[];
};

const quickActions = [
  {
    label: "Edit the live website",
    description: "Open the visual editor with on-page pencil controls.",
    href: "/?edit=1",
    icon: Pencil,
  },
  {
    label: "Update banners",
    description: "Change the homepage hero images.",
    href: "/admin/banners",
    icon: Images,
  },
  {
    label: "Update page banners",
    description: "Change the homepage hero images.",
    href: "/admin/page-banners",
    icon: ImagePlus,
  },
  {
    label: "Post an announcement",
    description: "Keep admissions and deadline notices current.",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Edit contact details",
    description: "Update phone, email, address, and social links.",
    href: "/admin/settings",
    icon: Settings,
  },
] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApiFetch<DashboardStats>("stats")
      .then((response) => setStats(response.data))
      .catch((caught: unknown) =>
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load the dashboard.",
        ),
      );
  }, []);

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="A quick view of new registrations and the website tasks staff use most often."
        action={
          <Link className="admin-button secondary" href="/" target="_blank">
            View website
          </Link>
        }
      />

      {error && (
        <AdminNotice>{error}</AdminNotice>
      )}

      {!stats ? (
        <AdminCardsSkeleton count={3} label="Loading registration totals" />
      ) : (
        <section className="admin-stats-grid" aria-label="Registration totals">
          {[
            {
              label: "Student accounts",
              value: stats.totalStudents,
              icon: Users,
            },
            {
              label: "Course enquiries",
              value: stats.totalCourseForms,
              icon: ClipboardList,
            },
            {
              label: "Scholarship forms",
              value: stats.totalScholarshipForms,
              icon: GraduationCap,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div className="admin-card admin-stat-card" key={item.label}>
                <span className="admin-stat-icon">
                  <Icon size={21} />
                </span>
                <div>
                  <strong>{item.value ?? "—"}</strong>
                  <span>{item.label}</span>
                </div>
              </div>
            );
          })}
        </section>
      )}

      <section className="admin-card">
        <header className="admin-card-header">
          <div>
            <h2>Common tasks</h2>
            <p>Shortcuts to the content that changes most often</p>
          </div>
        </header>
        <div className="admin-card-body admin-quick-actions">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link href={action.href} className="admin-quick-action" key={action.href}>
                <span className="admin-stat-icon">
                  <Icon size={20} />
                </span>
                <span>
                  <strong>{action.label}</strong>
                  <small>{action.description}</small>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="admin-card">
        <header className="admin-card-header">
          <div>
            <h2>Recent student registrations</h2>
            <p>The five newest student accounts</p>
          </div>
          <Link href="/admin/database/students" className="admin-button secondary">
            View all
          </Link>
        </header>
        {!stats ? (
          <AdminTableSkeleton
            rows={5}
            columns={3}
            label="Loading recent registrations"
          />
        ) : stats.recentStudents.length === 0 ? (
          <AdminEmptyState
            title="No student registrations yet"
            message="New student accounts will appear here."
          />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Mobile</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <span className="admin-table-title">
                        {[student.firstName, student.lastName]
                          .filter(Boolean)
                          .join(" ") || "Unnamed student"}
                      </span>
                      <span className="admin-table-subtitle">
                        {student.email || "No email provided"}
                      </span>
                    </td>
                    <td>{student.mobileNumber}</td>
                    <td>{formatAdminDate(student.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
