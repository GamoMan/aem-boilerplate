# Retirement Plan Context Document

## Overview
This document provides an overview and context for the Retirement Plan feature within the Pension Plan Navigator application. The Retirement Plan module helps users calculate and visualize their retirement savings goals and progress.

## Key Components and Files

The Retirement Plan module guides users through a multi-step process to calculate their retirement savings needs and current progress, incorporating various income and investment sources.

### Core Components:

*   **[`RetirementPlanner.tsx`](src/components/RetirementPlan/RetirementPlanner.tsx)**: The main orchestrator component. It manages the overall flow, state (current step, language, retirement data, calculation results), and renders the appropriate step components (`RPStep1`, `RPStep2`, `ResultsPage`). It also handles data updates and triggers the retirement calculation logic.

*   **[`RPStep1.tsx`](src/components/RetirementPlan/RPStep1.tsx)**: This component handles the initial input stage. Users provide their monthly income, current age, desired retirement age, and life expectancy. This component includes client-side validation for age-related inputs to ensure logical consistency.

*   **[`RPStep2.tsx`](src/components/RetirementPlan/RPStep2.tsx)**: This component collects detailed financial information. This includes current savings, provident fund contributions, RMF (Retirement Mutual Fund) details, and any planned lump-sum investments. It dynamically displays sections based on user interaction and provides real-time validation for input fields. It also integrates a summary of preliminary calculations.

*   **[`ResultsPage.tsx`](src/components/RetirementPlan/ResultsPage.tsx)**: This component presents the final retirement calculation outcomes. This includes a recommended monthly savings amount, an alternative savings scenario, and a visual progress bar indicating how current assets align with the retirement goal. It leverages several sub-components to display different aspects of the results.

*   **[`RetirementGoalSummary.tsx`](src/components/RetirementPlan/RetirementGoalSummary.tsx)**: A sub-component used within the `ResultsPage` to provide a concise summary of the user's retirement goal, their current savings status, and the calculated recommended monthly savings.

*   **[`CalculationSummaryBox.tsx`](src/components/RetirementPlan/CalculationSummaryBox.tsx)**: A component used to display key calculation summaries such as the required amount for retirement, projected monthly expenses, and recommended monthly savings.

*   **[`CurrentSavingsProgressBar.tsx`](src/components/RetirementPlan/CurrentSavingsProgressBar.tsx)**: This component visually represents the progress of current savings towards the retirement goal using a graphical progress bar, helping users clearly see their advancement.

*   **[`MonthlyIncomeInput.tsx`](src/components/RetirementPlan/MonthlyIncomeInput.tsx)**: A specialized input component for monthly income, which may include specific formatting or validation for monetary values.

*   **[`SavingResultBox.tsx`](src/components/RetirementPlan/SavingResultBox.tsx)**: A component used to display individual saving results, such as recommended monthly savings or alternative savings, along with additional details like investment return rates.