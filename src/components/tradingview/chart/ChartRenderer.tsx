
import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { TradingViewChartData } from '../../../services/tradingView/tradingViewIntegrationService';
import CustomAreaChart from './types/AreaChart';
import CustomBarChart from './types/BarChart';
import CustomLineChart from './types/LineChart';

export interface ChartRendererProps {
  chartData: TradingViewChartData;
  chartType: 'candle' | 'line' | 'bar';
  showVolume: boolean;
  isPositiveChange: boolean;
  showPatterns?: boolean;
  showSignals?: boolean;
}

export interface ChartBaseProps {
  data: TradingViewChartData['data'];
  showVolume: boolean;
  isPositiveChange: boolean;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ 
  chartData, 
  chartType,
  showVolume,
  isPositiveChange,
  showPatterns = false,
  showSignals = false
}) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'line' ? (
          <CustomAreaChart 
            data={chartData.data}
            showVolume={showVolume}
            isPositiveChange={isPositiveChange}
          />
        ) : chartType === 'bar' ? (
          <CustomBarChart 
            data={chartData.data}
            showVolume={showVolume}
            isPositiveChange={isPositiveChange}
          />
        ) : (
          <CustomLineChart 
            data={chartData.data}
            showVolume={showVolume}
            isPositiveChange={isPositiveChange}
          />
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartRenderer;

