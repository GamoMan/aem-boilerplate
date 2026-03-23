import React from 'react';
import { Progress } from '@/components/ui/progress';
import { formatNumber } from '../../../lib/utils';
import { LanguageTexts, CalculationResult } from '../utils/retirementUtils';

interface CurrentSavingsProgressBarProps {
  calculation: CalculationResult;
  texts: LanguageTexts;
  progressValue: number;
}

const CurrentSavingsProgressBar: React.FC<CurrentSavingsProgressBarProps> = ({ calculation, texts, progressValue }) => {
  return (
    <div className="p-4 rounded-lg mb-8 bg-[#F5F5F5]">
      <p className={`font-h5-medium text-black text-left font-bbl-medium`}>
        {texts.steps.results.currentSavingsStatus}
      </p>
      <div className="flex flex-wrap fincal-flex-wrap justify-between items-baseline mt-2">
        <p className={`font-h3-medium text-primary !font-bbl-medium whitespace-nowrap`}>
          {formatNumber(calculation.totalCurrentAssetsAtRetirement)} <span className="font-b4-regular font-normal text-black font-bbl-looped">{texts.common.unit}</span>
        </p>
        <p className={`text-right font-h5-medium text-gray-50 font-bbl-medium whitespace-nowrap ml-auto`}>
          /{formatNumber(calculation.requiredAmount)} <span className="font-b4-regular font-normal gray-50 font-bbl-looped">{texts.common.unit}</span>
        </p>
      </div>
      <Progress value={progressValue} className="w-full mt-2" background='linear-gradient(to right, #002D5B 0%, #002D5B 30%, #0064FF 30%, #0064FF 60%, #A0C8FF 60%, #A0C8FF 100%)' />
    </div>
  );
};

export default CurrentSavingsProgressBar;