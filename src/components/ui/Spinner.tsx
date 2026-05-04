interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 16, className = "" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={`inline-block animate-spin rounded-full border-2 border-gray-200 ${className}`}
      style={{
        width: size,
        height: size,
        borderTopColor: "var(--proesa-navy-700)",
      }}
    />
  );
}
