import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { formatNumber?: boolean }>(
  ({ className, type, formatNumber, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (formatNumber) {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        const numericValue = rawValue === '' ? '' : parseInt(rawValue, 10).toString();
        const formattedValue = numericValue === '' ? '' : new Intl.NumberFormat('en-US').format(Number(numericValue));
        e.target.value = formattedValue;
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: numericValue,
          },
        };
        onChange?.(syntheticEvent);
      } else {
        onChange?.(e);
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-solid border-input bg-background px-3 py-2 text-base ring-offset-background file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          formatNumber && "text-right",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Input.displayName = "Input"

export { Input }
