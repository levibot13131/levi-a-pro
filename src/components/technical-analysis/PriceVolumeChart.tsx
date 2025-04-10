
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AssetHistoricalData } from '@/types/asset';
import ChartHeader from './charts/ChartHeader';
import ChartContent from './charts/ChartContent';
import { useStrategyAnalysis } from './hooks/useStrategyAnalysis';

interface PriceVolumeChartProps {
  historyLoading: boolean;
  assetHistory: AssetHistoricalData | undefined;
  showVolume: boolean;
  setShowVolume: (value: boolean) => void;
  formatPrice: (price: number) => string;
  analysisData: any;
}

const PriceVolumeChart = ({
  historyLoading,
  assetHistory,
  showVolume,
  setShowVolume,
  formatPrice,
  analysisData
}: PriceVolumeChartProps) => {
  const [showPatterns, setShowPatterns] = useState<boolean>(true);
  const [showSignals, setShowSignals] = useState<boolean>(true);
  const [selectedPattern, setSelectedPattern] = useState<any>(null);
  
  const {
    analysisBusy,
    strategyAnalysisData,
    showStrategyAnalysis,
    setShowStrategyAnalysis,
    analyzeStrategy
  } = useStrategyAnalysis(assetHistory);

  const getPatternColor = (patternType: string) => {
    if (patternType.includes('bullish') || patternType.includes('buy')) {
      return 'rgba(0, 255, 0, 0.1)';
    } else if (patternType.includes('bearish') || patternType.includes('sell')) {
      return 'rgba(255, 0, 0, 0.1)';
    }
    return 'rgba(255, 165, 0, 0.1)';
  };

  const getPatternBorder = (patternType: string) => {
    if (patternType.includes('bullish') || patternType.includes('buy')) {
      return 'rgba(0, 200, 0, 0.5)';
    } else if (patternType.includes('bearish') || patternType.includes('sell')) {
      return 'rgba(200, 0, 0, 0.5)';
    }
    return 'rgba(200, 165, 0, 0.5)';
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <ChartHeader 
          showVolume={showVolume}
          setShowVolume={setShowVolume}
          showPatterns={showPatterns}
          setShowPatterns={setShowPatterns}
          showSignals={showSignals}
          setShowSignals={setShowSignals}
          analyzeStrategy={analyzeStrategy}
          analysisBusy={analysisBusy}
          historyLoading={historyLoading}
          assetHistory={assetHistory}
        />
      </CardHeader>
      <CardContent>
        <ChartContent
          historyLoading={historyLoading}
          assetHistory={assetHistory}
          formatPrice={formatPrice}
          analysisData={analysisData}
          showPatterns={showPatterns}
          showSignals={showSignals}
          showVolume={showVolume}
          selectedPattern={selectedPattern}
          setSelectedPattern={setSelectedPattern}
          getPatternColor={getPatternColor}
          getPatternBorder={getPatternBorder}
          showStrategyAnalysis={showStrategyAnalysis}
          strategyAnalysisData={strategyAnalysisData}
          setShowStrategyAnalysis={setShowStrategyAnalysis}
        />
      </CardContent>
    </Card>
  );
};

export default PriceVolumeChart;
