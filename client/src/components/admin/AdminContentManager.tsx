"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Download, Pencil, Plus, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  adminApiFetch,
  AdminApiError,
  uploadAdminImage,
} from "@/lib/admin-api";
import AdminModal from "./AdminModal";
import { useAdminSession } from "./AdminSessionContext";
import AdminDetailDrawer, { AdminDrawerField } from "./AdminDetailDrawer";
import {
  AdminEmptyState,
  AdminNotice,
  AdminPageHeader,
  AdminStatusBadge,
  AdminTableSkeleton,
  formatAdminDate,
} from "./AdminUi";
import RevisionHistoryButton, {
  type MediaResourceType,
} from "./RevisionHistoryButton";
import { useToast } from "./Toast";

type FieldValue = string | number | boolean;
type ResourceItem = { id: number; [key: string]: unknown };

export type AdminContentField = {
  name: string;
  label: string;
  kind:
    | "text"
    | "textarea"
    | "number"
    | "checkbox"
    | "select"
    | "color"
    | "image"
    | "url"
    | "video-url";
  defaultValue?: FieldValue;
  required?: boolean;
  placeholder?: string;
  help?: string;
  full?: boolean;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
};

export type AdminContentColumn = {
  label: string;
  key: string;
  kind?: "text" | "image" | "status";
  roundImage?: boolean;
  render?: (item: ResourceItem) => React.ReactNode;
  sortable?: boolean;
};

function initialValues(fields: AdminContentField[]) {
  return fields.reduce<Record<string, FieldValue>>((values, field) => {
    values[field.name] =
      field.defaultValue ??
      (field.kind === "checkbox" ? true : field.kind === "number" ? 0 : "");
    return values;
  }, {});
}

function valueFromItem(
  item: ResourceItem,
  field: AdminContentField,
): FieldValue {
  const value = item[field.name];
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  return (
    field.defaultValue ??
    (field.kind === "checkbox" ? true : field.kind === "number" ? 0 : "")
  );
}

