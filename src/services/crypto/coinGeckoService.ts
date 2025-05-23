import axios from 'axios';
import { toast } from 'sonner';

// Base URL for CoinGecko API
const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_PRO_API_BASE_URL = 'https://pro-api.coingecko.com/api/v3';

// Local storage key for API key
const COINGECKO_API_KEY_STORAGE = 'coingecko_api_key';

// Cache for API responses to avoid rate limits
const apiCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 minute

// Define types
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
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d?: { price: number[] };
}

/**
 * Get the CoinGecko API key from local storage
 */
export const getCoinGeckoApiKey = (): string | null => {
  return localStorage.getItem(COINGECKO_API_KEY_STORAGE);
};

/**
 * Set the CoinGecko API key in local storage
 */
export const setCoinGeckoApiKey = (apiKey: string): void => {
  localStorage.setItem(COINGECKO_API_KEY_STORAGE, apiKey);
  toast.success('מפתח ה-API של CoinGecko נשמר בהצלחה');
};

/**
 * Remove the CoinGecko API key from local storage
 */
export const removeCoinGeckoApiKey = (): void => {
  localStorage.removeItem(COINGECKO_API_KEY_STORAGE);
  toast.info('מפתח ה-API של CoinGecko הוסר');
};

/**
 * Check if CoinGecko Pro API key is set
 */
export const isCoinGeckoProConnected = (): boolean => {
  const apiKey = getCoinGeckoApiKey();
  return !!apiKey && apiKey.length > 10;
};

/**
 * Get the appropriate API base URL based on whether a Pro API key is available
 */
const getApiBaseUrl = (): string => {
  const apiKey = getCoinGeckoApiKey();
  return apiKey ? COINGECKO_PRO_API_BASE_URL : COINGECKO_API_BASE_URL;
};

/**
 * Build headers for API requests, including API key if available
 */
const buildHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};
  const apiKey = getCoinGeckoApiKey();
  
  if (apiKey) {
    headers['x-cg-pro-api-key'] = apiKey;
  }
  
  return headers;
};

/**
 * Test connection to CoinGecko API
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const headers = buildHeaders();
    const baseUrl = getApiBaseUrl();
    
    const response = await axios.get(`${baseUrl}/ping`, { headers });
    return response.status === 200;
  } catch (error) {
    console.error('Error testing CoinGecko connection:', error);
    return false;
  }
};

/**
 * Get current prices for multiple coins
 */
export const getPrices = async (coinIds: string[], currency = 'usd'): Promise<Record<string, number>> => {
  const cacheKey = `prices_${coinIds.join('_')}_${currency}`;
  
  // Check cache first
  const cachedData = apiCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
    console.log('Using cached CoinGecko price data');
    return cachedData.data;
  }
  
  try {
    const headers = buildHeaders();
    const baseUrl = getApiBaseUrl();
    
    const response = await axios.get(`${baseUrl}/simple/price`, {
      params: {
        ids: coinIds.join(','),
        vs_currencies: currency
      },
      headers
    });
    
    // Format the response
    const prices: Record<string, number> = {};
    for (const coinId in response.data) {
      prices[coinId] = response.data[coinId][currency];
    }
    
    // Update cache
    apiCache.set(cacheKey, { data: prices, timestamp: Date.now() });
    
    return prices;
  } catch (error) {
    console.error('Error fetching CoinGecko prices:', error);
    throw error;
  }
};

/**
 * Get simple prices for multiple coins in multiple currencies
 */
export const getSimplePrices = async (
  coinIds: string[] = ['bitcoin', 'ethereum', 'solana', 'cardano', 'binancecoin'],
  currencies: string[] = ['usd']
): Promise<Record<string, any>> => {
  const cacheKey = `simple_prices_${coinIds.join('_')}_${currencies.join('_')}`;
  
  // Check cache first
  const cachedData = apiCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
    console.log('Using cached CoinGecko simple price data');
    return cachedData.data;
  }
  
  try {
    const headers = buildHeaders();
    const baseUrl = getApiBaseUrl();
    
    const response = await axios.get(`${baseUrl}/simple/price`, {
      params: {
        ids: coinIds.join(','),
        vs_currencies: currencies.join(','),
        include_market_cap: true,
        include_24hr_vol: true,
        include_24hr_change: true
      },
      headers
    });
    
    // Update cache
    apiCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching CoinGecko simple prices:', error);
    toast.error('שגיאה בטעינת מחירים מ-CoinGecko');
    throw error;
  }
};

/**
 * Get coins markets data
 */
