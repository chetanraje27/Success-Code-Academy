"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function AdminModal({
  title,
  open,
  onClose,
  children,
  width = 680,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      const initialFocus =
        dialog?.querySelector<HTMLElement>("[autofocus]") ||
        dialog?.querySelector<HTMLElement>(
          "input:not(:disabled), select:not(:disabled), textarea:not(:disabled)",
        ) ||
        dialog?.querySelector<HTMLElement>("button:not(:disabled), a[href]");
      (initialFocus || dialog)?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      previousFocus?.focus();
    };
  }, [open]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;

    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) {
      event.preventDefault();
      dialog.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="admin-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="admin-modal"
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <header className="admin-modal-header">
          <h2 id={titleId}>{title}</h2>
          <button
            className="admin-icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </header>
        <div className="admin-modal-body">{children}</div>
      </section>
    </div>,
    document.body,
  );
}
