import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FormInput } from '../../components/common/FormInput';
import { RetirementData, CalculationResult, LanguageTexts } from './utils/retirementUtils';
import CalculationSummaryBox from './components/CalculationSummaryBox';
import { formatNumber } from '@/lib/utils';

interface SectionState {
  showDetails: boolean;
  hasBeenInteracted: boolean;
  focusedInputs: Set<string>;
}

interface SectionsState {
  savings: SectionState;
  providentFund: SectionState;
  rmf: SectionState;
  lumpSum: SectionState;
}

interface Step2Props {
  data: RetirementData;
  updateData: (field: keyof RetirementData, value: number) => void;
  language: 'th' | 'en';
  calculation: CalculationResult;
  texts: LanguageTexts;
  onValidationChange?: (isValid: boolean) => void;
  isStep2Active?: boolean;
  sections: SectionsState;
  setSections: React.Dispatch<React.SetStateAction<SectionsState>>;
}

const Step2: React.FC<Step2Props> = ({ data, updateData, language, calculation, texts, onValidationChange, isStep2Active, sections, setSections }) => {

  const [validationState, setValidationState] = useState({
    savingsExpectedReturnRate: true,
    annualSavingsIncreaseRate: true,
    providentFundExpectedReturnRate: true,
    annualSalaryIncreaseRate: true,
    providentFundContributionRate: true,
    expectedAnnualRMFAccumulation: true,
    rmfExpectedReturnRate: true,
    expectedAnnualInvestment: true,
    lumpSumExpectedReturnRate: true,
    annualSavingsIncreaseRateComparison: true,
  });

  const validateField = (field: keyof typeof validationState, value: number, min?: number, max?: number) => {
    let isValid = true;

    if (isNaN(value) || value < 0) {
      isValid = false;
    }

    if (min !== undefined && value < min) {
      isValid = false;
    }
    if (max !== undefined && value > max) {
      isValid = false;
    }
    setValidationState(prev => ({ ...prev, [field]: isValid }));
    return isValid;
  };

  const isFormValid = () => {
    return Object.values(validationState).every(state => state === true);
  };

  useEffect(() => {
    if (isStep2Active && onValidationChange) {
      onValidationChange(isFormValid());
    }
  }, [validationState, isStep2Active, onValidationChange]);

  // Validate all fields when component mounts or data changes
  useEffect(() => {
    if (isStep2Active) {
      validateField('savingsExpectedReturnRate', data.savingsExpectedReturnRate, 0.1, 100);
      validateField('annualSavingsIncreaseRate', data.annualSavingsIncreaseRate, 0, 100);
      validateField('providentFundExpectedReturnRate', data.providentFundExpectedReturnRate, 0, 100);
      validateField('annualSalaryIncreaseRate', data.annualSalaryIncreaseRate, 0, 100);
      validateField('providentFundContributionRate', data.providentFundContributionRate, 0, 15);
      validateField('expectedAnnualRMFAccumulation', data.expectedAnnualRMFAccumulation, 0, 50000000);
      validateField('rmfExpectedReturnRate', data.rmfExpectedReturnRate, 0, 30);
      validateField('expectedAnnualInvestment', data.expectedAnnualInvestment, 0, 999999999);
      validateField('lumpSumExpectedReturnRate', data.lumpSumExpectedReturnRate, 0, 100);

      const isComparisonValid = data.annualSavingsIncreaseRate <= data.savingsExpectedReturnRate;
      setValidationState(prev => ({ ...prev, annualSavingsIncreaseRateComparison: isComparisonValid }));
    }
  }, [data, isStep2Active]);

  const handleGroupVisibility = useCallback(
    (
      sectionKey: keyof SectionsState,
      focused: boolean,
      inputId: string,
    ) => {
      setSections((prevSections) => {
        const newFocusedInputs = new Set(prevSections[sectionKey].focusedInputs);
        if (focused) {
          newFocusedInputs.add(inputId);
        } else {
          newFocusedInputs.delete(inputId);
        }

        const showDetails = focused || newFocusedInputs.size > 0 || prevSections[sectionKey].hasBeenInteracted;
        const hasBeenInteracted = prevSections[sectionKey].hasBeenInteracted || focused;

        return {
          ...prevSections,
          [sectionKey]: {
            ...prevSections[sectionKey],
            showDetails,
            hasBeenInteracted,
            focusedInputs: newFocusedInputs,
          },
        };
      });
    },
    [setSections]
  );

  useEffect(() => {
    setSections((prevSections) => ({
      ...prevSections,
      savings: {
        ...prevSections.savings,
        showDetails: data.currentSavings > 0 || prevSections.savings.hasBeenInteracted,
      },
      providentFund: {
        ...prevSections.providentFund,
        showDetails: data.currentProvidentFundSavings > 0 || prevSections.providentFund.hasBeenInteracted,
      },
      rmf: {
        ...prevSections.rmf,
        showDetails: data.currentRMFSavings > 0 || prevSections.rmf.hasBeenInteracted,
      },
      lumpSum: {
        ...prevSections.lumpSum,
        showDetails: data.lumpSumAtRetirement > 0 || prevSections.lumpSum.hasBeenInteracted,
      },
    }));
  }, [data.currentSavings, data.currentProvidentFundSavings, data.currentRMFSavings, data.lumpSumAtRetirement, sections.savings.hasBeenInteracted, sections.providentFund.hasBeenInteracted, sections.rmf.hasBeenInteracted, sections.lumpSum.hasBeenInteracted]);

  return (
    <>
      <div className="text-center mb-8">
        <CalculationSummaryBox
          calculation={calculation}
          language={language}
          texts={texts}
        />
        <p className={`text-gray-50 mb-1 text-left font-b3-regular font-bbl-looped`}>
          {texts.common.noteText?.replace('{inflationRate}', calculation.inflationRate.toString()).replace('{afterretirerate}', calculation.afterretirerate.toString())}
        </p>        
      </div>
      <div className="text-center mb-8">
        <h2 className={`font-h4-medium text-black mb-6 !font-bbl-medium`}>
          {texts.common.step2Title.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < texts.common.step2Title.split('\n').length - 1 && <br />}
            </span>
          ))}
        </h2>
      </div>
      <div className="mb-8">
        <h3 className={`font-b1-medium mb-4 !font-bbl-medium`}>
          {texts.steps.step2.savingsSection}
        </h3>
        <div className="space-y-2">
          <FormInput
            label={texts.steps.step2.currentSavingsLabel}
            value={data.currentSavings}
            onChange={(value) => updateData('currentSavings', value)}
            language={language}
            showAlways={true}
            onFocusChange={(focused) => handleGroupVisibility('savings', focused, 'currentSavings')}
            min={0}
            max={999999999}
            maxLength={11}
            placeholder="0-999,999,999"
          />
          {sections.savings.showDetails && (
            <>
              <FormInput
                label={texts.steps.step2.savingsExpectedReturnRateLabel}
                value={data.savingsExpectedReturnRate}
                onChange={(value) => {
                  updateData('savingsExpectedReturnRate', value);
                  validateField('savingsExpectedReturnRate', value, 0.1, 100);
                }}
                isPercentage={true}
                language={language}
                onFocusChange={(focused) => handleGroupVisibility('savings', focused, 'savingsExpectedReturnRate')}
                min={0.1}
                max={100}
                maxLength={5}
                placeholder="0.1-100"
                error={!validationState.savingsExpectedReturnRate}
                errorMessage={
                  data.savingsExpectedReturnRate <= 0.1
                    ? texts.validation.betweenValueError?.replace('{min}', texts.validation.betweenValuePlaceholder ?? '0.1').replace('{max}', '100')
                    : texts.validation.maxValueError ? `${texts.validation.maxValueError} 100` : 'Maximum up to 100'
                }
              />
              <FormInput
                label={texts.steps.step2.annualSavingsIncreaseRateLabel}
                value={data.annualSavingsIncreaseRate}
                onChange={(value) => {
                  updateData('annualSavingsIncreaseRate', value);
                  validateField('annualSavingsIncreaseRate', value, 100);
                }}
                isPercentage={true}
                language={language}
                onFocusChange={(focused) => handleGroupVisibility('savings', focused, 'annualSavingsIncreaseRate')}
                min={0}
                max={100}
                maxLength={5}
                placeholder="0-100"
                error={!validationState.annualSavingsIncreaseRate || !validationState.annualSavingsIncreaseRateComparison}
                errorMessage={
                  //data.annualSavingsIncreaseRate === 0 ? texts.validation.betweenValueError?.replace('{min}','0').replace('{max}','100') 
                     !validationState.annualSavingsIncreaseRateComparison
                    ? (texts.validation.annualSavingsIncreaseRateError?.replace('{rate}', String(data.savingsExpectedReturnRate)) || `Must be <= Savings Expected Return Rate (${data.savingsExpectedReturnRate}%)`)
                    : (texts.validation.maxValueError ? `${texts.validation.maxValueError} 100` : 'Maximum up to 100')               
                }
              />
            </>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className={`font-b1-medium mb-4 !font-bbl-medium`}>
          {texts.steps.step2.providentFundSection}
        </h3>
        <div className="space-y-2">
          <FormInput
            label={texts.steps.step2.currentProvidentFundSavingsLabel}
            value={data.currentProvidentFundSavings}
            onChange={(value) => updateData('currentProvidentFundSavings', value)}
            language={language}
            showAlways={true}
            onFocusChange={(focused) => handleGroupVisibility('providentFund', focused, 'currentProvidentFundSavings')}
            min={0}
            max={999999999}
            maxLength={11}
            placeholder="0-999,999,999"
          />
          {sections.providentFund.showDetails && (
            <>
              <FormInput
                label={texts.steps.step2.providentFundExpectedReturnRateLabel}
                value={data.providentFundExpectedReturnRate}
                onChange={(value) => {
                  updateData('providentFundExpectedReturnRate', value);
                  validateField('providentFundExpectedReturnRate', value, 100);
                }}
                isPercentage={true}
                language={language}
                onFocusChange={(focused) => handleGroupVisibility('providentFund', focused, 'providentFundExpectedReturnRate')}
                min={0}
                max={100}
                maxLength={5}
                placeholder="0-100"
                error={!validationState.providentFundExpectedReturnRate}
                errorMessage={texts.validation.maxValueError ? `${texts.validation.maxValueError} 100` : 'Maximum up to 100'}
              />
              <FormInput
                label={texts.steps.step2.monthlySalaryLabel}
                value={data.monthlySalary}
                onChange={(value) => updateData('monthlySalary', value)}
                language={language}
                onFocusChange={(focused) => handleGroupVisibility('providentFund', focused, 'monthlySalary')}
                min={0}
                max={999999999}
                maxLength={11}
                placeholder="0-999,999,999"
              />
              <FormInput
                label={texts.steps.step2.annualSalaryIncreaseRateLabel}
                value={data.annualSalaryIncreaseRate}
                onChange={(value) => {
                  updateData('annualSalaryIncreaseRate', value);
                  validateField('annualSalaryIncreaseRate', value, 100);
                }}
                isPercentage={true}
                language={language}
                onFocusChange={(focused) => handleGroupVisibility('providentFund', focused, 'annualSalaryIncreaseRate')}
                min={0}
                max={100}
                maxLength={45}
                placeholder="0-100"
                error={!validationState.annualSalaryIncreaseRate}
                errorMessage={texts.validation.maxValueError ? `${texts.validation.maxValueError} 100` : 'Maximum up to 100'}
              />
              <FormInput
                label={texts.steps.step2.providentFundContributionRateLabel}
                value={data.providentFundContributionRate}
                onChange={(value) => {
                  updateData('providentFundContributionRate', value);
                  validateField('providentFundContributionRate', value, 15);
                }}
                isPercentage={true}
                language={language}
                onFocusChange={(focused) => handleGroupVisibility('providentFund', focused, 'providentFundContributionRate')}
                min={0}
                max={15}
                maxLength={5}
                placeholder="0-15"
                error={!validationState.providentFundContributionRate}
                errorMessage={texts.validation.maxValueError ? `${texts.validation.maxValueError} 15` : 'Maximum up to 15'}
              />
            </>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className={`font-b1-medium mb-4 !font-bbl-medium`}>
          {texts.steps.step2.rmfSection}
        </h3>
        <div className="space-y-2">
          <FormInput
            label={texts.steps.step2.currentRMFSavingsLabel}
            value={data.currentRMFSavings}
            onChange={(value) => updateData('currentRMFSavings', value)}
            language={language}
            showAlways={true}
            onFocusChange={(focused) => handleGroupVisibility('rmf', focused, 'currentRMFSavings')}
            min={0}
            max={50000000}
            maxLength={10}
            placeholder="0-50,000,000"
            errorMessage={texts.validation.maxValueError ? `${texts.validation.maxValueError} ${formatNumber(50000000)}` : 'Maximum up to ${formatNumber(50000000)'}
          />
          {sections.rmf.showDetails && (
            <>
              <FormInput
                label={texts.steps.step2.expectedAnnualRMFAccumulationLabel}
                value={data.expectedAnnualRMFAccumulation}
                onChange={(value) => {
                  updateData('expectedAnnualRMFAccumulation', value);
                  validateField('expectedAnnualRMFAccumulation', value);
                }}
                language={language}
                onFocusChange={(focused) => handleGroupVisibility('rmf', focused, 'expectedAnnualRMFAccumulation')}
                min={0}
                max={500000}
                maxLength={7}
                placeholder="0-500,000"
                errorMessage={texts.validation.maxValueError ? `${texts.validation.maxValueError} ${formatNumber(500000)}` : 'Maximum up to ${formatNumber(500000)'}
              />
              <FormInput
                label={texts.steps.step2.rmfExpectedReturnRateLabel}
                value={data.rmfExpectedReturnRate}
                onChange={(value) => {
                  updateData('rmfExpectedReturnRate', value);
                  validateField('rmfExpectedReturnRate', value, 30);
                }}
                isPercentage={true}
                language={language}
                onFocusChange={(focused) => handleGroupVisibility('rmf', focused, 'rmfExpectedReturnRate')}
                min={0}
                max={30}
                maxLength={5}
                placeholder="0-30"
                error={!validationState.rmfExpectedReturnRate}
                errorMessage={texts.validation.maxValueError ? `${texts.validation.maxValueError} 30` : 'Maximum up to 30'}
              />
            </>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className={`font-b1-medium mb-4 !font-bbl-medium`}>
          {texts.steps.step2.lumpSumSection}
        </h3>
        <div className="space-y-2">
          <FormInput
            label={texts.steps.step2.lumpSumAtRetirementLabel}
            value={data.lumpSumAtRetirement}
            onChange={(value) => updateData('lumpSumAtRetirement', value)}
            language={language}
            showAlways={true}
            onFocusChange={(focused) => handleGroupVisibility('lumpSum', focused, 'lumpSumAtRetirement')}
            min={0}
            max={999999999}
            maxLength={11}
            placeholder="0-999,999,999"
          />
          {sections.lumpSum.showDetails && (
            <>
              <FormInput
                label={texts.steps.step2.expectedAnnualInvestmentLabel}
                value={data.expectedAnnualInvestment}
                onChange={(value) => {
                  updateData('expectedAnnualInvestment', value);
                  validateField('expectedAnnualInvestment', value);
                }}
                language={language}
                onFocusChange={(focused) => handleGroupVisibility('lumpSum', focused, 'expectedAnnualInvestment')}
                min={0}
                max={999999999}
                maxLength={11}
                placeholder="0-999,999,999"
              />
              <FormInput
                label={texts.steps.step2.lumpSumExpectedReturnRateLabel}
                value={data.lumpSumExpectedReturnRate}
                onChange={(value) => {
                  updateData('lumpSumExpectedReturnRate', value);
                  validateField('lumpSumExpectedReturnRate', value, 100);
                }}
                isPercentage={true}
                language={language}
                onFocusChange={(focused) => handleGroupVisibility('lumpSum', focused, 'lumpSumExpectedReturnRate')}
                min={0}
                max={100}
                maxLength={5}
                placeholder="0-100"
                error={!validationState.lumpSumExpectedReturnRate}
                errorMessage={texts.validation.maxValueError ? `${texts.validation.maxValueError} 100` : 'Maximum up to 100'}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Step2;
