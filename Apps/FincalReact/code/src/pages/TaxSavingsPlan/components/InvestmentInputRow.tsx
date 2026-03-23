import React from 'react';
import { FormInput } from '../../../components/common/FormInput';
import { formatNumber } from '@/lib/utils';  // Keep this import since it's used in the component
import { TaxSavingsLanguageTexts } from '../utils/TaxSavingsConfigLoader';

export interface InvestmentInputRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
  maxValueDisplay: string;
  maxLength?: number;
  language: 'th' | 'en';
  texts: TaxSavingsLanguageTexts;
  canInvestMore: number;
  // apiMax?: number;
  initialStep2Value: number;
  error?: string | null;
  disabled?: boolean;
  totalInvestedAmount: number; // New prop for the right-hand display
}

const InvestmentInputRow = React.memo((
  props: InvestmentInputRowProps
) => {
  const { label, value, onChange, maxValueDisplay, language, texts, canInvestMore, error, disabled, totalInvestedAmount, maxLength } = props;
  const placeholderText = `${canInvestMore === 0 ? '0' : `0 - ${formatNumber(Math.max(0, canInvestMore))}`}`;

  return (    
    <div className="tax-saving-grid tax-saving-grid-cols-2 items-baseline">
      <FormInput
        label={label}
        value={value}
        onChange={onChange}
        language={language}
        percentageError={texts[language].config.validation.percentageError}
        minValueError={texts[language].config.validation.minValueError}
        maxValueError={texts[language].config.validation.maxValueError}
        max={canInvestMore}
        placeholder={placeholderText}
        error={!!error}
        maxLength={canInvestMore.toString().length > 0 ? canInvestMore.toString().length + Math.round(canInvestMore.toString().length / 3) - 1 : 0}
        errorMessage={error}
        maxValueDisplay={disabled ? texts.results.noRemainDeduction : maxValueDisplay}
        disabled={disabled}
      />
      <div className="flex items-center justify-center h-[56px] font-b1-regular font-bbl text-primary">
        {totalInvestedAmount.toLocaleString(language === 'th' ? 'th-TH' : 'en-US')}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.label === nextProps.label &&
    prevProps.value === nextProps.value &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.max === nextProps.max &&
    prevProps.maxLength === nextProps.maxLength &&
    prevProps.maxValueDisplay === nextProps.maxValueDisplay &&
    prevProps.language === nextProps.language &&
    prevProps.texts === nextProps.texts &&
    prevProps.canInvestMore === nextProps.canInvestMore &&
    prevProps.initialStep2Value === nextProps.initialStep2Value &&
    // prevProps.apiMax === nextProps.apiMax &&
    prevProps.error === nextProps.error &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.totalInvestedAmount === nextProps.totalInvestedAmount // Include new prop in memo comparison
  );
});

export default InvestmentInputRow;