import type { ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  helpTopic?: string;
  actions?: ReactNode;
}

export function CardHeader({ title, subtitle, helpTopic, actions }: CardHeaderProps) {
  return (
    <div className="flex justify-between items-start gap-4 p-5 border-b border-gray-100">
      <div className="min-w-0 flex items-start gap-2">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {helpTopic && (
          <Link
            to={`/ayuda/${helpTopic}`}
            aria-label="Ver ayuda"
            className="w-6 h-6 rounded-full inline-flex items-center justify-center text-gray-500 transition-colors flex-shrink-0 hover:bg-gray-50"
            style={{ marginTop: 1 }}
          >
            <HelpCircle size={16} />
          </Link>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = "" }: CardBodyProps) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
