import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatRelative, formatDateTimeMx } from "../../utils/dates";

interface SyncStatusProps {
  lastSync: Date | string | null | undefined;
  staleAfterMs?: number;
  to?: string;
}

export function SyncStatus({ lastSync, staleAfterMs = 24 * 60 * 60 * 1000, to = "/sync" }: SyncStatusProps) {
  const navigate = useNavigate();
  if (!lastSync) {
    return (
      <button
        type="button"
        onClick={() => navigate(to)}
        title="Sin sincronizaciones"
        className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Clock size={12} />
        <span className="hidden md:inline">Sin sincronizar</span>
      </button>
    );
  }

  const date = typeof lastSync === "string" ? new Date(lastSync) : lastSync;
  const stale = Date.now() - date.getTime() > staleAfterMs;

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      title={`Última sync: ${formatDateTimeMx(date)}`}
      className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
    >
      <Clock size={12} />
      <span className="hidden md:inline">Última sync:</span>
      <span className="font-medium tabular-nums">{formatRelative(date)}</span>
      {stale && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-label="Desactualizada" />}
    </button>
  );
}
