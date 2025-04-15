
import { toast } from 'sonner';
import { useAppSettings } from '@/hooks/use-app-settings';

// Current mode tracking
let realTimeMode = false;

// Function to check if real-time mode is enabled
export const isRealTimeMode = () => realTimeMode;

// Function to set real-time mode
export const setRealTimeMode = (enabled: boolean) => {
  realTimeMode = enabled;
  return realTimeMode;
};

// Start real-time market data updates
export const startRealTimeMarketData = (symbol: string = 'BTCUSDT') => {
  console.log(`Starting real-time market data for ${symbol}`);
  // Implementation would connect to Binance WebSocket here
  return true;
};

// Setup event listener for Binance updates
export const listenToBinanceUpdates = (callback: (data: any) => void) => {
  const eventName = 'binance-data-update';
  
  // Add event listener
  window.addEventListener(eventName, ((event: CustomEvent) => {
    callback(event.detail);
  }) as EventListener);
  
  // Return cleanup function
  return () => {
    window.removeEventListener(eventName, ((event: CustomEvent) => {
      callback(event.detail);
    }) as EventListener);
  };
};

// Get currency fundamental data
export const getFundamentalData = async (symbol: string): Promise<CurrencyData> => {
  // In a real implementation, this would fetch from an API
  // For now, return mock data
  return {
    symbol,
    name: symbol.replace('USDT', ''),
    price: Math.random() * 50000,
    change24h: (Math.random() * 10) - 5,
    volume24h: Math.random() * 1000000000,
    marketCap: Math.random() * 1000000000000,
    circulatingSupply: Math.random() * 21000000,
    totalSupply: Math.random() * 21000000,
    maxSupply: symbol === 'BTCUSDT' ? 21000000 : Math.random() * 100000000,
    launchDate: '2009-01-03',
    allTimeHigh: {
      price: 69000,
      date: '2021-11-10'
    }
  };
};

// Interface for currency data
export interface CurrencyData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
  launchDate: string;
  allTimeHigh: {
    price: number;
    date: string;
  };
}

// Start and stop polling for data (if not using WebSockets)
let pollingInterval: number | null = null;

export const startPolling = (callback: () => void, interval: number = 5000) => {
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = window.setInterval(callback, interval);
  return () => {
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = null;
  };
};

export const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};
