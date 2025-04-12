export interface MarketData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  lastUpdated: string;
}

export interface MarketEvent {
  id: string;
  title: string;
  date: string;
  importance: 'high' | 'medium' | 'low';
  category: string;
  description: string;
}
