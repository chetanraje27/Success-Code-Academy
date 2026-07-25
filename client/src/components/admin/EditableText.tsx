"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useEditModeOptional } from "./EditModeContext";
import {
  type ContentKind,
  type ContentScope,
  useLiveContent,
} from "./LiveContentContext";
import { LiveContentDialog } from "./LiveContentDialog";

type EditableTextProps = {
  contentKey: string;
  label: string;
  children: string;
  kind?: ContentKind;
  scope?: ContentScope;
  showInlineControls?: boolean;
};

export function EditableText({
  contentKey,
  label,
  children,
  kind = "text",
  scope = "page",
  showInlineControls = true,
}: EditableTextProps) {
  const { editMode } = useEditModeOptional();
  const { getContent, hasOverride, saveContent, resetContent } =
    useLiveContent();
  const [open, setOpen] = useState(false);
  const value = getContent(contentKey, children, scope);
  const customized = hasOverride(contentKey, scope);

  if (!editMode) {
    return <>{value}</>;
  }

  return (
    <>
      <span
        className={`live-editable-text${customized ? " is-customized" : ""}`}
        data-live-content-key={contentKey}
        title={`Click to edit ${label}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
      >
        <span className="live-editable-value">{value}</span>
        {showInlineControls && (
          <span className="live-editable-controls" aria-label={`${label} controls`}>
            <button
              type="button"
              className="live-edit-icon"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setOpen(true);
              }}
              title={`Edit ${label}`}
              aria-label={`Edit ${label}`}
            >
              <Pencil size={13} />
            </button>
            {customized && (
              <button
                type="button"
                className="live-edit-icon danger"
                onClick={async (event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (
                    window.confirm(
                      `Restore “${label}” to the original website text?`,
                    )
                  ) {
                    await resetContent(contentKey, scope);
                  }
                }}
                title={`Restore original ${label}`}
                aria-label={`Restore original ${label}`}
              >
                <Trash2 size={13} />
              </button>
            )}
          </span>
        )}
      </span>
      {open && (
        <LiveContentDialog
          open
          label={label}
          value={value}
          defaultValue={children}
          kind={kind}
          customized={customized}
          onClose={() => setOpen(false)}
          onSave={(nextValue) =>
            saveContent(contentKey, nextValue, kind, scope)
          }
          onReset={() => resetContent(contentKey, scope)}
        />
      )}
    </>
  );
}
