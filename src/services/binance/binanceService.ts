
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
export const saveBinanceCredentials = (
  apiKey: string, 
  apiSecret: string
): BinanceCredentials => {
  const credentials: BinanceCredentials = {
    apiKey,
    apiSecret,
    isConnected: true,
    lastConnected: Date.now()
  };
  
  localStorage.setItem(BINANCE_CREDENTIALS_KEY, JSON.stringify(credentials));
  return credentials;
};

// Disconnect from Binance
export const disconnectBinance = (): void => {
  localStorage.removeItem(BINANCE_CREDENTIALS_KEY);
  toast.info('נותקת מחשבון Binance');
};

// Connect to Binance
export const connectToBinance = async (
  apiKey: string,
  apiSecret: string
): Promise<BinanceCredentials> => {
  // In a real implementation, this would validate the credentials with Binance API
  // For demo, just simulate a network request
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check if API key has valid format (mock validation)
  if (!apiKey.match(/^[A-Za-z0-9]{15,64}$/)) {
    throw new Error('מפתח API לא תקין');
  }
  
  // Check if API secret has valid format (mock validation)
  if (!apiSecret.match(/^[A-Za-z0-9]{30,64}$/)) {
    throw new Error('סוד API לא תקין');
  }
  
  // Save credentials
  const credentials = saveBinanceCredentials(apiKey, apiSecret);
  
  toast.success('חיבור ל-Binance בוצע בהצלחה', {
    description: 'כעת תוכל לקבל נתוני מסחר בזמן אמת ולבצע פעולות מסחר'
  });
  
  return credentials;
};

// Start real-time market data stream
export const startRealTimeMarketData = async (
  symbols: string[],
  onData: (data: MarketDataResponse) => void
): Promise<{ stop: () => void }> => {
  if (!isBinanceConnected()) {
    throw new Error('לא מחובר ל-Binance');
  }
  
  // Initialize symbols prices for consistency
  const initialPrices: Record<string, number> = {};
  symbols.forEach(symbol => {
    if (symbol === 'bitcoin') initialPrices[symbol] = 68000 + (Math.random() * 1000);
    else if (symbol === 'ethereum') initialPrices[symbol] = 3300 + (Math.random() * 100);
    else if (symbol === 'solana') initialPrices[symbol] = 143 + (Math.random() * 10);
    else initialPrices[symbol] = 100 + (Math.random() * 50);
  });
  
  // Simulate websocket connection
  console.log('Starting real-time market data for:', symbols);
  
  // Interval for simulating data
  const interval = setInterval(() => {
    symbols.forEach(symbol => {
      // Simulate real-time price changes (small variations)
      const currentPrice = initialPrices[symbol];
      const priceChange = currentPrice * (Math.random() * 0.006 - 0.003); // ±0.3%
      const newPrice = currentPrice + priceChange;
      initialPrices[symbol] = newPrice;
      
      // Random volume
      const volume = currentPrice * 1000 * (0.8 + Math.random() * 0.4);
      
      // Random 24h change
      const change24h = (Math.random() * 6) - 3; // -3% to +3%
      
      // Send mock data to callback
      onData({
        symbol,
        price: newPrice,
        volume,
        timestamp: Date.now(),
        change24h
      });
    });
  }, 2000); // Update every 2 seconds
  
  // Return function to stop the stream
  return {
    stop: () => {
      clearInterval(interval);
      console.log('Stopped real-time market data');
    }
  };
};

// Get fundamental data for an asset
export const getFundamentalData = async (symbol: string): Promise<FundamentalDataResponse> => {
  // In a real implementation, this would fetch data from Binance API
  // For demo, return mock data
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let marketCap = 0;
  let volume24h = 0;
  let circulatingSupply = 0;
  let maxSupply = 0;
  
  // Set realistic values based on symbol
  if (symbol === 'bitcoin') {
    marketCap = 1300000000000 + (Math.random() * 50000000000);
    volume24h = 35000000000 + (Math.random() * 10000000000);
    circulatingSupply = 19500000 + (Math.random() * 100000);
    maxSupply = 21000000;
  } else if (symbol === 'ethereum') {
    marketCap = 400000000000 + (Math.random() * 20000000000);
    volume24h = 15000000000 + (Math.random() * 5000000000);
    circulatingSupply = 120000000 + (Math.random() * 500000);
    maxSupply = 0; // No fixed max supply
  } else if (symbol === 'solana') {
    marketCap = 60000000000 + (Math.random() * 5000000000);
    volume24h = 2000000000 + (Math.random() * 1000000000);
    circulatingSupply = 420000000 + (Math.random() * 1000000);
    maxSupply = 500000000;
  } else {
    marketCap = 1000000000 + (Math.random() * 1000000000);
    volume24h = 500000000 + (Math.random() * 200000000);
    circulatingSupply = 100000000 + (Math.random() * 10000000);
    maxSupply = 250000000;
  }
  
  return {
    symbol,
    marketCap,
    volume24h,
    circulatingSupply,
    maxSupply,
    fundamentalScore: Math.round(60 + Math.random() * 30), // 60-90
    sentiment: ['positive', 'neutral', 'positive'][Math.floor(Math.random() * 3)], // More positive bias
    newsCount24h: Math.floor(5 + Math.random() * 15),
    socialMentions24h: Math.floor(1000 + Math.random() * 9000),
    timestamp: Date.now()
  };
};
