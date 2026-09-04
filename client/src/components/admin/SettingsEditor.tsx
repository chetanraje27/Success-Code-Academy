"use client";

import { useCallback, useEffect, useState } from "react";
import { Save } from "lucide-react";
import {
  adminApiFetch,
  AdminApiError,
} from "@/lib/admin-api";
import {
  defaultSiteSettings,
  type PublicSiteSettings,
} from "@/lib/site-settings";
import AdminModal from "./AdminModal";
import { useEditMode } from "./EditModeContext";
import { AdminLoadingState, AdminNotice } from "./AdminUi";
import { useToast } from "./Toast";

export default function SettingsEditor({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { bumpRefresh } = useEditMode();
  const toast = useToast();
  const [settings, setSettings] =
    useState<PublicSiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response =
        await adminApiFetch<Partial<PublicSiteSettings>>("settings");
      setSettings((current) => ({ ...current, ...response.data }));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load website settings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Opening the dialog synchronizes it with the remote settings resource.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) void loadSettings();
  }, [loadSettings, open]);

  function updateSetting(key: keyof PublicSiteSettings, value: string) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminApiFetch("settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      bumpRefresh();
      toast.success("Website settings saved.");
      onClose();
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.fields.length > 0) {
        setError(caught.fields.map((field) => field.message).join(" "));
      } else {
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to save website settings.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Website contact and social links"
      width={680}
    >
      {error && <AdminNotice>{error}</AdminNotice>}
      {loading ? (
        <AdminLoadingState label="Loading website settings…" />
      ) : (
        <form className="admin-form" onSubmit={handleSubmit} aria-busy={saving}>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="live-settings-phone">Phone number</label>
              <input
                id="live-settings-phone"
                type="tel"
                value={settings.phone}
                onChange={(event) =>
                  updateSetting("phone", event.target.value)
                }
                placeholder="+91 86004 70850"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="live-settings-email">Email address</label>
              <input
                id="live-settings-email"
                type="email"
                value={settings.email}
                onChange={(event) =>
                  updateSetting("email", event.target.value)
                }
                placeholder="successcodeacademy@gmail.com"
              />
            </div>
            <div className="admin-field full">
              <label htmlFor="live-settings-address1">Girls Branch Address</label>
              <textarea
                id="live-settings-address1"
                value={settings.address1}
                onChange={(event) =>
                  updateSetting("address1", event.target.value)
                }
                rows={2}
              />
            </div>
            <div className="admin-field full">
              <label htmlFor="live-settings-address2">Boys Branch Address</label>
              <textarea
                id="live-settings-address2"
                value={settings.address2}
                onChange={(event) =>
                  updateSetting("address2", event.target.value)
                }
                rows={2}
              />
              <small>
                Used on the Contact page, map, and website footer. Map uses Girls Branch address.
              </small>
            </div>
            <div className="admin-field full">
              <label htmlFor="live-settings-whatsapp">
                WhatsApp number or link
              </label>
              <input
                id="live-settings-whatsapp"
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
            <span>Leave a platform blank to hide its footer icon.</span>
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
                <label htmlFor={`live-settings-${key}`}>{label}</label>
                <input
                  id={`live-settings-${key}`}
                  type="url"
                  value={settings[key]}
                  onChange={(event) => updateSetting(key, event.target.value)}
                  placeholder="https://"
                />
              </div>
            ))}
          </div>

          <div className="admin-form-actions">
            <button
              className="admin-button secondary"
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button className="admin-button" type="submit" disabled={saving}>
              <Save size={17} />
              {saving ? "Saving…" : "Save website settings"}
            </button>
          </div>
        </form>
      )}
    </AdminModal>
  );
}
