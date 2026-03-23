import React, { useMemo } from 'react';
import { DropdownInput } from '@/components/common/DropdownInput';
import { FormInput } from '@/components/common/FormInput';
import { formatNumber } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SavingToolsFormData } from '../types';
import { SavingToolsLanguageTexts, AllSavingToolsTexts } from '../utils/savingToolsTexts';
import { RightCardData } from '../utils/savingToolsTexts';

interface SavingToolsInputFormProps {
  formData: SavingToolsFormData;
  errors: {
    desiredSavingAmount: string;
    yearsToSave: string;
    savedAmount: string;
    expectedReturnRate: string;
    annualSavingIncreaseRate: string;
  };
  appTexts: (SavingToolsLanguageTexts & { defaultFormValues: AllSavingToolsTexts['defaultFormValues'] });
  language: 'th' | 'en';
  isFormValid: boolean;
  savingGoal: string; // Add savingGoal prop
  handleInputChange: (field: keyof SavingToolsFormData, value: string | number) => void;
  handleValidationChange: (field: string, isValid: boolean) => void;
  handleSavingGoalChange: (value: string) => void;
  handleClearButtonClick: () => void;
  handleCalculateButtonClick: () => void;
  goalToCategoryMap: Record<string, { th: string; en: string }>;
}

