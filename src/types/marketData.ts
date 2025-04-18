
export interface MarketData {
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  lastUpdated: string;
  dominance?: number;
  priceChange24h?: number;
  priceChangePercentage24h?: number;
  priceChange7d?: number;
  priceChangePercentage7d?: number;
  volume?: number;
}

export interface MarketEvent {
  id: string;
  title: string;
  date: string;
  importance: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  reminder?: boolean;
}
