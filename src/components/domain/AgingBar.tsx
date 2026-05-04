import { formatMoneyMx } from "../../utils/money";

export interface AgingBucket {
  key: string;
  label: string;
  amount: number;
  color: string;
}

interface AgingBarProps {
  buckets: AgingBucket[];
  total: number;
  compact?: boolean;
}

export function AgingBar({ buckets, total, compact = false }: AgingBarProps) {
  if (!total) return null;
  return (
    <div className={compact ? "space-y-1.5" : "space-y-3"}>
      <div className={`flex ${compact ? "h-1.5" : "h-3"} rounded-full overflow-hidden bg-gray-100`}>
        {buckets.map((b) => {
          const pct = (b.amount / total) * 100;
          if (pct <= 0) return null;
          return (
            <div
              key={b.key}
              className={`${b.color} transition-all`}
              style={{ width: `${pct}%` }}
              title={`${b.label}: ${formatMoneyMx(b.amount)} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      {!compact && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
          {buckets.map((b) => (
            <div key={b.key} className="inline-flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${b.color} flex-shrink-0`} />
              <span className="text-gray-500">{b.label}</span>
              <span className="text-gray-900 font-medium tabular-nums">
                {formatMoneyMx(b.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
