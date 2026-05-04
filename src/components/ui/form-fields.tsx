import type { ReactNode } from "react";

export const INPUT_CLASS =
  "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#204590] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed";

interface FieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function Field({ label, htmlFor, children, hint, error, required }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-600 ml-0.5" aria-hidden>*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-700 mt-1">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-gray-400 mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
