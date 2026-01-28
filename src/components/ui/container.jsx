import * as React from "react"
import { cn } from "@/lib/utils"

export function Container({ children, className, wide = false, ...props }) {
  return (
    <div
      className={cn(
        wide ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" : "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Container.displayName = "Container"

export default Container
