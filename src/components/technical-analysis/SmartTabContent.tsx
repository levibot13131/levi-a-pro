
import React from 'react';
import TradingLearningSystem from './TradingLearningSystem';

interface SmartTabContentProps {
  assetId: string;
}

const SmartTabContent: React.FC<SmartTabContentProps> = ({
  assetId,
}) => {
  return (
    <div className="mb-6">
      {/* מערכת הלמידה החכמה */}
      <TradingLearningSystem 
        assetId={assetId}
      />
    </div>
  );
};

export default SmartTabContent;
