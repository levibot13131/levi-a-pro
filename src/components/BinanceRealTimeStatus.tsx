
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RealTimeStatus } from '@/components/RealTimeStatus';
import { useBinanceMarketData } from '@/hooks/use-binance-market-data';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Signal } from 'lucide-react';

interface BinanceRealTimeStatusProps {
  symbol?: string;
}

const BinanceRealTimeStatus: React.FC<BinanceRealTimeStatusProps> = ({ symbol = 'BTCUSDT' }) => {
  const { 
    marketData, 
    loading, 
    error, 
    chartData, 
    chartLoading, 
    isLiveData,
    timeframe
  } = useBinanceMarketData(symbol);

  return (
    <div className="space-y-4">
      <RealTimeStatus />
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Badge variant={isLiveData ? "success" : "secondary"}>
                {isLiveData ? 'Live Data' : 'Demo Mode'}
              </Badge>
            </div>
            <CardTitle className="text-lg">סטטוס חיבור Binance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <StatusItem 
              title="מחיר נוכחי"
              value={marketData?.price ? `$${marketData.price.toLocaleString()}` : 'N/A'}
              loading={loading}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatusItem 
              title="נתוני גרף"
              value={chartData && chartData.length ? `${chartData.length} items` : 'N/A'}
              loading={chartLoading}
              icon={<Signal className="h-5 w-5" />}
            />
            <StatusItem 
              title="טווח זמן"
              value={timeframe || 'N/A'}
              loading={false}
              icon={<Clock className="h-5 w-5" />}
            />
          </div>
          
          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-800 rounded-md text-right">
              <strong>שגיאה:</strong> {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface StatusItemProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  loading: boolean;
}

function StatusItem({ title, value, icon, loading }: StatusItemProps) {
  return (
    <div className="flex justify-between items-center p-2 rounded border">
      <div className="font-medium">
        {loading ? (
          <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <span dir="ltr">{value}</span>
        )}
      </div>
      <div className="flex items-center">
        <span className="mr-2 font-medium">{title}</span>
        {icon}
      </div>
    </div>
  );
}

export default BinanceRealTimeStatus;
