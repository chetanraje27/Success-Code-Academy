"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, RotateCcw } from "lucide-react";

export type ConfirmDialogOptions = {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "destructive" | "default";
};

type ConfirmDialogProps = ConfirmDialogOptions & {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const FOCUSABLE =
  'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "destructive",
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => cancelRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onCancel();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) {
      event.preventDefault();
      dialogRef.current?.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open || typeof document === "undefined") return null;

  const Icon = tone === "destructive" ? AlertTriangle : RotateCcw;

  return createPortal(
    <div
      className="admin-confirm-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        ref={dialogRef}
        className={`admin-confirm-dialog is-${tone}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className="admin-confirm-content">
          <span className="admin-confirm-icon" aria-hidden="true">
            <Icon size={18} strokeWidth={2} />
          </span>
          <div className="admin-confirm-copy">
            <h2 id={titleId}>{title}</h2>
            <div id={messageId} className="admin-confirm-message">
              {message}
            </div>
          </div>
        </div>
        <div className="admin-confirm-actions">
          <button
            ref={cancelRef}
            className="admin-confirm-button is-cancel"
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="admin-confirm-button is-confirm"
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

type PendingConfirmation = ConfirmDialogOptions & {
  resolve: (confirmed: boolean) => void;
};

type ConfirmApi = (options: ConfirmDialogOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmApi | null>(null);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirmation | null>(null);
  const pendingRef = useRef<PendingConfirmation | null>(null);

  const confirm = useCallback<ConfirmApi>((options) => {
    return new Promise<boolean>((resolve) => {
      pendingRef.current?.resolve(false);
      const next = { ...options, resolve };
      pendingRef.current = next;
      setPending(next);
    });
  }, []);

  const settle = useCallback((confirmed: boolean) => {
    const current = pendingRef.current;
    pendingRef.current = null;
    setPending(null);
    current?.resolve(confirmed);
  }, []);

  useEffect(() => {
    return () => pendingRef.current?.resolve(false);
  }, []);

  const value = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <ConfirmDialog
        open={Boolean(pending)}
        title={pending?.title ?? "Confirm action"}
        message={pending?.message ?? "Are you sure?"}
        confirmLabel={pending?.confirmLabel}
        cancelLabel={pending?.cancelLabel}
        tone={pending?.tone}
        onCancel={() => settle(false)}
        onConfirm={() => settle(true)}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmApi {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error("useConfirm must be used inside <ConfirmDialogProvider>.");
  }
  return confirm;
}
