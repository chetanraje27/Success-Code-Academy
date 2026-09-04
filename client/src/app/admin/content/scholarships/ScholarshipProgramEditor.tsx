"use client";

import React, { useState, useEffect } from "react";
import AdminModal from "@/components/admin/AdminModal";
import { adminApiFetch } from "@/lib/admin-api";

export default function ScholarshipProgramEditor({
  open,
  onClose,
  program,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  program: any;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isNew = !program?.id;

  useEffect(() => {
    if (open) {
      if (program?.id) {
        setFormData({
          title: program.title || "",
          description: program.description || "",
          isActive: program.isActive !== false,
        });
      } else {
        setFormData({ title: "", description: "", isActive: true });
      }
      setError("");
    }
  }, [open, program]);

  async function handleSave() {
    if (!formData.title.trim()) {
      setError("Program title is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const url = isNew
        ? `/api/v1/admin/scholarship-programs`
        : `/api/v1/admin/scholarship-programs/${program.id}`;
      const method = isNew ? "POST" : "PUT";
      await adminApiFetch(url, {
        method,
        body: JSON.stringify(formData),
      });
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message || "Error saving scholarship program");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={isNew ? "Add Scholarship Program" : "Edit Scholarship Program"}
      width={480}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && (
          <div className="sca-admin-error">{error}</div>
        )}

        <div className="sca-admin-field">
          <label>Program Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. SCAT-X"
          />
        </div>

        <div className="sca-admin-field">
          <label>Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g. Success Code Scholarship Admission Test"
          />
        </div>

        <label className="sca-admin-check">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          <span>Program is Active (visible on registration form)</span>
        </label>

        <div className="sca-admin-row" style={{ justifyContent: "flex-end", marginTop: 8 }}>
          <button className="sca-admin-btn ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="sca-admin-btn primary" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Program"}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
