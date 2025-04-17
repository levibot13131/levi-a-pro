
import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { TradingViewChartData } from '../../../services/tradingView/types';
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
  showPatterns?: boolean;
  showSignals?: boolean;
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
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'line' ? (
          <CustomAreaChart 
            data={chartData.data}
            showVolume={showVolume}
            isPositiveChange={isPositiveChange}
            showPatterns={showPatterns}
            showSignals={showSignals}
          />
        ) : chartType === 'bar' ? (
          <CustomBarChart 
            data={chartData.data}
            showVolume={showVolume}
            isPositiveChange={isPositiveChange}
            showPatterns={showPatterns}
            showSignals={showSignals}
          />
        ) : (
          <CustomLineChart 
            data={chartData.data}
            showVolume={showVolume}
            isPositiveChange={isPositiveChange}
            showPatterns={showPatterns}
            showSignals={showSignals}
          />
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartRenderer;
