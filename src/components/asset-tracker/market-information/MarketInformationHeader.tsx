
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CardTitle } from '@/components/ui/card';

interface MarketInformationHeaderProps {
  selectedTimeRange: string;
  setSelectedTimeRange: (range: string) => void;
  autoRefresh: boolean;
  setAutoRefresh: (auto: boolean) => void;
  handleRefresh: () => void;
}

const MarketInformationHeader: React.FC<MarketInformationHeaderProps> = ({
  selectedTimeRange,
  setSelectedTimeRange,
  autoRefresh,
  setAutoRefresh,
  handleRefresh
}) => {
  return (
    <CardTitle className="text-right flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh}
          className="h-8 w-8"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <select 
          className="bg-transparent text-sm font-normal border border-gray-300 rounded px-2 py-1 ml-2"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option value="7">7 ימים</option>
          <option value="30">30 ימים</option>
          <option value="90">90 ימים</option>
        </select>
        <div className="flex items-center">
          <label htmlFor="auto-refresh" className="mr-2 text-sm">
            עדכון אוטומטי
          </label>
          <input
            type="checkbox"
            id="auto-refresh"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded"
          />
        </div>
      </div>
      <div>מידע פונדמנטלי</div>
    </CardTitle>
  );
};

export default MarketInformationHeader;
