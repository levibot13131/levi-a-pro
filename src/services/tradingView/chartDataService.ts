
import { TradingViewChartData } from './types';
import { getTradingViewCredentials } from './tradingViewAuthService';
import { toast } from 'sonner';

// Store for chart data
let cachedChartData: Record<string, TradingViewChartData> = {};
let lastSyncTimestamp: number = 0;

/**
 * Get chart data for a specific symbol
 */
export const getChartData = async (symbol: string, timeframe: string = '1D'): Promise<TradingViewChartData | null> => {
  const credentials = getTradingViewCredentials();
  
  if (!credentials?.isConnected) {
    return null;
  }
  
  // Check if we have cached data and it's recent (less than 5 minutes old)
  const cacheKey = `${symbol}-${timeframe}`;
  const now = Date.now();
  if (cachedChartData[cacheKey] && now - cachedChartData[cacheKey].lastUpdate < 5 * 60 * 1000) {
    return cachedChartData[cacheKey];
  }
  
  try {
    // In a real implementation, this would fetch data from TradingView API
    // For now, we'll simulate with mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate sample price data
    const dataPoints = 50; // Increased data points for better charts
    let startPrice = 0;
    let volatility = 0;
    
    if (symbol === 'BTCUSD') {
      startPrice = 68000;
      volatility = 1000;
    } else if (symbol === 'ETHUSD') {
      startPrice = 3200;
      volatility = 100;
    } else if (symbol === 'SOLUSD') {
      startPrice = 140;
      volatility = 5;
    } else if (symbol === 'AVAXUSD') {
      startPrice = 35;
      volatility = 2;
    } else if (symbol === 'ADAUSD') {
      startPrice = 0.45;
      volatility = 0.02;
    } else {
      startPrice = 100;
      volatility = 10;
    }
    
    const timeInterval = getTimeIntervalByTimeframe(timeframe);
    
    // Create more realistic price movements
    let currentPrice = startPrice;
    let trend = Math.random() > 0.5 ? 1 : -1;
    let trendStrength = Math.random() * 0.7 + 0.3; // 0.3-1.0
    let trendDuration = Math.floor(Math.random() * 10) + 5;
    
    const priceData = Array.from({ length: dataPoints }, (_, i) => {
      // Occasionally change trend
      if (i % trendDuration === 0) {
        trend = Math.random() > 0.4 ? 1 : -1;
        trendStrength = Math.random() * 0.7 + 0.3;
        trendDuration = Math.floor(Math.random() * 10) + 5;
      }
      
      // Calculate price movement with trend bias
      const randomChange = ((Math.random() - 0.5) + (trendStrength * trend * 0.2)) * volatility;
      currentPrice = Math.max(currentPrice + randomChange, startPrice * 0.7); // Prevent prices going too low
      
      // Generate volume based on price movement (higher on significant moves)
      const volumeBase = Math.floor(Math.random() * 1000000) + 500000;
      const volumeMultiplier = 1 + Math.abs(randomChange / volatility) * 5;
      const volume = Math.floor(volumeBase * volumeMultiplier);
      
      // Calculate OHLC data realistically
      const open = currentPrice - (randomChange * 0.7);
      const close = currentPrice;
      const move = Math.abs(randomChange);
      const high = Math.max(open, close) + (move * Math.random() * 0.5);
      const low = Math.min(open, close) - (move * Math.random() * 0.5);
      
      return {
        timestamp: now - (dataPoints - i) * timeInterval,
        price: currentPrice,
        volume,
        open,
        high,
        low,
        close
      };
    });
    
    const mockData: TradingViewChartData = {
      symbol,
      timeframe,
      indicators: ['EMA(50)', 'EMA(200)', 'RSI', 'MACD'],
      lastUpdate: now,
      data: priceData
    };
    
    // Cache the data
    cachedChartData[cacheKey] = mockData;
    
    return mockData;
  } catch (error) {
    console.error(`Error fetching chart data for ${symbol}:`, error);
    return null;
  }
};

export const getTimeIntervalByTimeframe = (timeframe: string): number => {
  switch (timeframe) {
    case '1m': return 60 * 1000; // 1 minute
    case '5m': return 5 * 60 * 1000; // 5 minutes
    case '15m': return 15 * 60 * 1000; // 15 minutes
    case '30m': return 30 * 60 * 1000; // 30 minutes
    case '1h': return 60 * 60 * 1000; // 1 hour
    case '4h': return 4 * 60 * 60 * 1000; // 4 hours
    case '1D': return 24 * 60 * 60 * 1000; // 1 day
    case '1W': return 7 * 24 * 60 * 60 * 1000; // 1 week
    case '1M': return 30 * 24 * 60 * 60 * 1000; // 1 month (approximate)
    default: return 24 * 60 * 60 * 1000; // Default to 1 day
  }
};

// Function to clear the chart data cache
export const clearChartDataCache = () => {
  cachedChartData = {};
};

// Get the last sync timestamp
export const getLastSyncTimestamp = () => lastSyncTimestamp;

// Set the last sync timestamp
export const setLastSyncTimestamp = (timestamp: number) => {
  lastSyncTimestamp = timestamp;
};
