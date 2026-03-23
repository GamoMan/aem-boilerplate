import { TaxSavingsLanguageTexts } from './TaxSavingsConfigLoader';
import { TaxSavingsData, AdditionalInvestments, RecalculatePayload } from '../types';

export const buildCalculateReducePayload = (data: TaxSavingsData) => {
  return {
    "Income": data.currentMonthlyIncome,
    "OtherIncome": data.otherIncome,
    "Bonus": data.annualBonus,
    "ProvidentFund": parseFloat((data.providentFundContributionRate / 100).toFixed(4)), // Convert percentage to decimal
    "NumberOfChildeBornBefore61": 0,
    "NumberOfChildeBorn61OnWards": 0,
    "FatherMother": 0,
    "HomeInterest": 0,
    "FatherInsure": 0,
    "Insure": 0,
    "PensionInsure": 0,
    "HealthInsure": 0,
    "ReduceSSF": 0,
    "ReduceRMF": 0,
    "ReduceESG": 0,
    "Donate": 0,
    "Other": 0,
  };
};

export const buildCalculateSavingTaxReducePayload = (data: TaxSavingsData, texts: TaxSavingsLanguageTexts) => {
  const PARENTAL_DEDUCTION_AMOUNT = texts.config.deductions.parentalDeductionAmount;

  return {
    "Income": data.currentMonthlyIncome,
    "OtherIncome": data.otherIncome,
    "Bonus": data.annualBonus,
    "ProvidentFund": parseFloat((data.providentFundContributionRate / 100).toFixed(4)), // Convert percentage to decimal
    "NumberOfChildeBornBefore61": data.numberOfChildrenBefore2561,
    "NumberOfChildeBorn61OnWards": data.numberOfChildrenAfter2561,
    "FatherMother": data.parentalDeductionSelfFather +
                    data.parentalDeductionSelfMother +
                    data.parentalDeductionSpouseFather +
                    data.parentalDeductionSpouseMother,
    "HomeInterest": data.homeLoanInterest,
    "FatherInsure": data.healthParentInsurancePremium,
    "Insure": data.lifeInsurancePremium,
    "PensionInsure": data.lifePensionInsurancePremium,
    "HealthInsure": data.healthInsurancePremium,
    "ReduceSSF": 0,
    "ReduceRMF": data.rmfSavings,
    "ReduceESG": data.thaiEsgSavings,
    "Donate": data.donation,
    "Other": data.otherDeductions,
  };
};

export const buildRecalculatePayload = (initialData: TaxSavingsData, additionalInvestments: AdditionalInvestments, texts: TaxSavingsLanguageTexts): RecalculatePayload => {
  const PARENTAL_DEDUCTION_AMOUNT = texts.config.deductions.parentalDeductionAmount;
  return {
    Income: initialData.currentMonthlyIncome,
    OtherIncome: initialData.otherIncome,
    Bonus: initialData.annualBonus,
    ProvidentFund: parseFloat((initialData.providentFundContributionRate / 100).toFixed(4)), // Convert percentage to decimal
    NumberOfChildeBornBefore61: initialData.numberOfChildrenBefore2561,
    NumberOfChildeBorn61OnWards: initialData.numberOfChildrenAfter2561,
    FatherMother: initialData.parentalDeductionSelfFather +
                  initialData.parentalDeductionSelfMother +
                  initialData.parentalDeductionSpouseFather +
                  initialData.parentalDeductionSpouseMother,
    HomeInterest: initialData.homeLoanInterest,
    FatherInsure: initialData.healthParentInsurancePremium,
    Insure: (initialData.lifeInsurancePremium || 0),
    PensionInsure: (initialData.lifePensionInsurancePremium || 0),
    HealthInsure: (initialData.healthInsurancePremium || 0),
    ReduceSSF: 0,
    ReduceRMF: (initialData.rmfSavings || 0),
    ReduceESG: (initialData.thaiEsgSavings || 0),
    Donate: initialData.donation,
    Other: initialData.otherDeductions,
    InputSSF: 0,
    InputRMF: additionalInvestments.rmf,
    InputESG: additionalInvestments.thaiEsg,
    InputInsure: additionalInvestments.lifeInsurance,
    InputHealthInsure: additionalInvestments.healthInsurance,
    InputInsure60: additionalInvestments.pensionInsurance,
  };
};