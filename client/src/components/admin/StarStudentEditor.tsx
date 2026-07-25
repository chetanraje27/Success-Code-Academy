"use client";

import React, { useState, useEffect } from "react";
import AdminModal from "./AdminModal";
import { apiFetch, uploadAdminImage } from "@/lib/api";
import { useEditMode } from "./EditModeContext";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa6";

interface StarStudent {
  id: string;
  name: string;
  score: string;
  rank: string;
  course: string;
  year: string;
  image: string;
  colorHex: string;
  isActive: boolean;
  orderIndex: number;
}

interface StarStudentEditorProps {
  open: boolean;
  onClose: () => void;
}

export default function StarStudentEditor({ open, onClose }: StarStudentEditorProps) {
  const { bumpRefresh } = useEditMode();
  const [items, setItems] = useState<StarStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<StarStudent | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    score: "",
    rank: "",
    course: "",
    year: "",
    image: "",
    colorHex: "#000000",
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
      const res = await apiFetch("/api/v1/admin/stars", { auth: true });
      if (res && res.data) {
        setItems(res.data);
      } else if (Array.isArray(res)) {
        setItems(res);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch star students");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      score: "",
      rank: "",
      course: "",
      year: "",
      image: "",
      colorHex: "#000000",
      isActive: true,
      orderIndex: 0,
    });
    setEditingItem(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (item: StarStudent) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      score: item.score,
      rank: item.rank,
      course: item.course,
      year: item.year,
      image: item.image,
      colorHex: item.colorHex || "#000000",
      isActive: item.isActive,
      orderIndex: item.orderIndex,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this star student?")) return;
    try {
      setLoading(true);
      await apiFetch(`/api/v1/admin/stars/${id}`, {
        method: "DELETE",
        auth: true,
      });
      bumpRefresh();
      fetchItems();
    } catch (err: any) {
      setError(err.message || "Failed to delete star student");
      setLoading(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      const url = await uploadAdminImage(file, "star");
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
        await apiFetch(`/api/v1/admin/stars/${editingItem.id}`, {
          method: "PUT",
          auth: true,
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch("/api/v1/admin/stars", {
          method: "POST",
          auth: true,
          body: JSON.stringify(formData),
        });
      }
      bumpRefresh();
      fetchItems();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to save star student");
      setLoading(false);
    }
  };

  return (
    <AdminModal title="Manage Star Students" open={open} onClose={onClose} width={640}>
      {error && <div className="sca-admin-error">{error}</div>}
      
      {!showForm ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <button className="sca-admin-btn primary" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Star Student
            </button>
          </div>
          
          {loading ? (
            <div>Loading...</div>
          ) : items.length === 0 ? (
            <div className="sca-admin-empty">No star students found</div>
          ) : (
            <div className="sca-admin-list">
              {items.map((item) => (
                <div key={item.id} className="sca-admin-list-item">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="sca-admin-thumb" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                  )}
                  <div style={{ flex: 1, marginLeft: 12 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: "0.85em", color: "#666" }}>
                      {item.course} | Score: {item.score} | Rank: {item.rank}
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
          <div className="sca-admin-row">
            <div className="sca-admin-field">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="sca-admin-field">
              <label>Course</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              />
            </div>
          </div>
          
          <div className="sca-admin-row">
            <div className="sca-admin-field">
              <label>Score</label>
              <input
                type="text"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              />
            </div>
            <div className="sca-admin-field">
              <label>Rank</label>
              <input
                type="text"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              />
            </div>
          </div>
          
          <div className="sca-admin-row">
            <div className="sca-admin-field">
              <label>Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
            <div className="sca-admin-field">
              <label>Color Hex</label>
              <input
                type="color"
                value={formData.colorHex}
                onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
              />
            </div>
          </div>

          <div className="sca-admin-field">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleImageSelect} />
            {uploading && <span>Uploading...</span>}
            {formData.image && (
              <img src={formData.image} alt="Preview" style={{ marginTop: 8, maxWidth: 100 }} />
            )}
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
