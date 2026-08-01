"use client";

import React, { useState, useEffect } from "react";
import AdminModal from "./AdminModal";
import { adminApiFetch } from "@/lib/admin-api";
import { FaTrash, FaPlus } from "react-icons/fa6";

export default function CourseEditor({
  open,
  onClose,
  course,
  onSaved
}: {
  open: boolean;
  onClose: () => void;
  course: any;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    category: "freshers",
    type: "",
    badge: "",
    description: "",
    highlights: [""],
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isNew = !course?.id;

  useEffect(() => {
    if (open) {
      if (course && course.id) {
        setFormData({
          title: course.title || "",
          slug: course.slug || "",
          category: course.category || "freshers",
          type: course.type || "",
          badge: course.badge || "",
          description: course.description || "",
          highlights: course.highlights?.length ? [...course.highlights] : [""],
          isActive: course.isActive ?? true
        });
      } else {
        setFormData({
          title: "",
          slug: "",
          category: "freshers",
          type: "",
          badge: "",
          description: "",
          highlights: [""],
          isActive: true
        });
      }
      setError("");
    }
  }, [open, course]);

  const updateHighlight = (index: number, val: string) => {
    const next = [...formData.highlights];
    next[index] = val;
    setFormData({ ...formData, highlights: next });
  };

  const removeHighlight = (index: number) => {
    const next = [...formData.highlights];
    next.splice(index, 1);
    if (next.length === 0) next.push(""); // always keep one
    setFormData({ ...formData, highlights: next });
  };

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ""] });
  };

  async function handleSave() {
    if (!course) return; // handles the modal closing animation state safely
    setLoading(true);
    setError("");

    try {
      const payload = { ...formData };
      // Filter out empty highlights
      payload.highlights = payload.highlights.filter((h: string) => h.trim() !== "");
      if (payload.highlights.length === 0) {
        throw new Error("Please add at least one highlight");
      }

      const endpoint = isNew 
        ? `/api/v1/admin/courses` 
        : `/api/v1/admin/courses/${course.id}`;
      
      const method = isNew ? "POST" : "PUT";

      await adminApiFetch(endpoint, {
        method,
        body: JSON.stringify(payload)
      });
      
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message || "Error saving course");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModal open={open} onClose={onClose} title={isNew ? "Add New Course" : "Edit Course"} width={640}>
      <div className="sca-admin-form" style={{ padding: "20px" }}>
        {error && <div className="sca-admin-error">{error}</div>}
        
        <div className="sca-admin-row">
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Course Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. NEET Freshers"
            />
          </div>
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>URL Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              placeholder="e.g. neet-fresher"
            />
          </div>
        </div>

        <div className="sca-admin-row">
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="freshers">Freshers</option>
              <option value="repeaters">Repeaters</option>
              <option value="test-series">Test Series</option>
            </select>
          </div>
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Course Type</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="e.g. CLASSROOM COURSE"
            />
          </div>
        </div>

        <div className="sca-admin-field">
          <label>Date Badge</label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            placeholder="e.g. Starts: 9 July"
          />
        </div>

        <div className="sca-admin-field">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the course..."
            rows={3}
          />
        </div>

        <div className="sca-admin-field">
          <label>Course Highlights</label>
          {formData.highlights.map((highlight: string, index: number) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                value={highlight}
                onChange={(e) => updateHighlight(index, e.target.value)}
                placeholder={`Highlight ${index + 1}`}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="sca-admin-icon-btn danger"
                onClick={() => removeHighlight(index)}
                aria-label="Remove highlight"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="sca-admin-btn ghost"
            onClick={addHighlight}
            style={{ alignSelf: 'flex-start', marginTop: '4px' }}
          >
            <FaPlus size={12} style={{ marginRight: '6px' }} />
            Add Highlight
          </button>
        </div>

        <label className="sca-admin-check" style={{ marginTop: '16px' }}>
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          <span>Course is Active (Visible on website)</span>
        </label>

        <div className="sca-admin-row" style={{ marginTop: "24px", justifyContent: "flex-end" }}>
          <button type="button" className="sca-admin-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="sca-admin-btn primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Course"}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
