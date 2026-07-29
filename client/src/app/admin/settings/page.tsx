"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Save } from "lucide-react";
import { adminApiFetch, AdminApiError } from "@/lib/admin-api";
import {
  AdminLoadingState,
  AdminNotice,
  AdminPageHeader,
} from "@/components/admin/AdminUi";

type SiteSettings = {
  phone: string;
  email: string;
  address: string;
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
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

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

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("The new password and confirmation do not match.");
      return;
    }

    setPasswordSaving(true);
    try {
      const response = await fetch("/api/admin/session", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const payload = (await response.json()) as {
        message?: string;
        errors?: Array<{ message: string }>;
      };
      if (!response.ok) {
        throw new Error(
          payload.errors?.map((item) => item.message).join(" ") ||
            payload.message ||
            "Unable to change the password.",
        );
      }
      router.replace("/admin/login");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to change the password.",
      );
    } finally {
      setPasswordSaving(false);
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
                  <label htmlFor="settings-address">Institute address</label>
                  <textarea
                    id="settings-address"
                    value={settings.address}
                    onChange={(event) =>
                      updateSetting("address", event.target.value)
                    }
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
            <h2>Admin password</h2>
            <p>
              Changing the password signs this browser out immediately.
            </p>
          </div>
          <KeyRound size={20} aria-hidden="true" />
        </header>
        <div className="admin-card-body">
          <form className="admin-form" onSubmit={changePassword}>
            <div className="admin-form-grid">
              <div className="admin-field full">
                <label htmlFor="current-password">Current password</label>
                <input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  value={passwords.currentPassword}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="admin-field">
                <label htmlFor="new-password">New password</label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={passwords.newPassword}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }))
                  }
                  minLength={12}
                  required
                />
                <small>
                  At least 12 characters with uppercase, lowercase, number, and
                  symbol.
                </small>
              </div>
              <div className="admin-field">
                <label htmlFor="confirm-password">Confirm new password</label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={passwords.confirmPassword}
                  onChange={(event) =>
                    setPasswords((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))
                  }
                  minLength={12}
                  required
                />
              </div>
            </div>
            <div className="admin-form-actions">
              <button
                className="admin-button secondary"
                type="submit"
                disabled={passwordSaving}
              >
                {passwordSaving ? "Changing…" : "Change password"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
