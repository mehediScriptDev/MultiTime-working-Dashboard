import * as React from "react"
import { cn } from "@/lib/utils"

export function ModalHeader({ title, subtitle, className }) {
  return (
    <div className={cn("mb-4", className)}>
      {title ? <h3 className="text-lg font-semibold">{title}</h3> : null}
      {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  )
}

export function ModalFooter({ children, className }) {
  return <div className={cn("mt-4 flex items-center justify-end gap-2", className)}>{children}</div>
}

ModalHeader.displayName = "ModalHeader"
ModalFooter.displayName = "ModalFooter"

export default { ModalHeader, ModalFooter }
