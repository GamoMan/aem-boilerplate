import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMobile } from '../../hooks/use-mobile'; // Adjust path if necessary
import DOMPurify from "dompurify";

interface SectionHeaderProps {
  title: string;
  hint?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, hint }) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  const touchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleOpenChange = (openState: boolean) => {
    if (!isMobile) {
      // For non-mobile, let the Tooltip component manage its state normally
      setIsOpen(openState);
    } else {
      // For mobile, we control the closing with touchTimeoutRef
      // If the component tries to open, allow it
      if (openState) {
        setIsOpen(true);
      // } else {
      //   // If the component wants to close, check if our touch timeout is active
      //   // If it is, we don't close it yet, our timeout will handle it.
      //   // If there's no active timeout, then it's safe to close.
      //   if (touchTimeoutRef.current === null) {
      //     setIsOpen(false);
      //   }
      }
    }
  };

  const handleTouchStart = () => {
    // Clear any existing closing timeout
    if (isOpen) {
      setIsOpen(false);// If already open, do nothing      
    } else {
      // if (touchTimeoutRef.current) {
      //   clearTimeout(touchTimeoutRef.current);
      //   touchTimeoutRef.current = null;
      // }
      setIsOpen(true); // Open the tooltip immediately
    }
  };

  const handleTouchEnd = () => {
    // // Start a timeout to close the tooltip after 2 seconds
    // touchTimeoutRef.current = setTimeout(() => {
    //   setIsOpen(false);
    //   touchTimeoutRef.current = null;
    // }, 2000);
  };

  // React.useEffect(() => {
  //   return () => {
  //     // Cleanup timeout on unmount
  //     if (touchTimeoutRef.current) {
  //       clearTimeout(touchTimeoutRef.current);
  //     }
  //   };
  // }, []);

  return (
    <div className="flex items-center">
      <h3 className="font-b1-medium !font-bbl-medium mr-2">{title}</h3>
      {hint != null &&
        <TooltipProvider delayDuration={0}> {/* Ensure immediate opening */}
          <Tooltip
            open={isOpen} // Always controlled by our isOpen state
            onOpenChange={handleOpenChange}
          >
            <TooltipTrigger asChild>
              <div
                className="flex items-center justify-center w-6 h-6 cursor-pointer"
                onTouchStart={isMobile ? handleTouchStart : undefined}
                onTouchEnd={isMobile ? handleTouchEnd : undefined}
              ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0064FF" stroke-width="2" stroke-miterlimit="10" />
                  <path d="M12 17V11" stroke="#0064FF" stroke-width="2" stroke-miterlimit="10" />
                  <path d="M12 7.5C12.4418 7.5 12.7997 7.85807 12.7998 8.2998C12.7998 8.74163 12.4418 9.09961 12 9.09961C11.5583 9.0995 11.2002 8.74157 11.2002 8.2998C11.2003 7.85813 11.5583 7.50011 12 7.5Z" fill="#0064FF" stroke="#0064FF" stroke-miterlimit="10" />
                </svg>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="center"
              sideOffset={4} // Adjust position so tooltip bottom aligns with trigger bottom
              className="max-w-xs bg-secondary"
            >
              <p className="font-b2-regular font-bbl" dangerouslySetInnerHTML={{ __html: hint ? DOMPurify.sanitize(hint.replace(/\n/g, '<p class="py-1"></p>')) : '' }}></p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
    </div>
  );
};