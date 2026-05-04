import { CheckCircle2, Loader2, AlertTriangle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDateTimeMx } from "../../utils/dates";

export type EstadoSistemaStatus = "ok" | "running" | "failed" | "never_run";

interface EstadoSistemaCardProps {
  status: EstadoSistemaStatus;
  lastRun?: Date | string | null;
  errorMessage?: string;
  configHint?: string;
  configHref?: string;
  to?: string;
  title?: string;
}

interface StatusStyle {
  bg: string;
  fg: string;
  Icon: typeof CheckCircle2;
  spin?: boolean;
}

const STATUS_STYLES: Record<EstadoSistemaStatus, StatusStyle> = {
  ok:        { bg: "bg-green-50", fg: "text-green-600", Icon: CheckCircle2 },
  running:   { bg: "bg-[#F2F7FC]", fg: "text-[#204590]", Icon: Loader2, spin: true },
  failed:    { bg: "bg-red-50",   fg: "text-red-600",   Icon: AlertTriangle },
  never_run: { bg: "bg-gray-100", fg: "text-gray-500",  Icon: Clock },
};

export function EstadoSistemaCard({
  status,
  lastRun,
  errorMessage,
  configHint,
  configHref,
  to,
  title = "Sincronización",
}: EstadoSistemaCardProps) {
  const s = STATUS_STYLES[status];
  const Icon = s.Icon;

  const text =
    status === "ok" && lastRun
      ? `Última corrida: ${formatDateTimeMx(lastRun)} · OK`
      : status === "ok"
      ? "Última corrida exitosa"
      : status === "running"
      ? "Sincronizando ahora…"
      : status === "failed" && lastRun
      ? `Última corrida falló: ${formatDateTimeMx(lastRun)}.`
      : status === "failed"
      ? "Última corrida falló."
      : "Aún sin corridas registradas.";

  const inner = (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow flex items-start gap-3 w-full text-left`}>
      <span className={`w-9 h-9 rounded-lg inline-flex items-center justify-center flex-shrink-0 ${s.bg} ${s.fg}`}>
        <Icon size={18} className={s.spin ? "animate-spin" : undefined} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{title}</p>
        <p className="text-sm text-gray-900 mt-0.5">{text}</p>
        {status === "failed" && errorMessage && (
          <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
        )}
        {status === "never_run" && configHint && (
          <p className="text-[11px] text-amber-700 mt-1">{configHint}</p>
        )}
      </div>
    </div>
  );

  const href = to ?? configHref;
  if (href) {
    return <Link to={href} className="block">{inner}</Link>;
  }
  return inner;
}
