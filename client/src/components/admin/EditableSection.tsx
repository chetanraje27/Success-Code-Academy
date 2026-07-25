"use client";

import type { CSSProperties, ReactNode } from "react";
import { Pencil } from "lucide-react";
import { useEditModeOptional } from "./EditModeContext";

type EditableSectionProps = {
  label: string;
  onEdit: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  controlOffsetTop?: number;
  /** When true, wrap children in relative container for overlay button */
  as?: "div" | "section";
};

/**
 * Wraps a public-site section. When Edit Site mode is on, shows a pencil control.
 * Invisible to non-admins and when edit mode is off.
 */
export default function EditableSection({
  label,
  onEdit,
  children,
  className,
  style,
  controlOffsetTop,
  as = "div",
}: EditableSectionProps) {
  const { editMode } = useEditModeOptional();
  const Tag = as;

  if (!editMode) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={[className, "sca-editable-section"].filter(Boolean).join(" ")}
      style={{
        ...style,
        position: style?.position || "relative",
      }}
    >
      {children}
      <button
        type="button"
        className="sca-edit-section-btn"
        style={controlOffsetTop === undefined ? undefined : { top: controlOffsetTop }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit();
        }}
        title={`Edit ${label}`}
        aria-label={`Edit ${label}`}
      >
        <Pencil size={14} />
        <span>Manage {label}</span>
      </button>
    </Tag>
  );
}
