import type { LucideIcon } from "lucide-react";

interface BrandMarkProps {
  icon: LucideIcon;
  size?: number;
  iconSize?: number;
  ariaLabel?: string;
}

export function BrandMark({ icon: Icon, size = 32, iconSize = 16, ariaLabel = "PROESA" }: BrandMarkProps) {
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className="inline-flex items-center justify-center text-white flex-shrink-0 rounded-lg"
      style={{
        width: size,
        height: size,
        background: "var(--proesa-brand-gradient)",
        boxShadow: "var(--proesa-shadow-brand)",
      }}
    >
      <Icon size={iconSize} />
    </span>
  );
}
