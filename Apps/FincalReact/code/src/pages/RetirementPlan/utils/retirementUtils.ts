import { fetchEnv } from '../../../utils/ConfigLoader';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface RetirementData {
  monthlyIncome: number;
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  savingsExpectedReturnRate: number;
  annualSavingsIncreaseRate: number;
  currentProvidentFundSavings: number;
  providentFundExpectedReturnRate: number;
  monthlySalary: number;
  annualSalaryIncreaseRate: number;
  providentFundContributionRate: number;
  currentRMFSavings: number;
  expectedAnnualRMFAccumulation: number;
  rmfExpectedReturnRate: number;
  lumpSumAtRetirement: number;
  expectedAnnualInvestment: number;
  lumpSumExpectedReturnRate: number;
}

export interface CalculationResult {
  requiredAmount: number; // Corresponds to TotalChargesValue from API
  monthlySpending: number; // Corresponds to FvMonthlyGoals from API
  recommendedMonthlySaving: number; // Corresponds to SavingMonth from API
  alternativeMonthlySaving: number; // New field for the alternative calculation
  inflationRate: number; // Still fetched separately
  totalCurrentAssetsAtRetirement: number;
  afterretirerate: number; // New field for after retirement rate from API
}

export interface LanguageTexts {
  common: {
    title: string;
    step1Label: string;
    step2Label: string;
    step3Label: string;
    unit:string;
    step2Title: string;
    requiredAmount: string;
    forSpending: string;
    noteText: string;
    reccomentText: string;
    futureValueDisclaimer: string;
  };
  buttons: {
    nextButton: string;
    backButton: string;
    calculateButton: string;
    getRecommendation: string;
    getRecommendationLink?: string;
    backToPlan: string;
  };
  notes:{
    disclaimer: string;
    disclaimerText: string;
  };
  validation: {
    percentageError: string;
    percentageSavingError: string;
    currentAgeRetirementAgeError: string;
    retirementAgeLifeExpectancyError: string;
    minValueError: string;
    maxValueError: string;
    betweenValueError?: string;
    betweenValuePlaceholder?: string;
    annualSavingsIncreaseRateError?: string;
  };
  steps: {
    step1: {
      monthlyIncomeTitle: string;
      currentValueNote: string;
      currentAge: string;
      retirementAge: string;
      lifeExpectancy: string;
    };
    step2: {
      savingsSection: string;
      currentSavingsLabel: string;
      savingsExpectedReturnRateLabel: string;
      annualSavingsIncreaseRateLabel: string;
      providentFundSection: string;
      currentProvidentFundSavingsLabel: string;
      providentFundExpectedReturnRateLabel: string;
      monthlySalaryLabel: string;
      annualSalaryIncreaseRateLabel: string;
      providentFundContributionRateLabel: string;
      rmfSection: string;
      currentRMFSavingsLabel: string;
      expectedAnnualRMFAccumulationLabel: string;
      rmfExpectedReturnRateLabel: string;
      lumpSumSection: string;
      lumpSumAtRetirementLabel: string;
      expectedAnnualInvestmentLabel: string;
      lumpSumExpectedReturnRateLabel: string;
    };
    results: {
      resultsTitle: string;
      resultsSubtitle: string;
      resultsGoalTitle: string;
      resultsGoal: string;
      recommendedMonthlySavingLabel: string;
      alternativeMonthlySavingLabel: string;
      byInvestingAt3Percent: string;
      byInvestingAt5Percent: string;
      currentSavingsStatus: string;
      retirementGoal: string;
      recommendedMonthlySavingResult: string;
      consistentInvestment: string;
      consistentInvestmentLink?: string;
      investmentReturnRate: string;
    };
  };
}

interface AllTexts {
  th: LanguageTexts | null;
  en: LanguageTexts | null;
}

// Define the path to texts.json from an environment variable, defaulting to '/texts.json' if not set.
// This path is relative to the 'public' directory, which is the base URL for static assets.
let allTextsPromise: Promise<AllTexts>;
let cachedAllTexts: AllTexts | null = null;

