import React from 'react';
import { formatNumber } from '@/lib/utils';
import { LanguageTexts } from '@/pages/RetirementPlan/utils/retirementUtils';

interface SavingResultBoxProps {
  label: string;
  value: number;
  unit: string;
  investmentReturnText: string;
  annualSavingsIncreaseRate: number;
  texts: LanguageTexts;
  isPrimary?: boolean;
}

const SavingResultBox: React.FC<SavingResultBoxProps> = ({
  label,
  value,
  unit,
  investmentReturnText,
  annualSavingsIncreaseRate,
  texts,
  isPrimary = true,
}) => {
  const bgColorClass = isPrimary ? 'bg-primary text-white' : 'border border-primary border-solid';
  const textColorClass = isPrimary ? 'text-white' : 'text-black';
  const labelColorClass = isPrimary ? '' : 'text-[#2DCD73]';
  const investmentTextColorClass = isPrimary ? '' : 'text-primary';
  const unitColorClass = isPrimary ? 'gray-80' : 'gray-50'; // New: Conditional unit color

  return (
    <>
      <div className={`${bgColorClass} p-4 rounded-lg mb-1`}>
        <p className={`font-h5-medium  mb-2 text-left break-words font-bbl-medium ${labelColorClass}`} style={{ whiteSpace: 'pre-line' }}>
          {label}
        </p>
        <p className={`font-h3-medium text-right !font-bbl-medium whitespace-nowrap ${textColorClass}`}>
          {formatNumber(value)} <span className={`font-b4-regular font-normal ${unitColorClass} font-bbl-looped`}>{unit}</span> {/* Applied new class */}
        </p>
        <p className={`font-b2-medium mt-2 text-right !font-bbl-medium ${investmentTextColorClass}`}>
          {investmentReturnText}
        </p>
      </div>
      {Number(annualSavingsIncreaseRate.toFixed(4)) > 0 && (
        <span className={`font-b3-regular text-gray-50 text-left font-bbl-looped`}>
          {texts.steps.results.investmentReturnRate.replace('{rate}', annualSavingsIncreaseRate.toFixed(2).toString())}
        </span>
      )}
    </>
  );
};

export default SavingResultBox;