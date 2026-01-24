import * as React from "react"
import { cn } from "@/lib/utils"

export function EmptyState({ title = "Nothing here", description, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="text-lg font-semibold">{title}</div>
      {description ? <div className="mt-2 text-sm text-muted-foreground">{description}</div> : null}
    </div>
  )
}

EmptyState.displayName = "EmptyState"

export default EmptyState
