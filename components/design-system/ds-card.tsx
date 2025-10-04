import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface DSCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export const DSCard = forwardRef<HTMLDivElement, DSCardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
          hover && "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

DSCard.displayName = "DSCard"

export const DSCardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  },
)

DSCardHeader.displayName = "DSCardHeader"

export const DSCardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  },
)

DSCardTitle.displayName = "DSCardTitle"

export const DSCardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  },
)

DSCardDescription.displayName = "DSCardDescription"

export const DSCardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  },
)

DSCardContent.displayName = "DSCardContent"

export const DSCardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  },
)

DSCardFooter.displayName = "DSCardFooter"
