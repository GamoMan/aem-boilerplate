import { fetchEnv, Env } from "../../../utils/ConfigLoader";

export interface TaxSavingsLanguageTexts {
  common: {
    title: string;
    step1Label: string;
    step2Label: string;
    step3Label: string;
    noteText: string;
    fatherLabel: string;
    motherLabel: string;
    maritalStatusLabel: string;
    unit: string;
  };
  buttons: {
    nextButton: string;
    backButton: string;
    calculateButton: string;
    recalculateButton: string;
  };
  steps: {
    step1: {
      currentMonthlyIncomeLabel: string;
      otherIncomeLabel: string;
      annualBonusLabel: string;
      providentFundContributionRateLabel: string;
    };
    step2: {
      familyDeductionLabel: string;
      familyDeductionHint: string;
      numberOfChildrenBefore2561Label: string;
      numberOfChildrenBefore2561Max: string;
      numberOfChildrenAfter2561Label: string;
      numberOfChildrenAfter2561Max: string;
      parentalDeductionSelfLabel: string;
      parentalDeductionSelfHint: string;
      parentalDeductionSelfMax: string;
      parentalDeductionSpouseLabel: string;
      parentalDeductionSpouseHint: string;
      parentalDeductionSpouseMax: string;
      insuranceSectionLabel: string;
      insuranceSectionHint: string;
      healthInsurancePremiumLabel: string;
      healthInsurancePremiumMax: string;
      lifeInsurancePremiumLabel: string;
      lifeInsurancePremiumMax: string;
      healthParentInsurancePremiumLabel: string;
      healthParentInsurancePremiumMax: string;
      lifePensionInsurancePremiumLabel: string;
      lifePensionInsurancePremiumMax: string;
      investmentSectionLabel: string;
      investmentSectionHint: string;
      rmfSavingsLabel: string;
      rmfSavingsMax: string;
      thaiEsgSavingsLabel: string;
      thaiEsgSavingsMax: string;
      otherDeductionsSectionLabel: string;
      otherDeductionsSectionHint: string;
      socialSecurityContributionLabel: string;
      donationLabel: string;
      donationMax: string;
      homeLoanInterestLabel: string;
      homeLoanInterestMax: string;
      otherDeductionsLabel: string;
      otherDeductionsMax: string;
    };
  };
  results: {
    taxToBePaidLabel: string;
    taxToBePaidOriginalLabel: string;
    taxToBePaidNewLabel: string;
    taxSavedLabel: string;
    taxRateLabel: string;
    taxRateRemainLabel: string;
    noTaxPayable: string;
    maxTaxSavingsResult: string;
    maxInvestmentSavingsResult: string;
    remainingTaxResult: string;
    chooseMoreInvestmentLabel: string;
    investmentAmountLabel: string;
    totalInvestmentLabel: string;
    rmfLabel: string;
    rmfMaxDeduction: string;
    thaiEsgLabel: string;
    thaiEsgMaxDeduction: string;
    lifeInsuranceLabel: string;
    lifeInsuranceMaxDeduction: string;
    healthInsuranceLabel: string;
    healthInsuranceMaxDeduction: string;
    pensionInsuranceLabel: string;
    pensionInsuranceMaxDeduction: string;
    totalAllInvestmentsLabel: string;
    canInvestMoreLabel: string;
    noRemainDeduction: string;
  };
  config: {
    deductions: {
      parentalDeductionAmount: number;
    };
    defaults: {
      currentMonthlyIncome: number;
      annualBonus: number;
      providentFundContributionRate: number;
      numberOfChildrenAfter2561: number;
    };
    individualMaxes: {
      rmf: number;
      thaiEsg: number;
      lifeInsurance: number;
      healthInsurance: number;
      pensionInsurance: number;
      combinedRMFPensionMax: number;
      combinedLifeHealthMax: number;
    };
  };
  th: {
    config: {
      validation: {
        percentageError: string;
        minValueError: string;
        maxValueError: string;
        combinedLifeHealthExceededError: string;
        combinedRMFPensionExceededError: string;
        thaiEsgExceededError: string;
      };
      notes: {
        title: string;
        investmentCalculation: string;
        rmfAndPension: string;
        lifeAndHealthInsurance: string;
        thaiEsg: string;
        noTaxPayableNote: string;
        taxNote: string;
        thaiEsgNote: string;
      };
    };
  };
  en: {
    config: {
      validation: {
        percentageError: string;
        minValueError: string;
        maxValueError: string;
        combinedLifeHealthExceededError: string;
        combinedRMFPensionExceededError: string;
        thaiEsgExceededError: string;
      };
      notes: {
        title: string;
        investmentCalculation: string;
        rmfAndPension: string;
        lifeAndHealthInsurance: string;
        thaiEsg: string;
        noTaxPayableNote: string;
        taxNote: string;
        thaiEsgNote: string;
      };
    };
  };
}


let cachedTaxSavingsTexts: TaxSavingsLanguageTexts | null = null;
let fetchTaxSavingsTextsPromise: Promise<TaxSavingsLanguageTexts> | null = null;

export const fetchTaxSavingsTexts = async (lang: 'th' | 'en'): Promise<TaxSavingsLanguageTexts> => {
  if (cachedTaxSavingsTexts) {
    return cachedTaxSavingsTexts;
  }

  if (fetchTaxSavingsTextsPromise) {
    return fetchTaxSavingsTextsPromise;
  }

  fetchTaxSavingsTextsPromise = (async () => {
    try {
      const env = await fetchEnv();
      const TEXTS_JSON_URL = env.VITE_TAX_SAVINGS_PLAN_TEXTS_JSON_PATH && env.VITE_TAX_SAVINGS_PLAN_TEXTS_JSON_PATH.startsWith('/') ? env.VITE_TAX_SAVINGS_PLAN_TEXTS_JSON_PATH : `${import.meta.env.BASE_URL}${env.VITE_TAX_SAVINGS_PLAN_TEXTS_JSON_PATH || 'taxsavings.json'}`;

      const response = await fetch(TEXTS_JSON_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} from ${TEXTS_JSON_URL}`);
      }
      const data = await response.json();
      
      const languageSpecificData = lang === 'th' ? data.th : data.en;

      cachedTaxSavingsTexts = {
        common: languageSpecificData.common,
        buttons: languageSpecificData.buttons,
        steps: languageSpecificData.steps,
        results: languageSpecificData.results,
        config: data.config, // Global config
        th: data.th, // Keep original th content
        en: data.en  // Keep original en content
      };
      return cachedTaxSavingsTexts;
    } catch (error) {
      console.error("Failed to load tax savings texts:", error);
      throw error;
    } finally {
      fetchTaxSavingsTextsPromise = null;
    }
  })();

  return fetchTaxSavingsTextsPromise;
};