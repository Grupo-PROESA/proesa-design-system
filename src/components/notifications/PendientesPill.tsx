import { ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PendientesPillProps {
  count: number;
  label?: string;
  to?: string;
}

export function PendientesPill({ count, label = "por autorizar", to = "/pendientes" }: PendientesPillProps) {
  const navigate = useNavigate();
  const has = count > 0;
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      title={has ? `${count} pendiente(s) esperan tu decisión` : "No tienes pendientes"}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
        has
          ? "bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200"
          : "text-gray-400 hover:bg-gray-50 border-transparent"
      }`}
    >
      <ClipboardCheck size={14} className={has ? "text-amber-600" : ""} />
      {has ? (
        <span>
          <span className="tabular-nums font-semibold">{count}</span> {label}
        </span>
      ) : (
        <span className="hidden sm:inline">Sin pendientes</span>
      )}
      {has && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
      )}
    </button>
  );
}
