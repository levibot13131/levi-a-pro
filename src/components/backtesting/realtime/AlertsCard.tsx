
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellRing, BellOff, Trash2, Coins, Target } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { TradeSignal } from "@/types/asset";
import { format } from "date-fns";

interface AlertsCardProps {
  signals: TradeSignal[];
  isActive: boolean;
  toggleRealTimeAlerts: () => void;
  handleClearSignals: () => void;
  enableAutomaticAlerts: () => void;
  areAutoAlertsEnabled: boolean;
  isBinanceConnected?: boolean;
  binanceMarketData?: any;
}

const AlertsCard: React.FC<AlertsCardProps> = ({
  signals,
  isActive,
  toggleRealTimeAlerts,
  handleClearSignals,
  enableAutomaticAlerts,
  areAutoAlertsEnabled,
  isBinanceConnected = false,
  binanceMarketData = {}
}) => {
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss");
  };
  
  // Extract recent Binance prices if available
  const recentPrices = Object.entries(binanceMarketData).map(([symbol, data]: [string, any]) => ({
    symbol,
    price: data.price,
    change24h: data.change24h
  }));
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-right">
              <span>התראות בזמן אמת</span>
              {isActive ? <BellRing className="h-5 w-5 text-green-500" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
            </CardTitle>
            <CardDescription className="text-right">
              קבל התראות כשהמערכת מזהה איתותים חדשים
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-end">
            {isBinanceConnected && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Coins className="h-3.5 w-3.5" />
                Binance מחובר
              </Badge>
            )}
            
            <Button 
              variant={isActive ? "destructive" : "default"}
              size="sm"
              onClick={toggleRealTimeAlerts}
            >
              {isActive ? (
                <>
                  <BellOff className="h-4 w-4 mr-2" />
                  הפסק התראות
                </>
              ) : (
                <>
                  <BellRing className="h-4 w-4 mr-2" />
                  הפעל התראות
                </>
              )}
            </Button>
            
            {signals.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearSignals}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                נקה התראות
              </Button>
            )}
            
            {!areAutoAlertsEnabled && !isActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={enableAutomaticAlerts}
              >
                <Target className="h-4 w-4 mr-2" />
                הפעל התראות אוטומטיות
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isBinanceConnected && recentPrices.length > 0 && (
          <div className="mb-6 bg-muted/50 p-3 rounded-md">
            <h3 className="font-medium text-lg mb-2 text-right">מחירים עדכניים מ-Binance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentPrices.map(item => (
                <div key={item.symbol} className="bg-card border rounded-md p-3">
                  <div className="font-semibold text-right">{item.symbol}</div>
                  <div className="text-lg text-right">${item.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</div>
                  <div className={`text-sm text-right ${item.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {signals.length > 0 ? (
            signals.map((signal) => (
              <div 
                key={signal.id} 
                className={`border rounded-md p-4 ${
                  signal.type === 'buy' 
                    ? 'border-green-200 bg-green-50 dark:bg-green-950/20' 
                    : 'border-red-200 bg-red-50 dark:bg-red-950/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={signal.type === 'buy' ? 'success' : 'destructive'}>
                    {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
                  </Badge>
                  <div className="text-sm text-right">{formatDate(signal.timestamp)}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">נכס:</span>
                    <span className="text-right">{signal.assetId}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">אסטרטגיה:</span>
                    <span className="text-right">{signal.strategy}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">מחיר:</span>
                    <span className="text-right">${signal.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">עוצמה:</span>
                    <span className="text-right">
                      {signal.strength === 'strong' 
                        ? 'חזק' 
                        : signal.strength === 'medium' 
                          ? 'בינוני' 
                          : 'חלש'}
                    </span>
                  </div>
                  
                  {signal.notes && (
                    <div className="mt-2 text-right text-sm bg-white/80 dark:bg-black/20 p-2 rounded-md">
                      {signal.notes}
                    </div>
                  )}
                  
                  {/* Check if we have real-time Binance data for this asset */}
                  {isBinanceConnected && Object.keys(binanceMarketData).some(symbol => 
                      symbol.toLowerCase().includes(signal.assetId.toLowerCase().replace('usdt', ''))
                    ) && (
                    <div className="mt-2 p-2 bg-primary/10 rounded-md">
                      <div className="text-xs text-primary text-right font-medium">נתונים בזמן אמת מ-Binance:</div>
                      {Object.entries(binanceMarketData)
                        .filter(([symbol]) => symbol.toLowerCase().includes(signal.assetId.toLowerCase().replace('usdt', '')))
                        .map(([symbol, data]: [string, any]) => (
                          <div key={symbol} className="flex justify-between mt-1">
                            <span className="text-sm font-medium">{symbol}:</span>
                            <span className="text-sm text-right">
                              ${data.price.toLocaleString()} 
                              <span className={data.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {' '}({data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%)
                              </span>
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border rounded-md bg-muted/30">
              <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">אין התראות</h3>
              <p className="text-muted-foreground mb-4">
                הפעל ניתוח בזמן אמת כדי לקבל התראות על איתותי מסחר
              </p>
              
              {!isActive && (
                <Button onClick={toggleRealTimeAlerts}>
                  <BellRing className="h-4 w-4 mr-2" />
                  הפעל התראות בזמן אמת
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
