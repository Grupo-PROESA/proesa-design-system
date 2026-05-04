import { useEffect, useRef, useState } from "react";

interface Range {
  label: string;
  color: string;
}

interface HelpPopoverProps {
  title: string;
  description: string;
  formula?: string;
  ranges?: Range[];
}

export function HelpPopover({ title, description, formula, ranges }: HelpPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <span className="relative inline-block" ref={ref}>
      <button
        type="button"
        aria-label={`Ayuda: ${title}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="ml-1 w-4 h-4 inline-flex items-center justify-center rounded-full bg-gray-300 text-gray-600 text-[10px] font-bold hover:bg-gray-400 hover:text-white transition-colors leading-none align-middle"
      >
        i
      </button>
      {open && (
        <span className="absolute z-50 left-0 top-6 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-left block">
          <span className="font-semibold text-gray-900 text-sm mb-1 block">{title}</span>
          <span className="text-xs text-gray-600 mb-2 block leading-relaxed">{description}</span>
          {formula && (
            <span className="bg-gray-50 rounded p-2 mb-2 block">
              <span className="text-[10px] text-gray-400 uppercase font-medium mb-1 block tracking-wider">
                Fórmula
              </span>
              <span className="text-xs text-gray-800 font-mono block">{formula}</span>
            </span>
          )}
          {ranges && ranges.length > 0 && (
            <span className="block">
              <span className="text-[10px] text-gray-400 uppercase font-medium block tracking-wider mb-1">
                Interpretación
              </span>
              {ranges.map((r, i) => (
                <span key={i} className="flex items-center gap-2 text-xs mt-1">
                  <span className={`w-2 h-2 rounded-full ${r.color}`} />
                  <span className="text-gray-700">{r.label}</span>
                </span>
              ))}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
