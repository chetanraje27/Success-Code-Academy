import type { CSSProperties, ReactNode } from "react";
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

/*
 * Skeletons announce themselves once via aria-label and hide their contents
 * from assistive tech -- a screen reader should hear "Loading records", not a
 * run of empty boxes.
 */
export function AdminTableSkeleton({
  rows = 5,
  columns = 4,
  label = "Loading records",
}: {
  rows?: number;
  columns?: number;
  label?: string;
}) {
  const template = `1.6fr ${"1fr ".repeat(Math.max(columns - 2, 0))}0.6fr`;
  return (
    <div role="status" aria-label={label} aria-live="polite">
      {Array.from({ length: rows }, (_, row) => (
        <div
          key={row}
          className="admin-skeleton-row"
          style={{ "--admin-skeleton-cols": template } as CSSProperties}
          aria-hidden="true"
        >
          {Array.from({ length: columns }, (_, col) => (
            <span
              key={col}
              className={`admin-skeleton admin-skeleton-text${col === 0 ? " lg" : ""}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function AdminCardsSkeleton({
  count = 3,
  label = "Loading summary",
}: {
  count?: number;
  label?: string;
}) {
  return (
    <div
      className="admin-skeleton-cards"
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="admin-skeleton-card" aria-hidden="true">
          <span className="admin-skeleton admin-skeleton-circle" />
          <span className="admin-skeleton-stack">
            <span className="admin-skeleton admin-skeleton-text sm" />
            <span className="admin-skeleton admin-skeleton-text lg" />
          </span>
        </div>
      ))}
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
