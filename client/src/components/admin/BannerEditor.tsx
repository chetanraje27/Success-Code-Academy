"use client";

import React, { useState, useEffect } from "react";
import AdminModal from "./AdminModal";
import { apiFetch, uploadAdminImage } from "@/lib/api";
import { useEditMode } from "./EditModeContext";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa6";

interface Banner {
  id: string;
  image: string;
  altText: string;
  type: string;
  isActive: boolean;
  orderIndex: number;
}

interface BannerEditorProps {
  open: boolean;
  onClose: () => void;
}

export default function BannerEditor({ open, onClose }: BannerEditorProps) {
  const { bumpRefresh } = useEditMode();
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Banner | null>(null);

  const [formData, setFormData] = useState({
    image: "",
    altText: "",
    type: "HOME",
    isActive: true,
    orderIndex: 0,
  });
  const [uploading, setUploading] = useState(false);

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
      const res = await apiFetch("/api/v1/admin/banners", { auth: true });
      if (res && res.data) {
        setItems(res.data);
      } else if (Array.isArray(res)) {
        setItems(res);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      image: "",
      altText: "",
      type: "HOME",
      isActive: true,
      orderIndex: 0,
    });
    setEditingItem(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (item: Banner) => {
    setEditingItem(item);
    setFormData({
      image: item.image,
      altText: item.altText,
      type: item.type,
      isActive: item.isActive,
      orderIndex: item.orderIndex,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      setLoading(true);
      await apiFetch(`/api/v1/admin/banners/${id}`, {
        method: "DELETE",
        auth: true,
      });
      bumpRefresh();
      fetchItems();
    } catch (err: any) {
      setError(err.message || "Failed to delete banner");
      setLoading(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      const url = await uploadAdminImage(file, "banner");
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err: any) {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      if (editingItem) {
        await apiFetch(`/api/v1/admin/banners/${editingItem.id}`, {
          method: "PUT",
          auth: true,
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch("/api/v1/admin/banners", {
          method: "POST",
          auth: true,
          body: JSON.stringify(formData),
        });
      }
      bumpRefresh();
      fetchItems();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to save banner");
      setLoading(false);
    }
  };

  return (
    <AdminModal title="Manage Banners" open={open} onClose={onClose} width={640}>
      {error && <div className="sca-admin-error">{error}</div>}
      
      {!showForm ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <button className="sca-admin-btn primary" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Banner
            </button>
          </div>
          
          {loading ? (
            <div>Loading...</div>
          ) : items.length === 0 ? (
            <div className="sca-admin-empty">No banners found</div>
          ) : (
            <div className="sca-admin-list">
              {items.map((item) => (
                <div key={item.id} className="sca-admin-list-item">
                  {item.image && (
                    <img src={item.image} alt={item.altText} className="sca-admin-thumb" style={{ width: 60, height: 40, objectFit: "cover" }} />
                  )}
                  <div style={{ flex: 1, marginLeft: 12 }}>
                    <div style={{ fontWeight: 600 }}>{item.altText || "No text"}</div>
                    <div style={{ fontSize: "0.85em", color: "#666" }}>
                      Type: {item.type} | {item.isActive ? "Active" : "Inactive"}
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
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleImageSelect} />
            {uploading && <span>Uploading...</span>}
            {formData.image && (
              <img src={formData.image} alt="Preview" style={{ marginTop: 8, maxWidth: 100 }} />
            )}
          </div>
          <div className="sca-admin-field">
            <label>Alt Text</label>
            <input
              type="text"
              value={formData.altText}
              onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
            />
          </div>
          <div className="sca-admin-row">
            <div className="sca-admin-field">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="HOME">HOME</option>
                <option value="RESULTS">RESULTS</option>
              </select>
            </div>
            <div className="sca-admin-field">
              <label>Order Index</label>
              <input
                type="number"
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
              />
            </div>
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
            <button type="button" className="sca-admin-btn ghost" onClick={resetForm} disabled={loading || uploading}>
              Cancel
            </button>
            <button type="submit" className="sca-admin-btn primary" disabled={loading || uploading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </AdminModal>
  );
}
