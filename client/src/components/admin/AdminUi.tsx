import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function AdminPageHeader({
  eyebrow = "Website administration",
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-header-copy">
        <span className="admin-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}

export function AdminStatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`admin-status ${active ? "" : "inactive"}`}>
      {active ? "Visible" : "Hidden"}
    </span>
  );
}

export function AdminEmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="admin-empty">
      <Inbox size={30} strokeWidth={1.5} aria-hidden="true" />
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}

export function AdminNotice({
  children,
  tone = "error",
}: {
  children: ReactNode;
  tone?: "error" | "success";
}) {
  return (
    <div
      className={`admin-notice ${tone === "success" ? "success" : ""}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}

export function AdminLoadingState({ label }: { label: string }) {
  return (
    <div className="admin-loading" role="status" aria-live="polite">
      <span className="admin-spinner" aria-hidden="true" />
      {label}
    </div>
  );
}

export function formatAdminDate(value: unknown): string {
  if (typeof value !== "string" && !(value instanceof Date)) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
