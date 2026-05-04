import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export type ModalSize = "sm" | "md" | "lg";

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

interface ModalProps {
  open: boolean;
  onClose(): void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
}

export function Modal({ open, onClose, title, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`bg-white rounded-xl shadow-xl w-full ${SIZE_CLASS[size]} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-auto flex-1">{children}</div>
        {footer && (
          <div className="p-5 border-t border-gray-100 flex justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  open: boolean;
  onClose(): void;
  onConfirm(): void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{message}</p>
    </Modal>
  );
}
