import * as React from "react"
import { cn } from "@/lib/utils"

export function PageHeader({ title, subtitle, right, className }) {
  return (
    <div className={cn("mb-6 flex items-start justify-between", className)}>
      <div>
        {title ? <h1 className="text-2xl font-bold">{title}</h1> : null}
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {right ? <div className="ml-auto">{right}</div> : null}
    </div>
  )
}

PageHeader.displayName = "PageHeader"

export default PageHeader
