import * as React from "react"
import { FormItem, FormLabel, FormControl } from "@/components/ui/form"

export function FormField({ name, label, children, ...props }) {
  return (
    <FormItem {...props}>
      {label ? <FormLabel>{label}</FormLabel> : null}
      <FormControl>{children}</FormControl>
    </FormItem>
  )
}

FormField.displayName = "FormField"

export default FormField
