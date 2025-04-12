
import React from 'react';
import RealTimeControls from './RealTimeControls';

interface TradingSignalsHeaderProps {
  realTimeActive: boolean;
  toggleRealTimeAnalysis: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const TradingSignalsHeader: React.FC<TradingSignalsHeaderProps> = ({
  realTimeActive,
  toggleRealTimeAnalysis,
  showSettings,
  setShowSettings
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <RealTimeControls
        realTimeActive={realTimeActive}
        toggleRealTimeAnalysis={toggleRealTimeAnalysis}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
      <h1 className="text-3xl font-bold text-right">איתותי מסחר וניתוח שוק</h1>
    </div>
  );
};

export default TradingSignalsHeader;
