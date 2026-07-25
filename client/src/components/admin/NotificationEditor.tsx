"use client";

import React, { useState, useEffect } from "react";
import AdminModal from "./AdminModal";
import { apiFetch } from "@/lib/api";
import { useEditMode } from "./EditModeContext";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa6";

interface Notification {
  id: string;
  text: string;
  link?: string;
  isActive: boolean;
  orderIndex: number;
}

interface NotificationEditorProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationEditor({ open, onClose }: NotificationEditorProps) {
  const { bumpRefresh } = useEditMode();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Notification | null>(null);

  const [formData, setFormData] = useState({
    text: "",
    link: "",
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
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      text: "",
      link: "",
      isActive: true,
      orderIndex: 0,
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
      isActive: item.isActive,
      orderIndex: item.orderIndex,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      setLoading(true);
      await apiFetch(`/api/v1/admin/notifications/${id}`, {
        method: "DELETE",
        auth: true,
      });
      bumpRefresh();
      fetchItems();
    } catch (err: any) {
      setError(err.message || "Failed to delete notification");
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
      fetchItems();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to save notification");
      setLoading(false);
    }
  };

  return (
    <AdminModal title="Manage Notifications" open={open} onClose={onClose} width={560}>
      {error && <div className="sca-admin-error">{error}</div>}
      
      {!showForm ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <button className="sca-admin-btn primary" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Notification
            </button>
          </div>
          
          {loading ? (
            <div>Loading...</div>
          ) : items.length === 0 ? (
            <div className="sca-admin-empty">No notifications found</div>
          ) : (
            <div className="sca-admin-list">
              {items.map((item) => (
                <div key={item.id} className="sca-admin-list-item">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.text}</div>
                    <div style={{ fontSize: "0.85em", color: "#666" }}>
                      {item.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <div className="sca-admin-list-actions">
                    <button className="sca-admin-icon-btn" onClick={() => handleEdit(item)}>
                      <FaPen />
                    </button>
                    <button className="sca-admin-icon-btn danger" onClick={() => handleDelete(item.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <form className="sca-admin-form" onSubmit={handleSubmit}>
          <div className="sca-admin-field">
            <label>Text</label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
              rows={3}
            />
          </div>
          <div className="sca-admin-field">
            <label>Link (Optional)</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            />
          </div>
          <div className="sca-admin-field">
            <label>Order Index</label>
            <input
              type="number"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="sca-admin-check">
            <label>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>
          <div className="sca-admin-row" style={{ marginTop: 16 }}>
            <button type="button" className="sca-admin-btn ghost" onClick={resetForm} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="sca-admin-btn primary" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </AdminModal>
  );
}
