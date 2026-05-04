import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatMoneyMx, formatNumberMx, formatPercentMx } from "../../utils/money";

export type KpiTone =
  | "gray"
  | "blue"
  | "blue-strong"
  | "green"
  | "green-strong"
  | "amber"
  | "amber-strong"
  | "red"
  | "red-strong";

export type KpiFormat = "number" | "currency" | "percent" | "custom";

interface ToneStyle {
  border: string;
  iconBg: string;
  iconText: string;
  valueText: string;
}

const TONES: Record<KpiTone, ToneStyle> = {
  gray:           { border: "border-gray-200",  iconBg: "bg-gray-50",      iconText: "text-gray-600",  valueText: "text-gray-900" },
  blue:           { border: "border-[#BFDBF1]", iconBg: "bg-[#F2F7FC]",    iconText: "text-[#204590]", valueText: "text-[#204590]" },
  "blue-strong":  { border: "border-[#8CC4EA]", iconBg: "bg-[#E3EEF8]",    iconText: "text-[#14275A]", valueText: "text-[#14275A]" },
  green:          { border: "border-green-200", iconBg: "bg-green-50",     iconText: "text-green-700", valueText: "text-green-700" },
  "green-strong": { border: "border-green-300", iconBg: "bg-green-100",    iconText: "text-green-800", valueText: "text-green-800" },
  amber:          { border: "border-amber-200", iconBg: "bg-amber-50",     iconText: "text-amber-700", valueText: "text-amber-700" },
  "amber-strong": { border: "border-amber-300", iconBg: "bg-amber-100",    iconText: "text-amber-800", valueText: "text-amber-800" },
  red:            { border: "border-red-200",   iconBg: "bg-red-50",       iconText: "text-red-700",   valueText: "text-red-700" },
  "red-strong":   { border: "border-red-300",   iconBg: "bg-red-100",      iconText: "text-red-800",   valueText: "text-red-800" },
};

interface KpiCardProps {
  label: string;
  value: number | string;
  format?: KpiFormat;
  tone?: KpiTone;
  icon?: ReactNode;
  hint?: string;
  delta?: number;
  deltaLabel?: string;
  deltaPositive?: "good" | "bad";
  to?: string;
  onClick?(): void;
}

export function KpiCard({
  label,
  value,
  format = "number",
  tone = "gray",
  icon,
  hint,
  delta,
  deltaLabel,
  deltaPositive = "good",
  to,
  onClick,
}: KpiCardProps) {
  const t = TONES[tone];
  const formattedValue =
    format === "currency" ? formatMoneyMx(typeof value === "number" ? value : Number(value)) :
    format === "percent" ? formatPercentMx(typeof value === "number" ? value : Number(value)) :
    format === "number" ? formatNumberMx(typeof value === "number" ? value : Number(value)) :
    String(value);

  let deltaColor = "text-gray-500";
  let DeltaIcon: typeof ArrowUp | null = null;
  if (delta != null) {
    const isUp = delta > 0;
    const isFavorable = (isUp && deltaPositive === "good") || (!isUp && deltaPositive === "bad");
    deltaColor = isFavorable ? "text-green-700" : "text-red-700";
    DeltaIcon = isUp ? ArrowUp : ArrowDown;
  }

  const inner = (
    <div
      className={`bg-white rounded-xl border ${t.border} shadow-sm p-4 hover:shadow-md transition-shadow text-left w-full block`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        {icon && (
          <span className={`w-7 h-7 rounded-md inline-flex items-center justify-center ${t.iconBg} ${t.iconText}`}>
            {icon}
          </span>
        )}
      </div>
      <div className={`text-2xl font-semibold tabular-nums leading-tight ${t.valueText}`}>
        {formattedValue}
      </div>
      {delta != null && DeltaIcon ? (
        <div className={`mt-1.5 flex items-center gap-1 text-xs ${deltaColor}`}>
          <DeltaIcon size={12} />
          <span className="tabular-nums font-medium">{Math.abs(delta).toFixed(1)}%</span>
          {deltaLabel && <span className="text-gray-500 font-normal">· {deltaLabel}</span>}
        </div>
      ) : hint ? (
        <p className="text-xs text-gray-500 mt-1.5">{hint}</p>
      ) : null}
    </div>
  );

  if (to) {
    return <Link to={to} className="block">{inner}</Link>;
  }
  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {inner}
      </button>
    );
  }
  return inner;
}
