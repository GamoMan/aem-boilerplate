import React, { memo } from 'react';
import { SavingToolsLanguageTexts, RightCardData } from '../utils/savingToolsTexts';

interface RightCardProps {
  cardData: RightCardData;
  texts: SavingToolsLanguageTexts;
}

const RightCard: React.FC<RightCardProps> = ({ cardData, texts }) => {
  if (!cardData) {
    return (
      <div className="bg-gray-100 rounded-lg overflow-hidden p-4 flex flex-col font-b1-regular font-bbl h-full">
        <div className="mt-4 w-3/4 h-8 bg-gray-300 rounded-md mb-4 self-start"></div> {/* Placeholder for title */}
        <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div> {/* Placeholder for image */}
        <div className="w-full h-12 bg-gray-300 rounded-lg"></div> {/* Placeholder for button/link */}
      </div>
    );
  }

  return (
    <div
      className="rounded-lg overflow-hidden p-4 flex flex-col font-b1-regular font-bbl h-full"
      style={{ backgroundColor: cardData.backgroundColor }}
    >
      <h2 className="mt-4 text-left font-h4-medium text-black !font-bbl-medium">{cardData.title}</h2>
      <div className="flex-grow flex items-center justify-center my-4">
        <img src={cardData.imageUrl} alt={cardData.title} className="w-full object-contain" />
      </div>
      <div>
        <a href={cardData.link} target="_blank" rel="noopener noreferrer" className="mt-auto text-left bg-white text-black py-2 px-4 rounded-lg border !border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-b1-medium !font-bbl-medium mx-auto">
          {cardData.description}
        </a>
      </div>
    </div>
  );
};

export default memo(RightCard);