import { formatMoneyMx } from "../../utils/money";

interface MoneyCellProps {
  amount: number;
  negative?: boolean;
  muted?: boolean;
  className?: string;
}

export function MoneyCell({ amount, negative = false, muted = false, className = "" }: MoneyCellProps) {
  const isZero = amount === 0;
  const isNegative = negative || amount < 0;

  const textClass =
    isZero || muted
      ? "text-gray-400"
      : isNegative
      ? "text-red-700"
      : "text-gray-900";

  const display = isNegative
    ? `(${formatMoneyMx(Math.abs(amount))})`
    : formatMoneyMx(amount);

  return (
    <span className={`font-mono tabular-nums text-sm ${textClass} ${className}`}>
      {display}
    </span>
  );
}
