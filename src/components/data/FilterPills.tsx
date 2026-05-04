interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterPillsProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange(next: T): void;
  className?: string;
}

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: FilterPillsProps<T>) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            type="button"
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              active ? "bg-[#F2F7FC] text-[#204590]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