const SavingToolsInputForm: React.FC<SavingToolsInputFormProps> = ({
  formData,
  errors,
  appTexts,
  language,
  isFormValid,
  savingGoal, // Destructure savingGoal
  handleInputChange,
  handleValidationChange,
  handleSavingGoalChange,
  handleClearButtonClick,
  handleCalculateButtonClick
}) => {
  const inputProps = useMemo(() => [
    {
      field: 'savedAmount',
      label: appTexts.inputs.savedAmount,
      min: 0,
      max: 999999999,
      maxLength: 11,
      placeholder: `${formatNumber(0)} - ${formatNumber(999999999)}`,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.2611 12.9131C19.2611 11.7261 18.8045 10.6305 17.9828 9.80872L13.7828 5.60872L17.435 1.95654H6.47845L10.1306 5.60872L5.93062 9.80872C5.5654 10.1739 5.29149 10.6305 5.01758 11.087" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
        <path d="M2.82609 23L5.56522 22H15.6087L22 18C21.5435 16 19.4435 15 17.8 16L14.6957 18H8.30435H13.6913C14.1478 18 14.513 17.5 14.4217 16.9L14.3304 16.7C14.0565 15.7 13.1435 14.9 12.2304 14.8L5.56522 14L1 16" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
      </svg>
    },
    {
      field: 'desiredSavingAmount',
      label: appTexts.inputs.desiredSavingAmount,
      min: 10000,
      max: 999999999,
      maxLength: 11,
      placeholder: `${formatNumber(10000)} - ${formatNumber(999999999)}`,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.82609 23L5.56522 22H15.6087L22 18C21.5435 16 19.4435 15 17.8 16L14.6957 18H8.30435H13.6913C14.1478 18 14.513 17.5 14.4217 16.9L14.3304 16.7C14.0565 15.7 13.1435 14.9 12.2304 14.8L5.56522 14L1 16" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
        <circle cx="12" cy="6" r="5" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
      </svg>
    },
    {
      field: 'expectedReturnRate',
      label: appTexts.inputs.expectedReturnRate,
      isPercentage: true,
      min: 0.1,
      max: 40,
      maxLength: 5,
      placeholder: `${formatNumber(0.1,true)} - ${formatNumber(40)}`,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 15C17 19.416 13.416 23 9 23C4.584 23 1 19.416 1 15C1 10.584 4.584 7 9 7" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
        <path d="M22 11C22 6.032 17.968 2 13 2V11H22Z" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
      </svg>
    },
    {
      field: 'yearsToSave',
      label: appTexts.inputs.yearsToSave,
      min: 1,
      max: 30,
      maxLength: 2,
      placeholder: `${formatNumber(1)} - ${formatNumber(30)}`,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 4V22H2V4" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
        <path d="M9 5H15" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
        <path d="M18 1V10" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
        <path d="M6 1V10" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
      </svg>
    },
    {
      field: 'annualSavingIncreaseRate',
      label: appTexts.inputs.annualSavingIncreaseRate,
      isPercentage: true,
      min: 0,
      max: 40,
      maxLength: 5,
      placeholder: `${formatNumber(0)} - ${formatNumber(40)}`,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.6 20.9999H3V2.3999" stroke="#0064FF" stroke-width="2" stroke-miterlimit="10"></path>
    <path d="M8 18V15H12V11H16V7H20V3" stroke="#0064FF" stroke-width="2"></path>
  </svg>
    }
  ], [appTexts, formatNumber]);

  // Calculate local min/max errors and overall local form validity
  const { enhancedInputProps, hasMinMaxErrors } = useMemo(() => {
    let localHasMinMaxErrors = false;
    const newEnhancedInputProps = inputProps.map((props) => {
      const currentFieldValue = formData[props.field as keyof SavingToolsFormData];
      let minMaxError = false;
      let minMaxErrorMessage = '';

      // Convert value to number for validation, handle empty string or non-numeric input
      const numValue = currentFieldValue === '' ? NaN : parseFloat(currentFieldValue as string);

      if (!isNaN(numValue)) {
        if (numValue < props.min) {
          minMaxError = true;
          minMaxErrorMessage = appTexts.validation.minValueError.replace('{min}', props.min.toString());
        } else if (numValue > props.max) {
          minMaxError = true;
          minMaxErrorMessage = appTexts.validation.maxValueError.replace('{max}', props.max.toString());
        }
      }

      // If a min/max error is detected, set localHasMinMaxErrors to true
      if (minMaxError) {
        localHasMinMaxErrors = true;
      }

      // Prioritize parent's error message, then min/max error message
      const finalErrorMessage = errors[props.field] || minMaxErrorMessage;
      // Prioritize parent's error status, then min/max error status
      const finalError = !!errors[props.field] || minMaxError;

      return {
        ...props,
        error: finalError,
        errorMessage: finalErrorMessage,
      };
    });
    return { enhancedInputProps: newEnhancedInputProps, hasMinMaxErrors: localHasMinMaxErrors };
  }, [formData, errors, appTexts.validation.minValueError, appTexts.validation.maxValueError, inputProps]);

  const overallFormValid = isFormValid && !hasMinMaxErrors;

  return (
    <div className="md:col-span-2">
      <h2 className="font-h5-medium mb-4 text-left !font-bbl-medium">
        {appTexts.common.step1Title}
      </h2>
      <div className="fincal-grid grid grid-cols-1 md:grid-cols-2 gap-4 font-b1-regular font-bbl">
        <DropdownInput
          label={appTexts.inputs.savingGoal}
          value={formData.savingGoal}
          options={appTexts.savingGoals}
          onChange={(value) => handleSavingGoalChange(value)}
          language={language}
          className="col-span-1 md:col-span-1"
        />
        {enhancedInputProps.map((props) => (
          <FormInput
            key={props.field}
            label={props.label}
            value={formData[props.field as keyof SavingToolsFormData] as number}
            onChange={(value) => handleInputChange(props.field as keyof SavingToolsFormData, value)}
            language={language}
            min={props.min}
            max={props.max}
            maxLength={props.maxLength}
            placeholder={props.placeholder}
            onValidationChange={(isValid) => handleValidationChange(props.field, isValid)}
            isPercentage={props.isPercentage}
            error={props.error}
            errorMessage={props.errorMessage}
            icon={props.icon}
            minValueError={appTexts.validation.minValueError}
            maxValueError={appTexts.validation.maxValueError}
          />
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-4 mb-4">
        <Button
          variant="outline"
          onClick={handleClearButtonClick}
          className={`font-bbl-bold ${!savingGoal ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!savingGoal}
        >
          {appTexts.common.clearButton}
        </Button>
        <Button
          onClick={handleCalculateButtonClick}
          className={`font-bbl-bold ${(!overallFormValid || !savingGoal) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!overallFormValid || !savingGoal}
        >
          {appTexts.common.calculateButtonText}
        </Button>
      </div>
    </div>
  );
};

export default SavingToolsInputForm;