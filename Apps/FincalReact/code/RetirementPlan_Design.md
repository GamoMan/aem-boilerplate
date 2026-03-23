# Retirement Plan Design Document

## 1. Introduction
This document outlines the design considerations, architecture, data flow, and key algorithms for the Retirement Plan module within the Pension Plan Navigator application. It builds upon the component overview provided in the Retirement Plan Context Document by delving deeper into the technical implementation and interactions.

## 2. High-Level Architecture and Data Flow
The Retirement Plan module follows a clear, step-by-step user interaction model, driven by a central `RetirementPlanner` component. Data flows from user inputs through intermediate state management to a core calculation engine, and finally to result display components.

### 2.1. User Interaction Flow
1.  **Step 1 (RPStep1)**: Gathers basic demographic and financial goals (monthly income, ages).
2.  **Step 2 (RPStep2)**: Collects detailed current savings and investment information.
3.  **Calculation**: Triggers the retirement calculation logic (API call).
4.  **Results (ResultsPage)**: Displays the calculated retirement plan.

### 2.2. Data Flow Diagram
```mermaid
graph TD
    A[User Input (RPStep1)] --> B{RetirementPlanner State};
    B --> C[User Input (RPStep2)];
    C --> B;
    B -- RetirementData --> D[calculateRetirement (API)];
    D -- CalculationResult --> B;
    B -- CalculationResult --> E[ResultsPage];
    E -- CalculationResult --> F[SavingResultBox, CurrentSavingsProgressBar, RetirementGoalSummary];
```

## 3. Data Models

### 3.1. `RetirementData` (Input Data)
This interface defines the structure of all user-provided inputs for the retirement calculation.
*   `monthlyIncome`: Desired monthly income in retirement.
*   `currentAge`: User's current age.
*   `retirementAge`: Age at which the user plans to retire.
*   `lifeExpectancy`: Expected age until which funds are needed.
*   `currentSavings`: Current total savings.
*   `savingsExpectedReturnRate`: Expected annual return rate for general savings (%).
*   `annualSavingsIncreaseRate`: Annual increase rate for savings contributions (%).
*   `currentProvidentFundSavings`: Current balance in provident fund.
*   `providentFundExpectedReturnRate`: Expected annual return rate for provident fund (%).
*   `monthlySalary`: Current monthly salary (for provident fund calculation).
*   `annualSalaryIncreaseRate`: Annual salary increase rate (%).
*   `providentFundContributionRate`: Employee's provident fund contribution rate (%).
*   `currentRMFSavings`: Current RMF (Retirement Mutual Fund) balance.
*   `expectedAnnualRMFAccumulation`: Expected annual contribution to RMF.
*   `rmfExpectedReturnRate`: Expected annual return rate for RMF (%).
*   `lumpSumAtRetirement`: Planned lump sum available at retirement.
*   `expectedAnnualInvestment`: Expected annual investment for lump sum.
*   `lumpSumExpectedReturnRate`: Expected annual return rate for lump sum investments (%).

### 3.2. `CalculationResult` (Output Data)
This interface defines the structure of the calculated results from the retirement engine.
*   `requiredAmount`: Total amount required for retirement.
*   `monthlySpending`: Estimated monthly spending in retirement.
*   `recommendedMonthlySaving`: Recommended monthly savings to reach the goal.
*   `alternativeMonthlySaving`: Alternative monthly savings based on different assumptions (e.g., higher return).
*   `inflationRate`: Assumed inflation rate used in calculations.
*   `totalCurrentAssetsAtRetirement`: Total projected assets at retirement based on current inputs.
*   `afterretirerate`: Post-retirement investment return rate.

### 3.3. `InflationData` (External Data)
This interface defines the structure of inflation data fetched from an external source.
*   `inflationRate`: The current inflation rate.

## 4. Key Algorithms and Logic

### 4.1. `calculateRetirement` Function
This function (located in `src/lib/utils.ts`) is the core calculation engine. It takes `RetirementData` and `InflationData` as inputs and returns a `CalculationResult`.
*   **Purpose**: To project future financial needs and current asset growth, and determine the required savings to meet retirement goals.
*   **Key Calculations**:
    *   Future value of monthly income adjusted for inflation.
    *   Growth of current savings, provident fund, RMF, and lump sum investments based on respective return rates and contribution patterns.
    *   Calculation of the gap between required funds and projected assets.
    *   Determination of recommended and alternative monthly savings to bridge the gap.
*   **Dependencies**: Relies on `InflationData` for accurate projections.

### 4.2. `fetchInflationRate` Function
This asynchronous function (located in `src/lib/utils.ts`) is responsible for fetching the latest inflation rate from a predefined external API endpoint.
*   **Purpose**: To ensure that retirement calculations use up-to-date economic data.
*   **Mechanism**: Makes an API call to retrieve inflation data.

## 5. Component Responsibilities

*   **`RetirementPlanner.tsx`**:
    *   Manages the overall application state (`currentStep`, `data`, `calculationResult`, `appTexts`, `inflationData`).
    *   Handles navigation between steps (`handleNext`, `handleBack`).
    *   Orchestrates API calls for `fetchInflationRate` and `calculateRetirement`.
    *   Passes data and update functions down to child components.
    *   Manages validation state for `RPStep1` and `RPStep2`.

*   **`RPStep1.tsx`**:
    *   Renders input fields for `monthlyIncome`, `currentAge`, `retirementAge`, `lifeExpectancy`.
    *   Performs client-side validation for age inputs (`validateAges`) to ensure `currentAge < retirementAge < lifeExpectancy`.
    *   Communicates validation status back to `RetirementPlanner`.

*   **`RPStep2.tsx`**:
    *   Renders input fields for various savings and investment contributions.
    *   Manages the visibility of detailed input sections (`sections` state) based on user interaction (focus/input values).
    *   Performs client-side validation for return rates and contribution rates.
    *   Displays a `CalculationSummaryBox` with preliminary results.
    *   Communicates validation status back to `RetirementPlanner`.

*   **`ResultsPage.tsx`**:
    *   Receives `CalculationResult` and `RetirementData` as props.
    *   Displays `recommendedMonthlySaving`, `alternativeMonthlySaving`, and `totalCurrentAssetsAtRetirement`.
    *   Utilizes `CurrentSavingsProgressBar` for visual representation of progress.
    *   Includes `RetirementGoalSummary` for a concise overview.
    *   Calculates and displays `investmentReturnText` for primary and alternative scenarios.

## 6. UI/UX Considerations

*   **Step-by-step navigation**: Guides users through the process logically.
*   **Dynamic input sections**: `RPStep2` dynamically shows/hides detailed input fields to reduce clutter and improve user experience based on relevance.
*   **Real-time validation**: Provides immediate feedback to users on input errors.
*   **Language toggling**: Supports both Thai and English for broader accessibility.
*   **Clear result presentation**: `ResultsPage` uses various sub-components to present complex financial data in an understandable format.