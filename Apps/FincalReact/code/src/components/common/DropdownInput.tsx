import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import * as SelectPrimitive from '@radix-ui/react-select';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownInputProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  language: 'th' | 'en';
  className?: string;
}

const CustomSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={`flex h-10 w-full items-center justify-between rounded-md bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${className}`}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 7L12 17L22 7" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
        </svg>
      </div>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
CustomSelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  value,
  options,
  onChange,
  language,
  className,
}) => {
  return (
    <div className={`relative ${className}`}>
      <Select value={value} onValueChange={onChange}>
        <CustomSelectTrigger className="w-full h-[56px] border-[1px] border-solid rounded-lg border-[#C8C8CC] px-4 text-left font-b1-regular font-bbl data-[placeholder]:text-[#78787D]">
          <SelectValue placeholder={label} />
        </CustomSelectTrigger>
        <SelectContent className="rounded-lg border-[#C8C8CC] w-[var(--radix-select-trigger-width)] bg-white">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="font-b1-regular font-bbl">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};