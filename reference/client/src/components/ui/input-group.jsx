import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// InputGroup: Label + Input arranged consistently
export function InputGroup({ label, id, children, className, ...props }) {
  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <Label htmlFor={id} className="text-xs font-semibold uppercase">
          {label}
        </Label>
      ) : null}
      {children ? (
        children
      ) : (
        <Input id={id} {...props} />
      )}
    </div>
  )
}

InputGroup.displayName = "InputGroup"

export default InputGroup
