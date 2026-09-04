"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { Download, Search, Edit2, Trash2, ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { adminApiFetch } from "@/lib/admin-api";
import { useAdminSession } from "./AdminSessionContext";
import AdminDetailDrawer, { AdminDrawerField } from "./AdminDetailDrawer";
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
  sortable?: boolean;
  sortValue?: (row: LeadRow) => string | number | null | undefined;
};

type SortState = { key: string; direction: "asc" | "desc" } | null;

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
  const [selectedRow, setSelectedRow] = useState<LeadRow | null>(null);
  const [sort, setSort] = useState<SortState>(null);

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
    const lower = trimmed.toLowerCase();
    const filteredRows = !trimmed ? rows : rows.filter((row) =>
      Object.values(row).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(lower)
      )
    );
    if (!sort) return filteredRows;

    const column = columns.find((item) => item.key === sort.key);
    if (!column) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aValue = column.sortValue
        ? column.sortValue(a)
        : (a[column.key] as string | number | null | undefined);
      const bValue = column.sortValue
        ? column.sortValue(b)
        : (b[column.key] as string | number | null | undefined);
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      const result = typeof aValue === "number" && typeof bValue === "number"
        ? aValue - bValue
        : String(aValue).localeCompare(String(bValue), undefined, {
            numeric: true,
            sensitivity: "base",
          });
      return sort.direction === "asc" ? result : -result;
    });
  }, [rows, query, sort, columns]);

  function toggleSort(column: LeadColumn) {
    if (!column.sortable) return;
    setSort((current) => {
      if (!current || current.key !== column.key) {
        return { key: column.key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key: column.key, direction: "desc" };
      }
      return null;
    });
  }

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

  const drawerData = useMemo(() => {
    if (!selectedRow) return null;

    const rowTitle =
      [selectedRow.firstName, selectedRow.lastName].filter(Boolean).join(" ") ||
      (typeof selectedRow.studentName === "string" ? selectedRow.studentName : "") ||
      (typeof selectedRow.name === "string" ? selectedRow.name : "") ||
      (typeof selectedRow.title === "string" ? selectedRow.title : "") ||
      `Record #${selectedRow.id}`;

    const rowEmail =
      (typeof selectedRow.email === "string" ? selectedRow.email : "") ||
      (typeof selectedRow.studentEmail === "string" ? selectedRow.studentEmail : "");

    const rowPhone =
      (typeof selectedRow.mobileNumber === "string" ? selectedRow.mobileNumber : "") ||
      (typeof selectedRow.studentPhone === "string" ? selectedRow.studentPhone : "") ||
      (typeof selectedRow.phone === "string" ? selectedRow.phone : "") ||
      (typeof selectedRow.parentPhone === "string" ? selectedRow.parentPhone : "");

    const rowTimestamp = selectedRow.createdAt
      ? formatAdminDate(selectedRow.createdAt)
      : undefined;

    const rowMessageContent =
      typeof selectedRow.message === "string" && selectedRow.message.trim()
        ? selectedRow.message
        : undefined;

    const fields: AdminDrawerField[] = [];

    // Map columns to structured drawer fields
    columns.forEach((col) => {
      const val = selectedRow[col.key];
      const isEmail =
        col.key.toLowerCase().includes("email") ||
        col.label.toLowerCase().includes("email");
      const isPhone =
        col.key.toLowerCase().includes("phone") ||
        col.key.toLowerCase().includes("mobile");

      // Skip raw message text from the field grid since it has its own dedicated card
      if (col.key === "message") return;

      let formattedVal = "";
      if (col.key === "firstName") {
        // Render full student name (firstName + lastName)
        formattedVal =
          [selectedRow.firstName, selectedRow.lastName].filter(Boolean).join(" ") ||
          String(val ?? "—");
      } else if (col.key === "name" || col.key === "studentName") {
        formattedVal =
          String(
            selectedRow.studentName ||
            selectedRow.name ||
            [selectedRow.firstName, selectedRow.lastName].filter(Boolean).join(" ") ||
            val ||
            "—"
          );
      } else if (col.key === "createdAt") {
        formattedVal = formatAdminDate(val);
      } else {
        formattedVal =
          val !== null && val !== undefined && val !== "" ? String(val) : "—";
      }

      fields.push({
        label: col.label,
        value: formattedVal,
        isEmail,
        isPhone,
        fullWidth:
          isEmail ||
          col.key.toLowerCase().includes("course") ||
          col.key.toLowerCase().includes("school") ||
          col.key.toLowerCase().includes("address"),
      });
    });

    // Also include other useful fields in selectedRow if not in columns
    const alreadyMappedKeys = new Set(columns.map((c) => c.key));
    alreadyMappedKeys.add("id");
    alreadyMappedKeys.add("message");
    alreadyMappedKeys.add("updatedAt");
    alreadyMappedKeys.add("password");
    alreadyMappedKeys.add("passwordHash");
    alreadyMappedKeys.add("firstName");
    alreadyMappedKeys.add("lastName");

    // Ensure email is always present in details if available
    const hasEmailInFields = fields.some(
      (f) => f.isEmail || f.label.toLowerCase().includes("email")
    );
    if (
      !hasEmailInFields &&
      rowEmail &&
      rowEmail !== "No email provided" &&
      rowEmail !== "Entrance Form"
    ) {
      fields.push({
        label: "Email Address",
        value: rowEmail,
        isEmail: true,
        fullWidth: true,
      });
      alreadyMappedKeys.add("email");
      alreadyMappedKeys.add("studentEmail");
    }

    const candidateExtras: Array<{
      key: string;
      label: string;
      fullWidth?: boolean;
      isEmail?: boolean;
    }> = [
      { key: "email", label: "Email Address", fullWidth: true, isEmail: true },
      { key: "studentEmail", label: "Email Address", fullWidth: true, isEmail: true },
      { key: "studentClass", label: "Student Class" },
      { key: "schoolName", label: "School Name", fullWidth: true },
      { key: "city", label: "City" },
      { key: "preferredCourse", label: "Preferred Course", fullWidth: true },
      { key: "courseTitle", label: "Course Applied", fullWidth: true },
      { key: "visitingDate", label: "Visiting Date" },
      { key: "visitingTime", label: "Visiting Time" },
      { key: "parentPhone", label: "Parent Phone" },
      { key: "age", label: "Age" },
      { key: "role", label: "Role" },
    ];

    candidateExtras.forEach((cand) => {
      if (
        !alreadyMappedKeys.has(cand.key) &&
        selectedRow[cand.key] !== undefined &&
        selectedRow[cand.key] !== null &&
        selectedRow[cand.key] !== ""
      ) {
        fields.push({
          label: cand.label,
          value: String(selectedRow[cand.key]),
          fullWidth: cand.fullWidth,
          isEmail: cand.isEmail,
        });
        alreadyMappedKeys.add(cand.key);
      }
    });

    return {
      title: rowTitle,
      email: rowEmail,
      phone: rowPhone,
      timestamp: rowTimestamp,
      message: rowMessageContent
        ? {
            title: "Inquiry Message Content",
            content: rowMessageContent,
            replySubject: `Regarding your inquiry at Success Code Academy`,
          }
        : undefined,
      fields,
    };
  }, [selectedRow, columns]);

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
                    {columns.map((column) => {
                      const active = sort?.key === column.key;
                      const SortIcon = !active
                        ? ArrowUpDown
                        : sort.direction === "asc"
                          ? ArrowUp
                          : ArrowDown;
                      return (
                        <th
                          key={column.key}
                          aria-sort={
                            active
                              ? sort.direction === "asc"
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                        >
                          {column.sortable ? (
                            <button
                              type="button"
                              onClick={() => toggleSort(column)}
                              aria-label={`Sort by ${column.label}. ${
                                active
                                  ? `${sort.direction === "asc" ? "Ascending" : "Descending"}; click to reset`
                                  : "Currently unsorted"
                              }`}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                border: 0,
                                padding: 0,
                                background: "transparent",
                                color: "inherit",
                                font: "inherit",
                                letterSpacing: "inherit",
                                textTransform: "inherit",
                                cursor: "pointer",
                              }}
                            >
                              {column.label}
                              <SortIcon size={13} aria-hidden="true" />
                            </button>
                          ) : (
                            column.label
                          )}
                        </th>
                      );
                    })}
                    {showActions && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {displayedRows.map((row) => (
                    <tr
                      key={row.id}
                      className={`is-clickable ${selectedRow?.id === row.id ? "is-selected" : ""}`}
                      onClick={() => setSelectedRow(row)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedRow(row);
                        }
                      }}
                      role="button"
                      aria-label={`View details for ${row.name || row.studentName || row.title || `Record #${row.id}`}`}
                    >
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
                        <td onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {onEdit && (
                              <button
                                type="button"
                                className="sca-admin-icon-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(row);
                                }}
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                type="button"
                                className="sca-admin-icon-btn danger"
                                onClick={(e) => {
                                  e.stopPropagation();
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

      {/* Slide-over detail drawer for any selected row */}
      {selectedRow && drawerData && (
        <AdminDetailDrawer
          open={Boolean(selectedRow)}
          onClose={() => setSelectedRow(null)}
          recordId={selectedRow.id}
          badge={{
            label: eyebrow || title,
            variant: endpoint.split("/").pop() || "record",
          }}
          title={drawerData.title}
          timestamp={drawerData.timestamp}
          email={drawerData.email}
          phone={drawerData.phone}
          fields={drawerData.fields}
          message={drawerData.message}
          onEdit={onEdit ? () => onEdit(selectedRow) : undefined}
          onDelete={
            canDelete
              ? () => {
                  if (confirm("Are you sure you want to delete this record?")) {
                    onDelete?.(selectedRow);
                  }
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
