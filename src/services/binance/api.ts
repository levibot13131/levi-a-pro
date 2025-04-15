
import { toast } from 'sonner';
import { getBinanceCredentials } from './credentials';
import { getProxyConfig } from '@/services/proxy/proxyConfig';
import { CurrencyData } from './marketData';

const BINANCE_API_BASE = 'https://api.binance.com';

/**
 * Make an authenticated request to the Binance API
 */
export const fetchFromBinance = async (
  endpoint: string,
  params: Record<string, string> = {},
  requiresAuth: boolean = false
): Promise<any> => {
  try {
    // Check if we need to use a proxy
    const proxyConfig = getProxyConfig();
    const useProxy = !!proxyConfig?.enabled;
    
    // Base URL with or without proxy
    const baseUrl = useProxy 
      ? `${proxyConfig?.url}/binance`
      : BINANCE_API_BASE;
    
    // Build URL with query parameters
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    const url = `${baseUrl}${endpoint}?${queryParams.toString()}`;
    
    // Add authentication if required
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (requiresAuth) {
      const credentials = getBinanceCredentials();
      if (!credentials) {
        throw new Error('No Binance credentials available');
      }
      
      // Add authentication headers if not using proxy
      if (!useProxy) {
        headers['X-MBX-APIKEY'] = credentials.apiKey;
        // Note: For authenticated requests, signature would be needed
        // This is a simplified version
      }
    }
    
    // Make the request
    const response = await fetch(url, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from Binance:', error);
    throw error;
  }
};

/**
 * Get current price for a symbol
 */
export const getCurrentPrice = async (symbol: string): Promise<number> => {
  try {
    const data = await fetchFromBinance('/api/v3/ticker/price', { symbol });
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Error getting current price for ${symbol}:`, error);
    toast.error(`שגיאה בטעינת מחיר עבור ${symbol}`);
    return 0;
  }
};

/**
 * Get 24hr ticker information
 */
export const get24hTicker = async (symbol: string): Promise<any> => {
  try {
    return await fetchFromBinance('/api/v3/ticker/24hr', { symbol });
  } catch (error) {
    console.error(`Error getting 24h ticker for ${symbol}:`, error);
    toast.error(`שגיאה בטעינת נתוני 24 שעות עבור ${symbol}`);
    throw error;
  }
};

/**
 * Get fundamental data for a symbol
 */
export const fetchFundamentalData = async (symbol: string): Promise<CurrencyData> => {
  try {
    // Get 24h ticker for price, high, low, volume
    const ticker = await get24hTicker(symbol);
    
    // Format the response
    return {
      symbol,
      price: parseFloat(ticker.lastPrice),
      change24h: parseFloat(ticker.priceChange),
      high24h: parseFloat(ticker.highPrice),
      low24h: parseFloat(ticker.lowPrice),
      volume24h: parseFloat(ticker.volume),
      marketCap: 0, // Not available from this API
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error('Error fetching fundamental data:', error);
    
    // Return default structure with zeros
    return {
      symbol,
      price: 0,
      change24h: 0,
      high24h: 0,
      low24h: 0,
      volume24h: 0,
      marketCap: 0,
      lastUpdated: Date.now()
    };
  }
};

/**
 * Get klines (candlestick) data
 */
export const getKlines = async (
  symbol: string, 
  interval: string = '1h', 
  limit: number = 100
): Promise<any[]> => {
  try {
    const data = await fetchFromBinance('/api/v3/klines', {
      symbol,
      interval,
      limit: limit.toString()
    });
    
    return data.map((kline: any[]) => ({
      time: kline[0],
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
      closeTime: kline[6],
      quoteAssetVolume: parseFloat(kline[7]),
      trades: kline[8],
      takerBuyBaseAssetVolume: parseFloat(kline[9]),
      takerBuyQuoteAssetVolume: parseFloat(kline[10])
    }));
  } catch (error) {
    console.error(`Error getting klines for ${symbol}:`, error);
    toast.error(`שגיאה בטעינת נתוני מחיר עבור ${symbol}`);
    return [];
  }
};
