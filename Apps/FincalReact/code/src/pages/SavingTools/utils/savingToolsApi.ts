import { SavingToolsInitialRates } from '../types';
import { fetchEnv } from '../../../utils/ConfigLoader';

export async function fetchSavingToolsInitialRates(): Promise<SavingToolsInitialRates | null> {
  try {
    const env = await fetchEnv();
    const url = `${env.VITE_INFLATION_API_BASE_URL}${env.VITE_INFLATION_API_PATH}`;
    if (!url) {
      console.error("InitialRate API URL is not defined.");
      return null;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Assuming the API returns an array, and we need the first element
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as SavingToolsInitialRates;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch saving tools initial rates:", error);
    return null;
  }
}

interface SavingToolsCalculationPayload {
  FutureSavingAmount: number;
  NYear: number;
  FirstSavingAmount: number;
  CompensationRate: number;
  SavingIncRate: number;
  inflationrate: number;
}

export interface SavingToolsCalculationResult {
  FutureValue: number;
  SavingMonth: number;
  savingIncreasePerYear: number;
  NoteIncreasedSavingMonthly?: string; // Add new field here
  NoteRecommendSavingMonthly?: string; // Add new field here
}

export interface GraphDataPoint {
  month: number; // Represents the sequential month number (1 to NYear * 12)
  accumulatedValue: number;
}

export function generateSavingGraphData(
  payload: SavingToolsCalculationPayload,
  monthlySaving: number
): GraphDataPoint[] {
  const data: GraphDataPoint[] = [];
  let accumulatedValue = payload.FirstSavingAmount;
  const monthlyCompensationRate = payload.CompensationRate / 12;

  // This variable will hold the interest calculated in the current month,
  // which will be added to the accumulatedValue at the beginning of the *next* month.
  let interestToApplyNextMonth = 0;

  for (let month = 0; month < payload.NYear * 12; month++) {
    // 1. Apply interest from the *previous* month (if any) at the beginning of the current month
    if (interestToApplyNextMonth > 0) {
      accumulatedValue += interestToApplyNextMonth;
      interestToApplyNextMonth = 0; // Reset for the current month
    }

    // 2. Add current month's saving amount.
    // The `SavingIncRate` is applied linearly to the monthly saving amount.
    if (month % 12 === 0 && month !== 0) {
      const currentMonthlySavingAmount = monthlySaving * (1 + payload.SavingIncRate);
      monthlySaving = currentMonthlySavingAmount; // Update for next month
    }
    accumulatedValue += monthlySaving;
    // 3. Calculate interest for *this* month. This interest will be applied at the beginning of the *next* month.
    const interestEarnedThisMonth = accumulatedValue * monthlyCompensationRate;
    interestToApplyNextMonth = interestEarnedThisMonth; // Store for next month

    // 4. Record the accumulated value for the graph.
    // The accumulatedValue at this point includes current month's saving and *previous* month's interest.
    // It does NOT include the interest earned *this* month, as that is applied *next* month.
    data.push({
      month: month+1,
      accumulatedValue: accumulatedValue,
    });

    // Special handling for the last month: The interest earned in the very last month
    // would normally be applied in the month *after* the simulation ends.
    // If the graph should show the *final* value including all earned interest up to that point,
    // we need to add the `interestToApplyNextMonth` (which holds the interest from the final month)
    // to the last data point.
    if (month === payload.NYear * 12) {
      const finalAccumulatedValue = accumulatedValue + interestToApplyNextMonth;
      data[data.length - 1].accumulatedValue = finalAccumulatedValue;
    }    
  }
  return data;
}

export async function calculateSavingTools(payload: SavingToolsCalculationPayload): Promise<SavingToolsCalculationResult | null> {
  try {
    const env = await fetchEnv();
    const url = `${env.VITE_API_BASE_URL}${env.VITE_SAVING_TOOLS_CALCULATION_API}`;
    if (!url) {
      console.error("Saving Tools Calculation API URL is not defined.");
      return null;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': env.VITE_SUBSCRIPTION_KEY, // Add subscription key if needed
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as SavingToolsCalculationResult;
  } catch (error) {
    console.error("Failed to calculate saving tools:", error);
    return null;
  }
}