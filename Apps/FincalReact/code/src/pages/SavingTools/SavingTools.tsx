import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { SavingToolsInitialRates, SavingToolsFormData } from './types';
import { calculateSavingTools, SavingToolsCalculationResult, GraphDataPoint, generateSavingGraphData } from '@/pages/SavingTools/utils/savingToolsApi';
import { RightCardData } from './utils/savingToolsTexts';
import { getCachedSavingToolsInitialRates } from './utils/apiCache';
import { SavingToolsLanguageTexts, getSavingToolsThaiTexts, getSavingToolsEnglishTexts, AllSavingToolsTexts } from '@/pages/SavingTools/utils/savingToolsTexts';
import SavingToolsResultBox from '@/pages/SavingTools/components/SavingToolsResultBox';
import SavingToolsGraph from '@/pages/SavingTools/Graph/SavingToolsGraph';
import RightCard from '@/pages/SavingTools/components/RightCard';
import SavingToolsInputForm from '@/pages/SavingTools/components/SavingToolsInputForm';
import SavingToolsSliders from '@/pages/SavingTools/components/SavingToolsSliders';
import { set } from 'date-fns';

const defaultEmptyCalculationResult: SavingToolsCalculationResult = {
  FutureValue: 0,
  SavingMonth: 0,
  savingIncreasePerYear: 0,
};

const trulyEmptyFormData: SavingToolsFormData = {
  savingGoal: '',
  desiredSavingAmount: 0,
  yearsToSave: 0,
  savedAmount: 0,
  expectedReturnRate: 0,
  annualSavingIncreaseRate: 0,
};

