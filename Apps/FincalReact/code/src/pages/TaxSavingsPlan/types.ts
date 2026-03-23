export interface TaxSavingsData {
  currentMonthlyIncome: number;
  otherIncome: number;
  annualBonus: number;
  providentFundContributionRate: number;
  numberOfChildrenBefore2561: number;
  numberOfChildrenAfter2561: number;
  parentalDeductionSelfFather: number;
  parentalDeductionSelfMother: number;
  parentalDeductionSpouseFather: number;
  parentalDeductionSpouseMother: number;
  healthInsurancePremium: number;
  lifeInsurancePremium: number;
  healthParentInsurancePremium: number;
  lifePensionInsurancePremium: number;
  rmfSavings: number;
  thaiEsgSavings: number;
  donation: number;
  homeLoanInterest: number;
  otherDeductions: number;
}

export interface TaxCalculationResult {
  TaxPayment: number;
  MaxSSF: number;
  MaxRMF: number;
  MaxHealthInsure: number;
  MaxInsure: number;
  MaxInsure60: number;
  MaxRMFSSFInsure60: number;
  MaxESG: number;
  OutputESG: number;
  OutputSSF: number;
  OutputRMF: number;
  OutputInsure: number;
  OutputInsure60: number;
  SavingTax: number;
  TaxPaymentReduce: number;
  MaxTaxRateStep: number;
  BuyESGSummary: number;
  BuySSFSummary: number;
  BuyRMFSummary: number;
  BuyInsureSummary: number;
  BuyHealthInsureSummary: number;
  BuyInsure60Summary: number;
  Budget: number;
}

export interface RecalculatePayload {
 Income: number;
 OtherIncome: number;
 Bonus: number;
 ProvidentFund: number;
 NumberOfChildeBornBefore61: number;
 NumberOfChildeBorn61OnWards: number;
 FatherMother: number;
 HomeInterest: number;
 FatherInsure: number;
 Insure: number;
 PensionInsure: number;
 HealthInsure: number;
 ReduceSSF: number;
 ReduceRMF: number;
 ReduceESG: number;
 Donate: number;
 Other: number;
 InputSSF: number;
 InputRMF: number;
 InputESG: number;
 InputInsure: number;
 InputHealthInsure: number;
 InputInsure60: number;
}

export interface AdditionalInvestments {
 rmf: number;
 thaiEsg: number;
 lifeInsurance: number;
 healthInsurance: number;
 pensionInsurance: number;
}