import React, { useState, useEffect } from 'react';
import { FormInput } from '../../components/common/FormInput';
import { RetirementData, LanguageTexts } from './utils/retirementUtils';
import MonthlyIncomeInput from './components/MonthlyIncomeInput';

interface Step1Props {
  data: RetirementData;
  updateData: (field: keyof RetirementData, value: number) => void;
  language: 'th' | 'en';
  texts: LanguageTexts;
  onValidationChange: (isValid: boolean) => void;
}

const Step1: React.FC<Step1Props> = ({ data, updateData, language, texts, onValidationChange }) => {
  const [errors, setErrors] = useState({
    currentAge: '',
    retirementAge: '',
    lifeExpectancy: '',
  });
  const [isMonthlyIncomeValid, setIsMonthlyIncomeValid] = useState(true);

  useEffect(() => {
    validateAges();
  }, [data.currentAge, data.retirementAge, data.lifeExpectancy, texts]);

  useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error !== '');
    onValidationChange(!hasErrors && isMonthlyIncomeValid);
  }, [errors, isMonthlyIncomeValid, onValidationChange]);

  const validateAges = () => {
    const newErrors = {
      currentAge: '',
      retirementAge: '',
      lifeExpectancy: '',
    };

    const { currentAge, retirementAge, lifeExpectancy } = data;

    // Validation for currentAge
    if (currentAge <= 0) {
      newErrors.currentAge = `${texts.validation.minValueError} 1`;
    } else if (currentAge > 120) {
      newErrors.currentAge = `${texts.validation.maxValueError} 120`;
    }

    // Validation for retirementAge
    if (retirementAge <= 0) {
      newErrors.retirementAge = `${texts.validation.minValueError} 1`;
    } else if (retirementAge > 120) {
      newErrors.retirementAge = `${texts.validation.maxValueError} 120`;
    }

    // Validation for lifeExpectancy
    if (lifeExpectancy <= 0) {
      newErrors.lifeExpectancy = `${texts.validation.minValueError} 1`;
    } else if (lifeExpectancy > 120) {
      newErrors.lifeExpectancy = `${texts.validation.maxValueError} 120`;
    }

    // Existing validation for currentAge and retirementAge
    if (currentAge >= retirementAge && !newErrors.currentAge && !newErrors.retirementAge) {
      newErrors.currentAge = texts.validation.currentAgeRetirementAgeError;
      newErrors.retirementAge = texts.validation.currentAgeRetirementAgeError;
    }

    // Existing validation for retirementAge and lifeExpectancy
    if (retirementAge >= lifeExpectancy && !newErrors.retirementAge && !newErrors.lifeExpectancy) {
      newErrors.retirementAge = texts.validation.retirementAgeLifeExpectancyError;
      newErrors.lifeExpectancy = texts.validation.retirementAgeLifeExpectancyError;
    }

    setErrors(newErrors);
  };

  const handleUpdateData = (field: keyof RetirementData, value: number) => {
    updateData(field, value);
  };

  return (
    <>
      <MonthlyIncomeInput
        label={texts.steps.step1.monthlyIncomeTitle}
        value={data.monthlyIncome}
        onChange={(value) => handleUpdateData('monthlyIncome', value)}
        language={language}
        texts={texts} 
        unit={texts.common.unit}
        note={texts.steps.step1.currentValueNote}
        min={1}
        max={999999999}
        onValidationChange={setIsMonthlyIncomeValid}
      />

      <div className="space-y-4 mt-8">
        <FormInput
          label={texts.steps.step1.currentAge}
          value={data.currentAge}
          onChange={(value) => handleUpdateData('currentAge', value)}
          language={language}
          error={!!errors.currentAge}
          errorMessage={errors.currentAge}
          min={1}
          max={120}
          maxLength={3}
          placeholder="1-120"
        />
        <FormInput
          label={texts.steps.step1.retirementAge}
          value={data.retirementAge}
          onChange={(value) => handleUpdateData('retirementAge', value)}
          language={language}
          error={!!errors.retirementAge}
          errorMessage={errors.retirementAge}
          min={1}
          max={120}
          maxLength={3}
          placeholder="1-120"
        />
        <FormInput
          label={texts.steps.step1.lifeExpectancy}
          value={data.lifeExpectancy}
          onChange={(value) => handleUpdateData('lifeExpectancy', value)}
          language={language}
          error={!!errors.lifeExpectancy}
          errorMessage={errors.lifeExpectancy}
          min={1}
          max={120}
          maxLength={3}
          placeholder="1-120"
        />
      </div>
    </>
  );
};

export default Step1;