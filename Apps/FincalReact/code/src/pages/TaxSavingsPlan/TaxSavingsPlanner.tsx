import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import TSStep1 from './TSStep1.tsx';
import TSStep2 from './TSStep2.tsx';
import TSResultsPage from './TSResultsPage.tsx';
import { useTaxSavings } from './hooks/useTaxSavings.ts';

const TaxSavingsPlanner = () => {
  const taxSavings = useTaxSavings();
  const {
    currentStep,
    showResults,
    appTexts,
    data,
    step1IsValid,
    step2IsValid,
    calculationResult,
    handleNext,
    handleBack,
  } = taxSavings;

  useEffect(() => {
    window.scrollTo(0, 0);

    const rootRetirementDiv = document.getElementById('root-tax-saving');
    if (rootRetirementDiv) {
      let nextSibling = rootRetirementDiv.nextElementSibling;
      while (nextSibling) {
        if (nextSibling.tagName === 'DIV' && nextSibling.classList.contains('wrapper')) {
          const retirementPlanDiv = nextSibling as HTMLElement;
          if (currentStep === 3 || showResults) {
            retirementPlanDiv.classList.remove('hide-content');
            retirementPlanDiv.classList.add('show-content');
          } else {
            retirementPlanDiv.classList.remove('show-content');
            retirementPlanDiv.classList.add('hide-content');
          }
          break;
        }
        nextSibling = nextSibling.nextElementSibling;
      }
    }
  }, [currentStep, showResults]);

  return (
    <div className="bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-14 md:mb-16">
          <div className="flex flex-col items-center justify-center my-8">
            <h1 className="font-h3-medium text-center mb-10 !font-bbl-medium text-black">
              {appTexts?.common.title}
            </h1>
            <div className="w-24 h-px bg-gray-90 rounded-full mb-4"></div>
          </div>
 
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-b1-medium border z-10 !font-bbl-medium leading-none relative ${currentStep === 1
                ? '!border-2 border-primary text-primary bg-white'
                : 'bg-primary text-white border-primary'
                }`}>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {currentStep === 1 ? '1' : '✓'}
                </span>
              </div>
              <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 text-center whitespace-nowrap font-b1-medium font-bbl-medium`}>
                {appTexts?.common.step1Label.split('\n').map((line, index, arr) => (
                  <div key={index}>
                    {line}
                    {index < arr.length - 1 && <br />}
                  </div>
                ))}
              </div>
            </div>
            <div className={`xs:w-[6.5rem] md:!w-[9rem] ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-90'}`}></div>
            <div className="relative">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-b1-medium border z-10 !font-bbl-medium leading-none relative ${currentStep === 2 && !showResults
                ? '!border-2 border-primary text-primary bg-white'
                : (currentStep > 2 || showResults)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-gray-90 text-gray-60'
                }`}>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {currentStep > 2 || showResults ? '✓' : '2'}
                </span>
              </div>
              <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 text-center whitespace-nowrap font-b1-medium font-bbl-medium`}>
                {appTexts?.common.step2Label.split('\n').map((line, index, arr) => (
                  <div key={index}>
                    {line}
                    {index < arr.length - 1 && <br />}
                  </div>
                ))}
              </div>
            </div>
            <div className={`xs:w-[6.5rem] md:!w-[9rem] ${showResults ? 'bg-primary' : 'bg-gray-90'}`}></div>
            <div className="relative">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-b1-medium border z-10 !font-bbl-medium leading-none relative ${showResults
                ? '!border-2 border-primary text-primary'
                : 'bg-gray-90 text-gray-60'
                }`}>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {currentStep > 3 ? '✓' : '3'}
                </span>
              </div>
              <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 text-center whitespace-nowrap font-b1-medium font-bbl-medium`}>
                {appTexts?.common.step3Label.split('\n').map((line, index, arr) => (
                  <div key={index}>
                    {line}
                    {index < arr.length - 1 && <br />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
 
        <div className="bg-white rounded-lg border-0 border-gray-200">
          {appTexts && data ? (
            <div className="p-2 md:p-8">
              {currentStep === 1 && (
                <TSStep1
                  taxSavings={taxSavings}
                />
              )}
 
              {currentStep === 2 && appTexts && (
                <TSStep2
                  taxSavings={{...taxSavings, appTexts}}
                />
              )}
 
              {currentStep >= 3 && showResults && calculationResult && data && (
                <TSResultsPage
                  taxSavings={taxSavings}
                />
              )}
            </div>
          ) : (
            <div className="p-2 md:p-8 text-center text-gray-50">Loading...</div>
          )}
 
          <div className="flex justify-center pb-8 pt-6 md:pt-0 gap-6">
            {currentStep > 1 && !showResults && (
              <Button variant="outline" onClick={handleBack} className="font-bbl-medium !font-b1-medium">
                {appTexts?.buttons.backButton}
              </Button>
            )}
 
            {currentStep < 3 && !showResults ? (
              <Button onClick={handleNext} className="font-bbl-medium !font-b1-medium" disabled={(currentStep === 1 && !step1IsValid) || (currentStep === 2 && !step2IsValid)}>
                {currentStep === 2 ? appTexts?.buttons.calculateButton : appTexts?.buttons.nextButton}
              </Button>
            ) : null}
            </div>
          </div>
      </div>
    </div>
  );
};
 
export default TaxSavingsPlanner;