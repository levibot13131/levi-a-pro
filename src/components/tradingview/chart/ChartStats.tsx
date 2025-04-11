
import React from 'react';
import { TradingViewChartData } from '../../../services/tradingView/tradingViewIntegrationService';

interface ChartStatsProps {
  chartData: TradingViewChartData;
  percentChange: string | null;
  isPositiveChange: boolean;
}

const ChartStats: React.FC<ChartStatsProps> = ({ chartData, percentChange, isPositiveChange }) => {
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString()}`;
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 text-right text-sm">
      <div className="p-3 rounded-lg bg-muted/10">
        <div className="flex justify-between items-center">
          <span className="font-medium">
            {chartData.data && chartData.data.length > 0 
              ? formatPrice(chartData.data[chartData.data.length - 1].price) 
              : 'לא זמין'}
          </span>
          <span className="text-muted-foreground">מחיר נוכחי</span>
        </div>
      </div>
      
      <div className="p-3 rounded-lg bg-muted/10">
        <div className="flex justify-between items-center">
          <span>
            {chartData.lastUpdate 
              ? new Date(chartData.lastUpdate).toLocaleTimeString('he-IL') 
              : 'לא זמין'}
          </span>
          <span className="text-muted-foreground">עדכון אחרון</span>
        </div>
      </div>
      
      <div className="p-3 rounded-lg bg-muted/10">
        <div className="flex justify-between items-center">
          <span 
            className={`font-medium ${
              isPositiveChange ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isPositiveChange ? '+' : ''}{percentChange}%
          </span>
          <span className="text-muted-foreground">שינוי</span>
        </div>
      </div>
      
      <div className="p-3 rounded-lg bg-muted/10">
        <div className="flex justify-between items-center">
          <span>TradingView</span>
          <span className="text-muted-foreground">מקור</span>
        </div>
      </div>
    </div>
  );
};

export default ChartStats;
