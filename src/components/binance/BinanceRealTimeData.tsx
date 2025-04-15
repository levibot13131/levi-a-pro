
import React, { useState, useEffect } from 'react';
import { useBinanceMarketData } from '@/hooks/use-binance-market-data';
import { useTelegramAlerts } from '@/hooks/use-telegram-alerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Send, 
  BarChart 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BinanceRealTimeDataProps {
  symbol?: string;
  showControls?: boolean;
}

const BinanceRealTimeData: React.FC<BinanceRealTimeDataProps> = ({
  symbol = 'BTCUSDT',
  showControls = true
}) => {
  const {
    marketData,
    loading,
    error,
    refreshData,
    startRealTimeUpdates
  } = useBinanceMarketData(symbol);
  
  const {
    sending,
    sendPriceAlert
  } = useTelegramAlerts();
  
  const [isRealTime, setIsRealTime] = useState(false);
  
  // Start real-time updates
  const handleStartRealTime = () => {
    startRealTimeUpdates();
    setIsRealTime(true);
  };
  
  // Send test alert
  const handleSendAlert = async () => {
    if (!marketData) return;
    
    await sendPriceAlert(
      marketData.symbol,
      marketData.price,
      marketData.change24h >= 0 ? 'buy' : 'sell',
      `${marketData.change24h >= 0 ? 'BUY' : 'SELL'} Signal: ${marketData.symbol} at $${marketData.price.toLocaleString()}`
    );
  };
  
  // Format percent change
  const formatChange = (change: number) => {
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change.toFixed(2)}%`;
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex justify-between items-center">
          <CardTitle>נתוני {symbol} בזמן אמת</CardTitle>
          {isRealTime && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 animate-pulse">
              זמן אמת
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="py-4 text-center text-destructive">
            <p>שגיאה בטעינת נתונים</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={refreshData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              נסה שוב
            </Button>
          </div>
        ) : marketData ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">${marketData.price.toLocaleString()}</h3>
                <div className="flex items-center mt-1">
                  {marketData.change24h >= 0 ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {formatChange(marketData.change24h)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      {formatChange(marketData.change24h)}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="text-right text-sm">
                <div className="text-muted-foreground">עדכון אחרון</div>
                <div>{new Date(marketData.lastUpdated).toLocaleTimeString()}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-sm text-muted-foreground">מחיר גבוה (24ש)</div>
                <div className="font-medium">${marketData.high24h.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">מחיר נמוך (24ש)</div>
                <div className="font-medium">${marketData.low24h.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">נפח מסחר (24ש)</div>
                <div className="font-medium">
                  {marketData.volume24h > 1000000 
                    ? `${(marketData.volume24h / 1000000).toFixed(2)}M` 
                    : marketData.volume24h.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">זמן עדכון</div>
                <div className="font-medium">
                  {isRealTime ? 'זמן אמת' : 'סטטי'}
                </div>
              </div>
            </div>
            
            {showControls && (
              <div className="flex flex-wrap gap-2 pt-4">
                <Button 
                  size="sm" 
                  onClick={refreshData}
                  disabled={loading}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  רענן נתונים
                </Button>
                
                {!isRealTime && (
                  <Button 
                    size="sm"
                    onClick={handleStartRealTime}
                    disabled={loading}
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    הפעל זמן אמת
                  </Button>
                )}
                
                <Button 
                  size="sm"
                  onClick={handleSendAlert}
                  disabled={sending || !marketData}
                  variant="secondary"
                >
                  <Send className="h-4 w-4 mr-2" />
                  שלח התראה
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p>אין נתונים זמינים</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BinanceRealTimeData;
