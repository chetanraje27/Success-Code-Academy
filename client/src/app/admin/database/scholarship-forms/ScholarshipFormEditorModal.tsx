"use client";

import React, { useState, useEffect } from "react";
import AdminModal from "@/components/admin/AdminModal";
import { adminApiFetch } from "@/lib/admin-api";

export default function ScholarshipFormEditorModal({
  open,
  onClose,
  formRecord,
  onSaved
}: {
  open: boolean;
  onClose: () => void;
  formRecord: any;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState<any>({
    studentName: "",
    studentPhone: "",
    studentEmail: "",
    parentPhone: "",
    studentClass: "",
    schoolName: "",
    city: "",
    preferredCourse: "",
    scholarshipProgram: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isNew = !formRecord?.id;

  useEffect(() => {
    if (open) {
      if (formRecord && formRecord.id) {
        setFormData({
          studentName: formRecord.studentName || "",
          studentPhone: formRecord.studentPhone || "",
          studentEmail: formRecord.studentEmail || "",
          parentPhone: formRecord.parentPhone || "",
          studentClass: formRecord.studentClass || "",
          schoolName: formRecord.schoolName || "",
          city: formRecord.city || "",
          preferredCourse: formRecord.preferredCourse || "",
          scholarshipProgram: formRecord.scholarshipProgram || ""
        });
      } else {
        setFormData({
          studentName: "",
          studentPhone: "",
          studentEmail: "",
          parentPhone: "",
          studentClass: "",
          schoolName: "",
          city: "",
          preferredCourse: "",
          scholarshipProgram: ""
        });
      }
      setError("");
    }
  }, [open, formRecord]);

  async function handleSave() {
    if (!formRecord) return;
    setLoading(true);
    setError("");

    try {
      const endpoint = isNew 
        ? `/api/v1/admin/database/scholarship-forms` 
        : `/api/v1/admin/database/scholarship-forms/${formRecord.id}`;
      
      const method = isNew ? "POST" : "PUT";

      await adminApiFetch(endpoint, {
        method,
        body: JSON.stringify(formData)
      });
      
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message || "Error saving scholarship form");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModal open={open} onClose={onClose} title={isNew ? "Add Scholarship Application" : "Edit Scholarship Application"} width={560}>
      <div className="sca-admin-form" style={{ padding: "20px" }}>
        {error && <div className="sca-admin-error">{error}</div>}
        
        <div className="sca-admin-row">
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Student Name</label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            />
          </div>
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Current Class</label>
            <input
              type="text"
              value={formData.studentClass}
              onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
            />
          </div>
        </div>

        <div className="sca-admin-row">
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Student Phone</label>
            <input
              type="text"
              value={formData.studentPhone}
              onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Email Address (Student)</label>
            <input 
              type="email" 
              className="admin-form-input" 
              value={formData.studentEmail} 
              onChange={e => setFormData({...formData, studentEmail: e.target.value})} 
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Parent / Guardian Phone</label>
            <input 
              type="text" 
              className="admin-form-input" 
              value={formData.parentPhone} 
              onChange={e => setFormData({...formData, parentPhone: e.target.value})} 
            />
          </div>
        </div>

        <div className="sca-admin-row">
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>School Name</label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            />
          </div>
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
        </div>
        
        <div className="admin-form-group">
            <label className="admin-form-label">Preferred Course</label>
            <input 
              type="text" 
              className="admin-form-input" 
              value={formData.preferredCourse} 
              onChange={e => setFormData({...formData, preferredCourse: e.target.value})} 
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Scholarship Program</label>
            <input 
              type="text" 
              className="admin-form-input" 
              value={formData.scholarshipProgram} 
              onChange={e => setFormData({...formData, scholarshipProgram: e.target.value})} 
            />
          </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
          <button className="sca-admin-btn ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="sca-admin-btn primary" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
