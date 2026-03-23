import { useState, useEffect } from 'react';
import { fetchInitialMaxValues, fetchTaxCalculationResult } from '@/pages/TaxSavingsPlan/services/taxSavingsApi';
import { buildCalculateReducePayload, buildCalculateSavingTaxReducePayload } from '../utils/payloadUtils';
import { TaxSavingsLanguageTexts, fetchTaxSavingsTexts } from '../utils/TaxSavingsConfigLoader';
import { TaxSavingsData, TaxCalculationResult, RecalculatePayload, AdditionalInvestments } from '../types';

export const useTaxSavings = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<'th' | 'en'>(() => {
    return document.documentElement.lang === 'th' ? 'th' : 'en';
  });
  const [showResults, setShowResults] = useState(false);
  const [appTexts, setAppTexts] = useState<TaxSavingsLanguageTexts | null>(null);
  const [data, setData] = useState<TaxSavingsData | null>(null);

  const [apiMaxValues, setApiMaxValues] = useState<Partial<TaxCalculationResult>>({});
  const [apiNewMaxValues, setApiNewMaxValues] = useState<Partial<TaxCalculationResult>>({});
  const [step1IsValid, setStep1IsValid] = useState(false);
  const [step2IsValid, setStep2IsValid] = useState(false);

  const [initialCalculationResult, setInitialCalculationResult] = useState<TaxCalculationResult | null>(null);
  const [calculationResult, setCalculationResult] = useState<TaxCalculationResult | null>(null);

  const [additionalInvestments, setAdditionalInvestments] = useState<AdditionalInvestments>({
    rmf: 0,
    thaiEsg: 0,
    lifeInsurance: 0,
    healthInsurance: 0,
    pensionInsurance: 0,
  });
  const [hasRecalculated, setHasRecalculated] = useState(false);
  const [fixedInitialCalculation, setFixedInitialCalculation] = useState<TaxCalculationResult | null>(null);


  useEffect(() => {
    if (initialCalculationResult && !fixedInitialCalculation) {
      setFixedInitialCalculation(initialCalculationResult);
    }
  }, [initialCalculationResult, fixedInitialCalculation]);


  useEffect(() => {
    const initializeData = async () => {
      try {
        const initialTexts = await fetchTaxSavingsTexts(language);
        if (initialTexts) {
          setAppTexts(initialTexts);
          const initialData: TaxSavingsData = {
            currentMonthlyIncome: initialTexts.config.defaults.currentMonthlyIncome || 0,
            otherIncome: 0,
            annualBonus: initialTexts.config.defaults.annualBonus || 0,
            providentFundContributionRate: initialTexts.config.defaults.providentFundContributionRate || 0,
            numberOfChildrenBefore2561: 0,
            numberOfChildrenAfter2561: initialTexts.config.defaults.numberOfChildrenAfter2561,
            parentalDeductionSelfFather: 0,
            parentalDeductionSelfMother: 0,
            parentalDeductionSpouseFather: 0,
            parentalDeductionSpouseMother: 0,
            healthInsurancePremium: 0,
            lifeInsurancePremium: 0,
            healthParentInsurancePremium: 0,
            lifePensionInsurancePremium: 0,
            rmfSavings: 0,
            thaiEsgSavings: 0,
            donation: 0,
            homeLoanInterest: 0,
            otherDeductions: 0,
          };
          setData(initialData);
        }
      } catch (error) {
        console.error('Failed to load texts or initialize data:', error);
      }
    };

    initializeData();
  }, [language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleNext = async () => {
    if (!data) {
      console.error('Data is not loaded yet.');
      return;
    }
    if (currentStep === 1) {
      if (!step1IsValid) return;
      try {
        const payload = buildCalculateReducePayload(data);
        const result = await fetchInitialMaxValues(payload);
        setApiMaxValues(result);
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error('Error calling API:', error);
      }
    } else if (currentStep === 2) {
      if (!step2IsValid) return;
      handleCalculate();
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
      setCurrentStep(2);
      // Reset states when going back from results
      setHasRecalculated(false);
      setAdditionalInvestments({
        rmf: 0,
        thaiEsg: 0,
        lifeInsurance: 0,
        healthInsurance: 0,
        pensionInsurance: 0,
      });
      setCalculationResult(initialCalculationResult); // Reset to initial calculation
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCalculate = async () => {
    try {
      if (!appTexts || !data) {
        console.error('App texts or data not loaded.');
        return;
      }
      const payload = buildCalculateSavingTaxReducePayload(data, appTexts);
// Call for max again
      const maxResult = await fetchInitialMaxValues(payload);
      setApiNewMaxValues(maxResult);
//      
      const result = await fetchTaxCalculationResult(payload);
      const calculatedBudget = result.BuyESGSummary + result.BuySSFSummary + result.BuyRMFSummary +
        result.BuyInsureSummary + result.BuyHealthInsureSummary + result.BuyInsure60Summary;
      const updatedResult = { ...result, Budget: calculatedBudget };
      setCalculationResult(updatedResult);
      setInitialCalculationResult(updatedResult);
      setShowResults(true);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error in handleCalculate:', error);
    }
  };

  const handleRecalculate = async (recalculateData: RecalculatePayload) => {
    setHasRecalculated(true);
    try {
      const result = await fetchTaxCalculationResult(recalculateData);
      const calculatedBudget = result.BuyESGSummary + result.BuySSFSummary + result.BuyRMFSummary +
        result.BuyInsureSummary + result.BuyHealthInsureSummary + result.BuyInsure60Summary;
      const updatedResult = { ...result, Budget: calculatedBudget };

      setCalculationResult(updatedResult);
    } catch (error) {
      console.error('Error in handleRecalculate:', error);
    }
  };

  const updateData = (field: keyof TaxSavingsData, value: number | string | boolean) => {
    if (!data) {
      console.error('Data is not loaded yet.');
      return;
    }
    setData(prev => ({ ...prev!, [field]: value }));
  };

  return {
    currentStep,
    setCurrentStep,
    language,
    showResults,
    setShowResults,
    appTexts,
    data,
    apiMaxValues,
    apiNewMaxValues,
    step1IsValid,
    setStep1IsValid,
    step2IsValid,
    setStep2IsValid,
    initialCalculationResult,
    calculationResult,
    handleNext,
    handleBack,
    handleCalculate,
    handleRecalculate,
    updateData,
    additionalInvestments,
    setAdditionalInvestments,
    hasRecalculated,
    fixedInitialCalculation
  };
};