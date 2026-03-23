import React, { useCallback, useRef, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SavingToolsFormData, SavingToolsInitialRates } from '../types';
import { SavingToolsCalculationResult } from '../utils/savingToolsApi';
import { SavingToolsLanguageTexts, AllSavingToolsTexts } from '../utils/savingToolsTexts';

interface SavingToolsSlidersProps {
  appTexts: (SavingToolsLanguageTexts & { defaultFormValues: AllSavingToolsTexts['defaultFormValues'] });
  formData: SavingToolsFormData;
  sliderFormData: SavingToolsFormData;
  initialRates: SavingToolsInitialRates | null;
  calculationResult: SavingToolsCalculationResult;
  hasSliderBeenUsed: boolean;
  maxDesiredSavingAmount: number;
  maxExpectedReturnRate: number;
  stepDesiredSavingAmount: number;
  handleSliderChange: (field: keyof SavingToolsFormData, value: number) => void;
  handleAnnualSavingIncreaseRateSliderChange: (value: number[]) => void;
  disabled: boolean; // Add disabled prop
}

const SavingToolsSliders: React.FC<SavingToolsSlidersProps> = (props) => {
  const {
    appTexts,
    formData,
    sliderFormData,
    maxDesiredSavingAmount,
    maxExpectedReturnRate,
    stepDesiredSavingAmount,
    handleSliderChange,
    handleAnnualSavingIncreaseRateSliderChange,
    disabled,
  } = props;
  const tooltipShownRefs = useRef<{ [key: string]: boolean }>({});
  const [tooltipOpenStates, setTooltipOpenStates] = useState<{ [key: string]: boolean }>({});

  // As per requirements: if the slider value is 0, it should be 0.1. Otherwise, steps should be 0.25, 0.5, 0.75 etc.
  // This implies the slider's internal minimum should be 0 to allow the user to drag to 0, but the displayed/processed value should snap to 0.1.

  const handleTooltipOpenChange = useCallback((sliderId: string, open: boolean) => {
    if (open && !tooltipShownRefs.current[sliderId]) {
      setTooltipOpenStates(prev => ({ ...prev, [sliderId]: true }));
      tooltipShownRefs.current[sliderId] = true;
      setTimeout(() => {
        setTooltipOpenStates(prev => ({ ...prev, [sliderId]: false }));
      }, 3000);
    } //else if (!open) {
      //setTooltipOpenStates(prev => ({ ...prev, [sliderId]: false }));
    //}
  }, []);

  return (
    <TooltipProvider>
      <div className={`md:col-span-2 mb-0 md:mb-0 ${disabled ? 'pointer-events-none' : ''}`}>
        <h2 className="font-h5-medium text-left !font-bbl-medium mb-4">
          {appTexts.common.adjustCalculationTitle}
        </h2>
        <div className={`fincal-grid grid grid-cols-1 md:grid-cols-3 ${disabled ? 'gap-2' : 'gap-2'} bg-bbl-gray rounded-lg font-b1-regular font-bbl`}>
          {/* Desired Saving Amount Slider */}
          <div className="sm:p-6 md:py-6 md:p-4">
            <div className="w-full flex flex-col justify-between h-full font-b1-medium font-bbl-bold">
              <label htmlFor="desiredSavingAmountSlider" className="block">
                {appTexts.inputs.desiredSavingAmount}
              </label>

              <div>
                <Tooltip
                  delayDuration={0}
                  open={tooltipOpenStates['desiredSavingAmountSlider']}
                  onOpenChange={(open) => handleTooltipOpenChange('desiredSavingAmountSlider', open)}
                >
                  <TooltipTrigger asChild>
                    <Slider
                      id="desiredSavingAmountSlider"
                      min={10000}
                      max={maxDesiredSavingAmount}
                      step={stepDesiredSavingAmount}
                      value={[disabled ? maxDesiredSavingAmount : Math.min(sliderFormData.desiredSavingAmount, maxDesiredSavingAmount)]}
                      onValueChange={(value) => handleSliderChange('desiredSavingAmount', value[0])}
                      className="w-full"
                      disabled={disabled}
                    />
                  </TooltipTrigger>
                  {/* <TooltipContent side="top" sideOffset={10} className="w-auto px-2 py-2 text-white !font-b3-regular font-bbl-looped">
                    <p>{appTexts.common.sliderTooltip}</p>
                  </TooltipContent> */}
                </Tooltip>
                <div className="flex justify-between items-center">
                  <div className={`font-b1-medium ${disabled ? 'text-gray-90' : 'text-primary'} text-left !font-bbl-medium`}>
                    {formData.desiredSavingAmount.toLocaleString()}
                  </div>
                  <div className={`font-b1-medium rounded-lg border-none bg-[#0000000d] ${disabled ? 'text-gray-80' : 'text-black'} text-right p-1 !font-bbl-medium`}>
                    {disabled ? '--' : sliderFormData.desiredSavingAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Expected Return Rate Slider */}
          <div className="sm:p-6 md:py-6 md:px-4">
            <div className="w-full flex flex-col justify-between h-full font-b1-medium font-bbl-bold">
              <label htmlFor="expectedReturnRateSlider" className="block">
                {appTexts.inputs.expectedReturnRate}
              </label>
              <div>
                <Tooltip
                  delayDuration={0}
                  open={tooltipOpenStates['expectedReturnRateSlider']}
                  onOpenChange={(open) => handleTooltipOpenChange('expectedReturnRateSlider', open)}
                >
                  <TooltipTrigger asChild>
                    <Slider
                      id="expectedReturnRateSlider"
                      min={0}
                      max={maxExpectedReturnRate}
                      step={0.25}
                      value={[disabled ? maxExpectedReturnRate : (sliderFormData.expectedReturnRate === 0 ? 0.1 : sliderFormData.expectedReturnRate)]}
                      onValueChange={(value) => {
                        const newValue = value[0] === 0 ? 0.1 : (value[0] % 0.25 === 0 ? value[0] : Math.round(value[0] * 4) / 4);
                        handleSliderChange('expectedReturnRate', newValue);
                      }}
                      className="w-full"
                      disabled={disabled}
                    />
                  </TooltipTrigger>
                  {/* <TooltipContent side="top" sideOffset={10} className="w-auto px-2 py-2 text-white !font-b3-regular font-bbl-looped">
                    <p>{appTexts.common.sliderTooltip}</p>
                  </TooltipContent> */}
                </Tooltip>
                <div className="flex justify-between items-center">
                  <div className={`font-b1-medium ${disabled ? 'text-gray-90' : 'text-primary'} text-left p-1 !font-bbl-medium`}>
                    {formData.expectedReturnRate}
                  </div>
                  <div className={`font-b1-medium rounded-lg border-none bg-[#0000000d] ${disabled ? 
                    'text-gray-80' : 'text-black'} text-right p-1 !font-bbl-medium`}>
                    {disabled ? '--' : `${sliderFormData.expectedReturnRate.toFixed(2)}`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Annual Saving Increase Rate Slider */}
          <div className="sm:p-6 md:py-6 md:pr-4">
            <div className="w-full flex flex-col justify-between h-full font-b1-medium font-bbl-bold">
              <label htmlFor="annualSavingIncreaseRateSlider" className="block">
                {appTexts.inputs.annualSavingIncreaseRate}
              </label>
              <div>
                <Tooltip
                  delayDuration={0}
                  open={tooltipOpenStates['annualSavingIncreaseRateSlider']}
                  onOpenChange={(open) => handleTooltipOpenChange('annualSavingIncreaseRateSlider', open)}
                >
                  <TooltipTrigger asChild>
                    <Slider
                      id="annualSavingIncreaseRateSlider"
                      min={0}
                      max={sliderFormData.expectedReturnRate}
                      step={0.25}
                      value={[disabled ? sliderFormData.expectedReturnRate : Math.min(sliderFormData.annualSavingIncreaseRate, sliderFormData.expectedReturnRate)]}
                      onValueChange={handleAnnualSavingIncreaseRateSliderChange}
                      className="w-full"
                      disabled={disabled}
                    />
                  </TooltipTrigger>
                  {/* <TooltipContent side="top" sideOffset={10} className="w-auto px-2 py-2 text-white !font-b3-regular font-bbl-looped">
                    <p>{appTexts.common.sliderTooltip}</p>
                  </TooltipContent> */}
                </Tooltip>
                <div className="flex justify-between items-center">
                  <div className={`font-b1-medium ${disabled ? 'text-gray-90' : 'text-primary'} text-left p-1 !font-bbl-medium`}>
                    {formData.annualSavingIncreaseRate}
                  </div>
                  <div className={`font-b1-medium rounded-lg border-none bg-[#0000000d] ${disabled ? 'text-gray-80' : 'text-black'} text-right p-1 !font-bbl-medium`}>
                    {disabled ? '--' : `${sliderFormData.annualSavingIncreaseRate.toFixed(2)}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
export default SavingToolsSliders;
