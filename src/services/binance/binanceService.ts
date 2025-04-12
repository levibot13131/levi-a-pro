
import { toast } from 'sonner';

// Constants for local storage
const BINANCE_CREDENTIALS_KEY = 'binance_credentials';

// Types
export interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
  isConnected: boolean;
  lastConnected?: number;
}

export interface MarketDataResponse {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  change24h: number;
}

export interface FundamentalDataResponse {
  symbol: string;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  maxSupply: number;
  fundamentalScore: number;
  sentiment: string;
  newsCount24h: number;
  socialMentions24h: number;
  timestamp: number;
}

// Check if Binance is connected
export const isBinanceConnected = (): boolean => {
  const credentials = getBinanceCredentials();
  return credentials !== null && credentials.isConnected === true;
};

// Get stored Binance credentials
export const getBinanceCredentials = (): BinanceCredentials | null => {
  const stored = localStorage.getItem(BINANCE_CREDENTIALS_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as BinanceCredentials;
  } catch (error) {
    console.error('Error parsing Binance credentials:', error);
    return null;
  }
};

// Save Binance credentials
export const saveBinanceCredentials = (credentials: BinanceCredentials): void => {
  localStorage.setItem(BINANCE_CREDENTIALS_KEY, JSON.stringify({
    ...credentials,
    isConnected: true,
    lastConnected: Date.now()
  }));
};

// Disconnect from Binance
export const disconnectBinance = (): void => {
  localStorage.removeItem(BINANCE_CREDENTIALS_KEY);
  toast.info('נותק מחשבון Binance');
};

// Test Binance connection
export const testBinanceConnection = async (): Promise<boolean> => {
  const credentials = getBinanceCredentials();
  
  if (!credentials) {
    return false;
  }
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, we'll just check if API key looks valid
    return credentials.apiKey.length > 10 && credentials.apiSecret.length > 10;
  } catch (error) {
    console.error('Error testing Binance connection:', error);
    return false;
  }
};

// Mock method for starting real-time market data
export const startRealTimeMarketData = async (
  symbols: string[],
  onUpdate: (data: MarketDataResponse) => void
): Promise<{ stop: () => void }> => {
  // In a real implementation, this would connect to Binance WebSocket API
  console.log('Starting real-time market data for:', symbols);
  
  // For demo, we'll update at an interval
  const intervalId = setInterval(() => {
    symbols.forEach(symbol => {
      const basePrice = getBasePrice(symbol);
      
      // Send random price updates
      onUpdate({
        symbol,
        price: basePrice * (1 + (Math.random() - 0.5) * 0.01),
        volume: Math.random() * 100000000,
        timestamp: Date.now(),
        change24h: (Math.random() - 0.5) * 5
      });
    });
  }, 3000);
  
  return {
    stop: () => clearInterval(intervalId)
  };
};

// Get fundamental data for a symbol
export const getFundamentalData = async (symbol: string): Promise<FundamentalDataResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const basePrice = getBasePrice(symbol);
  
  return {
    symbol,
    marketCap: basePrice * getCirculatingSupply(symbol),
    volume24h: basePrice * getCirculatingSupply(symbol) * (Math.random() * 0.1),
    circulatingSupply: getCirculatingSupply(symbol),
    maxSupply: getMaxSupply(symbol),
    fundamentalScore: Math.floor(Math.random() * 10) + 1,
    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
    newsCount24h: Math.floor(Math.random() * 50) + 1,
    socialMentions24h: Math.floor(Math.random() * 1000) + 100,
    timestamp: Date.now()
  };
};

// Helper function to get base price for a symbol
const getBasePrice = (symbol: string): number => {
  const priceMap: Record<string, number> = {
    'BTCUSDT': 68000,
    'ETHUSDT': 3300,
    'SOLUSDT': 143,
    'ADAUSDT': 0.45,
    'DOGEUSDT': 0.12,
    'XRPUSDT': 0.55,
    'BNBUSDT': 580,
  };
  
  return priceMap[symbol] || 100; // Default to 100 if not found
};

// Helper function to get circulating supply
const getCirculatingSupply = (symbol: string): number => {
  const supplyMap: Record<string, number> = {
    'BTCUSDT': 19460000,
    'ETHUSDT': 120000000,
    'SOLUSDT': 425000000,
    'ADAUSDT': 35000000000,
    'DOGEUSDT': 140000000000,
    'XRPUSDT': 45000000000,
    'BNBUSDT': 155000000,
  };
  
  return supplyMap[symbol] || 1000000000;
};

// Helper function to get max supply
const getMaxSupply = (symbol: string): number => {
  const maxSupplyMap: Record<string, number> = {
    'BTCUSDT': 21000000,
    'ETHUSDT': 0, // No max supply
    'SOLUSDT': 0, // No max supply
    'ADAUSDT': 45000000000,
    'DOGEUSDT': 0, // No max supply
    'XRPUSDT': 100000000000,
    'BNBUSDT': 200000000,
  };
  
  return maxSupplyMap[symbol] || 0;
};
