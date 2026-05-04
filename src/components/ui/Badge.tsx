import type { ReactNode } from "react";

export type BadgeVariant = "default" | "success" | "error" | "warning" | "info" | "neutral";
export type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  default: "bg-[#E3EEF8] text-[#204590]",
  success: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-[#E3EEF8] text-[#204590]",
  neutral: "bg-gray-100 text-gray-700",
};

const SIZE_CLASS: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({ children, variant = "neutral", size = "sm", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}>
      {children}
    </span>
  );
}
