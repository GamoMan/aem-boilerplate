import React from 'react';
import { formatNumber } from '@/lib/utils';
import { LanguageTexts, CalculationResult } from '../utils/retirementUtils';

interface RetirementGoalSummaryProps {
  calculation: CalculationResult;
  texts: LanguageTexts;
}

const RetirementGoalSummary: React.FC<RetirementGoalSummaryProps> = ({ calculation, texts }) => {
  return (
    <div className="border border-primary border-solid p-4 rounded-lg flex flex-col space-y-2">
      <div className="flex flex-wrap fincal-flex-wrap items-baseline">
        <p className={`font-b1-medium text-black text-left !font-bbl-medium`}>{texts.steps.results.retirementGoal}</p>
        <p className={`font-h5-medium text-secondary text-right !font-bbl-medium whitespace-nowrap ml-auto`}>{formatNumber(calculation.requiredAmount)} <span className="font-b4-regular font-normal gray-50 font-bbl-looped">{texts.common.unit}</span></p>
      </div>
      <div className="flex flex-wrap fincal-flex-wrap items-baseline">
        <p className={`font-b1-medium text-black text-left !font-bbl-medium`}>{texts.steps.results.currentSavingsStatus}</p>
        <p className={`font-h5-regular text-black text-right font-bbl whitespace-nowrap ml-auto`}>{Math.round(calculation.totalCurrentAssetsAtRetirement) <= 0 ? '-' : formatNumber(calculation.totalCurrentAssetsAtRetirement)} <span className="font-b4-regular font-normal gray-50 font-bbl-looped">{texts.common.unit}</span></p>
      </div>
      <div className="flex flex-wrap fincal-flex-wrap items-baseline">
        <span>
          <p className={`font-b1-medium text-black text-left !font-bbl-medium`}>{texts.steps.results.recommendedMonthlySavingResult}</p>
          <p className={`font-b2-medium text-primary text-left !font-bbl-medium`}>{texts.steps.results.consistentInvestment}</p>
        </span>
        <p className={`font-h5-medium text-primary text-right !font-bbl-medium whitespace-nowrap ml-auto`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.4375L12 21.4375" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
            <path d="M21 12.4375L12 21.4375L3 12.4375" stroke="#0064FF" strokeWidth="2" strokeMiterlimit="10" />
          </svg>
          {formatNumber(calculation.recommendedMonthlySaving)} <span className="font-b4-regular font-normal gray-50 font-bbl-looped">{texts.common.unit}</span></p>
      </div>
    </div>
  );
};

export default RetirementGoalSummary;