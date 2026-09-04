"use client";

import React, { useState, useEffect } from "react";
import AdminModal from "./AdminModal";
import { apiFetch } from "@/lib/api";
import { useEditMode } from "./EditModeContext";
import {
  FaPen,
  FaTrash,
  FaPlus,
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
  FaLink,
  FaArrowRight,
} from "react-icons/fa6";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";

interface Notification {
  id: string;
  text: string;
  link?: string;
  icon?: string;
  isActive: boolean;
  orderIndex: number;
}

interface NotificationEditorProps {
  open: boolean;
  onClose: () => void;
}

const ICON_PRESETS = [
  { key: "megaphone", label: "Announcement", icon: <FaBullhorn /> },
  { key: "sparkles", label: "Featured", icon: <FaWandMagicSparkles /> },
  { key: "bell", label: "Notice", icon: <FaBell /> },
  { key: "trophy", label: "Result", icon: <FaTrophy /> },
  { key: "star", label: "Important", icon: <FaStar /> },
  { key: "flame", label: "Trending", icon: <FaFire /> },
  { key: "graduation-cap", label: "Batches", icon: <FaGraduationCap /> },
  { key: "calendar", label: "Schedule", icon: <FaCalendarDays /> },
  { key: "gift", label: "Scholarship", icon: <FaGift /> },
  { key: "alert", label: "Urgent", icon: <FaTriangleExclamation /> },
];

export function renderIconByKey(iconKey?: string) {
  const match = ICON_PRESETS.find((p) => p.key === iconKey);
  if (match) return match.icon;
  if (iconKey) return <span>{iconKey}</span>;
  return <FaBullhorn />;
}

