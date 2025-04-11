
import React from 'react';
import { TradingStrategy } from '@/components/technical-analysis';

const TechnicalAnalysis = () => {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">ניתוח טכני</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <TradingStrategy />
      </div>
    </div>
  );
};

export default TechnicalAnalysis;
