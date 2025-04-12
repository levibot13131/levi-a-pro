
export interface MarketData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  lastUpdated: string;
  dominance?: number; // Add the dominance property as optional
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
}
