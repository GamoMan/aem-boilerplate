import { useState, useEffect, useRef } from 'react';

import { formatNumber, parseFormattedNumber } from '@/lib/utils';
export interface FormInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  isPercentage?: boolean;
  language: 'th' | 'en';
  showAlways?: boolean;
  hideIfZero?: boolean;
  onFocusChange?: (focused: boolean) => void;
  error?: boolean;
  errorMessage?: string;
  min?: number;
  max?: number;
  maxLength?: number;
  placeholder?: string;
  maxValueDisplay?: string;
  disabled?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  icon?: React.ReactNode; // New prop for icon
  // New props for validation messages
  percentageError?: string;
  minValueError?: string;
  maxValueError?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  isPercentage = false,
  language,
  showAlways = false,
  hideIfZero = false,
  onFocusChange,
  error: externalError,
  errorMessage: externalErrorMessage,
  min,
  max,
  maxLength,
  placeholder,
  maxValueDisplay,
  disabled = false,
  onValidationChange,
  icon, // Destructure icon prop
  percentageError,
  minValueError,
  maxValueError,
}) => {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasValue, setHasValue] = useState(false);
  const [isValid, setIsValid] = useState(true); // Internal validation state
  const [validationMessage, setValidationMessage] = useState(''); // Internal validation message
  const inputRef = useRef<HTMLInputElement>(null);

  const validateInput = (val: number) => {
    let currentIsValid = true;
    let currentValidationMessage = '';

    if (isPercentage) {
      if (isNaN(val) || val < 0 || val > 100) {
        currentIsValid = false;
        currentValidationMessage = percentageError || '';
      }
    }

    if (min !== undefined && val < min) {
      currentIsValid = false;
      currentValidationMessage = minValueError ? minValueError.replace('{min}', formatNumber(min)) : `Minimum must not exceed ${min}`;
    }
    if (max !== undefined && val > max) {
      currentIsValid = false;
      currentValidationMessage = maxValueError ? maxValueError.replace('{max}', formatNumber(max)) : `Maximum up to ${max}`;
    }

    setIsValid(currentIsValid);
    setValidationMessage(currentValidationMessage);
if (onValidationChange) {
      onValidationChange(currentIsValid);
    }
    return currentIsValid;
  };

  useEffect(() => {
    const currentHasValue = value > 0 || (typeof value === 'number' && !isNaN(value) && value !== 0);
    setHasValue(currentHasValue);
    // Only update inputValue based on value prop if not focused
    if (!focused) {
      let formattedValue;
      if (value === 0) {
        formattedValue = '0'; // Display '0' when value is 0 and not focused
      } else if (isPercentage) {
        formattedValue = formatNumber(value, true);
      } else {
        formattedValue = formatNumber(value);
      }
      setInputValue(formattedValue);
    }
    validateInput(value); // Validate on blur/initial load
  }, [value, isPercentage, focused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const oldCursorPos = e.target.selectionStart;

    if (rawValue === '') {
      setInputValue(''); // Clear input display
      onChange(0);
      setHasValue(false);
      setIsValid(true); // Clear validation for empty input
      setValidationMessage('');
      return;
    }
    
    // For non-empty rawValue, allow immediate display of typed characters
    setInputValue(rawValue); // Update inputValue immediately with raw text for responsive typing

let newValue: number;
let newFormattedValue: string;

    if (isPercentage) {
      // Remove any non-numeric characters except for the decimal point
      let cleanedValue = rawValue.replace(/[^0-9.]/g, '');

      // Ensure only one decimal point
      const parts = cleanedValue.split('.');
      if (parts.length > 2) {
        cleanedValue = parts[0] + '.' + parts.slice(1).join('');
      }

      // If it starts with a decimal, prepend a '0'
      if (cleanedValue.startsWith('.')) {
        cleanedValue = '0' + cleanedValue;
      }

      // Truncate to 2 decimal places if there are more
      if (cleanedValue.includes('.')) {
        const decimalIndex = cleanedValue.indexOf('.');
        if (cleanedValue.length - 1 - decimalIndex > 2) {
          cleanedValue = cleanedValue.substring(0, decimalIndex + 3);
        }
      }

      // Restrict total length to 5 digits (including decimal point if present)
      // This logic needs to be careful about numbers like "123.45" (6 chars) vs "12345" (5 chars)
      // The requirement is "5 characters but not more than 2 decimal places"
      // This implies a max length of 5 for the integer part + 1 for decimal + 2 for fractional part,
      // but the original maxLength on the input is 5.
      // Let's assume "5 total characters" for now, not 5 digits.
      if (maxLength && cleanedValue.length > maxLength) {
        cleanedValue = cleanedValue.substring(0, maxLength);
      }

      newValue = parseFloat(cleanedValue);
      newFormattedValue = cleanedValue;

      // Handle cases like "0."
      if (rawValue === "0." || cleanedValue === "0.") {
        newValue = 0;
        newFormattedValue = "0.";
      } else if (cleanedValue === '') {
        // If cleanedValue is empty (e.g., user deletes all input), treat as 0
        newValue = 0;
        newFormattedValue = ''; // Keep input blank
      }

      setInputValue(newFormattedValue); // Update inputValue immediately with raw text for responsive typing
      validateInput(isNaN(newValue) ? 0 : newValue);

    } else {
      let processedRawValue = rawValue;
      if (maxLength && rawValue.length > maxLength) {
        processedRawValue = rawValue.substring(0, maxLength);
      }
      newValue = parseFormattedNumber(processedRawValue);
      newFormattedValue = formatNumber(newValue);
      setInputValue(newFormattedValue);
    }

// No special handling for inputValue here. It's updated at the beginning of handleChange to rawValue.
// Cursor position logic will use newFormattedValue.

onChange(isNaN(newValue) ? 0 : newValue);
setHasValue(isNaN(newValue) ? false : newValue > 0);
// Re-validate after setting value, especially if maxLength truncated input
validateInput(isNaN(newValue) ? 0 : newValue);

    if (inputRef.current && oldCursorPos !== null) {
      if (!isPercentage) {
        const oldNumNonDigits = (inputValue.substring(0, oldCursorPos).match(/[^0-9.]/g) || []).length;
        const digitsAndDecimalBeforeOldCursor = oldCursorPos - oldNumNonDigits;

        let newCursorPos = 0;
        let currentDigitsAndDecimalCount = 0;

        for (let i = 0; i < newFormattedValue.length; i++) {
          if (newFormattedValue[i] >= '0' && newFormattedValue[i] <= '9' || newFormattedValue[i] === '.') {
            currentDigitsAndDecimalCount++;
          }

          if (currentDigitsAndDecimalCount === digitsAndDecimalBeforeOldCursor) {
            newCursorPos = i + 1;
            break;
          } else if (currentDigitsAndDecimalCount > digitsAndDecimalBeforeOldCursor) {
            newCursorPos = i;
            break;
          }
        }
        
        if (currentDigitsAndDecimalCount < digitsAndDecimalBeforeOldCursor) {
            newCursorPos = newFormattedValue.length;
        }

        newCursorPos = Math.min(newCursorPos, newFormattedValue.length);
        newCursorPos = Math.max(0, newCursorPos);

        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          }
        });
      } else {
        const lengthDiff = newFormattedValue.length - rawValue.length;
        const newCursorPos = oldCursorPos + lengthDiff;
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          }
        });
      }
    }
  };

