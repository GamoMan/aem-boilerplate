import { useState, useCallback, useEffect } from 'react';

interface StepValidationState {
  [key: string]: boolean; // field name -> isValid
}

interface UseStepValidationResult {
  validationState: StepValidationState;
  updateFieldValidation: (fieldName: string, isValid: boolean) => void;
  isStepValid: boolean;
}

export const useStepValidation = (): UseStepValidationResult => {
  const [validationState, setValidationState] = useState<StepValidationState>({});

  const updateFieldValidation = useCallback((fieldName: string, isValid: boolean) => {
    setValidationState(prev => ({
      ...prev,
      [fieldName]: isValid
    }));
  }, []);

  // Use a derived state for isStepValid to re-evaluate when validationState changes
  const isStepValid = Object.values(validationState).every(isValid => isValid);

  // Clear validation state on component mount/unmount to prevent stale data
  useEffect(() => {
    return () => {
      setValidationState({});
    };
  }, []);

  return {
    validationState,
    updateFieldValidation,
    isStepValid
  };
};