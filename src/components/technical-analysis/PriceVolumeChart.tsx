
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetHistoricalData } from '@/types/asset';
import ChartToolbar from './charts/ChartToolbar';
import PriceChart from './charts/PriceChart';
import VolumeChart from './charts/VolumeChart';
import PatternDetails from './charts/PatternDetails';
import PatternList from './charts/PatternList';
import SignalList from './charts/SignalList';

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

  const chartPatterns = analysisData?.patterns || [];

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
        <div className="flex justify-between items-center">
          <ChartToolbar
            showVolume={showVolume}
            setShowVolume={setShowVolume}
            showPatterns={showPatterns} 
            setShowPatterns={setShowPatterns}
            showSignals={showSignals}
            setShowSignals={setShowSignals}
          />
          <CardTitle className="text-right">גרף מחיר</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
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
        
        {showPatterns && chartPatterns.length > 0 && !selectedPattern && (
          <PatternList 
            patterns={chartPatterns} 
            onPatternClick={setSelectedPattern} 
          />
        )}
        
        {showVolume && assetHistory && assetHistory.volumeData && (
          <div className="h-32 mt-4">
            <VolumeChart volumeData={assetHistory.volumeData} />
          </div>
        )}
        
        {showSignals && analysisData?.signals && analysisData.signals.length > 0 && (
          <SignalList 
            signals={analysisData.signals} 
            formatPrice={formatPrice} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PriceVolumeChart;
