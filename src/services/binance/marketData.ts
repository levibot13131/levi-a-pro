
import { toast } from 'sonner';
import { useAppSettings } from '@/hooks/use-app-settings';

// Current mode tracking
let realTimeMode = false;

// Function to check if real-time mode is enabled
export const isRealTimeMode = () => realTimeMode;

// Function to set real-time mode
export const setRealTimeMode = (enabled: boolean) => {
  realTimeMode = enabled;
  // Dispatch event to notify other components
  const event = new CustomEvent('real-time-mode-change', {
    detail: { enabled }
  });
  window.dispatchEvent(event);
  
  // Log the change
  console.log(`Real-time mode: ${enabled ? 'ENABLED' : 'DISABLED'}`);
  return realTimeMode;
};

// Start real-time market data updates
export const startRealTimeMarketData = (symbol: string = 'BTCUSDT') => {
  console.log(`Starting real-time market data for ${symbol}`);
  
  try {
    // In production, this would connect to the Binance WebSocket API
    // For now we simulate the connection
    const isConnected = true;
    
    if (isConnected && realTimeMode) {
      console.log(`Real-time data stream established for ${symbol}`);
      // Start simulating real-time updates for development
      simulateRealTimeUpdates(symbol);
    }
    
    return isConnected;
  } catch (error) {
    console.error(`Failed to start real-time data for ${symbol}:`, error);
    return false;
  }
};

// Simulate real-time updates for development
const simulateRealTimeUpdates = (symbol: string) => {
  const interval = setInterval(() => {
    if (!realTimeMode) {
      clearInterval(interval);
      return;
    }
    
    const mockUpdate = {
      symbol,
      price: Math.random() * 50000,
      timestamp: Date.now(),
      volume: Math.random() * 100000
    };
    
    // Dispatch custom event with the mock data
    const event = new CustomEvent('binance-data-update', {
      detail: mockUpdate
    });
    
    window.dispatchEvent(event);
  }, 5000); // Update every 5 seconds
  
  return () => clearInterval(interval);
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
  if (realTimeMode) {
    try {
      // In production, this would fetch from an actual API
      console.log(`Fetching actual market data for ${symbol}`);
      
      // For now, return mock data with slightly more realistic values
      return generateRealisticMockData(symbol);
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      // Fall back to mock data
      return generateRealisticMockData(symbol);
    }
  } else {
    // Return standard mock data
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
  }
};

// Generate more realistic mock data
const generateRealisticMockData = (symbol: string): CurrencyData => {
  const baseSymbol = symbol.replace('USDT', '');
  
  const data: Record<string, any> = {
    BTC: {
      price: 40000 + (Math.random() * 10000),
      marketCap: 750000000000 + (Math.random() * 100000000000),
      volume24h: 20000000000 + (Math.random() * 10000000000),
      circulating: 19000000,
      total: 21000000,
      max: 21000000,
      launch: '2009-01-03',
      ath: 69000
    },
    ETH: {
      price: 2000 + (Math.random() * 500),
      marketCap: 250000000000 + (Math.random() * 50000000000),
      volume24h: 12000000000 + (Math.random() * 5000000000),
      circulating: 120000000,
      total: 120000000,
      max: null,
      launch: '2015-07-30',
      ath: 4800
    },
    SOL: {
      price: 50 + (Math.random() * 20),
      marketCap: 20000000000 + (Math.random() * 5000000000),
      volume24h: 2000000000 + (Math.random() * 1000000000),
      circulating: 350000000,
      total: 500000000,
      max: null,
      launch: '2020-03-16',
      ath: 260
    }
  };
  
  const coinData = data[baseSymbol] || {
    price: 10 + (Math.random() * 100),
    marketCap: 1000000000 + (Math.random() * 10000000000),
    volume24h: 500000000 + (Math.random() * 1000000000),
    circulating: 100000000 + (Math.random() * 900000000),
    total: 1000000000,
    max: null,
    launch: '2020-01-01',
    ath: 100
  };
  
  return {
    symbol,
    name: baseSymbol,
    price: coinData.price,
    change24h: (Math.random() * 10) - 5,
    volume24h: coinData.volume24h,
    marketCap: coinData.marketCap,
    circulatingSupply: coinData.circulating,
    totalSupply: coinData.total,
    maxSupply: coinData.max,
    launchDate: coinData.launch,
    allTimeHigh: {
      price: coinData.ath,
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
  maxSupply: number | null;
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
