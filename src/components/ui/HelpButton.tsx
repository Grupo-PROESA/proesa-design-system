import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface HelpButtonProps {
  topicId: string;
  size?: number;
  className?: string;
}

export function HelpButton({ topicId, size = 14, className = "" }: HelpButtonProps) {
  return (
    <Link
      to={`/ayuda/${topicId}`}
      aria-label="Ver ayuda"
      className={`self-center w-5 h-5 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-[#204590] hover:bg-[#F2F7FC] transition-colors flex-shrink-0 ${className}`}
    >
      <HelpCircle size={size} />
    </Link>
  );
}
