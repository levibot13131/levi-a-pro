
import { toast } from 'sonner';
import { 
  getSimplePrices, 
  getTrendingCoins, 
  validateCoinGeckoApiKey as validateApiKey,
  setCoinGeckoApiKey as setApiKey,
  removeCoinGeckoApiKey as removeApiKey,
  getCoinGeckoApiKey as getApiKey
} from '@/services/crypto/coinGeckoService';

// Constants
const COINGECKO_API_KEY_STORAGE = 'coingecko_api_key';

/**
 * Get CoinGecko API key from localStorage
 */
export const getCoinGeckoApiKey = (): string | null => {
  return getApiKey();
};

/**
 * Set CoinGecko API key
 */
export const setCoinGeckoApiKey = (apiKey: string): void => {
  setApiKey(apiKey);
};

/**
 * Clear CoinGecko credentials
 */
export const clearCoinGeckoCredentials = (): void => {
  removeApiKey();
};

/**
 * Test CoinGecko API connection
 */
export const testCoinGeckoConnection = async (apiKey?: string): Promise<boolean> => {
  try {
    // If API key is provided, validate it
    if (apiKey) {
      const isValidKey = await validateApiKey(apiKey);
      if (!isValidKey) {
        toast.error('מפתח API של CoinGecko לא תקין');
        return false;
      }
      
      // If valid, save it
      setCoinGeckoApiKey(apiKey);
      toast.success('התחברות ל-CoinGecko הצליחה');
      return true;
    }
    
    // If no API key provided, use existing key
    const existingKey = getCoinGeckoApiKey();
    if (!existingKey) {
      toast.error('אין מפתח API של CoinGecko');
      return false;
    }
    
    // Validate existing key
    const isValid = await validateApiKey(existingKey);
    if (isValid) {
      toast.success('התחברות ל-CoinGecko הצליחה');
      return true;
    } else {
      toast.error('מפתח API של CoinGecko לא תקין');
      return false;
    }
  } catch (error) {
    console.error('Error testing CoinGecko connection:', error);
    toast.error('שגיאה בבדיקת חיבור ל-CoinGecko');
    return false;
  }
};

/**
 * Validate CoinGecko API key
 */
export const validateCoinGeckoApiKey = async (apiKey: string): Promise<boolean> => {
  return await validateApiKey(apiKey);
};

/**
 * Get trending coins from CoinGecko
 */
export const getTopMarketCoins = async (limit: number = 50): Promise<any[]> => {
  try {
    const trending = await getTrendingCoins();
    return trending.slice(0, limit);
  } catch (error) {
    console.error('Error getting trending coins:', error);
    toast.error('שגיאה בקבלת מטבעות מובילים');
    return [];
  }
};

/**
 * Get market data for top coins
 */
export const getTopCoinsPrices = async (limit: number = 50): Promise<any> => {
  try {
    const coins = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano'];
    const currencies = ['usd', 'ils'];
    
    return await getSimplePrices(coins, currencies);
  } catch (error) {
    console.error('Error getting top coins prices:', error);
    toast.error('שגיאה בקבלת מחירי מטבעות מובילים');
    return {};
  }
};
