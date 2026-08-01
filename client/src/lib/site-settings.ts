"use client";

import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@/data/home";

export type PublicSiteSettings = {
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

export const defaultSiteSettings: PublicSiteSettings = {
  phone: siteConfig.phone,
  email: siteConfig.email,
  address1: siteConfig.address1,
  address2: siteConfig.address2,
  whatsapp: siteConfig.phone.replace(/\D/g, ""),
  ...siteConfig.social,
};

export function useSiteSettings(): PublicSiteSettings {
  const [settings, setSettings] =
    useState<PublicSiteSettings>(defaultSiteSettings);

  const refresh = useCallback(() => {
    fetch("/api/content/settings", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as {
          data?: Partial<PublicSiteSettings>;
        };
      })
      .then((payload) => {
        if (!payload?.data) return;
        setSettings((current) => {
          const next = { ...current };
          for (const key of Object.keys(
            defaultSiteSettings,
          ) as Array<keyof PublicSiteSettings>) {
            const value = payload.data?.[key];
            if (typeof value === "string") {
              next[key] = value.trim();
            }
          }
          return next;
        });
      })
      .catch(() => {
        // Static defaults keep public contact actions usable during an outage.
      });
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("admin-content-changed", refresh);
    return () => window.removeEventListener("admin-content-changed", refresh);
  }, [refresh]);

  return settings;
}

export function whatsappHref(settings: PublicSiteSettings): string {
  if (/^https:\/\/wa\.me\//i.test(settings.whatsapp)) {
    return settings.whatsapp;
  }
  const digits = (settings.whatsapp || settings.phone).replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}
