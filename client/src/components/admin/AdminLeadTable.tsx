"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { Download, Search, Edit2, Trash2 } from "lucide-react";
import { adminApiFetch } from "@/lib/admin-api";
import { useAdminSession } from "./AdminSessionContext";
import {
  AdminEmptyState,
  AdminNotice,
  AdminPageHeader,
  AdminTableSkeleton,
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
  eyebrow = "Enquiries & records",
  endpoint,
  searchPlaceholder,
  columns,
  exportName,
  onEdit,
  onDelete,
  onAdd,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  endpoint: string;
  searchPlaceholder: string;
  columns: LeadColumn[];
  exportName: string;
  onEdit?: (row: LeadRow) => void;
  onDelete?: (row: LeadRow) => void;
  onAdd?: () => void;
}) {
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [query, setQuery] = useState("");
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  /*
   * A standard administrator reads and edits records but never creates or
   * removes them, so those two controls are dropped from the toolbar and from
   * every row. The API rejects the same two verbs for this role, so a restored
   * button would only produce a 403.
   */
  const { isSuperAdmin } = useAdminSession();
  const canAdd = Boolean(onAdd) && isSuperAdmin;
  const canDelete = Boolean(onDelete) && isSuperAdmin;
  const showActions = Boolean(onEdit) || canDelete;

  const loadRows = useCallback(
    async (append = false, cursor?: number) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError("");
      const params = new URLSearchParams({ limit: "50" });
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
    [endpoint, title],
  );

  useEffect(() => {
    // Load the remote lead resource when the endpoint changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRows();
  }, [loadRows]);

  const displayedRows = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return rows;
    const lower = trimmed.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(lower)
      )
    );
  }, [rows, query]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      {error && (
        <AdminNotice>{error}</AdminNotice>
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
        <div style={{ display: 'flex', gap: '8px' }}>
          {canAdd && (
            <button
              className="admin-button primary"
              type="button"
              onClick={onAdd}
            >
              Add New Record
            </button>
          )}
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
      </div>

      <section className="admin-card">
        <header className="admin-card-header">
          <div>
            <h2>{query.trim() ? `Results for “${query.trim()}”` : title}</h2>
            <p>{displayedRows.length} records currently loaded</p>
          </div>
        </header>

        {loading ? (
          <AdminTableSkeleton
            rows={6}
            columns={columns.length + (showActions ? 1 : 0)}
            label="Loading records"
          />
        ) : displayedRows.length === 0 ? (
          <AdminEmptyState
            title="No records found"
            message={
              query.trim()
                ? "Try a different search term."
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
                    {showActions && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {displayedRows.map((row) => (
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
                      {showActions && (
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {onEdit && (
                              <button
                                className="sca-admin-icon-btn"
                                onClick={() => onEdit(row)}
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                className="sca-admin-icon-btn danger"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this record?")) {
                                    onDelete?.(row);
                                  }
                                }}
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
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
