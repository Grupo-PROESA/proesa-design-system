import { AlertTriangle, AlertCircle, Info, CheckCircle2, type LucideIcon } from "lucide-react";
import { formatRelative } from "../../utils/dates";

export type AlertSeveridad = "critical" | "warning" | "info" | "success";

export interface Alerta {
  id: string;
  severidad: AlertSeveridad;
  titulo: string;
  mensaje: string;
  contexto?: string;
  created_at: string | Date;
  leida: boolean;
}

interface SeverityStyle {
  borderL: string;
  chipBg: string;
  chipText: string;
  Icon: LucideIcon;
}

const SEVERITY_STYLES: Record<AlertSeveridad, SeverityStyle> = {
  critical: { borderL: "border-l-red-500",    chipBg: "bg-red-100",    chipText: "text-red-700",    Icon: AlertTriangle },
  warning:  { borderL: "border-l-orange-500", chipBg: "bg-orange-100", chipText: "text-orange-700", Icon: AlertCircle },
  info:     { borderL: "border-l-[#204590]",  chipBg: "bg-[#E3EEF8]",  chipText: "text-[#204590]",  Icon: Info },
  success:  { borderL: "border-l-green-500",  chipBg: "bg-green-100",  chipText: "text-green-700",  Icon: CheckCircle2 },
};

interface AlertaCardProps {
  alerta: Alerta;
  onClick?(alerta: Alerta): void;
}

export function AlertaCard({ alerta, onClick }: AlertaCardProps) {
  const s = SEVERITY_STYLES[alerta.severidad];
  const Icon = s.Icon;
  return (
    <button
      type="button"
      onClick={onClick ? () => onClick(alerta) : undefined}
      className={`w-full bg-white hover:bg-gray-50 border-l-4 ${s.borderL} border-y border-r border-gray-200 rounded-r-lg p-3 relative transition-colors text-left ${
        alerta.leida ? "opacity-60" : ""
      }`}
    >
      {!alerta.leida && (
        <span
          className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--proesa-teal-600)" }}
          aria-label="No leída"
        />
      )}
      <div className="flex items-start gap-3 pr-4">
        <span className={`w-7 h-7 rounded-md inline-flex items-center justify-center flex-shrink-0 ${s.chipBg} ${s.chipText}`}>
          <Icon size={14} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-snug">{alerta.titulo}</p>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{alerta.mensaje}</p>
          <div className="flex items-center justify-between mt-1.5 gap-2">
            {alerta.contexto && (
              <span className="text-[11px] text-gray-500 truncate">{alerta.contexto}</span>
            )}
            <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">
              {formatRelative(alerta.created_at)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
