"use client";

import React, { useState, useEffect } from "react";
import AdminModal from "./AdminModal";
import { apiFetch } from "@/lib/api";
import { useEditMode } from "./EditModeContext";

export default function SettingsEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { bumpRefresh } = useEditMode();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    twitter: ""
  });

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  async function loadSettings() {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/v1/admin/settings", { auth: true });
      if (res.success && res.data) {
        setFormData({
          phone: res.data.phone || "",
          email: res.data.email || "",
          address: res.data.address || "",
          whatsapp: res.data.whatsapp || "",
          facebook: res.data.facebook || "",
          instagram: res.data.instagram || "",
          youtube: res.data.youtube || "",
          linkedin: res.data.linkedin || "",
          twitter: res.data.twitter || ""
        });
      }
    } catch (e: any) {
      setError(e.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await apiFetch("/api/v1/admin/settings", {
        method: "PUT",
        body: JSON.stringify(formData),
        auth: true
      });
      if (res.success) {
        bumpRefresh();
        onClose();
      } else {
        setError(res.message || "Failed to save settings");
      }
    } catch (err: any) {
      setError(err.message || "Error saving settings");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  return (
    <AdminModal open={open} onClose={onClose} title="Site Settings" width={560}>
      {error && <div className="sca-admin-error">{error}</div>}
      {loading ? (
        <p>Loading settings...</p>
      ) : (
        <form className="sca-admin-form" onSubmit={handleSubmit}>
          <div className="sca-admin-field">
            <label>Phone</label>
            <input type="text" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />
          </div>
          <div className="sca-admin-field">
            <label>Email</label>
            <input type="text" value={formData.email} onChange={e => handleChange("email", e.target.value)} />
          </div>
          <div className="sca-admin-field">
            <label>Address</label>
            <input type="text" value={formData.address} onChange={e => handleChange("address", e.target.value)} />
          </div>
          <div className="sca-admin-row">
            <div className="sca-admin-field">
              <label>WhatsApp URL</label>
              <input type="text" value={formData.whatsapp} onChange={e => handleChange("whatsapp", e.target.value)} />
            </div>
            <div className="sca-admin-field">
              <label>Facebook URL</label>
              <input type="text" value={formData.facebook} onChange={e => handleChange("facebook", e.target.value)} />
            </div>
          </div>
          <div className="sca-admin-row">
            <div className="sca-admin-field">
              <label>Instagram URL</label>
              <input type="text" value={formData.instagram} onChange={e => handleChange("instagram", e.target.value)} />
            </div>
            <div className="sca-admin-field">
              <label>YouTube URL</label>
              <input type="text" value={formData.youtube} onChange={e => handleChange("youtube", e.target.value)} />
            </div>
          </div>
          <div className="sca-admin-row">
            <div className="sca-admin-field">
              <label>LinkedIn URL</label>
              <input type="text" value={formData.linkedin} onChange={e => handleChange("linkedin", e.target.value)} />
            </div>
            <div className="sca-admin-field">
              <label>Twitter URL</label>
              <input type="text" value={formData.twitter} onChange={e => handleChange("twitter", e.target.value)} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="submit" className="sca-admin-btn sca-admin-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Settings"}
            </button>
            <button type="button" className="sca-admin-btn sca-admin-btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </AdminModal>
  );
}
