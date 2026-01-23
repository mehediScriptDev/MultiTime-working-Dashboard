import * as React from "react"
import { cn } from "@/lib/utils"

// Minimal helper to reduce boilerplate when wrapping Radix primitives.
// Usage: export const PopoverContent = wrapRadix(PopoverPrimitive.Content)
export function wrapRadix(Primitive) {
  const Wrapped = React.forwardRef(({ className, children, ...props }, ref) => (
    <Primitive ref={ref} className={cn(className)} {...props}>
      {children}
    </Primitive>
  ))

  Wrapped.displayName = Primitive.displayName || Primitive.name || "WrappedRadix"
  return Wrapped
}

export default wrapRadix
