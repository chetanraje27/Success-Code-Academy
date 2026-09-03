"use client";

import { useEffect, useState } from "react";

/**
 * Maps each page to its SiteSetting key and the default local image path.
 */
const PAGE_BANNER_MAP = {
  scholarships: {
    key: "page_banner_scholarships",
    fallback: "/images/banners/ScholorshipHero.png",
  },
  contact: {
    key: "page_banner_contact",
    fallback: "/images/banners/ContactPoster.png",
  },
  results: {
    key: "page_banner_results",
    fallback: "/images/results/heroes/NeetUG2026AchiversShravani.png",
  },
} as const;

export type PageBannerPage = keyof typeof PAGE_BANNER_MAP;

/**
 * Fetches the page-banner URL from the site_settings table.
 * Falls back to the hardcoded default if the database value is empty or
 * the fetch fails.
 */
export function usePageBanner(page: PageBannerPage): { src: string; isLoading: boolean } {
  const { key, fallback } = PAGE_BANNER_MAP[page];
  const [src, setSrc] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    const load = () => {
      setIsLoading(true);
      fetch("/api/content/settings", { cache: "no-store" })
        .then(async (r) => {
          if (!r.ok) return null;
          return (await r.json()) as { data?: Record<string, string> };
        })
        .then((payload) => {
          if (!active) return;
          const url = payload?.data?.[key]?.trim();
          if (url) setSrc(url);
          setIsLoading(false);
        })
        .catch(() => {
          if (active) setIsLoading(false);
        });
    };

    load();
    window.addEventListener("admin-content-changed", load);
    return () => {
      active = false;
      window.removeEventListener("admin-content-changed", load);
    };
  }, [key]);

  return { src, isLoading };
}
