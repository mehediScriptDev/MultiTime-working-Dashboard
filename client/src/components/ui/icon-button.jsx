import * as React from "react"
import { Button } from "@/components/ui/button"

// IconButton: simple accessible button for icon-only actions
const IconButton = React.forwardRef(({ children, className, label, ...props }, ref) => {
  if (!label) {
    // eslint-disable-next-line no-console
    console.warn("IconButton: provide an 'aria-label' via the 'label' prop for accessibility")
  }

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className={className}
      {...props}
    >
      {children}
    </Button>
  )
})

IconButton.displayName = "IconButton"

export { IconButton }
