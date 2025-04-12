
import { toast } from 'sonner';

// ממשק לנתונים מ-CoinMarketCap
export interface CoinMarketCapData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  volume24h: number;
  marketCap: number;
  change1h: number;
  change24h: number;
  change7d: number;
  rank: number;
  lastUpdated: number;
  trending: boolean;
  availableOnBinance: boolean;
}

// שמירת המטבעות החמים האחרונים
let cachedTrendingCoins: CoinMarketCapData[] = [];
let lastFetchTime = 0;

/**
 * השג נתונים על מטבעות מ-CoinMarketCap
 * בפרויקט אמיתי, כאן היינו משתמשים ב-API האמיתי של CoinMarketCap
 */
export const fetchCoinMarketCapData = async (limit: number = 100): Promise<CoinMarketCapData[]> => {
  try {
    // בדיקה אם יש נתונים שכבר נשמרו במטמון ואם הם עדכניים (פחות מ-5 דקות)
    const now = Date.now();
    const isCacheValid = lastFetchTime > 0 && (now - lastFetchTime < 5 * 60 * 1000);
    
    if (isCacheValid && cachedTrendingCoins.length > 0) {
      return cachedTrendingCoins.slice(0, limit);
    }
    
    // בפרויקט אמיתי, כאן היינו מבצעים בקשת API אמיתית
    // עבור דמו, ניצור נתונים מדומים
    
    console.log('Fetching fresh CoinMarketCap data...');
    
    // מטבעות פופולריים בבינאנס
    const popularCoins = [
      { symbol: 'BTC', name: 'Bitcoin' },
      { symbol: 'ETH', name: 'Ethereum' },
      { symbol: 'BNB', name: 'Binance Coin' },
      { symbol: 'SOL', name: 'Solana' },
      { symbol: 'XRP', name: 'XRP' },
      { symbol: 'ADA', name: 'Cardano' },
      { symbol: 'AVAX', name: 'Avalanche' },
      { symbol: 'DOT', name: 'Polkadot' },
      { symbol: 'DOGE', name: 'Dogecoin' },
      { symbol: 'MATIC', name: 'Polygon' },
      { symbol: 'LTC', name: 'Litecoin' },
      { symbol: 'LINK', name: 'Chainlink' },
      { symbol: 'UNI', name: 'Uniswap' },
      { symbol: 'ATOM', name: 'Cosmos' },
      { symbol: 'ICP', name: 'Internet Computer' },
      { symbol: 'FIL', name: 'Filecoin' },
      { symbol: 'VET', name: 'VeChain' },
      { symbol: 'XLM', name: 'Stellar' },
      { symbol: 'ALGO', name: 'Algorand' },
      { symbol: 'ETC', name: 'Ethereum Classic' },
      { symbol: 'MANA', name: 'Decentraland' },
      { symbol: 'AXS', name: 'Axie Infinity' },
      { symbol: 'SAND', name: 'The Sandbox' },
      { symbol: 'NEAR', name: 'NEAR Protocol' },
      { symbol: 'FTM', name: 'Fantom' },
      { symbol: 'EGLD', name: 'Elrond' },
      { symbol: 'THETA', name: 'Theta Network' },
      { symbol: 'XTZ', name: 'Tezos' },
      { symbol: 'HBAR', name: 'Hedera' },
      { symbol: 'EOS', name: 'EOS' }
    ];
    
    // יצירת רשימת מטבעות מדומה עם נתונים אקראיים
    const coins: CoinMarketCapData[] = [];
    
    for (let i = 0; i < Math.max(limit, 50); i++) {
      const coinTemplate = popularCoins[i % popularCoins.length];
      const rank = i + 1;
      const isTrending = Math.random() > 0.7; // 30% מהמטבעות יסומנו כ"חמים"
      
      const coin: CoinMarketCapData = {
        id: coinTemplate.symbol.toLowerCase(),
        symbol: coinTemplate.symbol,
        name: coinTemplate.name,
        price: i < 5 ? 1000 + Math.random() * 50000 : 1 + Math.random() * 500,
        volume24h: 1000000 + Math.random() * 10000000000,
        marketCap: 10000000 + Math.random() * 500000000000,
        change1h: (Math.random() * 10) - 5, // -5% עד 5%
        change24h: (Math.random() * 20) - 10, // -10% עד 10%
        change7d: (Math.random() * 40) - 20, // -20% עד 20%
        rank,
        lastUpdated: now,
        trending: isTrending,
        availableOnBinance: true // לצורך הדמו, נניח שכל המטבעות זמינים בבינאנס
      };
      
      coins.push(coin);
    }
    
    // מיון לפי מטבעות חמים קודם, ואז לפי דירוג שוק
    coins.sort((a, b) => {
      if (a.trending && !b.trending) return -1;
      if (!a.trending && b.trending) return 1;
      return a.rank - b.rank;
    });
    
    // שמירה במטמון
    cachedTrendingCoins = coins;
    lastFetchTime = now;
    
    return coins.slice(0, limit);
  } catch (error) {
    console.error('Error fetching CoinMarketCap data:', error);
    toast.error('שגיאה בטעינת נתונים מ-CoinMarketCap');
    return [];
  }
};

/**
 * השג רק את המטבעות החמים (Trending)
 */
export const fetchTrendingCoins = async (limit: number = 10): Promise<CoinMarketCapData[]> => {
  const allCoins = await fetchCoinMarketCapData(100);
  return allCoins
    .filter(coin => coin.trending)
    .slice(0, limit);
};

/**
 * השג נתונים מקיפים על מטבע ספציפי
 */
export const fetchCoinDetails = async (coinId: string): Promise<CoinMarketCapData | null> => {
  const allCoins = await fetchCoinMarketCapData(100);
  return allCoins.find(coin => 
    coin.id.toLowerCase() === coinId.toLowerCase() || 
    coin.symbol.toLowerCase() === coinId.toLowerCase()
  ) || null;
};

/**
 * חפש מטבעות לפי שם או סמל
 */
export const searchCoins = async (query: string): Promise<CoinMarketCapData[]> => {
  if (!query || query.trim().length < 2) return [];
  
  const allCoins = await fetchCoinMarketCapData(100);
  const searchTerm = query.toLowerCase().trim();
  
  return allCoins.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm) || 
    coin.symbol.toLowerCase().includes(searchTerm)
  );
};

/**
 * רענן את המטמון ושאב נתונים חדשים
 */
export const refreshCoinMarketCapData = async (): Promise<void> => {
  lastFetchTime = 0; // מאלץ שאיבה מחדש
  await fetchCoinMarketCapData();
  toast.success('נתוני שוק הקריפטו התעדכנו בהצלחה');
};
