import { fetchEnv } from '../../../utils/ConfigLoader';

export interface RightCardData {
  id: string;
  category: string;
  imageUrl: string;
  title: string;
  backgroundColor: string;
  description: string;
  link: string;
}

export interface SavingGoalOption {
  value: string;
  label: string;
}

export interface SavingToolsLanguageTexts {
  common: {
    title: string;
    calculateButton: string;
    unit: string;
    yearUnit: string;
    monthUnit: string; // Added monthUnit
    percentUnit: string;
    backButton: string;
    nextButton: string;
    noteText: string;
    step1Title: string;
    step2Title: string;
    rightCardTitle: string;
    loadingCardData: string;
    learnMore: string;
    resultPlaceholder: string;
    toHaveMoney: string;
    inYearsAhead: string;
    calculateButtonText: string;
    resultsTitle: string;
    loadingCalculationResults: string;
    additionalCalculationResultsTitle: string;
    loadingTexts: string;
    allCategory: string;
    totalSavingsUnit: string; // New: "เงินออมรวม (บาท)"
    yearLabel: string; // New: "ปี"
    startInvesting: string; // New text for the button
    adjustCalculationTitle: string; // New: "ปรับแก้ข้อมูลการคำนวณ"
    newCalculationResultsTitle: string; // New: "ผลการคำนวณใหม่"
    sliderTooltip: string; // New: "เลื่อนเพื่อปรับค่า"
    noteincreasedSavingMonthly: string;
    noterecommendSavingMonthly: string;
  };
  validation: {
    minValueError: string;
    maxValueError: string;
    percentageError: string;
    requiredField: string;
    minYearsToSave: string;
    maxYearsToSave: string;
    minDesiredSavingAmount: string;
    maxDesiredSavingAmount: string;
    annualSavingIncreaseRateError: string;
  };
  inputs: {
    savingGoal: string;
    desiredSavingAmount: string;
    desiredSavingAmountPlaceholder: string;
    yearsToSave: string;
    yearsToSavePlaceholder: string;
    savedAmount: string;
    savedAmountPlaceholder: string;
    expectedReturnRate: string;
    expectedReturnRatePlaceholder: string;
    annualSavingIncreaseRate: string;
    annualSavingIncreaseRatePlaceholder: string;
  };
  results: {
    futureValue: string;
    savingMonth: string;
    recommendSavingMonthly: string;
    increasedSavingMonthly: string; // Moved here
    noSavingRequired: string;
    graph: {
      originalFutureValue: string;
      originalMonthlySavings: string;
      newFutureValue: string;
      newMonthlySavings: string;
      monthPrefix: string;
      yearPrefix: string;
      originalCalculation: string; // New: "ผลการคำนวณเดิม"
      newCalculation: string; // New: "ผลการคำนวณที่ปรับใหม่"
      monthlySavingLabel: string; // New: "เงินออมต่อเดือน"
      savingGoalLabel: string; // New: "เป้าหมายเงินออม"
      legendTitle: string; // New: "คำอธิบายกราฟ"
      originalCalculationLabel: string; // New: "ผลการคำนวณเดิม"
      newCalculationLabel: string; // New: "ผลการคำนวณที่ปรับใหม่"
      savingIncreasedSteppedLabel: string; // New: "ออมเพิ่มขึ้น แบบขั้นบันได"
      constantSavingLabel: string; // New: "ออมคงที่"
      yAxisLabel: string; // New: "มูลค่าเงินสะสม (บาท)"
      xAxisLabel: string; // New: "ปี"
    };
  };
  cards: RightCardData[];
  savingGoals: SavingGoalOption[];
}

export interface AllSavingToolsTexts {
  th: SavingToolsLanguageTexts;
  en: SavingToolsLanguageTexts;
  defaultFormValues: {
    savingGoal: string;
    desiredSavingAmount: number;
    yearsToSave: number;
    savedAmount: number;
    expectedReturnRate: number;
    annualSavingIncreaseRate: number;
  };
}

let allSavingToolsTextsPromise: Promise<AllSavingToolsTexts> | null = null;
let cachedAllSavingToolsTexts: AllSavingToolsTexts | null = null;

const fetchAllSavingToolsTexts = async (): Promise<AllSavingToolsTexts> => {
  if (cachedAllSavingToolsTexts) {
    return cachedAllSavingToolsTexts;
  }
  allSavingToolsTextsPromise = (async () => {
    const env = await fetchEnv();
    const textsJsonPath = env.VITE_SAVING_TOOLS_TEXTS_JSON_PATH;
    const TEXTS_JSON_URL = textsJsonPath && textsJsonPath.startsWith('/') ? textsJsonPath : `${import.meta.env.BASE_URL}${textsJsonPath}`;

    const response = await fetch(TEXTS_JSON_URL);

    try {
      const response = await fetch(TEXTS_JSON_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} from ${TEXTS_JSON_URL}`);
      }
      const data = await response.json();
      cachedAllSavingToolsTexts = data;
      return data;
    } catch (error) {
      console.error(`Failed to load saving tools language texts from ${TEXTS_JSON_URL}:`, error);
      // Provide a default empty structure in case of error
      return {
          th: null,
          en: null,
      };
    }
  })();
  return allSavingToolsTextsPromise;
};

export const getSavingToolsThaiTexts = async (): Promise<SavingToolsLanguageTexts & { defaultFormValues: AllSavingToolsTexts['defaultFormValues'] }> => {
  const texts = await fetchAllSavingToolsTexts();
  return { ...texts.th, defaultFormValues: texts.defaultFormValues };
};

export const getSavingToolsEnglishTexts = async (): Promise<SavingToolsLanguageTexts & { defaultFormValues: AllSavingToolsTexts['defaultFormValues'] }> => {
  const texts = await fetchAllSavingToolsTexts();
  return { ...texts.en, defaultFormValues: texts.defaultFormValues };
};