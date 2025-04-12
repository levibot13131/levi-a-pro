import { Asset } from '@/types/asset';
import { MarketData } from '@/types/marketData';

// Fetch trending coins
export const fetchTrendingCoins = async (): Promise<Asset[]> => {
  // Mock implementation - would be replaced with actual API call
  return [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      type: 'crypto',
      price: 65000,
      change24h: 2.5,
      marketCap: 1250000000000,
      volume24h: 30000000000,
      rank: 1
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      type: 'crypto',
      price: 3400,
      change24h: 1.8,
      marketCap: 420000000000,
      volume24h: 18000000000,
      rank: 2
    },
    {
      id: 'binancecoin',
      name: 'Binance Coin',
      symbol: 'BNB',
      type: 'crypto',
      price: 580,
      change24h: 0.5,
      marketCap: 89000000000,
      volume24h: 2000000000,
      rank: 3
    }
  ];
};

// Fetch market data for specific coins
export const fetchMarketData = async (coinIds: string[]): Promise<Record<string, MarketData>> => {
  // Mock implementation - would be replaced with actual API call
  const result: Record<string, MarketData> = {};
  
  coinIds.forEach(coinId => {
    // Create market data object according to the MarketData interface
    result[coinId] = {
      name: coinId === 'bitcoin' ? 'Bitcoin' : coinId === 'ethereum' ? 'Ethereum' : 'Binance Coin',
      symbol: coinId === 'bitcoin' ? 'BTC' : coinId === 'ethereum' ? 'ETH' : 'BNB',
      price: coinId === 'bitcoin' ? 65000 : coinId === 'ethereum' ? 3400 : 580,
      marketCap: coinId === 'bitcoin' ? 1250000000000 : coinId === 'ethereum' ? 420000000000 : 89000000000,
      volume24h: coinId === 'bitcoin' ? 30000000000 : coinId === 'ethereum' ? 18000000000 : 2000000000,
      change24h: coinId === 'bitcoin' ? 2.5 : coinId === 'ethereum' ? 1.8 : 0.5,
      lastUpdated: new Date().toISOString(),
      dominance: coinId === 'bitcoin' ? 45.2 : coinId === 'ethereum' ? 18.5 : 4.2,
      volume: coinId === 'bitcoin' ? 30000000000 : coinId === 'ethereum' ? 18000000000 : 2000000000,
      priceChange24h: coinId === 'bitcoin' ? 1500 : coinId === 'ethereum' ? 60 : 2.8,
      priceChangePercentage24h: coinId === 'bitcoin' ? 2.5 : coinId === 'ethereum' ? 1.8 : 0.5,
      priceChange7d: coinId === 'bitcoin' ? 3000 : coinId === 'ethereum' ? 120 : 5,
      priceChangePercentage7d: coinId === 'bitcoin' ? 4.8 : coinId === 'ethereum' ? 3.6 : 0.8
    };
  });
  
  return result;
};
