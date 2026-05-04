import { Bell } from "lucide-react";

interface AlertPillProps {
  unreadTotal: number;
  unreadCritical: number;
  onClick(): void;
}

export function AlertPill({ unreadTotal, unreadCritical, onClick }: AlertPillProps) {
  const cls =
    unreadCritical > 0
      ? "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
      : unreadTotal > 0
      ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
      : "text-gray-500 hover:bg-gray-100 border-transparent";

  const title =
    unreadCritical > 0
      ? `${unreadCritical} alerta(s) crítica(s)`
      : unreadTotal > 0
      ? `${unreadTotal} alerta(s) sin leer`
      : "Sin alertas nuevas";

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${cls}`}
    >
      <Bell size={14} />
      {unreadTotal > 0 && <span className="tabular-nums">{unreadTotal}</span>}
      {unreadCritical > 0 && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
      )}
    </button>
  );
}
