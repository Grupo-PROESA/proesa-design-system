import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  type?: "button" | "submit" | "reset";
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "text-white shadow-sm",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
  danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
  outline: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  disabled,
  children,
  className = "",
  type = "button",
  onMouseEnter,
  onMouseLeave,
  style,
  ...rest
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      style={{
        ...(isPrimary ? { background: "var(--proesa-navy-700)" } : null),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (isPrimary && !disabled && !loading) {
          e.currentTarget.style.background = "var(--proesa-navy-800)";
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (isPrimary) {
          e.currentTarget.style.background = "var(--proesa-navy-700)";
        }
        onMouseLeave?.(e);
      }}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : leftIcon}
      {children}
    </button>
  );
}
