
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTradingViewIntegration } from '../../hooks/use-tradingview-integration';
import { TradingViewChartData } from '../../services/tradingView/tradingViewIntegrationService';
import { Skeleton } from '../ui/skeleton';
import { RefreshCw } from 'lucide-react';
import ChartToolbar from './ChartToolbar';

interface TradingViewChartProps {
  symbol: string;
  timeframe?: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol,
  timeframe = '1D'
}) => {
  const [chartData, setChartData] = useState<TradingViewChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);
  const [chartType, setChartType] = useState<'candle' | 'line' | 'bar'>('line');
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [showIndicators, setShowIndicators] = useState<boolean>(true);
  
  const { fetchChartData, isConnected } = useTradingViewIntegration();
  
  useEffect(() => {
    loadChartData();
  }, [symbol, selectedTimeframe]);
  
  const loadChartData = async () => {
    if (!isConnected) {
      setError('אנא התחבר ל-TradingView תחילה');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await fetchChartData(symbol, selectedTimeframe);
      if (data) {
        setChartData(data);
        setError(null);
      } else {
        setError('לא ניתן לטעון את נתוני הגרף');
      }
    } catch (err) {
      console.error('Error loading TradingView chart data:', err);
      setError('שגיאה בטעינת הגרף');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = () => {
    loadChartData();
  };
  
  const handleTimeframeChange = (newTimeframe: string) => {
    setSelectedTimeframe(newTimeframe);
  };
  
  const handleChartTypeChange = (type: 'candle' | 'line' | 'bar') => {
    setChartType(type);
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('he-IL', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString()}`;
    }
    return `$${price.toFixed(2)}`;
  };
  
  const getPercentChange = () => {
    if (!chartData || !chartData.data || chartData.data.length < 2) return null;
    
    const firstPrice = chartData.data[0].price;
    const lastPrice = chartData.data[chartData.data.length - 1].price;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    return change.toFixed(2);
  };
  
  const percentChange = getPercentChange();
  const isPositiveChange = percentChange && parseFloat(percentChange) >= 0;
  
  return (
    <Card>
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
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-[200px] w-full" />
            <div className="flex justify-center items-center">
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">טוען נתוני מחיר בזמן אמת...</span>
            </div>
          </div>
        ) : error ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : chartData && chartData.data && chartData.data.length > 0 ? (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <AreaChart data={chartData.data}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositiveChange ? "#10b981" : "#ef4444"} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={isPositiveChange ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatDate} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    tickFormatter={formatPrice}
                    tick={{ fontSize: 12 }}
                    width={60}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatPrice(value), 'מחיר']}
                    labelFormatter={formatDate}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={isPositiveChange ? "#10b981" : "#ef4444"} 
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                  {showVolume && (
                    <Bar dataKey="volume" fill="#8884d8" opacity={0.5} />
                  )}
                </AreaChart>
              ) : chartType === 'bar' ? (
                <BarChart data={chartData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatDate} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    tickFormatter={formatPrice}
                    tick={{ fontSize: 12 }}
                    width={60}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatPrice(value), 'מחיר']}
                    labelFormatter={formatDate}
                  />
                  <Bar 
                    dataKey="price" 
                    fill={isPositiveChange ? "#10b981" : "#ef4444"} 
                  />
                  {showVolume && (
                    <Bar dataKey="volume" fill="#8884d8" opacity={0.5} />
                  )}
                </BarChart>
              ) : (
                <LineChart data={chartData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatDate} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    tickFormatter={formatPrice}
                    tick={{ fontSize: 12 }}
                    width={60}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatPrice(value), 'מחיר']}
                    labelFormatter={formatDate}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={isPositiveChange ? "#10b981" : "#ef4444"} 
                    dot={false}
                    strokeWidth={2}
                  />
                  {showVolume && (
                    <Bar dataKey="volume" fill="#8884d8" opacity={0.5} />
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">אין נתונים זמינים</p>
          </div>
        )}
        
        {chartData && (
          <div className="mt-4 text-right text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">מחיר נוכחי:</span>
              <span className="font-medium">
                {chartData.data && chartData.data.length > 0 
                  ? formatPrice(chartData.data[chartData.data.length - 1].price) 
                  : 'לא זמין'}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-muted-foreground">מקור:</span>
              <span>TradingView</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-muted-foreground">עדכון אחרון:</span>
              <span>
                {chartData.lastUpdate 
                  ? new Date(chartData.lastUpdate).toLocaleTimeString('he-IL') 
                  : 'לא זמין'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingViewChart;