const handleFocus = () => {
  setFocused(true);
  if (value === 0) {
    setInputValue(''); // Clear input if current value is 0
  } else {
    // For non-zero values, display the formatted number on focus
    let formattedValue;
    if (isPercentage) {
      formattedValue = value % 1 === 0 ? value.toString() : value.toFixed(2);
    } else {
      formattedValue = formatNumber(value);
    }
    setInputValue(formattedValue);
  }
  if (onFocusChange) {
    onFocusChange(true);
  }
};

const handleBlur = () => {
  setFocused(false);
  let formattedValue;
  if (value === 0) {
    formattedValue = '0'; // Always display '0' if value is 0 on blur
  } else if (isPercentage) {
    formattedValue = formatNumber(value, true);
  } else {
    formattedValue = formatNumber(value);
  }
  setInputValue(formattedValue); // Restore the formatted value on blur
  validateInput(value); // Validate on blur
  if (onFocusChange) {
    onFocusChange(false);
  }
};

  const isHidden = hideIfZero && !focused && value === 0;

  if (isHidden && !showAlways) {
    return null;
  }

  return (
    <div className="relative">
      <div className={`relative flex items-center border-[1px] border-solid rounded-lg transition-colors duration-200 h-[56px] ${
        disabled
        ? 'border-gray-80 bg-bbl-gray'
        : (externalError !== undefined ? externalError : !isValid)
          ? 'border-red-500'
          : focused
            ? 'border-primary'
            : 'border-gray-80'
      }`}>
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</div>}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`w-full h-full flex items-center bg-transparent text-right font-b1-regular outline-none pr-4
                     font-bbl ${externalError !== undefined ? (externalError ? 'text-red-500' : '') : (!isValid ? 'text-red-500' : '')} 
                     ${icon ? 'pl-12' : 'pl-4'} ${disabled ? 'text-gray-80' : (value === 0 ? 'text-black' : 'text-black')}`}
          disabled={disabled}
        />
        <label className={`absolute transition-all duration-200 pointer-events-none font-b1-regular ${disabled ? 'text-gray-80' : 'text-gray-50'}
                           font-bbl whitespace-normal ${icon ? 'left-12 w-1/2' : 'left-4 w-1/2'}
                           top-1/2 -translate-y-1/2`}>
          {label}
        </label>
      </div>
      {(externalError !== undefined ? externalError : !isValid) && (
        <p className="text-red-500 text-sm mt-1 pl-4 font-bbl-looped">{externalErrorMessage !== undefined ? externalErrorMessage : validationMessage}</p>
      )}
      {maxValueDisplay && !(externalError !== undefined ? externalError : !isValid) && (
        <p className={`font-b3-regular ${disabled ? 'text-gray-80':'text-[#2DCD73]'} mt-1 pl-4 font-bbl-looped`}>{maxValueDisplay}</p>
      )}
    </div>
  );
};