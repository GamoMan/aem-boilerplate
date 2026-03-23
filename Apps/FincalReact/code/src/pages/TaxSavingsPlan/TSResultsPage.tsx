import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { buildRecalculatePayload } from './utils/payloadUtils';
import InvestmentInputRow from './components/InvestmentInputRow';
import { Button } from '@/components/ui/button';
import { formatNumber, formatMessageWithPlaceholders } from '@/lib/utils';
import { AdditionalInvestments } from './types';
import { useTaxSavingsValidation } from './hooks/useTaxSavingsValidation';
import DOMPurify from 'dompurify';
import { useTaxSavings } from './hooks/useTaxSavings';

interface TSResultsPageProps {
  taxSavings: ReturnType<typeof useTaxSavings>;
}

const TSResultsPage: React.FC<TSResultsPageProps> = ({ taxSavings }) => {
  const {
    initialCalculationResult: initialCalculation,
    calculationResult: calculation,
    language,
    appTexts: texts,
    handleBack: onBack,
    handleRecalculate,
    data: initialData,
    apiMaxValues,
    apiNewMaxValues,
    hasRecalculated,
    additionalInvestments,
    setAdditionalInvestments,
    fixedInitialCalculation,
  } = taxSavings;

  const clampedInitialData = useMemo(() => {
    if (!initialData) return null;
    return {
      ...initialData,
      rmfSavings: Math.min(initialData.rmfSavings || 0, apiMaxValues.MaxRMF || Infinity),
      thaiEsgSavings: Math.min(initialData.thaiEsgSavings || 0, apiMaxValues.MaxESG || Infinity),
      lifeInsurancePremium: Math.min(initialData.lifeInsurancePremium || 0, apiMaxValues.MaxInsure || Infinity),
      healthInsurancePremium: Math.min(initialData.healthInsurancePremium || 0, apiMaxValues.MaxHealthInsure || Infinity),
      lifePensionInsurancePremium: Math.min(initialData.lifePensionInsurancePremium || 0, apiMaxValues.MaxInsure60 || Infinity),
    };
  }, [initialData, apiMaxValues]);

  const [dynamicMax, setDynamicMax] = useState({
    rmf: calculation?.MaxRMF ?? 0,
    pensionInsurance: calculation?.MaxInsure60 ?? 0,
    lifeInsurance: calculation?.MaxInsure ?? 0,
    healthInsurance: calculation?.MaxHealthInsure ?? 0,
  });

  const [recalculateButtonEnabledOnce, setRecalculateButtonEnabledOnce] = useState(false);

  useEffect(() => {
    if (calculation) {
      setDynamicMax({
        rmf: calculation.MaxRMF <= 0 ? 0 : calculation.MaxRMF,
        pensionInsurance: calculation.MaxInsure60 <= 0 ? 0 : calculation.MaxInsure60,
        lifeInsurance: calculation.MaxInsure <= 0 ? 0 : calculation.MaxInsure,
        healthInsurance: calculation.MaxHealthInsure <= 0 ? 0 : calculation.MaxHealthInsure,
      });

    }
  }, [calculation]);

  useEffect(() => {
    // If the button was enabled once, keep it enabled
    if (!Object.values(additionalInvestments).every(v => v === 0) && !recalculateButtonEnabledOnce) {
      setRecalculateButtonEnabledOnce(true);
    }
  }, [additionalInvestments, recalculateButtonEnabledOnce]);


  const { rmfPensionCombinedError, thaiEsgError, lifeHealthCombinedError, rmfFinalError, thaiEsgFinalError, lifeInsuranceFinalError, healthInsuranceFinalError, pensionInsuranceFinalError } = useTaxSavingsValidation({
    initialData: clampedInitialData!,
    additionalInvestments,
    texts: texts!,
    calculation: calculation!,
    language,
    apiMaxValues,
    canInvestMoreRmf: dynamicMax.rmf,
    canInvestMoreThaiEsg: calculation?.MaxESG ?? 0,
    canInvestMoreLifeInsurance: dynamicMax.lifeInsurance,
    canInvestMoreHealthInsurance: dynamicMax.healthInsurance,
    canInvestMorePensionInsurance: dynamicMax.pensionInsurance,
  });

  const handleInvestmentChange = useCallback((field: keyof AdditionalInvestments, value: number) => {
    setAdditionalInvestments(prev => ({ ...prev, [field]: value }));
    if (!calculation) return;

  }, [calculation, setAdditionalInvestments]);

  // const totalAdditionalInvestment = useMemo(() => {
  //   if (!clampedInitialData) return 0;

  //   return (clampedInitialData.rmfSavings || 0) + additionalInvestments.rmf +
  //     (clampedInitialData.thaiEsgSavings || 0) + additionalInvestments.thaiEsg +
  //     (clampedInitialData.lifeInsurancePremium || 0) + additionalInvestments.lifeInsurance +
  //     (clampedInitialData.healthInsurancePremium || 0) + additionalInvestments.healthInsurance +
  //     (clampedInitialData.lifePensionInsurancePremium || 0) + additionalInvestments.pensionInsurance;
  // }, [clampedInitialData, additionalInvestments]);

  const hasAnyError = !!rmfFinalError || !!thaiEsgFinalError || !!rmfPensionCombinedError || !!thaiEsgError || !!lifeHealthCombinedError || !!healthInsuranceFinalError || !!pensionInsuranceFinalError;

  const handleRecalculateClick = useCallback(() => {
    if (!initialData || !texts) return;
    const payload = buildRecalculatePayload(initialData, additionalInvestments, texts);
    handleRecalculate(payload);
    window.scrollTo(0, 0); // Scroll to top
  }, [initialData, additionalInvestments, texts, handleRecalculate]);

  const formatCurrency = useCallback((value: number) => {
    return value.toLocaleString(language === 'th' ? 'th-TH' : 'en-US', { maximumFractionDigits: 0 });
  }, [language]);

  const showComparison = !!initialCalculation && hasRecalculated;

  if (!calculation || !texts || !initialData || !clampedInitialData) {
    return <div>Loading...</div>; // Or some other loading state
  }

  return (
    <div className="space-y-6">
      {calculation.TaxPayment <= 0 ? (
        // Render for no tax payable
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 text-center h-[159px] flex items-center justify-center">
          <p className="font-h5-medium !font-bbl-medium text-gray-800 my-2">
            {texts.results.noTaxPayable}
          </p>
        </div>
      ) : (
        // Original rendering for tax payable

        <div className={`tax-saving-grid ${(showComparison && fixedInitialCalculation?.TaxPayment !== calculation.TaxPaymentReduce) ? 'tax-saving-grid-cols-1 md:tax-saving-grid-cols-2' : 'tax-saving-grid-cols-1'} gap-6`}>
          {(fixedInitialCalculation?.TaxPayment > 0 || fixedInitialCalculation?.TaxPayment === calculation.TaxPaymentReduce) && (
            <div>
              <div className="bg-bbl-gray p-4 rounded-lg flex flex-col justify-between">
                <p className="text-left font-h5-medium font-bbl-medium mb-8 ">{showComparison ? texts.results.taxToBePaidOriginalLabel : texts.results.taxToBePaidLabel}</p>
                {showComparison && (
                  <div className='flex justify-end items-center text-[#2DCD73] invisible'>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <p></p> {/* Empty p tag to maintain height */}
                  </div>
                )}
                <p className="font-h3-medium text-right !font-bbl-medium text-primary">
                  {formatCurrency(calculation?.TaxPayment || 0)} <span className="font-b4-regular text-gray-50 font-bbl-looped">{texts.common.unit}</span>
                </p>
              </div>
              <p className="font-b3-regular text-gray-50 text-right mt-1 font-bbl-looped px-4">{texts.results.taxRateLabel.replace('{rate}', ((initialCalculation?.MaxTaxRateStep || 0) * 100).toString())}</p>
            </div>
          )}
          {(showComparison && fixedInitialCalculation?.TaxPayment !== calculation.TaxPaymentReduce) && (
            <div>
              <div className="bg-secondary text-white p-4 rounded-lg text-right flex flex-col justify-between">
                <p className="font-h5-medium text-left font-bbl-medium mb-8">{texts.results.taxToBePaidNewLabel}</p>
                <div className={`flex justify-end items-center text-b2-medium text-[#2DCD73] !font-bbl-medium ${(rmfPensionCombinedError || thaiEsgError || lifeHealthCombinedError || calculation?.SavingTax === 0) ? 'invisible' : ''}`}>
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {calculation?.SavingTax === 0 ?
                    <p>{texts.results.taxSavedLabel} {formatCurrency(calculation?.SavingTax || 0)} <span className="font-b4-regular text-gray-80 font-bbl-looped">{texts.common.unit}</span></p>
                    :
                    <p>{texts.results.taxSavedLabel} -{formatCurrency(calculation?.SavingTax || 0)} <span className="font-b4-regular text-gray-80 font-bbl-looped">{texts.common.unit}</span></p>
                  }
                </div>
                <p className="font-h3-medium !font-bbl-medium">
                  {formatCurrency((calculation.TaxPaymentReduce || 0))} <span className="font-b4-regular text-gray-80 font-bbl-looped">{texts.common.unit}</span>
                </p>
              </div>
              {calculation.TaxPaymentReduce === 0 ? (
                <p className="font-b3-regular text-gray-50 text-right mt-1 font-bbl-looped px-4">{texts.results.noTaxPayable}</p>
              ) : (
                <p className="font-b3-regular text-gray-50 text-right mt-1 font-bbl-looped px-4">{texts.results.taxRateLabel.replace('{rate}', ((calculation.MaxTaxRateStep || 0) * 100).toString())}</p>
              )}
            </div>
          )}
        </div>
      )}
      <div className="border border-primary border-solid p-4 rounded-lg flex flex-col space-y-2">
        <div className="flex flex-wrap fincal-flex-wrap items-baseline">
          <p className="font-b1-medium text-black text-left !font-bbl-medium">{texts.results.maxTaxSavingsResult}</p>
          <p className="font-h5-medium text-black text-right !font-bbl-medium whitespace-nowrap ml-auto">
            <span className="font-h5-medium">{formatCurrency(apiNewMaxValues.SavingTax)}</span> <span className="font-b4-regular text-gray-50 font-bbl-looped">{texts.common.unit}</span>
          </p>
        </div>
        <div className="flex flex-wrap fincal-flex-wrap items-baseline">
          <p className="font-b1-medium text-black text-left !font-bbl-medium">{texts.results.maxInvestmentSavingsResult}</p>
          <p className="font-h5-medium text-black text-right !font-bbl-medium whitespace-nowrap ml-auto">
            <span className="font-h5-medium">{formatCurrency(apiNewMaxValues.Budget)}</span> <span className="font-b4-regular text-gray-50 font-bbl-looped">{texts.common.unit}</span>
          </p>
        </div>
        <div className="flex flex-wrap fincal-flex-wrap items-baseline">
          <p className="font-b1-medium text-black text-left !font-bbl-medium">{texts.results.remainingTaxResult}</p>
          <p className="font-h5-medium text-black text-right !font-bbl-medium whitespace-nowrap ml-auto">
            <span className="font-h5-medium">{formatCurrency(apiNewMaxValues.TaxPaymentReduce)}</span> <span className="font-b4-regular text-gray-50 font-bbl-looped">{texts.common.unit}</span>
          </p>
        </div>
        {apiNewMaxValues.TaxPayment > 0 && apiNewMaxValues.TaxPaymentReduce > 0 ? (
          <p className="font-b2-regular text-right font-bbl">
            {texts.results.taxRateRemainLabel.replace('{rate}', (apiNewMaxValues.MaxTaxRateStep * 100).toString())}
          </p>
        ) : (
          <p className="font-b2-regular text-right font-bbl">
            {texts.results.noTaxPayable}
          </p>
        )}
        {/* {calculation.TaxPayment <= 0 && (
          <div className="flex justify-between items-center">
            <span className="font-bbl text-right w-full">
              <span>{texts[language].config.notes.noTaxPayableNote}</span>
            </span>
          </div>
        )} */}
      </div>
      {
        calculation.TaxPayment > 0 && ( // Only show investment section if tax is still payable
          <div className="text-center my-8">
            <h2 className="font-h5-medium !font-bbl-medium">{texts.results.chooseMoreInvestmentLabel}</h2>
          </div>
        )
      }
      {
        calculation.TaxPayment > 0 && ( // Only show investment section if tax is still payable
          <div className="space-y-4">
            <div className="tax-saving-grid tax-saving-grid-cols-2 gap-4 items-start">
              <p className="flex items-center justify-center font-b1-medium !font-bbl-medium">{texts.results.investmentAmountLabel}</p>
              <p className="flex items-center justify-center font-b1-medium !font-bbl-medium">{texts.results.totalInvestmentLabel}</p>
            </div>
            <InvestmentInputRow
              label={texts.results.rmfLabel}
              value={additionalInvestments.rmf}
              onChange={(val) => handleInvestmentChange('rmf', val)}
              max={Math.max(0, additionalInvestments.pensionInsurance + (calculation.MaxRMF || 0) >= (calculation.MaxRMFSSFInsure60 || 0) ?
                (calculation.MaxRMF || 0) - (additionalInvestments.pensionInsurance + (calculation.MaxRMF || 0) - (calculation.MaxRMFSSFInsure60 || 0)) : (calculation.MaxRMF || 0))}
              // maxLength={calculation.MaxRMF.toString().length + 1}
              maxValueDisplay={dynamicMax.rmf <= 0 && apiNewMaxValues.MaxRMF <= 0 ? texts.results.noRemainDeduction : `${texts.results.canInvestMoreLabel} ${formatNumber(Math.max(0, additionalInvestments.pensionInsurance + (calculation.MaxRMF || 0) >= (calculation.MaxRMFSSFInsure60 || 0) ?
                (calculation.MaxRMF || 0) - (additionalInvestments.pensionInsurance + (calculation.MaxRMF || 0) - (calculation.MaxRMFSSFInsure60 || 0)) : (calculation.MaxRMF || 0)))} ${texts.common.unit}`}
              language={language}
              texts={texts}
              canInvestMore={Math.max(0, additionalInvestments.pensionInsurance + (calculation.MaxRMF || 0) >= (calculation.MaxRMFSSFInsure60 || 0) ?
                (calculation.MaxRMF || 0) - (additionalInvestments.pensionInsurance + (calculation.MaxRMF || 0) - (calculation.MaxRMFSSFInsure60 || 0)) : (calculation.MaxRMF || 0))}
              initialStep2Value={clampedInitialData.rmfSavings || 0}
              error={rmfFinalError || rmfPensionCombinedError}
              disabled={dynamicMax.rmf <= 0}
              // apiMax={calculation.MaxRMF || 0}
              totalInvestedAmount={(clampedInitialData.rmfSavings || 0) + additionalInvestments.rmf}
            />
            <InvestmentInputRow
              label={texts.results.thaiEsgLabel}
              value={additionalInvestments.thaiEsg}
              onChange={(val) => handleInvestmentChange('thaiEsg', val)}
              max={calculation.MaxESG}
              // maxLength={calculation.MaxESG.toString().length + 1}
              maxValueDisplay={calculation.MaxESG <= 0 && apiNewMaxValues.MaxESG <= 0 ? texts.results.noRemainDeduction : `${texts.results.canInvestMoreLabel} ${formatNumber(calculation.MaxESG)} ${texts.common.unit}`}
              language={language}
              texts={texts}
              canInvestMore={calculation.MaxESG}
              initialStep2Value={clampedInitialData.thaiEsgSavings || 0}
              error={thaiEsgFinalError}
              disabled={calculation.MaxESG <= 0}
              // apiMax={calculation.MaxESG || 0}
              totalInvestedAmount={(clampedInitialData.thaiEsgSavings || 0) + additionalInvestments.thaiEsg}
            />
            <InvestmentInputRow
              label={texts.results.lifeInsuranceLabel}
              value={additionalInvestments.lifeInsurance}
              onChange={(val) => handleInvestmentChange('lifeInsurance', val)}
              max={
                Math.max(0, additionalInvestments.healthInsurance > (100000 - calculation.MaxInsure) ?
                  (calculation.MaxInsure - (additionalInvestments.healthInsurance - (100000 - calculation.MaxInsure)) <= 0 ?
                    0 : calculation.MaxInsure - (additionalInvestments.healthInsurance - (100000 - calculation.MaxInsure)))
                  : calculation.MaxInsure)
              }
              // maxLength={calculation.MaxInsure.toString().length + 1}
              maxValueDisplay={dynamicMax.healthInsurance <= 0 && apiNewMaxValues.MaxInsure <= 0 ? texts.results.noRemainDeduction  :
                `${texts.results.canInvestMoreLabel} ${formatNumber(
                  Math.min(Math.max(apiNewMaxValues.MaxInsure,calculation.MaxInsure) || 100000, Math.max(0, (calculation.MaxInsure - (additionalInvestments.healthInsurance || 0)) <= 0 ? 0 :
                Math.max(apiNewMaxValues.MaxInsure,calculation.MaxInsure)  - (additionalInvestments.healthInsurance || 0)))
                )} ${texts.common.unit}`}
              language={language}
              texts={texts}
              canInvestMore={Math.min(calculation.MaxInsure || 100000, Math.max(0, (calculation.MaxInsure - (additionalInvestments.healthInsurance || 0)) <= 0 ? 0 :
                Math.max(apiNewMaxValues.MaxInsure,calculation.MaxInsure)  - (additionalInvestments.healthInsurance || 0)))}
              initialStep2Value={clampedInitialData.lifeInsurancePremium || 0}
              error={lifeInsuranceFinalError || lifeHealthCombinedError} // Pass error to life insurance input
              disabled={dynamicMax.lifeInsurance <= 0}
              totalInvestedAmount={(clampedInitialData.lifeInsurancePremium || 0) + additionalInvestments.lifeInsurance}
            />
            <InvestmentInputRow
              label={texts.results.healthInsuranceLabel}
              value={additionalInvestments.healthInsurance}
              onChange={(val) => handleInvestmentChange('healthInsurance', val)}
              max={
                Math.max(0, additionalInvestments.healthInsurance > (100000 - (clampedInitialData.lifeInsurancePremium + additionalInvestments.lifeInsurance)) ?
                  (
                    calculation.MaxHealthInsure - (clampedInitialData.lifeInsurancePremium + additionalInvestments.lifeInsurance - (100000 - calculation.MaxHealthInsure)) <= 0 ?
                      0 : calculation.MaxHealthInsure - (clampedInitialData.lifeInsurancePremium + additionalInvestments.lifeInsurance - (100000 - calculation.MaxHealthInsure))
                  )
                  : calculation.MaxHealthInsure)
              }
              // maxLength={calculation.MaxHealthInsure.toString().length + 1}
              maxValueDisplay={dynamicMax.lifeInsurance <= 0 && apiNewMaxValues.MaxHealthInsure <= 0 ? texts.results.noRemainDeduction :
                `${texts.results.canInvestMoreLabel} ${formatNumber(
                  Math.max((100000 - (clampedInitialData.lifeInsurancePremium + additionalInvestments.lifeInsurance)) < calculation.MaxHealthInsure ? 
                  100000 - (clampedInitialData.lifeInsurancePremium + additionalInvestments.lifeInsurance) : calculation.MaxHealthInsure)
                )} ${texts.common.unit}`}
              language={language}
              texts={texts}
              canInvestMore={
                  Math.max((100000 - (clampedInitialData.lifeInsurancePremium + additionalInvestments.lifeInsurance)) < calculation.MaxHealthInsure ? 
                  100000 - (clampedInitialData.lifeInsurancePremium + additionalInvestments.lifeInsurance) : calculation.MaxHealthInsure)
              }
              initialStep2Value={clampedInitialData.healthInsurancePremium || 0}
              error={healthInsuranceFinalError || lifeHealthCombinedError} // Pass error to health insurance input
              disabled={dynamicMax.healthInsurance <= 0}
              totalInvestedAmount={(clampedInitialData.healthInsurancePremium || 0) + additionalInvestments.healthInsurance}
            />
            <InvestmentInputRow
              label={texts.results.pensionInsuranceLabel}
              value={additionalInvestments.pensionInsurance}
              onChange={(val) => handleInvestmentChange('pensionInsurance', val)}
              max={
                Math.max(0, additionalInvestments.rmf + (calculation.MaxInsure60 || 0) >= (calculation.MaxRMFSSFInsure60 || 0) ?
                  (calculation.MaxInsure60 || 0) - (additionalInvestments.rmf + (calculation.MaxInsure60 || 0) - (calculation.MaxRMFSSFInsure60 || 0)) : (calculation.MaxInsure60 || 0))
              }
              // maxLength={calculation.MaxInsure60.toString().length + 1}
              maxValueDisplay={
                dynamicMax.pensionInsurance <= 0 && apiNewMaxValues.MaxInsure60 <= 0 ? texts.results.noRemainDeduction : `${texts.results.canInvestMoreLabel} ${formatNumber(Math.max(0, additionalInvestments.rmf + (calculation.MaxInsure60 || 0) >= (calculation.MaxRMFSSFInsure60 || 0) ?
                  (calculation.MaxInsure60 || 0) - (additionalInvestments.rmf + (calculation.MaxInsure60 || 0) - (calculation.MaxRMFSSFInsure60 || 0)) : (calculation.MaxInsure60 || 0)))} ${texts.common.unit}`
              }
              language={language}
              texts={texts}
              canInvestMore={
                Math.max(0, additionalInvestments.rmf + (calculation.MaxInsure60 || 0) >= (calculation.MaxRMFSSFInsure60 || 0) ?
                  (calculation.MaxInsure60 || 0) - (additionalInvestments.rmf + (calculation.MaxInsure60 || 0) - (calculation.MaxRMFSSFInsure60 || 0)) : (calculation.MaxInsure60 || 0))
              }
              initialStep2Value={clampedInitialData.lifePensionInsurancePremium || 0}
              error={pensionInsuranceFinalError || rmfPensionCombinedError}
              disabled={dynamicMax.pensionInsurance <= 0}
              // apiMax={calculation.MaxInsure60 || 0}
              totalInvestedAmount={(clampedInitialData.lifePensionInsurancePremium || 0) + additionalInvestments.pensionInsurance}
            />
            {/*<div className="tax-saving-grid tax-saving-grid-cols-2 gap-1 items-center pt-4 pb-4 border-top-gray-50">
              <span className="flex items-center justify-center font-b1-medium !font-bbl-medium">{texts.results.totalAllInvestmentsLabel}</span>
              <span className="flex items-center justify-center font-b1-medium font-bbl-medium text-primary">{formatCurrency(totalAdditionalInvestment)}</span>
            </div>*/}
          </div>
        )
      }
      <div className="text-left space-y-2 mt-6">
        <h3 className="!font-bbl-medium font-b1-medium mb-4">{texts[language].config.notes.title}</h3>
        {/* <p className="font-bbl font-b1-regular !mb-4">{texts[language].config.notes.investmentCalculation}</p> */}
        <div className="space-y-1 font-b1-regular font-bbl">
          {/* {calculation.TaxPayment <= 0 && ( */}
          <div className='mb-4' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(texts[language].config.notes.investmentCalculation) }}></div>
          {/* )} */}
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatMessageWithPlaceholders(texts[language].config.notes.rmfAndPension, { combinedRMFPensionMax: apiMaxValues.MaxRMFSSFInsure60 })) }}></div>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatMessageWithPlaceholders(texts[language].config.notes.lifeAndHealthInsurance, { combinedLifeHealthMax: texts.config.individualMaxes.combinedLifeHealthMax })) }}></div>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatMessageWithPlaceholders(texts[language].config.notes.thaiEsg, { thaiEsgMax: texts.config.individualMaxes.thaiEsg })) }}></div>
        </div>
      </div>
      <div className="flex justify-center mt-6 gap-4">
        <Button variant={calculation.TaxPayment <= 0 ? "default" : "outline"} onClick={onBack} className="font-bbl-medium !font-b1-medium">
          {texts.buttons.backButton}
        </Button>
        {calculation.TaxPayment > 0 && (
          <Button onClick={handleRecalculateClick} className="font-bbl-medium !font-b1-medium" disabled={
            hasAnyError || (Object.values(additionalInvestments).every(v => v === 0) && !recalculateButtonEnabledOnce)
          }>            {texts.buttons.recalculateButton}
          </Button>
        )}
      </div>
    </div >
  );
};

export default TSResultsPage;