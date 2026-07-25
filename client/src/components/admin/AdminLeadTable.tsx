"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { adminApiFetch } from "@/lib/admin-api";
import {
  AdminEmptyState,
  AdminPageHeader,
  formatAdminDate,
} from "./AdminUi";

type LeadRow = { id: number; [key: string]: unknown };

export type LeadColumn = {
  key: string;
  label: string;
  render?: (row: LeadRow) => React.ReactNode;
};

function csvCell(value: unknown): string {
  const text =
    typeof value === "string" || typeof value === "number"
      ? String(value)
      : "";
  // Prefix formula characters so spreadsheet programs do not execute
  // user-submitted lead content.
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export default function AdminLeadTable({
  title,
  description,
  endpoint,
  searchPlaceholder,
  columns,
  exportName,
}: {
  title: string;
  description: string;
  endpoint: string;
  searchPlaceholder: string;
  columns: LeadColumn[];
  exportName: string;
}) {
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadRows = useCallback(
    async (append = false, cursor?: number) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError("");
      const params = new URLSearchParams({ limit: "50" });
      if (activeQuery) params.set("q", activeQuery);
      if (cursor) params.set("cursor", String(cursor));

      try {
        const response = await adminApiFetch<LeadRow[]>(
          `${endpoint}?${params.toString()}`,
        );
        setRows((current) =>
          append ? [...current, ...response.data] : response.data,
        );
        setNextCursor(response.pagination?.nextCursor ?? null);
        setHasMore(Boolean(response.pagination?.hasMore));
      } catch (caught) {
        setError(
          caught instanceof Error ? caught.message : `Unable to load ${title}.`,
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeQuery, endpoint, title],
  );

  useEffect(() => {
    // Load the remote lead resource when the endpoint or search changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRows();
  }, [loadRows]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveQuery(query.trim());
  }

  function downloadCsv() {
    const header = columns.map((column) => csvCell(column.label)).join(",");
    const body = rows
      .map((row) =>
        columns.map((column) => csvCell(row[column.key])).join(","),
      )
      .join("\n");
    const blob = new Blob([`\uFEFF${header}\n${body}`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${exportName}-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Enquiries & records"
        title={title}
        description={description}
      />

      {error && (
        <div className="admin-notice" role="alert">
          {error}
        </div>
      )}

      <div className="admin-toolbar">
        <form className="admin-search-form" onSubmit={handleSearch}>
          <div className="admin-search-box">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={`Search ${title}`}
            />
          </div>
          <button className="admin-button secondary" type="submit">
            Search
          </button>
        </form>
        <button
          className="admin-button secondary"
          type="button"
          onClick={downloadCsv}
          disabled={rows.length === 0}
        >
          <Download size={16} />
          Export loaded rows
        </button>
      </div>

      <section className="admin-card">
        <header className="admin-card-header">
          <div>
            <h2>{activeQuery ? `Results for “${activeQuery}”` : title}</h2>
            <p>{rows.length} records currently loaded</p>
          </div>
        </header>

        {loading ? (
          <div className="admin-loading" role="status">
            <span className="admin-spinner" />
            Loading records…
          </div>
        ) : rows.length === 0 ? (
          <AdminEmptyState
            title="No records found"
            message={
              activeQuery
                ? "Try a different name, phone number, email, or course."
                : "New submissions will appear here automatically."
            }
          />
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key}>{column.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      {columns.map((column) => (
                        <td key={column.key}>
                          {column.render
                            ? column.render(row)
                            : column.key === "createdAt"
                              ? formatAdminDate(row[column.key])
                              : String(row[column.key] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hasMore && nextCursor && (
              <div className="admin-card-body">
                <button
                  className="admin-button secondary"
                  type="button"
                  onClick={() => void loadRows(true, nextCursor)}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading…" : "Load 50 more"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
