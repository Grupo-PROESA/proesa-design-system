export function formatMoneyMx(amount: number | null | undefined, opts: { maxDigits?: number } = {}): string {
  const { maxDigits = 0 } = opts;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: maxDigits,
  }).format(amount ?? 0);
}

export function formatNumberMx(n: number | null | undefined): string {
  return new Intl.NumberFormat("es-MX").format(n ?? 0);
}

export function formatPercentMx(n: number | null | undefined, decimals = 1): string {
  return `${(n ?? 0).toFixed(decimals)}%`;
}
