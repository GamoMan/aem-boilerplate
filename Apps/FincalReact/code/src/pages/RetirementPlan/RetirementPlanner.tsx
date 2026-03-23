import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

import Step1 from './RPStep1';
import Step2 from './RPStep2';
import ResultsPage from './ResultsPage';

import { RetirementData, CalculationResult, InflationData, calculateRetirement, fetchInflationRate, LanguageTexts, getThaiTexts, getEnglishTexts } from './utils/retirementUtils';


// Add the new interfaces here
interface SectionState {
  showDetails: boolean;
  hasBeenInteracted: boolean;
  focusedInputs: Set<string>;
}

interface SectionsState {
  savings: SectionState;
  providentFund: SectionState;
  rmf: SectionState;
  lumpSum: SectionState;
}

const RetirementPlanner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<'th' | 'en'>(() => {
    const htmlLang = document.documentElement.lang;
    return htmlLang === 'th' ? 'th' : 'en';
  });
  const [showResults, setShowResults] = useState(false);
  const [appTexts, setAppTexts] = useState<LanguageTexts | null>(null);
  const [isStep1Valid, setIsStep1Valid] = useState(false);

  const [inflationData, setInflationData] = useState<InflationData | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      // Load texts
      try {
        const initialTexts = document.documentElement.lang === 'th' ? await getThaiTexts() : await getEnglishTexts();
        if (initialTexts) {
          setAppTexts(initialTexts);
        }
      } catch (error) {
        console.error('Failed to load initial texts:', error);
      }

      // Fetch inflation data
      try {
        const data = await fetchInflationRate();
        setInflationData(data);
      } catch (error) {
        console.error("Failed to fetch inflation rate:", error);
      }
    };

    initializeData();
  }, []); // Run once on mount to initialize texts and inflation data

  useEffect(() => {
    window.scrollTo(0, 0);

    const rootRetirementDiv = document.getElementById('root-retirement');
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

  useEffect(() => {
    const updateLanguageTexts = async () => {
      try {
        const newTexts = language === 'th' ? await getThaiTexts() : await getEnglishTexts();
        if (newTexts) {
          setAppTexts(newTexts);
        }
      } catch (error) {
        console.error('Failed to update language texts:', error);
      }
    };
    updateLanguageTexts();
    document.documentElement.lang = language; // Keep HTML lang attribute in sync
  }, [language]);

  const [data, setData] = useState<RetirementData>({
    monthlyIncome: 20000,
    currentAge: 30,
    retirementAge: 60,
    lifeExpectancy: 80,
    currentSavings: 0,
    savingsExpectedReturnRate: 3,
    annualSavingsIncreaseRate: 0,
    currentProvidentFundSavings: 0,
    providentFundExpectedReturnRate: 0,
    monthlySalary: 0,
    annualSalaryIncreaseRate: 0,
    providentFundContributionRate: 0,
    currentRMFSavings: 0,
    expectedAnnualRMFAccumulation: 0,
    rmfExpectedReturnRate: 0,
    lumpSumAtRetirement: 0,
    expectedAnnualInvestment: 0,
    lumpSumExpectedReturnRate: 0
  });

  const [sections, setSections] = useState<SectionsState>({
    savings: { showDetails: false, hasBeenInteracted: false, focusedInputs: new Set() },
    providentFund: { showDetails: false, hasBeenInteracted: false, focusedInputs: new Set() },
    rmf: { showDetails: false, hasBeenInteracted: false, focusedInputs: new Set() },
    lumpSum: { showDetails: false, hasBeenInteracted: false, focusedInputs: new Set() },
  });

  const [isStep2Valid, setIsStep2Valid] = useState(true);

  const [summaryCalculation, setSummaryCalculation] = useState<CalculationResult>(() => ({
    requiredAmount: 0,
    monthlySpending: 0,
    recommendedMonthlySaving: 0,
    alternativeMonthlySaving: 0,
    inflationRate: 0,
    totalCurrentAssetsAtRetirement: 0,
    afterretirerate: 0, // Initialize afterretirerate
  }));

  const [fullCalculation, setFullCalculation] = useState<CalculationResult | null>(null);

  // Debounce mechanism for API calls
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipSummaryCalculationRef = useRef(false); // New ref to skip calculation on back from results


  useEffect(() => {
    const calculateSummaryFromAPI = async () => {
      if (inflationData === null) {
        console.warn("Inflation data not yet fetched for summary calculation.");
        return;
      }

      // Clear any existing debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set a new debounce timeout
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const result = await calculateRetirement(data, inflationData, false); // Do not include alternative calculation for summary
          setSummaryCalculation(result);
        } catch (error) {
          console.error("Failed to calculate summary from API:", error);
          // Optionally, set summaryCalculation to a default or error state
        }
      }, 500); // Debounce for 500ms
    };

    // Only perform API calculation for summary when not showing results and current step is 2
    if (!showResults && currentStep === 2) {
      calculateSummaryFromAPI();
    }

    // Cleanup the timeout on component unmount or if dependencies change
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [currentStep, inflationData, showResults]);

  const totalSteps = 2;

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid) {
      return; // Prevent navigation if Step 1 is not valid
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
      skipSummaryCalculationRef.current = true; // Set flag to skip on next render
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    // Don't reset Step 2 call state when going back to maintain form state
  };

  const handleCalculate = async () => {
    // Ensure inflationRate is available before calculation
    if (inflationData === null) {
      console.error("Inflation data is not available for full calculation.");
      return;
    }
    const result = await calculateRetirement(data, inflationData, true); // Include alternative calculation for full results
    setFullCalculation(result);
    setShowResults(true);
  };

  const updateData = (field: keyof RetirementData, value: number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'th' ? 'en' : 'th');
  };

  return (
    <div className="bg-white">
      {appTexts ? (
        <div className="max-w-5xl mx-auto px-4 md:px-12 lg:px-[84px] py-8">
          <div className="text-center mb-14 md:mb-16">
            <div className="flex flex-col items-center justify-center my-8">
              <h1 className="font-h3-medium text-center mb-10 !font-bbl-medium">{appTexts.common.title}</h1>
              <div className="w-24 h-px bg-gray-90 rounded-full mb-4"></div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-b1-medium border z-10 !font-bbl-medium ${currentStep === 1
                  ? '!border-2 border-primary text-primary bg-white'
                  : 'bg-primary text-white border-primary'
                  }`}>
                  {currentStep === 1 ? '1' : '✓'}
                </div>
                <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 text-center whitespace-nowrap font-b1-medium !font-bbl-medium`}>
                  {appTexts.common.step1Label.split('\n').map((line, index, arr) => (
                    <div key={index}>
                      {line}
                      {index < arr.length - 1 && <br />}
                    </div>
                  ))}
                </div>
              </div>
              <div className={`xs:w-[6.5rem] md:!w-[9rem] ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-90'}`}></div>
              <div className="relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-b1-medium border z-10 !font-bbl-medium ${currentStep === 2 && !showResults
                  ? '!border-2 border-primary text-primary bg-white'
                  : (currentStep > 2 || showResults)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-gray-90 text-gray-60'
                  }`}>
                  {currentStep > 2 || showResults ? '✓' : '2'}
                </div>
                <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 text-center whitespace-nowrap font-b1-medium !font-bbl-medium`}>
                  {appTexts.common.step2Label.split('\n').map((line, index, arr) => (
                    <div key={index}>
                      {line}
                      {index < arr.length - 1 && <br />}
                    </div>
                  ))}
                </div>
              </div>
              <div className={`xs:w-[6.5rem] md:!w-[9rem] ${showResults ? 'bg-primary' : 'bg-gray-90'}`}></div>
              <div className="relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-b1-medium border z-10 !font-bbl-medium ${showResults
                  ? '!border-2 border-primary text-primary bg-primary'
                  : 'bg-gray-90 text-gray-60'
                  }`}>
                  {currentStep >= 3 || showResults ? '✓' : '3'}
                </div>
                <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 text-center whitespace-nowrap font-b1-medium !font-bbl-medium`}>
                  {appTexts.common.step3Label.split('\n').map((line, index, arr) => (
                    <div key={index}>
                      {line}
                      {index < arr.length - 1 && <br />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className='pt-3 sm:pt-0'>
              <div className={currentStep !== 1 ? 'hide-content-step1' : ''}>
                {currentStep === 1 && (
                  <Step1
                    data={data}
                    updateData={updateData}
                    language={language}
                    texts={appTexts}
                    onValidationChange={setIsStep1Valid}
                  />
                )}
              </div>

              <div className={currentStep !== 2 || showResults ? 'hide-content-step2' : ''}>
                {currentStep === 2 && !showResults && (
                  <Step2
                    data={data}
                    updateData={updateData}
                    language={language}
                    calculation={summaryCalculation}
                    texts={appTexts}
                    onValidationChange={setIsStep2Valid}
                    isStep2Active={currentStep === 2 && !showResults}
                    sections={sections}
                    setSections={setSections}
                  />
                )}
              </div>

              {showResults && fullCalculation && (
                <ResultsPage
                  calculation={fullCalculation}
                  summaryCalculation={summaryCalculation}
                  data={data}
                  language={language}
                  texts={appTexts}
                />
              )}
            </div>

            <div className="flex justify-center pb-8 pt-6 mt-0 md:mt-0 gap-6">
              {currentStep !== 1 ?
                <Button variant="outline" onClick={handleBack} className={`font-bbl-medium`}>
                  {appTexts.buttons.backButton}
                </Button>
                : <></>
              }
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className={`font-bbl-medium`} disabled={!isStep1Valid}>
                  {appTexts.buttons.nextButton}
                </Button>
              ) : !showResults ? (
                <Button
                  onClick={handleCalculate}
                  className={`font-bbl-medium ${!isStep2Valid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isStep2Valid}
                >
                  {appTexts.buttons.calculateButton}
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">Loading texts...</div>
      )}
    </div>
  );
};

export default RetirementPlanner;
