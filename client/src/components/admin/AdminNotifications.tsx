"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Check, X } from "lucide-react";
import { adminApiFetch, adminNotificationPaths } from "@/lib/admin-api";

type InboxItem = { id: string; title: string; body: string; url: string; createdAt: number; read: boolean };
const STORAGE = "sca-admin-notification-inbox";

function safeItem(input: unknown): InboxItem | null {
  if (!input || typeof input !== "object") return null;
  const item = input as Record<string, unknown>;
  const title = typeof item.title === "string" ? item.title.slice(0, 80) : "Admin update";
  const body = typeof item.body === "string" ? item.body.slice(0, 180) : "You have a new admin notification.";
  const rawUrl = typeof item.url === "string" ? item.url : typeof item.targetUrl === "string" ? item.targetUrl : "/admin";
  let url = "/admin";
  try { const parsed = new URL(rawUrl, window.location.origin); if (parsed.origin === window.location.origin && parsed.pathname.startsWith("/admin")) url = parsed.pathname + parsed.search; } catch { /* use safe default */ }
  const createdAt = typeof item.createdAt === "number" ? item.createdAt : typeof item.createdAt === "string" ? Date.parse(item.createdAt) : Date.now();
  return { id: typeof item.id === "string" || typeof item.id === "number" ? String(item.id) : `${Date.now()}`, title, body, url, createdAt: Number.isNaN(createdAt) ? Date.now() : createdAt, read: item.read === true || Boolean(item.readAt) };
}

function fromServer(input: unknown): InboxItem | null {
  if (!input || typeof input !== "object") return null;
  const item = input as Record<string, unknown>;
  return safeItem({ ...item, url: item.targetUrl, read: Boolean(item.readAt) });
}

export default function AdminNotifications() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // Registration is quiet: permission is requested only from the explicit
    // control in settings.
    void navigator.serviceWorker?.register("/sw.js", { scope: "/" }).catch(() => undefined);
    try { setItems(JSON.parse(localStorage.getItem(STORAGE) || "[]").map(safeItem).filter(Boolean) as InboxItem[]); } catch { setItems([]); }
    void adminApiFetch<unknown[]>(adminNotificationPaths.list).then((response) => {
      const serverItems = (Array.isArray(response.data) ? response.data : []).map(fromServer).filter(Boolean) as InboxItem[];
      setItems(serverItems.slice(0, 30));
      localStorage.setItem(STORAGE, JSON.stringify(serverItems.slice(0, 30)));
    }).catch(() => undefined);
    const onMessage = (event: MessageEvent) => {
      const next = safeItem(event.data); if (!next) return;
      setItems((current) => { const updated = [next, ...current.filter((item) => item.id !== next.id)].slice(0, 30); localStorage.setItem(STORAGE, JSON.stringify(updated)); return updated; });
      void adminApiFetch<unknown[]>(adminNotificationPaths.list).then((response) => {
        const serverItems = (Array.isArray(response.data) ? response.data : []).map(fromServer).filter(Boolean) as InboxItem[];
        setItems(serverItems.slice(0, 30));
        localStorage.setItem(STORAGE, JSON.stringify(serverItems.slice(0, 30)));
      }).catch(() => undefined);
    };
    navigator.serviceWorker?.addEventListener("message", onMessage);
    return () => navigator.serviceWorker?.removeEventListener("message", onMessage);
  }, []);
  const unread = useMemo(() => items.filter((item) => !item.read).length, [items]);
  function markRead(id: string) {
    setItems((current) => { const updated = current.map((item) => item.id === id ? { ...item, read: true } : item); localStorage.setItem(STORAGE, JSON.stringify(updated)); return updated; });
    void adminApiFetch(adminNotificationPaths.read(Number(id)), { method: "PATCH" }).catch(() => undefined);
  }
  return <div className="admin-notification-center">
    <button type="button" className="admin-icon-button admin-notification-trigger" onClick={() => setOpen((value) => !value)} aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} aria-expanded={open}>
      <Bell size={17} />{unread > 0 && <span className="admin-notification-count">{unread > 99 ? "99+" : unread}</span>}
    </button>
    {open && <div className="admin-notification-popover" role="dialog" aria-label="Admin notification inbox">
      <div className="admin-notification-popover-head"><div><strong>Admin inbox</strong><span>{unread ? `${unread} unread` : "All caught up"}</span></div><button type="button" onClick={() => setOpen(false)} aria-label="Close inbox"><X size={15} /></button></div>
      <div className="admin-notification-list">{items.length === 0 ? <p className="admin-notification-empty">New admin alerts will appear here.</p> : items.map((item) => <Link href={item.url} key={item.id} className={`admin-notification-item ${item.read ? "" : "is-unread"}`} onClick={() => markRead(item.id)}><span><strong>{item.title}</strong><span>{item.body}</span></span>{item.read && <Check size={14} aria-label="Read" />}</Link>)}</div>
    </div>}
  </div>;
}
