"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, Search } from "lucide-react";
import {
  adminApiFetch,
  AdminApiError,
  uploadAdminImage,
} from "@/lib/admin-api";
import AdminModal from "./AdminModal";
import { useAdminSession } from "./AdminSessionContext";
import {
  AdminEmptyState,
  AdminNotice,
  AdminPageHeader,
  AdminStatusBadge,
  AdminTableSkeleton,
} from "./AdminUi";
import RevisionHistoryButton, {
  type MediaResourceType,
} from "./RevisionHistoryButton";

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
    return filtered;
  }, [items, filterItems, searchTerm]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApiFetch<ResourceItem[]>(resource);
      setItems(response.data);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : `Unable to load ${title}.`,
      );
    } finally {
      setLoading(false);
    }
  }, [resource, title]);

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
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : `Unable to delete ${itemName}.`,
      );
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
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.fields.length > 0) {
        setError(
          caught.fields.map((field) => field.message).join(" "),
        );
      } else {
        setError(
          caught instanceof Error ? caught.message : `Unable to save ${itemName}.`,
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        title={title}
        description={description}
        action={headerAction}
      />

      <div className="admin-toolbar">
        <form className="admin-search-form" onSubmit={(e) => e.preventDefault()}>
          <div className="admin-search-box">
            <Search size={17} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${itemName.toLowerCase()}s...`}
              aria-label={`Search ${title}`}
            />
          </div>
          <button className="admin-button secondary" type="submit">
            Search
          </button>
        </form>
        <div style={{ display: 'flex', gap: '8px' }}>
          {historyType && isSuperAdmin && (
            <RevisionHistoryButton
              resourceType={historyType}
              itemName={itemName}
              onRestored={loadItems}
            />
          )}
          {isSuperAdmin && (
            <button className="admin-button primary" type="button" onClick={openCreate}>
              <Plus size={17} />
              Add New Record
            </button>
          )}
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
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {displayedItems.map((item) => (
                  <tr key={item.id}>
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
                          ) : (
                            String(value ?? "—")
                          )}
                        </td>
                      );
                    })}
                    <td>
                      <div className="admin-row-actions">
                        <button
                          className="admin-row-action"
                          type="button"
                          onClick={() => openEdit(item)}
                          aria-label={`Edit ${itemName}`}
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        {isSuperAdmin && (
                          <button
                            className="admin-row-action danger"
                            type="button"
                            onClick={() => void handleDelete(item)}
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
        )}
      </section>

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
