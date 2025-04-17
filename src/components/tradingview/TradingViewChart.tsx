
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useChartData } from '../../hooks/use-chart-data';
import CollapsibleToolbar from '../technical-analysis/charts/CollapsibleToolbar';
import ChartLoading from './chart/ChartLoading';
import ChartError from './chart/ChartError';
import ChartNoData from './chart/ChartNoData';
import ChartRenderer from './chart/ChartRenderer';
import ChartStats from './chart/ChartStats';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export interface TradingViewChartProps {
  symbol: string;
  timeframe?: string;
  showToolbar?: boolean;
  height?: number;
  onSymbolChange?: (symbol: string) => void;
}

const TIMEFRAMES = ['5m', '15m', '30m', '1h', '4h', '1D', '1W', '1M'];

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol,
  timeframe = '1D',
  showToolbar = true,
  height = 400,
  onSymbolChange
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);
  const [chartType, setChartType] = useState<'candle' | 'line' | 'bar'>('line');
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [showPatterns, setShowPatterns] = useState<boolean>(true);
  const [showSignals, setShowSignals] = useState<boolean>(true);
  
  const {
    chartData,
    isLoading,
    error,
    loadChartData,
    percentChange,
    isPositiveChange
  } = useChartData(symbol, selectedTimeframe);
  
  // Set timeframe from props when it changes
  useEffect(() => {
    if (timeframe && timeframe !== selectedTimeframe) {
      setSelectedTimeframe(timeframe);
    }
  }, [timeframe]);
  
  const handleRefresh = () => {
    loadChartData();
  };
  
  const handleTimeframeChange = (newTimeframe: string) => {
    setSelectedTimeframe(newTimeframe);
  };
  
  const handleChartTypeChange = (type: 'candle' | 'line' | 'bar') => {
    setChartType(type);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {!isLoading && chartData && (
              <span 
                className={`text-sm font-medium ${
                  isPositiveChange ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {isPositiveChange ? '+' : ''}{percentChange}%
              </span>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh} 
              disabled={isLoading}
              title="רענן נתונים"
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <CardTitle className="text-right">{symbol}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {showToolbar && (
          <div className="mb-4">
            <Tabs defaultValue={selectedTimeframe} onValueChange={handleTimeframeChange} dir="rtl">
              <TabsList className="mb-2">
                {TIMEFRAMES.map(tf => (
                  <TabsTrigger key={tf} value={tf}>{tf}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <CollapsibleToolbar 
              showVolume={showVolume}
              setShowVolume={setShowVolume}
              showPatterns={showPatterns}
              setShowPatterns={setShowPatterns}
              showSignals={showSignals}
              setShowSignals={setShowSignals}
            />
          </div>
        )}
        
        <div style={{ height: `${height}px` }}>
          {isLoading ? (
            <ChartLoading />
          ) : error ? (
            <ChartError error={error} />
          ) : chartData && chartData.data && chartData.data.length > 0 ? (
            <ChartRenderer
              chartData={chartData}
              chartType={chartType}
              showVolume={showVolume}
              isPositiveChange={isPositiveChange}
              showPatterns={showPatterns}
              showSignals={showSignals}
            />
          ) : (
            <ChartNoData />
          )}
        </div>
        
        {chartData && chartData.data && chartData.data.length > 0 && (
          <ChartStats 
            chartData={chartData}
            percentChange={percentChange}
            isPositiveChange={isPositiveChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TradingViewChart;
