
import axios from 'axios';
import { toast } from 'sonner';

// Define the base URL
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Cache for API responses to prevent rate limiting
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30 * 1000; // 30 seconds cache

// Interface for coin price data
export interface CoinPriceData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

/**
 * Helper function to use cached data or fetch fresh data
 */
const fetchWithCache = async (url: string): Promise<any> => {
  // Check if we have cached data
  const cacheKey = url;
  const cachedResponse = apiCache.get(cacheKey);
  const now = Date.now();
  
  if (cachedResponse && now - cachedResponse.timestamp < CACHE_DURATION) {
    console.log('Using cached data for:', url);
    return cachedResponse.data;
  }
  
  try {
    console.log('Fetching fresh data from CoinGecko:', url);
    const response = await axios.get(url);
    
    // Cache the response
    apiCache.set(cacheKey, {
      data: response.data,
      timestamp: now
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error);
    toast.error('שגיאה בטעינת נתונים מ-CoinGecko');
    return null;
  }
};

/**
 * Get simple price data for specific coins
 */
export const getSimplePrices = async (coinIds: string[] = ['bitcoin', 'ethereum'], currencies: string[] = ['usd', 'ils']): Promise<any> => {
  const url = `${COINGECKO_API_BASE}/simple/price?ids=${coinIds.join(',')}&vs_currencies=${currencies.join(',')}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;
  return fetchWithCache(url);
};

/**
 * Get detailed market data for coins (supports pagination)
 */
export const getCoinsMarkets = async (
  currency: string = 'usd',
  perPage: number = 20,
  page: number = 1,
  sparkline: boolean = false
): Promise<CoinPriceData[]> => {
  const url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=${sparkline}&locale=en`;
  return fetchWithCache(url);
};

/**
 * Get trending coins in the last 24 hours
 */
export const getTrendingCoins = async (): Promise<any> => {
  const url = `${COINGECKO_API_BASE}/search/trending`;
  return fetchWithCache(url);
};

/**
 * Get detailed data for a specific coin
 */
export const getCoinData = async (coinId: string): Promise<any> => {
  const url = `${COINGECKO_API_BASE}/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=false&sparkline=false`;
  return fetchWithCache(url);
};

/**
 * Get historical market data for a specific coin
 */
export const getCoinHistory = async (coinId: string, days: number | 'max' = 7): Promise<any> => {
  const url = `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
  return fetchWithCache(url);
};

/**
 * Search for coins, categories and markets
 */
export const searchCoins = async (query: string): Promise<any> => {
  const url = `${COINGECKO_API_BASE}/search?query=${encodeURIComponent(query)}`;
  return fetchWithCache(url);
};

/**
 * Get global crypto market data
 */
export const getGlobalData = async (): Promise<any> => {
  const url = `${COINGECKO_API_BASE}/global`;
  return fetchWithCache(url);
};

/**
 * Clear the cache to force fresh data fetching
 */
export const clearCache = (): void => {
  apiCache.clear();
  toast.success('מטמון CoinGecko נוקה בהצלחה');
};

/**
 * Check if CoinGecko API is responding
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${COINGECKO_API_BASE}/ping`);
    return response.status === 200;
  } catch (error) {
    console.error('CoinGecko connection test failed:', error);
    return false;
  }
};
