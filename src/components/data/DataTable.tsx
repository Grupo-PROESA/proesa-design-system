import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell(row: T): ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey(row: T, index: number): string;
  emptyMessage?: string;
  onRowClick?(row: T): void;
  stickyHeader?: boolean;
  totalRow?: ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "No hay datos en este filtro.",
  onRowClick,
  stickyHeader = false,
  totalRow,
}: DataTableProps<T>) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead
          className={`bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider ${
            stickyHeader ? "sticky top-0 z-10" : ""
          }`}
        >
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-4 py-2 ${
                  c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"
                } ${c.headerClassName ?? ""}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-sm text-gray-500 py-8 text-center">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={rowKey(row, i)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-4 py-2 align-top text-gray-900 ${
                      c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""
                    } ${c.className ?? ""}`}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        {totalRow && (
          <tfoot className="bg-gray-50 font-semibold border-t-2 border-gray-300">
            <tr>{totalRow}</tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
