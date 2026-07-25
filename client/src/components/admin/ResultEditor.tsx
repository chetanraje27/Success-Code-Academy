"use client";

import React, { useState, useEffect } from "react";
import AdminModal from "./AdminModal";
import { apiFetch, uploadAdminImage } from "@/lib/api";
import { useEditMode } from "./EditModeContext";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa6";

export default function ResultEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingResult, setEditingResult] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { bumpRefresh } = useEditMode();

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    year: "",
    college: "",
    city: "",
    marks: "",
    isActive: true,
    orderIndex: 0,
  });

  useEffect(() => {
    if (open && !isFormOpen) {
      loadResults();
    }
  }, [open, isFormOpen]);

  async function loadResults() {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/v1/admin/results", { auth: true });
      if (res.success) setResults(res.data);
      else setError(res.message || "Failed to load results");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAddNew() {
    setEditingResult(null);
    setFormData({
      name: "",
      image: "",
      year: "",
      college: "",
      city: "",
      marks: "",
      isActive: true,
      orderIndex: 0,
    });
    setIsFormOpen(true);
  }

  function handleEdit(item: any) {
    setEditingResult(item);
    setFormData({
      name: item.name || "",
      image: item.image || "",
      year: item.year || "",
      college: item.college || "",
      city: item.city || "",
      marks: item.marks || "",
      isActive: item.isActive !== false,
      orderIndex: item.orderIndex || 0,
    });
    setIsFormOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this result?")) return;
    try {
      const res = await apiFetch(`/api/v1/admin/results/${id}`, { method: "DELETE", auth: true });
      if (res.success) {
        bumpRefresh();
        loadResults();
      } else {
        alert(res.message || "Delete failed");
      }
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadAdminImage(file, "result");
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const url = editingResult ? `/api/v1/admin/results/${editingResult.id}` : "/api/v1/admin/results";
      const method = editingResult ? "PUT" : "POST";

      const payload = {
        ...formData,
        year: Number(formData.year),
        marks: formData.marks ? Number(formData.marks) : undefined,
        orderIndex: Number(formData.orderIndex),
      };

      const res = await apiFetch(url, { method, body: JSON.stringify(payload), auth: true });
      if (res.success) {
        bumpRefresh();
        setIsFormOpen(false);
      } else {
        setError(res.message || "Failed to save result");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminModal open={open} onClose={onClose} title={isFormOpen ? (editingResult ? "Edit Result" : "Add Result") : "Manage Results"} width={640}>
      {error && <div className="sca-admin-error">{error}</div>}
      
      {!isFormOpen ? (
        <>
          <div style={{ marginBottom: "1rem", textAlign: "right" }}>
            <button className="sca-admin-btn sca-admin-btn-primary" onClick={handleAddNew}>
              <FaPlus style={{ marginRight: 6 }} /> Add Result
            </button>
          </div>
          
          {loading ? (
            <p>Loading results...</p>
          ) : results.length === 0 ? (
            <div className="sca-admin-empty">No results found.</div>
          ) : (
            <div className="sca-admin-list">
              {results.map((r: any) => (
                <div key={r.id} className="sca-admin-list-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    {r.image && <img src={r.image} alt={r.name} className="sca-admin-thumb" />}
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.name} ({r.year})</div>
                      {r.marks && <div style={{ fontSize: 13, color: '#666' }}>Marks: {r.marks}</div>}
                      {!r.isActive && <div style={{ fontSize: 12, color: 'red' }}>Inactive</div>}
                    </div>
                  </div>
                  <div className="sca-admin-list-actions">
                    <button className="sca-admin-icon-btn" onClick={() => handleEdit(r)}><FaPen /></button>
                    <button className="sca-admin-icon-btn" style={{ color: 'var(--sca-danger)' }} onClick={() => handleDelete(r.id)}><FaTrash /></button>
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
              <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="sca-admin-field">
              <label>Year</label>
              <input type="number" required value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
            </div>
          </div>
          <div className="sca-admin-field">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {formData.image && <img src={formData.image} alt="preview" style={{ height: 60, marginTop: 10, borderRadius: 4 }} />}
          </div>
          <div className="sca-admin-row">
            <div className="sca-admin-field">
              <label>College (Optional)</label>
              <input type="text" value={formData.college} onChange={e => setFormData({ ...formData, college: e.target.value })} />
            </div>
            <div className="sca-admin-field">
              <label>City (Optional)</label>
              <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
            </div>
          </div>
          <div className="sca-admin-row">
            <div className="sca-admin-field">
              <label>Marks (Optional)</label>
              <input type="number" step="any" value={formData.marks} onChange={e => setFormData({ ...formData, marks: e.target.value })} />
            </div>
            <div className="sca-admin-field">
              <label>Order Index</label>
              <input type="number" value={formData.orderIndex} onChange={e => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="sca-admin-check">
            <label>
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
              Is Active
            </label>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="submit" className="sca-admin-btn sca-admin-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button type="button" className="sca-admin-btn sca-admin-btn-ghost" onClick={() => setIsFormOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </AdminModal>
  );
}
