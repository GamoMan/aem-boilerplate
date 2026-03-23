# Tax Savings Plan Context Document

## Overview
This document provides an overview and context for the Tax Savings Plan feature within the Pension Plan Navigator application. The Tax Savings Plan module helps users calculate and optimize their tax savings based on various financial inputs.

## Key Components and Files

The Tax Savings Plan module guides users through a multi-step process to calculate and optimize their tax savings based on various financial inputs and potential deductions.

### Core Components:

*   **[`TaxSavingsPlanner.tsx`](src/components/TaxSavingsPlan/TaxSavingsPlanner.tsx)**: The primary component that orchestrates the entire tax savings calculation flow. It manages the application's state, including the current step, user input data, and the results from tax calculation APIs. It renders the appropriate step components (`TSStep1`, `TSStep2`, `TSResultsPage`) and handles navigation between them.

*   **[`TSStep1.tsx`](src/components/TaxSavingsPlan/TSStep1.tsx)**: This component is responsible for collecting initial income-related data from the user. This includes current monthly income, other income sources, annual bonus, and risk investment rate. It also handles basic input validation for these fields.

*   **[`TSStep2.tsx`](src/components/TaxSavingsPlan/TSStep2.tsx)**: This component gathers detailed deduction information. Users input data related to family deductions (e.g., number of children, parental deductions), various insurance premiums (health, life, pension), investment savings (RMF, Thai ESG), and other deductions (e.g., home loan interest, donations). It utilizes tooltips for explanations and performs real-time validation.

*   **[`TSResultsPage.tsx`](src/components/TaxSavingsPlan/TSResultsPage.tsx)**: This component displays the final tax calculation results. It shows the original tax payable, the new tax payable after deductions, and the amount of tax saved. It also provides an interactive section where users can input additional investments to further optimize their tax savings, with real-time recalculation capabilities.

*   **[`taxSavingsCalculations.ts`](src/components/TaxSavingsPlan/taxSavingsCalculations.ts)**: This utility file contains helper functions primarily for calculating remaining investable amounts for various tax-saving instruments. While the core tax calculation logic is handled by an external API, this file supports the client-side validation and display of investment limits.