"use client"

import { X } from "lucide-react"
import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface DSToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error"
  onClose?: () => void
}

export const DSToast = forwardRef<HTMLDivElement, DSToastProps>(
  ({ className, variant = "default", onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-lg border p-4 shadow-lg",
          "animate-in slide-in-from-top-full",
          {
            "bg-card text-card-foreground border-border": variant === "default",
            "bg-success text-success-foreground border-success": variant === "success",
            "bg-warning text-warning-foreground border-warning": variant === "warning",
            "bg-error text-error-foreground border-error": variant === "error",
          },
          className,
        )}
        {...props}
      >
        <div className="flex-1">{children}</div>
        {onClose && (
          <button onClick={onClose} className="rounded-md p-1 hover:bg-black/10 transition-colors" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  },
)

DSToast.displayName = "DSToast"
