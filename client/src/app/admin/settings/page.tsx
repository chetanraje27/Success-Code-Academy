"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, KeyRound, Mail, RefreshCw, Save, Send } from "lucide-react";
import { adminApiFetch, AdminApiError } from "@/lib/admin-api";
import { useAdminSession } from "@/components/admin/AdminSessionContext";
import { useToast } from "@/components/admin/Toast";
import {
  AdminLoadingState,
  AdminNotice,
  AdminPageHeader,
} from "@/components/admin/AdminUi";

type SiteSettings = {
  phone: string;
  email: string;
  address1: string;
  address2: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  twitter: string;
};

import { defaultSiteSettings } from "@/lib/site-settings";

const initialSettings: SiteSettings = {
  ...defaultSiteSettings,
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useAdminSession();
  const toast = useToast();

  const [resetSending, setResetSending] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    adminApiFetch<Record<string, string>>("settings")
      .then((response) =>
        setSettings((current) => ({ ...current, ...response.data })),
      )
      .catch((caught: unknown) =>
        setError(
          caught instanceof Error ? caught.message : "Unable to load settings.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  function updateSetting(key: keyof SiteSettings, value: string) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await adminApiFetch("settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setMessage("Website contact and social details were saved.");
      toast.success("Website contact and social details were saved.");
      window.dispatchEvent(new Event("admin-content-changed"));
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.fields.length > 0) {
        setError(caught.fields.map((field) => field.message).join(" "));
      } else {
        setError(
          caught instanceof Error ? caught.message : "Unable to save settings.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleSendResetLink() {
    if (cooldown > 0 || resetSending) return;
    setResetSending(true);
    setError("");

    try {
      const response = await adminApiFetch<{
        emailed: boolean;
        email: string;
        ttlMinutes: number;
        resetUrl?: string;
      }>("request-password-reset", {
        method: "POST",
      });

      const emailAddress = response.data?.email || user?.email || "your email address";
      setResetEmail(emailAddress);
      setResetSent(true);
      setCooldown(60);

      toast.success(`Password reset link sent to ${emailAddress}.`);
    } catch (caught) {
      const errMsg =
        caught instanceof Error ? caught.message : "Unable to send password reset link.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setResetSending(false);
    }
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Site settings"
        description="Update the institute details reused across the footer, contact page, and quick-contact actions."
      />

      {error && (
        <AdminNotice>{error}</AdminNotice>
      )}
      {message && (
        <AdminNotice tone="success">{message}</AdminNotice>
      )}

      <section className="admin-card">
        <header className="admin-card-header">
          <div>
            <h2>Contact information</h2>
            <p>These values are public and should be checked carefully.</p>
          </div>
        </header>
        <div className="admin-card-body">
          {loading ? (
            <AdminLoadingState label="Loading settings…" />
          ) : (
            <form className="admin-form" onSubmit={saveSettings}>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="settings-phone">Phone number</label>
                  <input
                    id="settings-phone"
                    value={settings.phone}
                    onChange={(event) =>
                      updateSetting("phone", event.target.value)
                    }
                    placeholder="+91 86004 70850"
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="settings-email">Email address</label>
                  <input
                    id="settings-email"
                    type="email"
                    value={settings.email}
                    onChange={(event) =>
                      updateSetting("email", event.target.value)
                    }
                    placeholder="successcodeacademy@gmail.com"
                  />
                </div>
                <div className="admin-field full">
                  <label htmlFor="settings-address1">Girls Branch Address</label>
                  <textarea
                    id="settings-address1"
                    value={settings.address1}
                    onChange={(event) =>
                      updateSetting("address1", event.target.value)
                    }
                    rows={2}
                  />
                </div>
                <div className="admin-field full">
                  <label htmlFor="settings-address2">Boys Branch Address</label>
                  <textarea
                    id="settings-address2"
                    value={settings.address2}
                    onChange={(event) =>
                      updateSetting("address2", event.target.value)
                    }
                    rows={2}
                  />
                </div>
                <div className="admin-field full">
                  <label htmlFor="settings-whatsapp">
                    WhatsApp number or URL
                  </label>
                  <input
                    id="settings-whatsapp"
                    value={settings.whatsapp}
                    onChange={(event) =>
                      updateSetting("whatsapp", event.target.value)
                    }
                    placeholder="918600470850 or https://wa.me/918600470850"
                  />
                  <small>
                    Include the country code when entering only a number.
                  </small>
                </div>
              </div>

              <div className="admin-settings-divider">
                <strong>Social media links</strong>
                <span>Leave an unused platform blank.</span>
              </div>

              <div className="admin-form-grid">
                {(
                  [
                    ["facebook", "Facebook"],
                    ["instagram", "Instagram"],
                    ["youtube", "YouTube"],
                    ["linkedin", "LinkedIn"],
                    ["twitter", "X / Twitter"],
                  ] as const
                ).map(([key, label]) => (
                  <div className="admin-field" key={key}>
                    <label htmlFor={`settings-${key}`}>{label}</label>
                    <input
                      id={`settings-${key}`}
                      type="url"
                      value={settings[key]}
                      onChange={(event) =>
                        updateSetting(key, event.target.value)
                      }
                      placeholder="https://"
                    />
                  </div>
                ))}
              </div>
              <div className="admin-form-actions">
                <button className="admin-button" type="submit" disabled={saving}>
                  <Save size={17} />
                  {saving ? "Saving…" : "Save site settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="admin-card">
        <header className="admin-card-header">
          <div>
            <h2>Password &amp; Security</h2>
            <p>
              Request a secure, single-use link to reset your administrator password.
            </p>
          </div>
          <KeyRound size={20} aria-hidden="true" />
        </header>
        <div className="admin-card-body">
          <div className="admin-reset-box">
            <div className="admin-reset-info">
              <div className="admin-reset-icon" aria-hidden="true">
                <Mail size={18} />
              </div>
              <div className="admin-reset-meta">
                <span className="admin-reset-meta-label">Signed-in Account</span>
                <span className="admin-reset-meta-email">{user?.email || "Administrator"}</span>
                <p className="admin-reset-meta-desc">
                  Password updates are handled securely through an email verification link sent directly to your registered inbox. Links expire automatically in 60 minutes.
                </p>
              </div>
            </div>

            {resetSent && (
              <div className="admin-reset-status-card">
                <CheckCircle2 size={16} className="admin-reset-status-icon" />
                <div className="admin-reset-status-content">
                  <p className="admin-reset-status-title">Reset link dispatched</p>
                  <p className="admin-reset-status-desc">
                    A password reset email has been sent to <strong>{resetEmail}</strong>. Please check your inbox and follow the link to choose your new password.
                  </p>
                </div>
              </div>
            )}

            <div className="admin-reset-actions">
              <button
                type="button"
                className="admin-button"
                onClick={handleSendResetLink}
                disabled={resetSending || cooldown > 0}
              >
                {resetSending ? (
                  <>
                    <span className="admin-spinner" aria-hidden="true" />
                    Sending reset link...
                  </>
                ) : cooldown > 0 ? (
                  <>
                    <Clock size={15} aria-hidden="true" />
                    Resend link in {cooldown}s
                  </>
                ) : resetSent ? (
                  <>
                    <RefreshCw size={15} aria-hidden="true" />
                    Resend password reset link
                  </>
                ) : (
                  <>
                    <Send size={15} aria-hidden="true" />
                    Send password reset link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
