"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  adminApiFetch,
  AdminApiError,
  uploadAdminImage,
} from "@/lib/admin-api";
import AdminModal from "./AdminModal";
import {
  AdminEmptyState,
  AdminLoadingState,
  AdminNotice,
  AdminPageHeader,
  AdminStatusBadge,
} from "./AdminUi";

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
    | "url";
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
}: {
  title: string;
  description: string;
  itemName: string;
  resource: string;
  fields: AdminContentField[];
  columns: AdminContentColumn[];
  uploadType?: "banner" | "star" | "result";
}) {
  const [items, setItems] = useState<ResourceItem[]>([]);
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

  const imageField = useMemo(
    () => fields.find((field) => field.kind === "image"),
    [fields],
  );

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
    setValues(initialValues(fields));
    setImageFile(null);
    setImagePreview("");
    setError("");
    setModalOpen(true);
  }

  function openEdit(item: ResourceItem) {
    const next = fields.reduce<Record<string, FieldValue>>((result, field) => {
      result[field.name] = valueFromItem(item, field);
      return result;
    }, {});
    setEditing(item);
    setValues(next);
    setImageFile(null);
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
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;

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

      const url = editing ? `${resource}/${editing.id}` : resource;
      await adminApiFetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setModalOpen(false);
      setEditing(null);
      setImageFile(null);
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
        action={
          <button className="admin-button" type="button" onClick={openCreate}>
            <Plus size={17} />
            Add {itemName.toLowerCase()}
          </button>
        }
      />

      {error && !modalOpen && (
        <AdminNotice>{error}</AdminNotice>
      )}

      <section className="admin-card">
        <header className="admin-card-header">
          <div>
            <h2>{title}</h2>
            <p>
              {items.length} {items.length === 1 ? "item" : "items"} in total
            </p>
          </div>
        </header>

        {loading ? (
          <AdminLoadingState label="Loading content…" />
        ) : items.length === 0 ? (
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
                {items.map((item) => (
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
                        <button
                          className="admin-row-action danger"
                          type="button"
                          onClick={() => void handleDelete(item)}
                          aria-label={`Delete ${itemName}`}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
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
                            alt="Selected image preview"
                            className="admin-image-preview"
                          />
                        )}
                      </>
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
