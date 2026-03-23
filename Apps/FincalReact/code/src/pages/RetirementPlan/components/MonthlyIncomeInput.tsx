import React, { useState, useEffect } from 'react';
import { formatNumber, parseFormattedNumber } from '../../../lib/utils';
import { LanguageTexts } from '../utils/retirementUtils';

interface MonthlyIncomeInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  language: 'th' | 'en';
  texts: LanguageTexts; // Add texts prop
  note: string; // "ณ มูลค่าปัจจุบัน" or "at current value"
  min: number;
  max: number;
  unit?: string; // "THB"
  onValidationChange?: (isValid: boolean) => void;
}

const MonthlyIncomeInput: React.FC<MonthlyIncomeInputProps> = ({
  label,
  value,
  onChange,
  language,
  texts, // Destructure texts prop
  note,
  unit,
  min,
  max,
  onValidationChange,
}) => {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasValue, setHasValue] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const hasValue = value > 0 || (typeof value === 'number' && !isNaN(value));
    setInputValue(formatNumber(value));
    setHasValue(hasValue);
    const isValid = !(value < min || value > max);
    setIsInvalid(!isValid);
    setErrorMessage(isValid ? '' : (value < min ? `${texts.validation.minValueError} ${min.toLocaleString()}` : `${texts.validation.maxValueError} ${max.toLocaleString()}`));
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [value, min, max, texts, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);

    let newValue = parseFormattedNumber(rawValue);

    if (isNaN(newValue)) {
      newValue = 0;
    }

    const isValid = !(newValue < min || newValue > max);
    setIsInvalid(!isValid);
    setErrorMessage(isValid ? '' : (newValue < min ? `${texts.validation.minValueError} ${min.toLocaleString()}` : `${texts.validation.maxValueError} ${max.toLocaleString()}`));
    if (onValidationChange) {
      onValidationChange(isValid);
    }

    onChange(newValue);
    setHasValue(newValue > 0);
  };

  const handleBlur = () => {
    setFocused(false);
    setInputValue(formatNumber(value));
    const isValid = !(value < min || value > max);
    setIsInvalid(!isValid);
    setErrorMessage(isValid ? '' : (value < min ? `${texts.validation.minValueError} ${min.toLocaleString()}` : `${texts.validation.maxValueError} ${max.toLocaleString()}`));
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  };

  return (
    <div className="relative mb-8 bg-[#022D53] p-6 rounded-lg text-white">
      <div className={`font-h5-medium mb-2 !font-bbl-medium`} style={{ whiteSpace: 'pre-line' }}>
        {label}
      </div>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          min={min}
          max={max}
          maxLength={11}
          placeholder={`${min.toLocaleString()}-${max.toLocaleString()}`}
          onChange={handleChange}
          onFocus={() => {
              setFocused(true);
              if (value >= min && value <= max) { // Only clear error if the current value is NOT invalid
                setIsInvalid(false);
                setErrorMessage('');
              }
              if (value === 0) {
                setInputValue(''); // Clear input if current value is 0
              }
            }
          }
          onBlur={handleBlur}
          className={`w-full bg-transparent text-right font-h3-medium outline-none border-b-2 pb-0 pr-[25px] !font-bbl-medium ${isInvalid ? 'border-red-500 text-red-500' : 'border-white border-opacity-30 text-white'}`}
        />
        {unit && (
          <span className={`absolute right-0 xs:bottom-1.5 sm:bottom-1.5 md:bottom-0 lg:!bottom-3 xl:bottom-8 text-gray-80 font-b4-regular font-normal font-bbl-looped`}>
            {unit}
          </span>
        )}
      </div>
      <hr />
      <div className="flex justify-between items-center mt-2">
        {isInvalid && (
          <div className="text-red-500 text-left font-b2-medium !font-bbl-medium">
            {errorMessage}
          </div>
        )}
        <div className={`text-[#2DCD73] text-right font-b2-medium !font-bbl-medium ${isInvalid ? 'ml-auto' : 'w-full'}`}>
          {note}
        </div>
      </div>
    </div>
  );
};

export default MonthlyIncomeInput;
