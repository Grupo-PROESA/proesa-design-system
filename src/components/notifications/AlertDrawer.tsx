import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { FilterPills } from "../data/FilterPills";
import { AlertaCard, type Alerta } from "./AlertaCard";

type AlertFilter = "todas" | "no-leidas" | "criticas";

interface AlertDrawerProps {
  open: boolean;
  onClose(): void;
  alertas: Alerta[];
  onMarkAllRead?(): void;
  onAlertClick?(alerta: Alerta): void;
}

export function AlertDrawer({ open, onClose, alertas, onMarkAllRead, onAlertClick }: AlertDrawerProps) {
  const [filter, setFilter] = useState<AlertFilter>("todas");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(
    () =>
      alertas.filter((a) => {
        if (filter === "no-leidas") return !a.leida;
        if (filter === "criticas") return a.severidad === "critical";
        return true;
      }),
    [alertas, filter],
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className="fixed top-0 right-0 h-full w-96 max-w-full bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col transition-transform duration-200"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
        aria-label="Alertas"
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">Alertas</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <FilterPills<AlertFilter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "todas", label: "Todas" },
              { value: "no-leidas", label: "No leídas" },
              { value: "criticas", label: "Críticas" },
            ]}
          />
        </div>
        <div className="flex-1 overflow-auto p-4 flex flex-col gap-2">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-sm text-gray-500">
              No hay alertas en este filtro.
            </p>
          ) : (
            filtered.map((a) => <AlertaCard key={a.id} alerta={a} onClick={onAlertClick} />)
          )}
        </div>
        {onMarkAllRead && (
          <div className="p-3 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={onMarkAllRead}
              className="w-full text-xs text-gray-500 hover:text-gray-700 py-2 transition-colors"
            >
              Marcar todas como leídas
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
