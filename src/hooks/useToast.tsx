import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  durationMs?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  show(message: string, type?: ToastType, durationMs?: number): string;
  dismiss(id: string): void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message: string, type: ToastType = "info", durationMs = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, type, message, durationMs }]);
    if (durationMs > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, durationMs);
    }
    return id;
  }, []);

  const value = useMemo(() => ({ toasts, show, dismiss }), [toasts, show, dismiss]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>");
  }
  return ctx;
}
