import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface DSBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error"
}

export const DSBadge = forwardRef<HTMLSpanElement, DSBadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
          {
            "bg-muted text-muted-foreground": variant === "default",
            "bg-primary text-primary-foreground": variant === "primary",
            "bg-secondary text-secondary-foreground": variant === "secondary",
            "bg-success text-success-foreground": variant === "success",
            "bg-warning text-warning-foreground": variant === "warning",
            "bg-error text-error-foreground": variant === "error",
          },
          className,
        )}
        {...props}
      />
    )
  },
)

DSBadge.displayName = "DSBadge"
