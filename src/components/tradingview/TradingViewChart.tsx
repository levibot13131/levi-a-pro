
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useChartData } from '../../hooks/use-chart-data';
import ChartToolbar from './ChartToolbar';
import ChartLoading from './chart/ChartLoading';
import ChartError from './chart/ChartError';
import ChartNoData from './chart/ChartNoData';
import ChartRenderer from './chart/ChartRenderer';
import ChartStats from './chart/ChartStats';

interface TradingViewChartProps {
  symbol: string;
  timeframe?: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol,
  timeframe = '1D'
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);
  const [chartType, setChartType] = useState<'candle' | 'line' | 'bar'>('line');
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [showIndicators, setShowIndicators] = useState<boolean>(true);
  
  const {
    chartData,
    isLoading,
    error,
    loadChartData,
    percentChange,
    isPositiveChange
  } = useChartData(symbol, selectedTimeframe);
  
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
          </div>
          <CardTitle className="text-right">{symbol}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ChartToolbar 
          onRefresh={handleRefresh}
          onTimeframeChange={handleTimeframeChange}
          onChartTypeChange={handleChartTypeChange}
          isRefreshing={isLoading}
          selectedTimeframe={selectedTimeframe}
          chartType={chartType}
          showVolume={showVolume}
          setShowVolume={setShowVolume}
          showIndicators={showIndicators}
          setShowIndicators={setShowIndicators}
        />
        
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
          />
        ) : (
          <ChartNoData />
        )}
        
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