export const getCoinsMarkets = async (
  currency = 'usd',
  perPage = 20,
  page = 1,
  sparkline = true,
  priceChangePercentage = '1h,24h,7d'
): Promise<CoinPriceData[]> => {
  const cacheKey = `markets_${currency}_${perPage}_${page}_${sparkline}_${priceChangePercentage}`;
  
  // Check cache first
  const cachedData = apiCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
    console.log('Using cached CoinGecko markets data');
    return cachedData.data;
  }
  
  try {
    const response = await axios.get(`${COINGECKO_API_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: currency,
        per_page: perPage,
        page: page,
        sparkline: sparkline,
        price_change_percentage: priceChangePercentage,
        order: 'market_cap_desc'
      }
    });
    
    // Update cache
    apiCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching CoinGecko markets data:', error);
    toast.error('שגיאה בטעינת נתוני שוק מ-CoinGecko');
    throw error;
  }
};

/**
 * Get market data for coins
 */
export const getMarketData = async (
  coinIds: string[],
  currency = 'usd',
  days = 1,
  interval = 'hourly'
): Promise<any> => {
  const cacheKey = `market_${coinIds.join('_')}_${currency}_${days}_${interval}`;
  
  // Check cache first
  const cachedData = apiCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
    console.log('Using cached CoinGecko market data');
    return cachedData.data;
  }
  
  try {
    const results = {};
    
    // CoinGecko limits the number of IDs per request, so we process them in batches
    const batchSize = 10;
    
    for (let i = 0; i < coinIds.length; i += batchSize) {
      const batchIds = coinIds.slice(i, i + batchSize);
      
      const response = await axios.get(`${COINGECKO_API_BASE_URL}/coins/markets`, {
        params: {
          vs_currency: currency,
          ids: batchIds.join(','),
          order: 'market_cap_desc',
          per_page: batchSize,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h,7d,30d'
        }
      });
      
      response.data.forEach((coin: any) => {
        results[coin.id] = coin;
      });
      
      // Respect API rate limits
      if (i + batchSize < coinIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Update cache
    apiCache.set(cacheKey, { data: results, timestamp: Date.now() });
    
    return results;
  } catch (error) {
    console.error('Error fetching CoinGecko market data:', error);
    toast.error('שגיאה בטעינת נתוני שוק');
    throw error;
  }
};

/**
 * Get global market data
 */
export const getGlobalData = async (): Promise<any> => {
  const cacheKey = `global_data`;
  
  // Check cache first
  const cachedData = apiCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
    console.log('Using cached CoinGecko global data');
    return cachedData.data;
  }
  
  try {
    const response = await axios.get(`${COINGECKO_API_BASE_URL}/global`);
    
    // Update cache
    apiCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching CoinGecko global data:', error);
    toast.error('שגיאה בטעינת נתוני שוק גלובליים');
    throw error;
  }
};

/**
 * Get historical price data for a coin
 */
export const getHistoricalData = async (
  coinId: string,
  currency = 'usd',
  days = 30
): Promise<any> => {
  const cacheKey = `historical_${coinId}_${currency}_${days}`;
  
  // Check cache first
  const cachedData = apiCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
    console.log('Using cached CoinGecko historical data');
    return cachedData.data;
  }
  
  try {
    const response = await axios.get(
      `${COINGECKO_API_BASE_URL}/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: currency,
          days: days,
          interval: days > 90 ? 'daily' : undefined
        }
      }
    );
    
    // Update cache
    apiCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error);
    toast.error(`שגיאה בטעינת נתונים היסטוריים עבור ${coinId}`);
    throw error;
  }
};

/**
 * Get trending coins from CoinGecko
 */
export const getTrendingCoins = async (): Promise<any[]> => {
  const cacheKey = 'trending_coins';
  
  // Check cache first
  const cachedData = apiCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
    console.log('Using cached CoinGecko trending coins');
    return cachedData.data;
  }
  
  try {
    const response = await axios.get(`${COINGECKO_API_BASE_URL}/search/trending`);
    
    // Update cache
    apiCache.set(cacheKey, { data: response.data.coins, timestamp: Date.now() });
    
    return response.data.coins;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    toast.error('שגיאה בטעינת מטבעות מובילים');
    throw error;
  }
};

/**
 * Clear the CoinGecko API cache
 */
export const clearCache = (): void => {
  apiCache.clear();
  console.log('CoinGecko API cache cleared');
};

/**
 * Get the API request limit status
 */
export const getApiStatus = async (): Promise<any> => {
  try {
    // CoinGecko doesn't have a specific endpoint for API status in the free tier
    // We'll just use the ping endpoint to check if the API is working
    const response = await axios.get(`${COINGECKO_API_BASE_URL}/ping`);
    return {
      status: response.status === 200 ? 'operational' : 'issues',
      limitRemaining: 'unknown', // Not available in free tier
      limitResetAt: 'unknown'    // Not available in free tier
    };
  } catch (error) {
    console.error('Error checking CoinGecko API status:', error);
    return {
      status: 'issues',
      limitRemaining: 'unknown',
      limitResetAt: 'unknown'
    };
  }
};

/**
 * Get rate limit status for CoinGecko API
 * Note: Only works with Pro API, free tier doesn't provide this info
 */
export const getRateLimitStatus = async (): Promise<any> => {
  const apiKey = getCoinGeckoApiKey();
  
  if (!apiKey) {
    return {
      status: 'unknown',
      minuteLimit: 'unknown',
      minuteRemaining: 'unknown',
      minuteReset: 'unknown'
    };
  }
  
  try {
    const response = await axios.get(`${COINGECKO_PRO_API_BASE_URL}/ping`, {
      headers: {
        'x-cg-pro-api-key': apiKey
      }
    });
    
    // Extract rate limit headers if available
    return {
      status: 'operational',
      minuteLimit: response.headers['x-ratelimit-limit'] || 'unknown',
      minuteRemaining: response.headers['x-ratelimit-remaining'] || 'unknown',
      minuteReset: response.headers['x-ratelimit-reset'] || 'unknown'
    };
  } catch (error) {
    console.error('Error checking CoinGecko rate limit status:', error);
    return {
      status: 'issues',
      minuteLimit: 'unknown',
      minuteRemaining: 'unknown',
      minuteReset: 'unknown'
    };
  }
};

/**
 * Validate CoinGecko Pro API key
 */
export const validateCoinGeckoApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    if (!apiKey || apiKey.length < 10) {
      return false;
    }
    
    const response = await axios.get(`${COINGECKO_PRO_API_BASE_URL}/ping`, {
      headers: {
        'x-cg-pro-api-key': apiKey
      }
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Error validating CoinGecko API key:', error);
    return false;
  }
};

/**
 * Determine if rate limiting is occurring
 */
export const isRateLimited = (error: any): boolean => {
  return error?.response?.status === 429;
};
