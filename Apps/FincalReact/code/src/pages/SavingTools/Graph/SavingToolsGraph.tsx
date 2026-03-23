import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { SavingToolsCalculationResult, GraphDataPoint } from '@/pages/SavingTools/utils/savingToolsApi';
import { SavingToolsLanguageTexts } from '@/pages/SavingTools/utils/savingToolsTexts';
import { formatNumber, formatNumberToK } from '@/lib/utils';

interface SavingToolsGraphProps {
  originalGraphData: GraphDataPoint[] | null;
  currentGraphData: GraphDataPoint[] | null;
  originalCalculationResult: SavingToolsCalculationResult | null; // Keep for annotations
  currentCalculationResult: SavingToolsCalculationResult | null; // Keep for annotations
  yearsToSave: number;
  texts: SavingToolsLanguageTexts | null;
  isInitialState?: boolean;
}

interface LegendItem {
  color: string;
  label: string;
  renderSvg: () => React.ReactElement;
}

const renderDotSvg = (color: string) => (
  <svg width="16" height="16">
    <circle cx="8" cy="8" r="4" fill={color} />
  </svg>
);

const renderSteppedSvg = (color: string) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.6 20.9999H3V2.3999" stroke={color} stroke-width="2" stroke-miterlimit="10"></path>
    <path d="M8 18V15H12V11H16V7H20V3" stroke={color} stroke-width="2"></path>
  </svg>
);

