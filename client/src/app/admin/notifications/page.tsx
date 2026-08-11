"use client";

import AdminContentManager from "@/components/admin/AdminContentManager";
import {
  FaBullhorn,
  FaWandMagicSparkles,
  FaBell,
  FaTrophy,
  FaStar,
  FaFire,
  FaGraduationCap,
  FaCalendarDays,
  FaGift,
  FaTriangleExclamation,
  FaArrowRight,
  FaLink,
} from "react-icons/fa6";

const ICON_PRESETS: Record<string, { label: string; icon: React.ReactNode }> = {
  megaphone: { label: "📢 Announcement", icon: <FaBullhorn style={{ color: "#3b82f6" }} /> },
  sparkles: { label: "✨ New / Featured", icon: <FaWandMagicSparkles style={{ color: "#eab308" }} /> },
  bell: { label: "🔔 Notice / Update", icon: <FaBell style={{ color: "#06b6d4" }} /> },
  trophy: { label: "🏆 Achievement / Result", icon: <FaTrophy style={{ color: "#f59e0b" }} /> },
  star: { label: "⭐ Important", icon: <FaStar style={{ color: "#eab308" }} /> },
  flame: { label: "🔥 Hot / Trending", icon: <FaFire style={{ color: "#ef4444" }} /> },
  "graduation-cap": { label: "🎓 Admissions / Batches", icon: <FaGraduationCap style={{ color: "#8b5cf6" }} /> },
  calendar: { label: "📅 Date / Schedule", icon: <FaCalendarDays style={{ color: "#10b981" }} /> },
  gift: { label: "🎁 Offer / Scholarship", icon: <FaGift style={{ color: "#ec4899" }} /> },
  alert: { label: "⚠️ Urgent Notice", icon: <FaTriangleExclamation style={{ color: "#f97316" }} /> },
};

export function renderNotificationIcon(iconKey?: string) {
  if (!iconKey) return <FaBullhorn style={{ color: "#3b82f6" }} />;
  if (ICON_PRESETS[iconKey]) {
    return ICON_PRESETS[iconKey].icon;
  }
  // Custom emoji or text icon
  return <span style={{ fontSize: "1.1em" }}>{iconKey}</span>;
}

export default function AdminNotificationsPage() {
  return (
    <AdminContentManager
      title="Announcements & Notifications"
      description="Create and manage top notification bar announcements. Select an icon, enter your message text, and specify an optional link for user redirection."
      itemName="Announcement"
      resource="notifications"
      fields={[
        {
          name: "icon",
          label: "Notification Icon",
          kind: "select",
          defaultValue: "megaphone",
          options: [
            { label: "📢 Megaphone (Announcement)", value: "megaphone" },
            { label: "✨ Sparkles (New / Featured)", value: "sparkles" },
            { label: "🔔 Bell (Notice / Update)", value: "bell" },
            { label: "🏆 Trophy (Results)", value: "trophy" },
            { label: "⭐ Star (Important)", value: "star" },
            { label: "🔥 Flame (Hot / Trending)", value: "flame" },
            { label: "🎓 Graduation Cap (Admissions)", value: "graduation-cap" },
            { label: "📅 Calendar (Schedule)", value: "calendar" },
            { label: "🎁 Gift (Scholarship)", value: "gift" },
            { label: "⚠️ Alert (Urgent)", value: "alert" },
          ],
          help: "Choose an icon to display alongside the announcement.",
        },
        {
          name: "text",
          label: "Announcement text",
          kind: "textarea",
          required: true,
          full: true,
          placeholder: "Admissions open for the 2026–27 NEET batches!",
          help: "Maximum 280 characters.",
        },
        {
          name: "link",
          label: "Optional Redirection Link",
          kind: "url",
          full: true,
          placeholder: "/admissions",
          help: "Use an internal path (e.g., /admissions or /courses) or full URL. Clicking the notification on the site will redirect users here.",
        },
        {
          name: "orderIndex",
          label: "Display order",
          kind: "number",
          defaultValue: 1,
          min: 1,
        },
        {
          name: "isActive",
          label: "Visible on the website",
          kind: "checkbox",
          defaultValue: true,
          help: "Turn this off to save the message without publishing it.",
        },
      ]}
      columns={[
        {
          label: "Announcement",
          key: "text",
          render: (item) => (
            <div className="admin-cell-media">
              <span className="admin-icon-tile">
                {renderNotificationIcon(item.icon as string | undefined)}
              </span>
              <div>
                <span className="admin-table-title">{String(item.text || "")}</span>
                {item.link ? (
                  <span className="admin-inline-link">
                    <FaLink aria-hidden="true" />
                    <span>Redirects to {String(item.link)}</span>
                  </span>
                ) : (
                  <span className="admin-table-subtitle">No redirect link</span>
                )}
              </div>
            </div>
          ),
        },
        {
          label: "Link Target",
          key: "link",
          render: (item) =>
            item.link ? (
              <span className="admin-inline-tag">
                {String(item.link)} <FaArrowRight aria-hidden="true" />
              </span>
            ) : (
              <span className="admin-cell-empty">—</span>
            ),
        },
        { label: "Order", key: "orderIndex" },
        { label: "Status", key: "isActive", kind: "status" },
      ]}
    />
  );
}
