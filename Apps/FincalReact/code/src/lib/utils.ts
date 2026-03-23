import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for number formatting
export const formatNumber = (num: number | null | undefined, isPercentage: boolean = false): string => {
  if (num === null || num === undefined) {
    return '0'; // Or any other placeholder you prefer for null/undefined
  }

  let formatted = '';
  if (isPercentage) {
    formatted = num.toFixed(2).replace(/\.?0+$/, '');
    return formatted;
  }
  // Use toLocaleString for general number formatting, allowing decimals up to 2 places
   return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0});
 };
 
 export const formatNumberToK = (num: number | null | undefined): string => {
   if (num === null || num === undefined) {
     return '0';
   }
   if (num >= 1000000) {
     return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
   }
   if (num >= 1000) {
     return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
   }
   return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0});
 };

export const formatMessageWithPlaceholders = (message: string, replacements: { [key: string]: number | string }) => {
  let formattedMessage = message;
  for (const key in replacements) {
    formattedMessage = formattedMessage.replace(`{${key}}`, formatNumber(Number(replacements[key])));
  }
  return formattedMessage;
};

export const parseFormattedNumber = (str: string): number => {
  // Allow decimal points when parsing
  const cleanedStr = str.replace(/[^0-9.]/g, '');
  return parseFloat(cleanedStr) || 0;
};
