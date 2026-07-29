"use client";

import React, { useState, useEffect } from "react";
import AdminModal from "@/components/admin/AdminModal";
import { adminApiFetch } from "@/lib/admin-api";

export default function CourseFormEditorModal({
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
    courseTitle: "",
    studentEmail: "",
    studentPhone: "",
    visitingDate: "",
    visitingTime: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isNew = !formRecord?.id;

  useEffect(() => {
    if (open) {
      if (formRecord && formRecord.id) {
        setFormData({
          studentName: formRecord.studentName || "",
          courseTitle: formRecord.courseTitle || "",
          studentEmail: formRecord.studentEmail || "",
          studentPhone: formRecord.studentPhone || "",
          visitingDate: formRecord.visitingDate || "",
          visitingTime: formRecord.visitingTime || ""
        });
      } else {
        setFormData({
          studentName: "",
          courseTitle: "",
          studentEmail: "",
          studentPhone: "",
          visitingDate: "",
          visitingTime: ""
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
        ? `/api/v1/admin/database/course-forms` 
        : `/api/v1/admin/database/course-forms/${formRecord.id}`;
      
      const method = isNew ? "POST" : "PUT";

      await adminApiFetch(endpoint, {
        method,
        body: JSON.stringify(formData)
      });
      
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message || "Error saving course form");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModal open={open} onClose={onClose} title={isNew ? "Add New Course Enquiry" : "Edit Course Enquiry"} width={560}>
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
            <label>Course Title</label>
            <input
              type="text"
              value={formData.courseTitle}
              onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
            />
          </div>
        </div>

        <div className="sca-admin-row">
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Email Address</label>
            <input
              type="email"
              value={formData.studentEmail}
              onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
            />
          </div>
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Phone Number</label>
            <input
              type="text"
              value={formData.studentPhone}
              onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
            />
          </div>
        </div>

        <div className="sca-admin-row">
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Visiting Date</label>
            <input
              type="text"
              value={formData.visitingDate}
              onChange={(e) => setFormData({ ...formData, visitingDate: e.target.value })}
            />
          </div>
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Visiting Time</label>
            <input
              type="text"
              value={formData.visitingTime}
              onChange={(e) => setFormData({ ...formData, visitingTime: e.target.value })}
            />
          </div>
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
