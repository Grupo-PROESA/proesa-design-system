import type { ReactNode } from "react";
import { PortalChip } from "./PortalChip";
import { HelpButton } from "../ui/HelpButton";
import { useAuth } from "../auth/AuthContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
  helpTopic?: string;
  rightSlot?: ReactNode;
  portalUrl?: string;
}

export function Header({ title, subtitle, helpTopic, rightSlot, portalUrl }: HeaderProps) {
  const { user } = useAuth();
  const initials = useInitials(user?.nombre ?? "");

  return (
    <header
      className="bg-white/80 border-b border-gray-200/60 sticky top-0 z-30 px-6 flex items-center justify-between flex-shrink-0"
      style={{
        height: 56,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <PortalChip portalUrl={portalUrl} />
        <span className="hidden sm:inline-block w-px h-4 bg-gray-200 flex-shrink-0" aria-hidden />
        <div className="flex items-baseline gap-2 min-w-0">
          <h1 className="text-base font-semibold text-gray-900 tracking-tight truncate">
            {title}
          </h1>
          {helpTopic && <HelpButton topicId={helpTopic} />}
          {subtitle && (
            <span className="hidden md:inline text-xs text-gray-400 truncate">{subtitle}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {rightSlot}
        {user && (
          <>
            <span className="hidden sm:inline-block w-px h-4 bg-gray-200" aria-hidden />
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs"
              aria-label={`Sesión de ${user.nombre}`}
            >
              <span
                className="w-7 h-7 rounded-full text-white inline-flex items-center justify-center text-[11px] font-semibold"
                style={{ background: "var(--proesa-brand-gradient)" }}
              >
                {initials}
              </span>
              <span className="hidden lg:inline text-gray-700 font-medium">
                {user.primerNombre}
              </span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}

function useInitials(fullName: string): string {
  if (!fullName) return "·";
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase() || "·";
}
