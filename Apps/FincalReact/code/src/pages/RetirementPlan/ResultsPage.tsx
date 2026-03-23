import React, { useState, useEffect } from 'react';
import { LanguageTexts, CalculationResult, RetirementData, getInvestmentReturnText } from './utils/retirementUtils';
import CalculationSummaryBox from './components/CalculationSummaryBox';
import SavingResultBox from './components/SavingResultBox';
import CurrentSavingsProgressBar from './components/CurrentSavingsProgressBar';
import RetirementGoalSummary from './components/RetirementGoalSummary';

const ALTERNATIVE_RETURN_RATE_INCREMENT = 2;

interface ResultsPageProps {
  texts: LanguageTexts;
  calculation: CalculationResult; // This will be the fullCalculation
  summaryCalculation: CalculationResult; // New prop for the summary box
  data: RetirementData;
  language: 'th' | 'en';
}

const ResultsPage: React.FC<ResultsPageProps> = ({ calculation, summaryCalculation, data, language, texts }) => {
  const [progressValue, setProgressValue] = useState(0);
  const [investmentReturnTextPrimary, setInvestmentReturnTextPrimary] = useState('');
  const [investmentReturnTextAlternative, setInvestmentReturnTextAlternative] = useState('');

  useEffect(() => {
    const fetchInvestmentTexts = async () => {
      setInvestmentReturnTextPrimary(await getInvestmentReturnText(language, data.savingsExpectedReturnRate, texts, 1));
      const alternativeRate = data.savingsExpectedReturnRate < 100 ? (data.savingsExpectedReturnRate + ALTERNATIVE_RETURN_RATE_INCREMENT) : data.savingsExpectedReturnRate;
      setInvestmentReturnTextAlternative(await getInvestmentReturnText(language, parseFloat(alternativeRate.toFixed(2)), texts, 2));
    };
    fetchInvestmentTexts();
  }, [language, data.savingsExpectedReturnRate]);

  useEffect(() => {
    const targetProgress = calculation.requiredAmount === 0 ? 0 : (calculation.totalCurrentAssetsAtRetirement / calculation.requiredAmount) * 100;
    if (targetProgress <= 100) {
      // Animate progress over 500ms
      const animationDuration = 500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        setProgressValue(Math.min(progress * targetProgress, 100));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setProgressValue(Math.min(targetProgress, 100));
    }
  }, [calculation.requiredAmount, calculation.totalCurrentAssetsAtRetirement]);

  if (!texts) {
    return null;
  }

  return (
    <div>
      <CalculationSummaryBox
        calculation={summaryCalculation}
        language={language}
        texts={texts}
      />
      <p className={`font-b3-regular text-gray-50 mb-6 text-left font-bbl-looped`}>
        {texts.common.noteText?.replace('{inflationRate}', calculation.inflationRate.toString()).replace('{afterretirerate}', calculation.afterretirerate.toString())}
      </p>
      {Math.round(calculation.recommendedMonthlySaving) > 0 && (
        <>
          {(Math.round(calculation.alternativeMonthlySaving) <= 0 || Math.round(calculation.recommendedMonthlySaving) === Math.round(calculation.alternativeMonthlySaving))? (
            <div className="grid grid-cols-1 mb-1 w-full px-0 mb-6">
              <div className='md:col-span-2'>
                <SavingResultBox
                  label={texts.steps.results.recommendedMonthlySavingLabel}
                  value={calculation.recommendedMonthlySaving}
                  unit={texts.common.unit}
                  investmentReturnText={investmentReturnTextPrimary}
                  annualSavingsIncreaseRate={data.annualSavingsIncreaseRate}
                  texts={texts}
                  isPrimary={true}
                />
              </div>
            </div>
          ) : (
            <div className="results-saving-grid grid grid-cols-1 md:grid-cols-2 gap-4 mb-1 w-full px-0 mb-4">
              <div className='md:col-span-1'>
                <SavingResultBox
                  label={texts.steps.results.recommendedMonthlySavingLabel}
                  value={calculation.recommendedMonthlySaving}
                  unit={texts.common.unit}
                  investmentReturnText={investmentReturnTextPrimary}
                  annualSavingsIncreaseRate={data.annualSavingsIncreaseRate}
                  texts={texts}
                  isPrimary={true}
                />
              </div>
              <div className='md:col-span-1'>
                <SavingResultBox
                  label={texts.steps.results.alternativeMonthlySavingLabel}
                  value={calculation.alternativeMonthlySaving}
                  unit={texts.common.unit}
                  investmentReturnText={investmentReturnTextAlternative}
                  annualSavingsIncreaseRate={data.annualSavingsIncreaseRate}
                  texts={texts}
                  isPrimary={false}
                />
              </div>
            </div>
          )}
        </>
      )}
      {Math.round(calculation.recommendedMonthlySaving) <= 0 ?
        <>
          {/* <h2 className={`font-h4-medium my-6 text-center !font-bbl-medium`}>{texts.steps.results.resultsGoalTitle}</h2> */}
          <div className="bg-primary text-white p-8 rounded-lg mt-0">
            <p className={`font-h5-medium mb-2 text-center break-words font-bbl-medium`} style={{ whiteSpace: 'pre-line' }}>{texts.steps.results.resultsGoal}</p>
          </div>
        </>
        : <>
          <h2 className={`font-h4-medium mb-6 text-center !font-bbl-medium`}>{texts.steps.results.resultsTitle}</h2>
          {Math.round(calculation.totalCurrentAssetsAtRetirement) > 0 && (
            <CurrentSavingsProgressBar
              calculation={calculation}
              texts={texts}
              progressValue={progressValue}
            />
          )}
        </>
      }
      {Math.round(calculation.recommendedMonthlySaving) > 0 && (
        <RetirementGoalSummary
          calculation={calculation}
          texts={texts}
        />
      )}
    </div>
  );
};

export default ResultsPage;
