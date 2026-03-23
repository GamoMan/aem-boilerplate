export interface SavingToolsInitialRates {
  tuitionrate: string;
  homeloanrate: string;
  inflationrate: string;
  afterretirerate: string;
}

export interface SavingToolsFormData {
  savingGoal: string;
  desiredSavingAmount: number;
  yearsToSave: number;
  savedAmount: number;
  expectedReturnRate: number;
  annualSavingIncreaseRate: number;
}

export interface RightCardData {
  // Define structure based on expected API response for the right card
  // Placeholder for now
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}