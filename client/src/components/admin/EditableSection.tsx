"use client";

import React from "react";
import { FaPen } from "react-icons/fa6";
import { useEditModeOptional } from "./EditModeContext";

type EditableSectionProps = {
  label: string;
  onEdit: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
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
      className={className}
      style={{
        ...style,
        position: style?.position || "relative",
        outline: "2px dashed rgba(37, 99, 235, 0.35)",
        outlineOffset: 2,
        borderRadius: 8,
      }}
    >
      {children}
      <button
        type="button"
        className="sca-edit-section-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit();
        }}
        title={`Edit ${label}`}
        aria-label={`Edit ${label}`}
      >
        <FaPen size={12} />
        <span>Edit {label}</span>
      </button>

      <style jsx global>{`
        .sca-edit-section-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 40;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 11px;
          border: none;
          border-radius: 999px;
          background: #2563eb;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
        }
        .sca-edit-section-btn:hover {
          background: #1d4ed8;
        }
      `}</style>
    </Tag>
  );
}
