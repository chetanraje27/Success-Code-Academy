"use client";

import React, { useState, useEffect } from "react";
import AdminModal from "@/components/admin/AdminModal";
import { adminApiFetch } from "@/lib/admin-api";

export default function StudentEditorModal({
  open,
  onClose,
  student,
  onSaved
}: {
  open: boolean;
  onClose: () => void;
  student: any;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    age: "",
    role: "student",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isNew = !student?.id;

  useEffect(() => {
    if (open) {
      if (student && student.id) {
        setFormData({
          firstName: student.firstName || "",
          lastName: student.lastName || "",
          email: student.email || "",
          mobileNumber: student.mobileNumber || "",
          age: student.age || "",
          role: student.role || "student",
          password: ""
        });
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobileNumber: "",
          age: "",
          role: "student",
          password: ""
        });
      }
      setError("");
    }
  }, [open, student]);

  async function handleSave() {
    if (!student) return;
    setLoading(true);
    setError("");

    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      if (!payload.age) delete payload.age;
      else payload.age = Number(payload.age);

      const endpoint = isNew 
        ? `/api/v1/admin/database/users` 
        : `/api/v1/admin/database/users/${student.id}`;
      
      const method = isNew ? "POST" : "PUT";

      await adminApiFetch(endpoint, {
        method,
        body: JSON.stringify(payload)
      });
      
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message || "Error saving student");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModal open={open} onClose={onClose} title={isNew ? "Add New Student" : "Edit Student Profile"} width={560}>
      <div className="sca-admin-form" style={{ padding: "20px" }}>
        {error && <div className="sca-admin-error">{error}</div>}
        
        <div className="sca-admin-row">
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="sca-admin-row">
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Mobile Number</label>
            <input
              type="text"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
            />
          </div>
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="sca-admin-row">
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>System Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        <div className="sca-admin-field" style={{ marginTop: 12 }}>
          <label>{isNew ? "Password" : "Reset Password"}</label>
          <input
            type="text"
            placeholder={isNew ? "Required for new accounts" : "Leave blank to keep current password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
