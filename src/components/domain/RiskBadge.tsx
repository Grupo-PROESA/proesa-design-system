export type RiskCategory = "verde" | "amarillo" | "naranja" | "rojo";
export type RiskBadgeSize = "sm" | "lg";

interface RiskStyle {
  bg: string;
  text: string;
  dot: string;
  defaultLabel: string;
}

const RISK_CONFIG: Record<RiskCategory, RiskStyle> = {
  verde:    { bg: "bg-green-100",  text: "text-green-800",  dot: "bg-green-500",  defaultLabel: "Al corriente" },
  amarillo: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500", defaultLabel: "Vigilar" },
  naranja:  { bg: "bg-orange-100", text: "text-orange-800", dot: "bg-orange-500", defaultLabel: "Riesgo" },
  rojo:     { bg: "bg-red-100",    text: "text-red-800",    dot: "bg-red-500",    defaultLabel: "Crítico" },
};

interface RiskBadgeProps {
  category: RiskCategory;
  score?: number;
  label?: string;
  size?: RiskBadgeSize;
}

export function RiskBadge({ category, score, label, size = "sm" }: RiskBadgeProps) {
  const c = RISK_CONFIG[category];
  const text = label ?? c.defaultLabel;

  if (size === "lg") {
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${c.bg}`}>
        <span className={`w-3 h-3 rounded-full ${c.dot}`} />
        <span className={`font-bold ${c.text}`}>
          {score != null ? `${score.toFixed(0)} · ${text}` : text}
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {text}
    </span>
  );
}
