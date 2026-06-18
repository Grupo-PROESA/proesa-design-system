import { useMemo, useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { BrandMark } from "./BrandMark";
import type { NavSection } from "./nav.types";
import { useAuth } from "../auth/AuthContext";

interface SidebarProps {
  appName: string;
  brandIcon: LucideIcon;
  appVersion?: string;
  sections: NavSection[];
  defaultCollapsed?: boolean;
  footerExtra?: ReactNode;
}

export function Sidebar({
  appName,
  brandIcon,
  appVersion,
  sections,
  defaultCollapsed = false,
  footerExtra,
}: SidebarProps) {
  const { user, hasRole } = useAuth();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const visibleSections = useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => !item.roles || item.roles.some((r) => hasRole(r))),
        }))
        .filter((section) => section.items.length > 0),
    [sections, hasRole],
  );

  return (
    <aside
      className="flex flex-col flex-shrink-0 transition-all duration-300 relative z-30"
      style={{
        width: collapsed ? 64 : 240,
        background: "var(--proesa-navy-900)",
        height: "100%",
      }}
    >
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
        <BrandMark icon={brandIcon} />
        {!collapsed && (
          <div className="overflow-hidden min-w-0">
            <p className="text-white text-sm font-bold leading-tight truncate tracking-tight">
              {appName}
            </p>
            <p
              className="text-[11px] leading-tight"
              style={{ color: "var(--proesa-navy-300)", opacity: 0.7 }}
            >
              PROESA
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto" aria-label="Navegación principal">
        {visibleSections.map((section, sIdx) => (
          <div key={`${section.title ?? "root"}-${sIdx}`} className={sIdx > 0 ? "mt-3" : ""}>
            {sIdx > 0 && <div className="h-px bg-white/[0.06] mx-3 mb-2" />}
            {section.title && !collapsed && (
              <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        collapsed ? "justify-center" : ""
                      } ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                      }`
                    }
                    style={({ isActive }) =>
                      isActive
                        ? {
                            background: "var(--proesa-navy-700)",
                            boxShadow: "0 4px 8px -2px rgba(20,39,90,0.3)",
                          }
                        : undefined
                    }
                  >
                    <Icon size={18} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/[0.06]">
          {user && (
            <p className="text-slate-300 text-[11px] font-medium truncate">{user.nombre}</p>
          )}
          <p className="text-slate-500 text-[11px] mt-0.5">PROESA · {appName}</p>
          {appVersion && (
            <p className="text-slate-600 text-[10px] mt-0.5">v{appVersion}</p>
          )}
          {footerExtra}
        </div>
      )}

      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-10 bg-white border border-gray-200 rounded-r-md shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-40"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
