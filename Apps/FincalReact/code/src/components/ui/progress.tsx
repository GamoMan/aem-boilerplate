import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { background?: string; }
>(({ className, value, background, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-[#E3E3E5]",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full transition-all"
      style={{
        width: `${value || 0}%`,
        background: `${background == null ? "linear-gradient(to right, #0064FF 0%, #0064FF 100%)" : background}`
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
