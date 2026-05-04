import { ChevronLeft } from "lucide-react";

interface PortalChipProps {
  portalUrl?: string;
  label?: string;
}

export function PortalChip({ portalUrl, label = "Portal" }: PortalChipProps) {
  const fromEnv = typeof import.meta !== "undefined" ? import.meta.env?.VITE_PORTAL_URL : undefined;
  const href = portalUrl ?? fromEnv ?? "https://portal.grupoproesa.mx:9443";

  return (
    <a href={href} title="Volver al Portal PROESA" className="portal-chip">
      <span className="portal-chip__avatar">P</span>
      <ChevronLeft size={12} className="portal-chip__back" />
      <span>{label}</span>
    </a>
  );
}
