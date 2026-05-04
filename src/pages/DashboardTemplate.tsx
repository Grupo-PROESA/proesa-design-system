import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Card, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

interface DashboardTemplateProps {
  primerNombre: string;
  saludoExtra?: string;
  roles: string[];
  helpUrl?: string;
  kpis?: ReactNode[];
  estadoSistema?: ReactNode;
  acciones?: ReactNode[];
  extra?: ReactNode;
}

const eyebrowClass = "text-[11px] uppercase tracking-wider font-semibold text-gray-500";

export function DashboardTemplate({
  primerNombre,
  saludoExtra,
  roles,
  helpUrl = "/ayuda",
  kpis,
  estadoSistema,
  acciones,
  extra,
}: DashboardTemplateProps) {
  return (
    <div className="max-w-5xl flex flex-col gap-5">
      <Card>
        <CardBody className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Hola, {primerNombre} <span aria-hidden>👋</span>
            </h2>
            {saludoExtra && <p className="text-sm text-gray-500 mt-1">{saludoExtra}</p>}
            {roles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {roles.map((r) => (
                  <Badge key={r} variant="neutral">
                    {r}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Link
            to={helpUrl}
            className="text-xs text-gray-500 hover:text-[#204590] inline-flex items-center gap-1.5"
          >
            <HelpCircle size={14} /> Centro de ayuda
          </Link>
        </CardBody>
      </Card>

      {kpis && kpis.length > 0 && (
        <section>
          <h3 className={`${eyebrowClass} mb-3`}>Tu actividad</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {kpis}
          </div>
        </section>
      )}

      {estadoSistema && (
        <section>
          <h3 className={`${eyebrowClass} mb-3`}>Estado del sistema</h3>
          {estadoSistema}
        </section>
      )}

      {acciones && acciones.length > 0 && (
        <section>
          <h3 className={`${eyebrowClass} mb-3`}>Acciones rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {acciones}
          </div>
        </section>
      )}

      {extra}
    </div>
  );
}
