"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { adminApiFetch, adminNotificationPaths } from "@/lib/admin-api";

type InboxItem = {
  id: string;
  title: string;
  body: string;
  url: string;
  createdAt: number;
  read: boolean;
};

type PageInfo = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type ListPayload = {
  items?: unknown[];
  pagination?: Partial<PageInfo> & { hasMore?: boolean };
  unreadCount?: number;
};

const STORAGE = "sca-admin-notification-inbox";
const PAGE_SIZE = 10;
const RECENT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function safeItem(input: unknown): InboxItem | null {
  if (!input || typeof input !== "object") return null;
  const item = input as Record<string, unknown>;
  // Notifications without authored copy are not useful in the inbox. Do not
  // replace it with a generic label: the server is the source of truth.
  const title = typeof item.title === "string" ? item.title.trim().slice(0, 80) : "";
  const body = typeof item.body === "string" ? item.body.trim().slice(0, 180) : "";
  if (!title || !body) return null;
  const rawUrl = typeof item.url === "string" ? item.url : typeof item.targetUrl === "string" ? item.targetUrl : "";
  let url = "/admin";
  try {
    const parsed = new URL(rawUrl || "/admin", window.location.origin);
    if (parsed.origin === window.location.origin && parsed.pathname.startsWith("/admin")) url = parsed.pathname + parsed.search;
  } catch { /* Keep the safe internal destination. */ }
  const createdAt = typeof item.createdAt === "number" ? item.createdAt : typeof item.createdAt === "string" ? Date.parse(item.createdAt) : NaN;
  const id = typeof item.id === "string" || typeof item.id === "number" ? String(item.id) : "";
  if (!id || !Number.isFinite(createdAt)) return null;
  return {
    id,
    title,
    body,
    url,
    createdAt,
    read: item.read === true || Boolean(item.readAt),
  };
}

function fromServer(input: unknown): InboxItem | null {
  if (!input || typeof input !== "object") return null;
  const item = input as Record<string, unknown>;
  return safeItem({ ...item, url: item.targetUrl, read: Boolean(item.readAt) });
}

function readPayload(response: { data?: unknown; pagination?: unknown }): { items: InboxItem[]; pagination?: ListPayload["pagination"]; unreadCount?: number } {
  const data = response.data && typeof response.data === "object" ? response.data as ListPayload : {};
  const rawItems = Array.isArray(data.items) ? data.items : Array.isArray(response.data) ? response.data : [];
  const recentItems = rawItems.map(fromServer).filter((item): item is InboxItem => Boolean(item));
  return {
    items: recentItems.filter((item) => item.createdAt >= Date.now() - RECENT_WINDOW_MS),
    pagination: data.pagination || (response.pagination as ListPayload["pagination"] | undefined),
    unreadCount: typeof data.unreadCount === "number" ? data.unreadCount : undefined,
  };
}

export default function AdminNotifications() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<PageInfo>({ page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 1 });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadPage = useCallback(async (nextPage: number) => {
    setLoading(true);
    try {
      const response = await adminApiFetch<ListPayload>(`${adminNotificationPaths.list}?page=${nextPage}&limit=${PAGE_SIZE}`);
      const payload = readPayload(response);
      const serverPagination = payload.pagination || {};
      const total = typeof serverPagination.total === "number" ? serverPagination.total : payload.items.length;
      const pageSize = typeof serverPagination.pageSize === "number" ? serverPagination.pageSize : PAGE_SIZE;
      const totalPages = typeof serverPagination.totalPages === "number" ? Math.max(1, serverPagination.totalPages) : (serverPagination.hasMore ? nextPage + 1 : Math.max(1, Math.ceil(total / pageSize)));
      setItems(payload.items);
      setPage(nextPage);
      setPageInfo({ page: nextPage, pageSize, total, totalPages });
      if (payload.unreadCount !== undefined) setUnreadCount(payload.unreadCount);
      else setUnreadCount(payload.items.filter((item) => !item.read).length);
      localStorage.setItem(STORAGE, JSON.stringify(payload.items));
    } catch {
      if (nextPage === 1) {
        try { setItems(JSON.parse(localStorage.getItem(STORAGE) || "[]").map(safeItem).filter(Boolean) as InboxItem[]); } catch { setItems([]); }
      }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void navigator.serviceWorker?.register("/sw.js", { scope: "/" }).catch(() => undefined);
    void loadPage(1);
    const onMessage = () => { void loadPage(1); };
    navigator.serviceWorker?.addEventListener("message", onMessage);
    return () => navigator.serviceWorker?.removeEventListener("message", onMessage);
  }, [loadPage]);

  const unread = useMemo(() => Math.max(unreadCount, items.filter((item) => !item.read).length), [items, unreadCount]);
  const first = pageInfo.total === 0 ? 0 : (page - 1) * pageInfo.pageSize + 1;
  const last = Math.min(page * pageInfo.pageSize, pageInfo.total);

  function markRead(id: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
    setUnreadCount((count) => Math.max(0, count - 1));
    void adminApiFetch(adminNotificationPaths.read(Number(id)), { method: "PATCH" }).catch(() => undefined);
  }

  return <div className="admin-notification-center">
    <button type="button" className="admin-icon-button admin-notification-trigger" onClick={() => setOpen((value) => !value)} aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} aria-expanded={open}>
      <Bell size={17} />{unread > 0 && <span className="admin-notification-count">{unread > 99 ? "99+" : unread}</span>}
    </button>
    {open && <div className="admin-notification-popover" role="dialog" aria-label="Admin notification inbox">
      <div className="admin-notification-popover-head"><div><strong>Admin inbox</strong><span>{unread ? `${unread} unread` : "All caught up"}</span></div><button type="button" onClick={() => setOpen(false)} aria-label="Close inbox"><X size={15} /></button></div>
      <div className="admin-notification-list">{loading ? <p className="admin-notification-empty">Loading recent updates…</p> : items.length === 0 ? <div className="admin-notification-empty"><Bell size={20} /><strong>You’re all caught up</strong><span>Recent admin updates will appear here.</span></div> : items.map((item) => <Link href={item.url} key={item.id} className={`admin-notification-item ${item.read ? "" : "is-unread"}`} onClick={() => markRead(item.id)}><span><strong>{item.title}</strong><span>{item.body}</span></span>{item.read && <Check size={14} aria-label="Read" />}</Link>)}</div>
      <div className="admin-notification-footer"><span>Showing {first}–{last} of {pageInfo.total}</span><div><button type="button" onClick={() => void loadPage(page - 1)} disabled={loading || page <= 1} aria-label="Previous notifications"><ChevronLeft size={15} /></button><button type="button" onClick={() => void loadPage(page + 1)} disabled={loading || page >= pageInfo.totalPages} aria-label="Next notifications"><ChevronRight size={15} /></button></div></div>
    </div>}
  </div>;
}
