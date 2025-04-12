
import { Asset, MarketData } from '@/types/asset';

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
  
  coinIds.forEach(id => {
    result[id] = {
      id: id,
      name: id === 'bitcoin' ? 'Bitcoin' : id === 'ethereum' ? 'Ethereum' : 'Binance Coin',
      symbol: id === 'bitcoin' ? 'BTC' : id === 'ethereum' ? 'ETH' : 'BNB',
      price: id === 'bitcoin' ? 65000 : id === 'ethereum' ? 3400 : 580,
      marketCap: id === 'bitcoin' ? 1250000000000 : id === 'ethereum' ? 420000000000 : 89000000000,
      volume24h: id === 'bitcoin' ? 30000000000 : id === 'ethereum' ? 18000000000 : 2000000000,
      dominance: id === 'bitcoin' ? 45.2 : id === 'ethereum' ? 18.5 : 4.2,
      volume: id === 'bitcoin' ? 30000000000 : id === 'ethereum' ? 18000000000 : 2000000000,
      priceChange24h: id === 'bitcoin' ? 1500 : id === 'ethereum' ? 60 : 2.8,
      priceChangePercentage24h: id === 'bitcoin' ? 2.5 : id === 'ethereum' ? 1.8 : 0.5,
      priceChange7d: id === 'bitcoin' ? 3000 : id === 'ethereum' ? 120 : 5,
      priceChangePercentage7d: id === 'bitcoin' ? 4.8 : id === 'ethereum' ? 3.6 : 0.8,
      change24h: id === 'bitcoin' ? 2.5 : id === 'ethereum' ? 1.8 : 0.5,
      lastUpdated: new Date().toISOString()
    };
  });
  
  return result;
};