export default function AdminContentManager({
  title,
  description,
  itemName,
  resource,
  fields,
  columns,
  uploadType,
  historyType,
  filterItems,
  headerAction,
}: {
  title: string;
  description: string;
  itemName: string;
  resource: string;
  fields: AdminContentField[];
  columns: AdminContentColumn[];
  uploadType?: "banner" | "star" | "result" | "news" | "video";
  historyType?: MediaResourceType;
  filterItems?: (item: ResourceItem) => boolean;
  headerAction?: React.ReactNode;
}) {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ResourceItem | null>(null);
  const [values, setValues] = useState<Record<string, FieldValue>>(() =>
    initialValues(fields),
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" | null }>({ key: "", direction: null });
  const [pageSize, setPageSize] = useState<10 | 25 | 50>(10);
  const [page, setPage] = useState(1);
  const toast = useToast();

  /*
   * A standard administrator may open any record and save changes to it, but
   * not add a new one or remove an existing one. Restoring a saved revision is
   * grouped with creation because it can bring a deleted record back, so the
   * History button goes with them.
   */
  const { isSuperAdmin } = useAdminSession();

  const imageField = useMemo(
    () => fields.find((field) => field.kind === "image"),
    [fields],
  );
  const videoField = useMemo(
    () => fields.find((field) => field.kind === "video-url"),
    [fields],
  );

  const displayedItems = useMemo(() => {
    let filtered = filterItems ? items.filter(filterItems) : items;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(lower)
        )
      );
    }
    if (sort.direction && sort.key) {
      const column = columns.find((candidate) => candidate.key === sort.key);
      filtered = [...filtered].sort((a, b) => {
        const left = a[sort.key];
        const right = b[sort.key];
        const dateLike = column?.key === "date" || column?.key.endsWith("At");
        const leftValue = dateLike ? new Date(String(left)).getTime() : left;
        const rightValue = dateLike ? new Date(String(right)).getTime() : right;
        const comparison = typeof leftValue === "number" && typeof rightValue === "number"
          ? leftValue - rightValue
          : String(leftValue ?? "").localeCompare(String(rightValue ?? ""), undefined, { numeric: true });
        return sort.direction === "asc" ? comparison : -comparison;
      });
    }
    return filtered;
  }, [items, filterItems, searchTerm, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(displayedItems.length / pageSize));
  const pageItems = displayedItems.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, sort, pageSize]);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  function csvValue(value: unknown) {
    const text = value === null || value === undefined ? "" : String(value);
    const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  }

  function exportItems() {
    if (displayedItems.length === 0) {
      toast.info("There are no filtered records to export.");
      return;
    }
    const rows = displayedItems.map((item) => columns.map((column) => csvValue(item[column.key])).join(","));
    const csv = [columns.map((column) => csvValue(column.label)).join(","), ...rows].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${resource}-export.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${displayedItems.length} ${itemName.toLowerCase()}${displayedItems.length === 1 ? "" : "s"}.`);
  }

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApiFetch<ResourceItem[]>(resource);
      const raw = response as unknown as ResourceItem[] | { data?: ResourceItem[] };
      const envelopeItems = Array.isArray(raw) ? raw : Array.isArray(raw.data) ? raw.data : undefined;
      // adminApiFetch envelopes JSON responses; if an older endpoint returns a
      // bare array, its numeric entries survive the envelope spread.
      const legacyItems = envelopeItems ?? Object.keys(response)
        .filter((key) => /^\d+$/.test(key))
        .sort((left, right) => Number(left) - Number(right))
        .map((key) => (response as unknown as Record<string, unknown>)[key])
        .filter((item): item is ResourceItem => Boolean(item) && typeof item === "object");
      setItems(legacyItems);
      toast.success(`${title} loaded.`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : `Unable to load ${title}.`;
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [resource, title, toast]);

  useEffect(() => {
    // Load the remote CMS resource when its endpoint changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadItems();
  }, [loadItems]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function openCreate() {
    setEditing(null);
    const nextValues = initialValues(fields);
    if ("orderIndex" in nextValues || fields.some((f) => f.name === "orderIndex")) {
      const maxOrder = items.reduce((max, item) => {
        const val = typeof item.orderIndex === "number" ? item.orderIndex : 0;
        return Math.max(max, val);
      }, 0);
      nextValues.orderIndex = maxOrder > 0 ? maxOrder + 1 : 1;
    }
    setValues(nextValues);
    setImageFile(null);
    setVideoFile(null);
    setImagePreview("");
    setError("");
    setModalOpen(true);
  }

  function openEdit(item: ResourceItem) {
    const next = fields.reduce<Record<string, FieldValue>>((result, field) => {
      let val = valueFromItem(item, field);
      if (field.name === "orderIndex") {
        const numVal = typeof val === "number" ? val : parseInt(String(val), 10) || 0;
        val = Math.max(1, numVal);
      }
      result[field.name] = val;
      return result;
    }, {});
    setEditing(item);
    setValues(next);
    setImageFile(null);
    setVideoFile(null);
    setImagePreview(
      imageField && typeof item[imageField.name] === "string"
        ? String(item[imageField.name])
        : "",
    );
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setImageFile(null);
    setVideoFile(null);
    setImagePreview("");
    setError("");
  }

  async function handleDelete(item: ResourceItem) {
    const label =
      typeof item.name === "string"
        ? item.name
        : typeof item.text === "string"
          ? item.text
          : `this ${itemName.toLowerCase()}`;
    if (
      !window.confirm(
        `Delete "${label}"? You can restore it later from History.`,
      )
    ) {
      return;
    }

    setError("");
    try {
      await adminApiFetch(`${resource}/${item.id}`, { method: "DELETE" });
      await loadItems();
      toast.success(`${itemName} deleted.`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : `Unable to delete ${itemName}.`;
      setError(message);
      toast.error(message);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = { ...values };
      for (const field of fields) {
        if (
          field.kind === "number" &&
          !field.required &&
          payload[field.name] === ""
        ) {
          delete payload[field.name];
        }
      }
      if (imageFile && imageField && uploadType) {
        payload[imageField.name] = await uploadAdminImage(imageFile, uploadType);
      }
      if (videoFile && videoField && uploadType) {
        payload[videoField.name] = await uploadAdminImage(videoFile, uploadType);
      }

      const url = editing ? `${resource}/${editing.id}` : resource;
      await adminApiFetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setModalOpen(false);
      setEditing(null);
      setImageFile(null);
      setVideoFile(null);
      setImagePreview("");
      await loadItems();
      window.dispatchEvent(new Event("admin-content-changed"));
      toast.success(`${itemName} ${editing ? "updated" : "created"} successfully.`);
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.fields.length > 0) {
        const message = caught.fields.map((field) => field.message).join(" ");
        setError(message);
        toast.error(message);
      } else {
        const message = caught instanceof Error ? caught.message : `Unable to save ${itemName}.`;
        setError(message);
        toast.error(message);
      }
    } finally {
      setSaving(false);
    }
  }

  const drawerData = useMemo(() => {
    if (!selectedItem) return null;

    const itemTitle =
      (typeof selectedItem.title === "string" ? selectedItem.title : "") ||
      (typeof selectedItem.name === "string" ? selectedItem.name : "") ||
      (typeof selectedItem.heading === "string" ? selectedItem.heading : "") ||
      (typeof selectedItem.label === "string" ? selectedItem.label : "") ||
      `${itemName} #${selectedItem.id}`;

    // Find image preview
    let imgPreview: string | undefined = undefined;
    for (const k of ["imageUrl", "image", "thumbnail", "photo", "bannerUrl", "url"]) {
      const val = selectedItem[k];
      if (typeof val === "string" && (val.startsWith("/") || val.startsWith("http"))) {
        imgPreview = val;
        break;
      }
    }

    // Find external / video link
    let extLink: { label: string; url: string } | undefined = undefined;
    if (typeof selectedItem.videoUrl === "string" && selectedItem.videoUrl.trim()) {
      extLink = { label: "Watch Video", url: selectedItem.videoUrl };
    } else if (typeof selectedItem.link === "string" && selectedItem.link.trim()) {
      extLink = { label: "Open Link", url: selectedItem.link };
    }

    // Message or description body
    let messageContent: string | undefined = undefined;
    for (const mk of ["description", "content", "message", "body", "details", "notes"]) {
      const mval = selectedItem[mk];
      if (typeof mval === "string" && mval.trim()) {
        messageContent = mval;
        break;
      }
    }

    const itemTimestamp = selectedItem.createdAt
      ? formatAdminDate(selectedItem.createdAt)
      : undefined;

    const drawerFields: AdminDrawerField[] = [];

    columns.forEach((col) => {
      const val = selectedItem[col.key];
      // Skip image column if displayed as media preview
      if (col.kind === "image") return;

      const formattedVal =
        col.render
          ? col.render(selectedItem)
          : col.kind === "status"
          ? (val !== false ? "Active" : "Inactive")
          : col.key === "createdAt" || col.key === "updatedAt"
          ? formatAdminDate(val)
          : val !== null && val !== undefined && val !== ""
          ? String(val)
          : "—";

      drawerFields.push({
        label: col.label,
        value: formattedVal,
        fullWidth:
          col.key.toLowerCase().includes("url") ||
          col.key.toLowerCase().includes("link") ||
          col.key.toLowerCase().includes("title") ||
          col.key.toLowerCase().includes("slug"),
      });
    });

    // Also include any other fields in fields array not already displayed
    const alreadyMapped = new Set(columns.map((c) => c.key));
    alreadyMapped.add("id");
    alreadyMapped.add("description");
    alreadyMapped.add("content");
    alreadyMapped.add("message");
    alreadyMapped.add("body");
    alreadyMapped.add("updatedAt");
    alreadyMapped.add("imageUrl");
    alreadyMapped.add("image");
    alreadyMapped.add("videoUrl");

    fields.forEach((f) => {
      if (!alreadyMapped.has(f.name) && selectedItem[f.name] !== undefined && selectedItem[f.name] !== null) {
        drawerFields.push({
          label: f.label,
          value: String(selectedItem[f.name]),
          fullWidth: f.full,
        });
      }
    });

    return {
      title: itemTitle,
      timestamp: itemTimestamp,
      imagePreview: imgPreview,
      externalLink: extLink,
      message: messageContent
        ? {
            title: `${itemName} Details / Body`,
            content: messageContent,
          }
        : undefined,
      fields: drawerFields,
    };
  }, [selectedItem, columns, fields, itemName]);

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Content & media"
        title={title}
        description={description}
      />

      <div className="admin-toolbar">
        <div className="admin-search-box">
          <Search size={17} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={`Search ${title.toLowerCase()}`}
            aria-label={`Search ${title}`}
          />
        </div>
        <div className="admin-toolbar-actions">
          {historyType && isSuperAdmin && (
            <RevisionHistoryButton
              resourceType={historyType}
              itemName={itemName}
              onRestored={async () => {
                await loadItems();
                toast.success(`${itemName} restored.`);
              }}
            />
          )}
          {headerAction}
          {isSuperAdmin && (
            <button className="admin-button primary" type="button" onClick={openCreate}>
              <Plus size={17} />
              Add New Record
            </button>
          )}
          <button className="admin-button secondary" type="button" onClick={exportItems}>
            <Download size={17} /> Export CSV
          </button>
        </div>
      </div>

      {error && !modalOpen && (
        <AdminNotice>{error}</AdminNotice>
      )}

      <section className="admin-card">
        <header className="admin-card-header">
          <div>
            <h2>{title}</h2>
            <p>
              {displayedItems.length} {displayedItems.length === 1 ? "item" : "items"} in total
            </p>
          </div>
        </header>

        {loading ? (
          <AdminTableSkeleton
            rows={5}
            columns={columns.length + 1}
            label="Loading content"
          />
        ) : displayedItems.length === 0 ? (
          <AdminEmptyState
            title={`No ${title.toLowerCase()} yet`}
            message={`Add the first ${itemName.toLowerCase()} to get started.`}
          />
        ) : (
          <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((column) => {
                    const sortable = column.sortable ?? ["orderIndex", "date", "createdAt", "updatedAt", "title", "name", "status", "isActive"].includes(column.key);
                    const active = sort.key === column.key ? sort.direction : null;
                    return (
                      <th key={column.key} aria-sort={active ? (active === "asc" ? "ascending" : "descending") : "none"}>
                        {sortable ? (
                          <button
                            type="button"
                            className="admin-table-sort"
                            onClick={() => setSort((current) => current.key !== column.key
                              ? { key: column.key, direction: "asc" }
                              : { key: column.key, direction: current.direction === "asc" ? "desc" : current.direction === "desc" ? null : "asc" })}
                            aria-label={`Sort by ${column.label}`}
                          >
                            {column.label}
                            {active === "asc" ? <ArrowUp size={13} aria-hidden="true" /> : active === "desc" ? <ArrowDown size={13} aria-hidden="true" /> : <ArrowUpDown size={13} aria-hidden="true" />}
                          </button>
                        ) : column.label}
                      </th>
                    );
                  })}
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`is-clickable ${selectedItem?.id === item.id ? "is-selected" : ""}`}
                    onClick={() => setSelectedItem(item)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedItem(item);
                      }
                    }}
                    role="button"
                    aria-label={`View details for ${item.title || item.name || itemName}`}
                  >
                    {columns.map((column) => {
                      const value = item[column.key];
                      return (
                        <td key={column.key}>
                          {column.render ? (
                            column.render(item)
                          ) : column.kind === "image" &&
                            typeof value === "string" ? (
                            // Dynamic CMS URLs are validated by the API.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={value}
                              alt=""
                              className={`admin-thumbnail ${
                                column.roundImage ? "round" : ""
                              }`}
                            />
                          ) : column.kind === "status" ? (
                            <AdminStatusBadge active={value !== false} />
                          ) : ["title", "name", "altText", "text"].includes(column.key) ? (
                            <div className="admin-table-stack">
                              <span className="admin-table-title">{String(value ?? "—")}</span>
                              {typeof item.excerpt === "string" ? <span className="admin-table-subtitle">{item.excerpt}</span> : typeof item.category === "string" ? <span className="admin-table-subtitle">{item.category}</span> : null}
                            </div>
                          ) : (
                            String(value ?? "—")
                          )}
                        </td>
                      );
                    })}
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="admin-row-actions">
                        <button
                          className="admin-row-action"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(item);
                          }}
                          aria-label={`Edit ${itemName}`}
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        {isSuperAdmin && (
                          <button
                            className="admin-row-action danger"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleDelete(item);
                            }}
                            aria-label={`Delete ${itemName}`}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-mobile-record-list" aria-label={`${title} mobile list`}>
            {pageItems.map((item) => {
              const summaryColumns = columns.filter((column) => column.kind !== "image").slice(0, 3);
              return (
                <article
                  key={item.id}
                  className={`admin-mobile-record ${selectedItem?.id === item.id ? "is-selected" : ""}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="admin-mobile-record-heading">
                    <strong>{String(item.title || item.name || item.heading || item.label || `${itemName} #${item.id}`)}</strong>
                    <span>#{item.id}</span>
                  </div>
                  <div className="admin-mobile-record-details">
                    {summaryColumns.map((column) => {
                      const value = item[column.key];
                      return (
                        <div key={column.key}>
                          <span>{column.label}</span>
                          <b>{column.render ? column.render(item) : column.kind === "status" ? (value !== false ? "Active" : "Inactive") : column.key.endsWith("At") ? formatAdminDate(value) : String(value ?? "—")}</b>
                        </div>
                      );
                    })}
                  </div>
                  <span className="admin-mobile-record-hint">Tap to view all details</span>
                </article>
              );
            })}
          </div>
          </>
        )}
        {!loading && displayedItems.length > 0 && (
          <footer className="admin-card-footer admin-pagination-footer">
            <label className="admin-page-size-control">
              <span>Rows per page</span>
              <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value) as 10 | 25 | 50)} aria-label="Rows per page">
                <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
              </select>
            </label>
            <span>Page {page} of {pageCount}</span>
            <div className="admin-pagination-actions">
              <button className="admin-button secondary" type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft size={16} /> Previous</button>
              <button className="admin-button secondary" type="button" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Next <ChevronRight size={16} /></button>
            </div>
          </footer>
        )}
      </section>

      {/* Slide-over detail drawer for selected content item */}
      {selectedItem && drawerData && (
        <AdminDetailDrawer
          open={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          recordId={selectedItem.id}
          badge={{ label: itemName, variant: "content" }}
          title={drawerData.title}
          timestamp={drawerData.timestamp}
          imagePreview={drawerData.imagePreview}
          externalLink={drawerData.externalLink}
          fields={drawerData.fields}
          message={drawerData.message}
          onEdit={() => openEdit(selectedItem)}
          onDelete={
            isSuperAdmin
              ? () => {
                  void handleDelete(selectedItem);
                }
              : undefined
          }
          editLabel={`Edit ${itemName}`}
          deleteLabel={`Delete ${itemName}`}
        />
      )}

      <AdminModal
        title={`${editing ? "Edit" : "Add"} ${itemName.toLowerCase()}`}
        open={modalOpen}
        onClose={closeModal}
      >
        {error && (
          <AdminNotice>{error}</AdminNotice>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            {fields.map((field) => (
              <div
                className={`admin-field ${field.full ? "full" : ""}`}
                key={field.name}
              >
                {field.kind === "checkbox" ? (
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={Boolean(values[field.name])}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.checked,
                        }))
                      }
                    />
                    <span>
                      {field.label}
                      {field.help && <small>{field.help}</small>}
                    </span>
                  </label>
                ) : (
                  <>
                    <label htmlFor={`admin-${resource}-${field.name}`}>
                      {field.label}
                    </label>
                    {field.kind === "textarea" ? (
                      <textarea
                        id={`admin-${resource}-${field.name}`}
                        value={String(values[field.name] ?? "")}
                        onChange={(event) =>
                          setValues((current) => ({
                            ...current,
                            [field.name]: event.target.value,
                          }))
                        }
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    ) : field.kind === "select" ? (
                      <select
                        id={`admin-${resource}-${field.name}`}
                        value={String(values[field.name] ?? "")}
                        onChange={(event) =>
                          setValues((current) => ({
                            ...current,
                            [field.name]: event.target.value,
                          }))
                        }
                        required={field.required}
                      >
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.kind === "image" ? (
                      <>
                        <input
                          id={`admin-${resource}-${field.name}`}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            setImageFile(file);
                            if (file) setImagePreview(URL.createObjectURL(file));
                          }}
                          required={field.required && !imagePreview}
                        />
                        {imagePreview && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="admin-image-preview"
                          />
                        )}
                      </>
                    ) : field.kind === "video-url" ? (
                      <div className="admin-video-url-field">
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "normal", color: "var(--admin-muted)" }}>Option A: Upload MP4 Video</label>
                          <input
                            id={`admin-${resource}-${field.name}-file`}
                            type="file"
                            accept="video/mp4,video/webm"
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null;
                              setVideoFile(file);
                              if (file) {
                                // Clear external URL if file is chosen
                                setValues((current) => ({
                                  ...current,
                                  [field.name]: "",
                                }));
                              }
                            }}
                          />
                          {videoFile && <small style={{ color: "var(--admin-brand)" }}>Selected: {videoFile.name}</small>}
                        </div>
                        
                        <div style={{ margin: "8px 0", textAlign: "center", color: "var(--admin-border)", fontSize: "0.8rem", textTransform: "uppercase" }}>or</div>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "normal", color: "var(--admin-muted)" }}>Option B: Provide External URL</label>
                          <input
                            id={`admin-${resource}-${field.name}-url`}
                            type="url"
                            value={String(values[field.name] ?? "")}
                            onChange={(event) => {
                              setValues((current) => ({
                                ...current,
                                [field.name]: event.target.value,
                              }));
                              if (event.target.value) {
                                setVideoFile(null);
                                const fileInput = document.getElementById(`admin-${resource}-${field.name}-file`) as HTMLInputElement;
                                if (fileInput) fileInput.value = "";
                              }
                            }}
                            placeholder={field.placeholder || "https://youtube.com/..."}
                          />
                        </div>
                        {!videoFile && !values[field.name] && field.required && (
                          <small style={{ color: "var(--admin-danger)", marginTop: "4px", display: "block" }}>Please upload a video or provide a URL.</small>
                        )}
                      </div>
                    ) : (
                      <input
                        id={`admin-${resource}-${field.name}`}
                        type={
                          field.kind === "number"
                            ? "number"
                            : field.kind === "color"
                              ? "color"
                              : field.kind === "url"
                                ? "text"
                                : "text"
                        }
                        value={String(values[field.name] ?? "")}
                        min={field.min}
                        max={field.max}
                        onChange={(event) =>
                          setValues((current) => ({
                            ...current,
                            [field.name]:
                              field.kind === "number"
                                ? Number(event.target.value)
                                : event.target.value,
                          }))
                        }
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    )}
                    {field.help && <small>{field.help}</small>}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="admin-form-actions">
            <button
              className="admin-button secondary"
              type="button"
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </button>
            <button className="admin-button" type="submit" disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : `Add ${itemName}`}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