const SavingTools: React.FC = () => {
  const [initialRates, setInitialRates] = useState<SavingToolsInitialRates | null>(null);
  const [originalCalculationResult, setOriginalCalculationResult] = useState<SavingToolsCalculationResult | null>(null); // Store initial result
  const [originalGraphData, setOriginalGraphData] = useState<GraphDataPoint[] | null>(null);
  const [calculationResult, setCalculationResult] = useState<SavingToolsCalculationResult>(defaultEmptyCalculationResult);
  const [currentGraphData, setCurrentGraphData] = useState<GraphDataPoint[] | null>(null);
  const [hasSliderBeenUsed, setHasSliderBeenUsed] = useState(false);
  const [language, setLanguage] = useState<'th' | 'en'>(() => document.documentElement.lang === 'th' ? 'th' : 'en');
  const [appTexts, setAppTexts] = useState<(SavingToolsLanguageTexts & { defaultFormValues: AllSavingToolsTexts['defaultFormValues'] }) | null>(null);
  const [displayCard, setDisplayCard] = useState<RightCardData | null>(null); // State to hold the currently displayed card
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  const [formData, setFormData] = useState<SavingToolsFormData>(trulyEmptyFormData);
  const [sliderFormData, setSliderFormData] = useState<SavingToolsFormData>(trulyEmptyFormData);
  const [displayedFormData, setDisplayedFormData] = useState<SavingToolsFormData>(trulyEmptyFormData);
  const [displayedMaxDesiredSavingAmount, setDisplayedMaxDesiredSavingAmount] = useState<number>(0);
  const [displayedMaxExpectedReturnRate, setDisplayedMaxExpectedReturnRate] = useState<number>(0);
  // State to manage validation errors for each input
  const [errors, setErrors] = useState({
    desiredSavingAmount: '',
    yearsToSave: '',
    savedAmount: '',
    expectedReturnRate: '',
    annualSavingIncreaseRate: '',
  });

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isShowresultSection, setIsShowresultSection] = useState(false);

  const calculateDesiredSavingStep = useCallback((currentValue: number) => {
    if (currentValue < 1000000) {
      return 10000;
    } else {
      return 10000;
    }
  }, []);

  const maxDesiredSavingAmount = useMemo(() => {
    // Ensure the max is at least the current slider value and a sensible minimum
    return Math.max(formData.desiredSavingAmount * 2, formData.desiredSavingAmount * 2);
  }, [formData.desiredSavingAmount]);

  const maxExpectedReturnRate = useMemo(() => {
    // Max value is 2 times the form input, but not exceeding 50
    return 40;
  }, []);

  const stepDesiredSavingAmount = useMemo(() => {
    // return calculateDesiredSavingStep(sliderFormData.desiredSavingAmount);
    return calculateDesiredSavingStep(maxDesiredSavingAmount);
  }, [maxDesiredSavingAmount, calculateDesiredSavingStep]);

  const roundCalculationResult = useCallback((result: SavingToolsCalculationResult | null) => {
    if (!result) return null;
    return {
      ...result,
      FutureValue: Math.round(result.FutureValue),
      SavingMonth: Math.round(result.SavingMonth),
    };
  }, []);

  const createCalculationPayload = useCallback((data: SavingToolsFormData) => ({
    FutureSavingAmount: data.desiredSavingAmount,
    NYear: data.yearsToSave,
    FirstSavingAmount: data.savedAmount,
    CompensationRate: data.expectedReturnRate / 100,
    SavingIncRate: data.annualSavingIncreaseRate / 100,
    inflationrate: initialRates ? parseFloat(initialRates.inflationrate) : 0,
  }), [initialRates]);

  const fetchInitialData = useCallback(async () => {
    try {
      const ratesData = await getCachedSavingToolsInitialRates();
      if (ratesData) {
        setInitialRates(ratesData);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }, []); // Removed roundCalculationResult from dependencies as it's not used here

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const updateTextsAndDefaultForms = useCallback(async () => {
    try {
      const newTexts = language === 'th' ? await getSavingToolsThaiTexts() : await getSavingToolsEnglishTexts();
      if (newTexts) {
        setAppTexts(newTexts);
        setFormData(newTexts.defaultFormValues);
        // If the default saving goal is empty, display the placeholder card
        if (newTexts.defaultFormValues.savingGoal === '') {
          setDisplayCard(null);
        } else {
          setDisplayCard(newTexts.cards[0]); // Otherwise, display the first card
        }
        setDisplayedFormData(newTexts.defaultFormValues); // Initialize displayedFormData
      }
    } catch (error) {
      console.error('Failed to update language texts:', error);
    }
  }, [language]);

  useEffect(() => {
    updateTextsAndDefaultForms();
    document.documentElement.lang = language;
  }, [language, updateTextsAndDefaultForms]);

  const validateRates = useCallback((
    currentFormData: SavingToolsFormData,
    currentErrors: typeof errors,
    fieldChanged: keyof SavingToolsFormData
  ) => {
    const annualRate = Number(currentFormData.annualSavingIncreaseRate);
    const expectedRate = Number(currentFormData.expectedReturnRate);

    const errorMessage = appTexts?.validation.annualSavingIncreaseRateError ||
      (language === 'th'
        ? 'อัตราการเพิ่มเงินออมต่อปีต้องไม่สูงกว่าผลตอบแทนที่คาดหวังต่อปี'
        : 'Annual saving increase rate must not be greater than expected annual return rate');

    let newErrors = { ...currentErrors };

    if (annualRate > expectedRate && annualRate > 0) {
      newErrors = {
        ...newErrors,
        annualSavingIncreaseRate: errorMessage,
        expectedReturnRate: errorMessage,
      };
    } else {
      newErrors = {
        ...newErrors,
        annualSavingIncreaseRate: '',
        expectedReturnRate: '',
      };
    }
    return newErrors;
  }, [appTexts, language]);

  const [isFormValid, setIsFormValid] = useState(true); // Assuming empty form is valid for initial display

  const validationStates = useRef<{ [key: string]: boolean }>({});

  const checkFormValidity = useCallback((currentValidationStates: { [key: string]: boolean }) => {
    const allInputFormatsValid = Object.values(currentValidationStates).every(Boolean);
    const noCustomErrors = Object.values(errors).every(error => !error); // Directly use 'errors' state
    setIsFormValid(allInputFormatsValid && noCustomErrors);
  }, [errors]); // Add 'errors' to dependency array

  const handleValidationChange = useCallback((field: string, isValid: boolean) => {
    validationStates.current = { ...validationStates.current, [field]: isValid };
    checkFormValidity(validationStates.current); // No longer pass errors as it's read directly
  }, [checkFormValidity]); // Removed 'errors' from dependencies

  const handleInputChange = useCallback((field: keyof SavingToolsFormData, value: string | number) => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, [field]: value };

      setErrors(prevErrors => {
        let newErrors = { ...prevErrors };
        if (field === 'annualSavingIncreaseRate' || field === 'expectedReturnRate') {
          newErrors = validateRates(updatedFormData, newErrors, field);
        }
        checkFormValidity(validationStates.current);
        return newErrors;
      });
      return updatedFormData;
    });
  }, [validateRates, checkFormValidity]); // Removed 'errors' from dependencies

  const handleSliderChange = useCallback((field: keyof SavingToolsFormData, value: number) => {
    setSliderFormData(prev => {
      let newSliderData = { ...prev, [field]: value };

      // If expectedReturnRate is being changed, ensure annualSavingIncreaseRate does not exceed it
      if (field === 'expectedReturnRate') {
        if (newSliderData.annualSavingIncreaseRate > newSliderData.expectedReturnRate) {
          newSliderData = { ...newSliderData, annualSavingIncreaseRate: newSliderData.expectedReturnRate };
        }
      }

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        const payload = createCalculationPayload(newSliderData);

        const result = await calculateSavingTools(payload);
        if (result) {
          const adjustedResult = {
            ...result,
            savingIncreasePerYear: newSliderData.annualSavingIncreaseRate === 0 ? 0 : result.savingIncreasePerYear,
          };
          setCalculationResult(roundCalculationResult(adjustedResult));
          setCurrentGraphData(generateSavingGraphData(payload, adjustedResult.SavingMonth));
          setHasSliderBeenUsed(true); // Mark that the slider has been used
        }
      }, 2000); // Debounce for 500ms
      return newSliderData;
    });
  }, [roundCalculationResult, createCalculationPayload]);

  const handleAnnualSavingIncreaseRateSliderChange = useCallback((value: number[]) => {
    const newValue = value[0];
    const maxAllowed = sliderFormData.expectedReturnRate > 0 ? sliderFormData.expectedReturnRate : 100;
    if (newValue <= maxAllowed) {
      handleSliderChange('annualSavingIncreaseRate', newValue);
    } else {
      handleSliderChange('annualSavingIncreaseRate', maxAllowed);
    }
  }, [handleSliderChange, sliderFormData.expectedReturnRate]);

  const resetFormToEmpty = useCallback((keepSavingGoal: string | null = null) => {
    if (!appTexts) return; // Ensure appTexts is loaded

    const newFormData = keepSavingGoal
      ? { ...appTexts.defaultFormValues, savingGoal: keepSavingGoal }
      : appTexts.defaultFormValues;

    setFormData(newFormData);
    setSliderFormData(newFormData);
    setDisplayedFormData(newFormData);
    setDisplayedMaxDesiredSavingAmount(0);
    setDisplayedMaxExpectedReturnRate(0);
    setErrors({
      desiredSavingAmount: '',
      yearsToSave: '',
      savedAmount: '',
      expectedReturnRate: '',
      annualSavingIncreaseRate: '',
    });

    // Reset form validity and clear validation states
    setIsFormValid(true); // Assuming empty form is valid for initial display
    validationStates.current = {};

    setOriginalCalculationResult(null);
    setOriginalGraphData(null);
    setCalculationResult(defaultEmptyCalculationResult);
    setCurrentGraphData(null);
    setHasSliderBeenUsed(false);
    setHasCalculated(false); // Reset hasCalculated
  }, [appTexts]);

  const handleCalculate = useCallback(async () => {
    if (!isFormValid || !formData.savingGoal) { // Disable calculation if form is invalid or savingGoal is empty/null
      return;
    }

    const payload = createCalculationPayload(formData);
    const result = await calculateSavingTools(payload);
    if (result) {
      setIsShowresultSection(true);
      showSuggesion(true);
      const adjustedResult = {
        ...result,
        savingIncreasePerYear: formData.annualSavingIncreaseRate === 0 ? 0 : result.savingIncreasePerYear,
      };
      setOriginalCalculationResult(roundCalculationResult(adjustedResult));
      const graphData = generateSavingGraphData(payload, adjustedResult.SavingMonth);
      setOriginalGraphData(graphData);
      setSliderFormData(formData); // Sync slider data with form data after main calculation
      setDisplayedFormData(formData); // Update displayed data for sliders
      setDisplayedMaxDesiredSavingAmount(maxDesiredSavingAmount); // Update displayed max desired saving amount
      setDisplayedMaxExpectedReturnRate(maxExpectedReturnRate); // Update displayed max expected return rate
      setHasSliderBeenUsed(false); // Reset slider usage flag
      setCalculationResult(defaultEmptyCalculationResult); // Reset secondary calculation result
      setCurrentGraphData(null); // Reset current graph data
      setHasCalculated(true); // Mark that calculation has been performed
    }
  }, [isFormValid, formData, roundCalculationResult, createCalculationPayload, maxDesiredSavingAmount, maxExpectedReturnRate]);

  const handleClearButtonClick = useCallback(() => {
    if (appTexts) {
      resetFormToEmpty(''); // Reset savingGoal to empty
      setDisplayCard(null); // Display placeholder card
      setOriginalCalculationResult(null);
      setIsShowresultSection(false);
      showSuggesion(false);
    }
  }, [appTexts, resetFormToEmpty]);

  const goalToCategoryMap = useMemo(() => {
    const map: Record<string, { th: string; en: string }> = {};
    if (appTexts?.savingGoals) {
      appTexts.savingGoals.forEach(goal => {
        map[goal.value] = {
          th: goal.label,
          en: goal.label
        };
      });
    }
    return map;
  }, [appTexts?.savingGoals]);

  const handleSavingGoalChange = useCallback((value: string) => {
    // Always call handleInputChange to update the savingGoal in formData
    handleInputChange('savingGoal', value);

    if (value === '' && appTexts) {
      // If the dropdown is set to empty, reset all form fields except the language texts
      resetFormToEmpty();
      setDisplayCard(null); // Display placeholder card if dropdown is empty
      setIsShowresultSection(false);
      showSuggesion(false);
      return;
    }

    // If a specific goal is selected, reset other form fields but keep the selected savingGoal
    resetFormToEmpty(value);
    setIsShowresultSection(false);
    showSuggesion(false);

    const selectedCategoryLabel = goalToCategoryMap[value]?.[language];
    const matchingCard = appTexts?.cards.find(card =>
      (card.category === selectedCategoryLabel) ||
      (language === 'th' && card.category === goalToCategoryMap[value]?.th) ||
      (language === 'en' && card.category === goalToCategoryMap[value]?.en)
    );
    // Update displayed card, or default to first card if no match
    setDisplayCard(matchingCard || appTexts?.cards[0] || null);
  }, [appTexts, language, handleInputChange, goalToCategoryMap, resetFormToEmpty]);

  const handleCalculateButtonClick = useCallback(() => handleCalculate(), [handleCalculate]);

  const showSuggesion = (show) => {
    const rootSavingDiv = document.getElementById('root-saving-tools');
    if (rootSavingDiv) {
      let nextSibling = rootSavingDiv.nextElementSibling;
      while (nextSibling) {
        if (nextSibling.tagName === 'DIV' && nextSibling.classList.contains('wrapper')) {
          const rootSavingDiv = nextSibling as HTMLElement;
          if (show) {
            rootSavingDiv.classList.remove('hide-content');
            rootSavingDiv.classList.add('show-content');
          } else {
            rootSavingDiv.classList.remove('show-content');
            rootSavingDiv.classList.add('hide-content');
          }
          break;
        }
        nextSibling = nextSibling.nextElementSibling;
      }
    }
  }


  return (
    <div className="bg-white">
      {appTexts ? (
        <div className="max-w-[1752px] mx-auto px-4 md:px-12 lg:px-[84px] py-8">
          <div className="flex flex-col items-center justify-center my-8">
            <h1 className="font-h3-medium text-center mb-10 !font-bbl-medium">{appTexts.common.title}</h1>
            <div className="w-24 h-px bg-gray-90 rounded-full mb-4"></div>
          </div>
          {/* Top Section: Input Fields and Main Result */}
          <div className="fincal-grid grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
            {/* Left Column (col-span-2 on medium and up): Input Fields */}
            <SavingToolsInputForm
              formData={formData}
              errors={errors}
              appTexts={appTexts}
              language={language}
              isFormValid={isFormValid}
              savingGoal={formData.savingGoal}
              handleInputChange={handleInputChange}
              handleValidationChange={handleValidationChange}
              handleSavingGoalChange={handleSavingGoalChange}
              handleClearButtonClick={handleClearButtonClick}
              handleCalculateButtonClick={handleCalculateButtonClick}
              goalToCategoryMap={goalToCategoryMap}
            />
            {/* Right Column (col-span-1 on medium and up): Main Result */}
            <div className="md:col-span-1">
              <h2 className="font-h5-medium mb-4 text-left !font-bbl-medium">
                {appTexts.common.resultsTitle}
              </h2>
              <SavingToolsResultBox
                calculation={originalCalculationResult}
                texts={appTexts}
                formData={displayedFormData}
                variant={'blue'} // Always blue for the top section
                className="w-full"
                inflationRate={initialRates?.inflationrate || '0'}
                afterretireRate={initialRates?.afterretirerate || '0'}
                expectedReturnRate={displayedFormData.expectedReturnRate}
                annualSavingIncreaseRate={displayedFormData.annualSavingIncreaseRate}
              />
            </div>
          </div>
          {/* Middle Section: Graph */}
          <div className={`saving ${isShowresultSection ? 'show-result-section' : 'hide-result-section'}`}>
            {originalCalculationResult && originalCalculationResult.SavingMonth > 0 && (
              <>
                <div className="fincal-grid grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="md:col-span-2 p-4 rounded-lg border border-gray h-full">
                    {appTexts && originalGraphData && (
                      <SavingToolsGraph
                        originalGraphData={originalGraphData}
                        currentGraphData={currentGraphData}
                        originalCalculationResult={originalCalculationResult}
                        currentCalculationResult={calculationResult}
                        yearsToSave={formData.yearsToSave}
                        texts={appTexts}
                        isInitialState={!hasSliderBeenUsed}
                      />
                    )}
                  </div>
                  {/* Right Column (col-span-1 on medium and up): Right Card (Top) */}
                  <div className="md:col-span-1">
                    {/* <h2 className="font-h5-medium mb-3 text-left !font-bbl-medium">
                {appTexts.common.rightCardTitle}
              </h2> */}
                    {appTexts && (
                      <RightCard cardData={displayCard} texts={appTexts} />
                    )}
                  </div>
                </div>
                {/* Bottom Section: Sliders and New Calculation Result */}
                <div className="fincal-grid grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <SavingToolsSliders
                    appTexts={appTexts}
                    formData={displayedFormData}
                    sliderFormData={sliderFormData}
                    initialRates={initialRates}
                    calculationResult={calculationResult}
                    hasSliderBeenUsed={hasSliderBeenUsed}
                    maxDesiredSavingAmount={displayedMaxDesiredSavingAmount}
                    maxExpectedReturnRate={displayedMaxExpectedReturnRate}
                    stepDesiredSavingAmount={stepDesiredSavingAmount}
                    handleSliderChange={handleSliderChange}
                    handleAnnualSavingIncreaseRateSliderChange={handleAnnualSavingIncreaseRateSliderChange}
                    disabled={!hasCalculated}
                  />
                  {/* Right Column (col-span-1 on large and up): New Calculation Result */}
                  <div className="md:col-span-1 mt-8 md:mt-0">
                    <h2 className="font-h5-medium mb-4 text-left !font-bbl-medium">
                      {appTexts.common.newCalculationResultsTitle} {/* New text for this section */}
                    </h2>
                    {appTexts ? (
                      <SavingToolsResultBox
                        calculation={calculationResult}
                        texts={appTexts}
                        formData={sliderFormData}
                        variant={'white'}
                        className="w-full"
                        isInitialState={!hasSliderBeenUsed}
                        inflationRate={initialRates?.inflationrate || '0'}
                        afterretireRate={initialRates?.afterretirerate || '0'}
                        expectedReturnRate={sliderFormData.expectedReturnRate}
                        annualSavingIncreaseRate={sliderFormData.annualSavingIncreaseRate}
                      />
                    ) : (
                      <div className="text-center p-8 font-bbl">{appTexts.common.loadingCalculationResults}</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 font-bbl">Loading texts...</div>
      )}
    </div>
  );
};
export default memo(SavingTools);