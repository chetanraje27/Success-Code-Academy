"use client";

import React, { useCallback, useState, useEffect } from "react";
import AdminModal from "./AdminModal";
import { adminApiFetch, uploadAdminImage } from "@/lib/admin-api";
import { useEditMode } from "./EditModeContext";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa6";
import RevisionHistoryButton from "./RevisionHistoryButton";
import { useToast } from "./Toast";
import { AdminEmptyState, AdminLoadingState, AdminNotice } from "./AdminUi";

interface StarStudent {
  id: number;
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
  const { bumpRefresh, isSuperAdmin } = useEditMode();
  const toast = useToast();
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

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminApiFetch<StarStudent[]>("stars");
      setItems(response.data);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load star students.",
      );
      toast.error(caught instanceof Error ? caught.message : "Unable to load star students.");
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    if (open) {
      // Opening the dialog synchronizes it with the remote CMS resource.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchItems();
      resetForm();
    }
  }, [fetchItems, open]);

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

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Delete this star student? You can restore it later from History.",
      )
    ) {
      return;
    }
    try {
      setLoading(true);
      await adminApiFetch(`stars/${id}`, {
        method: "DELETE",
      });
      toast.success("Star student deleted. You can restore it from History.");
      bumpRefresh();
      await fetchItems();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to delete star student.",
      );
      toast.error(caught instanceof Error ? caught.message : "Unable to delete star student.");
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
      toast.success("Student image uploaded.");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Image upload failed.",
      );
      toast.error(caught instanceof Error ? caught.message : "Image upload failed.");
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
        await adminApiFetch(`stars/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        await adminApiFetch("stars", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      bumpRefresh();
      toast.success(editingItem ? "Star student changes saved." : "Star student added.");
      await fetchItems();
      resetForm();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to save star student.",
      );
      toast.error(caught instanceof Error ? caught.message : "Unable to save star student.");
      setLoading(false);
    }
  };

  return (
    <AdminModal title="Manage Star Students" open={open} onClose={onClose} width={640}>
      {error && <AdminNotice>{error}</AdminNotice>}
      
      {!showForm ? (
        <>
          {/*
            Adding a star student and restoring older revisions are create-style
            actions reserved for super administrators. Standard administrators
            still see the list and can edit existing entries.
          */}
          {isSuperAdmin && (
            <div className="sca-admin-toolbar">
              <RevisionHistoryButton
                resourceType="star"
                itemName="Star student"
                className="sca-admin-btn ghost"
                onRestored={async () => {
                  bumpRefresh();
                  await fetchItems();
                }}
              />
              <button className="sca-admin-btn primary" onClick={() => setShowForm(true)}>
                <FaPlus /> Add Star Student
              </button>
            </div>
          )}
          
          {loading ? (
            <AdminLoadingState label="Loading star students…" />
          ) : items.length === 0 ? (
            <AdminEmptyState title="No star students yet" message="Add a student to highlight on the website." />
          ) : (
            <div className="sca-admin-list">
              {items.map((item) => (
                <div key={item.id} className="sca-admin-list-item">
                  {item.image && (
                    // Dynamic CMS URLs are validated by the API.
                    // eslint-disable-next-line @next/next/no-img-element
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
                    {isSuperAdmin && (
                      <button className="sca-admin-icon-btn danger" onClick={() => handleDelete(item.id)}>
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
              // Dynamic CMS URLs are validated by the API.
              // eslint-disable-next-line @next/next/no-img-element
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
