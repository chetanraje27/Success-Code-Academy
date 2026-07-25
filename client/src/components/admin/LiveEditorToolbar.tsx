"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, Gauge, Pencil, X } from "lucide-react";
import { useEditModeOptional } from "./EditModeContext";
import { useLiveContent } from "./LiveContentContext";

function pageName(pathname: string): string {
  if (pathname === "/") return "Home page";
  return pathname
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/-/g, " "))
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" · ");
}

export function LiveEditorToolbar() {
  const pathname = usePathname();
  const { isAdmin, editMode, setEditMode } = useEditModeOptional();
  const { loading, overrideCount } = useLiveContent();

  if (!isAdmin || !editMode) return null;

  return (
    <aside className="live-editor-toolbar" aria-label="Website editor toolbar">
      <div className="live-editor-toolbar-status">
        <span className="live-editor-toolbar-icon">
          <Pencil size={16} />
        </span>
        <span>
          <strong>Editing {pageName(pathname)}</strong>
          <small>
            {loading
              ? "Loading saved content…"
              : `${overrideCount} saved customization${overrideCount === 1 ? "" : "s"} in view`}
          </small>
        </span>
      </div>
      <div className="live-editor-toolbar-actions">
        <Link href="/admin" className="live-editor-toolbar-link">
          <Gauge size={15} />
          Dashboard
        </Link>
        <button
          type="button"
          className="live-editor-toolbar-link"
          onClick={() => setEditMode(false)}
        >
          <Eye size={15} />
          Preview
        </button>
        <button
          type="button"
          className="live-editor-toolbar-close"
          onClick={() => setEditMode(false)}
          aria-label="Exit website editing"
          title="Exit website editing"
        >
          <X size={17} />
        </button>
      </div>
    </aside>
  );
}
