import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import type { Toast, ToastType } from "../../hooks/useToast";

const STYLES: Record<ToastType, { bg: string; border: string; text: string; iconColor: string; Icon: typeof CheckCircle2 }> = {
  success: {
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-800",
    iconColor: "text-green-600",
    Icon: CheckCircle2,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-800",
    iconColor: "text-red-600",
    Icon: AlertTriangle,
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    text: "text-yellow-800",
    iconColor: "text-yellow-600",
    Icon: AlertCircle,
  },
  info: {
    bg: "bg-[#F2F7FC]",
    border: "border-[#BFDBF1]",
    text: "text-[#204590]",
    iconColor: "text-[#204590]",
    Icon: Info,
  },
};

interface ToastContainerProps {
  toasts: Toast[];
  dismiss(id: string): void;
}

export function ToastContainer({ toasts, dismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => {
        const s = STYLES[t.type];
        return (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-3 ${s.bg} border ${s.border} rounded-lg px-3 py-2 shadow-md`}
          >
            <s.Icon size={18} className={`${s.iconColor} flex-shrink-0 mt-0.5`} />
            <p className={`flex-1 text-sm ${s.text}`}>{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Cerrar notificación"
              className={`${s.text} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
