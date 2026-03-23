import * as React from "react"

const MOBILE_BREAKPOINT = 760

// Extend the Navigator interface to include msMaxTouchPoints for older IE/Edge
interface NavigatorWithMsMaxTouchPoints extends Navigator {
  msMaxTouchPoints?: number;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Enhanced touch device detection for broader compatibility
    const isTouchDevice =
      'ontouchstart' in window || // Most reliable check
      navigator.maxTouchPoints > 0 || // Standard check (works on iPadOS Safari)
      (navigator as NavigatorWithMsMaxTouchPoints).msMaxTouchPoints! > 0 || // For IE/Edge on Windows devices
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches); // Fallback for devices with styli

    if (isTouchDevice) {
      // For touch devices, treat as mobile regardless of breakpoint
      setIsMobile(true);
    } else {
      // For non-touch devices, use breakpoint logic
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      };
      mql.addEventListener("change", onChange);
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      return () => mql.removeEventListener("change", onChange);
    }
  }, [])
  return !!isMobile
}
