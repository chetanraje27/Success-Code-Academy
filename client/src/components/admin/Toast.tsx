"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import { ConfirmDialogProvider } from "./ConfirmDialog";

type ToastTone = "success" | "error" | "info";

type ToastItem = {
  id: number;
  tone: ToastTone;
  message: string;
};

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const TONE_ICON: Record<ToastTone, typeof Info> = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
};

/** Auto-dismiss after this many ms; errors stay a little longer. */
const TONE_DURATION: Record<ToastTone, number> = {
  success: 3200,
  info: 3600,
  error: 5200,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, message: string) => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-3), { id, tone, message }]);
      window.setTimeout(() => dismiss(id), TONE_DURATION[tone]);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push("success", message),
      error: (message) => push("error", message),
      info: (message) => push("info", message),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      <ConfirmDialogProvider>{children}</ConfirmDialogProvider>

      <div className="admin-toast-viewport" aria-live="polite" role="status">
        {toasts.map((toast) => {
          const Icon = TONE_ICON[toast.tone];
          return (
            <div
              className={`admin-toast admin-toast-${toast.tone}`}
              key={toast.id}
            >
              <span className="admin-toast-icon" aria-hidden="true">
                <Icon size={16} />
              </span>
              <p>{toast.message}</p>
              <button
                type="button"
                className="admin-toast-close"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) {
    throw new Error("useToast must be used inside <ToastProvider>.");
  }
  return api;
}
