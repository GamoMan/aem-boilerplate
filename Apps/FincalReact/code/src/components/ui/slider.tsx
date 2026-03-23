import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const handleWheel = (event: WheelEvent) => {
    if (props.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    const currentValue = props.value && Array.isArray(props.value) && typeof props.value[0] === 'number'
      ? props.value[0]
      : props.min || 0;

    const step = props.step || 1;
    let newValue = currentValue;

    if (event.deltaY < 0) {
      newValue = Math.min(props.max || 100, currentValue + step);
    } else if (event.deltaY > 0) {
      newValue = Math.max(props.min || 0, currentValue - step);
    }

    if (newValue !== currentValue && props.onValueChange) {
      props.onValueChange([newValue]);
    }
  };

  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const currentWrapper = wrapperRef.current;
    if (currentWrapper) {
      currentWrapper.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (currentWrapper) {
        currentWrapper.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleWheel]);

  return (
    <div ref={wrapperRef} className="w-full py-6" tabIndex={0}> {/* Increased height for larger scroll area below the slider */}
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        style={{ touchAction: 'none' }}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-gray-80">
          <SliderPrimitive.Range className={`absolute h-full ${props.disabled ? 'bg-gray-80' : 'bg-primary'}`} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={`block h-5 w-5 rounded-full border-2 ${props.disabled ? 'border-gray-90' : 'border-primary'} ${props.disabled ? 'bg-gray-80' : 'bg-primary'} ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`} />
      </SliderPrimitive.Root>
    </div>
  );
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
