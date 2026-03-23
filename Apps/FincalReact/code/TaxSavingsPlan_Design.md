# Tax Savings Plan Design Document

## 1. Introduction
This document details the design considerations, architecture, data flow, and key algorithms for the Tax Savings Plan module within the Pension Plan Navigator application. It expands upon the component overview provided in the Tax Savings Plan Context Document by delving deeper into the technical implementation and interactions, particularly focusing on API integrations for calculations.

## 2. High-Level Architecture and Data Flow
The Tax Savings Plan module guides users through a multi-step process, collecting financial data and leveraging external API services for complex tax calculations. The `TaxSavingsPlanner` component acts as the central hub, managing state and coordinating interactions between user input, API calls, and result display.

### 2.1. User Interaction Flow
1.  **Step 1 (TSStep1)**: Gathers basic income information.
2.  **API Call (Initial Max Values)**: After Step 1, an API call (`fetchInitialMaxValues`) is made to get initial maximum deduction values based on income.
3.  **Step 2 (TSStep2)**: Collects detailed deduction information, with dynamic maximums based on the previous API call.
4.  **API Call (Tax Calculation)**: After Step 2, a comprehensive API call (`fetchTaxCalculationResult`) is made to calculate the tax and potential savings.
5.  **Results (TSResultsPage)**: Displays the calculated tax savings and allows for recalculation with additional investments.

### 2.2. Data Flow Diagram
```mermaid
graph TD
    A[User Input (TSStep1)] --> B{TaxSavingsPlanner State};
    B -- TaxSavingsData --> C[fetchInitialMaxValues (API)];
    C -- Partial<TaxCalculationResult> --> B;
    B --> D[User Input (TSStep2)];
    D --> B;
    B -- TaxSavingsData --> E[fetchTaxCalculationResult (API)];
    E -- TaxCalculationResult --> B;
    B -- TaxCalculationResult --> F[TSResultsPage];
    F -- RecalculatePayload --> E;
```

## 3. Data Models

### 3.1. `TaxSavingsData` (Input Data)
This interface defines the structure of all user-provided inputs for the tax savings calculation.
*   `currentMonthlyIncome`: User's current monthly income.
*   `otherIncome`: Other income sources.
*   `annualBonus`: Annual bonus amount.
*   `riskInvestmentRate`: Risk investment rate.
*   `numberOfChildrenBefore2561`: Number of children born before 2561.
*   `numberOfChildrenAfter2561`: Number of children born after 2561.
*   `parentalDeductionSelfFather`: Boolean, if self's father is claimed for deduction.
*   `parentalDeductionSelfMother`: Boolean, if self's mother is claimed for deduction.
*   `parentalDeductionSpouseFather`: Boolean, if spouse's father is claimed for deduction.
*   `parentalDeductionSpouseMother`: Boolean, if spouse's mother is claimed for deduction.
*   `healthInsurancePremium`: Health insurance premium amount.
*   `lifeInsurancePremium`: Life insurance premium amount.
*   `healthParentInsurancePremium`: Health insurance premium for parents.
*   `lifePensionInsurancePremium`: Life and pension insurance premium.
*   `rmfSavings`: RMF savings amount.
*   `thaiEsgSavings`: Thai ESG savings amount.
*   `donation`: Donation amount.
*   `homeLoanInterest`: Home loan interest amount.
*   `otherDeductions`: Other deductions.

### 3.2. `TaxCalculationResult` (Output Data)
This interface defines the structure of the calculated results from the tax calculation API.
*   `TaxPayment`: Original tax payment.
*   `MaxSSF`: Maximum SSF deduction.
*   `MaxRMF`: Maximum RMF deduction.
*   `MaxHealthInsure`: Maximum health insurance deduction.
*   `MaxInsure`: Maximum life insurance deduction.
*   `MaxInsure60`: Maximum pension insurance deduction.
*   `MaxRMFSSFInsure60`: Combined maximum for RMF, SSF, and pension insurance.
*   `MaxESG`: Maximum ESG deduction.
*   `OutputESG`, `OutputSSF`, `OutputRMF`, `OutputInsure`, `OutputInsure60`: Output values for various deductions.
*   `SavingTax`: Amount of tax saved.
*   `TaxPaymentReduce`: Reduced tax payment after deductions.
*   `MaxTaxRateStep`: Maximum tax rate step.
*   `BuyESGSummary`, `BuySSFSummary`, `BuyRMFSummary`, `BuyInsureSummary`, `BuyHealthInsureSummary`, `BuyInsure60Summary`: Summary of investments bought.
*   `Budget`: Total investment budget.

