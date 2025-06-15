
// CoinGecko API service - CLOUD NATIVE VERSION

import { toast } from 'sonner';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const COINGECKO_PRO_API_BASE = 'https://pro-api.coingecko.com/api/v3';

let apiKey: string | null = null;

export interface CoinPriceData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

/**
 * Set CoinGecko API key
 */
export const setCoinGeckoApiKey = (key: string): void => {
  apiKey = key;
  localStorage.setItem('coingecko_api_key', key);
};

/**
 * Get CoinGecko API key
 */
export const getCoinGeckoApiKey = (): string | null => {
  if (!apiKey) {
    apiKey = localStorage.getItem('coingecko_api_key');
  }
  return apiKey;
};

/**
 * Remove CoinGecko API key
 */
export const removeCoinGeckoApiKey = (): void => {
  apiKey = null;
  localStorage.removeItem('coingecko_api_key');
};

/**
 * Make request to CoinGecko API - DIRECT CLOUD CONNECTION
 */
const fetchFromCoinGecko = async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
  try {
    const currentApiKey = getCoinGeckoApiKey();
    const baseUrl = currentApiKey ? COINGECKO_PRO_API_BASE : COINGECKO_API_BASE;
    
    const queryParams = new URLSearchParams(params);
    if (currentApiKey) {
      queryParams.append('x_cg_pro_api_key', currentApiKey);
    }
    
    const url = `${baseUrl}${endpoint}?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from CoinGecko:', error);
    throw error;
  }
};

/**
 * Test CoinGecko connection
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${COINGECKO_API_BASE}/ping`);
    return response.ok;
  } catch (error) {
    console.error('CoinGecko connection test failed:', error);
    return false;
  }
};

/**
 * Validate CoinGecko API key
 */
export const validateCoinGeckoApiKey = async (key: string): Promise<boolean> => {
  try {
    const testUrl = `${COINGECKO_PRO_API_BASE}/ping?x_cg_pro_api_key=${key}`;
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating CoinGecko API key:', error);
    return false;
  }
};

/**
 * Get simple prices for multiple coins
 */
export const getSimplePrices = async (
  coinIds: string[] = ['bitcoin', 'ethereum'], 
  currencies: string[] = ['usd']
): Promise<any> => {
  try {
    const params = {
      ids: coinIds.join(','),
      vs_currencies: currencies.join(','),
      include_24hr_change: 'true',
      include_market_cap: 'true',
      include_24hr_vol: 'true'
    };
    
    return await fetchFromCoinGecko('/simple/price', params);
  } catch (error) {
    console.error('Error getting simple prices:', error);
    toast.error('שגיאה בקבלת מחירי מטבעות');
    return {};
  }
};

/**
 * Get trending coins
 */
export const getTrendingCoins = async (): Promise<any[]> => {
  try {
    const data = await fetchFromCoinGecko('/search/trending');
    return data.coins || [];
  } catch (error) {
    console.error('Error getting trending coins:', error);
    toast.error('שגיאה בקבלת מטבעות מובילים');
    return [];
  }
};

/**
 * Get market data for coins
 */
export const getMarketData = async (
  coinIds: string[] = ['bitcoin', 'ethereum'], 
  currency: string = 'usd',
  limit: number = 50
): Promise<any[]> => {
  try {
    const params = {
      ids: coinIds.join(','),
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: limit.toString(),
      page: '1',
      sparkline: 'false',
      price_change_percentage: '24h'
    };
    
    return await fetchFromCoinGecko('/coins/markets', params);
  } catch (error) {
    console.error('Error getting market data:', error);
    toast.error('שגיאה בקבלת נתוני שוק');
    return [];
  }
};

/**
 * Get coins markets data
 */
export const getCoinsMarkets = async (
  vsCurrency: string = 'usd',
  perPage: number = 20,
  page: number = 1
): Promise<CoinPriceData[]> => {
  try {
    const params = {
      vs_currency: vsCurrency,
      order: 'market_cap_desc',
      per_page: perPage.toString(),
      page: page.toString(),
      sparkline: 'false',
      price_change_percentage: '24h'
    };
    
    const data = await fetchFromCoinGecko('/coins/markets', params);
    return data || [];
  } catch (error) {
    console.error('Error getting coins markets:', error);
    toast.error('שגיאה בקבלת נתוני שווקים');
    return [];
  }
};

/**
 * Get global market data
 */
export const getGlobalData = async (): Promise<any> => {
  try {
    const data = await fetchFromCoinGecko('/global');
    return data?.data || {};
  } catch (error) {
    console.error('Error getting global data:', error);
    toast.error('שגיאה בקבלת נתונים גלובליים');
    return {};
  }
};