const fetchAllTexts = async (): Promise<AllTexts> => {
  if (cachedAllTexts) {
    return cachedAllTexts;
  }
  if (!allTextsPromise) {
    allTextsPromise = (async () => {
      try {
        const env = await fetchEnv();
        const textsJsonPath = env.VITE_RETIRED_PLAN_TEXTS_JSON_PATH;
        const TEXTS_JSON_URL = textsJsonPath && textsJsonPath.startsWith('/') ? textsJsonPath : `${import.meta.env.BASE_URL}${textsJsonPath}`;
        
        const response = await fetch(TEXTS_JSON_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} from ${TEXTS_JSON_URL}`);
        }
        const data = await response.json();
        cachedAllTexts = data; // Cache the fetched data
        return data;
      } catch (error) {
        console.error(`Failed to load language texts:`, error);
        // Provide a safe fallback if loading fails
        return {
          th: null,
          en: null,
        } as AllTexts;
      }
    })();
  }
  return allTextsPromise;
};

// Export functions to get the texts asynchronously
export const getAllTexts = async (): Promise<AllTexts> => {
  return fetchAllTexts();
};

export const getThaiTexts = async (): Promise<LanguageTexts | null> => {
  const texts = await fetchAllTexts();
  return texts.th;
};

export const getEnglishTexts = async (): Promise<LanguageTexts | null> => {
  const texts = await fetchAllTexts();
  return texts.en;
};

export const getInvestmentReturnText = async (language: 'th' | 'en', rate: number, texts: LanguageTexts,box: number): Promise<string> => {
  if (texts && texts.steps.results) {
      return box==1?texts.steps.results.byInvestingAt3Percent.replace('{rate}', rate.toString()):texts.steps.results.byInvestingAt5Percent.replace('{rate}', rate.toString());
  }
  return `Investment return at ${rate}%`; // Fallback text
};

export interface InflationData {
  inflationRate: number;
  afterretirerate: number;
}

// Retirement calculations
let cachedInflationData: InflationData | null = null;
let isFetchingInflationRate: boolean = false;
let inflationRatePromise: Promise<InflationData> | null = null;

export const fetchInflationRate = async (): Promise<InflationData> => {
  if (cachedInflationData !== null) {
    return cachedInflationData;
  }

  if (isFetchingInflationRate && inflationRatePromise) {
    return inflationRatePromise;
  }

  isFetchingInflationRate = true;
  inflationRatePromise = (async () => {
    try {
      const env = await fetchEnv();
      const inflationApiUrl = `${env.VITE_INFLATION_API_BASE_URL}${env.VITE_INFLATION_API_PATH}`;
      const response = await fetch(inflationApiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data && data.length > 0 && data[0].inflationrate && data[0].afterretirerate) {
        cachedInflationData = {
          inflationRate: data[0].inflationrate,
          afterretirerate: data[0].afterretirerate,
        };
        return cachedInflationData;
      }
      throw new Error('Inflation data not found in API response');
    } catch (error) {
      console.error("Failed to fetch inflation rate:", error);
      cachedInflationData = { inflationRate: 0.03, afterretirerate: 0.03 }; // Fallback to default if API fails, ensuring 3% inflation
      return cachedInflationData;
    } finally {
      isFetchingInflationRate = false;
      inflationRatePromise = null;
    }
  })();

  return inflationRatePromise;
};


export const calculateRetirement = async (data: RetirementData, inflationData: InflationData, includeAlternativeCalculation: boolean = true): Promise<CalculationResult> => {
  // The initial calculation for requiredAmount and monthlySpending will now be handled by the calling component
  // and passed down. So, we need to re-fetch the inflation rate for the payload here or pass it down.
  // Given the user's request, the inflation rate should be fetched once and passed down.

  const payload = {
    CurrentAGE: data.currentAge,
    RetireAGE: data.retirementAge,
    SavingAGE: data.lifeExpectancy,
    ChargesRetireAmount: data.monthlyIncome,
    SavingBeginAmount: data.currentSavings,
    CompensationRate: parseFloat((data.savingsExpectedReturnRate / 100).toFixed(4)),
    SavingIncRate: parseFloat((data.annualSavingsIncreaseRate / 100).toFixed(4)),
    SavingCurrent: data.currentProvidentFundSavings,
    IncomeRetire: data.monthlySalary,
    PVDRetire: parseFloat((data.providentFundContributionRate /100).toFixed(4)),
    IncIncomeRetire: parseFloat((data.annualSalaryIncreaseRate / 100).toFixed(4)),
    CompensationRateRetire: parseFloat((data.providentFundExpectedReturnRate / 100).toFixed(4)),
    RMFSumRetire: data.currentRMFSavings,
    RMFSavingRateRetire: parseFloat((data.expectedAnnualRMFAccumulation).toFixed(4)),
    RMFCompensationRateRetire: parseFloat((data.rmfExpectedReturnRate / 100).toFixed(4)),
    SumYearRetire: data.expectedAnnualInvestment,
    YearCompensationRateRetire:parseFloat(( data.lumpSumExpectedReturnRate / 100).toFixed(4)),
    OneTimeMoneyRetire: data.lumpSumAtRetirement,
    inflationrate: inflationData.inflationRate, // Use the passed inflation rate
    afterretirerate: inflationData.afterretirerate // Include the afterretirerate from the payload
  };

  try {
    const env = await fetchEnv();
    const response = await fetch(`${env.VITE_API_BASE_URL}${env.VITE_API_CALCULATE_RETIREMENT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ocp-apim-subscription-key': env.VITE_SUBSCRIPTION_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API error! status: ${response.status}`);
    }

    const result = await response.json();

    const totalCurrentAssetsAtRetirement = data.currentSavings;

    let alternativeMonthlySaving = 0;
    if (includeAlternativeCalculation) {
      const alternativeRate = data.savingsExpectedReturnRate < 100 ? data.savingsExpectedReturnRate + 2 : data.savingsExpectedReturnRate;
      const alternativePayload = {
        ...payload,
        CompensationRate: parseFloat((alternativeRate / 100).toFixed(4)),
      };

      const env = await fetchEnv();
      const alternativeResponse = await fetch(`${env.VITE_API_BASE_URL}${env.VITE_API_CALCULATE_RETIREMENT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ocp-apim-subscription-key': env.VITE_SUBSCRIPTION_KEY
        },
        body: JSON.stringify(alternativePayload)
      });

      if (!alternativeResponse.ok) {
        throw new Error(`API error for alternative calculation! status: ${alternativeResponse.status}`);
      }

      const alternativeResult = await alternativeResponse.json();
      alternativeMonthlySaving = alternativeResult.SavingMonth ?? 0;
    }

    return {
      requiredAmount: result.TotalChargesValue, // These will come from API now for full calculation
      monthlySpending: result.FvMonthlyGoals,   // These will come from API now for full calculation
      recommendedMonthlySaving: result.SavingMonth ?? 0,
      alternativeMonthlySaving: alternativeMonthlySaving,
      inflationRate: inflationData.inflationRate, // Use the passed inflation rate
      totalCurrentAssetsAtRetirement: totalCurrentAssetsAtRetirement,
      afterretirerate: inflationData.afterretirerate, // Include the afterretirerate from the payload
    };

  } catch (error) {
    console.error("Failed to fetch retirement calculation from API:", error);
    throw error;
  }
};