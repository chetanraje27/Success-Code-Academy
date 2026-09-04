"use client";

import React, { useState, useEffect } from "react";
import { Copy, KeyRound, RefreshCw, ShieldAlert } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import { useToast } from "@/components/admin/Toast";
import { adminApiFetch } from "@/lib/admin-api";
import { ADMIN, ADMIN_ROLES, adminRoleLabel, type AdminRole } from "@/lib/roles";

type ResetLink = {
  emailed: boolean;
  resetUrl: string;
  expiresAt: string;
  ttlMinutes: number;
  message: string;
};

/** A readable temporary password for a brand-new account. */
function generatePassword(): string {
  // Excludes characters that are easy to misread when a password is dictated
  // over the phone (O/0, I/l/1).
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const bytes = new Uint32Array(14);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) =>
    alphabet.charAt(byte % alphabet.length),
  ).join("");
}

export default function AdministratorEditorModal({
  open,
  onClose,
  admin,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  admin: any;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    role: ADMIN as AdminRole,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetLink, setResetLink] = useState<ResetLink | null>(null);
  const [copied, setCopied] = useState(false);

  const isNew = !admin?.id;

  useEffect(() => {
    if (!open) return;
    setFormData({
      name: admin?.name || "",
      email: admin?.email || "",
      mobileNumber: admin?.mobileNumber || "",
      password: "",
      role: (admin?.role as AdminRole) || ADMIN,
    });
    setError("");
    setResetError("");
    setResetLink(null);
    setCopied(false);
  }, [open, admin]);

  async function handleSave() {
    if (!admin) return;
    setLoading(true);
    setError("");

    try {
      const payload: Record<string, string> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        role: formData.role,
      };
      // A password is set once, when the account is created. Afterwards it is
      // only ever changed through a reset link.
      if (isNew) payload.password = formData.password;

      await adminApiFetch(
        isNew
          ? `/api/v1/admin/database/admins`
          : `/api/v1/admin/database/admins/${admin.id}`,
        {
          method: isNew ? "POST" : "PUT",
          body: JSON.stringify(payload),
        },
      );

      toast.success(isNew ? "Administrator created." : "Administrator updated.");
      onSaved();
      onClose();
    } catch (e: any) {
      const message = e.message || "Error saving administrator";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendResetLink() {
    if (isNew) return;
    setResetLoading(true);
    setResetError("");
    setResetLink(null);
    setCopied(false);

    try {
      const response = await adminApiFetch<{
        emailed: boolean;
        resetUrl: string;
        expiresAt: string;
        ttlMinutes: number;
      }>(`/api/v1/admin/database/admins/${admin.id}/password-reset`, {
        method: "POST",
      });
      setResetLink({
        ...response.data,
        message: response.message || "A reset link was created.",
      });
      toast.success(response.message || "Password reset link created.");
    } catch (e: any) {
      const message = e.message || "Unable to create a reset link";
      setResetError(message);
      toast.error(message);
    } finally {
      setResetLoading(false);
    }
  }

  async function copyResetLink() {
    if (!resetLink) return;
    try {
      await navigator.clipboard.writeText(resetLink.resetUrl);
      setCopied(true);
    } catch {
      // Clipboard access is blocked outside secure contexts; select the text
      // so the link can still be copied with the keyboard.
      document.getElementById("admin-reset-link")?.focus();
      (
        document.getElementById("admin-reset-link") as HTMLInputElement | null
      )?.select();
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={isNew ? "Add Administrator" : "Edit Administrator"}
      width={560}
    >
      <div className="sca-admin-form" style={{ padding: "20px" }}>
        {error && <div className="sca-admin-error">{error}</div>}

        <div className="sca-admin-field">
          <label>Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="sca-admin-row">
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Email Address</label>
            <input
              type="email"
              autoComplete="off"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <small>Used to sign in to the dashboard.</small>
          </div>
          <div className="sca-admin-field" style={{ flex: 1 }}>
            <label>Mobile Number</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={formData.mobileNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mobileNumber: e.target.value.replace(/[^0-9]/g, ""),
                })
              }
            />
            <small>Exactly 10 digits.</small>
          </div>
        </div>

        <div className="sca-admin-field">
          <label>Access level</label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as AdminRole })
            }
          >
            {ADMIN_ROLES.map((role) => (
              <option key={role} value={role}>
                {adminRoleLabel(role)}
              </option>
            ))}
          </select>
          <small>
            Super administrators can add and delete records and manage other
            administrators. Administrators can view and edit existing content
            only.
          </small>
        </div>

        {isNew ? (
          <div className="sca-admin-field">
            <label>Temporary Password</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="sca-admin-btn"
                onClick={() =>
                  setFormData({ ...formData, password: generatePassword() })
                }
              >
                <RefreshCw size={15} />
                Generate
              </button>
            </div>
            <small>
              Share this once, then ask the administrator to change it. After
              the account exists, passwords are only changed through a reset
              link.
            </small>
          </div>
        ) : (
          <div className="sca-admin-field">
            <label>Password</label>
            <div>
              <button
                type="button"
                className="sca-admin-btn"
                onClick={handleSendResetLink}
                disabled={resetLoading}
              >
                <KeyRound size={15} />
                {resetLoading
                  ? "Creating link…"
                  : resetLink
                    ? "Create a new reset link"
                    : "Send password reset link"}
              </button>
            </div>
            <small>
              Passwords cannot be read or set from here. A reset link lets the
              administrator choose their own password, and it can only be used
              once.
            </small>

            {resetError && (
              <div className="sca-admin-error" style={{ marginTop: 8 }}>
                {resetError}
              </div>
            )}

            {resetLink && (
              <div
                style={{
                  marginTop: 10,
                  display: "grid",
                  gap: 8,
                  padding: "12px",
                  borderRadius: "var(--admin-radius-sm)",
                  border: "1px solid var(--admin-border)",
                  background: "var(--admin-surface-sunken)",
                }}
              >
                <strong style={{ fontSize: "0.79rem" }}>
                  {resetLink.message}
                </strong>
                {!resetLink.emailed && (
                  <>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        id="admin-reset-link"
                        type="text"
                        readOnly
                        value={resetLink.resetUrl}
                        onFocus={(e) => e.currentTarget.select()}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="sca-admin-btn"
                        onClick={copyResetLink}
                      >
                        <Copy size={15} />
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <small>
                      Email is not configured on this server yet, so send this
                      link to the administrator yourself. It expires in{" "}
                      {resetLink.ttlMinutes} minutes and works only once. Do not
                      post it anywhere public.
                    </small>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {!isNew && (
          <div
            className="sca-admin-field"
            style={{
              paddingTop: 12,
              borderTop: "1px solid var(--admin-border)",
            }}
          >
            <label>Two-factor authentication (TOTP)</label>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.79rem",
                color: "var(--admin-muted)",
              }}
            >
              <ShieldAlert size={15} aria-hidden="true" />
              Not configured
            </span>
            <small>
              Authenticator-app sign-in is planned. Until it ships, admin
              accounts are protected by password only.
            </small>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 24,
          }}
        >
          <button
            className="sca-admin-btn ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="sca-admin-btn primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : isNew ? "Create Administrator" : "Save Changes"}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
