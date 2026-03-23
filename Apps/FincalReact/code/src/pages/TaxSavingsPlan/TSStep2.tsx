import React from 'react';
import { formatNumber } from '../../lib/utils';
import { FormInput } from '../../components/common/FormInput';
import { Checkbox } from '@/components/ui/checkbox';
import { TaxSavingsData, TaxCalculationResult } from './types';
import { TaxSavingsLanguageTexts } from './utils/TaxSavingsConfigLoader';
import { useStepValidation } from '../../hooks/useStepValidation';
import { SectionHeader } from '../../components/common/SectionHeader';
import DOMPurify from 'dompurify';
import { max } from 'date-fns';

interface TSStep2Props {
  taxSavings: {
    data: TaxSavingsData;
    updateData: (field: keyof TaxSavingsData, value: number | string | boolean) => void;
    language: 'th' | 'en';
    appTexts: TaxSavingsLanguageTexts;
    apiMaxValues: Partial<TaxCalculationResult>;
    setStep2IsValid: (isValid: boolean) => void;
  };
}

const TSStep2: React.FC<TSStep2Props> = ({ taxSavings }) => {
  const { data, updateData, language, appTexts: texts, apiMaxValues, setStep2IsValid } = taxSavings;
  const { updateFieldValidation, isStepValid } = useStepValidation();

  // Notify parent of validation status changes
  React.useEffect(() => {
    setStep2IsValid(isStepValid);
  }, [isStepValid, setStep2IsValid]);

  // Effect to reset values if max becomes 0
  // Effect to reset values if max becomes 0
  React.useEffect(() => {
    const fieldsToReset = [
      {
        field: 'lifeInsurancePremium',
        currentValue: data.lifeInsurancePremium,
        calculatedMax: Math.max(0, Math.min(apiMaxValues.MaxInsure || 100000, Math.max(0, (apiMaxValues.MaxInsure - (data.healthInsurancePremium || 0)) <= 0 ? 0 : apiMaxValues.MaxInsure - (data.healthInsurancePremium || 0))))
      },
      {
        field: 'healthInsurancePremium',
        currentValue: data.healthInsurancePremium,
        calculatedMax: Math.max(0, data.lifeInsurancePremium > (100000 - (apiMaxValues.MaxHealthInsure || 25000)) ?
          (apiMaxValues.MaxHealthInsure || 25000) - (data.lifeInsurancePremium - (100000 - (apiMaxValues.MaxHealthInsure || 25000))) <= 0 ?
            0 : (apiMaxValues.MaxHealthInsure || 25000) - (data.lifeInsurancePremium - (100000 - (apiMaxValues.MaxHealthInsure || 25000)))
          : apiMaxValues.MaxHealthInsure || 25000)
      },
      {
        field: 'lifePensionInsurancePremium',
        currentValue: data.lifePensionInsurancePremium,
        calculatedMax: Math.max(0, data.rmfSavings + (apiMaxValues.MaxInsure60 || 0) >= (apiMaxValues.MaxRMFSSFInsure60 || 0) ?
          (apiMaxValues.MaxInsure60 || 0) - (data.rmfSavings + (apiMaxValues.MaxInsure60 || 0) - (apiMaxValues.MaxRMFSSFInsure60 || 0)) : (apiMaxValues.MaxInsure60 || 0))
      },
      {
        field: 'rmfSavings',
        currentValue: data.rmfSavings,
        calculatedMax: Math.max(0, data.lifePensionInsurancePremium + (apiMaxValues.MaxRMF || 0) >= (apiMaxValues.MaxRMFSSFInsure60 || 0) ?
          (apiMaxValues.MaxRMF || 0) - (data.lifePensionInsurancePremium + (apiMaxValues.MaxRMF || 0) - (apiMaxValues.MaxRMFSSFInsure60 || 0)) : (apiMaxValues.MaxRMF || 0))
      },
      {
        field: 'thaiEsgSavings',
        currentValue: data.thaiEsgSavings,
        calculatedMax: Math.max(0, apiMaxValues.MaxESG || 300000)
      }
    ];

    fieldsToReset.forEach(({ field, currentValue, calculatedMax }) => {
      if (calculatedMax <= 0 && (currentValue || 0) > 0) {
        updateData(field as keyof TaxSavingsData, 0);
      }
    });
  }, [apiMaxValues, data, updateData]);

  const healthInsurancePremiumIndividualMax = apiMaxValues.MaxHealthInsure || 25000;
  // const healthPremiumForLifeInsuranceCalc =
  //   Math.min((data.healthInsurancePremium || 0), healthInsurancePremiumIndividualMax);

  const getPlaceholder = (max: number, staticPlaceholder?: string) => {
    if (staticPlaceholder) {
      if (max === 0) return "0";
      return staticPlaceholder;
    }
    if (max === 0) return "0";
    return `0 - ${formatNumber(max)}`;
  };

  return (
    <div className="space-y-6">
      {/* Family Deduction Section */}
      <SectionHeader title={texts.steps.step2.familyDeductionLabel} hint={texts.steps.step2.familyDeductionHint} />
      {
        [
          {
            field: 'numberOfChildrenBefore2561',
            label: texts.steps.step2.numberOfChildrenBefore2561Label,
            max: 10,
            maxLength: 2,
            maxValueDisplay: texts.steps.step2.numberOfChildrenBefore2561Max,
            placeholder: getPlaceholder(10, "0 - 10")
          },
          {
            field: 'numberOfChildrenAfter2561',
            label: texts.steps.step2.numberOfChildrenAfter2561Label,
            max: 10,
            maxLength: 2,
            maxValueDisplay: texts.steps.step2.numberOfChildrenAfter2561Max,
            placeholder: getPlaceholder(10, "0 - 10")
          },
        ].map((inputProps) => (
          <FormInput
            key={inputProps.field}
            label={inputProps.label}
            value={data[inputProps.field as keyof TaxSavingsData] as number}
            onChange={(val) => updateData(inputProps.field as keyof TaxSavingsData, val)}
            onValidationChange={(isValid) => updateFieldValidation(inputProps.field, isValid)}
            language={language}
            percentageError={texts[language].config.validation.percentageError}
            minValueError={texts[language].config.validation.minValueError}
            maxValueError={texts[language].config.validation.maxValueError}
            min={0}
            max={inputProps.max}
            maxLength={inputProps.maxLength}
            maxValueDisplay={inputProps.maxValueDisplay}
            placeholder={inputProps.placeholder}
            disabled={inputProps.max === 0}
          />
        ))
      }
      {/* Parental Deduction */}
      <div className="tax-saving-grid tax-saving-grid-cols-1 md:tax-saving-grid-cols-2 gap-4">
        <div>
          <SectionHeader title={texts.steps.step2.parentalDeductionSelfLabel} />
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="parental-self-father"
                checked={data.parentalDeductionSelfFather === 1}
                onCheckedChange={(checked) => updateData('parentalDeductionSelfFather', checked ? 1 : 0)}
              />
              <label htmlFor="parental-self-father" className="font-b1-regular font-bbl">
                {texts.common.fatherLabel}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="parental-self-mother"
                checked={data.parentalDeductionSelfMother === 1}
                onCheckedChange={(checked) => updateData('parentalDeductionSelfMother', checked ? 1 : 0)}
              />
              <label htmlFor="parental-self-mother" className="font-b1-regular font-bbl">
                {texts.common.motherLabel}
              </label>
            </div>
          </div>
          <p className={`font-b3-regular text-[#2DCD73] mt-1 font-bbl-looped ${!isStepValid ? 'invisible' : ''}`}>{texts.steps.step2.parentalDeductionSelfMax}</p>
        </div>

        <div>
          <SectionHeader title={texts.steps.step2.parentalDeductionSpouseLabel} />
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="parental-spouse-father"
                checked={data.parentalDeductionSpouseFather === 1}
                onCheckedChange={(checked) => updateData('parentalDeductionSpouseFather', checked ? 1 : 0)}
              />
              <label htmlFor="parental-spouse-father" className="font-b1-regular font-bbl">
                {texts.common.fatherLabel}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="parental-spouse-mother"
                checked={data.parentalDeductionSpouseMother === 1}
                onCheckedChange={(checked) => updateData('parentalDeductionSpouseMother', checked ? 1 : 0)}
              />
              <label htmlFor="parental-spouse-mother" className="font-b1-regular font-bbl">
                {texts.common.motherLabel}
              </label>
            </div>
          </div>
          <p className={`font-b3-regular text-[#2DCD73] mt-1 font-bbl-looped ${!isStepValid ? 'invisible' : ''}`}>{texts.steps.step2.parentalDeductionSpouseMax}</p>
        </div>
      </div>

      {/* Insurance Deductions */}
      <SectionHeader title={texts.steps.step2.insuranceSectionLabel} hint={texts.steps.step2.insuranceSectionHint} />
      {
        [
          {
            field: 'lifeInsurancePremium',
            label: texts.steps.step2.lifeInsurancePremiumLabel,
            max: Math.min(apiMaxValues.MaxInsure || 100000, Math.max(0, (apiMaxValues.MaxInsure - (data.healthInsurancePremium || 0)) <= 0 ?
              0 : apiMaxValues.MaxInsure - (data.healthInsurancePremium || 0))),
            maxLength: 7,
            maxValueDisplay: (Math.min(apiMaxValues.MaxInsure || 100000, Math.max(0, (apiMaxValues.MaxInsure - (data.healthInsurancePremium || 0)) <= 0 ?
              0 : apiMaxValues.MaxInsure - (data.healthInsurancePremium || 0)))) === 0 ?
              texts.results.noRemainDeduction : texts.steps.step2.lifeInsurancePremiumMax.replace('{max}',
                formatNumber(Math.min(apiMaxValues.MaxInsure || 100000, Math.max(0, (apiMaxValues.MaxInsure - (data.healthInsurancePremium || 0)) <= 0 ? 0 :
                  apiMaxValues.MaxInsure - (data.healthInsurancePremium || 0))))),
            placeholder: getPlaceholder(Math.min(apiMaxValues.MaxInsure || 100000, (apiMaxValues.MaxInsure - (data.healthInsurancePremium || 0)) <= 0 ? 0 :
              apiMaxValues.MaxInsure - (data.healthInsurancePremium || 0)))
          },
          {
            field: 'healthInsurancePremium',
            label: texts.steps.step2.healthInsurancePremiumLabel,
            max: Math.max(0, data.lifeInsurancePremium > (100000 - (apiMaxValues.MaxHealthInsure || 25000)) ?
              ((apiMaxValues.MaxHealthInsure || 25000) - (data.lifeInsurancePremium - (100000 - (apiMaxValues.MaxHealthInsure || 25000))) <= 0 ?
                0 : (apiMaxValues.MaxHealthInsure || 25000) - (data.lifeInsurancePremium - (100000 - (apiMaxValues.MaxHealthInsure || 25000))))
              : (apiMaxValues.MaxHealthInsure || 25000)),
            maxLength: 6,
            maxValueDisplay: ((apiMaxValues.MaxHealthInsure || 25000) - (data.lifeInsurancePremium > (100000 - (apiMaxValues.MaxHealthInsure || 25000)) ?
              (data.lifeInsurancePremium - (100000 - (apiMaxValues.MaxHealthInsure || 25000))) : 0)) <= 0 ?
              texts.results.noRemainDeduction : texts.steps.step2.healthInsurancePremiumMax.replace('{max}',
                data.lifeInsurancePremium > (100000 - apiMaxValues.MaxHealthInsure || 25000) ?
                  formatNumber((apiMaxValues.MaxHealthInsure || 25000) - (data.lifeInsurancePremium - (100000 - apiMaxValues.MaxHealthInsure || 25000)) <= 0 ?
                    0 : (apiMaxValues.MaxHealthInsure || 25000) - (data.lifeInsurancePremium - (100000 - apiMaxValues.MaxHealthInsure || 25000)))
                  : formatNumber(apiMaxValues.MaxHealthInsure || 25000)),
            placeholder: getPlaceholder(data.lifeInsurancePremium > (100000 - apiMaxValues.MaxHealthInsure || 25000) ?
              ((apiMaxValues.MaxHealthInsure || 25000) - (data.lifeInsurancePremium - (100000 - apiMaxValues.MaxHealthInsure || 25000)) <= 0 ?
                0 : (apiMaxValues.MaxHealthInsure || 25000) - (data.lifeInsurancePremium - (100000 - apiMaxValues.MaxHealthInsure || 25000)))
              : (apiMaxValues.MaxHealthInsure || 25000))
          },
          {
            field: 'lifePensionInsurancePremium',
            label: texts.steps.step2.lifePensionInsurancePremiumLabel,
            max: Math.max(0,
              data.rmfSavings + apiMaxValues.MaxInsure60 >= apiMaxValues.MaxRMFSSFInsure60 ?
                (
                  apiMaxValues.MaxInsure60 - (data.rmfSavings + apiMaxValues.MaxInsure60 - apiMaxValues.MaxRMFSSFInsure60) <= 0 ? 0 :
                    apiMaxValues.MaxInsure60 - (data.rmfSavings + apiMaxValues.MaxInsure60 - apiMaxValues.MaxRMFSSFInsure60)
                ) : apiMaxValues.MaxInsure60
            ),
            maxLength: 7,
            maxValueDisplay: (
              data.rmfSavings + apiMaxValues.MaxInsure60 >= apiMaxValues.MaxRMFSSFInsure60 ?
                apiMaxValues.MaxInsure60 - (data.rmfSavings + apiMaxValues.MaxInsure60 - apiMaxValues.MaxRMFSSFInsure60) : apiMaxValues.MaxInsure60)
              && apiMaxValues.MaxInsure60 - (data.rmfSavings + apiMaxValues.MaxInsure60 - apiMaxValues.MaxRMFSSFInsure60) <= 0 ?
              texts.results.noRemainDeduction : texts.steps.step2.lifePensionInsurancePremiumMax.replace('{max}',
                formatNumber(
                  data.rmfSavings + apiMaxValues.MaxInsure60 >= apiMaxValues.MaxRMFSSFInsure60 ?
                    (
                      apiMaxValues.MaxInsure60 - (data.rmfSavings + apiMaxValues.MaxInsure60 - apiMaxValues.MaxRMFSSFInsure60) <= 0 ? 0 :
                        apiMaxValues.MaxInsure60 - (data.rmfSavings + apiMaxValues.MaxInsure60 - apiMaxValues.MaxRMFSSFInsure60)
                    ) : apiMaxValues.MaxInsure60
                )
              ),
            placeholder: getPlaceholder(data.rmfSavings + apiMaxValues.MaxInsure60 >= apiMaxValues.MaxRMFSSFInsure60 ?
              (
                apiMaxValues.MaxInsure60 - (data.rmfSavings + apiMaxValues.MaxInsure60 - apiMaxValues.MaxRMFSSFInsure60) <= 0 ? 0 :
                  apiMaxValues.MaxInsure60 - (data.rmfSavings + apiMaxValues.MaxInsure60 - apiMaxValues.MaxRMFSSFInsure60)
              ) : apiMaxValues.MaxInsure60)

          },
          {
            field: 'healthParentInsurancePremium',
            label: texts.steps.step2.healthParentInsurancePremiumLabel,
            max: 15000,
            maxLength: 6,
            maxValueDisplay: texts.steps.step2.healthInsurancePremiumMax.replace('{max}', formatNumber(15000)),
            placeholder: getPlaceholder(15000)
          }
        ].map((inputProps) => (
          <FormInput
            key={inputProps.field}
            label={inputProps.label}
            value={data[inputProps.field as keyof TaxSavingsData] as number}
            onChange={(val) => updateData(inputProps.field as keyof TaxSavingsData, val)}
            onValidationChange={(isValid) => updateFieldValidation(inputProps.field, isValid)}
            language={language}
            percentageError={texts[language].config.validation.percentageError}
            minValueError={texts[language].config.validation.minValueError}
            maxValueError={texts[language].config.validation.maxValueError}
            min={0}
            max={inputProps.max}
            maxLength={inputProps.max === 0 ? 0 : inputProps.maxLength}
            maxValueDisplay={inputProps.maxValueDisplay}
            placeholder={inputProps.placeholder}
          />
        ))
      }

      {/* Investment Deductions */}
      <SectionHeader title={texts.steps.step2.investmentSectionLabel} hint={texts.steps.step2.investmentSectionHint} />
      {
        [
          {
            field: 'rmfSavings',
            label: texts.steps.step2.rmfSavingsLabel,
            max: Math.max(0,
              data.lifePensionInsurancePremium + apiMaxValues.MaxRMF >= apiMaxValues.MaxRMFSSFInsure60 ?
                (
                  apiMaxValues.MaxRMF - (data.lifePensionInsurancePremium + apiMaxValues.MaxRMF - apiMaxValues.MaxRMFSSFInsure60) <= 0 ? 0 :
                    apiMaxValues.MaxRMF - (data.lifePensionInsurancePremium + apiMaxValues.MaxRMF - apiMaxValues.MaxRMFSSFInsure60)
                ) : apiMaxValues.MaxRMF
            ),
            maxLength: 7,
            maxValueDisplay: (
              data.lifePensionInsurancePremium + (apiMaxValues.MaxRMF - data.lifePensionInsurancePremium) >= apiMaxValues.MaxRMFSSFInsure60 ?
                apiMaxValues.MaxRMF - data.lifePensionInsurancePremium : apiMaxValues.MaxRMF)
              && apiMaxValues.MaxRMF - (data.lifePensionInsurancePremium + apiMaxValues.MaxRMF - apiMaxValues.MaxRMFSSFInsure60) <= 0 ? texts.results.noRemainDeduction : texts.steps.step2.rmfSavingsMax.replace('{max}',
                formatNumber(
                  data.lifePensionInsurancePremium + apiMaxValues.MaxRMF >= apiMaxValues.MaxRMFSSFInsure60 ?
                    (
                      apiMaxValues.MaxRMF - (data.lifePensionInsurancePremium + apiMaxValues.MaxRMF - apiMaxValues.MaxRMFSSFInsure60) <= 0 ? 0 :
                        apiMaxValues.MaxRMF - (data.lifePensionInsurancePremium + apiMaxValues.MaxRMF - apiMaxValues.MaxRMFSSFInsure60)
                    ) : apiMaxValues.MaxRMF
                )
              ),
            placeholder: getPlaceholder(data.lifePensionInsurancePremium + apiMaxValues.MaxRMF >= apiMaxValues.MaxRMFSSFInsure60 ?
              (
                apiMaxValues.MaxRMF - (data.lifePensionInsurancePremium + apiMaxValues.MaxRMF - apiMaxValues.MaxRMFSSFInsure60) <= 0 ? 0 :
                  apiMaxValues.MaxRMF - (data.lifePensionInsurancePremium + apiMaxValues.MaxRMF - apiMaxValues.MaxRMFSSFInsure60)
              ) : apiMaxValues.MaxRMF)
          },
          {
            field: 'thaiEsgSavings',
            label: texts.steps.step2.thaiEsgSavingsLabel,
            max: Math.max(0, apiMaxValues.MaxESG || 300000),
            maxLength: 7,
            maxValueDisplay: texts.steps.step2.thaiEsgSavingsMax.replace('{max}', formatNumber(apiMaxValues.MaxESG || 300000)),
            placeholder: getPlaceholder(apiMaxValues.MaxESG || 300000)
          },
        ].map((inputProps) => (
          <FormInput
            key={inputProps.field}
            label={inputProps.label}
            value={data[inputProps.field as keyof TaxSavingsData] as number}
            onChange={(val) => updateData(inputProps.field as keyof TaxSavingsData, val)}
            onValidationChange={(isValid) => updateFieldValidation(inputProps.field, isValid)}
            minValueError={texts[language].config.validation.minValueError}
            maxValueError={texts[language].config.validation.maxValueError}
            language={language}
            min={0}
            max={inputProps.max}
            maxLength={inputProps.max === 0 ? 0 : inputProps.maxLength}
            maxValueDisplay={inputProps.maxValueDisplay}
            placeholder={inputProps.placeholder}
          />
        ))
      }

      {/* Other Deductions */}
      <SectionHeader title={texts.steps.step2.otherDeductionsSectionLabel} hint={texts.steps.step2.otherDeductionsSectionHint} />
      {
        [
          {
            field: 'homeLoanInterest',
            label: texts.steps.step2.homeLoanInterestLabel,
            max: 100000,
            maxLength: 7,
            maxValueDisplay: texts.steps.step2.homeLoanInterestMax.replace('{max}', formatNumber(100000)),
            placeholder: getPlaceholder(100000, "0 - 100,000")
          },
          {
            field: 'donation',
            label: texts.steps.step2.donationLabel,
            max: 999999999,
            maxLength: 11,
            maxValueDisplay: texts.steps.step2.donationMax,
            placeholder: getPlaceholder(999999999, "0 - 999,999,999")
          },
          {
            field: 'otherDeductions',
            label: texts.steps.step2.otherDeductionsLabel,
            max: 1000000,
            maxLength: 9,
            maxValueDisplay: texts.steps.step2.otherDeductionsMax,
            placeholder: getPlaceholder(1000000, "0 - 1,000,000")
          },
        ].map((inputProps) => (
          <FormInput
            key={inputProps.field}
            label={inputProps.label}
            value={data[inputProps.field as keyof TaxSavingsData] as number}
            onChange={(val) => updateData(inputProps.field as keyof TaxSavingsData, val)}
            onValidationChange={(isValid) => updateFieldValidation(inputProps.field, isValid)}
            language={language}
            percentageError={texts[language].config.validation.percentageError}
            minValueError={texts[language].config.validation.minValueError}
            maxValueError={texts[language].config.validation.maxValueError}
            min={0}
            max={inputProps.max}
            maxLength={inputProps.maxLength}
            maxValueDisplay={inputProps.maxValueDisplay}
            placeholder={inputProps.placeholder}
          />
        ))
      }
      <div className='pt-4'>
        <p className="font-bbl-medium font-b1-medium  mb-4">{texts[language].config.notes.title}</p>
        <p className="font-b1-regular font-bbl mb-3">{texts[language].config.notes.taxNote}</p>
        <p className="font-b1-regular font-bbl" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(texts[language].config.notes.thaiEsgNote) }}></p>
      </div>
    </div>
  );
};

export default TSStep2;