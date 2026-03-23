import React, { memo } from 'react';
import DOMPurify from "dompurify";
import { SavingToolsLanguageTexts } from '../utils/savingToolsTexts';
import { SavingToolsCalculationResult } from '../utils/savingToolsApi';
import { formatNumber } from '@/lib/utils'; // Reusing formatNumber from utils

interface SavingToolsResultBoxProps {
  calculation: SavingToolsCalculationResult;
  texts: SavingToolsLanguageTexts;
  formData: { yearsToSave: number; expectedReturnRate: number; annualSavingIncreaseRate: number; };
  variant?: 'blue' | 'white'; // Add variant prop
  className?: string;
  isInitialState?: boolean;
  inflationRate: string;
  afterretireRate: string;
  expectedReturnRate: number;
  annualSavingIncreaseRate: number;
}

const SavingToolsResultBox: React.FC<SavingToolsResultBoxProps> = ({
  calculation,
  texts,
  formData,
  variant = 'blue', // Default to 'blue'
  className,
  isInitialState = false,
  inflationRate,
  expectedReturnRate,
  annualSavingIncreaseRate,
}) => {
  const isBlueVariant = variant === 'blue';
  const bgColorClass = isBlueVariant ? 'bg-primary' : 'bg-white';
  const borderColorClass = isBlueVariant ? 'border-primary' : 'border-primary';

  // Determine base colors based on variant
  const baseTextColor = isBlueVariant ? 'text-white' : 'text-gray-50'; // For general text
  const baseHeadingColor = isBlueVariant ? 'text-white' : 'text-primary'; // For the heading
  const baseNumberColor = isBlueVariant ? 'text-white' : 'text-primary'; // For the number
  const baseUnitColor = isBlueVariant ? 'text-gray-80' : 'text-primary'; // For the unit
  const baseNoteColor = 'text-gray-50'; // Assuming the note text is normally gray-80

  // Apply gray-50 if in initial/disabled state, otherwise use base colors
  const effectiveTextColor = isInitialState ? 'text-gray-50' : baseTextColor;
  const effectiveHeadingColor = isInitialState ? 'text-gray-50' : baseHeadingColor;
  const effectiveNumberColor = isInitialState ? 'text-gray-50' : baseNumberColor;
  const effectiveWhiteNumberColor = variant != 'blue' ? 'text-gray-50' : baseNumberColor;
  const effectiveUnitColor = isInitialState ? 'text-gray-50' : baseUnitColor;
  const effectiveNoteColor = isInitialState ? 'text-gray-50' : baseNoteColor;
  ''
  const notetext = (formData.annualSavingIncreaseRate !== 0 ? '' + texts.common.noteincreasedSavingMonthly : '') + texts.common.noteText +  texts.common.noterecommendSavingMonthly;

  return (
    <>
      <div className={`p-4 rounded-lg border ${borderColorClass} ${bgColorClass} ${effectiveTextColor} ${className} mb-1`}>
        <p className="font-b1-regular text-left font-bbl mb-12" dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(texts.common.toHaveMoney
            .replace('{money}', `<span class="font-bbl-bold ${effectiveWhiteNumberColor}">${formatNumber(calculation?.FutureValue)}</span>`)
            .replace('{unit}', texts.common.unit)
            .replace('{years}',  String(formData.yearsToSave)))
        }}></p>
        <p className={`font-h5-medium !font-bbl-medium ${effectiveHeadingColor}`}>
          {calculation?.savingIncreasePerYear === 0 || calculation?.savingIncreasePerYear !== undefined ? texts.results.recommendSavingMonthly : texts.results.increasedSavingMonthly}
        </p>
        <span className="font-h3-medium !font-bbl-medium">
          <span className={effectiveNumberColor}>{formatNumber(calculation?.SavingMonth)}</span> <span className={`font-b3-regular font-bbl-looped ${effectiveUnitColor}`}>{texts.common.unit}</span>
        </span>
        {calculation?.savingIncreasePerYear > 0 && (
          <p className={`font-b3-regular font-bbl-looped mt-2 ${effectiveTextColor}`}>
            {texts.results.increasedSavingMonthly} <span className={effectiveNumberColor}>{formatNumber(calculation.savingIncreasePerYear)}</span> {texts.common.percentUnit}
          </p>
        )}
      </div>
      <p className={`font-b3-regular font-bbl-looped ${effectiveNoteColor}`} dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(notetext
          .replace('{inflationRate}', inflationRate)
          .replace('{expectedReturnRate}', String(isBlueVariant ? expectedReturnRate : formData.expectedReturnRate))
          .replace('{annualSavingIncreaseRate}', annualSavingIncreaseRate !== 0 ? `${isBlueVariant ? annualSavingIncreaseRate : formData.annualSavingIncreaseRate}%` : ''))
      }}></p>
    </>
  );
};

export default memo(SavingToolsResultBox);