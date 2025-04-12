
import { toast } from 'sonner';

export interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
  lastConnected?: number;
  isConnected?: boolean;
}

// Local storage key for Binance credentials
const BINANCE_CREDENTIALS_KEY = 'binance_credentials';

// Save Binance credentials to local storage
export const saveBinanceCredentials = (credentials: BinanceCredentials): void => {
  const data = {
    ...credentials,
    lastConnected: Date.now()
  };
  localStorage.setItem(BINANCE_CREDENTIALS_KEY, JSON.stringify(data));
};

// Get Binance credentials from local storage
export const getBinanceCredentials = (): BinanceCredentials | null => {
  const data = localStorage.getItem(BINANCE_CREDENTIALS_KEY);
  if (!data) return null;
  
  try {
    return JSON.parse(data) as BinanceCredentials;
  } catch (e) {
    console.error('Error parsing Binance credentials:', e);
    return null;
  }
};

// Check if Binance is connected
export const isBinanceConnected = (): boolean => {
  const credentials = getBinanceCredentials();
  return !!credentials && !!credentials.apiKey && !!credentials.apiSecret;
};

// Disconnect from Binance
export const disconnectBinance = (): void => {
  localStorage.removeItem(BINANCE_CREDENTIALS_KEY);
};

// Test Binance connection
export const testBinanceConnection = async (): Promise<boolean> => {
  // In a real application, we would make an API call to test the connection
  const credentials = getBinanceCredentials();
  if (!credentials) return false;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, always return success if we have credentials
  return true;
};

// Start real-time market data updates
export const startRealTimeMarketData = async (): Promise<boolean> => {
  if (!isBinanceConnected()) {
    console.error('Cannot start real-time market data: Not connected to Binance');
    return false;
  }
  
  // In a real application, we would establish a WebSocket connection to Binance
  console.log('Starting real-time market data updates from Binance');
  
  return true;
};

// Get fundamental data for an asset
export const getFundamentalData = async (assetId: string): Promise<any> => {
  if (!isBinanceConnected()) {
    console.error('Cannot get fundamental data: Not connected to Binance');
    return null;
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return {
    marketCap: 950000000000,
    volume24h: 45000000000,
    circulatingSupply: 19000000,
    maxSupply: 21000000,
    allTimeHigh: 69000,
    allTimeHighDate: '2021-11-10'
  };
};

// Get real-time price data
export const getRealTimePriceData = async (symbols: string[]): Promise<Record<string, any>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock data
  const result: Record<string, any> = {};
  
  symbols.forEach(symbol => {
    const basePrice = symbol.toLowerCase().includes('btc') ? 50000 : 
                      symbol.toLowerCase().includes('eth') ? 3000 : 
                      symbol.toLowerCase().includes('bnb') ? 450 : 100;
    
    const randomChange = (Math.random() * 6) - 3; // Random change between -3% and +3%
    
    result[symbol] = {
      symbol,
      price: basePrice + (basePrice * randomChange / 100),
      change24h: randomChange,
      volume: basePrice * 10000 * (0.8 + Math.random() * 0.4)
    };
  });
  
  return result;
};
