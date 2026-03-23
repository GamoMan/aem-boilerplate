import React from 'react';
import { FormInput } from '../../components/common/FormInput';
import { useStepValidation } from '../../hooks/useStepValidation';
import { useTaxSavings } from './hooks/useTaxSavings';

interface TSStep1Props {
  taxSavings: ReturnType<typeof useTaxSavings>;
}

const TSStep1: React.FC<TSStep1Props> = ({ taxSavings }) => {
  const { data, updateData, language, appTexts: texts, setStep1IsValid } = taxSavings;
  const { updateFieldValidation, isStepValid } = useStepValidation();

  React.useEffect(() => {
    if (setStep1IsValid) {
      setStep1IsValid(isStepValid);
    }
  }, [isStepValid, setStep1IsValid]);

  if (!data || !texts) {
    return <div>Loading...</div>;
  }
  return (
    <>
    <div className="space-y-6 mb-4">
      <FormInput
        label={texts.steps.step1.currentMonthlyIncomeLabel}
        value={data.currentMonthlyIncome}
        onChange={(val) => updateData('currentMonthlyIncome', val)}
        onValidationChange={(isValid) => updateFieldValidation('currentMonthlyIncome', isValid)}
        language={language}
        maxLength={11}
        placeholder="0 - 999,999,999"
        percentageError={texts[language].config.validation.percentageError}
        minValueError={texts[language].config.validation.minValueError}
        maxValueError={texts[language].config.validation.maxValueError}
      />
      <FormInput
        label={texts.steps.step1.otherIncomeLabel}
        value={data.otherIncome}
        onChange={(val) => updateData('otherIncome', val)}
        onValidationChange={(isValid) => updateFieldValidation('otherIncome', isValid)}
        language={language}
        maxLength={11}
        placeholder="0 - 999,999,999"
        percentageError={texts[language].config.validation.percentageError}
        minValueError={texts[language].config.validation.minValueError}
        maxValueError={texts[language].config.validation.maxValueError}
      />
      <FormInput
        label={texts.steps.step1.annualBonusLabel}
        value={data.annualBonus}
        onChange={(val) => updateData('annualBonus', val)}
        onValidationChange={(isValid) => updateFieldValidation('annualBonus', isValid)}
        language={language}
        maxLength={11}
        placeholder="0 - 999,999,999"
        percentageError={texts[language].config.validation.percentageError}
        minValueError={texts[language].config.validation.minValueError}
        maxValueError={texts[language].config.validation.maxValueError}
      />
      <FormInput
        label={texts.steps.step1.providentFundContributionRateLabel}
        value={data.providentFundContributionRate}
        onChange={(val) => updateData('providentFundContributionRate', val)}
        onValidationChange={(isValid) => updateFieldValidation('providentFundContributionRate', isValid)}
        isPercentage={true}
        min={0}
        max={15}
        language={language}
        placeholder="0 - 15"
        percentageError={texts[language].config.validation.percentageError}
        minValueError={texts[language].config.validation.minValueError}
        maxValueError={texts[language].config.validation.maxValueError}
      />
    </div>
    <div className='pt-4'>
      <p className="!font-bbl-medium font-b1-medium mb-4">{texts[language].config.notes.title}</p>
      <p className="font-b1-regular font-bbl">{texts.common.noteText}</p>
    </div>
    </>
  );
};

export default TSStep1;