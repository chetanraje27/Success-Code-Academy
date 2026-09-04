"use client";

import React, { useCallback, useState, useEffect } from "react";
import AdminModal from "./AdminModal";
import { adminApiFetch, uploadAdminImage } from "@/lib/admin-api";
import { useEditMode } from "./EditModeContext";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa6";
import RevisionHistoryButton from "./RevisionHistoryButton";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";

interface Result {
  id: number;
  name: string;
  image: string;
  year: number;
  college?: string | null;
  city?: string | null;
  marks?: number | null;
  isActive: boolean;
  orderIndex: number;
}

export default function ResultEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { bumpRefresh, isSuperAdmin } = useEditMode();
  const toast = useToast();
  const confirmAction = useConfirm();

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

  const loadResults = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApiFetch<Result[]>("results");
      setResults(response.data);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to load results.",
      );
      toast.error(caught instanceof Error ? caught.message : "Unable to load results.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && !isFormOpen) {
      // Opening the dialog synchronizes it with the remote CMS resource.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadResults();
    }
  }, [isFormOpen, loadResults, open]);

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

  function handleEdit(item: Result) {
    setEditingResult(item);
    setFormData({
      name: item.name || "",
      image: item.image || "",
      year: item.year ? String(item.year) : "",
      college: item.college || "",
      city: item.city || "",
      marks: item.marks != null ? String(item.marks) : "",
      isActive: item.isActive !== false,
      orderIndex: item.orderIndex || 0,
    });
    setIsFormOpen(true);
  }

  async function handleDelete(id: number) {
    if (!(await confirmAction({
      title: "Delete result?",
      message: "This result will be removed from the website. You can restore it later from History.",
      confirmLabel: "Delete result",
      tone: "destructive",
    }))) {
      return;
    }
    try {
      await adminApiFetch(`results/${id}`, { method: "DELETE" });
      toast.success("Result deleted. You can restore it from History.");
      bumpRefresh();
      await loadResults();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to delete result.",
      );
      toast.error(caught instanceof Error ? caught.message : "Unable to delete result.");
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadAdminImage(file, "result");
      setFormData(prev => ({ ...prev, image: url }));
      toast.success("Result image uploaded.");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Image upload failed.",
      );
      toast.error(caught instanceof Error ? caught.message : "Image upload failed.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const url = editingResult ? `results/${editingResult.id}` : "results";
      const method = editingResult ? "PUT" : "POST";

      const payload = {
        ...formData,
        year: Number(formData.year),
        marks: formData.marks ? Number(formData.marks) : undefined,
        orderIndex: Number(formData.orderIndex),
      };

      await adminApiFetch(url, { method, body: JSON.stringify(payload) });
      bumpRefresh();
      toast.success(editingResult ? "Result changes saved." : "Result added.");
      setIsFormOpen(false);
      await loadResults();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to save result.",
      );
      toast.error(caught instanceof Error ? caught.message : "Unable to save result.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminModal open={open} onClose={onClose} title={isFormOpen ? (editingResult ? "Edit Result" : "Add Result") : "Manage Results"} width={640}>
      {error && <div className="sca-admin-error">{error}</div>}
      
      {!isFormOpen ? (
        <>
          {/*
            Adding a result and restoring older revisions are create-style
            actions reserved for super administrators. Standard administrators
            still see the list and can edit existing results.
          */}
          {isSuperAdmin && (
            <div className="sca-admin-toolbar">
              <RevisionHistoryButton
                resourceType="result"
                itemName="Result"
                className="sca-admin-btn ghost"
                onRestored={async () => {
                  bumpRefresh();
                  await loadResults();
                }}
              />
              <button className="sca-admin-btn primary" onClick={handleAddNew}>
                <FaPlus style={{ marginRight: 6 }} /> Add Result
              </button>
            </div>
          )}
          
          {loading ? (
            <p>Loading results...</p>
          ) : results.length === 0 ? (
            <div className="sca-admin-empty">No results found.</div>
          ) : (
            <div className="sca-admin-list">
              {results.map((r) => (
                <div key={r.id} className="sca-admin-list-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    {r.image && (
                      // Dynamic CMS URLs are validated by the API.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.image} alt={r.name} className="sca-admin-thumb" />
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.name} ({r.year})</div>
                      {r.marks && <div style={{ fontSize: 13, color: '#666' }}>Marks: {r.marks}</div>}
                      {!r.isActive && <div style={{ fontSize: 12, color: 'red' }}>Inactive</div>}
                    </div>
                  </div>
                  <div className="sca-admin-list-actions">
                    <button className="sca-admin-icon-btn" onClick={() => handleEdit(r)}><FaPen /></button>
                    {isSuperAdmin && (
                      <button className="sca-admin-icon-btn danger" onClick={() => handleDelete(r.id)}><FaTrash /></button>
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
            {formData.image && (
              // Dynamic CMS URLs are validated by the API.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={formData.image} alt="Preview" className="sca-admin-preview" />
            )}
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
          <div className="sca-admin-form-actions">
            <button type="button" className="sca-admin-btn ghost" onClick={() => setIsFormOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="sca-admin-btn primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </AdminModal>
  );
}
