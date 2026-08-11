"use client";

import React, { useState, useEffect } from "react";
import AdminModal from "@/components/admin/AdminModal";
import { adminApiFetch } from "@/lib/admin-api";

export default function ContactMessageEditorModal({
  open,
  onClose,
  messageRecord,
  onSaved
}: {
  open: boolean;
  onClose: () => void;
  messageRecord: any;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isNew = !messageRecord?.id;

  useEffect(() => {
    if (open) {
      if (messageRecord && messageRecord.id) {
        setFormData({
          name: messageRecord.name || "",
          email: messageRecord.email || "",
          phone: messageRecord.phone || "",
          message: messageRecord.message || ""
        });
      } else {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      }
      setError("");
    }
  }, [open, messageRecord]);

  async function handleSave() {
    if (!messageRecord) return;
    setLoading(true);
    setError("");

    try {
      const endpoint = isNew 
        ? `/api/v1/admin/database/contact-messages` 
        : `/api/v1/admin/database/contact-messages/${messageRecord.id}`;
      
      const method = isNew ? "POST" : "PUT";

      await adminApiFetch(endpoint, {
        method,
        body: JSON.stringify(formData)
      });
      
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message || "Error saving contact message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModal open={open} onClose={onClose} title={isNew ? "Add Contact Message" : "Edit Contact Message"} width={560}>
      <div className="sca-admin-form" style={{ padding: "20px" }}>
        {error && <div className="sca-admin-error">{error}</div>}
        
        <div className="sca-admin-row">
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="sca-admin-field">
          <label>Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="sca-admin-field">
          <label>Message / Notes</label>
          <textarea
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
