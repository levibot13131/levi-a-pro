
import { toast } from 'sonner';

// Simulated trending coins data (in a real app this would come from CoinMarketCap API)
const MOCK_TRENDING_COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 68000, change24h: 2.3, marketCap: 1320000000000, volume24h: 25000000000, socialScore: 92, fundamentalScore: 85 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3400, change24h: 1.7, marketCap: 408000000000, volume24h: 15000000000, socialScore: 88, fundamentalScore: 82 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 145, change24h: 4.5, marketCap: 62000000000, volume24h: 5000000000, socialScore: 90, fundamentalScore: 79 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.45, change24h: -1.2, marketCap: 15800000000, volume24h: 450000000, socialScore: 75, fundamentalScore: 73 },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 6.2, change24h: 3.1, marketCap: 8500000000, volume24h: 320000000, socialScore: 72, fundamentalScore: 78 },
  // Add more mock trending coins...
];

/**
 * Get trending coins from CoinMarketCap
 * In a real app, this would make an API call to CoinMarketCap
 */
export const getTrendingCoins = async (limit = 50): Promise<any[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be:
  // const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${limit}`, {
  //   headers: {
  //     'X-CMC_PRO_API_KEY': 'YOUR_API_KEY'
  //   }
  // });
  // const data = await response.json();
  // return data.data;
  
  // For now, return mock data
  return MOCK_TRENDING_COINS.slice(0, limit);
};

/**
 * Get social mentions data
 */
export const getSocialMentionsData = async (coinId: string): Promise<any> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data - in a real app this would come from the API
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
 * In a real app, this would validate the API key
 */
export const initializeCoinMarketCap = (apiKey: string): boolean => {
  // Store the API key securely (in a real app)
  localStorage.setItem('coinmarketcap_api_key', apiKey);
  
  // Simulate validation
  const isValid = apiKey && apiKey.length > 10;
  
  if (isValid) {
    toast.success('התחברות ל-CoinMarketCap בוצעה בהצלחה');
    return true;
  } else {
    toast.error('מפתח API לא תקין');
    return false;
  }
};

/**
 * Check if CoinMarketCap API key is set
 */
export const isCoinMarketCapConnected = (): boolean => {
  const apiKey = localStorage.getItem('coinmarketcap_api_key');
  return !!apiKey && apiKey.length > 10;
};

/**
 * Get the CoinMarketCap API key
 */
export const getCoinMarketCapApiKey = (): string | null => {
  return localStorage.getItem('coinmarketcap_api_key');
};

/**
 * For real usage, here's how to set up the CoinMarketCap API
 */
export const getCoinMarketCapSetupInstructions = (): string => {
  return `
1. צור חשבון ב-CoinMarketCap: https://coinmarketcap.com/api/
2. הירשם לתוכנית Basic, Developer או Professional
3. צור מפתח API חדש
4. העתק את מפתח ה-API והזן אותו במערכת
  `;
};
