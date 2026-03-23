import { useState, useEffect, useMemo } from 'react';
import { TaxSavingsData, TaxCalculationResult } from '../types';
import { TaxSavingsLanguageTexts } from '../utils/TaxSavingsConfigLoader';
import { AdditionalInvestments } from '../types';
import { formatNumber } from '@/lib/utils';

interface UseTaxSavingsValidationProps {
  initialData: TaxSavingsData;
  additionalInvestments: AdditionalInvestments;
  texts: TaxSavingsLanguageTexts;
  calculation: TaxCalculationResult;
  language: 'th' | 'en';
  apiMaxValues: Partial<TaxCalculationResult>;
  // Add remaining investable amounts for validation
  canInvestMoreRmf: number;
  canInvestMoreThaiEsg: number;
  canInvestMoreLifeInsurance: number;
  canInvestMoreHealthInsurance: number;
  canInvestMorePensionInsurance: number;
}

interface UseTaxSavingsValidationResult {
  rmfPensionCombinedError: string | null;
  thaiEsgError: string | null;
  lifeHealthCombinedError: string | null;
  rmfFinalError: string | null;
  thaiEsgFinalError: string | null;
  lifeInsuranceFinalError: string | null;
  healthInsuranceFinalError: string | null;
  pensionInsuranceFinalError: string | null;
}

const formatMessageWithPlaceholders = (message: string, replacements: { [key: string]: number | string }) => {
  let formattedMessage = message;
  for (const key in replacements) {
    formattedMessage = formattedMessage.replace(`{${key}}`, formatNumber(Number(replacements[key])));
  }
  return formattedMessage;
};

export const useTaxSavingsValidation = ({
  initialData,
  additionalInvestments,
  texts,
  calculation,
  language,
  apiMaxValues,
  canInvestMoreRmf,
  canInvestMoreThaiEsg,
  canInvestMoreLifeInsurance,
  canInvestMoreHealthInsurance,
  canInvestMorePensionInsurance,
}: UseTaxSavingsValidationProps): UseTaxSavingsValidationResult => {
  const [rmfPensionCombinedError, setRmfPensionCombinedError] = useState<string | null>(null);
  const [thaiEsgError, setThaiEsgError] = useState<string | null>(null);
  const [lifeHealthCombinedError, setLifeHealthCombinedError] = useState<string | null>(null);

  // Individual RMF validation
  const rmfFinalError = useMemo(() => {
    if (additionalInvestments.rmf > canInvestMoreRmf) {
      return formatMessageWithPlaceholders(texts[language].config.validation.maxValueError, { max: canInvestMoreRmf });
    }
    return null;
  }, [additionalInvestments.rmf, canInvestMoreRmf, texts, language]);

  // Individual Thai ESG validation
  const thaiEsgFinalError = useMemo(() => {
    if (additionalInvestments.thaiEsg > canInvestMoreThaiEsg) {
      return formatMessageWithPlaceholders(texts[language].config.validation.thaiEsgExceededError, { thaiEsgMax: canInvestMoreThaiEsg });
    }
    return null;
  }, [additionalInvestments.thaiEsg, canInvestMoreThaiEsg, texts, language]);

  // Individual Life Insurance validation
  const lifeInsuranceFinalError = useMemo(() => {
    if (additionalInvestments.lifeInsurance > canInvestMoreLifeInsurance) {
      // Suppress "สูงสุดได้ไม่เกิน 0" error if canInvestMoreLifeInsurance is 0
      if (canInvestMoreLifeInsurance === 0) {
        return null;
      }
      return formatMessageWithPlaceholders(texts[language].config.validation.maxValueError, { max: canInvestMoreLifeInsurance });
    }
    return null;
  }, [additionalInvestments.lifeInsurance, canInvestMoreLifeInsurance, texts, language]);

  // Individual Health Insurance validation
  const healthInsuranceFinalError = useMemo(() => {
    if (additionalInvestments.healthInsurance > canInvestMoreHealthInsurance) {
      // Suppress "สูงสุดได้ไม่เกิน 0" error if canInvestMoreHealthInsurance is 0
      if (canInvestMoreHealthInsurance === 0) {
        return null;
      }
      return formatMessageWithPlaceholders(texts[language].config.validation.maxValueError, { max: canInvestMoreHealthInsurance });
    }
    return null;
  }, [additionalInvestments.healthInsurance, canInvestMoreHealthInsurance, texts, language]);

  // Individual Pension Insurance validation
  const pensionInsuranceFinalError = useMemo(() => {
    if (additionalInvestments.pensionInsurance > canInvestMorePensionInsurance) {
      return formatMessageWithPlaceholders(texts[language].config.validation.maxValueError, { max: canInvestMorePensionInsurance });
    }
    return null;
  }, [additionalInvestments.pensionInsurance, canInvestMorePensionInsurance, texts, language]);

  // Combined validations
  useEffect(() => {
    const currentLifeTotal = (initialData.lifeInsurancePremium || 0) + additionalInvestments.lifeInsurance;
    const currentHealthTotal = (initialData.healthInsurancePremium || 0) + additionalInvestments.healthInsurance;
    const combinedLifeHealthMax = texts.config.individualMaxes.combinedLifeHealthMax;

    if (currentLifeTotal + currentHealthTotal > combinedLifeHealthMax) {
      setLifeHealthCombinedError(formatMessageWithPlaceholders(texts[language].config.validation.combinedLifeHealthExceededError, { combinedLifeHealthMax: combinedLifeHealthMax }));
    } else {
      setLifeHealthCombinedError(null);
    }

    const currentRMFTotal = (initialData.rmfSavings || 0) + additionalInvestments.rmf;
    const currentPensionTotal = (initialData.lifePensionInsurancePremium || 0) + additionalInvestments.pensionInsurance;
    const combinedRMFPensionMax = apiMaxValues.MaxRMFSSFInsure60 || 0;

    if (currentRMFTotal + currentPensionTotal > combinedRMFPensionMax && combinedRMFPensionMax !== 0) {
      setRmfPensionCombinedError(formatMessageWithPlaceholders(texts[language].config.validation.combinedRMFPensionExceededError, { combinedRMFPensionMax: combinedRMFPensionMax }));
    } else {
      setRmfPensionCombinedError(null);
    }
  }, [
    initialData,
    additionalInvestments,
    texts,
    calculation,
    apiMaxValues,
    language,
  ]);


  return { rmfPensionCombinedError, thaiEsgError, lifeHealthCombinedError, rmfFinalError, thaiEsgFinalError, lifeInsuranceFinalError, healthInsuranceFinalError, pensionInsuranceFinalError };
};
