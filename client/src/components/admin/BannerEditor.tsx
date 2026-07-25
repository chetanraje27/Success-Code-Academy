"use client";

import React, { useCallback, useState, useEffect } from "react";
import AdminModal from "./AdminModal";
import { adminApiFetch, uploadAdminImage } from "@/lib/admin-api";
import { useEditMode } from "./EditModeContext";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa6";

interface Banner {
  id: string;
  image: string;
  altText: string;
  targetUrl: string | null;
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
    targetUrl: "",
    type: "HOME",
    isActive: true,
    orderIndex: 0,
  });
  const [uploading, setUploading] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminApiFetch<Banner[]>("banners");
      setItems(response.data);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to load banners.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const resetForm = () => {
    setFormData({
      image: "",
      altText: "",
      targetUrl: "",
      type: "HOME",
      isActive: true,
      orderIndex: 0,
    });
    setEditingItem(null);
    setShowForm(false);
    setError("");
  };

  useEffect(() => {
    if (open) {
      // Opening the dialog synchronizes it with the remote banner resource.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchItems();
      resetForm();
    }
  }, [fetchItems, open]);

  const handleEdit = (item: Banner) => {
    setEditingItem(item);
    setFormData({
      image: item.image,
      altText: item.altText,
      targetUrl: item.targetUrl || "",
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
      await adminApiFetch(`banners/${id}`, {
        method: "DELETE",
      });
      bumpRefresh();
      await fetchItems();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to delete banner.",
      );
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
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Image upload failed.",
      );
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
        await adminApiFetch(`banners/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        await adminApiFetch("banners", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      bumpRefresh();
      await fetchItems();
      resetForm();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to save banner.",
      );
      setLoading(false);
    }
  };

  return (
    <AdminModal title="Manage Banners" open={open} onClose={onClose} width={640}>
      {error && <div className="sca-admin-error">{error}</div>}
      
      {!showForm ? (
        <>
          <div className="sca-admin-toolbar">
            <button type="button" className="sca-admin-btn primary" onClick={() => setShowForm(true)}>
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
                    // Dynamic CMS URLs are validated by the API.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="sca-admin-thumb" />
                  )}
                  <div className="sca-admin-list-copy">
                    <strong>{item.altText || "No description"}</strong>
                    <div className="sca-admin-meta">
                      {item.type === "HOME" ? "Home page" : "Results page"} ·{" "}
                      {item.isActive ? "Visible" : "Hidden"}
                    </div>
                  </div>
                  <div className="sca-admin-list-actions">
                    <button type="button" className="sca-admin-icon-btn" onClick={() => handleEdit(item)} aria-label={`Edit ${item.altText || "banner"}`}>
                      <FaPen />
                    </button>
                    <button type="button" className="sca-admin-icon-btn danger" onClick={() => handleDelete(item.id)} aria-label={`Delete ${item.altText || "banner"}`}>
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
            <label htmlFor="live-banner-image">Banner image</label>
            <input
              id="live-banner-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageSelect}
              required={!formData.image}
            />
            <small>Use a wide landscape image. JPG, PNG, WebP, or GIF up to 5 MB.</small>
            {uploading && <span role="status">Uploading image…</span>}
            {formData.image && (
              // Dynamic CMS URLs are validated by the API.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={formData.image} alt="Banner preview" className="sca-admin-preview wide" />
            )}
          </div>
          <div className="sca-admin-field">
            <label htmlFor="live-banner-description">Image description</label>
            <input
              id="live-banner-description"
              type="text"
              value={formData.altText}
              onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
              placeholder="Example: NEET 2026 achievers"
              required
            />
            <small>Describe what the banner communicates in one short sentence.</small>
          </div>
          <div className="sca-admin-field">
            <label htmlFor="live-banner-destination">
              Click destination (optional)
            </label>
            <input
              id="live-banner-destination"
              type="text"
              value={formData.targetUrl}
              onChange={(event) =>
                setFormData({ ...formData, targetUrl: event.target.value })
              }
              placeholder="/courses or https://example.com"
            />
            <small>
              Leave blank when the banner should not open another page.
            </small>
          </div>
          <div className="sca-admin-row">
            <div className="sca-admin-field">
              <label htmlFor="live-banner-page">Shown on</label>
              <select
                id="live-banner-page"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="HOME">Home page</option>
                <option value="RESULTS">Results page</option>
              </select>
            </div>
            <div className="sca-admin-field">
              <label htmlFor="live-banner-order">Display order</label>
              <input
                id="live-banner-order"
                type="number"
                min={0}
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
              />
              <small>Lower numbers appear first.</small>
            </div>
          </div>
          <div className="sca-admin-check">
            <label>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Visible on the website
            </label>
          </div>
          <div className="sca-admin-form-actions">
            <button type="button" className="sca-admin-btn ghost" onClick={resetForm} disabled={loading || uploading}>
              Cancel
            </button>
            <button type="submit" className="sca-admin-btn primary" disabled={loading || uploading}>
              {loading ? "Saving…" : editingItem ? "Save changes" : "Add banner"}
            </button>
          </div>
        </form>
      )}
    </AdminModal>
  );
}
