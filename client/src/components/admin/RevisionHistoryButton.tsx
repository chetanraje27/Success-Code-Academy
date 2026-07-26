"use client";

import { useCallback, useState } from "react";
import { History, RotateCcw } from "lucide-react";
import { adminApiFetch } from "@/lib/admin-api";
import AdminModal from "./AdminModal";

export type MediaResourceType = "banner" | "star" | "result" | "news" | "video";

type Revision = {
  id: number;
  resourceType: MediaResourceType;
  resourceId: number;
  action: "update" | "delete" | "restore";
  snapshot: Record<string, unknown>;
  createdAt: string;
};

const ACTION_LABELS: Record<Revision["action"], string> = {
  update: "Before an edit",
  delete: "Deleted version",
  restore: "Before a restore",
};

function revisionName(revision: Revision, itemName: string) {
  const { snapshot } = revision;
  if (typeof snapshot.altText === "string" && snapshot.altText) {
    return snapshot.altText;
  }
  if (typeof snapshot.name === "string" && snapshot.name) {
    return snapshot.name;
  }
  return `${itemName} #${revision.resourceId}`;
}

export default function RevisionHistoryButton({
  resourceType,
  itemName,
  resourceId,
  iconOnly = false,
  className = "admin-button secondary",
  onRestored,
}: {
  resourceType: MediaResourceType;
  itemName: string;
  resourceId?: number;
  iconOnly?: boolean;
  className?: string;
  onRestored: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const suffix = resourceId ? `/${resourceId}` : "";
      const response = await adminApiFetch<Revision[]>(
        `history/${resourceType}${suffix}`,
      );
      setRevisions(response.data);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to load history.",
      );
    } finally {
      setLoading(false);
    }
  }, [resourceId, resourceType]);

  async function showHistory() {
    setOpen(true);
    await loadHistory();
  }

  async function restore(revision: Revision) {
    const label = revisionName(revision, itemName);
    if (
      !window.confirm(
        `Restore "${label}" to this saved version? The current version will stay in history.`,
      )
    ) {
      return;
    }

    setRestoringId(revision.id);
    setError("");
    try {
      await adminApiFetch(
        `history/${resourceType}/${revision.resourceId}/${revision.id}/restore`,
        { method: "POST" },
      );
      await onRestored();
      await loadHistory();
      window.dispatchEvent(new Event("admin-content-changed"));
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to restore version.",
      );
    } finally {
      setRestoringId(null);
    }
  }

  return (
    <>
      <button
        className={className}
        type="button"
        onClick={() => void showHistory()}
        aria-label={iconOnly ? `View ${itemName} history` : undefined}
        title={iconOnly ? "History" : undefined}
      >
        <History size={iconOnly ? 15 : 17} />
        {!iconOnly && "History"}
      </button>

      <AdminModal
        title={`${itemName} history`}
        open={open}
        onClose={() => {
          if (!restoringId) setOpen(false);
        }}
        width={720}
      >
        <p className="admin-history-intro">
          Restore any saved version below. Your current version is saved first,
          so you can safely undo a restore.
        </p>

        {error && <div className="sca-admin-error">{error}</div>}

        {loading ? (
          <div className="admin-history-empty">Loading history…</div>
        ) : revisions.length === 0 ? (
          <div className="admin-history-empty">
            No earlier versions yet. History appears after the first edit or
            deletion.
          </div>
        ) : (
          <div className="admin-history-list">
            {revisions.map((revision) => {
              const image =
                typeof revision.snapshot.image === "string"
                  ? revision.snapshot.image
                  : "";
              return (
                <article className="admin-history-item" key={revision.id}>
                  {image ? (
                    // CMS image locations are validated by the API.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="" className="admin-history-image" />
                  ) : (
                    <div className="admin-history-image placeholder" />
                  )}
                  <div className="admin-history-copy">
                    <strong>{revisionName(revision, itemName)}</strong>
                    <span>
                      {ACTION_LABELS[revision.action]} ·{" "}
                      {new Intl.DateTimeFormat(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(revision.createdAt))}
                    </span>
                  </div>
                  <button
                    className="admin-button secondary compact"
                    type="button"
                    disabled={restoringId !== null}
                    onClick={() => void restore(revision)}
                  >
                    <RotateCcw size={15} />
                    {restoringId === revision.id ? "Restoring…" : "Restore"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </AdminModal>
    </>
  );
}
