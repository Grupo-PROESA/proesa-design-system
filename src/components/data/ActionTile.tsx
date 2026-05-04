import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ActionTileProps {
  label: string;
  icon: ReactNode;
  to?: string;
  onClick?(): void;
}

export function ActionTile({ label, icon, to, onClick }: ActionTileProps) {
  const inner = (
    <span className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 flex items-center gap-3 hover:border-[#BFDBF1] hover:bg-[#F2F7FC]/40 transition-colors text-left w-full">
      <span className="w-8 h-8 rounded-lg bg-[#F2F7FC] text-[#204590] inline-flex items-center justify-center flex-shrink-0">
        {icon}
      </span>
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </span>
  );

  if (to) {
    return <Link to={to} className="block">{inner}</Link>;
  }
  return (
    <button onClick={onClick} className="block w-full text-left">
      {inner}
    </button>
  );
}
