
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RefreshCw, Settings } from 'lucide-react';
import { toast } from 'sonner';
import TradingViewWidget from '../charts/TradingViewWidget';

export interface TradingViewChartProps {
  symbol: string;
  timeframe?: string;
  showToolbar?: boolean;
  height?: number;
  onSymbolChange?: (symbol: string) => void;
}

const TIMEFRAMES = ['5m', '15m', '30m', '1h', '4h', '1D', '1W'];

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol,
  timeframe = '1D',
  showToolbar = true,
  height = 400,
  onSymbolChange
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('נתונים עודכנו בהצלחה');
    } catch (error) {
      toast.error('שגיאה בעדכון הנתונים');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleTimeframeChange = (newTimeframe: string) => {
    setSelectedTimeframe(newTimeframe);
  };
  
  return (
    <div className="space-y-4">
      {showToolbar && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRefresh} 
                  disabled={isRefreshing}
                  title="רענן נתונים"
                  className="h-8 w-8"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  הגדרות
                </Button>
              </div>
              <CardTitle className="text-right">{symbol}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTimeframe} onValueChange={handleTimeframeChange} dir="rtl">
              <TabsList className="mb-2">
                {TIMEFRAMES.map(tf => (
                  <TabsTrigger key={tf} value={tf}>{tf}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      <TradingViewWidget
        symbol={symbol}
        timeframe={selectedTimeframe}
        height={height}
        showToolbar={showToolbar}
        theme="light"
      />
    </div>
  );
};

export default TradingViewChart;