const renderConstantSvg = (color: string) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.6 20.9999H3V2.3999" stroke={color} stroke-width="2" stroke-miterlimit="10"></path>
    <path d="M6 12L21 12" stroke={color} stroke-width="2"></path>
  </svg>
);
const SavingToolsGraph: React.FC<SavingToolsGraphProps> = ({
  originalGraphData,
  currentGraphData,
  originalCalculationResult,
  currentCalculationResult,
  yearsToSave,
  texts,
  isInitialState = false,
}) => {
  if (!texts || !originalGraphData || yearsToSave <= 0 || !originalCalculationResult) {
    return null; // Don't render if texts or initial data are not loaded
  }

  // Define constants for Y offsets
  const Y_OFFSET_LOWER_ANNOTATION = 50; // Offset for the annotation that should be visually lower
  const Y_OFFSET_HIGHER_ANNOTATION = 100; // Offset for the annotation that should be visually higher

  // Determine which line is higher at the first month
  const isOriginalHigherAtStart = currentGraphData && originalGraphData[0] && currentGraphData[0]
    ? originalGraphData[0].accumulatedValue > currentGraphData[0].accumulatedValue
    : true; // Default to original being higher if no current data or for safety

  const data = originalGraphData.map((d, index) => ({
    month: d.month, // Use month as the data key for plotting
    year: Math.ceil(d.month / 12), // Calculate year for display
    name: `${Math.ceil(d.month / 12)} (${texts.results.graph.monthPrefix} ${d.month})`,
    original: d.accumulatedValue,
    new: currentGraphData && currentGraphData[index] ? currentGraphData[index].accumulatedValue : undefined,
  }));

  // --- Render legend from JSON texts ---
  // Legend items: original, new (if present)
  const legendItems: LegendItem[] = [
    {
      color: '#0064FF',
      label: texts.results.graph.originalCalculationLabel,
      renderSvg: renderDotSvg.bind(null, '#0064FF'),
    },
    {
      color: '#0064FF',
      label: originalCalculationResult?.savingIncreasePerYear === 0
        ? texts.results.graph.constantSavingLabel
        : texts.results.graph.savingIncreasedSteppedLabel,
      renderSvg: originalCalculationResult?.savingIncreasePerYear === 0
        ? renderConstantSvg.bind(null, '#0064FF')
        : renderSteppedSvg.bind(null, '#0064FF'),
    },
  ];
  // console.log(currentCalculationResult.savingIncreasePerYear)
  if (currentCalculationResult && !isInitialState) {
    const isSavingIncreaseZero = currentCalculationResult.savingIncreasePerYear === 0;

    // First legend for new calculation: change label and SVG based on savingIncreasePerYear
    legendItems.push({
      color: '#002850',
      label: texts.results.graph.newCalculationLabel,
      renderSvg: renderDotSvg.bind(null, '#002850'),
    });

    // Second legend for new calculation: change label and SVG based on savingIncreasePerYear
    legendItems.push({
      color: '#002850',
      label: isSavingIncreaseZero
        ? texts.results.graph.constantSavingLabel
        : texts.results.graph.savingIncreasedSteppedLabel,
      renderSvg: isSavingIncreaseZero
        ? renderConstantSvg.bind(null, '#002850')
        : renderSteppedSvg.bind(null, '#002850'),
    });
  }

  return (
    <div className="w-full h-full min-h-[0] flex flex-col">
      {/* Legend (from JSON) */}
      <div className="flex flex-col gap-2 mb-2 font-b2-medium font-bbl-medium px-2">
        <div className="flex flex-row gap-4 items-center bg-bbl-gray rounded-lg p-2 w-fit">
          {legendItems.slice(0, 2).map((item, idx) => (
            <div key={idx} className="flex flex-row items-center gap-2">
              {item.renderSvg()}
              <span className="label-width" style={{ color: item.color }}>{item.label}</span>
            </div>
          ))}
        </div>
        {currentCalculationResult && !isInitialState && (
          <div className="flex flex-row gap-4 items-center bg-bbl-gray rounded-lg p-2 w-fit">
            {legendItems.slice(2, 4).map((item, idx) => (
              <div key={idx} className="flex flex-row items-center gap-2">
                {item.renderSvg()}
                <span className="label-width" style={{ color: item.color }}>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-grow w-full xs:min-h-[450px] md:!min-h-[300px] px-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis className='font-b2-regular font-bbl font-gray-60'
              dataKey="month" // Now using month as dataKey
              type="number"
              domain={[1, yearsToSave * 12]} // Domain is now total months
              ticks={Array.from({ length: yearsToSave }, (_, i) => (i + 1) * 12)} // Ticks at end of each year
              tickFormatter={(value) => `${value / 12}`} // Format to display years
              label={{ value: texts.results.graph.xAxisLabel, position: 'bottom', offset: 0, dy: -5 }}
            />
            <YAxis className='font-b2-regular font-bbl font-gray-60'
              width={65}
              domain={[0, Math.max(...data.map(item => Math.max(item.original, item.new || 0))) * 1.25]}
              tickFormatter={(value: number) => formatNumberToK(value)}
              axisLine={false}
              tickLine={false}
              label={{ value: texts.results.graph.yAxisLabel, angle: -90, position: 'left', dx: 10, dy: -50 }}
            />
            {/* <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const formattedLabel = `${texts.results.graph.monthPrefix} ${label}`;
                  return (
                    <div className="bg-white p-2 border border-gray-80 rounded-lg">
                      <p className="label font-b3-medium font-bbl-medium">{formattedLabel}</p>
                      {payload.map((entry, index) => (
                        <p key={`item-${index}`} className="intro font-b3-medium font-bbl-medium" style={{ color: entry.color }}>
                          {`${entry.name}: ${formatNumber(entry.value as number)} ${texts.common.unit}`}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            /> */}
            <Line
              type="monotone"
              dataKey="original"
              stroke="#0064FF"
              strokeWidth={2}
              dot={false}
              name={texts.results.graph.originalCalculationLabel}
              isAnimationActive={false}
              activeDot={false}
            />
            {currentGraphData && !isInitialState && currentGraphData.some(d => d.accumulatedValue !== 0) && (
              <Line
                type="monotone"
                dataKey="new"
                stroke="#002850"
                strokeWidth={2}
                dot={false}
                name={texts.results.graph.newCalculationLabel}
                isAnimationActive={false}
                activeDot={false}
              />
            )}

            {/* Annotation: เงินออมต่อเดือน (Monthly Saving) - Original */}
            {originalCalculationResult && originalGraphData && (
              <ReferenceArea
                x1={1} // First month
                // x2={1}
                // y1={originalGraphData[0].accumulatedValue * 0.9} // Adjusted y position based on first month's accumulated value
                y2={originalGraphData[0].accumulatedValue * 0.95}
                strokeOpacity={0}
                fillOpacity={0}
                label={({ viewBox }) => {
                  if (viewBox) {
                    const displayValue = originalCalculationResult.SavingMonth;
                    return (
                      <g>
                        <rect x={viewBox.x + 10} y={viewBox.y - (isOriginalHigherAtStart ? Y_OFFSET_HIGHER_ANNOTATION : Y_OFFSET_LOWER_ANNOTATION)} width="140" height="50" fill="#0064FF" rx="5" ry="5" />
                        <text x={viewBox.x + 80} y={viewBox.y - (isOriginalHigherAtStart ? Y_OFFSET_HIGHER_ANNOTATION : Y_OFFSET_LOWER_ANNOTATION) + 18} textAnchor="middle" fill="#fff" className="font-bbl-looped font-b3-regular">
                          {texts.results.graph.monthlySavingLabel}
                        </text>
                        <text x={viewBox.x + 80} y={viewBox.y - (isOriginalHigherAtStart ? Y_OFFSET_HIGHER_ANNOTATION : Y_OFFSET_LOWER_ANNOTATION) + 35} textAnchor="middle" fill="#fff" className="font-bbl-bold font-b2-regular">
                          {formatNumber(displayValue)}
                        </text>
                      </g>
                    );
                  }
                  return null;
                }}
              />
            )}

            {/* Annotation: เป้าหมายเงินออม (Saving Goal) - Original */}
            {originalCalculationResult && originalGraphData && (
              <ReferenceArea
                x1={yearsToSave * 12} // Last month
                // x2={yearsToSave * 12}
                // y1={originalGraphData[originalGraphData.length - 1].accumulatedValue * 0.85} // Adjusted y position based on last month's accumulated value
                y2={originalGraphData[originalGraphData.length - 1].accumulatedValue * 0.85}
                strokeOpacity={0}
                fillOpacity={0}
                label={({ viewBox }) => {
                  if (viewBox) {
                    const displayValue = originalCalculationResult.FutureValue;
                    return (
                      <g>
                        {/* <rect x={viewBox.x - 140} y={viewBox.y - 50} width="140" height="50" fill="white" stroke="#0064FF" strokeWidth="2" rx="5" ry="5" /> */}
                        <text x={viewBox.x - 50} y={viewBox.y - 37} textAnchor="middle" fill="#0064FF" className="font-bbl-looped font-b3-regular">
                          {texts.results.graph.savingGoalLabel}
                        </text>
                        <text x={viewBox.x - 50} y={viewBox.y - 20} textAnchor="middle" fill="#0064FF" className="font-bbl-bold font-b2-regular">
                          {formatNumber(displayValue)}
                        </text>
                      </g>
                    );
                  }
                  return null;
                }}
              />
            )}

            {/* Annotation: เงินออมต่อเดือน (Monthly Saving) - New (if different) */}
            {currentCalculationResult && !isInitialState && currentGraphData && (currentCalculationResult.SavingMonth !== originalCalculationResult.SavingMonth || currentCalculationResult.FutureValue !== originalCalculationResult.FutureValue) && currentCalculationResult.SavingMonth !== 0 && (
              <ReferenceArea
                x1={1} // First month
                // x2={1}
                // y1={currentGraphData[0].accumulatedValue * 0.9} // Adjusted y position
                y2={currentGraphData[0].accumulatedValue * 0.95}
                strokeOpacity={0}
                fillOpacity={0}
                label={({ viewBox }) => {
                  if (viewBox) {
                    const displayValue = currentCalculationResult.SavingMonth;
                    return (
                      <g>
                        <rect x={viewBox.x + 10} y={viewBox.y - (isOriginalHigherAtStart ? Y_OFFSET_LOWER_ANNOTATION : Y_OFFSET_HIGHER_ANNOTATION)} width="140" height="50" fill="#002850" strokeWidth="2" rx="5" ry="5" />
                        <text x={viewBox.x + 80} y={viewBox.y - (isOriginalHigherAtStart ? Y_OFFSET_LOWER_ANNOTATION : Y_OFFSET_HIGHER_ANNOTATION) + 18} textAnchor="middle" fill="white" className="font-bbl-looped font-b3-regular">
                          {texts.results.graph.monthlySavingLabel}
                        </text>
                        <text x={viewBox.x + 80} y={viewBox.y - (isOriginalHigherAtStart ? Y_OFFSET_LOWER_ANNOTATION : Y_OFFSET_HIGHER_ANNOTATION) + 35} textAnchor="middle" fill="white" className="font-bbl-bold font-b2-regular">
                          {formatNumber(displayValue)}
                        </text>
                      </g>
                    );
                  }
                  return null;
                }}
              />
            )}

            {/* Annotation: เป้าหมายเงินออม (Saving Goal) - New (if different) */}
            {currentCalculationResult && !isInitialState && currentGraphData && (currentCalculationResult.FutureValue !== originalCalculationResult.FutureValue || currentCalculationResult.SavingMonth !== originalCalculationResult.SavingMonth) && currentCalculationResult.FutureValue !== 0 && (
              <ReferenceArea
                x1={yearsToSave * 10} // Last month
                // x2={yearsToSave * 12}
                // y1={currentGraphData[currentGraphData.length - 1].accumulatedValue * 0.85} // Adjusted y position
                y2={currentGraphData[currentGraphData.length - 1].accumulatedValue * 0.5}
                strokeOpacity={0}
                fillOpacity={0}
                label={({ viewBox }) => {
                  if (viewBox) {
                    const displayValue = currentCalculationResult.FutureValue;
                    return (
                      <g>
                        {/* <rect x={viewBox.x - 140} y={viewBox.y - 50} width="140" height="50" fill="transparent" stroke="#002850" strokeWidth="1" rx="5" ry="5" /> */}
                        <text x={viewBox.x - 50} y={viewBox.y - 52} textAnchor="middle" fill="#002850" className="font-bbl-looped font-b3-regular">
                          {texts.results.graph.savingGoalLabel}
                        </text>
                        <text x={viewBox.x - 50} y={viewBox.y - 35} textAnchor="middle" fill="#002850" className="font-bbl-bold font-b2-regular">
                          {formatNumber(displayValue)}
                        </text>
                      </g>
                    );
                  }
                  return null;
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default SavingToolsGraph;

