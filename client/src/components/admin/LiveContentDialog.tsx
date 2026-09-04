"use client";

import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import AdminModal from "./AdminModal";
import type { ContentKind } from "./LiveContentContext";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";

type LiveContentDialogProps = {
  open: boolean;
  label: string;
  value: string;
  defaultValue: string;
  kind: ContentKind;
  customized: boolean;
  /**
   * Restoring the original text deletes the saved override, which the API
   * allows for super administrators only. Standard administrators can still
   * edit the text; they just cannot revert it.
   */
  canReset?: boolean;
  onClose: () => void;
  onSave: (value: string) => Promise<void>;
  onReset: () => Promise<void>;
};

export function LiveContentDialog({
  open,
  label,
  value,
  defaultValue,
  kind,
  customized,
  canReset = true,
  onClose,
  onSave,
  onReset,
}: LiveContentDialogProps) {
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const confirmAction = useConfirm();

  async function save() {
    setSaving(true);
    setError("");
    try {
      await onSave(draft);
      toast.success(`${label} updated.`);
      onClose();
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Unable to save.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!(await confirmAction({
      title: "Restore original text?",
      message: <>Your custom “{label}” text will be removed and the original website text will be shown.</>,
      confirmLabel: "Restore original",
      tone: "default",
    }))) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onReset();
      toast.success(`${label} restored to the original.`);
      setDraft(defaultValue);
      onClose();
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Unable to restore the original.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      title={`Edit ${label}`}
      open={open}
      onClose={onClose}
      width={640}
    >
      <div className="live-editor-dialog-copy">
        <p>
          Update the text exactly as visitors should see it. The original is
          always available through “Restore original”.
        </p>
      </div>
      {error && <div className="sca-admin-error">{error}</div>}
      <div className="admin-field full">
        <label htmlFor="live-content-value">{label}</label>
        {kind === "multiline" ? (
          <textarea
            id="live-content-value"
            rows={7}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={20_000}
            autoFocus
          />
        ) : (
          <input
            id="live-content-value"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={20_000}
            autoFocus
          />
        )}
        <small>{draft.length.toLocaleString()} characters</small>
      </div>
      <div className="admin-form-actions live-editor-dialog-actions">
        {customized && canReset && (
          <button
            className="admin-button danger"
            type="button"
            onClick={reset}
            disabled={saving}
          >
            <RotateCcw size={16} />
            Restore original
          </button>
        )}
        <button
          className="admin-button secondary"
          type="button"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          className="admin-button"
          type="button"
          onClick={save}
          disabled={saving || draft === value}
        >
          <Save size={16} />
          {saving ? "Saving…" : "Save live"}
        </button>
      </div>
    </AdminModal>
  );
}
