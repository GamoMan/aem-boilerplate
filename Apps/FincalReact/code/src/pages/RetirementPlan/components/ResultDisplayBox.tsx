import React from 'react';
import { formatNumber } from '@/lib/utils';

interface ResultDisplayBoxProps {
  label: string;
  value: number;
  unit: string;
  totalValue?: number;
  language: 'th' | 'en';
  valueClassName?: string;
  valueAlignment?: string;
  labelClassName?: string;
  unitClassName?: string;
  valueWrapperClassName?: string;
}

const ResultDisplayBox: React.FC<ResultDisplayBoxProps> = ({ label, value, unit, language, valueClassName,valueAlignment, labelClassName, unitClassName, totalValue, valueWrapperClassName }) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <p className={`${labelClassName || 'text-gray-600'}  !font-h5-medium mb-[12px] font-bbl-medium`}>{label}</p>
      <div className={`flex items-end ${valueWrapperClassName || 'justify-between'}`}>
        <p className={`${valueAlignment === 'right' ? 'text-right' : 'text-left'} ${valueAlignment === 'right' && !totalValue ? 'ml-auto' : ''} ${valueClassName || 'text-4xl'} font-h3-medium text-primary !font-bbl-medium whitespace-nowrap`}>{formatNumber(value)} <span className={`${unitClassName || 'font-b4-regular'} font-normal text-black font-bbl-looped`}>{unit}</span></p>
        {totalValue && (
          <p className="text-gray-50">
            /{formatNumber(totalValue)} <span className="font-b4-regular font-normal font-bbl-looped">{unit}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultDisplayBox;