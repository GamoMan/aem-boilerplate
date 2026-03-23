import React from 'react';
import { Separator } from '@/components/ui/separator';
import ResultDisplayBox from './ResultDisplayBox';
import { LanguageTexts, CalculationResult } from '../utils/retirementUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalculationSummaryBoxProps {
  calculation: CalculationResult;
  language: 'th' | 'en';
  texts: LanguageTexts;
}

const CalculationSummaryBox: React.FC<CalculationSummaryBoxProps> = ({
  calculation,
  language,
  texts,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="p-4 rounded-lg bg-[#F5F5F5] mb-1">
      <div className={`flex ${isMobile ? 'flex-col' : 'items-stretch justify-between'}`}>
        <div className="flex-1">
          <div>
            <ResultDisplayBox
              label={texts.common.requiredAmount}
              value={calculation.requiredAmount}
              unit={texts.common.unit}
              language={language}
              valueClassName="font-h3-medium"
              valueAlignment={isMobile ? 'right' : 'left'}
              labelClassName={isMobile ? 'md:!text-right xs:text-left' : 'text-left'}
              valueWrapperClassName={isMobile ? 'justify-end' : 'justify-start'}
            />
          </div>
        </div>
        <Separator orientation={isMobile ? 'horizontal' : 'vertical'} className={isMobile ? 'w-full my-4 v-separator' : 'h-separator mx-8'} />

        <div className="flex-1">
          <div>
            <ResultDisplayBox
              label={texts.common.forSpending}
              value={calculation.monthlySpending}
              unit={texts.common.unit}
              language={language}
              valueClassName="font-h3-medium"
              valueAlignment="right"
              labelClassName="md:!text-right xs:text-left"
              valueWrapperClassName="justify-end"
            />

            <p className="font-b2-medium text-right text-[#2DCD73] !font-bbl-medium">
              {texts.common.futureValueDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationSummaryBox;