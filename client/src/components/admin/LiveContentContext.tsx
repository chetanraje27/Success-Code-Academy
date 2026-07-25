"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { adminApiFetch } from "@/lib/admin-api";
import { useEditMode } from "./EditModeContext";

export type ContentScope = "page" | "global";
export type ContentKind = "text" | "multiline";

type ContentOverride = {
  value: string;
  kind: ContentKind;
  updatedAt?: string;
};

type ContentMap = Record<string, ContentOverride>;

type LiveContentContextValue = {
  pageKey: string;
  loading: boolean;
  overrideCount: number;
  getContent: (
    contentKey: string,
    defaultValue: string,
    scope?: ContentScope,
  ) => string;
  hasOverride: (contentKey: string, scope?: ContentScope) => boolean;
  saveContent: (
    contentKey: string,
    value: string,
    kind: ContentKind,
    scope?: ContentScope,
  ) => Promise<void>;
  resetContent: (
    contentKey: string,
    scope?: ContentScope,
  ) => Promise<void>;
};

const LiveContentContext = createContext<LiveContentContextValue | null>(null);

function pathnameToPageKey(pathname: string): string {
  const clean = pathname
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9._:/-]+/g, "-")
    .replace(/\//g, ":");
  return (clean || "home").slice(0, 160);
}

async function fetchContentMap(pageKey: string): Promise<ContentMap> {
  const response = await fetch(`/api/content/${encodeURIComponent(pageKey)}`, {
    cache: "no-store",
    credentials: "same-origin",
  });
  if (!response.ok) return {};
  const payload = (await response.json()) as { data?: ContentMap };
  return payload.data || {};
}

export function LiveContentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageKey = useMemo(() => pathnameToPageKey(pathname), [pathname]);
  const { refreshKey, bumpRefresh } = useEditMode();
  const [pageContent, setPageContent] = useState<ContentMap>({});
  const [globalContent, setGlobalContent] = useState<ContentMap>({});
  const requestKey = `${pageKey}:${refreshKey}`;
  const [loadedRequestKey, setLoadedRequestKey] = useState("");
  const loading = loadedRequestKey !== requestKey;

  useEffect(() => {
    let active = true;
    Promise.all([fetchContentMap("global"), fetchContentMap(pageKey)])
      .then(([nextGlobal, nextPage]) => {
        if (!active) return;
        setGlobalContent(nextGlobal);
        setPageContent(nextPage);
        setLoadedRequestKey(requestKey);
      })
      .catch(() => {
        if (active) setLoadedRequestKey(requestKey);
      });
    return () => {
      active = false;
    };
  }, [pageKey, requestKey]);

  const mapForScope = useCallback(
    (scope: ContentScope) =>
      scope === "global" ? globalContent : pageContent,
    [globalContent, pageContent],
  );

  const getContent = useCallback(
    (
      contentKey: string,
      defaultValue: string,
      scope: ContentScope = "page",
    ) => mapForScope(scope)[contentKey]?.value ?? defaultValue,
    [mapForScope],
  );

  const hasOverride = useCallback(
    (contentKey: string, scope: ContentScope = "page") =>
      Boolean(mapForScope(scope)[contentKey]),
    [mapForScope],
  );

  const saveContent = useCallback(
    async (
      contentKey: string,
      value: string,
      kind: ContentKind,
      scope: ContentScope = "page",
    ) => {
      const targetPage = scope === "global" ? "global" : pageKey;
      await adminApiFetch(
        `page-content/${encodeURIComponent(targetPage)}/${encodeURIComponent(contentKey)}`,
        {
          method: "PUT",
          body: JSON.stringify({ value, kind }),
        },
      );
      bumpRefresh();
    },
    [bumpRefresh, pageKey],
  );

  const resetContent = useCallback(
    async (contentKey: string, scope: ContentScope = "page") => {
      const targetPage = scope === "global" ? "global" : pageKey;
      await adminApiFetch(
        `page-content/${encodeURIComponent(targetPage)}/${encodeURIComponent(contentKey)}`,
        { method: "DELETE" },
      );
      bumpRefresh();
    },
    [bumpRefresh, pageKey],
  );

  const value = useMemo(
    () => ({
      pageKey,
      loading,
      overrideCount:
        Object.keys(pageContent).length + Object.keys(globalContent).length,
      getContent,
      hasOverride,
      saveContent,
      resetContent,
    }),
    [
      getContent,
      globalContent,
      hasOverride,
      loading,
      pageContent,
      pageKey,
      resetContent,
      saveContent,
    ],
  );

  return (
    <LiveContentContext.Provider value={value}>
      {children}
    </LiveContentContext.Provider>
  );
}

export function useLiveContent(): LiveContentContextValue {
  const context = useContext(LiveContentContext);
  if (!context) {
    throw new Error("useLiveContent must be used within LiveContentProvider");
  }
  return context;
}
