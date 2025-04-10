
import React from 'react';
import PatternDetails from './PatternDetails';
import PriceChart from './PriceChart';
import PatternList from './PatternList';
import VolumeChart from './VolumeChart';
import SignalList from './SignalList';
import StrategyAnalysis from './StrategyAnalysis';

interface ChartContentProps {
  historyLoading: boolean;
  assetHistory: any;
  formatPrice: (price: number) => string;
  analysisData: any;
  showPatterns: boolean;
  showSignals: boolean;
  showVolume: boolean;
  selectedPattern: any;
  setSelectedPattern: (pattern: any) => void;
  getPatternColor: (patternType: string) => string;
  getPatternBorder: (patternType: string) => string;
  showStrategyAnalysis: boolean;
  strategyAnalysisData: any;
  setShowStrategyAnalysis: (value: boolean) => void;
}

const ChartContent: React.FC<ChartContentProps> = ({
  historyLoading,
  assetHistory,
  formatPrice,
  analysisData,
  showPatterns,
  showSignals,
  showVolume,
  selectedPattern,
  setSelectedPattern,
  getPatternColor,
  getPatternBorder,
  showStrategyAnalysis,
  strategyAnalysisData,
  setShowStrategyAnalysis
}) => {
  const chartPatterns = analysisData?.patterns || [];

  return (
    <>
      <div className="h-96 relative">
        <PatternDetails 
          selectedPattern={selectedPattern}
          onClose={() => setSelectedPattern(null)}
          formatPrice={formatPrice}
        />

        <PriceChart 
          historyLoading={historyLoading}
          assetHistory={assetHistory}
          formatPrice={formatPrice}
          analysisData={analysisData}
          showPatterns={showPatterns}
          showSignals={showSignals}
          onPatternClick={setSelectedPattern}
          getPatternColor={getPatternColor}
          getPatternBorder={getPatternBorder}
        />
      </div>
      
      {showPatterns && chartPatterns.length > 0 && !selectedPattern && !showStrategyAnalysis && (
        <PatternList 
          patterns={chartPatterns} 
          onPatternClick={setSelectedPattern} 
        />
      )}
      
      {showVolume && assetHistory && assetHistory.volumeData && !showStrategyAnalysis && (
        <div className="h-32 mt-4">
          <VolumeChart volumeData={assetHistory.volumeData} />
        </div>
      )}
      
      {showSignals && analysisData?.signals && analysisData.signals.length > 0 && !showStrategyAnalysis && (
        <SignalList 
          signals={analysisData.signals} 
          formatPrice={formatPrice} 
        />
      )}
      
      {showStrategyAnalysis && strategyAnalysisData && (
        <StrategyAnalysis
          strategyAnalysisData={strategyAnalysisData}
          onClose={() => setShowStrategyAnalysis(false)}
        />
      )}
    </>
  );
};

export default ChartContent;