export default function NotificationEditor({ open, onClose }: NotificationEditorProps) {
  const { bumpRefresh, isSuperAdmin } = useEditMode();
  const toast = useToast();
  const confirmAction = useConfirm();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Notification | null>(null);

  const [formData, setFormData] = useState({
    text: "",
    link: "",
    icon: "megaphone",
    isActive: true,
    orderIndex: 0,
  });

  useEffect(() => {
    if (open) {
      fetchItems();
      resetForm();
    }
  }, [open]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiFetch("/api/v1/admin/notifications", { auth: true });
      if (res && res.data) {
        setItems(res.data);
      } else if (Array.isArray(res)) {
        setItems(res);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch notifications");
      toast.error(err.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const getNextOrderIndex = (currentItems: Notification[]) => {
    if (!currentItems || currentItems.length === 0) return 1;
    const maxOrder = Math.max(...currentItems.map((item) => item.orderIndex || 0));
    return maxOrder > 0 ? maxOrder + 1 : 1;
  };

  const resetForm = () => {
    setFormData({
      text: "",
      link: "",
      icon: "megaphone",
      isActive: true,
      orderIndex: getNextOrderIndex(items),
    });
    setEditingItem(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (item: Notification) => {
    setEditingItem(item);
    setFormData({
      text: item.text,
      link: item.link || "",
      icon: item.icon || "megaphone",
      isActive: item.isActive,
      orderIndex: Math.max(1, item.orderIndex || 1),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!(await confirmAction({
      title: "Delete notification?",
      message: "This announcement will be removed from the website. This action cannot be undone.",
      confirmLabel: "Delete notification",
      tone: "destructive",
    }))) return;
    try {
      setLoading(true);
      await apiFetch(`/api/v1/admin/notifications/${id}`, {
        method: "DELETE",
        auth: true,
      });
      toast.success("Notification deleted.");
      bumpRefresh();
      fetchItems();
    } catch (err: any) {
      setError(err.message || "Failed to delete notification");
      toast.error(err.message || "Failed to delete notification");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      if (editingItem) {
        await apiFetch(`/api/v1/admin/notifications/${editingItem.id}`, {
          method: "PUT",
          auth: true,
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch("/api/v1/admin/notifications", {
          method: "POST",
          auth: true,
          body: JSON.stringify(formData),
        });
      }
      bumpRefresh();
      toast.success(editingItem ? "Notification updated." : "Notification created.");
      fetchItems();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to save notification");
      toast.error(err.message || "Failed to save notification");
      setLoading(false);
    }
  };

  return (
    <AdminModal title="Manage Notifications & Announcements" open={open} onClose={onClose} width={620}>
      {error && <div className="sca-admin-error">{error}</div>}

      {!showForm ? (
        <>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* Creating announcements is a super-admin action. */}
            {isSuperAdmin ? (
              <button className="sca-admin-btn primary" onClick={() => setShowForm(true)}>
                <FaPlus /> Add Notification
              </button>
            ) : (
              <span />
            )}
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Total: {items.length} announcement{items.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading ? (
            <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Loading notifications...</div>
          ) : items.length === 0 ? (
            <div className="sca-admin-empty">No notifications found</div>
          ) : (
            <div className="sca-admin-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="sca-admin-list-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    background: item.isActive ? "#ffffff" : "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "#eff6ff",
                      color: "#2563eb",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    {renderIconByKey(item.icon)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.92rem",
                        color: "#1e293b",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.text}
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "2px", fontSize: "0.78rem" }}>
                      <span
                        style={{
                          color: item.isActive ? "#16a34a" : "#94a3b8",
                          fontWeight: 600,
                        }}
                      >
                        {item.isActive ? "● Active" : "○ Inactive"}
                      </span>
                      {item.link && (
                        <span style={{ color: "#2563eb", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                          <FaLink style={{ fontSize: "0.7rem" }} /> {item.link}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="sca-admin-list-actions" style={{ display: "flex", gap: "6px" }}>
                    <button className="sca-admin-icon-btn" onClick={() => handleEdit(item)} title="Edit">
                      <FaPen />
                    </button>
                    {isSuperAdmin && (
                      <button className="sca-admin-icon-btn danger" onClick={() => handleDelete(item.id)} title="Delete">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Icon Selector */}
          <div className="sca-admin-field">
            <label style={{ fontWeight: 600, marginBottom: "6px", display: "block" }}>Select Notification Icon</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", marginBottom: "8px" }}>
              {ICON_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: preset.key })}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    padding: "8px 4px",
                    borderRadius: "8px",
                    border: formData.icon === preset.key ? "2px solid #2563eb" : "1px solid #cbd5e1",
                    background: formData.icon === preset.key ? "#eff6ff" : "#ffffff",
                    color: formData.icon === preset.key ? "#1d4ed8" : "#475569",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{preset.icon}</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 500 }}>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sca-admin-field">
            <label style={{ fontWeight: 600, marginBottom: "4px", display: "block" }}>Announcement Text</label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
              rows={3}
              placeholder="Admissions open for the 2026–27 NEET batches!"
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div className="sca-admin-field">
            <label style={{ fontWeight: 600, marginBottom: "4px", display: "block" }}>Redirection Link (Optional)</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="/admissions"
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
            <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px", display: "block" }}>
              Enter an internal page path (e.g. <code>/admissions</code>, <code>/courses</code>) or full URL.
            </span>
          </div>

          {/* Banner Live Preview */}
          <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "8px", background: "#0a192f", color: "#ffffff" }}>
            <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", marginBottom: "4px" }}>
              Header Banner Preview:
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}>
              <span style={{ color: "#60a5fa", fontSize: "1rem" }}>{renderIconByKey(formData.icon)}</span>
              <span style={{ flex: 1, fontWeight: 500 }}>{formData.text || "Your announcement text here..."}</span>
              {formData.link && (
                <span style={{ fontSize: "0.75rem", color: "#60a5fa", display: "flex", alignItems: "center", gap: "3px" }}>
                  Link <FaArrowRight style={{ fontSize: "0.65rem" }} />
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "16px" }}>
            <div className="sca-admin-field" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontWeight: 600, marginBottom: "4px", display: "block" }}>Display Order</label>
              <input
                type="number"
                min={1}
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: Math.max(1, parseInt(e.target.value) || 1) })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </div>

            <div className="sca-admin-check" style={{ flex: 1, marginTop: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Visible on Website
              </label>
            </div>
          </div>

          <div className="sca-admin-row" style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <button type="button" className="sca-admin-btn ghost" onClick={resetForm} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="sca-admin-btn primary" disabled={loading}>
              {loading ? "Saving..." : editingItem ? "Update Announcement" : "Create Announcement"}
            </button>
          </div>
        </form>
      )}
    </AdminModal>
  );
}
