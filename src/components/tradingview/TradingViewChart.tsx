
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';
import { useTradingViewIntegration } from '@/hooks/use-tradingview-integration';
import { Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TradingViewChartData } from '@/services/tradingView/tradingViewIntegrationService';
import TradingViewConnectButton from '@/components/technical-analysis/tradingview/TradingViewConnectButton';

interface TradingViewChartProps {
  symbol: string;
  height?: number;
}

const timeframeOptions = [
  { value: '1m', label: '1 דקה' },
  { value: '5m', label: '5 דקות' },
  { value: '15m', label: '15 דקות' },
  { value: '1h', label: 'שעה' },
  { value: '4h', label: '4 שעות' },
  { value: '1D', label: 'יומי' },
  { value: '1W', label: 'שבועי' },
  { value: '1M', label: 'חודשי' },
];

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol, 
  height = 400 
}) => {
  const { isConnected } = useTradingViewConnection();
  const { fetchChartData } = useTradingViewIntegration();
  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState<TradingViewChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load chart data when symbol or timeframe changes
  useEffect(() => {
    const loadChartData = async () => {
      if (!isConnected || !symbol) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchChartData(symbol, timeframe);
        setChartData(data);
      } catch (err) {
        console.error('Error loading chart data:', err);
        setError('אירעה שגיאה בטעינת נתוני הגרף');
      } finally {
        setLoading(false);
      }
    };
    
    loadChartData();
  }, [symbol, timeframe, isConnected, fetchChartData]);
  
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };
  
  const openInTradingView = () => {
    window.open(`https://www.tradingview.com/chart?symbol=${symbol}`, '_blank');
  };
  
  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-right">גרף TradingView</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">אינך מחובר לחשבון TradingView</h3>
          <p className="text-sm text-muted-foreground mb-4">
            חבר את חשבון ה-TradingView שלך כדי לצפות בגרפים בזמן אמת
          </p>
          <TradingViewConnectButton />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openInTradingView}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              פתח בטריידינגויו
            </Button>
            
            <Select value={timeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="טווח זמן" />
              </SelectTrigger>
              <SelectContent>
                {timeframeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <CardTitle className="text-right">
            {symbol} - גרף {timeframeOptions.find(t => t.value === timeframe)?.label}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center" style={{ height: `${height}px` }}>
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-md" style={{ height: `${height}px` }}>
            {/* In a real implementation, this would be an actual TradingView chart */}
            <div className="flex flex-col items-center justify-center h-full p-4">
              <p className="text-center mb-3">גרף {symbol} - {timeframeOptions.find(t => t.value === timeframe)?.label}</p>
              <p className="text-sm text-muted-foreground text-center mb-3">
                גרף TradingView פועל כעת במצב סימולציה. בסביבת הייצור, יוצג כאן גרף אמיתי מ-TradingView.
              </p>
              {chartData && (
                <div className="text-sm">
                  <p>אינדיקטורים: {chartData.indicators.join(', ')}</p>
                  <p>עדכון אחרון: {new Date(chartData.lastUpdate).toLocaleTimeString('he-IL')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingViewChart;