### 3.3. `RecalculatePayload` (API Request for Recalculation)
This interface defines the structure of the payload sent to the API for recalculation, including both initial and additional investment amounts.

## 4. Key Algorithms and Logic

### 4.1. `fetchInitialMaxValues` Function
*   **Purpose**: To fetch preliminary maximum deduction values from the API based on the user's income. This is crucial for dynamically setting limits in `TSStep2`.
*   **Location**: `src/services/taxSavingsApi.ts`
*   **Input**: A payload built from `TaxSavingsData` (income-related fields).
*   **Output**: `Partial<TaxCalculationResult>` containing various `Max` fields.

### 4.2. `fetchTaxCalculationResult` Function
*   **Purpose**: To perform the comprehensive tax calculation using all user-provided data and return the detailed tax results.
*   **Location**: `src/services/taxSavingsApi.ts`
*   **Input**: A `RecalculatePayload` which includes all relevant deductions.
*   **Output**: `TaxCalculationResult` containing tax payment, savings, and deduction summaries.

### 4.3. `buildCalculateReducePayload` and `buildCalculateSavingTaxReducePayload` Functions
*   **Purpose**: These utility functions (in `src/utils/payloadUtils.ts`) are responsible for transforming the `TaxSavingsData` from the UI components into the specific payload formats required by the external tax calculation APIs. This ensures data consistency and correct mapping of UI inputs to API parameters.

### 4.4. `calculateRemainingInvestable` Function
*   **Purpose**: Calculates the remaining investable amount for various tax-saving instruments, considering both individual limits and combined limits (e.g., RMF + Pension, Life + Health Insurance).
*   **Location**: `src/components/TaxSavingsPlan/taxSavingsCalculations.ts`
*   **Logic**: Accounts for initial investments from `TSStep2` and additional investments entered in `TSResultsPage` against predefined maximums.

## 5. Component Responsibilities

*   **`TaxSavingsPlanner.tsx`**:
    *   Manages the overall application state (`currentStep`, `data`, `initialCalculationResult`, `calculationResult`, `apiMaxValues`, `appTexts`).
    *   Handles navigation between steps (`handleNext`, `handleBack`).
    *   Orchestrates API calls for `fetchInitialMaxValues` and `fetchTaxCalculationResult`.
    *   Passes data and update functions down to child components.
    *   Manages validation status for `TSStep1` and `TSStep2`.

*   **`TSStep1.tsx`**:
    *   Renders input fields for initial income data.
    *   Uses `useStepValidation` hook for client-side validation and reports status to `TaxSavingsPlanner`.

*   **`TSStep2.tsx`**:
    *   Renders input fields for various deductions (family, insurance, investment, other).
    *   Dynamically sets `max` values for input fields based on `apiMaxValues` fetched after Step 1.
    *   Uses `useStepValidation` hook for client-side validation and reports status.
    *   Includes `Tooltip` components for user guidance.

*   **`TSResultsPage.tsx`**:
    *   Displays the tax calculation results (`TaxPayment`, `SavingTax`, `TaxPaymentReduce`).
    *   Provides input fields for `additionalInvestments` allowing users to simulate further tax savings.
    *   Triggers `onRecalculate` with a `RecalculatePayload` when additional investments are entered.
    *   Uses `useTaxSavingsValidation` hook to handle complex combined deduction validations (e.g., RMF + Pension, Life + Health, Thai ESG).
    *   Formats numbers for display using `formatNumber`.

## 6. UI/UX Considerations

*   **Step-by-step navigation**: Guides users through the process logically.
*   **Dynamic maximums**: Input fields in `TSStep2` adjust their maximum allowed values based on the initial API call, providing real-time guidance.
*   **Interactive results**: `TSResultsPage` allows users to experiment with additional investments and see the impact on tax savings immediately.
*   **Tooltips**: Provides contextual help for complex deduction rules.
*   **Validation feedback**: Clear error messages for invalid inputs and combined deduction limits.
*   **Language toggling**: Supports both Thai and English.