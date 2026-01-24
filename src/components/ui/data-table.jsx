import * as React from "react"
import { cn } from "@/lib/utils"

// Minimal DataTable scaffold to standardize table rendering and empty state
export function DataTable({ columns, data = [], className, children, ...props }) {
  return (
    <div className={cn("w-full overflow-auto", className)} {...props}>
      <table className="w-full text-sm text-left">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key || col.title} className="px-4 py-2 font-medium">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-6 text-center text-sm text-muted-foreground">
                No data
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id ?? idx} className="border-t">
                {columns.map((col) => (
                  <td key={col.key || col.title} className="px-4 py-3 align-top">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {children}
    </div>
  )
}

DataTable.displayName = "DataTable"

export default DataTable
