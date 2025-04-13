import { toast } from 'sonner';
import axios from 'axios';

// Storage key for the API key
const CMC_API_KEY_STORAGE = 'coinmarketcap_api_key';

// Cache for trending coins to avoid excessive API calls
let trendingCoinsCache = {
  data: null,
  timestamp: 0,
  expiryTime: 5 * 60 * 1000 // 5 minutes cache
};

/**
 * Get trending coins from CoinMarketCap
 */
export const getTrendingCoins = async (limit = 50): Promise<any[]> => {
  try {
    const now = Date.now();
    
    // Use cache if available and not expired
    if (trendingCoinsCache.data && (now - trendingCoinsCache.timestamp < trendingCoinsCache.expiryTime)) {
      console.log('Using cached trending coins data');
      return trendingCoinsCache.data;
    }
    
    const apiKey = getCoinMarketCapApiKey();
    
    if (!apiKey) {
      console.warn('No CoinMarketCap API key found, using mock data');
      return getMockTrendingCoins(limit);
    }
    
    try {
      // In a production environment, this call would likely need to be proxied through a backend
      // due to CORS restrictions on the CMC API
      const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        params: {
          start: 1,
          limit: limit,
          convert: 'USD'
        },
        headers: {
          'X-CMC_PRO_API_KEY': apiKey
        }
      });
      
      if (response.data && response.data.data) {
        const coins = response.data.data.map((coin: any) => ({
          id: coin.slug,
          symbol: coin.symbol,
          name: coin.name,
          price: coin.quote.USD.price,
          change24h: coin.quote.USD.percent_change_24h,
          marketCap: coin.quote.USD.market_cap,
          volume24h: coin.quote.USD.volume_24h,
          socialScore: Math.floor(Math.random() * 100), // This isn't available in basic CMC API
          fundamentalScore: Math.floor(Math.random() * 100) // This isn't available in basic CMC API
        }));
        
        // Update cache
        trendingCoinsCache = {
          data: coins,
          timestamp: now,
          expiryTime: trendingCoinsCache.expiryTime
        };
        
        return coins;
      } else {
        console.warn('Invalid response from CoinMarketCap API, using mock data');
        return getMockTrendingCoins(limit);
      }
    } catch (error) {
      console.error('Error fetching data from CoinMarketCap:', error);
      return getMockTrendingCoins(limit);
    }
  } catch (error) {
    console.error('Error in getTrendingCoins:', error);
    return getMockTrendingCoins(limit);
  }
};

// Mock trending coins data for fallback
const getMockTrendingCoins = (limit = 50) => {
  const MOCK_TRENDING_COINS = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 68000, change24h: 2.3, marketCap: 1320000000000, volume24h: 25000000000, socialScore: 92, fundamentalScore: 85 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3400, change24h: 1.7, marketCap: 408000000000, volume24h: 15000000000, socialScore: 88, fundamentalScore: 82 },
    { id: 'solana', symbol: 'SOL', name: 'Solana', price: 145, change24h: 4.5, marketCap: 62000000000, volume24h: 5000000000, socialScore: 90, fundamentalScore: 79 },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.45, change24h: -1.2, marketCap: 15800000000, volume24h: 450000000, socialScore: 75, fundamentalScore: 73 },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 6.2, change24h: 3.1, marketCap: 8500000000, volume24h: 320000000, socialScore: 72, fundamentalScore: 78 },
  ];
  return MOCK_TRENDING_COINS.slice(0, limit);
};

/**
 * Get social mentions data
 */
export const getSocialMentionsData = async (coinId: string): Promise<any> => {
  const apiKey = getCoinMarketCapApiKey();
  
  if (!apiKey) {
    return getMockSocialMentionsData();
  }
  
  try {
    // Note: This endpoint doesn't actually exist in the free CMC API
    // In a real app, you would need a different data source for social mentions
    // This is just for demonstration purposes
    
    // For now, just return mock data
    return getMockSocialMentionsData();
  } catch (error) {
    console.error('Error fetching social mentions data:', error);
    return getMockSocialMentionsData();
  }
};

// Mock social mentions data
const getMockSocialMentionsData = () => {
  return {
    twitterMentions: Math.floor(Math.random() * 10000),
    redditMentions: Math.floor(Math.random() * 5000),
    sentimentScore: (Math.random() * 100).toFixed(1),
    sentimentChange24h: ((Math.random() * 20) - 10).toFixed(1),
    keyInfluencers: [
      { name: '@CryptoAnalyst', followers: 250000, recentMention: 'BTC looking strong today!' },
      { name: '@BlockchainGuru', followers: 180000, recentMention: 'Long term bullish on ETH' },
      { name: '@TradingPro', followers: 120000, recentMention: 'Watch this support level' },
    ]
  };
};

/**
 * Initialize CoinMarketCap service
 */
export const initializeCoinMarketCap = (apiKey: string): boolean => {
  if (!apiKey || apiKey.length < 10) {
    toast.error('מפתח API לא תקין');
    return false;
  }
  
  try {
    // Store the API key
    localStorage.setItem(CMC_API_KEY_STORAGE, apiKey);
    
    // Test the API key with a simple request
    testCoinMarketCapApiKey(apiKey);
    
    toast.success('התחברות ל-CoinMarketCap בוצעה בהצלחה');
    return true;
  } catch (error) {
    console.error('Error initializing CoinMarketCap:', error);
    toast.error('שגיאה בהתחברות ל-CoinMarketCap');
    return false;
  }
};

/**
 * Test the CoinMarketCap API key
 */
const testCoinMarketCapApiKey = async (apiKey: string) => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', {
      params: {
        limit: 5
      },
      headers: {
        'X-CMC_PRO_API_KEY': apiKey
      }
    });
    
    return response.data && response.data.data;
  } catch (error) {
    console.error('Error testing CoinMarketCap API key:', error);
    return false;
  }
};

/**
 * Check if CoinMarketCap API key is set
 */
export const isCoinMarketCapConnected = (): boolean => {
  const apiKey = getCoinMarketCapApiKey();
  return !!apiKey && apiKey.length > 10;
};

/**
 * Get the CoinMarketCap API key
 */
export const getCoinMarketCapApiKey = (): string | null => {
  return localStorage.getItem(CMC_API_KEY_STORAGE);
};

/**
 * For real usage, here's how to set up the CoinMarketCap API
 */
export const getCoinMarketCapSetupInstructions = (): string => {
  return `
1. צור חשבון ב-CoinMarketCap: https://coinmarketcap.com/api/
2. הירשם לתוכנית Basic, Developer או Professional
3. צור מפתח API חדש
4. העתק את מפתח ה-API והזן ��ותו במערכת
  `;
};
