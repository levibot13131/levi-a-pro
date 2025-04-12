
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  rank: number;
  supply?: {
    circulating?: number;
    total?: number;
    max?: number;
  };
  description?: string;
  tags?: string[];
  socials?: {
    twitter?: string;
    telegram?: string;
    reddit?: string;
    github?: string;
  };
  website?: string;
  whitepaper?: string;
  icon?: string;
}

export interface AssetHistoricalData {
  id: string;
  name: string;
  symbol: string;
  timeframe: TimeframeType;
  data: {
    timestamp: number;
    price: number;
    volume?: number;
  }[];
  firstDate: number;
  lastDate: number;
}

export type TimeframeType = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '3m' | '1y';

export interface MarketData {
  marketCap: number;
  volume24h: number;
  dominance: number;
  totalSupply?: number;
  circulatingSupply?: number;
  maxSupply?: number;
  allTimeHigh?: number;
  allTimeHighDate?: string;
  priceChange24h: number;
  priceChangePercentage24h: number;
  priceChange7d?: number;
  priceChangePercentage7d?: number;
  priceChange30d?: number;
  priceChangePercentage30d?: number;
}
